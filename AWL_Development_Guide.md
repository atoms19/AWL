# AWL Language Development Guide

This document outlines the implementation details of the AWL programming language and provides a roadmap for future features.

## Part 1: Core Language Implementation

This section covers the features we have implemented so far.
## 3. More Data Types

#### Booleans
**Goal:** Introduce `true` and `false` as native boolean types.
**Implementation:**
1.  **Lexer:** Add `true` and `false` as keywords (or a new `boolealiteral` type).
2.  **AST:** Create a `BooleanLiteral` node.
3.  **Parser:** Parse `true` and `false` into `BooleanLiteral` nodes.
4.  **Interpreter:** Your `if` statements and logical operators (`&&`, `||`) should work with these native boolean values.
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
