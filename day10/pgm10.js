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

const is_valid = (arr, final) => {
    // the adapter arry is valid if the diff between
    // each pair is 1, 2, or 3
    current = 0;
    for(const a of arr){
        const diff = a - current;
        // console.log("diff", diff)
        if( diff > 3) return false;
        current = a;
    }
    const diff = final - current;
    return diff <= 3;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 10'.cyan);

const adapters = reader(filename).sort((a, b) => a - b)
console.log(adapters);

const device = Math.max(...adapters)+3;
console.log("device jolts = ", device);

/**** PART 1 */

let counts = [0, 0, 0];
let current = 0; // get it!
adapters.forEach(a => {
    const diff = a - current;
    // console.log(current, a, diff)
    counts[diff-1] += 1;
    current = a;
});
counts[2] += 1; // the device
console.log(counts);
let p = 1;
counts.forEach(c => {
    if( c>0 ) p *= c;
});
console.log("part 1 = ", p);
assert(p,1848);

/**** PART 2 */

const ways = [1]; // one way to get to zero

const calcWays = (n) => {
    let sum = 0;
    // is n an adapter (or the device)... 
    // then there is a way to get here which is
    // the sum of the ways to get to the previous 3 
    // values (assume previously calculated)
    if ( adapters.includes(n) || n==device ){
        sum += ways[n-1] || 0;
        sum += ways[n-2] || 0;
        sum += ways[n-3] || 0;
    }
    return sum
}

for( i=1; i<=device; i++ ){
    ways[i] = calcWays(i);
    // console.log(i, ":", ways[i], [ways[i-1],ways[i-2],ways[i-3]]);
}
console.log("device solution = ",ways[device])
