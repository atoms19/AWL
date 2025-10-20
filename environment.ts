export interface Environment {
	parent?: Environment
	memory: Map<string, any>,
}

export class Environment {

	constructor(parent?: Environment) {
		this.parent = parent
		this.memory = new Map<string, any>()
	}

	define(key: string, value: any) {
		this.memory.set(key, value)
	}

	hasKey(key:string) {
     if(this.memory.has(key)){
		 return this
	  }
	  if(this.parent){
		 return this.parent.hasKey(key)
	  }
	}

	set(key: string, value: any) {
		const env = this.hasKey(key)
		if(!env) 
			throw new Error("Interpretter Error: trying to reassign an undeclared variable " + key )
		 env.memory.set(key, value)
  }

	get(value: string) {
	   let scope = this.hasKey(value)
		if (!scope) 
			throw new Error("Interpretter Error: variable " + value + " is not defined.")
		return scope.memory.get(value)	
	}

	record() {
		let obj = Object.create(null)
		for (let [key, value] of this.memory) {
			if (value instanceof Environment) {
				obj[key] = value.record()
			} else {
				obj[key] = value
			}
		}
		return obj
	}
}

