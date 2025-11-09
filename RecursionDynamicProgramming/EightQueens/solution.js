// ============================================================================
// 8.12 EIGHT QUEENS - N-QUEENS PROBLEM
// 8.12 OSIEM HETMANÓW - PROBLEM N-HETMANÓW
// ============================================================================

// ============================================================================
// APPROACH 1: BACKTRACKING (ROW BY ROW)
// PODEJŚCIE 1: BACKTRACKING (WIERSZ PO WIERSZU)
// ============================================================================

/**
 * Eight Queens - Backtracking Solution
 * Osiem Hetmanów - Rozwiązanie Backtrackingowe
 *
 * Find all ways to place 8 queens on 8×8 board so none attack each other
 * Znajdź wszystkie sposoby umieszczenia 8 hetmanów na planszy 8×8 tak, aby żaden nie atakował drugiego
 *
 * Queens attack: same row, column, or diagonal / Hetmany atakują: ten sam wiersz, kolumnę lub diagonalę
 *
 * Time: O(n!) - Try different positions / Próbuj różne pozycje
 * Space: O(n) for recursion and storage / dla rekurencji i przechowywania
 *
 * @param {number} n - Board size (8 for eight queens) / Rozmiar planszy
 * @returns {number[][]} - All valid placements / Wszystkie prawidłowe rozmieszczenia
 */
function solveNQueens(n = 8) {
  const results = [];
  const columns = []; // columns[row] = column position of queen in that row
                      // columns[wiersz] = pozycja kolumny hetmana w tym wierszu

  placeQueens(0, columns, results, n);

  return results;
}

/**
 * Helper: Place queens row by row / Pomocnicza: Umieść hetmanów wiersz po wierszu
 *
 * @param {number} row - Current row / Bieżący wiersz
 * @param {number[]} columns - Queen positions so far / Dotychczasowe pozycje hetmanów
 * @param {number[][]} results - All solutions / Wszystkie rozwiązania
 * @param {number} n - Board size / Rozmiar planszy
 */
function placeQueens(row, columns, results, n) {
  // Base case: All queens placed successfully / Przypadek bazowy: Wszystkie hetmany umieszczone
  if (row === n) {
    results.push([...columns]); // Found a solution / Znaleziono rozwiązanie
    return;
  }

  // Try placing queen in each column of current row
  // Spróbuj umieścić hetmana w każdej kolumnie bieżącego wiersza
  for (let col = 0; col < n; col++) {
    if (isValidPosition(columns, row, col)) {
      columns[row] = col; // Place queen / Umieść hetmana
      placeQueens(row + 1, columns, results, n); // Recurse to next row / Rekurencja do następnego wiersza
      // Backtrack happens automatically when we try next column
      // Backtrack dzieje się automatycznie gdy próbujemy następnej kolumny
    }
  }
}

/**
 * Check if queen can be placed at (row, col) without attacking others
 * Sprawdź czy hetman może być umieszczony na (wiersz, kol) bez atakowania innych
 *
 * @param {number[]} columns - Queen positions in previous rows / Pozycje hetmanów w poprzednich wierszach
 * @param {number} row1 - Row to check / Wiersz do sprawdzenia
 * @param {number} col1 - Column to check / Kolumna do sprawdzenia
 * @returns {boolean} - True if position is valid / True jeśli pozycja jest prawidłowa
 */
