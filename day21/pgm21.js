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

    return lines.map(line => {
        //mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
        const [part1, part2] = line.split(' (contains ');
        const ingredients = new Set(part1.split(' '));
        const allergens = new Set(part2.slice(0,-1).split(', '));
        // console.log(ingredients, allergens);
        return {ingredients, allergens};
    });
}

const eliminate = (data, ing, all=null) => {
    const altered = [];
    for( let d of data ){
        const t = d;
        t.ingredients.delete(ing);
        if (all) t.allergens.delete(all);
        if (t.ingredients.size > 0 ){
            altered.push(t);
        }
    }
    return altered;
}

const print = (label,data) => {
    console.log(label);
    data.forEach(d => {
        console.log("   ", d.ingredients, d.allergens);
    });
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 21'.cyan);

let data = reader(filename);

const allAllergens = new Set();
for( let d of data ){
    const alls = [...d.allergens];
    for( let a of alls ) allAllergens.add(a);
}

// const allAllergens = new Set(data.flatMap(d => d.allergens));
console.log("allAllergens", allAllergens);
console.log("allergens", [...allAllergens]);


// print("\nSTART:",data)

let count = 0;
let eliminated = true;
const dangerous = [];
while( eliminated ) {
    count += 1;
    eliminated = false;

    const allergenMap = {};

    for( let a of allAllergens.values() ){
        let intersectionSet;
        for( let d of data) {
            if( d.allergens.has(a) ) {
                intersectionSet = intersectionSet ? intersection(intersectionSet, d.ingredients) : d.ingredients;
            }
        }
        allergenMap[a] = [...intersectionSet];
    }

    for( let s in allergenMap ){
        console.log(s, "::", allergenMap[s]);
        if( allergenMap[s].length == 1 ){
            const ingr = allergenMap[s][0];
            // console.log("found", s, "as", ingr);
            dangerous.push({allergen: s, ingredient: ingr});
            eliminated = true;
            allAllergens.delete(s);
            data = eliminate(data, ingr, s)
        }
    }
    // print(`count ${count}`, data)
}

let total = sum(data.map(item => item.ingredients.size))
assert(total == 2635)
console.log("part1: total = ", total);

dangerous.sort((a,b) => {
    if (a.allergen < b.allergen) {
        return -1;
      }
      if (a.allergen > b.allergen) {
        return 1;
      }
      // names must be equal
      return 0;
});

console.log("part2: danger = ", dangerous.map(s=>s.ingredient).join(','));
