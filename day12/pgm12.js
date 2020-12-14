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
    return lines.map(line => ({ dir: line.slice(0,1), dist: parseInt(line.slice(1)) }));
}

//*************************************************************************************
// 
//*************************************************************************************

const move = ({x,y}, dir, dist) => {
    switch(dir) {
        case 'E': return {x: x+dist, y};
        case 'W': return {x: x-dist, y};
        case 'S': return {x, y: y+dist};
        case 'N': return {x, y: y-dist};
        default : throw(`invalid direction ${dir}`)
    }
}

const shift = ({x,y}, w, n) => {
    // move pos by waypoint n times
    return {x: x+n*w.x, y: y+n*w.y}
}

const rotate = ({x,y}, dir, degrees) => {
    // rotate wavepoint around 0,0 for degrees
    let d = dir == 'R' ? 1 : -1;
    let rotation = (d * degrees + 360) % 360;
    switch(rotation){
        case 0: return {x,y};
        case 90: return {x: -y, y: x};
        case 180: return {x: -x, y: -y};
        case 270: return {x: y, y: -x};
        default : throw(`invalid degrees ${rotation}`)
    }
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;
console.log('Day 12'.cyan);
const rows = reader(filename)
// console.log("INPUT\n", rows);

let ship = {x: 0, y: 0}; // ship starts at the origin, so distance is easy
let waypoint = {x: 10, y: -1}; //The waypoint starts 10 units east and 1 unit north

rows.forEach(({dir, dist}) => {
    console.log("w=", waypoint, "pos=", ship, dir, dist);
    switch(dir){
        case 'F': 
            // move ship by waypoint n times
            ship = shift(ship, waypoint, dist); 
            break;
        case 'L': 
        case 'R': 
            // rotate wavepoint around origin for degrees
            waypoint = rotate(waypoint, dir, dist)
            break;
        default:
            // shift waypoint by direction
            waypoint = move(waypoint, dir, dist);
            break;
    }
    console.log("    ==> w is", waypoint, "ship is", ship);
})
console.log("final ship", ship)
const distance = Math.abs(ship.x)+Math.abs(ship.y);
console.log("distance", distance);
assert(27016 == distance);
