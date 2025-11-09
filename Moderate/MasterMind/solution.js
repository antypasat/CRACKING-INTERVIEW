/**
 * Master Mind Game - Hits and Pseudo-Hits Calculator
 * Gra Master Mind - Kalkulator Trafień i Pseudo-Trafień
 */

/**
 * Podejście 1: Dwa Przejścia z Tablicami Użycia - O(n²)
 * Approach 1: Two Passes with Usage Arrays - O(n²)
 *
 * Najpierw znajdź wszystkie hits, potem pseudo-hits
 * First find all hits, then pseudo-hits
 */
function masterMindTwoPass(solution, guess) {
  if (solution.length !== guess.length) {
    throw new Error('Solution and guess must have the same length');
  }

  let hits = 0;
  let pseudoHits = 0;

  // Tablice do śledzenia, które pozycje zostały użyte
  const solutionUsed = new Array(solution.length).fill(false);
  const guessUsed = new Array(guess.length).fill(false);

  // Przejście 1: Znajdź hits
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === guess[i]) {
      hits++;
      solutionUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Przejście 2: Znajdź pseudo-hits
  for (let i = 0; i < guess.length; i++) {
    if (guessUsed[i]) continue; // Already a hit

    for (let j = 0; j < solution.length; j++) {
      if (solutionUsed[j]) continue; // Already used

      if (guess[i] === solution[j]) {
        pseudoHits++;
        solutionUsed[j] = true;
        break; // Move to next guess position
      }
    }
  }

  return { hits, pseudoHits };
}

/**
 * Podejście 2: Mapa Częstości - O(n) ✓ OPTYMALNE
 * Approach 2: Frequency Map - O(n) ✓ OPTIMAL
 *
 * Użyj mapy do zliczania kolorów
 * Use a map to count colors
 */
function masterMind(solution, guess) {
  if (solution.length !== guess.length) {
    throw new Error('Solution and guess must have the same length');
  }

  let hits = 0;
  const colorCount = {}; // Częstość kolorów w solution (bez hits)

  // Przejście 1: Znajdź hits i zbuduj mapę kolorów
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === guess[i]) {
      hits++;
    } else {
      // Dodaj kolor z solution do mapy (nie jest hit)
      colorCount[solution[i]] = (colorCount[solution[i]] || 0) + 1;
    }
  }

  // Przejście 2: Znajdź pseudo-hits
  let pseudoHits = 0;
  for (let i = 0; i < guess.length; i++) {
    // Pomiń jeśli to hit
    if (solution[i] === guess[i]) continue;

    // Sprawdź czy ten kolor istnieje w mapie
    if (colorCount[guess[i]] > 0) {
      pseudoHits++;
      colorCount[guess[i]]--;
    }
  }

  return { hits, pseudoHits };
}

/**
 * Podejście 3: Kompaktowe z Dwiema Mapami - O(n)
 * Approach 3: Compact with Two Maps - O(n)
 *
 * Zlicz nie-hits w obu, potem oblicz pseudo-hits jako minimum
 * Count non-hits in both, then calculate pseudo-hits as minimum
 */
function masterMindCompact(solution, guess) {
  if (solution.length !== guess.length) {
    throw new Error('Solution and guess must have the same length');
  }

  let hits = 0;
  const solutionCounts = {};
  const guessCounts = {};

  // Jedno przejście: znajdź hits i zlicz nie-hits
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === guess[i]) {
      hits++;
    } else {
      solutionCounts[solution[i]] = (solutionCounts[solution[i]] || 0) + 1;
      guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
    }
  }

  // Oblicz pseudo-hits jako minimum liczności każdego koloru
  let pseudoHits = 0;
  for (let color in guessCounts) {
    if (solutionCounts[color]) {
      pseudoHits += Math.min(guessCounts[color], solutionCounts[color]);
    }
  }

  return { hits, pseudoHits };
}

/**
 * Podejście 4: Z Detalami - O(n)
 * Approach 4: With Details - O(n)
 *
 * Zwraca dodatkowe informacje o trafieniach
 * Returns additional information about matches
 */
