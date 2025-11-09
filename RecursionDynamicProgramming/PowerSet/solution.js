// ============================================================================
// 8.4 POWER SET
// ============================================================================

/**
 * Power Set Problem
 * Problem Zbioru Potęgowego
 *
 * Write a method to return all subsets of a set.
 *
 * The power set of a set is the set of all its subsets, including the empty
 * set and the set itself.
 *
 * Napisz metodę zwracającą wszystkie podzbiory zbioru.
 *
 * Zbiór potęgowy to zbiór wszystkich jego podzbiorów, włączając zbiór pusty
 * i sam zbiór.
 */

// ============================================================================
// APPROACH 1: RECURSIVE (BUILD SUBSETS)
// PODEJŚCIE 1: REKURENCYJNE (BUDUJ PODZBIORY)
// ============================================================================

/**
 * Generate power set - Recursive approach
 * Wygeneruj zbiór potęgowy - Podejście rekurencyjne
 *
 * For each element, we have 2 choices: include it or exclude it
 * This creates a binary tree of decisions
 *
 * Dla każdego elementu mamy 2 wybory: uwzględnić lub wykluczyć
 * To tworzy drzewo binarne decyzji
 *
 * Time: O(n * 2^n) - 2^n subsets, each takes O(n) to copy
 * Space: O(n * 2^n) - store all subsets / przechowaj wszystkie podzbiory
 *
 * @param {Array} set - Input set / Zbiór wejściowy
 * @returns {Array<Array>} - Power set / Zbiór potęgowy
 */
function powerSetRecursive(set) {
  if (!set) return [[]];

  const result = [];
  powerSetRecursiveHelper(set, 0, [], result);
  return result;
}

/**
 * Helper for recursive power set generation
 * Pomocnik dla rekurencyjnego generowania zbioru potęgowego
 */
function powerSetRecursiveHelper(set, index, current, result) {
  // Base case: processed all elements / Przypadek bazowy: przetworzono wszystkie elementy
  if (index === set.length) {
    result.push([...current]); // Add copy of current subset / Dodaj kopię obecnego podzbioru
    return;
  }

  // Exclude current element / Wyklucz obecny element
  powerSetRecursiveHelper(set, index + 1, current, result);

  // Include current element / Uwzględnij obecny element
  current.push(set[index]);
  powerSetRecursiveHelper(set, index + 1, current, result);
  current.pop(); // Backtrack / Cofnij
}

// ============================================================================
// APPROACH 2: RECURSIVE (COMBINATORIAL)
// PODEJŚCIE 2: REKURENCYJNE (KOMBINATORYCZNE)
// ============================================================================

/**
 * Generate power set - Combinatorial recursive
 * Wygeneruj zbiór potęgowy - Rekurencyjne kombinatoryczne
 *
 * Build power set by adding current element to all subsets of remaining elements
 * Buduj zbiór potęgowy dodając obecny element do wszystkich podzbiorów pozostałych
 *
 * P(S) = P(S - {x}) ∪ {s ∪ {x} : s ∈ P(S - {x})}
 *
 * Time: O(n * 2^n)
 * Space: O(n * 2^n)
 *
 * @param {Array} set - Input set / Zbiór wejściowy
 * @returns {Array<Array>} - Power set / Zbiór potęgowy
 */
function powerSetCombinatorial(set) {
  if (!set) return [[]];
  return powerSetCombinatorialHelper(set, 0);
}

/**
 * Helper for combinatorial approach
 * Pomocnik dla podejścia kombinatorycznego
 */
function powerSetCombinatorialHelper(set, index) {
  // Base case: empty set / Przypadek bazowy: pusty zbiór
  if (index === set.length) {
    return [[]];
  }

  // Get all subsets of remaining elements / Pobierz wszystkie podzbiory pozostałych elementów
  const subsetsWithoutCurrent = powerSetCombinatorialHelper(set, index + 1);

  // Add current element to each subset / Dodaj obecny element do każdego podzbioru
  const subsetsWithCurrent = subsetsWithoutCurrent.map(subset =>
    [set[index], ...subset]
  );

  // Return union of both / Zwróć unię obu
  return [...subsetsWithoutCurrent, ...subsetsWithCurrent];
}

// ============================================================================
// APPROACH 3: ITERATIVE (BUILD UP)
// PODEJŚCIE 3: ITERACYJNE (BUDUJ W GÓRĘ)
// ============================================================================

