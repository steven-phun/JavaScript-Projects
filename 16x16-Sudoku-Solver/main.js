/*jshint esversion: 6 */

function drawGrid(tag) {
  const getTag = document.querySelector(tag);

  for (i = 0; i < 16; i++) {
    const row = getTag.insertRow();
    row.classList.add("row");
    if (i !== 0 && i % 4 === 0) {
      row.classList.add("row-section");
    }
    for (j = 0; j < 16; j++) {
      const col = row.insertCell();
      col.classList.add("col");
      col.setAttribute("onclick", "displayInput()");
      if (j !== 0 && j % 4 === 0) {
        col.classList.add("col-section");
      }
    }
  }

}

function displayInput() {
  alert("it works!");
}

drawGrid("#sudoku>table");
