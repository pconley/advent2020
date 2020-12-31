const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines.map(line => Array.from(line));
}

const row_as_string = row => {
    let str = "";
    for( let c=space.first_index; c<=space.last_index; c++){
        str += row[c] || '.';
    }
    return str;
}

const as_string = original => {
    let str = "";
    let plane = original || [];
    for( let r=space.first_index; r<=space.last_index; r++){
        const row = plane[r] || [];
        // console.log("row", row)

        str += `R${Math.abs(r)}: `+row_as_string(row)+'\n';
    }
    return str;
}

const print = (space) => {
    console.log(space.top, space.bottom)
    console.log(space.first_index, space.last_index)
    console.log(space.first_index, space.last_index)
    for( let z=space.top; z<=space.bottom; z++){
        // try {
        //     console.log("--- -1 1 0", space.region[-1][1][0], at(-1,1,0))
        // } catch {}
        console.log("\nz=", z, region);
        console.log(as_string(space.region[z]))
        // for( let r=space.first_index; r<=space.last_index; r++) {
        //     console.log(`R${r}`, space.region[z][r]);
        // }
    }
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 17'.cyan);

let space = { region: {} };

const data = reader(filename);
console.log(data);

space.top = 0;
space.bottom = 0;
space.first_index = 0;
space.last_index = data[0].length-1;

const {region} = space;
const {first_index, last_index} = space;

for (let r=first_index; r<=last_index; r++) {
    for (let c=first_index; c<=last_index; c++) {
        if( data[r][c] == '#' ){ 
            const cube = {p:0, w:0, r, c};
            const key = JSON.stringify(cube)
            region[key] = true;
            console.log("===", cube, key, region[key])

        }
    }
}
for( let key in space.region ){ 
    console.log(key);
}

const put = (title, p, w) => {
    console.log(title)
    const {first_index, last_index} = space;
    for (let r=first_index; r<=last_index; r++) {
        for (let c=first_index; c<=last_index; c++) {
            process.stdout.write(at(p,w,r,c));
        }
        console.log()
    }
}

const at = (p,w,r,c) => {
    const key = JSON.stringify({p,w,r,c});
    return space.region[key] === true ? '#' : '.';
}

const set = (region,p,w,r,c,v) => {
    const key = JSON.stringify({p,w,r,c});
    region[key] = v==='#';
}

const around = (p, w, r, c) => {
    const results = [];
    // console.log("around", p, r, c);
    for( let i = -1; i <= 1; i++ ) {
    for( let n = -1; n <= 1; n++ ) {
    for( let j = -1; j <= 1; j++ ) {
    for( let k = -1; k <= 1; k++ ) {
        const [px, rx, cx, wx] = [p+i, r+j, c+k, w+n]; 
        if( px==p && rx==r && cx == c && wx == w ){
            // skip same point
        } else {
            results.push({p:px, r:rx, c:cx, w:wx})
        }
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
        const {p,w,r,c} = cube;
        if( at(p,w,r,c) === '#') {
            count++;
        }
    }
    return count;
}

put("start",0,0);


round = 0;
while( round <= 5 ) { // 5
    round ++;

    const region = _.cloneDeep(space.region);

    const {top, bottom} = space;
    const {first_index, last_index} = space;

    for (let p=top-1; p<=bottom+1; p++) {
    for (let w=top-1; w<=bottom+1; w++) {
    for (let r=first_index-1; r<=last_index+1; r++) {
    for (let c=first_index-1; c<=last_index+1; c++) {

                const cube = at(p,w,r,c);
                const arr = around(p,w,r,c);
                const active = activeCount(arr);

                if( cube=='#' ){
                  // If a cube is active and exactly 2 or 3 of its neighbors are also active, 
                  // the cube remains active. Otherwise, the cube becomes inactive.
                  if(active==2 || active==3) {
                    // remains the same
                    // console.log("stay active", p, r, c, w, cube, "active=", active);
                    set(region,p,w,r,c,'#');
                  } else {
                    // console.log("set empty", p, r, c, w, cube, "active=", active);
                    set(region,p,w,r,c,'.');
                  }
                }

                if( cube=='.' ){
                    // If a cube is inactive but exactly 3 of its neighbors are active, 
                    // the cube becomes active. Otherwise, the cube remains inactive.
                    if (active==3 ){
                        // console.log("set active", p, r, c, w, cube, "active=", active);
                        set(region,p,w,r,c,'#');
                    } else {
                        // console.log("stay empty", p, r, c, w, cube, "active=", active);
                        set(region,p,w,r,c,'.');
                    }
                }
    }
    }
    }
    }

    space.region = region;
    space.top -= 1;
    space.bottom++;

    space.first_index--;
    space.last_index++;

    put(`0,0 After round ${round}`,0,-2);
}


let total = 0;
for( let key in space.region ) total +=  space.region[key]===true?1:0;
console.log("total = ", total);

assert( 848 == total ) // for the test data

