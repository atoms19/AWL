type token = 'keyword' | 'operator' | 'stringliteral' | 'numericliteral' | 'identifier' | 'assignment' | 'openingbracket' | 'closingbracket' | 'commaseperator' | 'openingcurlybracket' | 'closingcurlybracket' | 'Invalid' | 'openingsquarebracket' | 'closingsquarebracket';

export interface Token {
	type: token
	data: string,
	line: number,
	position: number
}

let Keywords: String[] = ["let","in", "fun", "if", "else", "while","return", "break", "continue","for","by","true", "false","null"]
let Operators: String[] = ["+", "-", "/", "*", "%", "^", "&&", "||", "==", ">", "<", "&", "|","!","!=","->"]



export function lexate(program: string): Token[] {

	let tokenTree: Token[] = []
	let lines = program.split('\n').filter(a => a.length != 0)

	//.forEach((line, lineNo) =>
	let ln = 0
	while (ln < lines.length) {
		let line = lines[ln]
		let lineNo = ln
		let i = 0;
		if(line.trim()=="###"){
		  ln++
		  line=lines[ln]
		  while(ln<lines.length && line.trim()!="###")
			 line=lines[ln++]
		  line=lines[--ln]
		}
		while (i < line.length) {
			let char = line[i];

			if (char.match(/[a-zA-Z_]/)) {
				let res = ''
				let tokenStart = i;
				while (i < line.length && line[i].match(/[a-zA-Z0-9_]/)) {
					res += line[i]
					i++;
				}
				tokenTree.push({
					data: res,
					type: assesToken(res) as token,
					line: lineNo,
					position: tokenStart
				})
			}
			else if (char.match(/[0-9]/)) {
				let res = ''
				let tokenStart = i;
				while (i < line.length && line[i].match(/[0-9\.]/)) {
					res += line[i]
					i++;
				}
				tokenTree.push({
					data: res,
					type: 'numericliteral',
					line: lineNo,
					position: tokenStart
				})
			}
			else if (char == '"') {
				let res = ''
				let tokenStart = i;
				i++; // Skip the opening quote
				while (i < line.length && line[i] != '"') {
					res += line[i]
					i++;
				}
				i++; // Skip the closing quote
				tokenTree.push({
					data: res,
					type: 'stringliteral',
					line: lineNo,
					position: tokenStart
				})
			}
			else if (Operators.includes(char) || (['=', '(', ')','[',']', ',', '!', '{', '}'].includes(char))) {
				let op = char;
				let validOperatorPairs = ["=", "&", "|", "<", ">", "!"];
				if ((['&', '|', '=', '<', '>', '!','-'].includes(op)) && (i + 1 < line.length) && (validOperatorPairs.includes(line[i + 1]))) {
					op += line[i + 1];
					i++;
				}
				tokenTree.push({
					data: op,
					type: assesToken(op) as token,
					line: lineNo,
					position: i
				})
				i++;
			}else if (char.match(/#/)) {
				while (i < line.length) {
					i++
				}
			}
			else if (char.match(/\s/)) {
				i++;
			} else {
				// skip unknown characters
				i++;
			}
		}
     ln++
	}
	return tokenTree
}

function assesToken(tk: string): string {

	if (Keywords.includes(tk)) {
		return "keyword"
	} else if (Operators.includes(tk)) {
		return "operator"
	} else if (tk.match(/^[0-9]/)) {
		return "numericliteral"
	} else if (tk.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
		return "identifier"
	} else if (tk == '=') {
		return "assignment"
	} else if (tk == "(") {
		return "openingbracket"
	} else if (tk == ")") {
		return "closingbracket"
	} else if (tk == ",") {
		return "commaseperator"
	} else if (tk == "{") {
		return "openingcurlybracket"
	} else if (tk == "}") {
		return "closingcurlybracket"
	}
	else if(tk=="["){
	  return "openingsquarebracket"
  }else if(tk=="]"){
		  return "closingsquarebracket"
  }
	return "Invalid"
}
