/**
 * This JavaScript program allows the user to play the game Bingo with Quarantine as its theme.
 *
 * @author Steven Phun
 * @since July 17, 2020.
 */

/*jshint esversion: 6 */


/*** JavaScript Classes ***/


/**
 * @class represents the bingo scorecard.
 */
class Bingo {
    constructor() {
        /** HTML tag instances*/
        this.scorecard = document.querySelector("#scorecard>table");


        /** CSS class/id instances */

        /** class instances. */
        this.size = 5; // {number} represents the width and length of the scorecard.

        this.buildScorecard();
    }

    /**
     * @function generate a bingo scorecard.
     */
    buildScorecard() {
        for (let i = 0; i < this.size; i++) {
            const row = this.scorecard.insertRow(); // insert <tr>.
            for (let j = 0; j < this.size; j++) {
                row.insertCell(); // insert <td>.
            }
        }
    }
}


/**
 * @class represents one individual cell on the scorecard.
 */
class Square {

}


/**
 * @class represents different themes to initialize the bingo board.
 */
class Theme {
    constructor() {
        this.theme = null;
        this.collection = []; // {array} a collection of theme with questions.
    }
}



/*** JavaScript Functions ***/



// global instance
const bingo = new Bingo;