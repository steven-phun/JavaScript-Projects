/*jshint esversion: 6 */


/**
 * created by Steven Phun on May 13, 2020
 *
 * this JavaScript program allows the user to play or have this program solve a 16x16 Sudoku
 *
 * the game is based on the classic 9x9 Sudoku where the basic rules is the similar
 * place the numbers 0-9 and letters A-F into each row, column and 4x4 section once
 */


/**      >>>>>>>>>>  todo-list <<<<<<<<<<
 * TODO: add -> custom and new game functions
 * TODO: add -> notes function
 * TODO: add -> stop timer and user cannot edit
 *              -> after solve()
 *              -> upon completing the sudoku stop timer
 *                 -> code: add a size counter)
 * TODO: fix solve() -> after solve is called inputs still register to last selected cell
 *                   -> code: set selected cell to null after solve()
 * TODO: add custom()
 */


/**
 * this class represents the Sudoku using an array to store its data
 */
class Sudoku {
  constructor(board) {
    this.board = this.deepCopy(board);  // {array}   a copy of the board this class is working with
    this.invalid = []                   // {array}   stores the coordinates of invalid pairs
    this.size = 16;                     // {number}  represents the 16x16 grid
    this.empty = "";                    // {null}    an empty cell
    this.row = null;                    // {number}  the row index of the selected cell
    this.col = null;                    // {number}  the column index of the selected cell
    this.note = false;                  // {bool}    true if the note button is on
    this.copy = null;                   // {array}   deep copy of the original board

    // {element} the parent HTML board that the Sudoku grid will be inserted to
    this.tag = document.querySelector("#sudoku>table");

    // CSS color class variables
    this.setterColor = "setter-color";
    this.correctColor = "correct-color";
    this.wrongColor = "wrong-color";
    this.selectedColor = "selected-color";
    this.invalidColor = "invalid-color";
    this.noteColor = "note-color";


    // convert each array data to Cell Object
    this.toObject();
    // get the solution to the original board
    this.getOriginalSolution();
    // setup display for the game
    this.stopwatch = new Stopwatch()
    this.drawGrid();
    this.updateDisplay();
  }

