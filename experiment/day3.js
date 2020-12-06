const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const Combinatorics = require('js-combinatorics');

// ************************************************************************
//
// ************************************************************************

const yargs = require('yargs');

const argv = yargs
  // .scriptName("node")
  .usage('Usage: node $0 [filename] --trace [level]')
  .option("t", {alias: "trace", default: 'info', describe: "tracing level: info, debug, trace"})
  .help()
  .argv

const index = parseInt(argv.trace);
const levels = ['off', 'fatal', 'error', 'warn', 'info', 'debug', 'trace'];
const level = isNaN(index) ? argv.trace : levels[index];

var log4js = require('log4js');
var log = log4js.getLogger();
log.level = level || 'info';

const [node, pgm, filename] = process.argv;

// ************************************************************************
// helpers
// ************************************************************************

const readfile = (fname) => {
  log.info("filename =", fname.bold);
  return fs
    .readFileSync(fname, 'utf8')
    .split("\n")
}

const { sum } = require('lodash');
const { count } = require('console');
const prod = arr => arr.reduce((a,b) => a * b, 1);

// ************************************************************************
// Mainline
// ************************************************************************

console.log('Day Three'.cyan);

const rows = readfile(filename);
const width = rows[0].length;
log.info(`rows = ${rows.length} rows x ${width} cols`);

let solution = 1;
const slopes = [{r: 1, d: 1},{r: 3, d: 1},{r: 5, d: 1},{r: 7, d: 1},{r: 1, d: 2}]

slopes.forEach((slope,s) => {
  let count = 0;

  pos = {x: -slope.r, y: -slope.d};
  while ( pos.y + 1 < rows.length ) {
    pos.x += slope.r; // right
    pos.y += slope.d; // down
    const { x, y } = pos;
    const _x = x % width;
    log.trace(_x, y, rows[y][_x], rows[y])
    if( rows[y][_x] === '#' ) count += 1;
  }
  
  log.info(`count= ${count} for`, slope);
  solution *= count;
})

console.log("solution = ", solution);

assert(solution, 3952146825);
