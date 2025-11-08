/**
 * Rotates an NxN matrix 90 degrees clockwise in-place
 * Obraca macierz NxN o 90 stopni zgodnie z ruchem wskazówek zegara w miejscu
 *
 * @param {number[][]} matrix - NxN matrix to rotate
 * @returns {number[][]} - The rotated matrix (same reference)
 */
function rotateMatrix(matrix) {
  // Check if matrix is valid | Sprawdź czy macierz jest poprawna
  if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
    return matrix;
  }

  const n = matrix.length;

  // Step 1: Transpose the matrix | Krok 1: Transponuj macierz
  // Swap elements across diagonal | Zamień elementy wzdłuż przekątnej
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Swap matrix[i][j] with matrix[j][i]
      // Zamień matrix[i][j] z matrix[j][i]
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Step 2: Reverse each row | Krok 2: Odwróć każdy wiersz
  for (let i = 0; i < n; i++) {
    let left = 0;
    let right = n - 1;

    while (left < right) {
      // Swap elements | Zamień elementy
      [matrix[i][left], matrix[i][right]] = [matrix[i][right], matrix[i][left]];
      left++;
      right--;
    }
  }

  return matrix;
}
