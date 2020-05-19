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
//TODO: remove invalid when doing solve.
//TODO: convert solve() to class and interactions as functions()

/** global variable/instance */
/** represents the Sudoku to be solved */
test = [[Sudoku.empty, 5, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, 7, 10, Sudoku.empty, Sudoku.empty, 14, 13, Sudoku.empty, Sudoku.empty, 15],
  [14, 10, Sudoku.empty, Sudoku.empty, Sudoku.empty, 15, 13, Sudoku.empty, Sudoku.empty, Sudoku.empty, 11, Sudoku.empty, Sudoku.empty, 5, Sudoku.empty, Sudoku.empty],
  [12, Sudoku.empty, 8, 11, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, 2, 15, 13, Sudoku.empty, 14, 10, 9, Sudoku.empty],
  [1, Sudoku.empty, 15, Sudoku.empty, 10, Sudoku.empty, 14, 9, 0, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty],
  [Sudoku.empty, 14, 10, 9, Sudoku.empty, Sudoku.empty, 15, 1, 12, 7, 8, 11, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty],
  [11, 12, Sudoku.empty, Sudoku.empty, 3, 0, 4, 5, 1, 2, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, 10, 9],
  [4, Sudoku.empty, 5, 0, 11, Sudoku.empty, 8, Sudoku.empty, 14, 10, 9, 6, 15, Sudoku.empty, Sudoku.empty, 2],
  [Sudoku.empty, 1, Sudoku.empty, Sudoku.empty, Sudoku.empty, 9, Sudoku.empty, 10, 5, Sudoku.empty, 4, Sudoku.empty, Sudoku.empty, 12, Sudoku.empty, 8],
  [9, 6, 14, 10, 15, Sudoku.empty, Sudoku.empty, Sudoku.empty, 11, 12, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, 5],
  [8, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, Sudoku.empty, 0, Sudoku.empty, Sudoku.empty, 1, Sudoku.empty, 15, 9, Sudoku.empty, Sudoku.empty, 10],
  [0, Sudoku.empty, 3, 5, 8, 12, Sudoku.empty, Sudoku.empty, 6, Sudoku.empty, 10, Sudoku.empty, 2, 15, Sudoku.empty, Sudoku.empty],
  [15, 13, Sudoku.empty, Sudoku.empty, 6, Sudoku.empty, 9, 14, 3, 5, 0, Sudoku.empty, Sudoku.empty, Sudoku.empty, 12, 7],
  [10, 9, Sudoku.empty, 14, Sudoku.empty, Sudoku.empty, Sudoku.empty, 15, 8, 11, 12, Sudoku.empty, Sudoku.empty, 0, 4, 3],
  [Sudoku.empty, Sudoku.empty, 11, Sudoku.empty, 0, 3, 5, Sudoku.empty, 15, Sudoku.empty, Sudoku.empty, Sudoku.empty, 10, 9, Sudoku.empty, Sudoku.empty],
  [Sudoku.empty, Sudoku.empty, 4, Sudoku.empty, 7, 11, 12, Sudoku.empty, 9, Sudoku.empty, Sudoku.empty, 10, 1, Sudoku.empty, Sudoku.empty, 13],
  [2, 15, Sudoku.empty, Sudoku.empty, 9, Sudoku.empty, Sudoku.empty, 6, Sudoku.empty, Sudoku.empty, 5, Sudoku.empty, Sudoku.empty, Sudoku.empty, 11, Sudoku.empty]];


/**
 * this class represents the Sudoku using an array to store its data
 */
