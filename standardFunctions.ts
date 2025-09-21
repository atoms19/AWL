import Readline from "node:readline"
import {debugMode} from "./main.ts"

const executeOutput = (...values) => {
  console.log(...values)
}


const executeInput = async (...values) => {
	let r = Readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	return new Promise((resolve) => {
		r.question(values[0], (v) => {
			r.close()
			resolve(v)
		})
	})

}

const convertToInteger = (value)=>{
  let num = Number(value)
	if(isNaN(num)){
		throw new Error(`Runtime error: Cannot convert ${value} to integer`)
	}
	return Math.floor(num)
}

const convertToFloat = (value)=>{
  let num = Number(value)
	if(isNaN(num)){
		throw new Error(`Runtime error: Cannot convert ${value} to float`)
	}
	return num
}

const arrayInsertAt=(index,arr,value)=>{
  if(!Array.isArray(arr)){
		throw new Error(`Runtime error: First argument must be an array`)
	}
	if(typeof index!=="number" || index<0 || index>arr.length || !Number.isInteger(index)){
		throw new Error(`Runtime error: Index must be a valid non-negative integer within array bounds`)
	}
	arr.splice(index,0,value)
	if(debugMode) console.log(`Inserted ${value} at index ${index} in array. New array:`, arr)
	return arr
}
const arrayInsert=(arr,value)=>{
  if(!Array.isArray(arr)){
		throw new Error(`Runtime error: First argument must be an array`)
	}
	arr.push(value)
	if(debugMode) console.log(`Pushed ${value} to array. New array:`, arr)
	return arr
}

const arrayGet=(index,arr)=>{
  if(!Array.isArray(arr)){
		throw new Error(`Runtime error: Second argument must be an array`)
	}
	if(typeof index!=="number" || index<0 || index>=arr.length || !Number.isInteger(index)){
		throw new Error(`Runtime error: Index must be a valid non-negative integer within array bounds`)
	}
	return arr[index]
}

const arraySet = (index,arr,value)=>{
   if(!Array.isArray(arr)){
		throw new Error(`Runtime error: Second argument must be an array`)
	}
	if(typeof index!=="number" || index<0 || index>=arr.length || !Number.isInteger(index)){
		throw new Error(`Runtime error: Index must be a valid non-negative integer within array bounds`)
	}
	arr[index]=value
	if(debugMode) console.log(`Set index ${index} in array to ${value}. New array:`, arr)
	return arr
}

const arrayLength =(arr)=>{
   if(!Array.isArray(arr)){
		throw new Error(`Runtime error: Argument must be an array`)
	}
	return arr.length
}

const toArray=(value:string)=>{
   return value.split('')
}

const arrayRemoveAt=(index,arr)=>{
	 if(!Array.isArray(arr)){
		throw new Error(`Runtime error: Second argument must be an array`)
	}
	if(typeof index!=="number" || index<0 || index>=arr.length || !Number.isInteger(index)){
		throw new Error(`Runtime error: Index must be a valid non-negative integer within array bounds`)
	}
	let removed = arr.splice(index,1)[0]
	if(debugMode) console.log(`Removed element at index ${index} from array. New array:`, arr)
	return removed
}

const toString =(value)=>{
   if(typeof value =="number"){
   return String(value)
	}else if (Array.isArray(value)){
		 return value.join('')
  }
}




export const standardFunctions = {
	 "printOut":executeOutput,
	 "getInput":executeInput,
	 "toInt":convertToInteger,
	 "toFloat":convertToFloat,
	 "toArray":toArray,
	 "toString":toString,
	 "arrayInsertAt":arrayInsertAt,
	 "arrayInsert":arrayInsert,
	 "arrayGet":arrayGet,
	 "arraySet":arraySet,
	 "arrayRemoveAt":arrayRemoveAt,
	 "arrayLength":arrayLength 
}



