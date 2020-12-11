const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');

// _.clamp(number, lower, upper)

// const Combinatorics = require('js-combinatorics');

// var log4js = require('log4js');
const { sum } = require('lodash');
// const { count } = require('console');
// const prod = arr => arr.reduce((a,b) => a * b, 1);

// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(line => Array.from(line));
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 11'.cyan);

let rows = reader(filename).sort((a, b) => a - b)
const as_string = (rows) => rows.map(row => row.join('')).join('\n')
console.log(as_string(rows));

const rowlen = rows.length;
const collen = rows[0].length;

const is_valid = ({x,y}) => x>=0 && x<collen && y>=0 && y<rowlen;

const around = ({x, y}) => {
    const results = [];
    for( let i = -1; i <= 1; i++ ) {
        for( let j = -1; j <= 1; j++ ) {
            let pos = {x: x+j, y: y+i }
            if( pos.x==x && pos.y==y ){
                // not center
            } else if (is_valid(pos)) {
                results.push(pos)
            }
        }
    }
    return results;
}

const neighbors = (plan, pos) => {
    const nearby = around(pos);
    // console.log(nearby)
    return sum(nearby.map(({x,y}) => plan[y][x] == '#' ? 1 : 0))
}

let changed = true;
round = 0;
while( changed ) {
    round ++;
    changed = false;
    // if( round > 2 ) break;

    // console.log("\nBEFORE round", round);
    // plan does not change during round
    const copy = _.cloneDeep(rows);
    // console.log(as_string(copy));

    rows.forEach((row, y) => {
        row.forEach((spot, x) => {
            // console.log({x,y},spot);
            const n = neighbors(rows, {x,y});
            if (spot == '.') {
                // the floor
            } else if( spot == 'L') {
                // If a seat is empty (L) and there are no occupied seats adjacent to it, 
                // the seat becomes occupied.
                if( n == 0 ){
                    copy[y][x] = '#';
                    changed = true;
                }
            } else if( spot == '#' ) {
                // If a seat is occupied (#) and four or more seats adjacent to it are 
                // also occupied, the seat becomes empty.
                if( n>=4 ){
                    copy[y][x] = 'L';
                    changed = true;
                }
            }
        })
    })

    console.log("\nAFTER round", round, changed);
    console.log(as_string(copy));
    if( !changed ) break;
    rows = copy;
}

// console.log("\nFINAL");
// console.log(as_string(rows));
const count = sum(rows.map(row => sum(row.map(seat=>seat=='#'?1:0))));
console.log("rows=", rowlen)
console.log("cols=", collen)
console.log(round, "seats occupied = ", count);

// TESTS

// console.log(neighbors(rows, {x:1,y:1}));


// const device = Math.max(...adapters)+3;
// console.log("device jolts = ", device);

// /**** PART 1 */

// let counts = [0, 0, 0];
// let current = 0; // get it!
// adapters.forEach(a => {
//     const diff = a - current;
//     // console.log(current, a, diff)
//     counts[diff-1] += 1;
//     current = a;
// });
// counts[2] += 1; // the device
// console.log(counts);
// let p = 1;
// counts.forEach(c => {
//     if( c>0 ) p *= c;
// });
// console.log("part 1 = ", p);
// assert(p,1848);

/**** PART 2 */


// for( i=1; i<=device; i++ ){
//     ways[i] = calcWays(i);
//     // console.log(i, ":", ways[i], [ways[i-1],ways[i-2],ways[i-3]]);
// }
// console.log("device solution = ",ways[device])
