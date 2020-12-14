const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

// _.clamp(number, lower, upper)  
// const Combinatorics = require('js-combinatorics');
// var log4js = require('log4js');
// const { sum, includes } = require('lodash');
// const prod = arr => arr.reduce((a,b) => a * b, 1);
// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    console.log(lines[1]);
    const departures = lines[1].split(",").map(p => p === 'x' ? 1 : parseInt(p));
    return departures;
}

//*************************************************************************************
// 
//*************************************************************************************

const isValid = (value, data) => {
    for(i=0; i<data.length; i++){
        d = data[i];
        if( d>1 && (value+i)%d > 0 ) {
            console.log("failed on", d)
            return false;
        }
    }
    return true;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;
console.log('Day 14'.cyan);
const data = reader(filename)
// console.log("INPUT\n", data);

// const params = data.map((d,i) => d==1 ? null : {d, i}).filter(x=>x!=null);
// console.log("params", params);

let value = 0;
let depth = 0;
let inc = data[0];
while( depth < data.length-1 ) {
    // const {d, i} = data;
    value += inc;
    x = value+depth+1;

    if (x%data[depth+1] == 0 ){
        if (data[depth+1] > 1 ){
            console.log("x", data[depth+1], depth, inc, value, isValid(value, data));
            data.forEach( (r,i)=>{
                if( i>depth+1 && r>1 && (value+i)%r == 0) console.log("rem found", r)
            });
            inc *= data[depth+1];
            console.log("new inc", inc, "using", data[depth+1]);
        }
        depth += 1;
    }
}
console.log("value = ", value);

// const test = 101654014984641;
// console.log("is valid?", test, isValid(test, data))
// data.forEach((d,i) => {
//     if( d>1 ){
//         console.log(`${i}: ${d} = ${(test+i)%d}`)
//     }
// })

// data.forEach(x => {
//     if( x>1 ){
//         data.forEach(y => {
//             if( y>1 && x!=y && x>y ){
//                 console.log(`${x}%${y} = ${x%y}`)
//             }
//         });
//     }
// });

