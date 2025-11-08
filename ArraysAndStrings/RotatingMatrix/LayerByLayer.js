function rotateMatrixLayerByLayer(matrix) {
  if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
    return matrix;
  }

  const n = matrix.length;

  // Process layer by layer | Przetwarzaj warstwę po warstwie
  for (let layer = 0; layer < Math.floor(n / 2); layer++) {
    const first = layer;
    const last = n - 1 - layer;

    for (let i = first; i < last; i++) {
      const offset = i - first;

      // Save top | Zapisz górę
      const top = matrix[first][i];

      // left -> top | lewy -> góra
      matrix[first][i] = matrix[last - offset][first];

      // bottom -> left | dół -> lewy
      matrix[last - offset][first] = matrix[last][last - offset];

      // right -> bottom | prawy -> dół
      matrix[last][last - offset] = matrix[i][last];

      // top -> right | góra -> prawy
      matrix[i][last] = top;
    }
  }

  return matrix;
}
