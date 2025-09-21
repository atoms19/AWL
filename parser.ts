import type { Token } from "./lexer.ts"
import type { BinaryExpression, Declaration, Program, Statement } from "./ast.ts"
import { debugMode } from "./main.ts";

export function parse(tokens: Token[]) {
	let program: Program = {
		type: 'Program',
		body: []
	}

	let current = 0;
	const peek = (n: number) => {
		return tokens[current + n]
	}

	const yum = () => {
		if (current >= tokens.length) {
			throwParserError("unexpected end of line")
		}
		return tokens[current++]
	}

	const yumButOnly = (tokenType: string) => {
		if (current >= tokens.length) {
			throwParserError("unexpected end of line ");
		}
		let retrieved = tokens[current++]
		if (retrieved.type != tokenType) {

		}

	}

	const parseExpression = () => {
		return parse6Expression()
	}
	const parse7Expression = () => {
		let left: any = parse6Expression()
		while (peek(0) && (peek(0).data == "||")) {
			let op = yum().data
			let right = parse6Expression()
			left = {
				type: 'BinaryExpression',
				operator: op,
				left,
				right,
			} as BinaryExpression

		}
		return left
	}



	const parse6Expression = () => {
		let left: any = parse5Expression()
		while (peek(0) && (peek(0).data == "&&")) {
			let op = yum().data
			let right = parse5Expression()
			left = {
				type: 'BinaryExpression',
				operator: op,
				left,
				right,
			} as BinaryExpression

		}
		return left
	}

	//equality operators 
	const parse5Expression = () => {
		let left: any = parse4Expression()
		while (peek(0) && (peek(0).data == '==' || peek(0).data == '!=')) {
			let op = yum().data;
			let right = parse4Expression()
			left = {
				type: 'BinaryExpression',
				operator: op,
				left,
				right
			} as BinaryExpression

		}
		return left

	}
	//relational operators 
	const parse4Expression = () => {
		let left: any = parse3Expression()
		while (peek(0) && (["<=", "<", ">", ">="].includes(peek(0).data))) {
			let op = yum().data;
			let right = parse3Expression()
			left = {
				type: 'BinaryExpression',
				operator: op,
				left,
				right
			} as BinaryExpression

		}
		return left
	}


	const parse3Expression = () => {
		let left: any = parse2Expression()
		while (peek(0) && (peek(0).data == '+' || peek(0).data == '-')) {
			let op = yum().data;
			let right = parse2Expression()
			left = {
				type: 'BinaryExpression',
				operator: op,
				left,
				right
			} as BinaryExpression

		}
		return left

	}

	const parse2Expression = () => {
		let left: any = parseUnaryExpression()
		while (peek(0) && (peek(0).data == '*' || peek(0).data == '/' || peek(0).data == '%')) {
			let op = yum().data;
			let right = parseUnaryExpression()
			left = {
				type: 'BinaryExpression',
				operator: op,
				left,
				right
			} as BinaryExpression

		}
		return left
	}
	const parseUnaryExpression = () => {
		if (peek(0) && (peek(0).data == "!" || peek(0).data == "-")) {
			let op = yum().data
			return {
				type: "UnaryExpression",
				operator: op,
				argument: parseUnaryExpression()
			}
		}
		return parseBaseExpression()
	}

	const parseFunctionCall = () => {
		let callee = yum() //eating the function name;
		yum() //eating the opening bracket

		let nextToken = peek(0)
		let params: any[] = []
		while (nextToken && nextToken.type != "closingbracket") {
			if (nextToken.type == "commaseperator") {
				yum() //eat the commas and continue 
			}
			let param = parseExpression();

			params.push(param);
			nextToken = peek(0); //
		}
		yumButOnly("closingbracket");

		return {
			type: 'FunctionCall',
			callee: {
				type: 'Identifier',
				name: callee.data
			},
			parameters: [...params]
		}

	}

	const parseIfCondition = (): Statement => {
		yum() // eat the if keyword 
		yumButOnly('openingbracket')
		let expression = parseExpression();
		yumButOnly('closingbracket')
		let body = parseBlock()
		let elseBody: Statement[] = []
		yum()
		if (peek(0) && peek(0).type == "keyword" && peek(0).data == "else") {
			yum() //eat the else keyword	
			elseBody = parseBlock()
		}
		return {
			type: 'IfStatement',
			condition: expression,
			body: body,
			elseBody: (elseBody.length) ? elseBody : undefined
		}
	}

	const parseWhileLoop = (): Statement => {
		yum()
		yumButOnly("openingbracket")
		let expression = parseExpression()
		yumButOnly("closingbracket")
		yum()
		let body = parseBlock()
		yum()
		return {
			type: "WhileStatement",
			condition: expression,
			body: body
		}
	}

	const parseBlock = (): Statement[] => {
		let block: Statement[] = []
		while (peek(0) && peek(0).type != "closingcurlybracket") {
			let line = parseBody(peek(0))
			if (line) {
				block.push(line)
			}
		}
		return block
	}

	//parse functions 
	const parseBaseExpression = () => {
		let tk = peek(0)

		if (tk.type == "identifier" && peek(1) && peek(1).type == "openingbracket") {
			return parseFunctionCall();
		} else if (tk.type == "identifier") {
			return {
				type: 'Identifier',
				name: yum().data
			}
		} else if (tk.type == "numericliteral") {
			return {
				type: 'NumericLiteral',
				value: (peek(0).data.includes('.')) ? parseFloat(yum().data) : parseInt(yum().data)
			}
		} else if (tk.type == "openingbracket") {
			yum()
			let val = parseExpression()
			yum()
			return val
		} else if (tk.type == "stringliteral") {
			return {
				type: 'StringLiteral',
				value: yum().data
			}

		} else if (tk.type == "openingsquarebracket") {
			yum() //eat the opening square bracket
			let elements: any[] = []
			let nextToken = peek(0)
			while (nextToken && nextToken.type != "closingsquarebracket") {
				if (nextToken.type == "commaseperator") {
					yum() //eat the commas and continue 
				}
				let element = parseExpression();

				elements.push(element);
				nextToken = peek(0); //
			}
			yumButOnly("closingsquarebracket");
			return {
				type: "ArrayLiteral",
				elements: elements
			}
		}
		else {
			throwParserError(`unexpected Token ${JSON.stringify(tk)} found`)
		}
	}

	const throwParserError = (err: string) => {
		throw new Error(`❌ Error Occured:${err} at line ${peek(0)?.line || 'unknown'}`);
	}


	const parseDeclaration = (): Statement | undefined => {
		yum() //eating the declaration keyword 
		let idf = peek(0) //getting the identifier 
		yum() //eating the identifier 
		if (idf.type == "identifier") {
			let asg = peek(0)
			if (asg.type == "assignment") {
				yum() //eating the equaltosign
				return {
					type: 'Declaration',
					identifier: idf.data,
					value: parseExpression()
				}
			} else {
				throwParserError("expected assignment")
			}
		} else {
			throwParserError("expected identifier")
		}

	}

	const parseAssignment = (): Statement => {
		const varname = yum() //eating the identifier
		yum() // eating the equal to sign 

		return {
			type: 'Assignment',
			identifier: varname.data,
			value: parseExpression()
		}
	}

	const parseFunctionDefinition = (): Statement => {
		yum() //eating the define keyword
		let functionName = peek(0)
		yum() //eating the function name  
		yum() //eating the opening bracket
		let nextToken = peek(0)
		let params: any[] = []
		while (nextToken && nextToken.type != "closingbracket") {
			if (nextToken.type == "commaseperator") {
				yum() //eat the commas and continue 
			}
			let param = parseBaseExpression();
			params.push(param);
			nextToken = peek(0); //
		}
		yumButOnly("closingbracket");

		const body = parseBlock()
		return {
			type: "FunctionDefinition",
			name: functionName.data,
			body: body,
			parameters: params.map(p => {
				if (p.type != "Identifier") {
					throwParserError("function parameters must be identifiers")
				}
				return p.name
			})
		}
	}

	const parseControlFlow = (): Statement => {
		let keyword = yum().data //eat the keyword
		return {
			type: "ControlFlowStatement",
			keyword: keyword as 'break' | 'continue'
		}
	}

	const parseReturnStatement = (): Statement => {
		yum() // eat the return keyword 
		let val =peek(0)
		if(val.type=="closingcurlybracket"){
			return {
				type: "ReturnStatement",
				value:undefined
			}
		}
		let exp = parseExpression()
		return {
			type: "ReturnStatement",
			value: exp
		}
	}
	const parseBody = (token: Token): Statement | undefined => {
		switch (token.type) {
			case "keyword":
				switch (token.data) {
					case "declare":
						return parseDeclaration()
					case "if":
						return parseIfCondition()
					case "while":
						return parseWhileLoop()
					case "define":
						return parseFunctionDefinition()
					case "break":
					case "continue":
						return parseControlFlow() //eat the return keyword
					case "return":
						return parseReturnStatement()
					default:
						throwParserError(`unexpected keyword ${token.data} found`)
				}
				break;
			case "identifier":
				if (peek(1) && peek(1).type == "assignment") {
					return parseAssignment()
				} else {
					return parseExpression()
				}
			case "openingcurlybracket":
			case "closingcurlybracket":
				yum()
				return undefined
			default:
				return parseExpression()
		}
	}

	while (current < tokens.length) {
		let token = peek(0)
		let line = parseBody(token)
		if (line)
			program.body.push(line)
	}
	if (debugMode) console.log("parsed ✅")
	return program
}
