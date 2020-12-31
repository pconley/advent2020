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
    while( p.n != current.n ){
        str += ` ${p.n}`;
        p = p.next;
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

let max = 0
for( let number of data ){
    const node = new Node(number);
    if (prev) prev.next = node;
    nodes[number] = node;
    node.prev = prev;
    prev = node;
}

let current = nodes[data[0]];
current.prev = prev; 
prev.next = current;

let count = 0;
while( count++ < 100 ){
    console.log(`\nMove: ${count}`);
    console.log("cups:", as_str(current));

    // the three cups that are immediately clockwise of the current cup.

    const trio = [current.next.n,current.next.next.n,current.next.next.next.n]
    console.log("pick up", trio);

    // a destination cup: the cup with a label equal to the current cup's label minus one.

    let d = current.n-1;
    if(d==0) {d=9;}
    while( trio.includes(d) ) { d--; if(d==0) {d=9;} }
    console.log(d);
    const destination = nodes[d];
    console.log("dest node", destination.n, "has next:", destination.next.n);

    // const previousToDest = nodes.find(n => n?.next.n === d );
    // console.log("previous to dest", previousToDest.n, "has next:", previousToDest.next.n);

    // The crab places the cups it just picked up so that they are immediately 
    // clockwise of the destination cup. They keep the same order as when they 
    // were picked up.

    // const saveOriginalDestNext = destination.next;
    const theLastTrioNode = current.next.next.next;
    const theFirstTrioNode = current.next;
    current.next = theLastTrioNode.next;
    theLastTrioNode.next = destination.next;
    destination.next = theFirstTrioNode;
    // previousToDest.next = theFirstTrioNode;
    // theLastTrioNode.next = saveOriginalDestNext;

    // The crab selects a new current cup: the cup which is 
    // immediately clockwise of the current cup.

    console.log(`after move ${count} : `, as_str(current));
    current = current.next;
}

console.log(`FINAL : `, as_str(current));

let answer = '';
let curr = nodes[1];
for(i=0; i<8; i++){ 
    curr = curr.next
    answer += curr.n;
}
console.log(answer)




