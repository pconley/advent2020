const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { title } = require('process');
const { sum, result } = require('lodash');
const { join } = require('path');
const Combinatorics = require('js-combinatorics');

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const tiles = contents.split("\n\n");

    return tiles.map(tile => {
        const lines = tile.split('\n');
        // Tile 2971:
        const parts = lines[0].split(' ');
        const num = parseInt(parts[1].slice(0,-1))
        // console.log(num, lines[0]);
        return {num, lines: lines.slice(1) }
    });
}

const convert = (border) => {
    const bins = border.replace(/\./g, "0").replace(/#/g, "1");
    // console.log(bins,parseInt(bins,2));
    return parseInt(bins,2);
}

const flip = (data) => {
    const result = {num: data.num, lines: data.lines.reverse()};
    return result;
}

const rotate = (tile) => {
    const {num, top, bottom, left, right } = tile;
    return{num: num, right: top, bottom: right, left: bottom, top: left };
}

const positions = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];

const isFull = (pattern) => {
    for(let pos of positions) if(pattern[pos[0]][pos[1]]===0) return false;
    return true;
}

const howFull = (pattern) => {
    count = 0
    for(let pos of positions) if(pattern[pos[0]][pos[1]]!==0) count++;
    return count;
}

const orientations = (tile) => {
    // return array of all orientations
    const f0 = toTile(flip(tile.data));
    const f1 = rotate(f0);
    const f2 = rotate(f1);
    const f3 = rotate(f2);
    const r0 = tile;
    const r1 = rotate(r0)
    const r2 = rotate(r1)
    const r3 = rotate(r2)
    return [r0,r1,r2,r3,f0,f1,f2,f3];
}

const isOk = (p) => p>=0 && p<=2
const isValid = (pos) => isOk(pos[0]) && isOk(pos[1])

const above = (pos) => {
    const a = [pos[0], pos[1]-1];
    return isValid(a) ? a : null;
}

const below = (pos) => {
    const a = [pos[0], pos[1]+1];
    return isValid(a) ? a : null;
}

const canFit = (pattern, pos, tile) => {
    if( pattern[pos[0]][pos[1]] !== 0 ) return false; // already full

    const a = above(pos)
    const at_a = a ? pattern[a[0]][a[1]] : null;
    if( a && at_a != 0 && at_a.bottom !== tile.top ) return false;

    const b = below(pos)
    const at_b = b ? pattern[b[0]][b[1]] : null;
    if( b && at_b != 0 && at_b.top !== tile.bottom ) return false;

    return true;
}

const as_str = (pattern) => pattern.map(row=>row.map(cell=>cell==0?0:cell.num).join(":"))

const extendPattern = (pattern, remaining) => {

    progress++;

    if( progress%10000 === 0) process.stdout.write(".");
    if( progress%1000000 === 0) console.log(progress);

    if (isFull(pattern)) {
        console.log("**** SOLUTION", pattern);
        process.exit(0);
    } 

    for( let pos of positions ){
        const value = pattern[pos[0]][pos[1]];
        if( value === 0 ){
            // pos is an empty position
            for( let r of remaining ){
                for( let o of orientations(r) ){
                    if( canFit(pattern, pos, o )) {
                        const patt = _.cloneDeep(pattern);
                        // console.log("setting at pos", pos);
                        patt[pos[0]][pos[1]] = o;
                        const remm = remaining.filter(x=>x.num!=r.num)
                        extendPattern(patt, remm);
                    }
                }
            }
        }
    } 
 }

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const toTile = (d) => {
    return {
        num: d.num,
        top: convert(d.lines[0]),
        left: convert(d.lines.map(x=>x[0]).join('')),
        right: convert(d.lines.map(x=>x[last]).join('')),
        bottom:  convert(d.lines[last]),
        data: d
    }
}

const [_node, _pgm, filename] = process.argv;

console.log('Day 20'.cyan);

const data = reader(filename);
const last = data[0].lines.length-1;
const tiles = data.map(d => toTile(d));

// console.log(tiles);

const pattern = [[0,0,0],[0,0,0],[0,0,0]];

let progress = 0;

// create legal rows
let count = 0;
const cmb = Combinatorics.combination(tiles, 3);
while(a = cmb.next()){ 
    console.log("a",count++, a.map(x=>x.num).join(':'));

    
}


