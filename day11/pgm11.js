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
    return lines.map(line => Array.from(line));
}

//*************************************************************************************
// 
//*************************************************************************************

const as_string = (rows) => rows.map(row => row.join('')).join('\n');

const occupied = (rows) => sum(rows.map(row => sum(row.map(seat=>seat=='#'?1:0))));

const is_valid_pos = (rows, {x,y}) => {
    const rowlen = rows.length;
    const collen = rows[0].length;
    return x>=0 && x<collen && y>=0 && y<rowlen;
};

const directions = [
    {x: -1, y: -1},
    {x: -1, y:  0},
    {x: -1, y:  1},
    {x:  1, y: -1},
    {x:  1, y:  0},
    {x:  1, y:  1},
    {x:  0, y: -1},
    {x:  0, y:  1},
]

const apply = (rows, p, d) => {
    const q = {x: p.x+d.x, y: p.y+d.y};
    return is_valid_pos(rows, q) ? q : null;
}

const visible = (rows, pos) => {
    let count = 0;
    directions.forEach(dir => {
        // apply the direction over and over until
        // we see a person, seat or we move off the floor
        p = apply(rows, pos, dir);
        while( p ){
            found = rows[p.y][p.x] == '#';
            if( rows[p.y][p.x] == '#' ){
                // occupied... count and stop
                count += 1;
                p = null;
            } else if(rows[p.y][p.x] == 'L') {
                // empty... stop
                p = null;
            } else {
                p = apply(rows, p, dir);
            }
        }
    })
    return count
}

const transform = (rows) => {
    let changed = true;
    let round = 0;
    while( changed ) {
        round ++;
        changed = false;
        // if( round > 3 ) break;
        const copy = _.cloneDeep(rows);
        rows.forEach((row, y) => {
            row.forEach((spot, x) => {
                const v = visible(rows, {x,y});
                if (spot == '.') {
                    // the floor
                } else if( spot == 'L') {
                    // empty seats that see no occupied seats become occupied,
                    if( v == 0 ){
                        copy[y][x] = '#';
                        changed = true;
                    }
                } else if( spot == '#' ) {
                    // it takes five or more visible occupied seats for an occupied seat to 
                    // become empty (rather than four or more from the previous rules). 
                    if( v>=5 ){
                        copy[y][x] = 'L';
                        changed = true;
                    }
                }
            })
        })
        // console.log("\nAFTER round", round, changed);
        // console.log(as_string(copy));
        rows = copy;
    }
    assert(round == 86);
    return rows;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;
console.log('Day 11'.cyan);
const rows = reader(filename).sort((a, b) => a - b)
// console.log("INPUT\n",as_string(rows));
const final = transform(rows);
console.log("seats occupied = ", occupied(final));
assert(occupied(final) == 2047)
