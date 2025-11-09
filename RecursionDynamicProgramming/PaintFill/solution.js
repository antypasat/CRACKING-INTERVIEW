// ============================================================================
// 8.10 PAINT FILL - FLOOD FILL ALGORITHM
// 8.10 WYPEŁNIENIE FARBĄ - ALGORYTM ZALEWANIA
// ============================================================================

// ============================================================================
// APPROACH 1: RECURSIVE DFS
// PODEJŚCIE 1: REKURENCYJNE DFS
// ============================================================================

/**
 * Paint Fill - Recursive DFS
 * Wypełnienie Farbą - Rekurencyjne DFS
 *
 * Flood fill algorithm using depth-first search (like paint bucket tool)
 * Algorytm zalewania używający przeszukiwania w głąb (jak narzędzie wiaderka farby)
 *
 * Time: O(m*n) where m,n are dimensions / gdzie m,n to wymiary
 * Space: O(m*n) for recursion stack in worst case / dla stosu rekurencji w najgorszym przypadku
 *
 * @param {number[][]} screen - 2D array of colors / Tablica 2D kolorów
 * @param {number} row - Starting row / Wiersz startowy
 * @param {number} col - Starting column / Kolumna startowa
 * @param {number} newColor - New color to fill / Nowy kolor do wypełnienia
 * @returns {number[][]} - Modified screen / Zmodyfikowany ekran
 */
function paintFillRecursive(screen, row, col, newColor) {
  // Validate input / Waliduj wejście
  if (!screen || screen.length === 0 || !screen[0]) {
    return screen;
  }

  const rows = screen.length;
  const cols = screen[0].length;

  // Check bounds / Sprawdź granice
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return screen;
  }

  const originalColor = screen[row][col];

  // If already the target color, no need to fill / Jeśli już docelowy kolor, nie trzeba wypełniać
  if (originalColor === newColor) {
    return screen;
  }

  // Start recursive fill / Rozpocznij rekurencyjne wypełnianie
  paintFillRecurse(screen, row, col, originalColor, newColor);

  return screen;
}

/**
 * Helper: Recursive fill function / Pomocnicza: Rekurencyjna funkcja wypełniania
 */
function paintFillRecurse(screen, row, col, originalColor, newColor) {
  const rows = screen.length;
  const cols = screen[0].length;

  // Base cases / Przypadki bazowe
  // 1. Out of bounds / Poza granicami
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return;
  }

  // 2. Not the original color / Nie oryginalny kolor
  if (screen[row][col] !== originalColor) {
    return;
  }

  // Fill current pixel / Wypełnij bieżący piksel
  screen[row][col] = newColor;

  // Recursively fill 4 neighbors / Rekurencyjnie wypełnij 4 sąsiadów
  paintFillRecurse(screen, row - 1, col, originalColor, newColor); // Up / Góra
  paintFillRecurse(screen, row + 1, col, originalColor, newColor); // Down / Dół
  paintFillRecurse(screen, row, col - 1, originalColor, newColor); // Left / Lewo
  paintFillRecurse(screen, row, col + 1, originalColor, newColor); // Right / Prawo
}

// ============================================================================
// APPROACH 2: ITERATIVE BFS (QUEUE)
// PODEJŚCIE 2: ITERACYJNE BFS (KOLEJKA)
// ============================================================================

/**
 * Paint Fill - BFS with Queue
 * Wypełnienie Farbą - BFS z Kolejką
 *
 * Flood fill using breadth-first search with queue
 * Zalewanie używające przeszukiwania wszerz z kolejką
 *
 * Time: O(m*n)
 * Space: O(m*n) for queue in worst case / dla kolejki w najgorszym przypadku
 *
 * @param {number[][]} screen - 2D array of colors / Tablica 2D kolorów
 * @param {number} row - Starting row / Wiersz startowy
 * @param {number} col - Starting column / Kolumna startowa
 * @param {number} newColor - New color to fill / Nowy kolor do wypełnienia
 * @returns {number[][]} - Modified screen / Zmodyfikowany ekran
 */
function paintFillBFS(screen, row, col, newColor) {
  // Validate input / Waliduj wejście
  if (!screen || screen.length === 0 || !screen[0]) {
    return screen;
  }

  const rows = screen.length;
  const cols = screen[0].length;

  // Check bounds / Sprawdź granice
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return screen;
  }

  const originalColor = screen[row][col];

  // If already the target color, no need to fill / Jeśli już docelowy kolor, nie trzeba wypełniać
  if (originalColor === newColor) {
    return screen;
  }

  // BFS using queue / BFS używając kolejki
  const queue = [[row, col]];
  screen[row][col] = newColor;

  // Directions: up, down, left, right / Kierunki: góra, dół, lewo, prawo
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const [r, c] = queue.shift();

    // Check all 4 neighbors / Sprawdź wszystkich 4 sąsiadów
    for (const [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;

      // Check if valid position with original color / Sprawdź czy prawidłowa pozycja z oryginalnym kolorem
      if (newRow >= 0 && newRow < rows &&
          newCol >= 0 && newCol < cols &&
          screen[newRow][newCol] === originalColor) {

        screen[newRow][newCol] = newColor;
        queue.push([newRow, newCol]);
      }
    }
  }

  return screen;
}

