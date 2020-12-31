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
    const players = contents.split("\n\n");
    console.log(players)
    const player1 = players[0].split('\n').slice(1).map(n => parseInt(n));
    const player2 = players[1].split('\n').slice(1).map(n => parseInt(n));
    return { player1, player2 };
}

//*************************************************************************************
// MAINLINE
//*************************************************************************************

const [_node, _pgm, filename] = process.argv;

console.log('Day 23'.cyan);

let {player1, player2} = reader(filename);

console.log("p1: ", player1.join(' '));
console.log("p2: ", player2.join(' '));

let gameNumber = 0;

const game = (player1, player2) => {

    gameNumber++;

    const hands = {};

    const num = gameNumber;

    console.log(`\n=== Game ${num} ===`)

    let round = 1;
    let finished = false;

    while( !finished ){

        console.log(`\nRound: ${round} (game ${num})`)
        console.log("player1: ", player1.join(' '));
        console.log("player2: ", player2.join(' '));

        const to_hand = (deck) => deck.join(':');

        const p1h = to_hand(player1);
        const p2h = to_hand(player2);
        const hand = `${num}==${p1h}::${p2h}`;

        console.log(hand);

        if ( hand in hands ){
            console.log("same hand found twice... player1 wins");
            console.log(hand);

            // const len = player1.length;
            // const values = player1.map((card,index) => card*(len-index) );
            // console.log(sum(values));

            console.log(`winner of game ${num} is ONE (by duplicate hand)`)

            return { winner: 1, aborted: true, deck1: player1, deck2: player2 };
        } else {
            hands[hand] = true;
        }

        // console.log(`\nRound: ${round} (game ${num})`)
        // console.log("player1: ", player1.join(' '));
        // console.log("player2: ", player2.join(' '));
        const p1 = player1.shift();
        const p2 = player2.shift();
        
        // If both players have at least as many cards remaining in their deck
        // as the value of the card they just drew, the winner of the round is 
        // determined by playing a new game of Recursive Combat

        let roundAborted = false;
        let roundWinner = 0;

        if (player1.length >= p1 && player2.length >= p2) {
            console.log("recursive play");
            // To play a sub-game of Recursive Combat, each player creates a new deck by 
            // making a copy of the next cards in their deck (the quantity of cards copied 
            // is equal to the number on the card they drew to trigger the sub-game).
            const subdeck1 = player1.slice(0,p1);
            const subdeck2 = player2.slice(0,p2);
            // console.log("subdeck 1", subdeck1)
            // console.log("subdeck 2", subdeck2)
            const { winner, aborted } = game(subdeck1, subdeck2);
            roundWinner = winner;
            roundAborted = aborted;
        } else {
            roundWinner = p1 > p2 ? 1 : 2;
        }

        if (roundWinner == 1) {
            console.log(`player 1 wins round ${round} with of game ${num}`, p1, p2, roundAborted)
            player1.push(p1)
            player1.push(p2)
        } else {
            player2.push(p2)
            player2.push(p1)
            console.log(`player 2 wins round ${round} of game ${num} with`, p1, p2) 
        }

        // if( roundAborted ) process.exit();

        finished = player1.length==0 || player2.length==0;
        round++;
    }

    const winner = player1.length==0 ? '2' : '1'
    console.log(`winner of game ${num} is`, player1.length==0 ? '2' : '1')
    return { winner, deck1: player1, deck2: player2 };
}

const {winner, deck1, deck2} = game(_.cloneDeep(player1), _.cloneDeep(player2));

console.log("player1: ", deck1.join(' '));
console.log("player2: ", deck2.join(' '));

const deck = winner==2 ? deck2 : deck1;

const len = deck.length;
const values = deck.map((card,index) => card*(len-index) );
console.log(values);
console.log(sum(values));


