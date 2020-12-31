const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { title } = require('process');
const { sum, result } = require('lodash');
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

let trace = false;

const getNeighbors = (key, tiles) => {
    let b = 0;
    const {x, y, z} = JSON.parse(key);
    if (trace) console.log("look", x, y, z)

    for( let k in offset ){
        const {dx, dy, dz} = offset[k];
        const npos = {x: x+dx, y: y+dy, z: z+dz};
        const nkey = JSON.stringify(npos);
        const color = tiles[nkey] || 'W';
        if (trace) console.log("look", k, nkey, tiles[nkey], color)
        if( color === 'B' ) b++;
    }
    if (trace) console.log('-- found', b)
    return b;
}

const counter = (tiles, color='B') => {
    let count = 0;
    for( let key in tiles) {
        // console.log(key, tiles[key])
        if( tiles[key] == color) count++;
    }
    return count
}

const getRanges = (tiles) => {
    x0 = Infinity;
    xn = -Infinity;
    y0 = Infinity;
    yn = -Infinity;
    z0 = Infinity;
    zn = -Infinity;
    for( let key in tiles) {
        const {x, y, z} = JSON.parse(key);
        x0 = Math.min(x0, x);
        xn = Math.max(xn, x);
        y0 = Math.min(y0, y);
        yn = Math.max(yn, y);
        z0 = Math.min(z0, z);
        zn = Math.max(zn, z);
    }
    return {x0, xn, y0, yn, z0, zn};
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

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 24'.cyan);

let lines = reader(filename);

// console.log(lines.map(line => line.join(' ')).join('\n'));

let tiles = {};

const blacks = new Set();

for( let line of lines ){
    let pos = follow(line);

    const key = JSON.stringify(pos);
    const color = key in tiles ? tiles[key] : 'W';
    tiles[key] = color==='W' ? 'B' : 'W';

    // if( key in tiles ) {
    //     // console.log("revisit");
    //     tiles[key] = tiles[key]=='W' ? 'B' : 'W';
    // } else {
    //     // first visit... flip it
    //     tiles[key] = 'B';
    // }
}

console.log("part 1: inital count of black tiles = ",counter(tiles));

for( let day=1; day<101; day++) {
    const {x0, xn, y0, yn, z0, zn} = getRanges(tiles);
    const temp = _.cloneDeep(tiles);
    console.log("extant", (xn-x0) * (yn-y0) * (zn-z0), x0, xn, y0, yn, z0, zn);

    for(let x=x0-1; x<=xn+1; x++){
    for(let y=y0-1; y<=yn+1; y++){
    for(let z=z0-1; z<=zn+1; z++){
        const pos = {x, y, z};
        const key = JSON.stringify(pos);
        const b = getNeighbors(key, tiles);

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

        } else {
            // console.log("nada", key, color)
        }


    }}}
    console.log(`=== Day ${day} : ${counter(temp)} [${blacks.size}]`)
    tiles = temp;
}


// === Day 100 : 2208 [5823]
// node pgm24.js data1  137.13s user 0.25s system 100% cpu 2:17.16 total
