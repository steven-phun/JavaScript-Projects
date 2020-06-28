/**
 * This JavaScript program allows the user to play the classic 1990 video game of Minesweeper (Flower Field).
 *
 * Goal is to uncover all the squares on a grid that do not contain mines without being "blown up"
 * by clicking on a square with a mine underneath. Clicking on the game board will revel what is
 * hidden underneath the chosen square. Squares that contain a number (from 1-8), with each number
 * being the number of mines adjacent to the uncovered square.
 *
 * To help player avoid hitting a mine, the location of a suspected mine can be marked by flagging it
 * with the right mouse button or flag icon.
 *
 * This game has three difficulty levels:
 *          1 (Beginner)      => 10 mines board size 10x10.
 *          2 (Intermediate)  => 40 mines board size 16x16.
 *          3 (Expert)        => 99 mines board size 30x16.
 *
 *
 * @author Steven Phun
 * @since June 8, 2020.
 */


/*jshint esversion: 6 */

/** TODO List */
// add a counter for all non mine cells to keep track when user wins.
// fix flood fill.
// set up countdown.
// fix table and td from resizing.

/*** JavaScript Classes ***/

/**
 * @classdesc represents the game board.
 *
 * @param level {number} level of difficulty.
 */
class Minesweeper {
    constructor(level= 1) {
        /** HTML id tags */
        // {element} the HTML tag that displays the timer.
        this.countdown = document.querySelector("#countdown");
        // {element}  the HTML table tag that will contain the game board.
        this.table     = document.querySelector("#minesweeper>table");
        // {element}  the HTML tag that contains the amount of mines left.
        this.minesLeft = document.querySelector("#mines-left");

        /** HTML <i> tags */
        this.iconMine     = '<i class="fas fa-bomb"></i>';
        this.iconFlag     = '<i class="fas fa-flag"></i>';
        this.iconQuestion = '<i class=\"fas fa-question\"></i>';
        this.iconCorrect  = '<i class="fas fa-check"></i>';
        this.iconWrong    = '<i class="fas fa-times"></i>';

        /** CSS color class instances */
        this.reveal = "reveal-cell";  // represents a cell that hides its innerHTML from the user.
        this.boom   = "boom-cell"     // represents the cell that cause the game over.
        this.color1 = "color-1";      // style tag for the number 1.
        this.color2 = "color-2";      // style tag for the number 2.
        this.color3 = "color-3";      // style tag for the number 3.
        this.color4 = "color-4";      // style tag for the number 4.
        this.color5 = "color-5";      // style tag for the number 5.
        this.color6 = "color-6";      // style tag for the number 6.
        this.color7 = "color-7";      // style tag for the number 7.
        this.color8 = "color-8";      // style tag for the number 8.

        /** minesweeper instances. */
        this.mineLocations = [];                  // {array}   coordinate for the location of each mine.
        this.flagLocations = []                   // {array}   coordinate for the location of each flag icon.
        this.row = null;                          // {number}  the row number of selected cell.
        this.col = null;                          // {number}  the column number of selected cell.
        this.size = this.setMineSize(level);      // {number}  the number of mines in the game.
        this.width = this.setBoardWidth(level);   // {number}  the number of rows for the game board.
        this.length = this.setBoardLength(level); // {number}  the number of columns for the game board.
        this.empty = "";                          // {string}  represents an empty cell.
        this.gameOver = false;                    // {boolean} true after user selected a cell that contains a mine.

        // {array}   represents each square on the game board.
        this.board = this.setMines(this.toSquareObject());

        // set up the game board.
        this.countdown.innerHTML = "00:00";
        this.drawGameBoard();
        this.setNumber();
        this.updateDisplay();
    }

    /**
     * @function convert array elements to Square objects.
     *
     * @return an array of Square objects.
     */
    toSquareObject(){
        let gameBoard = [];

        for (let row = 0; row < this.width; row++) {
            gameBoard.push([]);
            for (let col = 0; col < this.length; col++) {
                gameBoard[row].push(new Square());
            }
        }
        return gameBoard;
    }

    /**
     * @function set the number of adjacent mine(s) for each cell.
     */
    setNumber() {
        // get adjacent cell index for each mine.
        for (let index = 0; index < this.mineLocations.length; index++) {
            const rowIndex = this.mineLocations[index].row - 1;
            const colIndex = this.mineLocations[index].col - 1;
            const section = 3; // one section is 3x3.

            for (let row = rowIndex; row < rowIndex + section; row++) {
                for (let col = colIndex; col < colIndex + section; col++) {
                    if (this.isCellInGameBoard(row, col)) {
                        if (this.board[row][col].mine) continue;
                        this.board[row][col].number = this.board[row][col].number + 1;
                    }
                }
            }
        }
    }

