import { lexate } from "./lexer.ts"
import { parse } from "./parser.ts"
import {interpret} from "./interpreter.ts"
import {readFile} from "node:fs/promises"


export let debugMode=process.argv.includes("--debug");
if(process.argv.length<3){
	 console.error("Usage: awl <source-file> [--debug]")
	 process.exit(1)
}
const program = await readFile(process.argv[2], { encoding: "utf-8" })
let token  =lexate(program)
if(debugMode) console.log(token)

let ast = parse(token)

if (debugMode) console.log(JSON.stringify(ast, null, 4))
interpret(ast)

//console.log("parsing complete")


