function zeroMatrix(matrix) {
  // English: If matrix is empty, return it
  // Polski: Jeśli macierz jest pusta, zwróć ją
  if (matrix.length === 0 || matrix[0].length === 0) {
    return matrix;
  }

  const rows = matrix.length; // English: Number of rows / Polski: Liczba wierszy
  const cols = matrix[0].length; // English: Number of columns / Polski: Liczba kolumn

  // English: Arrays to track which rows and columns should be zeroed
  // Polski: Tablice do śledzenia, które wiersze i kolumny powinny być wyzerowane
  const zeroRows = new Array(rows).fill(false);
  const zeroCols = new Array(cols).fill(false);

  // English: First pass: identify all zeros
  // Polski: Pierwsze przejście: zidentyfikuj wszystkie zera
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 0) {
        zeroRows[i] = true;
        zeroCols[j] = true;
      }
    }
  }

  // English: Second pass: set rows to zero
  // Polski: Drugie przejście: ustaw wiersze na zero
  for (let i = 0; i < rows; i++) {
    if (zeroRows[i]) {
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = 0;
      }
    }
  }

  // English: Third pass: set columns to zero
  // Polski: Trzecie przejście: ustaw kolumny na zero
  for (let j = 0; j < cols; j++) {
    if (zeroCols[j]) {
      for (let i = 0; i < rows; i++) {
        matrix[i][j] = 0;
      }
    }
  }

  return matrix;
}

// Test 1
const matrix1 = [
  [1, 2, 3],
  [4, 0, 6],
  [7, 8, 9],
];

console.log("Before / Przed:");
console.log(matrix1);

zeroMatrix(matrix1);

console.log("After / Po:");
console.log(matrix1);
// Expected / Oczekiwane: [[1, 0, 3], [0, 0, 0], [7, 0, 9]]
