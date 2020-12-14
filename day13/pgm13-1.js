const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');

// _.clamp(number, lower, upper)  
// const Combinatorics = require('js-combinatorics');
// var log4js = require('log4js');
// const { sum } = require('lodash');
// const prod = arr => arr.reduce((a,b) => a * b, 1);
// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    const time = parseInt(lines[0])
    const departures = lines[1].split(",").filter(p => p !== 'x').map(p => parseInt(p));
    return {time, departures};
}

//*************************************************************************************
// 
//*************************************************************************************


//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;
console.log('Day 14'.cyan);
const {time, departures} = reader(filename)
console.log("INPUT\n", time, departures);

const waits = departures.map( d => d-(time%d) );
const m = Math.min(...waits);
console.log(m);

let bus = 0;
let min = Infinity;
departures.forEach(dep => {
    const w = dep - time%dep;
    console.log(dep, w, time+w);
    if (w < min) {
        min = w;
        bus = dep;
    }
})

console.log("resutl", bus, min, bus*min)


// Multiplying the bus ID by the number of minutes you'd need to wait

// console.log(938%7)
// assert(931%7 == 0);

// console.log(938%7)
// assert(938%7 == 0);

// console.log(945%7)
// assert(938%7 == 0);

// console.log(944%7)
// assert(944%7 == 1);

