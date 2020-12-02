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

const parse = (line) => {
  // 5-8 w: wmwwwwpwlwllzwkcw
  const [_range, _letter, password] = line.split(' ');
  const [_low, _high] = _range.split('-');
  const low = parseInt(_low);
  const high = parseInt(_high);
  const letter = _letter[0];
  return { letter, low, high, password };
};

const policy1 = (password, letter, low, high) => {
  const re = new RegExp(letter, 'g')
  const match = password.match(re);
  const cnt = match ? match.length : 0;
  return (cnt >= low) && (cnt <= high);
}

const policy2 = (password, letter, pos1, pos2) => {
  const found = (pos) => password[pos-1] == letter ? 1 : 0;
  return 1 == (found(pos1) + found(pos2));
}

console.log('Day Two'.cyan);
console.log("filename =", filename.bold);
fs.readFile(filename, 'utf8', function(err, contents) {
  // console.log(">>",contents);
  let count1 = 0;
  let count2 = 0;
  const lines = contents.split("\n");
  lines.forEach(line => {
    const { letter, low, high, password } = parse(line);
    if (policy1(password,letter,low,high)) count1 += 1;
    if (policy2(password,letter,low,high)) count2 += 1;
  })

  console.log("policy1 = ", count1);
  console.log("policy2 = ", count2);

  assert(count1, 564);
  assert(count2, 325);
});
