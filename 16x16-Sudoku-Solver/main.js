/*jshint esversion: 6 */

function drawGrid(tag) {
  const getTag = document.querySelector(tag);

  for (i = 0; i < 16; i++) {
    const row = getTag.insertRow();
    row.classList.add("row");
    for (j = 0; j < 16; j++) {
      const col = row.insertCell();
      col.classList.add("col");
      col.setAttribute("onclick", "displayInput()");
    }
  }
  getTag.rows[5].cells[2].innerHTML = "A";
}

function displayInput() {
  alert("it works!");
}

drawGrid("#sudoku>table");
