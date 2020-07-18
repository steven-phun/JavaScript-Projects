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
        this.selected = "selected-cell";

        /** class instances. */
        this.row = null; // {number} the row index of selected cell.
        this.col = null; // {number} the column index of selected cell.
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
                this.scorecard.rows[i].cells[j].setAttribute("onclick", `getCell(${i},${j})`);
            }
        }
    }


    /**
     * @function get the selected cell's index.
     *
     * @param row {number} the row index of selected cell.
     * @param col {number} the column index of selected cell.
     */
    getCell(row, col) {
        this.row = row;
        this.col = col;

        this.toggleSelected();
    }

    /**
     * @function toggle between selected and deselected cell.
     */
    toggleSelected() {
        if (this.scorecard.rows[this.row].cells[this.col].classList.contains(this.selected)) {
            this.removeClass(this.selected);
            return;
        }

        this.addClass(this.selected);
    }

    /**
     * @function add given class to selected cell.
     *
     * @param text {string} given class to add.
     */
    addClass(text) {
        this.scorecard.rows[this.row].cells[this.col].classList.add(text);
    }

    /**
     * @function remove given class from selected cell.
     *
     * @param text {string} given class to remove.
     */
    removeClass(text) {
        this.scorecard.rows[this.row].cells[this.col].classList.remove(text);
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
/**
 * @function get the selected cell's index.
 *
 * @param row {number} the row index of selected cell.
 * @param col {number} the column index of selected cell.
 */
const getCell = (row, col) => bingo.getCell(row, col);


// global instance
const bingo = new Bingo;