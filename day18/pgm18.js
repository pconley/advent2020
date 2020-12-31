const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');

const reader = (filename) => {
    console.log("filename =", filename.bold);
    const contents = fs.readFileSync(filename, 'utf8');
    const lines = contents.split("\n");

    const token_or_int = t => { const i = parseInt(t); return isNaN(i) ? t : i; };

    return lines.map(line =>
        line
            .split('')
            .filter(x=>x!=' ')
            .map(t => token_or_int(t))
    );
}

const find_parens = (tokens) => {
    let p1;
    let depth = 0;
    for( let i=0; i<tokens.length; i++ ){
        const token = tokens[i];
        if (token === '(') { 
            if( depth==0 ) p1 = i;
            depth++;
        } else if ( token===')' ) { 
            if( depth===1 ) return {p1, p2: i};
            depth--;
        }
    }
    return null; // no parens
}

const evaluate = (tokens) => {
    // console.log("evaluate::tokens =", tokens.join(' '));
    let parens = find_parens(tokens);
    if( parens ){
        const {p1, p2} = parens;
        const subex = tokens.slice(p1+1,p2);
        const value = evaluate(subex);
        // reconstruct the expresion with the value inserted (without parens)
        const expr = tokens.slice(0,p1).concat([value]).concat(tokens.slice(p2+1));
        return evaluate(expr);
    }
    // no parens... recursively do the plus
    let plus = tokens.indexOf('+');
    if( plus > -1 ){
        const value = tokens[plus-1] + tokens[plus+1];
        // reconstruct the expresion with the value inserted
        const expr = tokens.slice(0,plus-1).concat([value]).concat(tokens.slice(plus+2));
        return evaluate(expr);
    }
    // no plus... do ANY mults without recursion
    let value = tokens[0];
    for( let n=1; n<tokens.length; n+=2) {
        if( tokens[n]=="*" ) {
            value *= tokens[n+1];
        }
    }
    // result of mults or just the value
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
    const answer = evaluate(expr);
    total += answer;
    console.log("expression", answer, expr.join(''));
});
console.log('total',total)

assert( total == 314455761823725);
