const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { title } = require('process');
const { sum, result } = require('lodash');
const { join } = require('path');

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    return lines[0].split('').map(s => parseInt(s));
}

class Node {
    constructor(n) {
        this.n = n;
        this.prev = null;
        this.next = null;
    }
}

const as_str = (current) => {
    let str = `(${current.n})`
    let p = current.next;
    let count = 0;
    while( p.n != current.n ){
        str += ` ${p.n}`;
        p = p.next;
        if( count++ > 20 ) break;
    }
    return str;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 23'.cyan);

let data = reader(filename);

console.log("Data", data.join(' '));

let prev = null;
const nodes = [];

let max = Math.max(...data);
console.log("largest input number was ", max);

for( let number of data ){
    const node = new Node(number);
    if (prev) prev.next = node;
    nodes[number] = node;
    node.prev = prev;
    prev = node;
}

const max_nodes = 1000000; // 9;

for( let n=max+1; n<=max_nodes; n++){
    const node = new Node(n);
    prev.next = node;
    nodes[n] = node;
    node.prev = prev;
    prev = node;
}

let current = nodes[data[0]];
current.prev = prev;
prev.next = current;

console.log("current:", current.n, current.next.n);
console.log("starting:", as_str(current));
console.log("finale node", prev.n)

let count = 1;
const steps = 10000000; // or 100
while( count <= steps ){
    // console.log(`\nMove: ${count}`);
    // console.log("cups:", as_str(current));

    // the three cups that are immediately clockwise of the current cup.

    const trio = [current.next.n,current.next.next.n,current.next.next.next.n]
    // console.log("pick up", trio);

    // a destination cup: the cup with a label equal to the current cup's label minus one.

    let d = current.n-1;
    if(d==0) {d=max_nodes;}
    while( trio.includes(d) ) { d--; if(d==0) {d=max_nodes;} }
    const destination = nodes[d];

    // The crab places the cups it just picked up so that they are immediately 
    // clockwise of the destination cup. They keep the same order as when they 
    // were picked up.

    const theLastTrioNode = current.next.next.next;
    const theFirstTrioNode = current.next;
    current.next = theLastTrioNode.next;
    theLastTrioNode.next = destination.next;
    destination.next = theFirstTrioNode;

    // The crab selects a new current cup: the cup which is 
    // immediately clockwise of the current cup.

    if( count%500000 === 0 ) console.log(`${count}`);
    // console.log(`after move ${count} : `, as_str(current));
    current = current.next;
    count++;
}

console.log(`count = `, count);
console.log(`FINAL : `, as_str(current));

let answer = '';
let curr = nodes[1];
for(i=0; i<8; i++){ 
    curr = curr.next
    answer += curr.n;
}
console.log(answer)
// assert(answer == '67384529'); // data1 9 and 100
// assert(answer == '98742365'); // data 9 and 100

// part2: under the two cups that will end up immediately clockwise of cup 1.
const v1 = nodes[1].n;
const v2 = nodes[1].next.n;
const v3 = nodes[1].next.next.n;

console.log("\npart-two final values", v1, v2, v3, v2*v3, "\n")

const x = nodes.find(a=>a?.n === 934001)
console.log("x", x.n, x.next.n)

// this would be 934001 and then 159792; multiplying these together produces 149245887792
