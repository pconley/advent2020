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
    return lines.map(line => {
        const [op, str] = line.split(" ");
        const arg = parseInt(str);
        return {op, arg, visited: false}
    });
}

const exec = (_pgm) => {
    let cnt = 0;
    let acc = 0;
    let pos = 0;
    const pgm = _.cloneDeep(_pgm);
    const pgmlen = pgm.length;
    while( pgm[pos].visited == false ) {
        const { op, arg } = pgm[pos];
        pgm[pos].visited = true;
        switch (op) {
            case 'nop':
                pos += 1;
                break;
            case 'acc':
                pos += 1;
                acc += arg;
                break;
            case 'jmp':
                pos += arg;
                break;
            default:
                throw `pgm exec error at ${pos} op=${op}`;
        }
        // console.log(`after ${cnt}: [${pos}] :: ${op}, ${arg} => acc=${acc}, pos=${pos}`);
        if (pos == pgmlen) {
            // true... the prgm finished
            return [true, acc];
        }
        pos = pos % pgmlen;
        cnt += 1;
    }
    // false... did not finish execution
    return [false, acc];
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 8'.cyan);

const program = reader(filename);
// console.log(pgm);
const [status, result] = exec(program);
console.log("first result:", status, result);

let tries = 0;
for (let p=0; p<program.length; p++) {
    const { op } = program[p];
    if (op == 'nop' || op == 'jmp') {
        tries += 1;
        const copy = _.cloneDeep(program);
        copy[p].op = op == 'nop' ? 'jmp' : 'nop';
        const [state, res] = exec(copy);
        // console.log(cnt, p, "altered result:", state, res);
        if (state == true) {
            console.log(tries, "program finished with res=", res)
            assert(res, 1539); // post hoc confirmation
            break;
        }
    }
}
