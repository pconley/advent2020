const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const { CLIENT_RENEG_LIMIT } = require('tls');
// const Combinatorics = require('js-combinatorics');

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

// var log4js = require('log4js');
const { sum } = require('lodash');
// const { count } = require('console');
// const prod = arr => arr.reduce((a,b) => a * b, 1);

// var logger = log4js.getLogger();
// logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");
    let state = 'rules';
    const rules = [];

    var rule_re = new RegExp("^(.*): ([0-9]*)-([0-9]*) or ([0-9]*)-([0-9]*)$");

    let myTicket = [];
    const nearbyTickets = []
    lines.forEach(line => {
        if( line == "" ) {
            // skip
        } else if (line == "your ticket:") {
            state = "my";
        } else if (line == "nearby tickets:") {
            state = "nearby"
        } else if( state == "rules" ){
            console.log("read a rule", line);
            // class: 1-3 or 5-7
            const match = line.match(rule_re);
            // console.log(match[1],match[2],match[3],match[4],match[5]);
            rule = {
                name: match[1], 
                ranges: [
                    [parseInt(match[2]),parseInt(match[3])],
                    [parseInt(match[4]),parseInt(match[5])],
                ]
            }
            rules.push(rule);
            console.log(rule);

        } else if( state == "my" ){
            myTicket = line.split(",").map(p => parseInt(p));
            // console.log("read my ticket", myTicket);

        } else if( state == "nearby" ){
            // console.log("read a nearby", line);
            nearbyTickets.push(line.split(",").map(p => parseInt(p)))
        }
    });
    return {rules, myTicket, nearbyTickets};
}

//*************************************************************************************
//
//*************************************************************************************

const isValid = (rules, ticket) => {
    // considering only whether tickets contain values 
    // that are valid for every field
    console.log(ticket);
    let total = 0;
    ticket.forEach(field => {
        const valid_field =  rules.some(rule => {
            // return true if field valid for some range
            return rule.ranges.some(range => {
                // true is outside of range
                const in_range = field >= range[0] && field <= range[1];
                if (in_range) console.log("valid:", field, rule.name, range)
                return in_range;
            })
        })
        if ( !valid_field ) total += field;
    })
    return total;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 16'.cyan);

const {rules, myTicket, nearbyTickets} = reader(filename);
console.log(rules);

const totals = nearbyTickets.map(t => {
    return isValid(rules, t);
});

console.log("\ntotals", sum(totals), totals);
// assert(last == answer)
