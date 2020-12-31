const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
// const Combinatorics = require('js-combinatorics');

// var log4js = require('log4js');
const { sum } = require('lodash');
// const { count } = require('console');
// const prod = arr => arr.reduce((a,b) => a * b, 1);

// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    var mem_re = new RegExp("^mem.([0-9]*).$");

    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(line => {
        let [op, str] = line.split(" = ");
        if( op == "mask" ) {
            val = 0;
        } else {
            const match = op.match(mem_re);
            val = parseInt(match[1]);
            op = "mem"
        }
        // const arg = parseInt(str);
        return {op, val, str}
    });
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 14'.cyan);

const program = reader(filename);
console.log(program)

const memory = new Array(36).fill(0)

let mask = '';

for( let {op, val, str} of program ){
    if (op == "mask") {
        console.log("SET MASK:");
        console.log(str);
        mask = str;
    } else {
        let bits = (parseInt(str)).toString(2);
        bits = bits.padStart(36, '0')
        console.log(`SET MEM at ${val} to`, str)

        maskArr = mask.split('');
        bitsArr = bits.split('');

        console.log("bits:", bits)
        console.log("mask:", mask)

        const result = maskArr.map( (v,i) => v=='X' ? bitsArr[i] : v ).join('');
        console.log("resl:", result, parseInt(result, 2))
        memory[val] = parseInt(result, 2);
    }
}

console.log(memory);
console.log(sum(memory));
