import type { FunctionCall, FunctionDefinition, IfStatement, Program, Statement, UnaryExpression } from "./ast.ts"
import { debugMode } from "./main.ts"
import { standardFunctions } from "./standardFunctions.ts"

export async function interpret(program: Program) {
	const memory = new Map()
	const interpretValue = async (val) => {
		if (val.type == "BinaryExpression") {
			return await interpretBinaryExpression(val)
		} else if (val.type == "UnaryExpression") {
			return await interpretUnaryExpression(val)

		} else if (val.type == "FunctionCall") {
			return await interpretFunctionCall(val)
		}else if(val.type=="FunctionDefinition"){
		   return await interpretFunctionDefinition(val) 
		}
		else if (val.type == "NumericLiteral") {
			return val.value
		} else if (val.type == "StringLiteral") {
			return val.value;
		}else if(val.type == "ArrayLiteral"){
		   let arr=val.elements.map((el)=>interpretValue(el))
		   return Promise.all(arr)
		}else if (val.type == "Identifier") {
			if (memory.has(val.name)) {
				return memory.get(val.name)
			} else {
				console.log(`Interpretter error : ${val.name} is not defined`)
			}
		}
	}

	const interpretFunctionDefinition = async (fn:FunctionDefinition)=>{
     memory.set(fn.name,fn) 
	}

	const interpretUnaryExpression = async (exp: UnaryExpression) => {
		let value = await interpretValue(exp.argument)
		switch (exp.operator) {
			case '-':
				return -value
			case '+':
				return +value
			case '!':
				return value ? 0 : 1
		}
	}
	const interpretBinaryExpression = async (exp) => {
		let right = await interpretValue(exp.right)
		let left = await interpretValue(exp.left)
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

	const interpretDeclaration = async (d) => {
		let v = await interpretValue(d.value)
		memory.set(d.identifier, v)
	}

	const interpretFunctionCall = async (f:FunctionCall) => {
		let val = f.parameters.map(p => interpretValue(p))
		let params = await Promise.all(val)
		if (f.callee.name in standardFunctions) {
			return await standardFunctions[f.callee.name](...params)
		}else if(await memory.get(f.callee.name)){
				  let fn=memory.get(f.callee.name)
				  let fnmemory=new Set()
				  for(const stmt of fn.body){
					 await interpretBody(stmt)
				  }


		}else {
			console.log(`Interpretter error : ${f.callee.name} is not a function`)
		}

	}

	const interpretAssignment = async (d) => {
		if (memory.get(d.identifier) == undefined) {
			console.log(`Interpretter error : trying to reassign to an undeclared variable ${d.identifier}`)
			return
		}
		let v = await interpretValue(d.value)
		memory.set(d.identifier, v)
	}

	const interpretIfStatenmet = async (statement: IfStatement) => {
		let condition = await interpretValue(statement.condition)
		if (condition) {
			for (const stmt of statement.body) {
				await interpretBody(stmt)
			}
		} else if (statement.elseBody) {
			for (const stmt of statement.elseBody) {
				await interpretBody(stmt)
			}
		}
	}

	const interpretBody = async (statement: Statement) => {
		if (statement.type == "Declaration") {
			await interpretDeclaration(statement)
		} else if (statement.type == "FunctionCall") {
			await interpretFunctionCall(statement)
		} else if (statement.type == "Assignment") {
			await interpretAssignment(statement)
		} else if (statement.type == "IfStatement") {
			await interpretIfStatenmet(statement)
		}else if (statement.type == "WhileStatement") {
		while (await interpretValue(statement.condition)) {
				for (const stmt of statement.body) {
					await interpretBody(stmt)
				}
		}
		}else {
			await interpretValue(statement)
		}
	}
	let programCount = 0

	while(programCount<program.body.length) {
		await interpretBody(program.body[programCount])
		programCount++
	}

	if (debugMode) console.log("memory", memory, memory.get('s'));
}



