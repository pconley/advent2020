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

console.log('Day 6'.cyan);
console.log("filename =", filename.bold);
fs.readFile(filename, 'utf8', function(err, contents) {
  let any_total = 0;
  let every_total = 0;
  const groups = contents.split("\n\n");
  groups.forEach(group => {
    const passengers = group.split("\n");
    // console.log("text", texts)
    const counts = new Array(26).fill(0);
    passengers.forEach(passenger => {
        Array.from(passenger).forEach(letter => {
            counts[letter.charCodeAt(0) - 'a'.charCodeAt(0)] += 1;
        })
    });
    any_total += sum(counts.map(x => x>0?1:0));
    every_total += sum(counts.map(x => x===passengers.length?1:0));
  });
  console.log("any = ", any_total);
  console.log("every = ", every_total);

  assert(any_total, 6768);
  assert(every_total, 3489);
});
