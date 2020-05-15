/*jshint esversion: 6 */

function drawGrid() {
  const getTag = document.querySelector("div.sudoku-grid-display");
  const table = document.createElement("table");
  table.className = "sudoku-grid";

  for (i = 0; i < 5; i++) {
    const tbody = document.createElement("tbody");
    tbody.className = "sudoku-tbody";
    table.append(tbody);
    for (i = 0; i < 16; i++) {
      const row = tbody.insertRow();
      row.className = "sudoku-row";
      for (j = 0; j < 16; j++) {
        const col = row.insertCell();
        col.className = "sudoku-col";
      }
    }
    getTag.append(table);
  }
}

drawGrid();
