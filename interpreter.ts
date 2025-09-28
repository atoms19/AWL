import type { FunctionCall, FunctionDefinition, IfStatement, Program, Statement, UnaryExpression, WhileStatement } from "./ast.ts"
import { Environment } from "./environment.ts"
import { debugMode } from "./main.ts"
import { standardFunctions } from "./standardFunctions.ts"

class ReturnEventError extends Error {
	val: any
	constructor(message: string, value: any) {
		super(message)
		this.val = value
		this.name = "ReturnEventError"
	}
}


export async function interpret(program: Program) {

	const global = new Environment()

	const interpretValue = async (val, env: Environment) => {
		if (val.type == "BinaryExpression") {
			return await interpretBinaryExpression(val, env)
		} else if (val.type == "UnaryExpression") {
			return await interpretUnaryExpression(val, env)

		} else if (val.type == "FunctionCall") {
			return await interpretFunctionCall(val, env)
		} else if (val.type == "FunctionDefinition") {
			return await interpretFunctionDefinition(val)
		}
		else if (val.type == "NumericLiteral") {
			return val.value
		} else if (val.type == "StringLiteral") {
			return val.value;
		} else if (val.type == "ArrayLiteral") {
			let arr = val.elements.map((el) => interpretValue(el, env))
			return Promise.all(arr)
		} else if (val.type == "Identifier") {
			if (debugMode) console.log(val.name, env, env.get(val.name))
			return env.get(val.name)
		} else if (val.type == "MemberExpression") {
			let identifier = await interpretValue(val.operand, env)
			let property = await interpretValue(val.property, env)
			if (!identifier[property]) {
				throw new Error(`Interpretter Error : Property ${property} does not exist on ${identifier}`)
			}
			if (val.isRange) {
				let end = await interpretValue(val.isRange.end, env)
				let step = (val.isRange.step) ? (await interpretValue(val.isRange.step, env)) : ((property < end) ? 1 : -1)
				let range: any[] = []
				let comparisonFn = (index: number, end: number) => {
					if (step > 0) {
						return index < end
					} else if (step < 0) {
						return index > end
					}
					return false;
				}
				for (let i = property; comparisonFn(i,end); i += step) {
					range.push(identifier[i])
				}
				if(typeof identifier=="string"){
								return range.join("")
				}

				return range;

			}

			return identifier[property]
		}

	}

	const interpretFunctionDefinition = async (fn: FunctionDefinition) => {
		global.define(fn.name, fn)
	}

	const interpretUnaryExpression = async (exp: UnaryExpression, env: Environment) => {
		let value = await interpretValue(exp.argument, env)
		switch (exp.operator) {
			case '-':
				return -value
			case '+':
				return +value
			case '!':
				return value ? 0 : 1
		}
	}
	const interpretBinaryExpression = async (exp, env: Environment) => {
		let right = await interpretValue(exp.right, env)
		let left = await interpretValue(exp.left, env)
		let operator = exp.operator

		switch (operator) {
			case '+':
				return left + right;
			case '-':
				return left - right;
			case '*':
				return right * left;
			case '/':
				return left / right
			case '^':
				return left ** right;
			case '%':
				return left % right;
			case '&&':
				if (left && right) return 1
				return 0;
			case '||':
				if (left || right) return 1
				return 0;
			case '==':
				return (left == right) ? 1 : 0;
			case '!=':
				return (left != right) ? 1 : 0;
			case '>':
				return (left > right) ? 1 : 0;
			case '<':
				return (left < right) ? 1 : 0;
			case '>=':
				return (left >= right) ? 1 : 0;
			case '<=':
				return (left <= right) ? 1 : 0;

		}
	}

	const interpretDeclaration = async (d, env: Environment) => {
		let v = await interpretValue(d.value, env)
		if (debugMode) console.log(env, env.get(d.identifier))
		env.define(d.identifier, v)

		if (debugMode) console.log(env, env.get(d.identifier))
	}

	const interpretFunctionCall = async (f: FunctionCall, env: Environment) => {
		let val = f.parameters.map(p => interpretValue(p, env))
		let params = await Promise.all(val)
		if (f.callee.name in standardFunctions) {
			return await standardFunctions[f.callee.name](...params)
		} else if (await env.get(f.callee.name)) {
			let fn = env.get(f.callee.name)
			let scope = new Environment(env)
			if (params.length == fn.parameters.length) {
				params.forEach((param, i) => {
					scope.define(fn.parameters[i], param)
				})
			} else {
				throw new Error(`Interpretter Error : function ${f.callee?.name} expects ${fn.parameters.length} arguments got ${params.length}`)
			}

			try {
				for (const stmt of fn.body) {
					await interpretBody(stmt, scope)
				}
			} catch (e: any) {
				if (e instanceof ReturnEventError) {
					return e.val
				}
			}
		} else {
			console.log(`Interpretter error : ${f.callee.name} is not a function`)
		}

	}

	const interpretAssignment = async (d, env: Environment) => {
		let v = await interpretValue(d.value, env)
		let prop = d.property ? await interpretValue(d.property, env) : null
		if (prop) {
				  let obj = env.get(d.identifier)
				  obj[prop] = v
				  env.set(d.identifier, obj)
				  return
	 }
		env.set(d.identifier, v)
	}

	const interpretIfStatenmet = async (statement: IfStatement, env: Environment) => {
		let condition = await interpretValue(statement.condition, env)
		let scope = new Environment(env)
		if (condition) {
			for (const stmt of statement.body) {
				await interpretBody(stmt, scope)
			}
		} else if (statement.elseBody) {
			for (const stmt of statement.elseBody) {
				await interpretBody(stmt, scope)
			}
		}
	}


	let broken = false
	const interpretWhileStatement = async (statement: WhileStatement, env: Environment) => {
		let scope = new Environment(env)
		while (await interpretValue(statement.condition, env) && !broken) {
			for (const stmt of statement.body) {
				await interpretBody(stmt, scope)
			}
		}
		broken = false
	}

	const interpretForStatement = async (statement: Statement, env: Environment) => {
		let scope = new Environment(env)
		if (statement.type != "ForStatement") throw new Error("Not a for statement")
		if (statement.end) {
			let start = await interpretValue(statement.iterable, env)
			let end = await interpretValue(statement.end, env)
			let step = (statement.step) ? await interpretValue(statement.step, env) : ((start < end) ? 1 : -1)
			let comparisonFn = (index: number, end: number) => {
				if (step > 0) {
					return index < end
				} else if (step < 0) {
					return index > end
				}
				return false;
			}

			for (let i = start; comparisonFn(i, end) && !broken; i += step) {
				scope.define(statement.iterator.name, i)
				for (const stmt of statement.body) {
					await interpretBody(stmt, scope)
				}
			}
		} else {
			let iterable = await interpretValue(statement.iterable, env)
			if (!Array.isArray(iterable)) throw new Error("Not an array")
			for (const item of iterable) {
				if (broken) break
				scope.define(statement.iterator.name, item)
				for (const stmt of statement.body) {
					await interpretBody(stmt, scope)
				}
			}
			broken = false
		}

	}

	const interpretBody = async (statement: Statement, env: Environment) => {
		if (statement.type == "Declaration") {
			await interpretDeclaration(statement, env)
		} else if (statement.type == "FunctionCall") {
			await interpretFunctionCall(statement, env)
		} else if (statement.type == "Assignment") {
			await interpretAssignment(statement, env)
		} else if (statement.type == "IfStatement") {
			await interpretIfStatenmet(statement, env)
		} else if (statement.type == "WhileStatement") {
			await interpretWhileStatement(statement, env)
		} else if (statement.type == "ForStatement") {
			await interpretForStatement(statement, env)

		} else if (statement.type == "ControlFlowStatement" && statement.keyword == "break") {
			broken = true
		} else if (statement.type == "ControlFlowStatement" && statement.keyword == "continue") {

		} else if (statement.type == "ReturnStatement") {
			let v = await interpretValue(statement.value, env)
			throw new ReturnEventError("Return statement encountered", v)
		}
		else {
			await interpretValue(statement, env)
		}
	}
	let programCount = 0

	while (programCount < program.body.length) {
		await interpretBody(program.body[programCount], global)
		programCount++
	}

	if (debugMode) console.log("memory", global);
}