class Sudoku {
  constructor(board) {
    this.board = board;  // array: a copy of the board this class is working with
    this.size = 16;      // int:   represents the 16x16 grid
    this.empty = ""; // represents and empty cell

    // convert each cell to the object Cell
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === this.empty) {
          this.board[row][col] = new Cell();
        } else {
          this.board[row][col] = new Cell(this.board[row][col], true);
        }
      }
    }
  }

  /**
   * this method will find a solution to do the Sudoku as fast as possible,
   * so it will not consider any user's interactions that will delay its process
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
                this.board[row][col] = new Cell();
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
   * @return true if there does not exists the same 'val' in its row, column, and 4x4 section
   *
   * @param row  int: row index of the cell
   * @param col  int: col index of the cell
   * @param val  int: val of the cell
   */
  validate(row, col, val) {
    return this.checkRow(row, val) && this.checkCol(col, val) && this.checkSection(row, col, val);
  }

  /**
   * @return true if there does not exists the same element in this row
   */
  checkRow(row, val) {
    for (let col = 0; col < this.size; col++) {
      if (this.board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @return true if there does not exists the same element in this col
   */
  checkCol(col, val) {
    for (let row = 0; row < this.size; row++) {
      if (this.board[row][col].data === val) return false;
    }
    return true;
  }

  /**
   * @return true if there does not exists the same element in this 4x4 section
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
   * generates the table with <tr> and <td> for the sudoku grid
   *
   * @param tag    the parent HTML tag that the table will be inserted to
   */
  drawGrid(tag) {
    const getTag = document.querySelector(tag);

    for (let row = 0; row < this.size; row++) {
      const tempRow = getTag.insertRow();
      tempRow.classList.add("row");

      for (let col = 0; col < this.size; col++) {
        const tempCol = tempRow.insertCell();
        tempCol.classList.add("col");

        if (this.board[row][col] !== this.empty) {
          getTag.rows[row].cells[col].setAttribute('onclick', 'getSetter()');
          getTag.rows[row].cells[col].innerHTML = toHex(array[row][col]);
        } else {
          getTag.rows[row].cells[col].setAttribute('onclick', 'getCell(' + row + ',' + col + ')');
          getTag.rows[row].cells[col].innerHTML = this.empty;
        }
      }
    }
  }

  // /**
//  * converts Decimal to Hexadecimal
//  *
//  * @param num    the number to be converted to Hexadecimal
//  * @return       'A' if num = 10  , 'B' if num = 11 ... 'F' if num = 15
//  */
// function toHex(num) {
//   const decimal = 10; // represents when a Decimal needs to convert to Hexadecimal
//   const hexadecimal = 'A'.charCodeAt(0)
//
//   if (num >= decimal) {
//     num = String.fromCharCode(num - decimal + hexadecimal);
//   }
//   return num;
// }
//
//
// /**
//  * converts Hexadecimal to Decimal
//  *
//  * @param char   the character to be converted to Decimal
//  * @return       10 if char = 'A'  ,  11 if char = 'B'  ...  15 if char = 'F'
//  */
// function toDec(char) {
//   const decimal = 10; // represents the Decimal form of a Hexadecimal
//   const hexadecimal = 'A'.charCodeAt(0);
//   const asiic = char.toUpperCase().charCodeAt(0);
//
//   if (Number(asiic) >= hexadecimal) {
//     char = asiic - 'A'.charCodeAt(0) + decimal;
//   }
//   return char;
// }
}


/**
 * this class represents each individual cells
 */
class Cell {
  constructor(data=empty, setter=false, pencil=false) {
    this.data = data;        // int:  value of a cell
    this.setter = setter;    // bool: true if this cell is a setter
    this.pencil = pencil;    // bool: true if the user placed a value in this cell
    this.notes = new Set();  // set:  for the user to keep track possible solution
  }
}


/** global variable/instance */
const sudoku = new Sudoku(test); // the object that represents the Sudoku grid


/** main */
function main() {
  sudoku.drawGrid(sudoku,'#sudoku>table');
  window.addEventListener("keydown", write);
}




//
//
// /**
//  * @pre a solution to display
//  * @post display the solution on the sudoku grid
//  */
// function display() {
//   for (let row = 0; row < size; row++) {
//     for (let col = 0; col < size; col++) {
//       if (board.rows[row].cells[col].innerHTML === empty) {
//         board.rows[row].cells[col].innerHTML = toHex(array[row][col]);
//       }
//     }
//   }
// }
//
//
// /**
//  * writes a valid input on the sudoku board.
//  * a valid input is a number 0-9 or letter A-F
//  *
//  * @param event    user's keyboard key input
//  */
// function write(event) {
//
//   if (row === undefined || col === undefined) return;
//
//   if (event.key === "Backspace") remove();
//
//   if (!checkInput(event.keyCode)) return;
//
//   board.rows[row].cells[col].innerHTML = toColor(event.key, row, col, Number(toDec(event.key)));
// }
//
//
// /**
//  * removes the value in current cell
//  *
//  * @pre cell is non-null
//  */
// function remove() {
//   board.rows[row].cells[col].innerHTML = empty;
//   array[row][col] = empty;
//   delInvalid(row, col);
// }
//
//
// /**
//  *  writes the value of the button clicked at given cell.
//  *
//  *  @pre cell is non-null
//  *  @pram value the value to be displayed
//  */
// function keypad(value) {
//   if (row !== undefined && col !== undefined) {
//     board.rows[row].cells[col].innerHTML = toHex(toColor(value, row, col, value));
//   }
// }
//
//
// /**
//  * @post prompts the user that the program is attempting to find a solution
//  */
// function getSolution() {
//   const tag = document.querySelector("#play-area h1");
//   tag.innerHTML = "Solving..."
//
//   setTimeout(_ => solution(tag), 0);
// }
//
//
// /**
//  * helper method for getSolution() to async solve()
//  *
//  * @param tag   the html tag that will display the text
//  */
// function solution(tag) {
//   if (solve()) {
//     tag.innerHTML = "Solution Found :)";
//   } else {
//     tag.innerHTML = "No Solution Found :(";
//   }
// }
//
//
// /**
//  * return the row and column index of a cell
//  *
//  * @param rowIndex    the row being indexed
//  * @param colIndex    the column being indexed
//  */
// function getCell(rowIndex, colIndex) {
//   row = rowIndex;
//   col = colIndex;
//
//   setBackground();
// }
//
//
// /**
//  * resets the mouse click position
//  */
// function getSetter() {
//   row = undefined;
//   col = undefined;
// }
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
//   const tag = board.rows[rowIndex].cells[colIndex];
//   tag.classList.add(invalidColor);
//
//   invalid.push({row: row, col: col, rowDex: rowIndex, colDex: colIndex});
// }
//
//
// /**
//  * set the background color of the selected cell
//  */
// function setBackground() {
//   const tagClass = "selected-color";
//   const list = document.querySelectorAll("#sudoku td");
//
//   for (let i = 0; i < list.length; i++) {
//     list[i].classList.remove(tagClass);
//   }
//   board.rows[row].cells[col].classList.add(tagClass);
// }
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
//   // add the color class to its tag and change the color in CSS
//   const tag = board.rows[row].cells[col];
//   const correctColor = "correct-color";
//   const wrongColor = "wrong-color";
//
//   delInvalid(row, col);
//
//   if (validate(row, col, val)) {
//     tag.classList.add(correctColor);
//     tag.classList.remove(wrongColor);
//   } else {
//     tag.classList.add(wrongColor);
//     tag.classList.remove(correctColor);
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
//       const tag = board.rows[invalid[i].rowDex].cells[invalid[i].colDex];
//       tag.classList.remove(invalidColor);
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
//     const tag = board.rows[invalid[i].rowDex].cells[invalid[i].colDex];
//     tag.classList.add(invalidColor);
//   }
// }
//
//
//

main();