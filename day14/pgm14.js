const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
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
    let addr = 0;
    var mem_re = new RegExp("^mem.([0-9]*).$");
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(line => {
        let [op, str] = line.split(" = ");
        if( op == "mask" ) {
            addr = 0;
        } else {
            const match = op.match(mem_re);
            addr = parseInt(match[1]);
            op = "mem"
        }
        return {op, addr, str}
    });
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 14'.cyan);

const program = reader(filename);
console.log(program)

let mask = '';
let total = 0;
const memory = [];

for( let {op, addr, str} of program ){
    if (op == "mask") {
        console.log("\nSET MASK:");
        console.log(str);
        mask = str;
    } else {
        console.log(`SET MEM at ${addr} to`, str)
        let address = addr.toString(2).padStart(36, '0')
        // apply mask to address to get the base pattern
        const maskArr = mask.split('');
        const base = maskArr.map( (v,i) => v=='0' ? address[i] : v ).join('');

        const apply = (addr, val) => {
            const i = addr.indexOf('X');
            if( i == -1 ){
                const m = parseInt(addr, 2);
                total -= memory[m] || 0;
                console.log("apply at", addr, m, "to", val, `[${memory.length}]`);
                memory[m] = val;
                total += val;
            } else {
                apply(addr.replaceAt(i, '0'), val);
                apply(addr.replaceAt(i, '1'), val);
            }
        }

        // recursively set base pattern addresses to value
        // and keep a running total in a global variable
        const val = parseInt(str);
        apply(base, val);
    }
}

console.log("total", total);
// assert(total == 208)
// assert(total == 2900994392308)