    /**
     * @function change the innerHTML content's color of a cell depending on its number.
     *
     * @param row  {number} the row index of cell.
     * @param col  {number} the cell index of cell.
     * @param text {number} the number to add the color class.
     */
    toCellColor(row, col, text) {
        let color = null;

        if (text === 1) color = this.color1;
        if (text === 2) color = this.color2;
        if (text === 3) color = this.color3;
        if (text === 4) color = this.color4;
        if (text === 5) color = this.color5;
        if (text === 6) color = this.color6;
        if (text === 7) color = this.color7;
        if (text === 8) color = this.color8;

        if (color === null) return;

        this.table.rows[row].cells[col].classList.add(color);
    }

    /**
     * @function add the appropriate number of mines to an array object.
     *
     * @param gameBoard {array} the array the mines are added.
     *
     * @return {array} with mines that represents the game board.
     */
    setMines(gameBoard) {
        let numberOfMines = this.size;

        while(numberOfMines > 0) {
            let row = Math.floor(Math.random() * this.width);
            let col = Math.floor(Math.random() * this.length);

            // avoid placing 2 mines on the same square.
            if (!gameBoard[row][col].mine) {
                gameBoard[row][col].number = this.iconMine;
                gameBoard[row][col].mine = true;
                this.mineLocations.push({row: row, col: col})
                numberOfMines--;
            }
        }
        return gameBoard;
    }

    /**
     * @function set the amount of mines depending on the level of the game board.
     *
     * @param level {number} the level of difficulty.
     *
     * @return {number} representing the number of mines in the game.
     */
    setMineSize(level) {
        if (level === 1) return 0; // TODO change value back to 10.
        if (level === 2) return 40;
        if (level === 3) return 99;
    }

    /**
     * @function set the number of columns depending on the level of the game board.
     *
     * @param level {number} the level of difficulty.
     *
     * @return {number} represents the number of columns.
     */
    setBoardLength(level) {
        if (level === 1) return 10;
        if (level === 2) return 16;
        if (level === 3) return 30;
    }

    /**
     * @function set the number of rows depending on the difficulty of the game board.
     *
     * @param difficulty {number} the level of difficulty.
     *
     * @return {number} represents the number of rows.
     */
    setBoardWidth(difficulty) {
        if (difficulty === 1) return 10;

        return 16; // rest of the level(2 and 3) row size is 16.
    }

    /**
     * @function generates html tags for a table that represents the game board.
     */
    drawGameBoard() {
        this.getEmptyTable();

        for (let i = 0; i < this.width; i++) {
            let row = this.table.insertRow(); // insert <tr>.
            for (let j = 0; j < this.length; j++) {
                let cell = row.insertCell(); // insert <tr>.
                cell.setAttribute('onmousedown', `getCellIndex(${i},${j})`);
            }
        }
    }

    /**
     * @function reset table to prevent future tables from stacking on top of each other.
     */
    getEmptyTable() {
        this.table.innerHTML = "";
    }

    /**
     * @function updates the DOM with the recent changes to each cell.
     */
    updateDisplay() {
        // update mines left count.
        this.minesLeft.innerHTML = (this.size - this.flagLocations.length).toString();

        // update cells.
        if (this.row === null || this.col === null) return;

        for (let row = 0; row < this.width; row++) {
            for (let col = 0; col < this.length; col++) {
                if (this.board[row][col].reveal) {
                    if (this.board[row][col].number !== 0) {
                        this.toCellColor(row, col, this.board[row][col].number);
                        this.table.rows[row].cells[col].innerHTML = this.board[row][col].number;
                    }
                }
            }
        }

        if (this.gameOver) this.checkFlags();
    }

    /**
     * @function reveals the innerHTML of selected cell.
     *
     * @param row {number} the row index of given row.
     * @param col {number} the column index of given column.
     */
    revealCell(row, col) {
        this.board[row][col].reveal = true;
        this.table.rows[row].cells[col].classList.add(this.reveal);

        // reveal surrounding cells of a cell that number's equal 0.
        if (this.board[row][col].number !== 0) return;
        if (!this.board[row][col].reveal) return;

        // the cell index above selected cell.
        if (this.isCellInGameBoard(row + 1, col)) this.revealCell(row + 1, col);
        // the cell index to the left of selected cell.
        if (this.isCellInGameBoard(row, col - 1)) this.revealCell(row, col -1);
        // the cell index to the right of selected cell.
        if (this.isCellInGameBoard(row, col + 1)) this.revealCell(row, col + 1);
        // the cell index to below selected cell.
        if(this.isCellInGameBoard(row - 1, col)) this.revealCell(row - 1, col);

    }


