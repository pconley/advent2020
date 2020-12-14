const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { off } = require('process');

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
            // console.log("failed on", d)
            return false;
        }
    }
    return true;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;
console.log('Day 13'.cyan);
const data = reader(filename)

const params = data.map((d,i) => d==1 ? null : {d, i}).filter(x=>x!=null);
// console.log("params", params);

let value = 0;
let index = 0;
let inc = params[0].d;
while( index < params.length-1 ) {
    value += inc;
    // console.log("value=", value);
    const { d, i } = params[index+1];
    if( (value+i)%d == 0 ){
        // console.log("value meets next rule", value, value+i, d );
        inc *= d;
        // console.log("new inc", inc, "using", d);
        index += 1;
    }
}
console.log("final value = ", value);
