export type Expression = BinaryExpression | UnaryExpression | NumericLiteral | FunctionCall 

export interface ExpressionStatement{
  type:'ExpressionStatement',
  expression:Expression
}

export interface FunctionDefinition{
  type:"FunctionDefinition",
  name:string,
  parameters?:string[],
  body:Statement[]
}

export interface Identifier{
  type:'Identifier',
  name:string,
}

export interface FunctionCall {
  type:'FunctionCall'
  callee:Identifier,
  parameters:Expression[]
}

export interface NumericLiteral{
  type:'NumericLiteral'
  value:number 
}


export interface BinaryExpression{
  type:'BinaryExpression',
  operator:string,
  right:Expression,
  left:Expression,
}
export interface UnaryExpression{
  type:'UnaryExpression',
  operator:string,
  argument:Expression

}
export interface Declaration {
  type:'Declaration',
  identifier:string,
  value:Expression
}

export interface Assignment {
  type:'Assignment',
  identifier:string,
  value:Expression
}

export interface IfStatement {
  type:'IfStatement',
  condition:Expression,
  body:Statement[],
  elseBody?:Statement[]
}

export interface WhileStatement {
  type:'WhileStatement',
  condition:Expression,
  body:Statement[]
}

export interface ControFlowStatement{
  type:'ControlFlowStatement',
  keyword:'break' | 'continue' 
  value?:Expression
}

export interface ReturnStatement{
  type:'ReturnStatement',
  value?:Expression
}
  
export type Statement = Declaration | ExpressionStatement | FunctionCall | Assignment  | IfStatement | WhileStatement | FunctionDefinition | ControFlowStatement | ReturnStatement

export interface Program{
  type:'Program',
  body: Statement[]
}
/*
Program
├── Declaration (a = 5)
│   └── NumericLiteral(5)
├── Declaration (b = 7)
│   └── NumericLiteral(7)
└── ExpressionStatement
    └── FunctionCall (print)
└── arguments[0] => BinaryExpression (+)
            ├── Identifier(a)
            └── Identifier(b)
*/