function isValidPosition(columns, row1, col1) {
  // Check all previously placed queens / Sprawdź wszystkie wcześniej umieszczone hetmany
  for (let row2 = 0; row2 < row1; row2++) {
    const col2 = columns[row2];

    // Check column conflict / Sprawdź konflikt kolumny
    if (col1 === col2) {
      return false;
    }

    // Check diagonal conflict / Sprawdź konflikt diagonalny
    // Same diagonal if: |row1 - row2| === |col1 - col2|
    // Ta sama diagonala jeśli: |wiersz1 - wiersz2| === |kol1 - kol2|
    const rowDistance = row1 - row2;
    const colDistance = Math.abs(col1 - col2);

    if (rowDistance === colDistance) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// APPROACH 2: BACKTRACKING WITH OPTIMIZATION (BIT MANIPULATION)
// PODEJŚCIE 2: BACKTRACKING Z OPTYMALIZACJĄ (MANIPULACJA BITAMI)
// ============================================================================

/**
 * N-Queens with bit manipulation for faster checking
 * N-Hetmanów z manipulacją bitami dla szybszego sprawdzania
 *
 * Uses bitmasks to track occupied columns and diagonals
 * Używa masek bitowych do śledzenia zajętych kolumn i diagonali
 *
 * @param {number} n - Board size / Rozmiar planszy
 * @returns {number} - Count of solutions (faster than storing all)
 */
function countNQueensBitwise(n = 8) {
  let count = 0;

  function backtrack(row, cols, diag1, diag2) {
    if (row === n) {
      count++;
      return;
    }

    // Available positions: not in cols, diag1, or diag2
    // Dostępne pozycje: nie w cols, diag1, lub diag2
    let availablePositions = ((1 << n) - 1) & ~(cols | diag1 | diag2);

    while (availablePositions) {
      // Get rightmost available position / Pobierz najbardziej prawą dostępną pozycję
      const position = availablePositions & -availablePositions;

      // Remove this position from available / Usuń tę pozycję z dostępnych
      availablePositions -= position;

      // Recurse with updated masks / Rekurencja ze zaktualizowanymi maskami
      backtrack(
        row + 1,
        cols | position,           // Add to occupied columns / Dodaj do zajętych kolumn
        (diag1 | position) << 1,   // Add to / diagonal (left-down) / Dodaj do / diagonalnej (lewo-dół)
        (diag2 | position) >> 1    // Add to \ diagonal (right-down) / Dodaj do \ diagonalnej (prawo-dół)
      );
    }
  }

  backtrack(0, 0, 0, 0);
  return count;
}

// ============================================================================
// HELPER FUNCTIONS FOR DISPLAY / FUNKCJE POMOCNICZE DO WYŚWIETLANIA
// ============================================================================

/**
 * Convert column positions to board visualization
 * Konwertuj pozycje kolumn na wizualizację planszy
 *
 * @param {number[]} columns - Queen positions / Pozycje hetmanów
 * @returns {string[][]} - Board as 2D array / Plansza jako tablica 2D
 */
function columnsToBoard(columns) {
  const n = columns.length;
  const board = [];

  for (let row = 0; row < n; row++) {
    const rowArray = [];
    for (let col = 0; col < n; col++) {
      rowArray.push(columns[row] === col ? 'Q' : '.');
    }
    board.push(rowArray);
  }

  return board;
}

/**
 * Print board to console / Wyświetl planszę w konsoli
 *
 * @param {number[]} columns - Queen positions / Pozycje hetmanów
 * @param {number} solutionNumber - Solution number / Numer rozwiązania
 */
function printBoard(columns, solutionNumber) {
  const board = columnsToBoard(columns);
  const n = columns.length;

  console.log(`Solution ${solutionNumber}:`);
  console.log('  ' + '+---'.repeat(n) + '+');

  for (let row = 0; row < n; row++) {
    let rowStr = '  |';
    for (let col = 0; col < n; col++) {
      rowStr += ` ${board[row][col]} |`;
    }
    console.log(rowStr);
    console.log('  ' + '+---'.repeat(n) + '+');
  }

  console.log(`  Columns: [${columns.join(', ')}]`);
  console.log();
}

/**
 * Print compact representation / Wyświetl zwartą reprezentację
 */
function printBoardCompact(columns, solutionNumber) {
  const board = columnsToBoard(columns);
  console.log(`Solution ${solutionNumber}:`);

  for (const row of board) {
    console.log('  ' + row.join(' '));
  }

  console.log(`  [${columns.join(', ')}]`);
  console.log();
}

/**
 * Validate solution / Waliduj rozwiązanie
 *
 * @param {number[]} columns - Queen positions / Pozycje hetmanów
 * @returns {boolean} - True if valid / True jeśli prawidłowe
 */
function validateSolution(columns) {
  const n = columns.length;

  for (let row1 = 0; row1 < n; row1++) {
    for (let row2 = row1 + 1; row2 < n; row2++) {
      const col1 = columns[row1];
      const col2 = columns[row2];

      // Check column / Sprawdź kolumnę
      if (col1 === col2) return false;

      // Check diagonal / Sprawdź diagonalę
      if (Math.abs(row1 - row2) === Math.abs(col1 - col2)) return false;
    }
  }

  return true;
}

/**
 * Count unique solutions (accounting for symmetries) / Policz unikalne rozwiązania (uwzględniając symetrie)
 */
function countUniqueSolutions(solutions) {
  // For 8 queens: 92 total solutions, 12 unique (rest are rotations/reflections)
  // Dla 8 hetmanów: 92 całkowite rozwiązania, 12 unikalnych (reszta to obroty/odbicia)

  // This is a simplified check - full implementation would check all symmetries
  // To jest uproszczone sprawdzenie - pełna implementacja sprawdzałaby wszystkie symetrie

  return solutions.length; // For now, return all / Na razie, zwróć wszystkie
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('\n');
console.log('='.repeat(70));
console.log('EIGHT QUEENS PROBLEM - N-QUEENS');
console.log('PROBLEM OŚMIU HETMANÓW - N-HETMANÓW');
console.log('='.repeat(70));
console.log('\n');

// Test 1: 4-Queens (smaller for visualization)
console.log('TEST 1: 4-Queens (smaller board for visualization)');
console.log('       4-Hetmany (mniejsza plansza dla wizualizacji)');
console.log('='.repeat(70));

const solutions4 = solveNQueens(4);
console.log(`Total solutions for 4-Queens: ${solutions4.length}`);
console.log();

solutions4.forEach((solution, index) => {
  printBoard(solution, index + 1);
});

// Validate all solutions / Waliduj wszystkie rozwiązania
const allValid4 = solutions4.every(validateSolution);
console.log(`All 4-Queens solutions valid: ${allValid4 ? '✓' : '✗'}`);
console.log('\n');

// Test 2: 8-Queens (classic problem)
console.log('TEST 2: 8-Queens (classic problem)');
console.log('       8-Hetmanów (klasyczny problem)');
console.log('='.repeat(70));

console.time('8-Queens Backtracking');
const solutions8 = solveNQueens(8);
console.timeEnd('8-Queens Backtracking');

console.log(`Total solutions for 8-Queens: ${solutions8.length}`);
console.log(`Expected: 92 ${solutions8.length === 92 ? '✓' : '✗'}`);
console.log();

// Show first 5 solutions / Pokaż pierwsze 5 rozwiązań
console.log('First 5 solutions (compact):');
console.log('Pierwsze 5 rozwiązań (zwarte):');
console.log();

for (let i = 0; i < Math.min(5, solutions8.length); i++) {
  printBoardCompact(solutions8[i], i + 1);
}

// Validate all solutions / Waliduj wszystkie rozwiązania
const allValid8 = solutions8.every(validateSolution);
console.log(`All 8-Queens solutions valid: ${allValid8 ? '✓' : '✗'}`);
console.log('\n');

// Test 3: Bitwise counting (faster)
console.log('TEST 3: Bitwise counting (performance comparison)');
console.log('       Liczenie bitowe (porównanie wydajności)');
console.log('='.repeat(70));

console.time('8-Queens Bitwise Count');
const count8 = countNQueensBitwise(8);
console.timeEnd('8-Queens Bitwise Count');

console.log(`Bitwise count: ${count8}`);
console.log(`Matches backtracking: ${count8 === solutions8.length ? '✓' : '✗'}`);
console.log('\n');

// Test 4: Different board sizes
console.log('TEST 4: Different board sizes (N-Queens)');
console.log('       Różne rozmiary planszy (N-Hetmanów)');
console.log('='.repeat(70));

console.log('N | Solutions | Time');
console.log('--|-----------|-----');

for (let n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  console.time(`N=${n}`);
  const solutions = solveNQueens(n);
  console.timeEnd(`N=${n}`);
  console.log(`${n.toString().padStart(2)} | ${solutions.length.toString().padStart(9)} |`);
}
console.log();

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log('\n');

// Edge Case 1: 1-Queen
console.log('EDGE CASE 1: 1-Queen (trivial)');
console.log('-'.repeat(70));
const solutions1 = solveNQueens(1);
console.log(`Solutions: ${solutions1.length} ${solutions1.length === 1 ? '✓' : '✗'}`);
printBoardCompact(solutions1[0], 1);

// Edge Case 2: 2-Queens (impossible)
console.log('EDGE CASE 2: 2-Queens (impossible)');
console.log('-'.repeat(70));
const solutions2 = solveNQueens(2);
console.log(`Solutions: ${solutions2.length} ${solutions2.length === 0 ? '✓ (correctly found no solutions)' : '✗'}`);
console.log();

// Edge Case 3: 3-Queens (impossible)
console.log('EDGE CASE 3: 3-Queens (impossible)');
console.log('-'.repeat(70));
const solutions3 = solveNQueens(3);
console.log(`Solutions: ${solutions3.length} ${solutions3.length === 0 ? '✓ (correctly found no solutions)' : '✗'}`);
console.log();

// ============================================================================
// INTERESTING FACTS / CIEKAWE FAKTY
// ============================================================================

console.log('='.repeat(70));
console.log('INTERESTING FACTS ABOUT N-QUEENS / CIEKAWE FAKTY O N-HETMANACH');
console.log('='.repeat(70));
console.log();

console.log('Number of solutions for different N:');
console.log('Liczba rozwiązań dla różnych N:');
console.log();
console.log('  N=1:   1 solution   (trivial / trywialne)');
console.log('  N=2:   0 solutions  (impossible / niemożliwe)');
console.log('  N=3:   0 solutions  (impossible / niemożliwe)');
console.log('  N=4:   2 solutions');
console.log('  N=5:   10 solutions');
console.log('  N=6:   4 solutions');
console.log('  N=7:   40 solutions');
console.log('  N=8:   92 solutions  (12 unique, rest are rotations/reflections)');
console.log('                       (12 unikalnych, reszta to obroty/odbicia)');
console.log('  N=9:   352 solutions');
console.log('  N=10:  724 solutions');
console.log();
console.log('Pattern: Solutions exist for N=1 or N≥4');
console.log('Wzór: Rozwiązania istnieją dla N=1 lub N≥4');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Backtracking / Backtracking');
console.log('  Time:  O(n!) - Try different permutations / Próbuj różne permutacje');
console.log('         In practice, much better due to pruning / W praktyce, znacznie lepiej dzięki przycinaniu');
console.log('  Space: O(n) - Recursion depth and storage / Głębokość rekurencji i przechowywanie');
console.log();
console.log('APPROACH 2: Bitwise Optimization / Optymalizacja Bitowa');
console.log('  Time:  O(n!) - Same complexity but faster constants / Ta sama złożoność ale szybsze stałe');
console.log('  Space: O(n) - Recursion depth only / Tylko głębokość rekurencji');
console.log();
console.log('Key optimization: Pruning invalid branches early / Przycinanie nieprawidłowych gałęzi wcześnie');
console.log('  - Check conflicts before recursing / Sprawdzaj konflikty przed rekurencją');
console.log('  - Place queens row by row (not random positions) / Umieszczaj hetmanów wiersz po wierszu');
console.log('  - Use bitmasks for O(1) conflict checking / Używaj masek bitowych dla O(1) sprawdzania konfliktów');
console.log();
console.log('='.repeat(70));