// ============================================================================
// APPROACH 3: ITERATIVE DFS (STACK)
// PODEJŚCIE 3: ITERACYJNE DFS (STOS)
// ============================================================================

/**
 * Paint Fill - DFS with Stack
 * Wypełnienie Farbą - DFS ze Stosem
 *
 * Flood fill using depth-first search with stack (iterative)
 * Zalewanie używające przeszukiwania w głąb ze stosem (iteracyjne)
 *
 * Time: O(m*n)
 * Space: O(m*n) for stack in worst case / dla stosu w najgorszym przypadku
 *
 * @param {number[][]} screen - 2D array of colors / Tablica 2D kolorów
 * @param {number} row - Starting row / Wiersz startowy
 * @param {number} col - Starting column / Kolumna startowa
 * @param {number} newColor - New color to fill / Nowy kolor do wypełnienia
 * @returns {number[][]} - Modified screen / Zmodyfikowany ekran
 */
function paintFillDFS(screen, row, col, newColor) {
  // Validate input / Waliduj wejście
  if (!screen || screen.length === 0 || !screen[0]) {
    return screen;
  }

  const rows = screen.length;
  const cols = screen[0].length;

  // Check bounds / Sprawdź granice
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return screen;
  }

  const originalColor = screen[row][col];

  // If already the target color, no need to fill / Jeśli już docelowy kolor, nie trzeba wypełniać
  if (originalColor === newColor) {
    return screen;
  }

  // DFS using stack / DFS używając stosu
  const stack = [[row, col]];
  screen[row][col] = newColor;

  // Directions: up, down, left, right / Kierunki: góra, dół, lewo, prawo
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (stack.length > 0) {
    const [r, c] = stack.pop();

    // Check all 4 neighbors / Sprawdź wszystkich 4 sąsiadów
    for (const [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;

      // Check if valid position with original color / Sprawdź czy prawidłowa pozycja z oryginalnym kolorem
      if (newRow >= 0 && newRow < rows &&
          newCol >= 0 && newCol < cols &&
          screen[newRow][newCol] === originalColor) {

        screen[newRow][newCol] = newColor;
        stack.push([newRow, newCol]);
      }
    }
  }

  return screen;
}

// ============================================================================
// HELPER FUNCTIONS FOR TESTING / FUNKCJE POMOCNICZE DO TESTOWANIA
// ============================================================================

/**
 * Deep clone 2D array / Głęboka kopia tablicy 2D
 */
function cloneScreen(screen) {
  return screen.map(row => [...row]);
}

/**
 * Print screen with colors / Wyświetl ekran z kolorami
 */
function printScreen(screen, description = '') {
  if (description) {
    console.log(description);
  }
  screen.forEach(row => {
    console.log(row.map(color => color.toString().padStart(2)).join(' '));
  });
  console.log();
}

/**
 * Compare two screens / Porównaj dwa ekrany
 */
function screensEqual(screen1, screen2) {
  if (screen1.length !== screen2.length) return false;

  for (let i = 0; i < screen1.length; i++) {
    if (screen1[i].length !== screen2[i].length) return false;

    for (let j = 0; j < screen1[i].length; j++) {
      if (screen1[i][j] !== screen2[i][j]) return false;
    }
  }

  return true;
}

/**
 * Test all approaches / Testuj wszystkie podejścia
 */
function testAllApproaches(screen, row, col, newColor, description) {
  console.log('='.repeat(70));
  console.log(description);
  console.log('='.repeat(70));

  console.log(`Starting point: (${row}, ${col})`);
  console.log(`New color: ${newColor}`);
  console.log();

  printScreen(screen, 'Original Screen / Oryginalny Ekran:');

  const screen1 = cloneScreen(screen);
  const screen2 = cloneScreen(screen);
  const screen3 = cloneScreen(screen);

  const result1 = paintFillRecursive(screen1, row, col, newColor);
  const result2 = paintFillBFS(screen2, row, col, newColor);
  const result3 = paintFillDFS(screen3, row, col, newColor);

  printScreen(result1, 'After Recursive DFS / Po Rekurencyjnym DFS:');
  printScreen(result2, 'After BFS / Po BFS:');
  printScreen(result3, 'After Iterative DFS / Po Iteracyjnym DFS:');

  const allMatch = screensEqual(result1, result2) && screensEqual(result2, result3);
  console.log(`All approaches match: ${allMatch ? '✓' : '✗'}`);
  console.log();

  return { result1, result2, result3, allMatch };
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('\n');
console.log('='.repeat(70));
console.log('PAINT FILL ALGORITHM - TEST CASES');
console.log('ALGORYTM WYPEŁNIENIA FARBĄ - PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log('\n');

// Test 1: Small square / Mały kwadrat
const screen1 = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1]
];
testAllApproaches(screen1, 1, 1, 2, 'TEST 1: Small square - fill center region / Mały kwadrat - wypełnij środkowy region');

