/*jshint esversion: 6 */

function drawGrid(tag) {
  const getTag = document.querySelector(tag);

  for (i = 0; i < 16; i++) {
    const row = getTag.insertRow();
    row.classList.add("row");
    for (j = 0; j < 16; j++) {
      const col = row.insertCell();
      col.classList.add("col");

      getTag.rows[i].setAttribute('onclick', 'getRow(this)');
      getTag.rows[i].cells[j].setAttribute('onclick', 'getCol(this)');
    }
  }
  getTag.rows[5].cells[2].innerHTML = "A";
}

function getValue(value) {
  console.log("value is: " + value);

  return value;
}

function getRow(row) {
  console.log("row is: " + row.rowIndex);

  return row;
}

function getCol(col) {
  getValue(col.innerHTML);
  console.log("col is: " + col.cellIndex);

  return col;
}

drawGrid("#sudoku>table");
