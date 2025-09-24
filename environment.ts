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

	set(key: string, value: any) {
		if (this.memory.has(key)) {
			this.memory.set(key, value)
		} else {
			let p = this.parent
			let found =false
			while (p) {
				if (p.memory.has(key)) {
					p.memory.set(key, value)
					found=true
				}
				p = p.parent
			}
			if(!found){
			  throw new Error("Interpretter Error: trying to reassign an undeclared variable "+key)
			 }
		}
	}

	get(value: string) {
		if (this.memory.has(value)) {
			return this.memory.get(value)
		} else {
			let p = this.parent
			while (p) {
				if (p.memory.has(value)) {
					return p.get(value)
				}
				p = p.parent
			}

			

	//	throw new Error("Interpretter error :"+value +"is not declared")
		}
	}
}

