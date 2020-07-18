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
    /**
     * @param theme {Object} set the theme for this round.
     */
    constructor(theme=new Quarantine()) {
        /** HTML tag instances*/
        this.scorecard = document.querySelector("#scorecard>table");

        /** CSS class/id instances */
        this.selected = "selected-cell";

        /** class instances. */
        this.theme = theme; // {array} a collection of questions to initialize the game with.
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
 * @class represents a quarantine theme to initialize the bingo board.
 */
class Quarantine {
    constructor() {
        this.theme = null;
        this.questions = this.getQuestions(); // {array} a collection of theme with questions.
        this.center = "FREE SPACE (wore a mask)"; // {string} represents the center square of the scoreboard.
    }

    /**
     * @function fill the array with questions.
     *
     * @return {array} of questions.
     */
    getQuestions() {
        const q1 = "slept in pas noon";
        const q2 = "baked for fun";
        const q3 = "watched more than 3 episodes of a show in on day";
        const q4 = "took a walk outside to exercise";
        const q5 = "video called wearing sweat, shorts, or pajama bottoms";
        const q6 = "started a workout routine or health regime";
        const q7 = "had to cancel a planned celebration or trip";
        const q8 = "made an unnecessary online purchase";
        const q9 = "started a puzzle";
        const q10 = "video called to hangout with friends";
        const q11 = "purchased hand sanitizer or hand soap";
        const q12 = "did not leave home property for more than 5 days in a row";
        const q13 = "cleaned or organized something at home";
        const q14 = "made a tik-tok video or participated in one";
        const q15 = "forgot to unmute yourself in a video call";
        const q16 = "got an at home or DIY haircut";
        const q17 = "joined the Facebook group 'Zoom Memes for Self-Quaranteens";
        const q18 = "disconnected from a Zoom call because of bad connectivity";
        const q19 = "picked up a new hobby";
        const q20 = "started a new book";
        const q21 = "did not know what Zoom was before March 2020";
        const q22 = "had food delivered to your house";
        const q23 = "went to sleep past 2am";
        const q24 = "asked 'what day is it?'";

        return [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13,
                q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24];
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