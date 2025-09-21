# AWL Language Development Guide

This document outlines the implementation details of the AWL programming language and provides a roadmap for future features.

## Part 1: Core Language Implementation

This section covers the features we have implemented so far.

### 1. Asynchronous Input Handling

**Goal:** Prevent the interpreter from executing further statements while waiting for user input from the `input()` function.

**Implementation:**
- The `interpret` function was made `async`.
- The main statement execution loop was changed from `forEach` to a `for...of` loop to correctly handle `await`.
- All interpreter functions that could potentially call an async function (like `interpretValue`, `interpretBinaryExpression`, etc.) were made `async` and now use `await` for function calls.
- The `executeInput` function was modified to return a `Promise`, which resolves only when the user provides input.

### 2. Robust Lexer (Tokenization)

**Goal:** Allow for code to be written without spaces between tokens (e.g., `print("hi")` instead of `print ( "hi" )`).

**Implementation:**
- The `lexate` function was refactored to be character-aware instead of space-delimited.
- It now iterates character by character, grouping them into tokens based on their type (identifiers, numbers, strings, operators).
- It correctly handles multi-character operators (like `==` or `++`) by peeking ahead.

### 3. Variable Re-assignment

**Goal:** Allow changing the value of an already declared variable.

**Implementation:**
- We chose to implement re-assignment as a **statement**, not an expression, for simplicity and clarity.
- **AST:** A new `AssignmentStatement` node was added to `ast.ts`.
- **Parser:** The parser was taught to look for an `identifier` followed by an `=` sign at the statement level to create an `AssignmentStatement`.
- **Interpreter:** The interpreter handles this new statement by updating the value associated with the variable's name in the `memory` map.

### 4. Conditional Logic (`if/else`)

**Goal:** Add `if`, `else if`, and `else` statements to control the flow of execution.

**Implementation:**
- **Syntax:** We adopted the C-style `if (condition) { ... } else { ... }` syntax.
- **Lexer:** The keywords `if` and `else`, and the symbols `{` and `}` were added as new tokens.
- **AST:** Two new nodes, `IfStatement` and `BlockStatement`, were added to `ast.ts` to represent the conditional structure and code blocks.
- **Parser:** The parser was significantly refactored. A central `parseStatement()` function was created, which can be called recursively. This allows parsing statements inside the `{...}` blocks of `if/else` statements.
- **Interpreter:** An `interpretIfStatement` function was added. It evaluates the test condition and, based on the result, executes the `consequent` (if) block or the `alternate` (else/else if) block.

### 5. Expanded Operators

**Goal:** Add more expressive operators for logic and arithmetic.

**Implementation:**
- **Operators Added:**
  - Equality: `==`, `!=`
  - Unary: `-` (negation), `++` (pre-increment), `--` (pre-decrement)
- **Lexer:** The new operators were added to the `Operators` list.
- **AST:** The existing `BinaryExpression` and `UnaryExpression` nodes were used.
- **Parser:** Operator precedence was implemented by adding new functions to the expression parsing chain:
  1. `parseUnaryExpression` was added to handle high-precedence unary operators.
  2. `parseEqualityExpression` was added for `==` and `!=` at a lower precedence than arithmetic.
- **Interpreter:**
  - `interpretBinaryExpression` was updated to handle `==` and `!=`.
  - A new `interpretUnaryExpression` function was created to handle negation and the memory-modifying operations of `++` and `--`.

---

## Part 2: Future Features Roadmap

Here are some features you could add next to make AWL even more powerful.

### 1. Loops

Loops are essential for repeating tasks.

#### `while` Loops
**Syntax:** `while (condition) { ... }`
**Implementation:**
1.  **Lexer:** Add `while` to the `Keywords` array.
2.  **AST:** Create a `WhileStatement` node with a `test` expression and a `body` block statement.
3.  **Parser:** Create a `parseWhileStatement` function.
4.  **Interpreter:** Create an `interpretWhileStatement` function that continuously evaluates the `test` condition and executes the `body` as long as the condition is true.

#### `for` Loops
**Syntax:** `for (declare i = 0; i < 10; i = i + 1) { ... }`
**Implementation:**
1.  **Lexer:** Add `for` to the `Keywords` array.
2.  **AST:** Create a `ForStatement` node containing:
    - `initializer`: A declaration or expression statement.
    - `test`: An expression to evaluate each iteration.
    - `update`: An expression to run after each iteration.
    - `body`: A block statement.
3.  **Parser:** This is more complex. The `parseForStatement` function needs to parse the three parts within the parentheses, separated by semicolons.
4.  **Interpreter:** The `interpretForStatement` will first execute the `initializer`. Then, in a loop, it will evaluate the `test`, execute the `body`, and finally execute the `update` expression.

### 2. User-Defined Functions

Allowing users to create their own functions is a huge step.

**Syntax:** `define my_func(arg1, arg2) { ... return result }`
**Implementation:**
1.  **Lexer:** Add `define` and `return` to the `Keywords` array.
2.  **AST:**
    - `FunctionDeclaration`: Contains the function name, a list of parameter identifiers, and the function body.
    - `ReturnStatement`: Contains the expression to be returned.
3.  **Parser:**
    - `parseFunctionDeclaration` will parse the function signature and body.
    - `parseReturnStatement` will parse a return statement.
4.  **Interpreter & Scope:** This is a major addition.
    - You need a way to store function definitions.
    - When a function is called, you need to create a **new scope** for that function's execution. The arguments are passed into this new scope.
    - The `interpretFunctionCall` needs to be updated to handle user-defined functions, not just built-ins.
    - When a `return` statement is encountered, the function execution stops, and the value is returned to the caller.

### 3. More Data Types

#### Booleans
**Goal:** Introduce `true` and `false` as native boolean types.
**Implementation:**
1.  **Lexer:** Add `true` and `false` as keywords (or a new `boolealiteral` type).
2.  **AST:** Create a `BooleanLiteral` node.
3.  **Parser:** Parse `true` and `false` into `BooleanLiteral` nodes.
4.  **Interpreter:** Your `if` statements and logical operators (`&&`, `||`) should work with these native boolean values.

#### Arrays
**Goal:** Add list-like data structures.
**Syntax:** `declare my_list = [1, "hello", true]` and access with `my_list[0]`.
**Implementation:**
1.  **Lexer:** Add `[` and `]` as new tokens.
2.  **AST:**
    - `ArrayLiteral`: Contains a list of expressions.
    - `IndexExpression`: Contains the identifier being indexed and the index expression.
3.  **Parser:**
    - `parseArrayLiteral` will parse `[...]`.
    - `parseIndexExpression` will be part of `parseBaseExpression` and will trigger if an identifier is followed by `[`.
4.  **Interpreter:** The interpreter will represent arrays as native JavaScript/TypeScript arrays. It will need logic to handle getting and setting values at a specific index.

### 4. Comments

**Goal:** Allow for comments in the code that the interpreter will ignore.

**Syntax:**
- Single-line: `# This is a comment`
- Multi-line: `/* This is a multi-line comment */`

**Implementation:**
- This is almost purely a **Lexer** task. When the lexer encounters the start of a comment (`//` or `/*`), it should consume all characters until the end of the comment (`
` for single-line, `*/` for multi-line) and simply not produce a token.


#### current status 

- [x] Asynchronous Input Handling
- [x] Robust Lexer (Tokenization)
- [x] Variable Re-assignment
- [x] Conditional Logic (`if/else`)


expression structure 
- - precedence level 
        && || ==
        + -
        * / %
        number  identifier string opening brackets 
