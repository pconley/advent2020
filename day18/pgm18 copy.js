const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");

    return lines.map(line => {
        const tokens = line.split('').filter(x=>x!=' ')
        const smarts = tokens.map(t => {
            const i = parseInt(t);
            return isNaN(i) ? t : i;
        })
        return smarts;
    });
}

// const parens_re = new RegExp("^\(.*\)$");

const find_parens = (tokens) => {
    let p1;
    let depth = 0;
    for( let i=0; i<tokens.length; i++ ){
        const token = tokens[i];
        // console.log(i, "---", depth, token)
        if (token === '(' && depth==0) { 
            p1 = i;
        }
        if (token === '(') { 
            depth++;
        }
        if ( token===')' && depth===1 ) { 
            // console.log(p1, i)
            return {p1, p2: i};
        }
        if (token === ')') { 
            depth--;
        }
    }
    return null;
}

const evaluate = (tokens) => {
    // console.log("evaluate::tokens =", tokens.join(' '));
    let parens = find_parens(tokens);
    if( parens ){
        const {p1, p2} = parens;
        const subex = tokens.slice(p1+1,p2);
        // console.log(tokens.join(''), p1, p2, subex.join(''))
        const value = evaluate(subex);
        const expr = tokens.slice(0,p1).concat([value]).concat(tokens.slice(p2+1));
        // console.log('new expr', expr.join(''));
        return evaluate(expr);
    }

    // console.log("no parens in ",tokens.join(''))
    let value = tokens[0];
    for( let n=1; n<tokens.length; n++) {
        const t = tokens[n];
        // console.log(n, t)
        if( t=="+" ) {
            value += tokens[n+1];
            n++;
        }
        if( t=="*" ) {
            value *= tokens[n+1];
            n++;
        }
    }
    // console.log("value =", value);
    return value;
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 18'.cyan);

const exprs = reader(filename);
let total = 0;
exprs.forEach(expr => {
    console.log("expression", expr.join(''));
    const answer = evaluate(expr);
    total += answer;
    console.log('answer',answer)
});
console.log('total',total)

// assert( answer == expected ) // for the test data

