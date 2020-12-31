const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
// const { isMatch } = require('lodash');

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');

    const token_or_int = t => { const i = parseInt(t); return isNaN(i) ? t : i; };

    const parts = contents.split('\n\n');
    // console.log(parts)
    const raws = parts[0].split("\n").map(line => {
        // 1: 2 3 | 3 2
        // 0: 2 3
        // 7: 24
        // 3: "a"
        return line.split(' ');
    });
    const rules = {};
    raws.forEach(raw => {
        const n = raw[0].slice(0, -1);
        if( n==8 ) console.log("*", raw, raw.length);
        const i = raw.indexOf('|');
        if (raw.length == 2 ){
            const x = parseInt(raw[1]);
            if (isNaN(x)){
                rules[n] = { c: raw[1].slice(1,-1) };
            } else {
                // a single rule
                rules[n] = {r1 : [x]}
            }
        } else if( i == -1 ) {
            const r1 = raw.slice(1)
            rules[n] = {r1, r2: null};
        } else {
            const r1 = raw.slice(1,i)
            const r2 = raw.slice(i+1,)
            rules[n] = {r1, r2};
        }
    });

    const messages = parts[1].split("\n").map(line => {
        // aaabbb
        return line
    });

    return {rules, messages}
}

const repeat = (n, key, msg) => {
    let cnt = 0;
    let tot = 0;
    let tmp = msg;
    let eat = isMatch(0, key, tmp)
    while( cnt<n && eat ) {
        cnt++;
        tot += eat;
        tmp = tmp.slice(eat);
        eat = isMatch(0, key, tmp)
    }
    return cnt > 0 ? tot : false;
}

const isMatch = (depth, key, msg) => {
    if( key==='8' ) console.log("key 8")
    if( key==='11' ) console.log("key 11")
    if( key>'99' ) console.log("key",key)
    if( key=='x8' ){
        console.log("**** 8");
        // 8: 42 | 42 8
        // rule 42 matches 1 or more times
        let cnt = 0;
        let tot = 0;
        let tmp = msg;
        let eat = isMatch(0, '42', tmp)
        while( eat ) {
            cnt++;
            tot += eat;
            tmp = tmp.slice(eat);
            eat = isMatch(0, '42', tmp)
        }
        return cnt > 0 ? tot : false;
    } else if ( key=='x11' ){
        console.log("**** 11");
        // 11: 42 31 | 42 11 31
        // rule [42 n times] [rule 31 n times]
        // where n = one or more (for some reasonable max)
        let found = false;
        for(let n=1; n<5; n++){
            // apply 42 n times
            for(let k=0; k<n; k++ ){
                let eat = isMatch(0, '42', tmp)
            }
            // apply 42 n times
        }

        return false;    
    }else {
        const rule = rules[key];
        const {c, r1, r2} = rule;
        const prefix = "   ".repeat(depth)
        if (c) {
            console.log(prefix, key, "isMatch: C", c, msg, msg[0] == c);
            return msg[0] == c ? 1 : false;
        } else if( r2 ) {
            console.log(prefix, key, "isMatch: try r1", r1, msg);
            const x1 = isValid(depth+1, r1, msg)
            if ( x1 !== false ) return x1;
            // --- OR rule set 2
            console.log(prefix, key, "isMatch: try r2", r2, msg.slice(x1));
            const x2 = isValid(depth+1, r2, msg);
            return x2; // false or eat
        } else {
            console.log(prefix, key, "isMatch: only r1", r1, msg);
            const x1 = isValid(depth+1, r1, msg);
            return x1;
        }
    }
};

const isValid = (depth, keys, msg) => {
    const prefix = "   ".repeat(depth);
    console.log(prefix, "isValid: rules", msg, keys);
    let temp = msg;
    let eat = 0
    for( let key of keys ){
        const m = isMatch(depth+1, key, temp);
        if( m === false ) {
            // console.log(false);
            return false;
        }
        temp = temp.slice(m);
        eat += m;
    }
    // console.log(eat);
    return eat;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 18'.cyan);

const {rules, messages} = reader(filename);
console.log("rules", rules)
console.log("messages", messages)

// count = 0;
// messages.forEach(message => {
//     console.log("\nmatching", message)
//     const match = isMatch(0, 0, message);
//     console.log("isMatch", match, message)
//     count += match ? 1 : 0;
// });
// console.log("count=", count, "of", messages.length);

const tests = [
    // 'bbabbbbaabaabba',
    // 'babbbbaabbbbbabbbbbbaabaaabaaa', // bad
    // 'aaabbbbbbaaaabaababaabababbabaaabbababababaaa',
    // 'bbbbbbbaaaabbbbaaabbabaaa', // bad
    // 'bbbababbbbaaaaaaaabbababaaababaabab', //bad
    // 'ababaaaaaabaaab',
    // 'ababaaaaabbbaba',
    // 'baabbaaaabbaaaababbaababb', 
    // 'abbbbabbbbaaaababbbbbbaaaababb', // bad
    'aaaaabbaabaaaaababaa', // bad
    // 'aaaabbaabbaaaaaaabbbabbbaaabbaabaaa',
    // 'aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba', // bad
]

for( let message of tests) {
    console.log("\nmatching", message)
    const match = isMatch(0, 0, message);
    console.log("isMatch", match, message)
    if (!match) break;
}

