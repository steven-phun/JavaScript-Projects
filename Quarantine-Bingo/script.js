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
     * @param i {number} represents the theme index in an array.
     */
    constructor(i=0) {
        /** HTML tag instances*/
        this.scorecard = document.querySelector("#scorecard>table");
        this.display = document.querySelector("#question>label");
        this.theme = document.querySelector("#theme-header>#theme-custom");
        this.modal = document.querySelector(".modal");
        this.overlay = document.querySelector(".overlay");
        this.list = document.querySelector("#theme-list");
        this.bingoButton = document.querySelector("#bingo-button");

        /** CSS class/id instances */
        this.selected = "selected-cell"; // represents the cell that was selected by the user.
        this.active = "active"; // represents a div that is to be displayed to the user.

        /** class instances. */
        this.index = i; // {number} represents the current theme location in an array.
        this.array = this.getTheme(); // {array} stores every available theme.
        this.center = this.array[this.index].center; // {string} represents the innerHTML of the center square.
        this.copy1 = this.getTheme()[this.index].questions; // {array} a copy of the collection of questions to fill the scorecard with.
        this.copy2 = this.getTheme()[this.index].questions; // {array} a copy of the collection of questions to display to user.
        this.win = false; // {boolean} true if the user has a BINGO.
        this.size = this.array.length; // {number} represents the number of available theme.
        this.row = null; // {number} the row index of selected cell.
        this.col = null; // {number} the column index of selected cell.
        this.width = 5; // {number} represents the width and length of the scorecard.

        // set up score card for the user to interact with.
        this.buildScorecard();
    }

    /**
     * @function generate a bingo scorecard.
     */
    buildScorecard() {
        this.clearDiv(this.scorecard);

        const center = Math.floor(this.width / 2);

        for (let i = 0; i < this.width; i++) {
            const row = this.scorecard.insertRow(); // insert <tr>.
            for (let j = 0; j < this.width; j++) {
                row.insertCell(); // insert <td>.
                this.scorecard.rows[i].cells[j].setAttribute("onclick", `getCell(${i},${j})`);
                if (!(i === center && j === center))
                    this.scorecard.rows[i].cells[j].innerHTML = this.getRandomQuestion(this.copy1);
            }
        }
        this.scorecard.rows[center].cells[center].innerHTML = this.center;
        this.theme.innerHTML = this.array[this.index].theme;
    }

    /**
     * @function display a random question on scorecard.
     */
    displayRandomQuestion() {
        if (this.copy2.length === 0) return this.display.innerHTML = "There are no more questions to display";
        this.display.innerHTML = this.getRandomQuestion(this.copy2);
    }

    /**
     * @function get a random unique question from selected theme.
     *
     * @param array {array} the array that contains the questions.
     *
     * @return {string} a question.
     */
    getRandomQuestion(array) {
        const index = this.getRandomInt(array.length);
        const question = array[index];

        array.splice(index, 1);

        return question;
    }

    /**
     * @function get a random integer;
     *
     * @param max {number} the max number the random generator will go up to.
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
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

        this.win = this.validateWin();

        this.displayBingo();
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
     * @function validate if the scorecard scored BINGO.
     *
     * @return {boolean} true if the user has selected 5 adjacent squares (row, column or diagonally).
     */
    validateWin() {
        return this.validateRow() || this.validateColumn() || this.validateBackslash() || this.validateForwardSlash();
    }

    /**
     * @function check if user has all squares selected in a row.
     */
    validateRow() {
        let count = 0;

        // check if user has 5 squares in a row.
        for (let col = 0; col < this.width; col++) {
            count = 0;
            for (let row = 0; row < this.width; row++) {
                if (this.scorecard.rows[row].cells[col].classList.contains(this.selected)) count++;
            }
            if (count === this.width) return true;
        }
        return false;
    }

    /**
     * @function check if user has all squares selected in a column.
     */
    validateColumn() {
        let count = 0;

        for (let row = 0; row < this.width; row++) {
            count = 0;
            for (let col = 0; col < this.width; col++) {
                if (this.scorecard.rows[row].cells[col].classList.contains(this.selected)) count++;
            }
            if (count === this.width) return true;
        }
        return false;
    }

    /**
     * @function check if the user has all squares selected diagonally (backslash).
     */
    validateBackslash() {
        let count = 0;

        for (let i = 0; i < this.width; i++) {
            if (this.scorecard.rows[i].cells[i].classList.contains(this.selected)) count++;
        }

        return count === this.width;
    }

    /**
     * @function check if the user has all squares selected diagonally (forward slash).
     */
    validateForwardSlash() {
        let count = 0;

        for (let i = 0; i < this.width; i++) {
            if (this.scorecard.rows[i].cells[(this.width - 1) - i].classList.contains(this.selected)) count++;
        }

        return count === this.width;
    }

    /**
     * @function display the BINGO button.
     */
    displayBingo() {
        if (this.win) return this.bingoButton.classList.add(this.active);

        this.bingoButton.classList.remove(this.active);
    }

    /**
     * @function execute events when the user has selected the "BINGO" button.
     */
    displayThemes() {
        this.toThemeButton();
        this.displayModal();
    }

    /**
     * @function display all the available theme as a button for user to select.
     */
    toThemeButton() {
        this.clearDiv(this.list);

        for (let i = 0; i < this.size; i++) {
            const button = document.createElement("button");
            button.innerHTML = this.array[i].theme;
            button.setAttribute("onclick", `newGame(${i})`);
            this.list.appendChild(button);
        }

        // display a coming soon theme.
        const button = document.createElement("button");
        button.innerHTML = "Coming Soon".italics();
        button.style.backgroundColor = "#AED6F1";
        button.style.outline = "none";
        this.list.appendChild(button);
    }

    /**
     * @function start a new game of BINGO with given theme.
     *
     * @param theme {number} the index number in array the theme is located.
     */
    newGame(theme) {
        this.index = theme;
        this.copy1 = this.getTheme()[this.index].questions;
        this.copy2 = this.getTheme()[this.index].questions;
        this.display.innerHTML = "";
        this.win = false;

        this.displayBingo();
        this.buildScorecard();
        this.hideModal();
    }

    /**
     * @function hide the selected modal when user selects the "cancel" button.
     */
    cancel() {
        this.hideModal();
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

    /**
     * @function removes all child element from given element.
     *
     * @param div {Element} the element's child to be removed.
     */
    clearDiv(div) {
        while (div.hasChildNodes()) div.removeChild(div.firstChild);
    }

    /**
     * @function display the modal form for the user to interact with.
     */
    displayModal() {
        this.modal.classList.add(this.active);
        this.overlay.classList.add(this.active);
    }

    /**
     * @function hide the modal form from user.
     */
    hideModal() {
        this.modal.classList.remove(this.active);
        this.overlay.classList.remove(this.active);
    }

    /**
     * @function stores the questions, center square, and ending message for current theme.
     *
     * @return {array} of questions.
     */
    getTheme() {
        const array = [];

        array.push(new Theme("Quarantine", "FREE SPACE (wore a mask)",
            ["slept in past noon",
                    "baked for fun",
                    "watched more than 3 episodes of a show in one day",
                    "took a walk outside to exercise",
                    "video called wearing sweats, shorts, or pajama bottoms",
                    "started a workout routine or health regime",
                    "had to cancel a planned celebration or trip",
                    "made an unnecessary online purchase",
                    "started a puzzle",
                    "video called to hangout with friends",
                    "purchased hand sanitizer or hand soap",
                    "did not leave home property for more than 5 days in a row",
                    "cleaned or organized something at home",
                    "made a tik-tok video or participated in one",
                    "forgot to unmute yourself in a video call",
                    "got an at home or DIY haircut",
                    'joined the Facebook group "Zoom Memes for Self-Quaranteens"',
                    "disconnected from a Zoom call because of bad connectivity",
                    "picked up a new hobby",
                    "started a new book",
                    "did not know what Zoom was before March 2020",
                    "had food delivered to your house",
                    "went to sleep past 2am",
                    'asked "what day is it?"']));

        array.push(new Theme("Extroverts", "FREE SPACE (be an Extrovert)", []));

        return array;
    }
}


/**
 * @class represents a single theme.
 */
class Theme {
    constructor(theme, center, array) {
        this.theme = theme;
        this.center = center;
        this.questions = array;
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

/**
 * @function catch the events when the use selects the "get random question" button.
 */
const getQuestion = () => bingo.displayRandomQuestion();

/**
 * @function catch the events when the user selects the "BINGO" button.
 */
const getBingo = () => bingo.displayThemes();

/**
 * @function catch the event when user wants the close a modal.
 */
const cancel = () => bingo.cancel();

/**
 * @function start a new game with selected theme.
 *
 * @param index {number} the index location in array that contains the selected theme.
 */
const newGame = (index) => bingo.newGame(index);

// global instance
let bingo = new Bingo;