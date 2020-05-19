/*jshint esversion: 6 */


/** global variables/instances */
const size = 16; // represents the 16x16 grid size
const empty = ""; // represents an empty cell
let board = undefined; // represents the sudoku gird
let row = undefined; // row index of the grid
let col = undefined; // column index of the grid
let val = undefined; // value of the square


/** represents the board in array form */
let array = [
  [empty, 5, empty, empty, empty, empty, empty, 7, 10, empty, empty, 14, 13, empty, empty, 15],
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
  [2, 15, empty, empty, 9, empty, empty, 6, empty, empty, 5, empty, empty, empty, 11, empty]
];


/** main */
function main() {

  window.addEventListener("keydown", write);
  drawGrid('#sudoku>table');
}


/**
 * generates the table with <tr> and <td> for the sudoku grid
 *
 * @param tag    the parent HTML tag that the table will be inserted
 */
function drawGrid(tag) {
  board = document.querySelector(tag);

  for (let row = 0; row < size; row++) {
    const tempRow = board.insertRow();
    tempRow.classList.add("row");

    for (let col = 0; col < size; col++) {
      const tempCol = tempRow.insertCell();
      tempCol.classList.add("col");

      if (array[row][col] !== empty) {
        board.rows[row].cells[col].setAttribute('onclick', 'getSetter()');
        board.rows[row].cells[col].innerHTML = toHex(array[row][col]);
      } else {
        board.rows[row].cells[col].setAttribute('onclick', 'getCell(' + row + ',' + col + ')');
        board.rows[row].cells[col].innerHTML = empty;
      }
    }
  }
}


/**
 * fill array object with a solution
 *
 * @return true if program found a solution to the current board
 */
function solve() {
  // backtracking recursion
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (array[row][col] === empty) {
        for (let val = 0; val < size; val++) {
          if (validate(row, col, val)) {
            array[row][col] = val;
            // base case: if value leads to a solution
            if (solve()) {
              return true;
              // backtrack: if value does not lead to a solution
            } else {
              array[row][col] = empty;
            }
          }
        }
        return false;
      }
    }
  }
  display();
  return true;
}


/**
 * @pre a solution to display
 * @post display the solution on the sudoku grid
 */
function display() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board.rows[row].cells[col].innerHTML === empty) {
        board.rows[row].cells[col].innerHTML = toHex(array[row][col]);
      }
    }
  }
}


/**
 * writes a valid input on the sudoku board.
 * a valid input is a number 0-9 or letter A-F
 *
 * @param event    user's keyboard key input
 */
function write(event) {

  if (row === undefined || col === undefined) return;

  if (event.key === "Backspace") remove();

  if (!checkInput(event.keyCode)) return;

  board.rows[row].cells[col].innerHTML = toColor(event.key, row, col, Number(toDec(event.key)));
}


/**
 * removes the value in current cell
 *
 * @pre cell is non-null
 */
function remove() {
  board.rows[row].cells[col].innerHTML = empty;
  array[row][col] = empty;
}


/**
 *  writes the value of the button clicked at given cell.
 *
 *  @pre cell is non-null
 *  @pram value the value to be displayed
 */
function keypad(value) {
  if (row !== undefined && col !== undefined) {
    board.rows[row].cells[col].innerHTML = toHex(toColor(value, row, col, value));
  }
}


/**
 * @post prompts the user that the program is attempting to find a solution
 */
function getSolution() {
  let tag = document.querySelector("#play-area h1");
  tag.innerHTML = "Solving..."

  setTimeout(_ => solution(tag), 0);
}


/**
 * helper method for getSolution() to async solve()
 *
 * @param tag   the html tag that will display the text
 */
function solution(tag) {
  if (solve()) {
    tag.innerHTML = "Solution Found :)";
  } else {
    tag.innerHTML = "No Solution Found :(";
  }
}


/**
 * return the row and column index of a cell
 *
 * @param rowIndex    the row being indexed
 * @param colIndex    the column being indexed
 */
function getCell(rowIndex, colIndex) {
  row = rowIndex;
  col = colIndex;

  setBackground();
}


/**
 * resets the mouse click position
 */
function getSetter() {
  row = undefined;
  col = undefined;
}

/**
 * set the background color of the selected cell
 */
function setBackground() {
  const tagClass = "highlight";
  let list = document.querySelectorAll("#sudoku td");

  for (let i = 0; i < list.length; i++) {
    list[i].classList.remove(tagClass);
  }
  board.rows[row].cells[col].classList.add(tagClass);
}


/**
 * converts Decimal to Hexadecimal
 *
 * @param num    the number to be converted to Hexadecimal
 * @return       'A' if num = 10  , 'B' if num = 11 ... 'F' if num = 15
 */
function toHex(num) {
  let decimal = 10; // represents when a Decimal needs to convert to Hexadecimal
  let hexadecimal = 'A'.charCodeAt(0)

  if (num >= decimal) {
    num = String.fromCharCode(num - decimal + hexadecimal);
  }
  return num;
}


/**
 * converts Hexadecimal to Decimal
 *
 * @param char   the character to be converted to Decimal
 * @return       10 if char = 'A'  ,  11 if char = 'B'  ...  15 if char = 'F'
 */
function toDec(char) {
  let decimal = 10; // represents the Decimal form of a Hexadecimal
  let hexadecimal = 'A'.charCodeAt(0);
  let asiic = char.toUpperCase().charCodeAt(0);

  if (Number(asiic) >= hexadecimal) {
    char = asiic - 'A'.charCodeAt(0) + decimal;
  }
  return char;
}


/**
 * change the color of given 'text'
 *
 * @pram text     the text to change color
 * @return        the text with its corresponding color
 */
function toColor(text, row, col, val) {
  // add the color class to its tag and change the color in CSS
  const tag = board.rows[row].cells[col];
  const correctColor = "correct-color";
  const wrongColor = "wrong-color";

  if (validate(row, col, val)) {
    array[row][col] = val;
    tag.classList.add(correctColor);
    tag.classList.remove(wrongColor);
  } else {
    tag.classList.add(wrongColor);
    tag.classList.remove(correctColor);
  }
  return text;
}


/**
 * @return true if there does not exists the same element placed
 *                  in its row, column, and 4x4 section
 */
function validate(row, col, val) {
  return checkRow(row, val) && checkColumn(col, val) && checkSection(row, col, val);
}


/**
 * return true if there does not exists the same element in this row
 */
function checkRow(row, val) {
  for (let col = 0; col < size; col++) {
    if (array[row][col] === val) return false;
  }
  return true;
}


/**
 * return true if there does not exists the same element in this column
 */
function checkColumn(col, val) {
  for (let row = 0; row < size; row++) {
    if (array[row][col] === val) return false;
  }
  return true;
}


/**
 * return true if there does not exists the same element in this section
 */
function checkSection(row, col, val) {
  const sectionSize = Math.sqrt(size); // represents the 4x4 section

  // formula for the first cell in given 4x4 section
  const rowSection = row - (row % sectionSize);
  const colSection = col - (col % sectionSize);

  for (let i = rowSection; i < rowSection + sectionSize; i++) {
    for (let j = colSection; j < colSection + sectionSize; j++) {
      if (array[i][j] === val) return false;
    }
  }
  return true;
}


/*
 * @return true if the keyboard key is a number 0-9 or letter A-F
 */
function checkInput(input) {
  // keyCode       48 -> 0        57 -> 9          65 -> A        70 -> F
  return (input >= 48 && input <= 57) || (input >= 65 && input <= 70);
}


main();
