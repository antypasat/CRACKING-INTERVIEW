/**
 * Sorted Matrix Search - Wyszukiwanie w Posortowanej Macierzy
 */

function searchMatrix(matrix, target) {
  if (!matrix || matrix.length === 0) return null;

  let row = 0;
  let col = matrix[0].length - 1; // Prawy górny róg

  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) {
      return [row, col]; // Znaleziono
    } else if (matrix[row][col] > target) {
      col--; // Idź w lewo
    } else {
      row++; // Idź w dół
    }
  }

  return null; // Nie znaleziono
}

// TESTY
console.log("=== Sorted Matrix Search ===\n");

const matrix = [
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
];

console.log("Macierz:");
matrix.forEach(row => console.log(row));
console.log();

console.log("Szukamy 9:", searchMatrix(matrix, 9));  // [2, 2]
console.log("Szukamy 1:", searchMatrix(matrix, 1));  // [0, 0]
console.log("Szukamy 30:", searchMatrix(matrix, 30)); // [4, 4]
console.log("Szukamy 20:", searchMatrix(matrix, 20)); // null

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { searchMatrix };
}
