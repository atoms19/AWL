
" Keywords
syntax keyword awlKeyword  for break in if else while for return let fun struct new include
highlight link awlKeyword Keyword


" Operators (from your Pratt parser precedence)
syntax match awlOperator /[-+*/%=&|<>!^~]+/
highlight link awlOperator Operator

" Numbers
syntax match awlNumber /\v\d+(\.\d+)?/
highlight link awlNumber Number

syntax keyword awlSpecial null true false 
highlight link awlSpecial Number 

" Strings
syntax region awlString start=+"+ end=+"+
highlight link awlString String

" Functions
syntax keyword awlFunction printOut toInt toFloat getInput toString toArray arrayInset arrayInsertAt arrayRemove arrayRemoveAt arrayLength  arraySet arrayGet toChar toCharCode 
highlight link awlFunction Function


" Comments
syntax match awlComment /#.*/ 
highlight link awlComment Comment

"Block comments
syntax region awlBlockComment start=+###+ end=+###+
highlight link awlBlockComment Comment

" Variables (identifiers)
syntax match awlVariable /\v[a-zA-Z_][a-zA-Z0-9_]*/
highlight link awlVariable Identifier
