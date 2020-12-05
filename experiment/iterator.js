const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const Combinatorics = require('js-combinatorics');

// _.range( start, end, step )

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
//
// ************************************************************************

function iterate(n, slope) {

  console.log(`\nITERATION: ${n}`, slope,'\n');

  _.range( 0, 32 ).forEach(i => console.log(i))

  let count = 0;
  pos = {x: -slope.r, y: -slope.d};
  while ( pos.y + 1 < rows.length ) {
    pos.x += slope.r; // right
    pos.y += slope.d; // down
    const { x, y } = pos;
    const _x = x % width;
    log.trace(count, _x, y, rows[y][_x], rows[y])
    if( rows[y][_x] === '#' ) count += 1;
  }
  console.log(`\ncount = ${count}`);
  return count;
}

// ************************************************************************
//
// ************************************************************************

let solution = 1;
let iteration = 0;

const slopes = [{r: 1, d: 1},{r: 3, d: 1},{r: 5, d: 1},{r: 7, d: 1},{r: 1, d: 2}]

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'escape') {
    console.log(`escaped solution = ${solution}`);
    process.exit();
  }

  console.clear();
  console.log('Experiment'.cyan);

  solution *= iterate(iteration, slopes[iteration]);

  if (iteration == slopes.length-1) {
    console.log(`final solution = ${solution}`);
    process.exit(); 
  } else {
    iteration += 1;
    console.log(`intermediate solution = ${solution}`);
    console.log(`perform next iteration...`);  }
});

console.clear();
console.log('Experiment'.cyan);

const rows = readfile(filename);
const width = rows[0].length;
log.info(`rows = ${rows.length} rows x ${width} cols`);

console.log(`press key to start iterations`);



