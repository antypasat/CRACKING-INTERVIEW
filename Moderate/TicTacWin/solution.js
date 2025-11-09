/**
 * Tic Tac Toe Winner Detection
 *
 * Algorytm sprawdzający czy ktoś wygrał w kółko i krzyżyk.
 * Algorithm to check if someone won tic-tac-toe.
 */

class TicTacToe {
  constructor(size = 3) {
    this.size = size;
    this.board = Array(size).fill(null).map(() => Array(size).fill(null));
  }

  // Ustaw wartość na planszy / Set value on board
  set(row, col, player) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      throw new Error('Pozycja poza planszą / Position out of bounds');
    }
    this.board[row][col] = player;
  }

  // Wyświetl planszę / Display board
  display() {
    console.log('\nPlansza / Board:');
    for (let i = 0; i < this.size; i++) {
      const row = this.board[i].map(cell => cell || '.').join(' | ');
      console.log(row);
      if (i < this.size - 1) console.log('-'.repeat(this.size * 4 - 1));
    }
    console.log();
  }

  /**
   * Podejście 1: Sprawdź całą planszę
   * Approach 1: Check entire board
   * Złożoność / Complexity: O(N²)
   */
  checkWinnerBruteForce() {
    // Sprawdź rzędy / Check rows
    for (let row = 0; row < this.size; row++) {
      const firstCell = this.board[row][0];
      if (firstCell && this.board[row].every(cell => cell === firstCell)) {
        return firstCell;
      }
    }

    // Sprawdź kolumny / Check columns
    for (let col = 0; col < this.size; col++) {
      const firstCell = this.board[0][col];
      if (firstCell && this.board.every(row => row[col] === firstCell)) {
        return firstCell;
      }
    }

    // Sprawdź przekątną główną / Check main diagonal (top-left to bottom-right)
    const firstDiag = this.board[0][0];
    if (firstDiag && this.board.every((row, i) => row[i] === firstDiag)) {
      return firstDiag;
    }

    // Sprawdź przekątną poboczną / Check anti-diagonal (top-right to bottom-left)
    const firstAntiDiag = this.board[0][this.size - 1];
    if (firstAntiDiag && this.board.every((row, i) =>
      row[this.size - 1 - i] === firstAntiDiag)) {
      return firstAntiDiag;
    }

    return null; // Brak wygranej / No winner
  }

  /**
   * Podejście 2: Sprawdź tylko rząd, kolumnę i przekątne ostatniego ruchu
   * Approach 2: Check only row, column, and diagonals of last move
   * Złożoność / Complexity: O(N)
   */
  checkWinnerOptimized(lastRow, lastCol) {
    const player = this.board[lastRow][lastCol];
    if (!player) return null;

    // Sprawdź rząd / Check row
    if (this.board[lastRow].every(cell => cell === player)) {
      return player;
    }

    // Sprawdź kolumnę / Check column
    if (this.board.every(row => row[lastCol] === player)) {
      return player;
    }

    // Sprawdź przekątną główną (jeśli ostatni ruch na przekątnej)
    // Check main diagonal (if last move on diagonal)
    if (lastRow === lastCol) {
      if (this.board.every((row, i) => row[i] === player)) {
        return player;
      }
    }

    // Sprawdź przekątną poboczną (jeśli ostatni ruch na przekątnej)
    // Check anti-diagonal (if last move on anti-diagonal)
    if (lastRow + lastCol === this.size - 1) {
      if (this.board.every((row, i) => row[this.size - 1 - i] === player)) {
        return player;
      }
    }

    return null;
  }

  /**
   * Podejście 3: Incremental tracking (najbardziej optymalne)
   * Approach 3: Incremental tracking (most optimal)
   */
  static createWithTracking(size = 3) {
    return new TicTacToeTracking(size);
  }
}

/**
 * Wersja z śledzeniem sum - O(1) sprawdzanie po każdym ruchu
 * Version with sum tracking - O(1) checking after each move
 */
class TicTacToeTracking extends TicTacToe {
  constructor(size = 3) {
    super(size);
    this.rowSums = Array(size).fill(0);
    this.colSums = Array(size).fill(0);
    this.diagSum = 0;
    this.antiDiagSum = 0;
  }

  setValue(row, col, player) {
    // X = 1, O = -1
    const value = player === 'X' ? 1 : -1;
    this.set(row, col, player);

    this.rowSums[row] += value;
    this.colSums[col] += value;

    if (row === col) {
      this.diagSum += value;
    }
    if (row + col === this.size - 1) {
      this.antiDiagSum += value;
    }
  }

