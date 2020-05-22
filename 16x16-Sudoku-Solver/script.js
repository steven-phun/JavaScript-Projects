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
 * TODO: notes: highlight the keyboard of values that got noted.
 *       when note is unchecked de-highlight them.
 */


/**
 * this class represents the Sudoku using an array to store its data
 */
class Sudoku {
  constructor(board, tag) {
    this.board = board;  // {array}      a copy of the board this class is working with
    this.invalid = []    // {array}      stores the coordinates of invalid pairs
    this.tag = tag;      // {html board} the parent HTML board that the Sudoku grid will be inserted to
    this.size = 16;      // {number}     represents the 16x16 grid
    this.empty = "";     // {null}       an empty cell
    this.row = null;     // {number}     the row index of the selected cell
    this.col = null;     // {number}     the column index of the selected cell
    this.note = false;   // {bool}       true if the note button is on


    // convert each cell to the object Cell
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === this.empty) {
          this.board[row][col] = new Cell(this.empty);
        } else {
          this.board[row][col] = new Cell(this.board[row][col], true);
        }
      }
    }

    // set up game
    this.drawGrid();
    this.updateCells();
  }

  /**
   * this method will find a solution to do the Sudoku as fast as possible,
   * so it will not consider any user's interactions that will delay its process
   *
   * @return true if there is a possible solution {boolean}
   */
  solve() {
    // recursive backtracking
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col].data === this.empty) {
          for (let val = 0; val < this.size ; val++) {
            if (this.validate(row, col, val)) {
              this.board[row][col].data = val;
              // base case: if val leads to a solution
              if (this.solve()) {
                return true;
                // backtrack: if the val does not lead to a solution
              } else {
                this.board[row][col] = new Cell(this.empty);
              }
            }
          }
          return false;
        }
      }
    }
    this.updateCells();
    return true;
  }

  /**
   * generates the grid for the Sudoku
   */
  drawGrid() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col].setter === true) {
          this.tag.rows[row].cells[col].innerHTML = this.board[row][col].data;
          this.tag.rows[row].cells[col].classList.add("setter-color");
        } else {
          this.tag.rows[row].cells[col].innerHTML = this.empty;
        }
      }
    }
  }

  /**
   * display each current innerhtml cell value onto the Sudoku grid
   */
  updateCells() {
    const tag = document.querySelector("#play-area h1");
    tag.innerHTML = "Let's Play Sudoku!";

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.tag.rows[row].cells[col].innerHTML = this.toHex(this.board[row][col].data);
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
  write(event) {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    if (event.key === "Backspace") remove();

    if (!this.checkInput(event.keyCode)) return;

    this.delInvalid(this.row, this.col);
    this.board[this.row][this.col].data = this.setColor(this.toDecimal(event.keyCode));
    this.setInvalid();
    this.updateCells();
  }

  /**
   *  write the value of the button clicked to given cell
   *
   *  @pram value {number} the value of the button
   */
  buttonInput(value) {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    this.board[this.row][this.col].data = value;
    this.delInvalid(this.row, this.col);
    this.board[this.row][this.col].data = this.setColor(value);
    this.setInvalid();
    this.updateCells();
  }

  /**
   * removes the color class of current cell
   * and removes the value in current cell
   */
  remove() {
    if (this.row === null || this.col === null) return;

    if (this.board[this.row][this.col].setter === true) return;

    this.board[this.row][this.col].data = this.empty;


    this.tag.rows[this.row].cells[this.col].className = "";
    this.delInvalid(this.row, this.col);
    this.setInvalid();
    this.updateCells();
  }

  /**
   * @return true if there does not exists the same 'val' in its row, column, and 4x4 section {boolean}
   *
   * @param row  {number} row index of the cell
   * @param col  {number} col index of the cell
   * @param val  {number} val of the cell
   */
  validate(row, col, val) {
    return this.checkRow(row, val) && this.checkCol(col, val) && this.checkSection(row, col, val);
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
          this.invalid.push({row:this.row, col:this.col, otherRow:i, otherCol:col});
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
          this.invalid.push({row:this.row, col:this.col, otherRow:row, otherCol:j});
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
            this.invalid.push({row:this.row, col:this.col, otherRow:i, otherCol:j});
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
  checkRow(row, val) {
    for (let col = 0; col < this.size; col++) {
      if (this.board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @return true if there does not exists the same element in this col {boolean}
   */
  checkCol(col, val) {
    for (let row = 0; row < this.size; row++) {
      if (this.board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @return true if there does not exists the same element in this 4x4 section {boolean}
   */
  checkSection(row, col, val) {
    const size = Math.sqrt(this.size); // represents the 4x4 section

    // formula for the first cell in given 4x4 section
    const rowSect = row - (row % size);
    const colSect = col - (col % size);

    for (let i = rowSect; i < rowSect + size; i++) {
      for (let j = colSect; j < colSect + size; j++) {
        if (this.board[i][j].data === val) {
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
   * program will attempt to find a solution
   */
  getSolution() {
    const tag = document.querySelector("#play-area h1");

    if (this.invalid.length > 0) return tag.innerHTML = "Remove Invalid(Red) Values";

    tag.innerHTML = "Solving..."
    this.setSelected(false);

    setTimeout(_ => this.setPrompt(tag), 0);
  }

  /**
   * @return the tag from given a class tag
   */
  getClassTag(classTag) {
    return document.querySelector("." + classTag);
  }

  /**
   * keeps track of the values user wants to add to notes
   */
  getNotes() {
    const tag = document.querySelector("#note-button");
    const classTag = "note-color"

    if (tag.classList.contains(classTag)) return tag.classList.remove(classTag);
    tag.classList.add(classTag);
  }

  /**
   * prompt the user if a solution is found or not
   *
   * @param tag   the html tag that will display the text
   */
  setPrompt(tag) {
    if (this.solve()) {
      tag.innerHTML = "Solution Found :)";
    } else {
      tag.innerHTML = "No Solution Found :(";
    }
  }

  /**
   * clear the background of the previous selected cell
   *
   * @param bool {boolean} if true, add a background color on selected cell
   */
  setSelected(bool) {
    const color = "selected-color";

    const tag = this.getClassTag(color);

    if (tag !== null) tag.classList.remove(color);

    if (bool) this.tag.rows[this.row].cells[this.col].classList.add(color);
  }

  /**
   * change the input text color to a different color
   * if user inputs a correct or wrong value in cell
   *
   * @param value {number} the number being colored
   * @return the original value to allow printing the value
   */
  setColor(value) {
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
    const correctColor = "correct-color";

    if (add) return this.tag.rows[this.row].cells[this.col].classList.add(correctColor);

    return this.tag.rows[this.row].cells[this.col].classList.remove(correctColor)
  }

  /**
   * @return tag with added or removed wrong color class to tag
   *
   * @param add    {boolean} if true add the color class
   *                         if false remove the color class
   * @param tag    {tag}     the tag the class is being added to
   */
  setWrongColor(add, tag) {
    const wrongColor = "wrong-color";

    if (add) return this.tag.rows[this.row].cells[this.col].classList.add(wrongColor);

    return this.tag.rows[this.row].cells[this.col].classList.remove(wrongColor);
  }

  /**
   * set the background of current cell and the other cell that is
   * causing the current to be non-unique in row, column, or 4x4 section
   */
  setInvalid() {
    const invalidColor = "invalid-color";
    const tag = document.querySelectorAll("." + invalidColor);

    // remove all invalid color tag
    for (let i = 0; i < tag.length; i++) {
      tag[i].classList.remove(invalidColor);
    }

    // add invalid color tag
    for (let i = 0; i < this.invalid.length; i++) {
      this.tag.rows[this.invalid[i].row].cells[this.invalid[i].col].classList.add(invalidColor);
      this.tag.rows[this.invalid[i].otherRow].cells[this.invalid[i].otherCol].classList.add(invalidColor);
    }
  }

  /**
   * del the invalid tag from this cell
   *
   * @param row
   * @param col
   */
  delInvalid(row, col) {
    // remove the invalid tag from this cell
    for (let i = 0; i < this.invalid.length; i++) {
      if (this.invalid[i].row === row && this.invalid[i].col === col) {
        this.invalid.splice(i,1);
      }
    }
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


// test board
const empty = "";
const test = [[empty, 5, empty, empty, empty, empty, empty, 7, 10, empty, empty, 14, 13, empty, empty, 15],
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
  [2, 15, empty, empty, 9, empty, empty, 6, empty, empty, 5, empty, empty, empty, 11, empty]]

// instantiate sudoku object
let div = document.querySelector("#sudoku>table");
const sudoku = new Sudoku(test, div);
window.addEventListener("keydown", write);


/**
 * removes the color class of current cell
 * and removes the value in current cell
 */
function remove() {
  sudoku.remove();
}


/**
 * writes user's keyboard input to given cell
 *
 * @param event is the user's keyboard key input
 */
function write(event) {
  sudoku.write(event);
}

/**
 *  writes the button clicked input to given cell
 *
 *  @pram value {number} the value of the button
 */
function buttonInput(value) {
  sudoku.buttonInput(value);
}

/**
 * update row and column index to the selected cell
 *
 * @param row    {number} the row index of the cell
 * @param col    {number} the column index of the cell
 */
function getCell(row, col) {
  sudoku.row = row;
  sudoku.col = col;

  sudoku.setSelected(true);
}

/**
 * program will attempt to find a solution
 */
function getSolution() {
  sudoku.getSolution();
}

/**
 * reload users browser
 */
function restartGame() {
  location.reload();
  return false;
}

function getNotes(){
  sudoku.getNotes();
}