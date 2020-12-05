const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const Combinatorics = require('js-combinatorics');

var log4js = require('log4js');
const { sum } = require('lodash');
const { count } = require('console');
const prod = arr => arr.reduce((a,b) => a * b, 1);

var logger = log4js.getLogger();
logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const [node, pgm, filename] = process.argv;

const convert = (text) => {
    let row = 0;
    for( i=0; i<7; i++ ){
        const n = 7-i;
        const v = 2**n;
        const a = text[i]==='F' ? 0 : v/2;
        row += a;
        // console.log(i, a, row, text[i]);
    }
    let col = 0;
    for( i=0; i<3; i++ ){
        const n = 3-i;
        const v = 2**n;
        const a = text[i+7]==='L' ? 0 : v/2;
        col += a;
        // console.log(i, a, col, text[i+7]);
    }

    return 8*row+col;
  }
  
  // tests
  assert(convert("FBFBBFFRLR"), 357);
  assert(convert("BFFFBBFRRR"), 567);
  assert(convert("FFFBBBFRRR"), 119);
  assert(convert("BBFFBBFRLL"), 820);

  let max = 0;
  let min = Infinity;
  let seats = new Array(8*128).fill(false);
  console.log('Day 5'.cyan);
  console.log("filename =", filename.bold);
  fs.readFile(filename, 'utf8', function(err, contents) {
    // console.log(">>",contents);
    const lines = contents.split("\n");
    lines.forEach(line => {
      // console.log("\ndatum", datum)
      const seat = convert(line);
      max = Math.max(max, seat);
      min = Math.min(min, seat);
      seats[seat] = true;
    });
  
    console.log("max = ", max);
    console.log("min = ", min);
    console.log(seats);

    for(i=min; i<max; i++){
        if( !seats[i] ) console.log(i);
    }
  });