    /**
     * @function checks if the selected cell contains a mine.
     */
    checkGameOver() {
        if (this.board[this.row][this.col].mine) {
            this.displayAllMines();
            this.table.rows[this.row].cells[this.col].classList.add(this.boom);
            this.countdown.innerHTML = "game over";
            this.gameOver = true;
        }
    }

    /**
     * @function reveal every cell that contains a mine.
     */
    displayAllMines() {
        this.mineLocations.forEach(mine => this.board[mine.row][mine.col].reveal = true);
    }

    /**
     * @function display to the user if each flagged cell does contain a mine.
     */
    checkFlags() {
        for (let i = 0; i < this.flagLocations.length; i++) {
            const flag = this.flagLocations[i];
            const tag = this.table.rows[flag.row].cells[flag.col];

            if (this.board[flag.row][flag.col].mine) tag.innerHTML = this.iconCorrect;
            else tag.innerHTML = this.iconWrong;
        }
    }

    /**
     * @function display a flag, question, or blank icon on selected cell.
     */
    setIcon() {
        let tag = this.table.rows[this.row].cells[this.col];

        // Rotation cycle for icon to display: blank -> flag -> question -> (repeat).
        if (tag.innerHTML === this.iconQuestion) tag.innerHTML = this.empty;
        else if (tag.innerHTML === this.iconFlag) tag.innerHTML = this.iconQuestion;
        else if (tag.innerHTML === this.empty) tag.innerHTML = this.iconFlag;

        this.addFlagLocation();
    }

    /**
     * @function add the coordinates of the flag icon to array.
     */
    addFlagLocation() {
        if (this.table.rows[this.row].cells[this.col].innerHTML === this.iconFlag)
            return this.flagLocations.push({row: this.row, col: this.col});

        this.removeFlagLocation();
    }

    /**
     * @function remove the coordinates of all cells that does not contain the flag icon.
     */
    removeFlagLocation() {
        for (let i = 0; i < this.flagLocations.length; i++) {
            if (this.flagLocations[i].row === this.row && this.flagLocations[i].col === this.col) {
                return this.flagLocations.splice(i, 1);
            }
        }
    }

    /**
     * @function checks if the selected cell is empty.
     *
     * @return {boolean} true if the selected cell is empty.
     */
    getEmptyCell() {
        return this.table.rows[this.row].cells[this.col].innerHTML === this.empty;
    }

    /**
     * @function captures users left and right mouse clicks.
     *
     * @param mouseCode {number} 0 represents left click, 2 represents right click.
     */
    getMouseEvent(mouseCode) {
        // event.button mouse click code.
        const leftClick = 0;
        const rightClick = 2;

        if (mouseCode === leftClick) {
            if (this.getEmptyCell()) {
                this.revealCell(this.row, this.col);
                this.checkGameOver();
                if (this.gameOver) this.checkFlags();
            } else {
                this.setIcon();
            }
        }

        if (mouseCode === rightClick) this.setIcon();
    }

    /**
     * @function checks if cell is within the game board.
     *
     * @param row {number} the row index being checked.
     * @param col {number} the column index being checked.
     *
     * @return true if the cell is located within the game board.
     */
    isCellInGameBoard(row, col) {
        return row >= 0 && col >= 0 && row < this.width && col < this.length;
    }
}


/**
 * @classdesc represents one individual square for the game.
 */
class Square {
    constructor() {
        this.number = 0;      // {number}  represents how many mines are adjacent to this object.
        this.mine = false;    // {boolean} true if the cell represents a mine.
        this.reveal = false;  // {boolean} true if the square will display its innerHTML to user.
    }
}

/**
 * @classdesc represents the time the user has left to beat the game.
 */
class Timer {
    constructor() {

    }
}



/*** JavaScript Functions ***/

/**
 * @function returns the row and column index of the selected game board cell.
 *
 * @param row {number} the row index of selected cell.
 * @param col {number} the column index of selected cell.
 */
const getCellIndex = (row, col) => {
    if (minesweeper.gameOver) return;
    if (minesweeper.board[row][col].reveal) return;

    minesweeper.row = row;
    minesweeper.col = col;

    minesweeper.getMouseEvent(event.button);
    minesweeper.updateDisplay();
}

/**
 * @function catch user's right click.
 */
const getRightClick = () => console.log("test");


/**
 * @function initialize the game with given level.
 *
 * @param level {number} the level of difficulty.
 */
const setLevel = (level) => minesweeper = new Minesweeper(level);

// global and window listener instance.
let minesweeper = new Minesweeper();