  /**
   * this method will find a solution to do the Sudoku as fast as possible,
   * so it will not consider any user's interactions that will delay its process
   *
   * @return true if there is a possible solution {boolean}
   */
  fastSolve(board) {
    // recursive backtracking
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col].data === this.empty) {
          for (let val = 0; val < this.size; val++) {
            if (this.validateCell(board, row, col, val)) {
              board[row][col].data = val;
              // base case: if val leads to a solution
              if (this.fastSolve(board)) {
                return true;
                // backtrack: if the val does not lead to a solution
              } else {
                board[row][col] = new Cell(this.empty);
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  /**
   * convert the board cells into Cell Objects
   */
  toObject() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] !== this.empty) {
          this.board[row][col] = new Cell(this.board[row][col], true);
        } else {
          this.board[row][col] = new Cell(this.empty);
        }
      }
    }
  }

  /**
   * generates the grid for the Sudoku
   */
  drawGrid() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.tag.rows[row].cells[col].className = "";
        if (this.board[row][col].setter === true) {
          this.tag.rows[row].cells[col].innerHTML = this.board[row][col].data;
          if (this.board[row][col].setter) this.tag.rows[row].cells[col].classList.add(this.setterColor);
        } else {
          this.tag.rows[row].cells[col].classList.remove(this.setterColor);
          this.tag.rows[row].cells[col].innerHTML = this.empty;
        }
      }
    }
  }

  /**
   * display each current innerhtml cell value onto the Sudoku grid
   */
  updateDisplay() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.tag.rows[row].cells[col].innerHTML = (this.board[row][col].data);
      }
    }
  }

  /**
   * displays notes for current cell
   */
  updateNotes() {

  }

  /**
   * writes user's keyboard input to given cell
   *
   * @param event is the user's keyboard key input
   */
  getKeyboardInput(event) {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    if (event.key === "Backspace") remove();

    if (!this.checkInput(event.keyCode)) return;

    this.removeInvalid(this.row, this.col);
    this.board[this.row][this.col].data = this.toColor(this.toDecimal(event.keyCode));
    this.setInvalid();
    this.updateDisplay();
  }

  /**
   *  write the value of the button clicked to given cell
   *
   *  @pram value {number} the value of the button
   */
  getButtonInput(value) {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    this.board[this.row][this.col].data = value;
    this.removeInvalid(this.row, this.col);
    this.board[this.row][this.col].data = this.toColor(value);
    this.setInvalid();
    this.updateDisplay();
  }

  /**
   * removes the color class and value of current cell
   */
  removeColorTag() {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    this.board[this.row][this.col].data = this.empty;


    this.tag.rows[this.row].cells[this.col].className = this.empty;
    this.removeInvalid(this.row, this.col);
    this.setInvalid();
    this.updateDisplay();
  }

  /**
   * @return true if there does not exists the same 'val' in its row, column, and 4x4 section {boolean}
   *
   * @param board {board}  the board that is being validated
   * @param row   {number} row index of the cell
   * @param col   {number} col index of the cell
   * @param val   {number} val of the cell
   */
  validateCell(board, row, col, val) {
    return this.checkRow(board, row, val) && this.checkCol(board, col, val) && this.checkSection(board, row, col, val);
  }

  /**
   * this method's run time is slower because it is doing extra checks
   * to add and remove classes from the html tag, this method is implemented
   * to avoid slowing the other validate method when using solve()
   *
   * @return true if there does not exists a setter with the same 'val'
   *              in its row, column, and 4x4 section {boolean}
   */
  slowValidate(row, col, val) {
    const size = Math.sqrt(this.size); // represents the 4x4 section

    // formula for the first cell in given 4x4 section
    const rowSect = row - (row % size);
    const colSect = col - (col % size);

    // check row
    for (let i = 0; i < this.size; i++) {
      // only validate with setters and do not check itself
      if (this.board[i][col].setter === true && row !== i) {
        if (this.board[i][col].data === val) {
          this.invalid.push({row: this.row, col: this.col, otherRow: i, otherCol: col});
          return false;
        }
      }
    }

    // check column
    for (let j = 0; j < this.size; j++) {
      // only validate with setters and do not check itself
      if (this.board[row][j].setter === true && col !== j) {

        if (this.board[row][j].data === val) {
          // store invalid pairs
          this.invalid.push({row: this.row, col: this.col, otherRow: row, otherCol: j});
          return false;
        }
      }
    }

    // check section
    for (let i = rowSect; i < rowSect + size; i++) {
      for (let j = colSect; j < colSect + size; j++) {
        // only validate with setters and do not check itself
        if (this.board[i][j].setter === true && row !== i && col !== j) {
          if (this.board[i][j].data === val) {
            // store invalid pairs
            this.invalid.push({row: this.row, col: this.col, otherRow: i, otherCol: j});
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * @return true if there does not exists the same element in this row {boolean}
   */
  checkRow(board, row, val) {
    for (let col = 0; col < this.size; col++) {
      if (board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @return true if there does not exists the same element in this col {boolean}
   */
  checkCol(board, col, val) {
    for (let row = 0; row < this.size; row++) {
      if (board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @return true if there does not exists the same element in this 4x4 section {boolean}
   */
  checkSection(board, row, col, val) {
    const size = Math.sqrt(this.size); // represents the 4x4 section

    // formula for the first cell in given 4x4 section
    const rowSect = row - (row % size);
    const colSect = col - (col % size);

    for (let i = rowSect; i < rowSect + size; i++) {
      for (let j = colSect; j < colSect + size; j++) {
        if (board[i][j].data === val) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @return true if the keyboard key is a number between 0-9 or letter A-F
   */
  checkInput(input) {
    // their respective key codes
    let zero = 48, nine = 57, A = 65, F = 70;

    return (input >= zero && input <= nine) || (input >= A && input <= F);
  }

  /**
   * converts Decimal to Hexadecimal
   *
   * @param num    {number} the number to be converted to Hexadecimal
   * @return       'A' if num = 10  , 'B' if num = 11 ... 'F' if num = 15 {string}
   */
  toHex(num) {
    const decimal = 10; // represents when a Decimal needs to convert to Hexadecimal
    const hexadecimal = 'A'.charCodeAt(0)

    if (num < decimal) return num;

    return String.fromCharCode(num - decimal + hexadecimal);
  }

  /**
   * convert key code to a decimal number
   * letters A-F will be converted to number 10-15
   * note: Sudoku class method will convert decimal to hexadecimal
   *
   * @param key the key to convert
   * @return a decimal number
   */
  toDecimal(key) {
    // their respective key codes
    let zero = 48, nine = 57, A = 65, F = 70;
    let decimal = 10;

    if (key >= zero && key <= nine) return key - zero;

    if (key >= A && key <= F) return key - A + decimal;
  }

  /**
   * attempt to get a solution from the current board
   *
   * @param displaySolution {boolean} true, if the user wants to display the solution
   */
  getSolution(displaySolution) {
    this.compareSolution();
    this.deselect();

    if (displaySolution) {
      this.clearInvalid();
      this.clearWrongColorTags();
      this.board = this.deepCopy(this.copy);
      this.updateDisplay();
    }
  }

  /**
   * keeps track of the values user wants to add to notes
   */
  getNotes() {
    const tag = document.querySelector("#note-button");

    if (tag.classList.contains(this.noteColor)) return tag.classList.remove(this.noteColor);
    tag.classList.add(this.noteColor);
  }

  /**
   * clear the background of the previous selected cell
   *
   * @param bool {boolean} if true, add a background color on selected cell
   */
  setSelectedTag(bool) {

    const tag = document.querySelector("." + this.selectedColor);

    if (tag !== null) tag.classList.remove(this.selectedColor);

    if (bool) this.tag.rows[this.row].cells[this.col].classList.add(this.selectedColor);
  }

  /**
   * change the input text color to a different color
   * if user inputs a correct or wrong value in cell
   *
   * @param value {number} the number being colored
   * @return the original value to allow printing the value
   */
  toColor(value) {
    if (this.slowValidate(this.row, this.col, value)) {
      this.setCorrectColor(true, this.tag);
      this.setWrongColor(false, this.tag)
    } else {
      this.setWrongColor(true, this.tag);
      this.setCorrectColor(false, this.tag);
    }
    return value;
  }

  /**
   * @return tag with added or removed correct color class to tag
   *
   * @param add    {boolean} if true add the color class
   *                         if false remove the color class
   * @param tag    {tag}     the tag the class is being added to
   */
  setCorrectColor(add, tag) {
    if (add) return this.tag.rows[this.row].cells[this.col].classList.add(this.correctColor);

    return this.tag.rows[this.row].cells[this.col].classList.remove(this.correctColor)
  }

  /**
   * @return tag with added or removed wrong color class to tag
   *
   * @param add    {boolean} if true add the color class
   *                         if false remove the color class
   * @param tag    {tag}     the tag the class is being added to
   */
  setWrongColor(add, tag) {
    if (add) return this.tag.rows[this.row].cells[this.col].classList.add(this.wrongColor);

    return this.tag.rows[this.row].cells[this.col].classList.remove(this.wrongColor);
  }

  /**
   * set the background of current cell and the other cell that is
   * causing the current cell to be non-unique in row, column, or 4x4 section
   */
  setInvalid() {
    this.removeInvalidTag();

    // add invalid color tags to objects in array
    for (let i = 0; i < this.invalid.length; i++) {
      this.tag.rows[this.invalid[i].row].cells[this.invalid[i].col].classList.add(this.invalidColor);
      this.tag.rows[this.invalid[i].otherRow].cells[this.invalid[i].otherCol].classList.add(this.invalidColor);
    }
  }

  /**
   * removes every cell of the invalid tag
   * without removing them from the array
   */
  removeInvalidTag() {
    const tag = document.querySelectorAll("." + this.invalidColor);

    for (let i = 0; i < tag.length; i++) {
      tag[i].classList.remove(this.invalidColor);
    }
  }

  /**
   * remove every invalid value from array and its invalid color tag
   */
  clearInvalid() {
    this.invalid = [];

    this.removeInvalidTag();
  }

  /**
   * get the solution for the original board
   */
  getOriginalSolution() {
    // get a solution of the original board
    this.copy = this.deepCopy(this.board);
    this.fastSolve(this.copy);
  }

  /**
   * remove the invalid tag from this cell
   *
   * @param row
   * @param col
   */
  removeInvalid(row, col) {
    // remove the invalid tag from this cell
    const size = this.invalid.length;

    for (let i = size - 1; i >= 0; i--) {
      if (this.invalid[i].row === row && this.invalid[i].col === col) {
        this.invalid.splice(i, 1);
      }
    }
  }

  /**
   * deep copies an object
   *
   * @param object {object} the object to be deep copied
   */
  deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * compares the current board with the solution board
   */
  compareSolution() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].data !== this.empty) {
          if (this.board[i][j].data !== this.copy[i][j].data) {
            this.invalid.push({row: i, col: j, otherRow: i, otherCol: j});
          }
        }
      }
    }
    this.setInvalid();
  }

  /**
   * @return {boolean} true if the there are no invalid inputs on the board
   */
  isInvalidEmpty() {
    return this.invalid.length === 0;
  }

  /**
   * remove all wrong color tags from all cells
   */
  clearWrongColorTags() {
    const list = document.querySelectorAll("." + this.wrongColor);

    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove(this.wrongColor);
    }
  }


  /**
   * removes selected background color from current cell
   */
  deselect() {

    if (this.row === null || this.col === null) return;

    this.tag.rows[this.row].cells[this.col].classList.remove(this.selectedColor);
    this.updateDisplay();
  }
}



/**
 * this class represents each individual cells
 */
class Cell {
  constructor(data, setter=false) {
    this.data = data;        // {int}     value of a cell
    this.setter = setter;    // {boolean} true if this cell is a setter
    this.setter = setter;    // {boolean} true if this cell is a setter
    this.notes = new Set();  // {set}     for the user to keep track possible solution
  }
}

/**
 * this class represents how long the user has been playing
 */
class Stopwatch {
  constructor() {
    this.tag = document.querySelector("#stopwatch p");
    this.seconds = -1; // start at -1 in order to display start time at 0 seconds instead of 1 seconds
    this.minutes = 0;
    this.hours = 0;
  }

  /**
   * converts seconds to hours and minutes
   */
  getTime() {
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
    }

    if (this.minutes === 60) {
      this.minutes = 0;
      this.hours++;
    }
  }

  /**
   * @returns {string} the time in hours, minutes, and seconds
   */
  printTime() {
    if (this.hours !== 0) return this.tag.innerHTML = `${this.hours}H ${this.minutes}M ${this.seconds}S`;

    if (this.minutes !== 0) return this.tag.innerHTML = `${this.minutes}M ${this.seconds}S`;

    this.tag.innerHTML = this.seconds + "S";
  }
}

/**
 * keeps track of how long the user has been playing this game
 */
const stopwatch = () => {
  sudoku.stopwatch.seconds++;
  sudoku.stopwatch.getTime();
  sudoku.stopwatch.printTime();
}


/**
 * removes the color class of current cell
 * and removes the value in current cell
 */
const remove =() => sudoku.removeColorTag();


/**
 * writes user's keyboard input to given cell
 *
 * @param event is the user's keyboard key input
 */
const write = (event) => sudoku.getKeyboardInput(event);


/**
 *  writes the button clicked input to given cell
 *
 *  @pram value {number} the value of the button
 */
const buttonInput = (value) => sudoku.getButtonInput(value);


/**
 * update row and column index to the selected cell
 *
 * @param row    {number} the row index of the cell
 * @param col    {number} the column index of the cell
 */
const getCell = (row, col) => {
  sudoku.row = row;
  sudoku.col = col;

  sudoku.setSelectedTag(true);
}

/**
 * program will attempt to find a solution
 *
 * @param displaySolution true, if user wants to display solution
 */
const getSolution = (displaySolution) => sudoku.getSolution(displaySolution);


/**
 * reset current board to its original state
 */
const restartGame = () => {
  sudoku = new Sudoku(board[currentBoard % board.length]);
}


/**
 * generate a new board every time user asks for a new game
 */
const newGame = () => {
  currentBoard++;
  sudoku = new Sudoku(board[currentBoard % board.length]);
}

const getNotes = () => sudoku.getNotes();


/**
 * generate an empty Sudoku board
 */
const makeEmptyBoard = () => {
  let tempBoard = [];

  for (let i = 0; i < sudoku.size; i++) {
    tempBoard.push([]);
    for (let j = 0; j < sudoku.size; j++) {
      tempBoard[i].push(sudoku.empty);
    }
  }

  sudoku = new Sudoku(tempBoard);
}


/* global variables/isntance */

// different playing board
let empty = "";

const board = [
  // start of a new board
  [[empty, 5, empty, empty, empty, empty, empty, 7, 10, empty, empty, 14, 13, empty, empty, 15],
  [14, 10, empty, empty, empty, 15, 13, empty, empty, empty, 11, empty, empty, 5, empty, empty],
  [12, empty, 8, 11, empty, empty, empty, empty, 2, 15, 13, empty, 14, 10, 9, empty],
  [1, empty, 15, empty, 10, empty, 14, 9, 0, empty, empty, empty, empty, empty, empty, empty],
  [empty, 14, 10, 9, empty, empty, 15, 1, 12, 7, 8, 11, empty, empty, empty, empty],
  [11, 12, empty, empty, 3, 0, 4, 5, 1, 2, empty, empty, empty, empty, 10, 9],
  [4, empty, 5, 0, 11, empty, 8, empty, 14, 10, 9, 6, 15, empty, empty, 2],
  [empty, 1, empty, empty, empty, 9, empty, 10, 5, empty, 4, empty, empty, 12, empty, 8],
  [9, 6, 14, 10, 15, empty, empty, empty, 11, 12, empty, empty, empty, empty, empty, 5],
  [8, empty, empty, empty, empty, empty, 0, empty, empty, 1, empty, 15, 9, empty, empty, 10],
  [0, empty, 3, 5, 8, 12, empty, empty, 6, empty, 10, empty, 2, 15, empty, empty],
  [15, 13, empty, empty, 6, empty, 9, 14, 3, 5, 0, empty, empty, empty, 12, 7],
  [10, 9, empty, 14, empty, empty, empty, 15, 8, 11, 12, empty, empty, 0, 4, 3],
  [empty, empty, 11, empty, 0, 3, 5, empty, 15, empty, empty, empty, 10, 9, empty, empty],
  [empty, empty, 4, empty, 7, 11, 12, empty, 9, empty, empty, 10, 1, empty, empty, 13],
  [2, 15, empty, empty, 9, empty, empty, 6, empty, empty, 5, empty, empty, empty, 11, empty]],

  // start of a new board
  [[empty, empty, 4, empty, 3, 7, empty, empty, empty, empty, 12, 11, 0, 1, empty, empty],
  [empty, empty, 11, empty, 2, 4, empty, empty, 10, 1, 9, 0, empty, 5, empty, empty],
  [0, 10, 3, 5, empty, empty, empty, empty, empty, empty, empty, empty, 7, 6, empty, 9],
  [13, empty, 1, 2, 15, 9, empty, empty, empty, empty, 4, empty, 10, 14, empty, empty],
  [1, 11, empty, empty, empty, empty, 5, 10, 9, 14, empty, empty, empty, empty, 3, 15],
  [5, 2, empty, 13, 14, empty, empty, empty, empty, empty, empty, empty, 8, empty, 9, 6],
  [empty, 9, empty, empty, 8, 15, 1, 7, 2, 0, empty, 6, empty, empty, 11, empty],
  [empty, 3, 0, 12, 9, empty, 2, empty , empty, 15, empty, 5, empty, empty, 7, empty],
  [empty, 4, empty, empty, 5, empty, 0, empty, empty, 10, empty, 14, empty, empty, 15, empty],
  [empty, 5, empty, empty, 11, empty, 7, 15, 4, 3, empty, 8, empty, empty, 1, empty],
  [15, 8, empty, 1, empty, 3, empty, empty, empty, empty, empty, empty, 12, empty, 10, 13],
  [9, 14, empty, empty, empty, empty, 13, 2, 15, 12, empty, empty, empty, empty, 0, 5],
  [empty, empty, 5, 6, empty, 2, empty, empty, empty, empty, 10, empty, 13, 7, empty, empty],
  [11, empty, 2, 15, empty, empty, empty, empty, empty, empty, empty, empty, 1, 3, empty, 4],
  [empty, empty, empty, empty, 13, 14, 12, 11, 7, 6, 8, 2, empty, empty, empty, empty],
  [empty, empty, 9, empty, 7, 5, empty, empty, empty, empty, 0, 3, empty, 12, empty, empty]]
  ]


let sudoku = new Sudoku(board[0]);
let currentBoard = 0; // keeps track of current board's index


/* window listener functions */
window.setInterval(stopwatch, 1000);
window.addEventListener("keydown", write);