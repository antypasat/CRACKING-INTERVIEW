function zeroMatrixInPlace(matrix) {
  // English: If matrix is empty, return it
  // Polski: Jeśli macierz jest pusta, zwróć ją
  if (matrix.length === 0 || matrix[0].length === 0) {
    return matrix;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  // English: Use first row and column as markers
  // Polski: Użyj pierwszego wiersza i kolumny jako znaczników
  let firstRowHasZero = false;
  let firstColHasZero = false;

  // English: Check if first row has any zeros
  // Polski: Sprawdź, czy pierwszy wiersz ma jakieś zera
  for (let j = 0; j < cols; j++) {
    if (matrix[0][j] === 0) {
      firstRowHasZero = true;
      break;
    }
  }

  // English: Check if first column has any zeros
  // Polski: Sprawdź, czy pierwsza kolumna ma jakieś zera
  for (let i = 0; i < rows; i++) {
    if (matrix[i][0] === 0) {
      firstColHasZero = true;
      break;
    }
  }

  // English: Use first row and column to mark zeros in rest of matrix
  // Polski: Użyj pierwszego wiersza i kolumny do zaznaczenia zer w reszcie macierzy
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0; // English: Mark row / Polski: Zaznacz wiersz
        matrix[0][j] = 0; // English: Mark column / Polski: Zaznacz kolumnę
      }
    }
  }

  // English: Zero out cells based on marks in first row and column
  // Polski: Wyzeruj komórki na podstawie znaczników w pierwszym wierszu i kolumnie
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // English: Zero out first row if needed
  // Polski: Wyzeruj pierwszy wiersz, jeśli potrzebne
  if (firstRowHasZero) {
    for (let j = 0; j < cols; j++) {
      matrix[0][j] = 0;
    }
  }

  // English: Zero out first column if needed
  // Polski: Wyzeruj pierwszą kolumnę, jeśli potrzebne
  if (firstColHasZero) {
    for (let i = 0; i < rows; i++) {
      matrix[i][0] = 0;
    }
  }

  return matrix;
}

// Test 2
const matrix2 = [
  [0, 1, 2, 0],
  [3, 4, 5, 2],
  [1, 3, 1, 5],
];

console.log("\nBefore / Przed:");
console.log(matrix2);

zeroMatrixInPlace(matrix2);

console.log("After / Po:");
console.log(matrix2);
// Expected / Oczekiwane: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
