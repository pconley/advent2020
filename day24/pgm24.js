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

const offset = {
    'e':  {dx: 1, dy: 1, dz: 0},
    'w':  {dx:-1, dy:-1, dz: 0},
    'se': {dx: 1, dy: 0, dz:-1},
    'sw': {dx: 0, dy:-1, dz:-1},
    'ne': {dx: 0, dy: 1, dz: 1},
    'nw': {dx:-1, dy: 0, dz: 1},
}

const follow = (line) => {
    let pos = {x:0, y:0, z:0};
    // console.log(line.join(' '));
    for( let move of line ){
        const {dx, dy, dz} = offset[move];
        pos.x += dx;
        pos.y += dy;
        pos.z += dz;
    }
    // console.log("after follow", pos)
    return pos;
}

const getNeighborsCount = (key, tiles) => {
    const ns = getNeighborsOf(key);
    return sum(ns.map(n => {
        const color = tiles[n] || 'W';
        return color === 'B' ? 1 : 0;
    }));
}

const getNeighborsOf = (key) => {
    const keys = [];
    const {x, y, z} = JSON.parse(key);
    for( let k in offset ){
        const {dx, dy, dz} = offset[k];
        const npos = {x: x+dx, y: y+dy, z: z+dz};
        const nkey = JSON.stringify(npos);
        keys.push(nkey);
    }
    return keys;
}

const copy = (source) => {
    const target = [];
    Object.keys(source).forEach(k => {
        if( Array.isArray(source[k]) ) {
            target[k] = copy(source[k]);
        } else {
            target[k] = source[k];
        }
    });
    return target;
}

const apply = (key, tiles, temp, blacks) => {

    const b = getNeighborsCount(key, tiles);
    const color = tiles[key] || 'W';

    if( color === 'B' && (b==0 || b > 2) ){
        // Any black tile with zero or more than 2 black 
        // tiles immediately adjacent to it is flipped to white.
        // console.log(`flip ${key} to W [${b}]`);
        temp[key] = 'W';
        blacks.delete(key);
        
    } else if( color === 'W' && b === 2 ){
        // Any white tile with exactly 2 black tiles immediately 
        // adjacent to it is flipped to black.
        // console.log(`flip ${key} to B [${b}]`)
        temp[key] = 'B';
        blacks.add(key);
    }
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 24'.cyan);

let lines = reader(filename);

// console.log(lines.map(line => line.join(' ')).join('\n'));

let tiles = {};
let blacks = new Set();

for( let line of lines ){
    let pos = follow(line);
    const key = JSON.stringify(pos);
    const color = key in tiles ? tiles[key] : 'W';
    tiles[key] = color==='W' ? 'B' : 'W';
    if( tiles[key] === 'B' ) blacks.add(key);
}

console.log("part 1: inital count of black tiles = ", blacks.size);

for( let day=1; day<101; day++) {

    const temp = _.cloneDeep(tiles);
    const clone = _.cloneDeep(blacks);

    // only need to consider the black or their neighbors
    // note they may be considered more than once

    for (let key of blacks){
        apply(key, tiles, temp, clone);
        const neighbors = getNeighborsOf(key);
        neighbors.forEach(n => {
            apply(n, tiles, temp, clone);
        })
    }
    if( day<10 || day%10 == 0 ) console.log(`=== Day ${day} : ${blacks.size}`);
    tiles = temp;
    blacks = clone;
}

// === Day 100 : 2208 [5823]
// node pgm24.js data1  137.13s user 0.25s system 100% cpu 2:17.16 total

// === Day 100 : 2208 [2088]
// node pgm24.js data1  2.59s user 0.04s system 101% cpu 2.592 total
