/*jshint esversion: 6 */

test = [
  [null, 5, null, null, null, null, null, 7, 10, null, null, 14, 13, null, null, 15],
  [14, 10, null, null, null, 15, 13, null, null, null, 11, null, null, 5, null, null],
  [12, null, 8, 11, null, null, null, null, 2, 15, 13, null, 14, 10, 9, null],
  [1, null, 15, null, 10, null, 14, 9, 0, null, null, null, null, null, null, null],
  [null, 14, 10, 9, null, null, 15, 1, 12, 7, 8, 11, null, null, null, null],
  [11, 12, null, null, 3, 0, 4, 5, 1, 2, null, null, null, null, 10, 9],
  [4, null, 5, 0, 11, null, 8, null, 14, 10, 9, 6, 15, null, null, 2],
  [null, 1, null, null, null, 9, null, 10, 5, null, 4, null, null, 12, null, 8],
  [9, 6, 14, 10, 15, null, null, null, 11, 12, null, null, null, null, null, 5],
  [8, null, null, null, null, null, 0, null, null, 1, null, 15, 9, null, null, 10],
  [0, null, 3, 5, 8, 12, null, null, 6, null, 10, null, 2, 15, null, null],
  [15, 13, null, null, 6, null, 9, 14, 3, 5, 0, null, null, null, 12, 7],
  [10, 9, null, 14, null, null, null, 15, 8, 11, 12, null, null, 0, 4, 3],
  [null, null, 11, null, 0, 3, 5, null, 15, null, null, null, 10, 9, null, null],
  [null, null, 4, null, 7, 11, 12, null, 9, null, null, 10, 1, null, null, 13],
  [2, 15, null, null, 9, null, null, 6, null, null, 5, null, null, null, 11, null]
];

let board = null;
let row = null;
let col = null;
let val = null;


function main() {
  drawGrid('#sudoku>table');
}


/*
 * generates the table <tr> and <td> for the sudoku grid
 *
 * @param tag    the parent HTML tag that the table will be inserted
 */
function drawGrid(tag) {
  this.board = document.querySelector(tag);

  for (i = 0; i < 16; i++) {
    const row = this.board.insertRow();
    row.classList.add("row");

    for (j = 0; j < 16; j++) {
      const col = row.insertCell();
      col.classList.add("col");

      if (this.test[i][j] !== null) {
        this.board.rows[i].cells[j].innerHTML = convertToChar(this.test[i][j]);
        this.board.rows[i].cells[j].setAttribute('onclick', 'resetMouseClick()');
      } else {
        this.board.rows[i].cells[j].setAttribute('onclick', 'getCell(' + i + ',' + j + ')');
      }
    }
  }
}


/*
 * return the row and column index of a cell
 *
 * @param row    the row being indexed
 * @param col    the column being indexed
 */
function getCell(row, col) {
  this.row = row;
  this.col = col;
}


/*
 * resets the mouse click posistion
 */
function resetMouseClick() {
  this.row = null;
  this.col = null;
}


/*
 * allows the user to write a valid input on the sudoku board.
 * a valid input is a number 0-9 or letter A-F
 * @param event    user''s keyboard key input
 */
function writeToCell(event) {
  if (this.row === null || this.col === null) return;

  if (!checkInput(event.keyCode)) return;

  key = event.key.fontcolor("#5DADE2"); // sky blue
  this.board.rows[this.row].cells[this.col].innerHTML = key;
}


/*
 * @return true if the keyboard key is a number 0-9 or letter A-F
 */
function checkInput(input) {
  // keyCode  48 -> 0        57 -> 9          65 -> A        70 -> F
  if ((input >= 48 && input <= 57) || (input >= 65 && input <= 70)) return true;

  return false;
}


/*
 * converts double digits to single character
 *
 * @param num    the number to be converted to char
 * @return       number = 10 return 'A'
 *               number = 11 return 'B'
 */
function convertToChar(num) {

  if (num > 9) {
    num = String.fromCharCode(num - 10 + 'A'.charCodeAt(0));
  }
  return num;
}


main();
window.addEventListener('keydown', writeToCell);
