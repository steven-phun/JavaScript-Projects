/*jshint esversion: 6 */


/**
 * created by Steven Phun on May 13, 2020
 *
 * this JavaScript program allows the user to play or have this program solve a 16x16 Sudoku
 *
 * the game is based on the classic 9x9 Sudoku where the basic rules is the similar
 * place the numbers 0-9 and letters A-F into each row, column and 4x4 section once
 */


//TODO: notes: highlight the keyboard of values that got noted.
//             when note is unchecked de-highlight them.


/**
 * this class represents the Sudoku using an array to store its data
 */
class Sudoku {
  constructor(board, tag) {
    this.board = board;  // {array}      a copy of the board this class is working with
    this.tag = tag;      // {html board} the parent HTML board that the Sudoku grid will be inserted to
    this.size = 16;      // {number}     represents the 16x16 grid
    this.empty = "";     // {null}       an empty cell

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
   * generates the grid for the Sudoku
   */
  drawGrid() {

    for (let row = 0; row < this.size; row++) {
      const tempRow = this.tag.insertRow();
      tempRow.classList.add("row");
      for (let col = 0; col < this.size; col++) {
        const tempCol = tempRow.insertCell();
        tempCol.classList.add("col");

        this.tag.rows[row].cells[col].setAttribute('onclick', 'getCell(' + row + ',' + col + ')');
        if (this.board[row][col].setter === true) {
          this.tag.rows[row].cells[col].innerHTML = this.board[row][col].data;
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
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.tag.rows[row].cells[col].innerHTML = this.toHex(this.board[row][col].data);
      }
    }
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
}


/**
 * this class represents each individual cells
 */
class Cell {
  constructor(data, setter=false, pencil=false) {
    this.data = data;        // {int}     value of a cell
    this.setter = setter;    // {boolean} true if this cell is a setter
    this.pencil = pencil;    // {boolean} true if the user placed a value in this cell
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

// row and col index of clicked cell
let row = null;
let col = null;


/** main */
function main() {
  window.addEventListener("keydown", write);
}

/**
 * writes user's keyboard input to given cell
 *
 * @param event is the user's keyboard key input
 */
function write(event) {

  if (row === null || col === null) return;

  if (event.key === "Backspace") remove();

  // if (!checkInput(event.keyCode)) return;
  //
  // board.rows[row].cells[col].innerHTML = toColor(event.key, row, col, Number(toDec(event.key)));
}


/**
 *  writes the button clicked input to given cell
 *
 *  @pram value {number} the value of the button
 */
function buttonInput(value) {
  if (row === null || col === null) return;

  if (sudoku.board[row][col].setter === true) return;

  sudoku.board[row][col].data = value;
  sudoku.updateCells();
}



/**
 * removes the value in current cell
 */
function remove() {
  if (row === null || col === null) return;

  if (sudoku.board[row][col].setter === true) return;

  sudoku.board[row][col].data = sudoku.empty;
  sudoku.updateCells();
  //delInvalid(row, col);
}


/**
 * update row and column index to the selected cell
 *
 * @param rowIndex    {number} the row index of the cell
 * @param colIndex    {number} the column index of the cell
 */
function getCell(rowIndex, colIndex) {
  row = rowIndex;
  col = colIndex;

  setSelected();
}


/**
 * program will attempt to find a solution
 */
function getSolution() {
  const tag = document.querySelector("#play-area h1");
  tag.innerHTML = "Solving..."

  setTimeout(_ => setPrompt(tag), 0);
}


/**
 * set the background color of the selected cell and
 * remove the background of the previous selected cell
 */
function setSelected() {
  const color = "selected-color";
  const tag = document.querySelectorAll("." + color);

  for (let i = 0; i < tag.length; i++) {
    tag[i].classList.remove(color);
  }
  sudoku.tag.rows[row].cells[col].classList.add(color);
}


/**
 * prompt the user if a solution is found or not
 *
 * @param tag   the html tag that will display the text
 */
function setPrompt(tag) {
  if (sudoku.solve()) {
    tag.innerHTML = "Solution Found :)";
  } else {
    tag.innerHTML = "No Solution Found :(";
  }
}



//



//
//

//
//
//
// /**
//  * add the cell to array where the user place an invalid input and
//  * the cell of the setter responsible for the invalid input
//  *
//  * @param rowIndex is the row index being stored
//  * @param colIndex is the col index begin stored
//  */
// function setInvalid(rowIndex, colIndex) {
//   const invalidColor = "invalid-color";
//   const board = board.rows[rowIndex].cells[colIndex];
//   board.classList.add(invalidColor);
//
//   invalid.push({row: row, col: col, rowDex: rowIndex, colDex: colIndex});
// }
//
//

//
//

//
//
// /**
//  * change the color of given 'text'
//  *
//  * @pram text     the text to change color
//  * @return        the text with its corresponding color
//  */
// function toColor(text, row, col, val) {
//   // add the color class to its board and change the color in CSS
//   const board = board.rows[row].cells[col];
//   const correctColor = "correct-color";
//   const wrongColor = "wrong-color";
//
//   delInvalid(row, col);
//
//   if (validate(row, col, val)) {
//     board.classList.add(correctColor);
//     board.classList.remove(wrongColor);
//   } else {
//     board.classList.add(wrongColor);
//     board.classList.remove(correctColor);
//   }
//   return text;
// }
//
//
// /**
//  * @return true if there does not exists the same element placed
//  *                  in its row, column, and 4x4 section
//  */
// function validate(row, col, val) {
//   return checkRow(row, val) && checkColumn(col, val) && checkSection(row, col, val);
// }
//
//
// /**
//  * return true if there does not exists the same element in this row
//  */
// function checkRow(row, val) {
//   for (let col = 0; col < size; col++) {
//     if (array[row][col] === val) {
//       //setInvalid(row, col);
//       return false;
//     }
//   }
//   return true;
// }
//
//
// /**
//  * return true if there does not exists the same element in this column
//  */
// function checkColumn(col, val) {
//   for (let row = 0; row < size; row++) {
//     if (array[row][col] === val) {
//       //setInvalid(row, col);
//       return false;
//     }
//   }
//   return true;
// }
//
//
// /**
//  * return true if there does not exists the same element in this section
//  */
// function checkSection(row, col, val) {
//   const sectionSize = Math.sqrt(size); // represents the 4x4 section
//
//   // formula for the first cell in given 4x4 section
//   const rowSection = row - (row % sectionSize);
//   const colSection = col - (col % sectionSize);
//
//   for (let i = rowSection; i < rowSection + sectionSize; i++) {
//     for (let j = colSection; j < colSection + sectionSize; j++) {
//       if (array[i][j] === val) {
//         //setInvalid(i, j);
//         return false;
//       }
//     }
//   }
//   return true;
// }
//
//
// /*
//  * @return true if the keyboard key is a number 0-9 or letter A-F
//  */
// function checkInput(input) {
//   // keyCode       48 -> 0        57 -> 9          65 -> A        70 -> F
//   return (input >= 48 && input <= 57) || (input >= 65 && input <= 70);
// }
//
//
// /**
//  * remove any invalid values that no longer exists
//  */
// function delInvalid(row, col) {
//   const invalidColor = "invalid-color";
//
//   for (let i = 0; i < invalid.length; i++) {
//     if (row === invalid[i].row && col === invalid[i].col) {
//       const board = board.rows[invalid[i].rowDex].cells[invalid[i].colDex];
//       board.classList.remove(invalidColor);
//       invalid.splice(i, 1);
//       checkInvalid();
//     }
//   }
// }
//
//
// /**
//  * checks and mark any invalid values
//  */
// function checkInvalid() {
//   const invalidColor= "invalid-color";
//
//   for(let i = 0; i < invalid.length; i++) {
//     const board = board.rows[invalid[i].rowDex].cells[invalid[i].colDex];
//     board.classList.add(invalidColor);
//   }
// }
//




main();