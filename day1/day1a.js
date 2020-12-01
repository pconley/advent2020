const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const Combinatorics = require('js-combinatorics');

var log4js = require('log4js');
const { sum } = require('lodash');
const prod = arr => arr.reduce((a,b) => a * b, 1);

var logger = log4js.getLogger();
logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const [node, pgm, filename] = process.argv;

console.log('Day One'.cyan);
console.log("filename =", filename.bold);

fs.readFile(filename, 'utf8', function(err, contents) {

  let solution2 = 0;
  let solution3 = 0;

  // console.log(">>",contents);
  const lines = contents.split("\n");
  const values = lines.map( x => parseInt(x) );

  // Combinatorics code is simpler

  // const pairs = Combinatorics.bigCombination(values, 2);
  // while(a = pairs.next()) {
  //   if( sum(a) === 2020 ) console.log("found pair".red, a, prod(a));
  // }

  // const triples = Combinatorics.bigCombination(values, 3);
  // while(a = triples.next()) {
  //   if( sum(a) === 2020 ) console.log("found triple".red, a, prod(a));
  // }

  // But, this is 10x faster

  // if we only wanted the FIRST solution
  let found2 = false;
  let found3 = false;

  let count2 = 0;
  let count3 = 0;

  for (let i = 0; i < values.length; i++) {
    const v1 = values[i];
    for (let j = i+1; j < values.length; j++) {
      const v2 = values[j];
      const sum2 = v1 + v2;
      count2 += 1;
      if( sum2 === 2020 ) {
        found2 = true;
        solution2 = v1 * v2;
        console.log("pair".red, i, j, v1, v2, v1+v2, solution2);
      } else if( sum2 > 2020 ) {
        // skip the third values; can't be a solution
      } else /* less than 2020 */ {
        for (let k = j+1; k < values.length; k++) {
          count3 += 1;
          const v3 = values[k];
          if( sum2 + v3 === 2020 ) {
            found3 = true;
            solution3 = v1 * v2 * v3;
            console.log("triple".red, i, j, k, v1, v2, v3, v1+v2+v3, solution3);
          }
          if (found2 && found3) break;
        }
      }
      if (found2 && found3) break;
    }
    if (found2 && found3) break;
  }
  console.log("#values = ", values.length);
  console.log("op2 count = ", count2);
  console.log("op3 count = ", count3);

  assert(solution2, 539851)
  assert(solution3, 212481360)
});
