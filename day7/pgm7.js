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

const contains = (contents, target) => {
  if(!contents) return false;
  return contents.some(x => x.color === target);
}

let rules; // global

const mark = (contents, target) => {

  if (!contents) return false;

  let found = false;

  contents.forEach(x => {
    const { color, num } = x;
    const rule = rules.find(x => x.color === color);
    const index = rules.indexOf(rule);
    // console.log("  ", color, index)

    if (num == 0) {
      // terminating bag; ignore it

    } else if (rules[index].checked) {
      found |= rules[index].marked;

    } else if (contains(rules[index].contents,target)) {
      // contains the target, so mark it
      // console.log("marking1", color);
      rules[index].checked = true;
      rules[index].marked = true;
      found = true;

    } else {
      // go down to the next level
      // console.log("calling mark for", color)
      const f = mark(rule.contents, target);
      rules[index].checked = true;
      if (f) {
        // console.log("marking3", color);
        rules[index].marked = f;
      }
      found |= f;
    }
  });
  return found;
}

console.log('Day 6'.cyan);
console.log("filename =", filename.bold);
fs.readFile(filename, 'utf8', function(err, contents) {
  const lines = contents.split("\n");
  rules = lines.map(line => {
    // console.log(line)
    const [prefix, suffix] = line.slice(0,-1).split(" contain ");
    const clauses = suffix.split(", ");
    // console.log("rule:", [prefix], ":", clauses)
    const [p1, p2, bag] = prefix.split(" ");
    let xs = clauses.map( clause => {
      const [n, c1, c2, noun] = clause.split(" ");
      const num = n === "no" ? 0 : parseInt(n);
      const color = c1+' '+c2;
      return { color, num };
    })
    xs = (xs.length===1 && xs[0].num===0) ? null : xs;
    const rule = { color: p1+' '+p2, contents: xs, checked: false, marked: false };
    console.log(rule)
    return rule;
  });

  const target = "shiny gold";

  rules.forEach(rule => {
    // console.log("-- call mark for", rule.color);
    const found = mark(rule.contents, target);
    if (found) {
      // console.log("marking0", rule.color);
      rule.marked = true;
      rule.checked = true;
    }
  });

  // console.log(rules);
  // console.log(rules.map(r => r.marked?r.color:""));
  const count = sum(rules.map(r => r.marked?1:0));
  console.log("count of marked", count);

  const getTotal = (color) => {
    // console.log(color)
    let total = 0
    const rule = rules.find(x => x.color === color);
    if( !rule.contents ) return 0;
    for( const content of rule.contents ){
      total += content.num;
      total += content.num * getTotal(content.color)
    }
    return total;
  }

  const total = getTotal(target);
  console.log("total", total);

  // assert(any_total, 6768);
  // assert(every_total, 3489);
});
