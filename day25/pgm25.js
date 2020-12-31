const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { title } = require('process');
const { sum, result, keys } = require('lodash');
const { join } = require('path');

const parse = (line) => {
    // sesenwnenenewseeswwswswwnenewsewsw
    let pos = 0;
    const moves = [];
    while( pos < line.length ){
        const c1 = line.charAt(pos);
        if( c1 == 's' || c1 == 'n' ){
            moves.push(line.substring(pos,pos+2));
            pos += 2;
        } else {
            moves.push(c1);
            pos++;
        }
    }
    return moves;
}

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(s => parse(s));
}


//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 25!!!'.cyan);

// const card = 5764801; // example
// const door = 17807724; // example

const card = 10212254; // puzzle
const door = 12577395; // puzzle

console.log("door is", door);
console.log("card is", card);

const decode = (subject,target) => {
    console.log("apply:",subject,target)
    let value = subject;
    console.log("value:",value)
    for( i=2; i<2000000; i++ ){
        // Set the value to itself multiplied by the subject number.
        value *= subject;
        // Set the value to the remainder after dividing the value by 20201227.
        value %= 20201227;
        // console.log(i,"value:",value)
        if ( value == target ){
            console.log("target found at", i);
            return i;
        }
    }
}

const encode = (subject, n) => {
    let value = subject;
    for( i=1; i<n; i++ ){
        // Set the value to itself multiplied by the subject number.
        value *= subject;
        // Set the value to the remainder after dividing the value by 20201227.
        value %= 20201227;

        // console.log(i,"encode:",value)
    }
    return value;
}

const d = decode(7,door)
const c = decode(7,card)

console.log("d is", d);
console.log("c is", c);

const x1 = encode(door, c);
const x2 = encode(card, d);
console.log(x1, x2)
assert(x1 == x2)

// 14897079
