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
            // console.log("read a rule", line);
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
    // console.log(ticket);
    let total = 0;
    ticket.forEach(field => {
        const valid_field =  rules.some(rule => {
            // return true if field valid for some range
            return rule.ranges.some(range => {
                // true is outside of range
                const in_range = field >= range[0] && field <= range[1];
                // if (in_range) console.log("valid:", field, rule.name, range)
                return in_range;
            })
        })
        if ( !valid_field ) total += field;
    })
    return total;
}

const matchingRules = (rules, field) => {
    // return the set of matching rules for a field
    console.log(field);
    let matches = [];
    rules.forEach(rule => {
        const is_match = rule.ranges.some(range => {
            const in_range = field >= range[0] && field <= range[1];
            // if (in_range) console.log("match:", field, rule.name, range)
            return in_range;
        })
        if ( is_match ) matches.push(rule.name);
    })
    return matches;
}

const matchingFields = (rule, tkt) => {
    const set = [];
    tkt.forEach( (field, index) => {
        const is_match = rule.ranges.some(range => {
            const in_range = field >= range[0] && field <= range[1];
            // if (in_range) console.log("match:", field, rule.name, range)
            return in_range;
        })
        if (is_match) set.push(index);
    })
    return set;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 16'.cyan);

const {rules, myTicket, nearbyTickets} = reader(filename);
console.log("the rules", rules, "\n");

const validTickets = nearbyTickets.map(t => {
    return isValid(rules, t) == 0 ? t : null;
}).filter(Boolean);

const fieldCount = validTickets[0].length;

const foundFields = [];

while (foundFields.length < fieldCount){

    rules.forEach(rule => {
        const sets = [];
        validTickets.forEach(tkt => {
            const set = matchingFields(rule, tkt);
            // console.log("for this rule", rule.name, "ticket", tkt, "matching set is", set);
            sets.push(set);
        })
        let field = -1;
        let count = 0;
        const alreadyFoundIndexes = foundFields.map(f=>f.field);
        for(let i=0; i<fieldCount; i++) {
            if (!alreadyFoundIndexes.includes(i)){
                const allSets = sets.every( set => set.includes(i) );
                if( allSets ) {
                    field = i;
                    count++;
                }
            }
        }
        if (count == 1) {
            // there was only one field that matched this rule across all tickets
            // console.log(`rule ${rule.name} has one field at position = ${field}`);
            foundFields.push({field, name: rule.name});
        }
    });
    // console.log("found fields", foundFields.map(f=>`${f.name}@${f.field}`).join(":"))
}

let answer = 1;
foundFields.forEach(f => {
    if (f.name.includes('departure')){
        console.log(`${f.name} = ${f.field} => `, myTicket[f.field]);
        answer *=  myTicket[f.field];
    }
})

console.log("\nanswer", answer);
assert(589685618167 == answer)