// Test 2: Larger grid with isolated regions / Większa siatka z izolowanymi regionami
const screen2 = [
  [1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 1],
  [1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1]
];
testAllApproaches(screen2, 1, 1, 3, 'TEST 2: Fill enclosed region / Wypełnij zamknięty region');

// Test 3: Fill entire screen / Wypełnij cały ekran
const screen3 = [
  [2, 2, 2, 2],
  [2, 2, 2, 2],
  [2, 2, 2, 2]
];
testAllApproaches(screen3, 0, 0, 5, 'TEST 3: Fill entire screen / Wypełnij cały ekran');

// Test 4: Already target color / Już docelowy kolor
const screen4 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
testAllApproaches(screen4, 1, 1, 5, 'TEST 4: Already target color (no change) / Już docelowy kolor (bez zmian)');

// Test 5: Complex pattern / Złożony wzór
const screen5 = [
  [0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];
testAllApproaches(screen5, 2, 2, 9, 'TEST 5: Fill hole in complex pattern / Wypełnij dziurę w złożonym wzorze');

// Test 6: Corner fill / Wypełnienie narożnika
const screen6 = [
  [1, 1, 2, 2],
  [1, 1, 2, 2],
  [3, 3, 4, 4],
  [3, 3, 4, 4]
];
testAllApproaches(screen6, 0, 0, 7, 'TEST 6: Fill corner region / Wypełnij region narożnika');

// Test 7: Single pixel / Pojedynczy piksel
const screen7 = [
  [5]
];
testAllApproaches(screen7, 0, 0, 9, 'TEST 7: Single pixel / Pojedynczy piksel');

// Test 8: Vertical line / Pionowa linia
const screen8 = [
  [1, 2, 1],
  [1, 2, 1],
  [1, 2, 1],
  [1, 2, 1]
];
testAllApproaches(screen8, 0, 1, 8, 'TEST 8: Fill vertical line / Wypełnij pionową linię');

// Test 9: Diagonal-like pattern / Wzór diagonalny
const screen9 = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
testAllApproaches(screen9, 0, 1, 5, 'TEST 9: Fill zeros around diagonal / Wypełnij zera wokół diagonalnej');

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log('\n');

// Edge Case 1: Empty screen
console.log('EDGE CASE 1: Empty screen / Pusty ekran');
console.log('-'.repeat(70));
const emptyScreen = [];
const result1 = paintFillRecursive(emptyScreen, 0, 0, 5);
console.log(`Result: ${result1.length === 0 ? '✓ Handled correctly' : '✗ Error'}`);
console.log();

// Edge Case 2: Out of bounds
console.log('EDGE CASE 2: Out of bounds / Poza granicami');
console.log('-'.repeat(70));
const screen10 = [[1, 2], [3, 4]];
const screen10Copy = cloneScreen(screen10);
paintFillRecursive(screen10Copy, 5, 5, 9);
console.log(`Result: ${screensEqual(screen10, screen10Copy) ? '✓ No changes (correct)' : '✗ Error'}`);
console.log();

// Edge Case 3: Large uniform grid (performance test)
console.log('EDGE CASE 3: Large uniform grid (10x10)');
console.log('           Duża jednolita siatka (10x10)');
console.log('-'.repeat(70));
const largeScreen = Array(10).fill(null).map(() => Array(10).fill(1));
console.time('Recursive DFS');
paintFillRecursive(cloneScreen(largeScreen), 5, 5, 9);
console.timeEnd('Recursive DFS');

console.time('BFS');
paintFillBFS(cloneScreen(largeScreen), 5, 5, 9);
console.timeEnd('BFS');

console.time('Iterative DFS');
paintFillDFS(cloneScreen(largeScreen), 5, 5, 9);
console.timeEnd('Iterative DFS');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('All approaches have same time complexity:');
console.log('Wszystkie podejścia mają tę samą złożoność czasową:');
console.log();
console.log('Time:  O(m*n) - Visit each pixel once / Odwiedź każdy piksel raz');
console.log('                where m,n are dimensions / gdzie m,n to wymiary');
console.log();
console.log('Space Complexity / Złożoność pamięciowa:');
console.log('  Recursive DFS: O(m*n) - Call stack / Stos wywołań');
console.log('  BFS:          O(m*n) - Queue size / Rozmiar kolejki');
console.log('  Iterative DFS: O(m*n) - Stack size / Rozmiar stosu');
console.log();
console.log('Best case: O(1) - when starting pixel already has target color');
console.log('           Gdy startowy piksel już ma docelowy kolor');
console.log();
console.log('Worst case: O(m*n) - when entire screen needs to be filled');
console.log('            Gdy cały ekran trzeba wypełnić');
console.log('='.repeat(70));
