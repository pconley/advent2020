const _ = require('lodash');
const fs = require('fs');
const assert = require('assert');
const colors = require('colors');
const Combinatorics = require('js-combinatorics');

var log4js = require('log4js');
const { sum } = require('lodash');
const { count } = require('console');
const prod = arr => arr.reduce((a,b) => a * b, 1);

var logger = log4js.getLogger();
logger.level = 'debug'; // trace; debug; info; warn; error; fatal

const [node, pgm, filename] = process.argv;

const hasRequired = (fields) => {
  const required = ["byr","iyr","eyr","hgt","hcl","ecl","pid"];
  const counts = required.map(r => r in fields ? 1 : 0);
  console.log(sum(counts) == required.length, counts)
  return sum(counts) == required.length;
}

const isValidYear = (str, mn, mx) => {
    try {
        const y = parseInt(str);
        const ok = (y >= mn) && (y <= mx);
        if (!ok) console.log("invalid year", str, mn, mx)
        return ok;
    } catch {
        console.log("invalid year")
        return false;
    }

}

const isValid = (passport) => {
    // byr (Birth Year) - four digits; at least 1920 and at most 2002.
    if( !isValidYear(passport.byr, 1920, 2002)) return false;
    console.log(passport.byr)

    // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    if( !isValidYear(passport.iyr, 2010, 2020)) return false;
    console.log(passport.iyr)

    // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    if( !isValidYear(passport.eyr, 2020, 2030)) return false;
    console.log(passport.eyr)

    // hgt (Height) - a number followed by either cm or in:
    console.log("height",passport.hgt)
    const num = passport.hgt.slice(0,-2);
    const last2 = passport.hgt.slice(-2);
    const ok = (last2 == "cm" || last2 == "in");
    if( !ok ) {
        console.log("height is invalid")
        return false;
    }
    try {
        // If cm, the number must be at least 150 and at most 193.
        // If in, the number must be at least 59 and at most 76.
        const n = parseInt(num);
        if( last2 == "cm" && (n<150 || n>193) ) return false;
        if( last2 == "in" && (n< 59 || n> 76) ) return false;
    } catch {
        console.log("height is invalid", num)
        return false;
    }

    // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    var hcl_re = new RegExp("#([0-9a-f]){6}$");
    console.log("hair", passport.hcl, hcl_re.test(passport.hcl))
    if( !hcl_re.test(passport.hcl)) return false;

    // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    const colors = ["amb","blu","brn","gry","grn","hzl","oth"];
    if( !colors.includes(passport.ecl) ) {
        console.log("invalid eye", passport.ecl)
        return false;
    }
    console.log("valid eye", passport.ecl)


    // pid (Passport ID) - a nine-digit number, including leading zeroes.
    var pid_re = new RegExp("^\\d{9}$");
    console.log("pid", passport.pid, pid_re.test(passport.pid))
    if( !pid_re.test(passport.pid)) return false;

    // cid (Country ID) - ignored, missing or not.

    return true;
}

console.log('Day 4'.cyan);
console.log("filename =", filename.bold);
fs.readFile(filename, 'utf8', function(err, contents) {
  // console.log(">>",contents);
  let count = 0;
  const data = contents.split("\n\n");
  const passports = data.map(datum => {
    // console.log("\ndatum", datum)
    const texts = datum.split("\n").join(" ").split(" ");
    // console.log("\ntext", texts)
    passport = {}
    texts.forEach(field => {
        [name, value] = field.split(":");
        passport[name] = value;
    });
    const ok = hasRequired(passport);
    if (ok && isValid(passport)) {
        count += 1;
    }
    // console.log(passport)
    return passport;
  });

  console.log("policy1 = ", count);

});

//   assert(count1, 564);
//   assert(count2, 325);

