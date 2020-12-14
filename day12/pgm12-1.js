const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');

// _.clamp(number, lower, upper)

// const Combinatorics = require('js-combinatorics');

// var log4js = require('log4js');
const { sum } = require('lodash');
// const prod = arr => arr.reduce((a,b) => a * b, 1);

// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(line => ({ dir: line.slice(0,1), dist: parseInt(line.slice(1)) }));
}

//*************************************************************************************
// 
//*************************************************************************************

const move = ({x,y}, dir, dist) => {
    console.log("apply", {x,y}, dir, dist);
    switch(dir) {
        case 'E': return {x: x+dist, y};
        case 'W': return {x: x-dist, y};
        case 'S': return {x, y: y+dist};
        case 'N': return {x, y: y-dist};
        default : throw(`invalid direction ${dir}`)
    }
}

dirs = { N: 0, E: 90, S: 180, W: 270 };

const turn = (start, dir, change) => {
    let degrees = dirs[start];
    let d = dir == 'R' ? 1 : -1;
    let result = degrees + (d*change);
    result = result < 0 ? result+360 : result;
    result = result >= 360 ? result-360 : result;
    switch(result){
        case 0: return 'N';
        case 90: return 'E';
        case 180: return 'S';
        case 270: return 'W';
        default : throw(`invalid degrees ${result}`)
    }
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;
console.log('Day 12'.cyan);
const rows = reader(filename)
console.log("INPUT\n", rows);

let facing = 'E';
let start = {x: 0, y: 0};
let pos = start;

rows.forEach(({dir, dist}) => {
    console.log(facing, pos, dir, dist);
    switch(dir){
        case 'F': 
            pos = move(pos, facing, dist); 
            break;
        case 'L': 
        case 'R': 
            facing = turn(facing, dir, dist)
            break;
        default:
            pos = move(pos, dir, dist);
            break;
    }
    console.log("==>", facing, pos);
})
console.log("final pos", pos)
console.log("distance", Math.abs(pos.x)+Math.abs(pos.y))

assert(turn('N', 'L', 90) == 'W')
assert(turn('E', 'L', 90) == 'N')
assert(turn('E', 'R', 90) == 'S')
assert(turn('S', 'L', 180) == 'N')
assert(turn('W', 'R', 180) == 'E')

const same = (p1, p2) => p1.x==p2.x && p2.y==p2.y
console.log("\n move test",move({x:0,y:0}, 'E', 5))
assert(same(move({x:0,y:0}, 'E', 5), {x:5,y:0}));