/**
 * Generate power set - Iterative approach
 * Wygeneruj zbiór potęgowy - Podejście iteracyjne
 *
 * Start with [[]], then for each element, add it to all existing subsets
 * Zacznij od [[]], potem dla każdego elementu dodaj go do wszystkich istniejących podzbiorów
 *
 * Example / Przykład:
 * Set: [1, 2, 3]
 * Start:    [[]]
 * Add 1:    [[], [1]]
 * Add 2:    [[], [1], [2], [1,2]]
 * Add 3:    [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
 *
 * Time: O(n * 2^n)
 * Space: O(n * 2^n)
 *
 * @param {Array} set - Input set / Zbiór wejściowy
 * @returns {Array<Array>} - Power set / Zbiór potęgowy
 */
function powerSetIterative(set) {
  if (!set) return [[]];

  let result = [[]]; // Start with empty set / Zacznij od zbioru pustego

  // For each element in the set / Dla każdego elementu w zbiorze
  for (const element of set) {
    const newSubsets = [];

    // Add current element to each existing subset
    // Dodaj obecny element do każdego istniejącego podzbioru
    for (const subset of result) {
      newSubsets.push([...subset, element]);
    }

    // Add new subsets to result / Dodaj nowe podzbiory do wyniku
    result = [...result, ...newSubsets];
  }

  return result;
}

// ============================================================================
// APPROACH 4: BIT MANIPULATION
// PODEJŚCIE 4: MANIPULACJA BITOWA
// ============================================================================

/**
 * Generate power set - Bit manipulation
 * Wygeneruj zbiór potęgowy - Manipulacja bitowa
 *
 * Each subset can be represented by a binary number
 * For set of size n, iterate from 0 to 2^n - 1
 * If bit i is set, include element i in subset
 *
 * Każdy podzbiór może być reprezentowany przez liczbę binarną
 * Dla zbioru rozmiaru n, iteruj od 0 do 2^n - 1
 * Jeśli bit i jest ustawiony, uwzględnij element i w podzbiorze
 *
 * Example / Przykład:
 * Set: [a, b, c]
 * 000 (0) → []
 * 001 (1) → [a]
 * 010 (2) → [b]
 * 011 (3) → [a, b]
 * 100 (4) → [c]
 * 101 (5) → [a, c]
 * 110 (6) → [b, c]
 * 111 (7) → [a, b, c]
 *
 * Time: O(n * 2^n)
 * Space: O(n * 2^n)
 *
 * @param {Array} set - Input set / Zbiór wejściowy
 * @returns {Array<Array>} - Power set / Zbiór potęgowy
 */
function powerSetBitManipulation(set) {
  if (!set) return [[]];

  const n = set.length;
  const powerSetSize = 1 << n; // 2^n using bit shift / 2^n używając przesunięcia bitowego
  const result = [];

  // Iterate through all possible subsets / Iteruj przez wszystkie możliwe podzbiory
  for (let i = 0; i < powerSetSize; i++) {
    const subset = [];

    // Check each bit / Sprawdź każdy bit
    for (let j = 0; j < n; j++) {
      // If j-th bit is set in i, include set[j] / Jeśli j-ty bit jest ustawiony w i, uwzględnij set[j]
      if ((i & (1 << j)) !== 0) {
        subset.push(set[j]);
      }
    }

    result.push(subset);
  }

  return result;
}

// ============================================================================
// HELPER FUNCTIONS / FUNKCJE POMOCNICZE
// ============================================================================

/**
 * Sort subsets for consistent comparison
 * Sortuj podzbiory dla spójnego porównania
 */
function sortSubsets(subsets) {
  // Sort each subset / Sortuj każdy podzbiór
  const sortedSubsets = subsets.map(subset => [...subset].sort());

  // Sort subsets by length, then lexicographically
  // Sortuj podzbiory według długości, potem leksykograficznie
  return sortedSubsets.sort((a, b) => {
    if (a.length !== b.length) {
      return a.length - b.length;
    }
    return JSON.stringify(a).localeCompare(JSON.stringify(b));
  });
}

/**
 * Compare two power sets for equality
 * Porównaj dwa zbiory potęgowe pod kątem równości
 */