function masterMindDetailed(solution, guess) {
  if (solution.length !== guess.length) {
    throw new Error('Solution and guess must have the same length');
  }

  let hits = 0;
  let pseudoHits = 0;
  const hitPositions = [];
  const pseudoHitPositions = [];
  const colorCount = {};

  // Przejście 1: Znajdź hits
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === guess[i]) {
      hits++;
      hitPositions.push(i);
    } else {
      colorCount[solution[i]] = (colorCount[solution[i]] || 0) + 1;
    }
  }

  // Przejście 2: Znajdź pseudo-hits
  for (let i = 0; i < guess.length; i++) {
    if (solution[i] === guess[i]) continue;

    if (colorCount[guess[i]] > 0) {
      pseudoHits++;
      pseudoHitPositions.push(i);
      colorCount[guess[i]]--;
    }
  }

  return {
    hits,
    pseudoHits,
    hitPositions,
    pseudoHitPositions
  };
}

/**
 * Funkcja pomocnicza: Wizualizacja porównania
 * Helper function: Visualize comparison
 */
function visualizeMasterMind(solution, guess) {
  console.log('\nWizualizacja Master Mind:');
  console.log(`Solution: ${solution.split('').join(' ')}`);
  console.log(`Guess:    ${guess.split('').join(' ')}`);
  console.log();

  const result = masterMindDetailed(solution, guess);

  console.log('Analiza pozycja po pozycji:');
  for (let i = 0; i < solution.length; i++) {
    const match = solution[i] === guess[i] ? 'HIT ✓' :
      result.pseudoHitPositions.includes(i) ? 'PSEUDO-HIT ~' : 'MISS ✗';
    console.log(`  Position ${i}: ${guess[i]} vs ${solution[i]} → ${match}`);
  }

  console.log();
  console.log(`Hits: ${result.hits}`);
  console.log(`Pseudo-Hits: ${result.pseudoHits}`);

  return result;
}

/**
 * Funkcja pomocnicza: Generuj losowe rozwiązanie
 * Helper function: Generate random solution
 */
