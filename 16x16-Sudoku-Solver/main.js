/*jshint esversion: 6 */

function drawGrid(tag) {
  const getTag = document.querySelector(tag);

  for (i = 0; i < 16; i++) {
    const row = getTag.insertRow();
    row.classList.add("sudoku-row");
    if (i !== 0 && i % 4 === 0) {
      row.classList.add("sudoku-row-section");
    }
    for (j = 0; j < 16; j++) {
      const col = row.insertCell();
      col.classList.add("sudoku-col");
      if (j !== 0 && j % 4 === 0) {
        col.classList.add("sudoku-col-section");
      }
    }
  }
  getTag.appendChild(table);
}

drawGrid("table.sudoku-grid");
