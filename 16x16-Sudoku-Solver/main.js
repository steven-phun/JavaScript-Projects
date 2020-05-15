/*jshint esversion: 6 */

function drawGrid() {
  const getTag = document.querySelector("div.sudoku-grid-display");
  const table = document.createElement("table");
  table.className = "sudoku-grid";

  for (i = 0; i < 16; i++) {
    const row = table.insertRow();
    row.classList.add("sudoku-row");
    if (i % 4 === 0 && i !== 0) {
      row.classList.add("sudoku-row-section");
    }
    for (j = 0; j < 16; j++) {
      const col = row.insertCell();
      col.classList.add("sudoku-col");
      if (j % 4 === 0 && j !== 0) {
        col.classList.add("sudoku-col-section");
      }
    }
  }
  getTag.append(table);
}

drawGrid();