function generateRandomSolution(length = 4, colors = ['R', 'G', 'B', 'Y']) {
  let solution = '';
  for (let i = 0; i < length; i++) {
    solution += colors[Math.floor(Math.random() * colors.length)];
  }
  return solution;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Master Mind - Hits and Pseudo-Hits ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania');
console.log('Solution: RGBY, Guess: GGRR');
const result1 = masterMind('RGBY', 'GGRR');
console.log(`Result: ${JSON.stringify(result1)}`);
console.log('Oczekiwane: {hits: 1, pseudoHits: 1}\n');

// Test 2: Wizualizacja
console.log('Test 2: Wizualizacja krok po kroku');
visualizeMasterMind('RGBY', 'GGRR');

// Test 3: Wszystkie trafienia
console.log('\nTest 3: Wszystkie trafienia (perfect match)');
const result3 = masterMind('RGBY', 'RGBY');
console.log(`Solution: RGBY, Guess: RGBY`);
console.log(`Result: ${JSON.stringify(result3)}`);
console.log('Oczekiwane: {hits: 4, pseudoHits: 0}\n');

// Test 4: Wszystkie pseudo-hits
console.log('Test 4: Wszystkie pseudo-hits (complete permutation)');
const result4 = masterMind('RGBY', 'BYGR');
console.log(`Solution: RGBY, Guess: BYGR`);
console.log(`Result: ${JSON.stringify(result4)}`);
console.log('Oczekiwane: {hits: 0, pseudoHits: 4}\n');

// Test 5: Brak trafień
console.log('Test 5: Brak trafień (no matches)');
const result5 = masterMind('RRRR', 'YYYY');
console.log(`Solution: RRRR, Guess: YYYY`);
console.log(`Result: ${JSON.stringify(result5)}`);
console.log('Oczekiwane: {hits: 0, pseudoHits: 0}\n');

// Test 6: Powtórzenia kolorów
console.log('Test 6: Powtórzenia kolorów (repeated colors)');
const testCases6 = [
  { solution: 'RRRR', guess: 'RRYY', expected: '{hits: 2, pseudoHits: 0}' },
  { solution: 'RRRR', guess: 'YRRR', expected: '{hits: 3, pseudoHits: 0}' },
  { solution: 'RRRR', guess: 'RRRR', expected: '{hits: 4, pseudoHits: 0}' },
  { solution: 'RRYY', guess: 'YYRR', expected: '{hits: 0, pseudoHits: 4}' },
  { solution: 'RRYY', guess: 'RRGG', expected: '{hits: 2, pseudoHits: 0}' }
];

testCases6.forEach(({ solution, guess, expected }, idx) => {
  const result = masterMind(solution, guess);
  console.log(`  ${idx + 1}. ${solution} vs ${guess} → ${JSON.stringify(result)} (oczekiwane: ${expected})`);
});
console.log();

// Test 7: Edge cases
console.log('Test 7: Edge cases');

console.log('a) Puste stringi:');
const result7a = masterMind('', '');
console.log(`   Result: ${JSON.stringify(result7a)}\n`);

console.log('b) Jeden kolor:');
const result7b = masterMind('R', 'R');
console.log(`   Result: ${JSON.stringify(result7b)}\n`);

console.log('c) Jeden kolor - miss:');
const result7c = masterMind('R', 'Y');
console.log(`   Result: ${JSON.stringify(result7c)}\n`);

console.log('d) Dwa kolory:');
const result7d = masterMind('RG', 'GR');
console.log(`   Result: ${JSON.stringify(result7d)}\n`);

// Test 8: Złożone przypadki
console.log('Test 8: Złożone przypadki (complex cases)');
const complexCases = [
  { solution: 'RGBY', guess: 'RRRR', desc: 'Powtórzenia w guess' },
  { solution: 'RRRR', guess: 'RGBY', desc: 'Powtórzenia w solution' },
  { solution: 'RGBR', guess: 'RRGB', desc: 'R w obu, różne pozycje' },
  { solution: 'RRGG', guess: 'GGRR', desc: 'Symetryczna permutacja' },
  { solution: 'RGYB', guess: 'BYGR', desc: 'Reverse order' }
];

complexCases.forEach(({ solution, guess, desc }) => {
  const result = masterMind(solution, guess);
  console.log(`  ${desc}:`);
  console.log(`    ${solution} vs ${guess} → ${JSON.stringify(result)}`);
});
console.log();

// Test 9: Porównanie wszystkich metod
console.log('Test 9: Porównanie wszystkich metod');
const testSolution = 'RGBY';
const testGuess = 'GGRR';

const r1 = masterMindTwoPass(testSolution, testGuess);
const r2 = masterMind(testSolution, testGuess);
const r3 = masterMindCompact(testSolution, testGuess);

console.log(`Solution: ${testSolution}, Guess: ${testGuess}`);
console.log(`Two Pass:      ${JSON.stringify(r1)}`);
console.log(`Frequency Map: ${JSON.stringify(r2)}`);
console.log(`Compact:       ${JSON.stringify(r3)}`);
console.log(`Wszystkie zgodne: ${
  r1.hits === r2.hits && r2.hits === r3.hits &&
  r1.pseudoHits === r2.pseudoHits && r2.pseudoHits === r3.pseudoHits ? '✓' : '✗'
}\n`);

// Test 10: Weryfikacja wszystkich metod na wielu przypadkach
console.log('Test 10: Weryfikacja poprawności wszystkich metod');
const verificationTests = [
  { solution: 'RGBY', guess: 'RGBY', expectedHits: 4, expectedPseudo: 0 },
  { solution: 'RGBY', guess: 'GGRR', expectedHits: 1, expectedPseudo: 1 },
  { solution: 'RGBY', guess: 'BYGR', expectedHits: 0, expectedPseudo: 4 },
  { solution: 'RRRR', guess: 'YYYY', expectedHits: 0, expectedPseudo: 0 },
  { solution: 'RRRR', guess: 'RRYY', expectedHits: 2, expectedPseudo: 0 },
  { solution: 'RGBR', guess: 'RRGB', expectedHits: 1, expectedPseudo: 2 }
];

let allCorrect = true;
verificationTests.forEach(({ solution, guess, expectedHits, expectedPseudo }, idx) => {
  const r1 = masterMindTwoPass(solution, guess);
  const r2 = masterMind(solution, guess);
  const r3 = masterMindCompact(solution, guess);

  const correct = r1.hits === expectedHits && r1.pseudoHits === expectedPseudo &&
    r2.hits === expectedHits && r2.pseudoHits === expectedPseudo &&
    r3.hits === expectedHits && r3.pseudoHits === expectedPseudo;

  allCorrect = allCorrect && correct;

  console.log(`  Test ${idx + 1}: ${solution} vs ${guess} → ${correct ? '✓' : '✗'}`);
  if (!correct) {
    console.log(`    Oczekiwane: hits=${expectedHits}, pseudo=${expectedPseudo}`);
    console.log(`    Otrzymano:  TwoPass=${JSON.stringify(r1)}, Map=${JSON.stringify(r2)}, Compact=${JSON.stringify(r3)}`);
  }
});

console.log(`\nWszystkie testy: ${allCorrect ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 11: Test wydajności
console.log('Test 11: Test wydajności (1000 gier)');
const iterations = 1000;

let start = Date.now();
for (let i = 0; i < iterations; i++) {
  const solution = generateRandomSolution();
  const guess = generateRandomSolution();
  masterMindTwoPass(solution, guess);
}
const timeTwoPass = Date.now() - start;

start = Date.now();
for (let i = 0; i < iterations; i++) {
  const solution = generateRandomSolution();
  const guess = generateRandomSolution();
  masterMind(solution, guess);
}
const timeMap = Date.now() - start;

start = Date.now();
for (let i = 0; i < iterations; i++) {
  const solution = generateRandomSolution();
  const guess = generateRandomSolution();
  masterMindCompact(solution, guess);
}
const timeCompact = Date.now() - start;

console.log(`Two Pass (O(n²)):     ${timeTwoPass}ms`);
console.log(`Frequency Map (O(n)): ${timeMap}ms`);
console.log(`Compact (O(n)):       ${timeCompact}ms`);
console.log();

// Test 12: Dłuższe kody (rozszerzenie)
console.log('Test 12: Dłuższe kody (8 pozycji)');
const solution12 = 'RGBYRGBY';
const guess12 = 'RGBGRBYR';
const result12 = masterMind(solution12, guess12);
console.log(`Solution: ${solution12}`);
console.log(`Guess:    ${guess12}`);
console.log(`Result: ${JSON.stringify(result12)}\n`);

// Test 13: Więcej kolorów
console.log('Test 13: Więcej kolorów (6 kolorów: R,G,B,Y,O,P)');
const solution13 = 'RGBYOP';
const guess13 = 'PORBGY';
const result13 = masterMind(solution13, guess13);
console.log(`Solution: ${solution13}`);
console.log(`Guess:    ${guess13}`);
console.log(`Result: ${JSON.stringify(result13)}\n`);

// Test 14: Szczególny przypadek - wszystkie różne vs wszystkie takie same
console.log('Test 14: Szczególny przypadek');
console.log('a) Wszystkie różne kolory w solution vs powtórzenia w guess:');
visualizeMasterMind('RGBY', 'RRRR');

console.log('\nb) Powtórzenia w solution vs wszystkie różne w guess:');
visualizeMasterMind('RRRR', 'RGBY');

// Test 15: Weryfikacja błędów
console.log('\nTest 15: Weryfikacja obsługi błędów');
try {
  masterMind('RGBY', 'RGB'); // Różne długości
  console.log('BŁĄD: Powinien rzucić wyjątek dla różnych długości!');
} catch (e) {
  console.log('✓ Poprawnie rzucono wyjątek dla różnych długości');
}
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Master Mind - Klasyczny problem liczenia dopasowań');
console.log('\nZłożoność (optymalna metoda):');
console.log('  Czasowa:  O(n) - dwa niezależne przejścia przez kod');
console.log('  Pamięciowa: O(1) - mapa ma stały rozmiar (max 4-6 kolorów)');
console.log('\nKluczowa idea:');
console.log('  1. Najpierw znajdź wszystkie exact matches (hits)');
console.log('  2. Następnie dla pozostałych kolorów znajdź pseudo-hits');
console.log('  3. Użyj mapy częstości by uniknąć podwójnego liczenia');
console.log('\nZastosowania:');
console.log('  - Gry logiczne (Master Mind, Bulls and Cows)');
console.log('  - Problemy dopasowania wzorców');
console.log('  - Systemy weryfikacji kodów');
