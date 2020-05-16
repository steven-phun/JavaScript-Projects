/*jshint esversion: 6 */

const board = drawGrid("#sudoku>table");
let col = "";
let row = "";
let val = "";


function drawGrid(tag) {
  const grid = document.querySelector(tag);

  for (i = 0; i < 16; i++) {
    const row = grid.insertRow();
    row.classList.add("row");
    for (j = 0; j < 16; j++) {
      const col = row.insertCell();
      col.classList.add("col");

      grid.rows[i].setAttribute('onclick', 'getClickRow(this)');
      grid.rows[i].cells[j].setAttribute('onclick', 'getClickCol(this)');
    }
  }
  return grid;
}


function getClickRow(row) {
  this.row = row.rowIndex;
}


function getClickCol(col) {
  this.col = col.cellIndex;
  val = col.innerHTML;
}


function writeToCell(event) {
  board.rows[this.row].cells[this.col].innerHTML = event.key;
}


window.addEventListener("keydown", writeToCell);