  checkWinner() {
    // Sprawdź czy jakaś suma = size (X wygrywa) lub -size (O wygrywa)
    // Check if any sum = size (X wins) or -size (O wins)
    const target = this.size;

    for (let sum of this.rowSums) {
      if (sum === target) return 'X';
      if (sum === -target) return 'O';
    }
    for (let sum of this.colSums) {
      if (sum === target) return 'X';
      if (sum === -target) return 'O';
    }
    if (this.diagSum === target) return 'X';
    if (this.diagSum === -target) return 'O';
    if (this.antiDiagSum === target) return 'X';
    if (this.antiDiagSum === -target) return 'O';

    return null;
  }
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Tic Tac Toe Winner Detection ===\n');

// Test 1: Wygrana w rzędzie / Win in row
console.log('Test 1: Wygrana X w pierwszym rzędzie');
const game1 = new TicTacToe(3);
game1.set(0, 0, 'X');
game1.set(0, 1, 'X');
game1.set(0, 2, 'X');
game1.set(1, 0, 'O');
game1.set(1, 1, 'O');
game1.display();
console.log(`Zwycięzca (brute force): ${game1.checkWinnerBruteForce()}`);
console.log(`Zwycięzca (optimized): ${game1.checkWinnerOptimized(0, 2)}\n`);

// Test 2: Wygrana w kolumnie / Win in column
console.log('Test 2: Wygrana O w środkowej kolumnie');
const game2 = new TicTacToe(3);
game2.set(0, 1, 'O');
game2.set(1, 1, 'O');
game2.set(2, 1, 'O');
game2.set(0, 0, 'X');
game2.set(2, 2, 'X');
game2.display();
console.log(`Zwycięzca: ${game2.checkWinnerBruteForce()}\n`);

// Test 3: Wygrana na przekątnej głównej / Win on main diagonal
console.log('Test 3: Wygrana X na przekątnej głównej');
const game3 = new TicTacToe(3);
game3.set(0, 0, 'X');
game3.set(1, 1, 'X');
game3.set(2, 2, 'X');
game3.set(0, 1, 'O');
game3.set(0, 2, 'O');
game3.display();
console.log(`Zwycięzca: ${game3.checkWinnerBruteForce()}\n`);

// Test 4: Wygrana na przekątnej pobocznej / Win on anti-diagonal
console.log('Test 4: Wygrana O na przekątnej pobocznej');
const game4 = new TicTacToe(3);
game4.set(0, 2, 'O');
game4.set(1, 1, 'O');
game4.set(2, 0, 'O');
game4.set(0, 0, 'X');
game4.set(2, 2, 'X');
game4.display();
console.log(`Zwycięzca: ${game4.checkWinnerBruteForce()}\n`);

// Test 5: Remis / Draw
console.log('Test 5: Remis (brak wygranej)');
const game5 = new TicTacToe(3);
game5.set(0, 0, 'X');
game5.set(0, 1, 'O');
game5.set(0, 2, 'X');
game5.set(1, 0, 'O');
game5.set(1, 1, 'X');
game5.set(1, 2, 'O');
game5.set(2, 0, 'O');
game5.set(2, 1, 'X');
game5.set(2, 2, 'O');
game5.display();
console.log(`Zwycięzca: ${game5.checkWinnerBruteForce() || 'REMIS'}\n`);

// Test 6: Większa plansza 4x4
console.log('Test 6: Plansza 4x4 - wygrana w rzędzie');
const game6 = new TicTacToe(4);
game6.set(2, 0, 'X');
game6.set(2, 1, 'X');
game6.set(2, 2, 'X');
game6.set(2, 3, 'X');
game6.display();
console.log(`Zwycięzca: ${game6.checkWinnerBruteForce()}\n`);

// Test 7: Wersja z śledzeniem (tracking) - O(1)
console.log('Test 7: Wersja z śledzeniem (O(1) sprawdzanie)');
const game7 = TicTacToe.createWithTracking(3);
game7.setValue(0, 0, 'X');
console.log(`Po ruchu X(0,0): Zwycięzca = ${game7.checkWinner()}`);
game7.setValue(1, 0, 'O');
console.log(`Po ruchu O(1,0): Zwycięzca = ${game7.checkWinner()}`);
game7.setValue(0, 1, 'X');
console.log(`Po ruchu X(0,1): Zwycięzca = ${game7.checkWinner()}`);
game7.setValue(1, 1, 'O');
console.log(`Po ruchu O(1,1): Zwycięzca = ${game7.checkWinner()}`);
game7.setValue(0, 2, 'X');
console.log(`Po ruchu X(0,2): Zwycięzca = ${game7.checkWinner()}`);
game7.display();

console.log('\n=== Porównanie Podejść / Approach Comparison ===');
console.log('1. Brute Force: O(N²) - sprawdza całą planszę');
console.log('2. Optimized: O(N) - sprawdza tylko ruch');
console.log('3. Tracking: O(1) - śledzi sumy podczas gry');
