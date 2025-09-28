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
toChar(x) // converts x to character (x : charcter code)
toCharCode(x) // converts x to character code (x : character)
```

basic datatypes in awl are Numeric , String , Array

### Comments in AWL
comments in awl are done with `#` for single line comments and 
`### ###` for multi line comments 

```awl
# this is a single line comment

###
this is a multi line comment
###
```

ooleans dont exist yet just use 0 and 1 for false and true

### Functions in AWL

### builtin functions
these are some of the builtin functions in awl

- `printOut(x)` : prints x to the console
- `getInput(x)` : takes input from the user and returns it as a string, x is the prompt message 
- `arrayLength(x)` : returns the length of x array
- `arrayInsert(x, value)` : inserts value to the end of array x
- `arrayInsertAt(index, value, x)` : inserts value at index of array x
- `arrayRemoveAt(index, x)` : removes the element at index from array x
string operations are expected to be done by converting them to array of characters

#### user defined functions
functions are declared using `define` keyword 
once defined a function can be called using its `name()` just like in other languages 

```awl
define add(a,b) {
    return a + b
}
declare result = add(20, 10) 
printOut(result) // prints 30
```

functions support `return` statement to return a value from the function
statements after return are not executed

only positional paramerters are supported as of now

### Control flow in AWL
control flow in awl is done using `if` ,`while` and `for` keywords 

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

`break` can be used to exit a loop , its behaviour for nested loops might be broken


#### for loops 
due to furstration of writing while loops i finally took my time to write for loops
for loops in awl is super simple they support ranges 

##### ranges 
```awl
for (i in 0 -> 10 ){
    printOut(i)
}
```
the above loop will print numbers from 0 to 9

ranges can also be descending
```awl
for (i in 10 -> 0 ){
    printOut(i)
}
```
the above loop will print numbers from 10 to 1

    
ranges can also be return values of functions 

```awl
for( i in  0 -> arrayLength(arr)){
    printOut(arrayGet(i, arr))
}
```
###### specifiying step in ranges 

you can also specify step in ranges using `by` keyword after the end value of the range 

```awl
for( i in 0 -> 10 by 2){
    printOut(i)
} 
```

ranges can be negative as well 

```awl
for( i in 10 -> 0 by -2){

    printOut(i)
} 
```
floating point steps are supported as well 

```awl
for( i in 0 -> 1 by 0.1){
    printOut(i)
}
```



##### iterators 
you can also iterate over arrays using for loops 

```awl
declare arr = [1,2,3,4,5]
for( item in arr) {
    printOut(item)
}
```

string iterations are easier now 

```awl
declare str = "hello"
for( char in toArray(str)) {
    printOut(char)
}
```

`break` and `continue` statements are supported in for loops as well

### Arrays in AWL

arrays are declared using square brackets 

```awl
declare arr = [1,2,3,4,5]
declare strArr = ["hello", "world"]
```

arrays can hold mixed datatypes as well ,including other arrays 

```awl
declare mixedArr = [1, "hello", 2.5, [1,2,3]]
```

arrays are dynamically sized , you can add or remove elements from them
you can access the elements from an array at any index using `<array-name>[index]` 

```awl
declare arr = [1,2,3,4,5]
printOut(arr[0]) #prints 1

```

you can also modify the elements at any index the same way by assigning to an index
```awl
declare arr = [1,2,3,4,5]
arr[0] = 10
printOut(arr[0]) #prints 10
```

#### array slicing 

arrays can be sliced using the same syntax we used in ranges 

```awl
declare arr = [1,2,3,4,5]
declare slicedArr = arr[1 -> 4] #slicedArr = [2,3]

```
you can also specify step in slicing 
```awl
declare arr = [1,2,3,4,5]
declare slicedArr = arr[0 -> 5 by 2] #slicedArr = [1,3,5]
```

### Strings in AWL
strings are declared using double quotes 

```awl
declare str = "hello world"
```

strings can be concatenated using `+` operator 

```awl
declare str1 = "hello"
declare str2 = "world"
declare str3 = str1 + " " + str2 #str3 = "hello world
```

strings can be accessed indexing just like arrays 

```awl
declare str = "hello"
printOut(str[0]) #prints h
```

strings are immutable , you cannot modify a character at an index
you can convert a string to an array of characters using `toArray()` function


#### string slicing 
strings can be sliced using the same syntax we used in ranges 

```awl
declare str = "hello world"
declare slicedStr = str[0 -> 5] #slicedStr = "hello"
```
you can also specify step in slicing
```awl
declare str = "hello world"
declare slicedStr = str[0 -> 11 by 2] #slicedStr = "hlowrd"
```
negative steps are supported for both array slicing as well as string slicing but awl does not have negative indexing 


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


## Syntax highlighting 

if you want syntax highlighting for awl in the best editor in the world 
you can use the file named `awl.vim` in the repo put it in your `~/.nvim/syntax/` folder
or `$VIMRUNTIME/syntax/` folder

and then run the following command to enable it 

```vim
:set syntax = awl
```


## Future Plans


- add proper support for break and continue statements
- add indexing support for arrays as well as strings


awl is supposed to be a typesafe language but as of now it isnt
i plan to add typesafety in the future 
along with a simple standard libary and support for obejct oriented paradigm


