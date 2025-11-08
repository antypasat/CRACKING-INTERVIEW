Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego)
:

Zero Matrix: Write an algorithm such that if an element in an MxN matrix is 0, its entire row and
column are set to O.

======================

# Zero Matrix - Interview Question
**Zerowa Macierz - Pytanie rekrutacyjne**

## Problem Description / Opis Problemu

**English:** Write an algorithm such that if an element in an MxN matrix is 0, its entire row and column are set to 0.

**Polski:** Napisz algorytm taki, że jeśli element w macierzy MxN wynosi 0, cały jego wiersz i kolumna są ustawiane na 0.

## Solution Approach / Podejście do Rozwiązania

**English:** We need to track which rows and columns contain zeros, then set those entire rows and columns to zero.

**Polski:** Musimy śledzić, które wiersze i kolumny zawierają zera, a następnie ustawić całe te wiersze i kolumny na zero.

## Implementation / Implementacja

### Approach 1: Using Extra Space - O(M+N) / Podejście 1: Używając Dodatkowej Pamięci

```javascript
function zeroMatrix(matrix) {
  // English: If matrix is empty, return it
  // Polski: Jeśli macierz jest pusta, zwróć ją
  if (matrix.length === 0 || matrix[0].length === 0) {
    return matrix;
  }

  const rows = matrix.length;      // English: Number of rows / Polski: Liczba wierszy
  const cols = matrix[0].length;   // English: Number of columns / Polski: Liczba kolumn

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
```

### Approach 2: In-Place - O(1) Extra Space / Podejście 2: W Miejscu - O(1) Dodatkowa Pamięć

```javascript
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
        matrix[i][0] = 0;  // English: Mark row / Polski: Zaznacz wiersz
        matrix[0][j] = 0;  // English: Mark column / Polski: Zaznacz kolumnę
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
```

## Test Cases / Przypadki Testowe

```javascript
// Test 1
const matrix1 = [
  [1, 2, 3],
  [4, 0, 6],
  [7, 8, 9]
];

console.log("Before / Przed:");
console.log(matrix1);

zeroMatrix(matrix1);

console.log("After / Po:");
console.log(matrix1);
// Expected / Oczekiwane: [[1, 0, 3], [0, 0, 0], [7, 0, 9]]

// Test 2
const matrix2 = [
  [0, 1, 2, 0],
  [3, 4, 5, 2],
  [1, 3, 1, 5]
];

console.log("\nBefore / Przed:");
console.log(matrix2);

zeroMatrixInPlace(matrix2);

console.log("After / Po:");
console.log(matrix2);
// Expected / Oczekiwane: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
```

## Complexity Analysis / Analiza Złożoności

### Approach 1 / Podejście 1:
- **Time / Czas:** O(M × N) - English: We iterate through the matrix multiple times / Polski: Przechodzimy przez macierz wielokrotnie
- **Space / Pamięć:** O(M + N) - English: Extra arrays for rows and columns / Polski: Dodatkowe tablice dla wierszy i kolumn

### Approach 2 / Podejście 2:
- **Time / Czas:** O(M × N) - English: We iterate through the matrix multiple times / Polski: Przechodzimy przez macierz wielokrotnie
- **Space / Pamięć:** O(1) - English: Only constant extra space / Polski: Tylko stała dodatkowa pamięć

## Key Points / Kluczowe Punkty

**English:** The in-place solution is more space-efficient but slightly more complex to understand.

**Polski:** Rozwiązanie w miejscu jest bardziej efektywne pamięciowo, ale nieco bardziej złożone do zrozumienia.

**English:** We must identify all zeros before modifying the matrix to avoid cascading effects.

**Polski:** Musimy zidentyfikować wszystkie zera przed modyfikacją macierzy, aby uniknąć efektów kaskadowych.
