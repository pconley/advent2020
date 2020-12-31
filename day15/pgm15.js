const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { CLIENT_RENEG_LIMIT } = require('tls');
// const Combinatorics = require('js-combinatorics');

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

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
    const answer = parseInt(lines[0]);
    const numbers = lines[1].split(',').map(n => parseInt(n));
    return {answer, numbers};
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 14'.cyan);

const {answer, numbers} = reader(filename);
console.log(numbers);

const spokenSet = {}; // hmmmm.... not much faster than array
numbers.forEach((n,i) => spokenSet[n] = {prev:i+1, last:i+1} )

// const limit = 2020; // part 1
const limit = 30000000; // part 2

let zeroCount = 0;
let zeroSet = _.cloneDeep(spokenSet[0]);
console.log("zero set", zeroSet);

let unique = numbers.length;
let biggie = Math.max(...numbers);
let current = numbers.length;
let last = numbers[current-1];
while( current++ < limit ){
    const t = last==0 ? zeroSet : spokenSet[last];
    const speak = t.last - t.prev;
    if( speak == 0 ) zeroCount++;
    const tset = speak==0 ? zeroSet : spokenSet[speak];
    let prev = current;
    if (tset) {
        prev = tset.last;
        // console.log(`#${current} last=${last} was spoken in the past, so speak`, speak, tset);
        // spokenSet[speak] = {prev: tset.last, last: current};
    } else {
        unique += 1;
        // console.log(`#${current} last=${last} is NEW, so speak`, speak);
        // spokenSet[speak] = {prev: current, last: current};
    }

    if (speak == 0 ){
        zeroSet = {prev, last: current};
    } else {
        spokenSet[speak] = {prev, last: current};
    }

    biggie = Math.max(speak, biggie);

    if( current%100000 == 0 ){ 
        console.log(`${unique}::${biggie} step=${current}`, `${Math.floor(100*current/limit)}% done`, speak, zeroCount);
    }
    // console.log("bottom. we set", speak, "to", spokenSet[speak]);
    last = speak;
}

console.log("final last", last);
assert(last == answer)
