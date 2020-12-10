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
        return {op, arg}
    });
}

const NOP = 'nop';
const JMP = 'jmp';
const ACC = 'acc';

const nop = (arg, {acc, pos}) => ({acc, pos: pos+1});
const jmp = (arg, {acc, pos}) => ({acc, pos: pos+arg});
const acc = (arg, {acc, pos}) => ({acc: acc+arg, pos: pos+1});

const actions = {nop, acc, jmp};

const exec = (pgm) => {
    let state = { pos: 0, acc: 0 };
    const pgmlen = pgm.length;
    const visited = new Array(pgmlen).fill(false);
    while( visited[state.pos] === false ) {
        visited[state.pos] = true;
        const { op, arg } = pgm[state.pos];
        state = actions[op](arg, state);
        if (state.pos == pgmlen) {
            // true... the program reached end
            return [true, state.acc];
        }
        state.pos %= pgmlen;
    }
    // false... did not finish execution
    return [false, state.acc];
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 8'.cyan);

// Part One : run original program

const program = reader(filename);
// do not trust the exec to not alter the program
const [status, result] = exec(_.cloneDeep(program));
console.log("first result:", status, result);
assert(result, 1489);

// Part Two : alter the program NOP <-> JMP

let tries = 0;
for (let p=0; p<program.length; p++) {
    const { op } = program[p];
    if (op == NOP || op == JMP) {
        tries += 1;
        const copy = _.cloneDeep(program);
        copy[p].op = op == NOP ? JMP : NOP;
        const [status, result] = exec(copy);
        // console.log(cnt, p, "altered result:", state, res);
        if (status == true) {
            console.log(tries, "program finished with", status, result)
            assert(result, 1539); // post hoc confirmation
            break;
        }
    }
}
