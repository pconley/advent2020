const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');

// _.clamp(number, lower, upper)

// const Combinatorics = require('js-combinatorics');

// var log4js = require('log4js');
const { sum } = require('lodash');
// const { count } = require('console');
// const prod = arr => arr.reduce((a,b) => a * b, 1);

// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(line => Array.from(line));
}

const row_as_string = row => {
    let str = "";
    for( let c=space.first_col; c<=space.last_col; c++){
        str += row[c] || '.';
    }
    return str;
}

const as_string = original => {
    let str = "";
    let plane = original || [];
    for( let r=space.first_row; r<=space.last_row; r++){
        const row = plane[r] || [];
        // console.log("row", row)

        str += `R${Math.abs(r)}: `+row_as_string(row)+'\n';
    }
    return str;
}

const print = (space) => {
    console.log(space.top, space.bottom)
    console.log(space.first_row, space.last_row)
    console.log(space.first_col, space.last_col)
    for( let z=space.top; z<=space.bottom; z++){
        // try {
        //     console.log("--- -1 1 0", space.region[-1][1][0], at(-1,1,0))
        // } catch {}
        console.log("\nz=", z, region);
        console.log(as_string(space.region[z]))
        // for( let r=space.first_row; r<=space.last_row; r++) {
        //     console.log(`R${r}`, space.region[z][r]);
        // }
    }
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 17'.cyan);

let space = { region: [] };

space.region[0] = reader(filename);
const {region} = space;

console.log("original",region)
space.top = 0;
space.bottom = 0;

space.first_row = 0;
space.last_row = region[0].length-1;

space.first_col = 0;
space.last_col = region[0][0].length-1;

print(space);

// const is_valid_p = (p) => p>=space.top && p<=space.bottom;
// const is_valid_r = (r) => r>=space.first_row && r<=space.last_row;
// const is_valid_c = (c) => c>=space.first_col && c<=space.last_col;
 
// const is_valid = (p,r,c) => is_valid_p(p) && is_valid_r(r) && is_valid_c(c);

const at = (p,r,c) => {
    const region = space.region;
    if( !region[p] ) return '.';
    if( !region[p][r] ) return '.';
    return region[p][r][c] || '.';
}

const set = (region,p,r,c,v) => {
    console.log("--- set", p,r,c,v);
    if (!region[p]) region[p] = [];
    if (!region[p][r]) region[p][r] = [];
    region[p][r][c] = v;
}

const around = (p, r, c) => {
    const results = [];
    // console.log("around", p, r, c);
    for( let i = -1; i <= 1; i++ ) {
        for( let j = -1; j <= 1; j++ ) {
            for( let k = -1; k <= 1; k++ ) {
                const [px, rx, cx] = [p+i, r+j, c+k]; 
                if( px==p && rx==r && cx == c ){
                    // skip same point
                } else {
                    results.push({p: px, r:rx, c:cx})
                }
            }
        }
    }
    return results;
}

const activeCount = (cubes) => {
    count = 0;
    // console.log(cubes)
    for( let cube of cubes ){
        const {p,r,c} = cube;
        if( at(p,r,c) == '#') {
            // console.log("found", p, r, c);
            count++;
        }
    }
    return count;
}

const a1 = around(0,3,1);
const c1 = activeCount(a1);
console.log("\n\n******* c1 = ", c1, a1.length);

round = 0;
while( round <= 5 ) {
    round ++;

    print(space);

    const region = _.cloneDeep(space.region);

    const {top, bottom} = space;
    const {first_row, last_row} = space;
    const {first_col, last_col} = space;

    for (let p=top-1; p<=bottom+1; p++) {
        console.log("");
        for (let r=first_row-1; r<=last_row+1; r++) {
            for (let c=first_col-1; c<=last_col+1; c++) {
                const cube = at(p,r,c);
                const active = activeCount(around(p,r,c));
                
                if( cube=='#' ){
                  // If a cube is active and exactly 2 or 3 of its neighbors are also active, 
                  // the cube remains active. Otherwise, the cube becomes inactive.
                  if(active==2 || active==3) {
                    // remains the same
                    console.log("stay active", p, r, c, cube, "active=", active);
                    set(region,p,r,c,'#');
                  } else {
                    console.log("set empty", p, r, c, cube, "active=", active);
                    set(region,p,r,c,'.');
                  }
                }

                if( cube=='.' ){
                    // If a cube is inactive but exactly 3 of its neighbors are active, 
                    // the cube becomes active. Otherwise, the cube remains inactive.
                    if (active==3 ){
                        console.log("set active", p, r, c, cube, "active=", active);
                        set(region,p,r,c,'#');
                    } else {
                        console.log("stay empty", p, r, c, cube, "active=", active);
                        set(region,p,r,c,'.');
                    }

                }
            }
        }
    }

    // try {
    //     console.log("==== -1 1 0", space.region[-1][1][0], at(-1,1,0))
    // } catch {}

    space.region = region;
    space.top -= 1;
    space.bottom++;

    space.first_row--;
    space.last_row++;

    space.first_col--;
    space.last_col++;

    print(space);
}

const {top, bottom} = space;
const {first_row, last_row} = space;
const {first_col, last_col} = space;
let total = 0;
for (let p=top-1; p<=bottom+1; p++) {
    for (let r=first_row-1; r<=last_row+1; r++) {
        for (let c=first_col-1; c<=last_col+1; c++) {
            if( at(p,r,c) == '#' ) total++;
        }
    }
}
console.log("total = ", total);


