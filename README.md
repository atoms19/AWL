# AWL 

AWl is a minialist interpreted programming language 
written in typescript , it aims to be simple and minimal with less 
syntactic sugar and more focus on the logic of the code.


## why AWL 
awl was made beacause i wanted to.
every stupid feature in this language is redundant and useless 
its just another langauge out there , its unoptimized and slow 

but its endless joy to write in it cause i built it from scratch
and i know every bit of it , and this would help me prototype some of those 
pesky dsa questions when i feel like giving up in every other langauge 


## HOW to use AWL 

awl has a binary executable in the repo , its just named awl

download the file and run it in your terminal give it a file that contains awl code

```bash
./awl yourfile.awl
```

its that easy youll see the output 

## syntax

### Hello world in AWL 

some of the awl syntax feels less in line with other languages and thats intentional to make it
stand out in a wierd way and some of it me just being wacky 

```awl
printOut("Hello World")
```


### Variables in AWL
variables are declared using the `declare` keyword 

```awl
declare x = 10
declare name = "vish"
```
variables are dynamically typed , you can reassign them as well

you can convert between types using the following functions 

```awl
toInt(x) // converts x to integer
toString(x) // converts x to string
toFloat(x) // converts x to float
toArray(x) // converts x to array
```

basic datatypes in awl are Numeric , String , Array
booleans dont exist yet just use 0 and 1 for false and true

### Functions in AWL

### builtin functions
these are some of the builtin functions in awl

- `printOut(x)` : prints x to the console
- `getInput(x)` : takes input from the user and returns it as a string, x is the prompt message 
- `arrayLength(x)` : returns the length of x array
- `arrayInsert(x, value)` : inserts value to the end of array x
- `arrayInsertAt(index, value, x)` : inserts value at index of array x
- `arrayRemoveAt(index, x)` : removes the element at index from array x
- `arrayGet(index, x)` : returns the element at index from array x
- `arraySet(index, value, x)` : sets the element at index of array x to value

string operations are expected to be done by converting them to array of characters

#### user defined functions
functions are declared using `define` keyword 
once defined a function can be called using its `name()` just like in other languages 

```awl
declare a=0
declare b=0
declare c=0

define add() {
    c= a + b
}
a=10
b=20
add()
printOut(c) // prints 30
```
in awl as of now version 0.1 user defined functions doesnt support parameters or return values


### Control flow in AWL
control flow in awl is done using `if` and `while` keywords 

```awl
declare x = 10
if (x > 5) {
    printOut("x is greater than 5")
}else if (x == 5) {
    printOut("x is equal to 5")
} 
else {
    printOut("x is less than 5")
}
```

```awl
declare i = 0
while (i < 10) {
    printOut(i)
    i = i + 1
}
```
 as of now awl doesnt support for loops or switch statements , nor break and continue statements 
they will be added soon 

### Operators in AWL

#### Arithmetic operators
- `+` : addition
- `-` : subtraction
- `*` : multiplication
- `/` : division
- `%` : modulus
- `^` : exponentiation

#### Comparison operators
- `==` : equal to
- `!=` : not equal to
- `>` : greater than
- `<` : less than
- `>=` : greater than or equal to
- `<=` : less than or equal to

#### Logical operators
- `&&` : logical and
- `||` : logical or
- `!` : logical not

### Comments in AWL
comments in awl are done with `#` for single line comments and 
`### ###` for multi line comments 

```awl
# this is a single line comment

###
this is a multi line comment
###
```


## Syntax highlighting 

if you want syntax highlighting for awl in the best editor in the world 
you can use the file named `awl.vim` in the repo put it in your `~/.nvim/syntax/` folder
or `$VIMRUNTIME/syntax/` folder

and then run the following command to enable it 

```vim
:set syntax = awl
```


## Future Plans

- add support for proper closures 
- add support for user defined function parameters and return values
- add support for for loops and switch statements
- add support for break and continue statements


awl is supposed to be a typesafe language but as of now it isnt
i plan to add typesafety in the future 
along with a simple standard libary and support for obejct oriented paradigm


