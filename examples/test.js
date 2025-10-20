// waffle("Mandelbrot set visualiser written in Bussin X by SKM GEEK.")
console.log("Mandelbrot set visualiser written in Bussin X by SKM GEEK.");

/**
 * Calculates the escape time for a point in a Mandelbrot-like set.
 * (Corresponds to the 'bruh mandelbrot' function)
 */
function mandelbrot(real, imag) {
    // lit limit be 100 rn
    let limit = 100;
    
    // lit zReal be real rn
    // lit zImag be imag rn
    let zReal = real;
    let zImag = imag;

    // lit break be cap rn (using a more descriptive name)
    let loopActive = true;
    
    // lit return be limit rn (using a more descriptive name)
    let returnValue = limit;

    // yall (lit i be 0 rn i smol limit rn i plusplus)
    for (let i = 0; i < limit; i++) {
        // sus (break fr cap)
        if (loopActive) {
            // lit rtwo be zReal times zReal rn
            let rtwo = zReal * zReal;
            // lit itwo be zImag times zImag rn
            let itwo = zImag * zImag;

            // sus (rtwo plus itwo thicc 4)
            if (rtwo + itwo > 4) {
                // break be nocap
                loopActive = false;
                // return be i
                returnValue = i;
            } else { // impostor
                // zImag be 2 times zReal times zImag plus imag
                zImag = 2 * zReal * zImag + imag;
                // zReal be rtwo minus itwo plus real
                zReal = rtwo - itwo + real;
            }
        }
    }
    // Returns the last value assigned to 'returnValue'
    return returnValue;
}

// --- Main Script ---

// lit width be 150 rn
let width = 150;
// lit height be 50 rn
let height = 50;

// lit xstart be 0 minus (9 divided by 4) rn
let xstart = 0 - (9 / 4); // -2.25
// lit xfin be (1 divided by 4) rn
let xfin = (1 / 4); // 0.25
// lit ystart be 0 minus 1 rn
let ystart = -1;
// lit yfin be 1 rn
let yfin = 1;

// lit dx be (xfin minus xstart) divided by (width minus 1) rn
let dx = (xfin - xstart) / (width - 1);
// lit dy be (yfin minus ystart) divided by (height minus 1) rn
let dy = (yfin - ystart) / (height - 1);

// Build and print the top border
// This replaces the 'yall' loop that used 'format'
let borderH = "++" + "=".repeat(width) + "++";
console.log(borderH);

// yall (lit i be 0 rn i smol height rn i plusplus)
for (let i = 0; i < height; i++) {
    // lit line be "||${}"
    // We build the line progressively in JS
    let line = "||";

    // yall (lit j be 0 rn j smol width rn j plusplus)
    for (let j = 0; j < width; j++) {
        // x be xstart plus j times dx
        let x = xstart + j * dx;
        // y be ystart plus i times dy
        let y = ystart + i * dy;

        // value be mandelbrot(x,y)
        let value = mandelbrot(x, y);

        // This is the 'sus/impostor' chain
        if (value === 100) {
            line += " ";
        } else if (value > 50) {
            line += "-";
        } else if (value > 25) {
            line += "+";
        } else if (value > 10) {
            line += "o";
        } else if (value > 5) {
            line += "0";
        } else {
            line += "#";
        }
    }
    // line be format(line, "||")
    line += "||";
    // waffle(line)
    console.log(line);
}

// waffle(borderH)
console.log(borderH);