function powerSetsEqual(ps1, ps2) {
  if (ps1.length !== ps2.length) return false;

  const sorted1 = sortSubsets(ps1);
  const sorted2 = sortSubsets(ps2);

  for (let i = 0; i < sorted1.length; i++) {
    if (JSON.stringify(sorted1[i]) !== JSON.stringify(sorted2[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Print power set in readable format
 * Wydrukuj zbiór potęgowy w czytelnym formacie
 */
function printPowerSet(powerSet, description = '') {
  if (description) {
    console.log(description);
  }

  console.log(`Total subsets: ${powerSet.length}`);
  console.log('Subsets / Podzbiory:');

  const sorted = sortSubsets(powerSet);

  sorted.forEach((subset, i) => {
    const subsetStr = subset.length === 0 ? '∅' : `{${subset.join(', ')}}`;
    console.log(`  ${i + 1}. ${subsetStr}`);
  });
}

/**
 * Visualize bit manipulation approach
 * Wizualizuj podejście manipulacji bitowej
 */
function visualizeBitApproach(set) {
  console.log('Bit Manipulation Visualization:');
  console.log('Wizualizacja Manipulacji Bitowej:');
  console.log('-'.repeat(70));

  const n = set.length;
  const powerSetSize = 1 << n;

  console.log(`Set: [${set.join(', ')}]`);
  console.log(`Number of subsets: 2^${n} = ${powerSetSize}`);
  console.log();

  for (let i = 0; i < powerSetSize; i++) {
    const binary = i.toString(2).padStart(n, '0');
    const subset = [];

    for (let j = 0; j < n; j++) {
      if ((i & (1 << j)) !== 0) {
        subset.push(set[j]);
      }
    }

    const subsetStr = subset.length === 0 ? '∅' : `{${subset.join(', ')}}`;
    console.log(`${i.toString().padStart(2)} = ${binary} → ${subsetStr}`);
  }
  console.log();
}

/**
 * Test all approaches with a set
 * Testuj wszystkie podejścia ze zbiorem
 */
function testAllApproaches(set, description) {
  console.log(description);
  console.log('-'.repeat(70));
  console.log(`Input set: [${set.join(', ')}]`);
  console.log(`Expected subsets: 2^${set.length} = ${1 << set.length}`);
  console.log();

  const recursive = powerSetRecursive(set);
  const combinatorial = powerSetCombinatorial(set);
  const iterative = powerSetIterative(set);
  const bitManip = powerSetBitManipulation(set);

  console.log(`Recursive:      ${recursive.length} subsets`);
  console.log(`Combinatorial:  ${combinatorial.length} subsets`);
  console.log(`Iterative:      ${iterative.length} subsets`);
  console.log(`Bit Manipulation: ${bitManip.length} subsets`);

  // Verify all approaches produce same result / Sprawdź czy wszystkie podejścia dają ten sam wynik
  const allEqual = powerSetsEqual(recursive, combinatorial) &&
                   powerSetsEqual(combinatorial, iterative) &&
                   powerSetsEqual(iterative, bitManip);

  console.log(`All approaches match: ${allEqual ? '✓' : '✗'}`);
  console.log();

  return recursive;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('POWER SET - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Small set {1, 2, 3} / Mały zbiór {1, 2, 3}
console.log('TEST 1: Small set {1, 2, 3}');
console.log('       Mały zbiór {1, 2, 3}');
console.log('-'.repeat(70));
const set1 = [1, 2, 3];
const result1 = testAllApproaches(set1, 'Set: {1, 2, 3}');
printPowerSet(result1);
console.log();

// Test 2: Single element / Pojedynczy element
console.log('TEST 2: Single element {a}');
console.log('       Pojedynczy element {a}');
console.log('-'.repeat(70));
const set2 = ['a'];
const result2 = testAllApproaches(set2, 'Set: {a}');
printPowerSet(result2);
console.log();

// Test 3: Two elements / Dwa elementy
console.log('TEST 3: Two elements {x, y}');
console.log('       Dwa elementy {x, y}');
console.log('-'.repeat(70));
const set3 = ['x', 'y'];
const result3 = testAllApproaches(set3, 'Set: {x, y}');
printPowerSet(result3);
console.log();

// Test 4: Four elements / Cztery elementy
console.log('TEST 4: Four elements {1, 2, 3, 4}');
console.log('       Cztery elementy {1, 2, 3, 4}');
console.log('-'.repeat(70));
const set4 = [1, 2, 3, 4];
testAllApproaches(set4, 'Set: {1, 2, 3, 4}');
console.log('(Showing count only for brevity / Pokazano tylko liczbę dla zwięzłości)');
console.log();

// Test 5: Letters / Litery
console.log('TEST 5: Letters {a, b, c, d}');
console.log('       Litery {a, b, c, d}');
console.log('-'.repeat(70));
const set5 = ['a', 'b', 'c', 'd'];
testAllApproaches(set5, 'Set: {a, b, c, d}');
console.log();

// Test 6: Bit manipulation visualization / Wizualizacja manipulacji bitowej
console.log('TEST 6: Bit manipulation visualization for {a, b, c}');
console.log('       Wizualizacja manipulacji bitowej dla {a, b, c}');
console.log('-'.repeat(70));
visualizeBitApproach(['a', 'b', 'c']);

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: Empty set / Pusty zbiór
console.log('EDGE CASE 1: Empty set');
console.log('            Pusty zbiór');
console.log('-'.repeat(70));
const emptySet = [];
const resultEmpty = testAllApproaches(emptySet, 'Empty set:');
printPowerSet(resultEmpty);
console.log();

// Edge Case 2: Larger set (5 elements) / Większy zbiór (5 elementów)
console.log('EDGE CASE 2: Larger set {1, 2, 3, 4, 5}');
console.log('            Większy zbiór {1, 2, 3, 4, 5}');
console.log('-'.repeat(70));
const set6 = [1, 2, 3, 4, 5];
testAllApproaches(set6, 'Set with 5 elements:');
console.log(`(2^5 = 32 subsets - showing count only / 32 podzbiory - pokazano tylko liczbę)`);
console.log();

// ============================================================================
// STEP-BY-STEP EXAMPLE / PRZYKŁAD KROK PO KROKU
// ============================================================================

console.log('='.repeat(70));
console.log('STEP-BY-STEP EXAMPLE: ITERATIVE APPROACH');
console.log('PRZYKŁAD KROK PO KROKU: PODEJŚCIE ITERACYJNE');
console.log('='.repeat(70));
console.log();

console.log('Building power set for {1, 2, 3}:');
console.log('Budowanie zbioru potęgowego dla {1, 2, 3}:');
console.log('-'.repeat(70));

let stepResult = [[]];
console.log('Step 0: Start with empty set');
console.log(`        Result: ${JSON.stringify(sortSubsets(stepResult))}`);
console.log();

const stepSet = [1, 2, 3];
for (let i = 0; i < stepSet.length; i++) {
  const element = stepSet[i];
  const newSubsets = [];

  for (const subset of stepResult) {
    newSubsets.push([...subset, element]);
  }

  stepResult = [...stepResult, ...newSubsets];

  console.log(`Step ${i + 1}: Add element ${element}`);
  console.log(`        New subsets: ${JSON.stringify(newSubsets)}`);
  console.log(`        Result: ${JSON.stringify(sortSubsets(stepResult))}`);
  console.log();
}

// ============================================================================
// PERFORMANCE COMPARISON / PORÓWNANIE WYDAJNOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('PERFORMANCE COMPARISON / PORÓWNANIE WYDAJNOŚCI');
console.log('='.repeat(70));
console.log();

/**
 * Measure execution time
 * Zmierz czas wykonania
 */
function measureTime(fn, set, name) {
  const start = process.hrtime.bigint();
  const result = fn(set);
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to ms

  console.log(`${name.padEnd(25)}: ${result.length} subsets, ${duration.toFixed(4)}ms`);
  return result;
}

const perfSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(`Performance test with ${perfSet.length} elements (2^${perfSet.length} = ${1 << perfSet.length} subsets):`);
console.log('-'.repeat(70));

measureTime(powerSetRecursive, perfSet, 'Recursive');
measureTime(powerSetCombinatorial, perfSet, 'Combinatorial');
measureTime(powerSetIterative, perfSet, 'Iterative');
measureTime(powerSetBitManipulation, perfSet, 'Bit Manipulation');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('ALL APPROACHES:');
console.log('  Time:  O(n * 2^n) - Generate 2^n subsets, each takes O(n) to copy');
console.log('                      Wygeneruj 2^n podzbiorów, każdy wymaga O(n) do skopiowania');
console.log('  Space: O(n * 2^n) - Store all subsets / Przechowaj wszystkie podzbiory');
console.log();
console.log('APPROACH 1: Recursive (Backtracking)');
console.log('  Pros:  Clear logic, explores decision tree / Jasna logika, eksploruje drzewo decyzji');
console.log('  Cons:  Requires backtracking / Wymaga cofania');
console.log();
console.log('APPROACH 2: Recursive (Combinatorial)');
console.log('  Pros:  Elegant, mathematical / Eleganckie, matematyczne');
console.log('  Cons:  More memory allocations / Więcej alokacji pamięci');
console.log();
console.log('APPROACH 3: Iterative');
console.log('  Pros:  No recursion, easy to understand / Bez rekurencji, łatwe do zrozumienia');
console.log('  Cons:  More space at each step / Więcej przestrzeni na każdym kroku');
console.log();
console.log('APPROACH 4: Bit Manipulation');
console.log('  Pros:  Fast, clever, good for small sets / Szybkie, sprytne, dobre dla małych zbiorów');
console.log('  Cons:  Limited to sets of size ≤ 30-32 (integer overflow)');
console.log('         Ograniczone do zbiorów rozmiaru ≤ 30-32 (przepełnienie liczby)');
console.log();
console.log('RECOMMENDATION / REKOMENDACJA:');
console.log('  - Interview: Iterative (easiest to explain) / Rozmowa: Iteracyjne (najłatwiejsze do wyjaśnienia)');
console.log('  - Production: Bit manipulation for small sets, Iterative for larger');
console.log('                Manipulacja bitowa dla małych zbiorów, Iteracyjne dla większych');
console.log('='.repeat(70));
