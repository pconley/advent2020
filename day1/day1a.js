
const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const Combinatorics = require('js-combinatorics');

var log4js = require('log4js');
const { sum } = require('lodash');
const prod = arr => arr.reduce((a,b) => a * b, 1);

var logger = log4js.getLogger();
logger.level = 'debug'; // trace; debug; info, warn; error; fatal

const [node, pgm, filename] = process.argv;

console.log('Day One'.cyan);
console.log("filename =", filename.bold);

// function calc(mass){
//   // take its mass, divide by three, round down, and subtract 2
//   return Math.floor(mass/3.0)-2
// }

// assert(calc(12),2)
// assert(calc(14),2)
// assert(calc(1969),654)
// assert(calc(100756),33585)


fs.readFile(filename, 'utf8', function(err, contents) {
  // console.log(">>",contents);
  const lines = contents.split("\n");
  const values = lines.map( x => parseInt(x) );

  // const pairs = Combinatorics.bigCombination(values, 2);
  // while(a = pairs.next()) {
  //   if( sum(a) === 2020 ) console.log("found".red, a, prod(a));
  // }

  // const triples = Combinatorics.bigCombination(values, 3);
  // while(a = triples.next()) {
  //   if( sum(a) === 2020 ) console.log("found".red,a, prod(a));
  // }

  // this appears to be 10x faster

  for (const v1 of values) {
    for (const v2 of values) {
      if( v1 + v2 === 2020 ) {
        console.log("pair", v1, v2, v1+v2, v1*v2);
      }
      for (const v3 of values) {
        if( v1 + v2 + v3 === 2020 ) {
          console.log("triple".red, v1, v2, v3, v1+v2+v3, v1*v2*v3);
        }
      }
    }
  }
});

// 539851
// 212481360
