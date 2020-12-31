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

const idb = (data) => {
    db = {};
    data.forEach((el,index) => {
        el.ingredients.forEach(ingr => {
            if( !(ingr in db) ) db[ingr] = {count: 0, recipes: [], possibles: []};
            db[ingr].count++;
            db[ingr].recipes.push(index);
            db[ingr].possibles = el.allergens;  // only for the firstt!
        })
    });
    return db;
}

const allFoundIn = (possibles, idb) => {
    for( let p of possibles ){
        let found = false;
        for( let key in idb ){
            if ( idb[key].possibles.has(p) ) found = true;
            // console.log("AFI:", p, key, idb[key].possibles, found)
        }
        if( found == false ) return false;
    }
    return true;
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

const rule1 = (data) => {
    // rule 1: eliminate any single ingredient where all 
    // the associated allergens are listed other places.

    const ing_db = idb(data);
    // console.log(ing_db);

    for( let key in ing_db ){
        const {count, possibles} = ing_db[key];
        if( count === 1 ){
            // console.log("rule1", key, possibles);
            const others = _.cloneDeep(ing_db);
            delete others[key];
            const found = allFoundIn(possibles, others);
            if( found ){ 
                // console.log("rule1", key);
                return key;
            }
        }
    }
    return null;
}

const rule2 = (data) => {
    // rule 2: is there an entry where there are the same number
    // of ingredients and alergins?  then all are accounted for.
    for( let item of data ){
        if( item.ingredients.size == item.allergens.size ){
            const allergens = [...item.allergens];
            const ingredients = [...item.ingredients];
            if (item.ingredients.size == 1) {
                // console.log("consider", item.ingredients, item.allergens);
                // console.log("keys", item.ingredients.keys(), item.allergens.values());
                // there is a one to one match so that is a fact
                return {ingredient: ingredients[0], allergen: allergens[0]};
            } else {
                // console.log("\nrule2::found equal item", to_str(item));
                // if there is another entry with only one of these ingredients
                // and only one of these allergens... then we have found a fact
                for( let d of data ){
                    if( d === item ){
                        // skip it
                    } else {
                        // console.log("consider", item.ingredients, d.ingredients);
                        const inter = _.intersection([...item.ingredients], [...d.ingredients]);
                        if( inter.length === 1 ){
                            const allers = _.intersection([...item.allergens], [...d.allergens]);
                            if( allers.length === 1 ){
                                // console.log("RULE2 FACT:", inter, allers);
                                return {ingredient: inter[0], allergen: allers[0]};
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}

const rule3 = (data) => {
    // if there are NO allergens left, then eliminate any ingredieant
    const count = sum(data.map(d => d.allergens.size));
    if (count == 0){
        console.log("there are no allergens");
        for( let d of data){
            if( d.ingredients.size > 0 ){
                return {ingredient: [...d.ingredients][0] };
            }
        }

    }
    return null;
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

const original = reader(filename);
let data = _.cloneDeep(original);

const allergens = new Set();
for( let d of data ){
    const alls = [...d.allergens];
    for( let a of alls ) allergens.add(a);
}
console.log("allergens", [...allergens]);

for( let a of [...allergens]){
    let set = null
    for( let d of data) {
        const allergens = [...d.allergens];
        if( allergens.includes(a)) {
            if( !set ){
                set = d.ingredients;
            } else {
                set = intersection(set, d.ingredients);
            }
        }
    }
    console.log(`final ${a} intersection`, set);
}




// print("\nSTART:",data)

let count = 0;
const elims = [];
let eliminated = true;
while( eliminated && count < 1) {
    count += 1;
    eliminated = false;

    const fact1 = rule1(data);
    if( fact1 ) {
        console.log("RULE 1:", fact1);
        elims.push(fact1);
        eliminated = true;
        data = eliminate(data, fact1);
        // print(`\n${count}:: DATA after 1:`,data)
        continue;
    }

    const fact2 = rule2(data);
    if( fact2 ){
        console.log("RULE 2:", fact2);
        eliminated = true;
        data = eliminate(data, fact2.ingredient, fact2.allergen);
        // print(`\n${count}:: DATA after 2:`,data)
        continue;
    }

    const fact3 = rule3(data);
    if( fact3 ){
        console.log("RULE 3:", fact3);
        eliminated = true;
        elims.push(fact3.ingredient);
        data = eliminate(data, fact3.ingredient);
        // print(`\n${count}:: DATA after 3:`,data)
        continue;
    }
}

// console.log("ELIMS", elims.length, elims);

let total = 0;
for( let item of original ){
    const ingredients = [...item.ingredients];
    const found = ingredients.filter(i => elims.includes(i));
    total += found.length;
}
console.log("total = ", total);
