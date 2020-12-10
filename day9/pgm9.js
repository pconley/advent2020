const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
// const Combinatorics = require('js-combinatorics');

// var log4js = require('log4js');
// const { sum } = require('lodash');
// const { count } = require('console');
// const prod = arr => arr.reduce((a,b) => a * b, 1);

// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(line => parseInt(line));
}

const is_valid = (number, preamble) => {
    const size = preamble.length;
    // console.log("is valid?", number, preamble);
    for( i=0; i<size; i++) {
        for( j=i+1; j<size; j++) {
            if( preamble[i]+preamble[j] == number ){
                // console.log("yes", i, j, ":", number, "==", preamble[i], preamble[j])
                return true; 
            }
        }
    }
    return false;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 9'.cyan);

const numbers = reader(filename);
// console.log(numbers);

// note i added the size as the first number
const size = numbers[0]; 
console.log("size = ", size);

let target = 0;
let pos = size + 1;

while( pos < numbers.length ) {
    const preamble = numbers.slice(pos-size, pos);
    const valid = is_valid(numbers[pos], preamble);
    if (!valid) {
        target = numbers[pos]; // gottcha
        console.log(`at ${pos}: ${target} is invalid`);
        break;
    }
    pos += 1;
}
assert(target,177777905);

// find a contiguous set of at least two numbers in your 
// list which sum to the target number from step 1

console.log("target=", target);
let pos1 = 1;
while (pos1 < numbers.length) {
    let pos2 = pos1 + 1
    let sum = numbers[pos1] + numbers[pos2];
    while (sum < target) {
        pos2 += 1;
        sum += numbers[pos2];
    }
    if( sum == target ){
        const nums = numbers.slice(pos1, pos2+1);
        const min = Math.min(...nums);
        const max = Math.max(...nums);
        console.log("found", target, pos1, pos2, numbers.slice(pos1, pos2+1))
        console.log("---->", min, max, min+max)
        assert(min+max,23463012);
        break;
    }
    pos1 += 1;
}
