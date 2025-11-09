// ============================================================================
// 8.13 STACK OF BOXES - MAXIMUM HEIGHT STACK
// 8.13 STOS PUDEŁEK - STOS MAKSYMALNEJ WYSOKOŚCI
// ============================================================================

/**
 * Box class / Klasa Box
 */
class Box {
  constructor(width, height, depth) {
    this.width = width;   // Szerokość
    this.height = height; // Wysokość
    this.depth = depth;   // Głębokość
  }

  /**
   * Check if this box can be placed on top of other box
   * Sprawdź czy to pudełko może być umieszczone na górze innego pudełka
   *
   * All dimensions must be strictly smaller / Wszystkie wymiary muszą być ściśle mniejsze
   */
  canBeAbove(other) {
    return this.width < other.width &&
           this.height < other.height &&
           this.depth < other.depth;
  }

  toString() {
    return `Box(${this.width}×${this.height}×${this.depth})`;
  }
}

// ============================================================================
// APPROACH 1: RECURSIVE (BRUTE FORCE)
// PODEJŚCIE 1: REKURENCYJNE (BRUTE FORCE)
// ============================================================================

/**
 * Stack of Boxes - Recursive Brute Force
 * Stos Pudełek - Rekurencyjne Brute Force
 *
 * Try all possible stacks and find maximum height
 * Spróbuj wszystkich możliwych stosów i znajdź maksymalną wysokość
 *
 * Time: O(2^n) - Try include/exclude each box / Spróbuj włączyć/wykluczyć każde pudełko
 * Space: O(n) for recursion stack / dla stosu rekurencji
 *
 * @param {Box[]} boxes - Array of boxes / Tablica pudełek
 * @returns {number} - Maximum height / Maksymalna wysokość
 */
function maxStackHeightRecursive(boxes) {
  // Sort boxes by base area (descending) for optimization
  // Sortuj pudełka według powierzchni podstawy (malejąco) dla optymalizacji
  boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

  let maxHeight = 0;

  // Try starting with each box as base / Spróbuj zacząć z każdym pudełkiem jako podstawa
  for (let i = 0; i < boxes.length; i++) {
    const height = maxStackHeightRecursiveHelper(boxes, i);
    maxHeight = Math.max(maxHeight, height);
  }

  return maxHeight;
}

/**
 * Helper: Find max height starting with box at bottomIndex
 * Pomocnicza: Znajdź max wysokość zaczynając od pudełka na bottomIndex
 */
function maxStackHeightRecursiveHelper(boxes, bottomIndex) {
  const bottom = boxes[bottomIndex];
  let maxHeight = 0;

  // Try placing each smaller box on top / Spróbuj umieścić każde mniejsze pudełko na górze
  for (let i = bottomIndex + 1; i < boxes.length; i++) {
    if (boxes[i].canBeAbove(bottom)) {
      const height = maxStackHeightRecursiveHelper(boxes, i);
      maxHeight = Math.max(maxHeight, height);
    }
  }

  // Height = current box height + best stack on top
  // Wysokość = wysokość bieżącego pudełka + najlepszy stos na górze
  return bottom.height + maxHeight;
}

// ============================================================================
// APPROACH 2: DYNAMIC PROGRAMMING WITH MEMOIZATION
// PODEJŚCIE 2: PROGRAMOWANIE DYNAMICZNE Z MEMOIZACJĄ
// ============================================================================

/**
 * Stack of Boxes - DP with Memoization
 * Stos Pudełek - DP z Memoizacją
 *
 * Cache results to avoid recomputation
 * Cache'uj wyniki aby uniknąć ponownego obliczania
 *
 * Time: O(n^2) - Each box considered once with each other / Każde pudełko rozważone raz z każdym innym
 * Space: O(n) for memo and recursion / dla memo i rekurencji
 *
 * @param {Box[]} boxes - Array of boxes / Tablica pudełek
 * @returns {number} - Maximum height / Maksymalna wysokość
 */
function maxStackHeightMemo(boxes) {
  // Sort boxes by base area (descending) / Sortuj pudełka po powierzchni podstawy (malejąco)
  boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

  const memo = new Map();
  let maxHeight = 0;

  for (let i = 0; i < boxes.length; i++) {
    const height = maxStackHeightMemoHelper(boxes, i, memo);
    maxHeight = Math.max(maxHeight, height);
  }

  return maxHeight;
}

/**
 * Helper with memoization / Pomocnicza z memoizacją
 */
function maxStackHeightMemoHelper(boxes, bottomIndex, memo) {
  // Check memo / Sprawdź memo
  if (memo.has(bottomIndex)) {
    return memo.get(bottomIndex);
  }

  const bottom = boxes[bottomIndex];
  let maxHeight = 0;

  // Try each box that can go on top / Spróbuj każde pudełko które może iść na górę
  for (let i = bottomIndex + 1; i < boxes.length; i++) {
    if (boxes[i].canBeAbove(bottom)) {
      const height = maxStackHeightMemoHelper(boxes, i, memo);
      maxHeight = Math.max(maxHeight, height);
    }
  }

  const result = bottom.height + maxHeight;
  memo.set(bottomIndex, result);

  return result;
}

// ============================================================================
// APPROACH 3: BOTTOM-UP DYNAMIC PROGRAMMING
// PODEJŚCIE 3: PROGRAMOWANIE DYNAMICZNE OD DOŁU
// ============================================================================

/**
 * Stack of Boxes - Bottom-Up DP
 * Stos Pudełek - DP Od Dołu
 *
 * Build solution from smallest boxes up
 * Buduj rozwiązanie od najmniejszych pudełek w górę
 *
 * Time: O(n^2) - For each box, check all previous boxes / Dla każdego pudełka, sprawdź wszystkie poprzednie
 * Space: O(n) for dp array / dla tablicy dp
 *
 * @param {Box[]} boxes - Array of boxes / Tablica pudełek
 * @returns {number} - Maximum height / Maksymalna wysokość
 */
function maxStackHeightDP(boxes) {
  // Sort boxes by base area (descending) / Sortuj pudełka po powierzchni podstawy (malejąco)
  boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

  const n = boxes.length;
  const dp = new Array(n).fill(0);

  // Base case: Each box alone / Przypadek bazowy: Każde pudełko samo
  for (let i = 0; i < n; i++) {
    dp[i] = boxes[i].height;
  }

  // Build up: For each box, find best stack it can be placed on top of
  // Buduj w górę: Dla każdego pudełka, znajdź najlepszy stos na który może być umieszczone
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // If box i can be placed on top of box j / Jeśli pudełko i może być umieszczone na pudełku j
      if (boxes[i].canBeAbove(boxes[j])) {
        dp[i] = Math.max(dp[i], dp[j] + boxes[i].height);
      }
    }
  }

  // Return maximum height across all stacks / Zwróć maksymalną wysokość ze wszystkich stosów
  return Math.max(...dp);
}

// ============================================================================
// APPROACH 4: WITH STACK RECONSTRUCTION
// PODEJŚCIE 4: Z REKONSTRUKCJĄ STOSU
// ============================================================================

/**
 * Find maximum height and return actual stack
 * Znajdź maksymalną wysokość i zwróć rzeczywisty stos
 *
 * @param {Box[]} boxes - Array of boxes / Tablica pudełek
 * @returns {{height: number, stack: Box[]}} - Height and stack / Wysokość i stos
 */
function maxStackWithReconstruction(boxes) {
  // Sort boxes / Sortuj pudełka
  boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

  const n = boxes.length;
  const dp = new Array(n).fill(0);
  const parent = new Array(n).fill(-1); // To reconstruct stack / Do rekonstrukcji stosu

  // Initialize / Inicjalizuj
  for (let i = 0; i < n; i++) {
    dp[i] = boxes[i].height;
  }

  // Fill dp table / Wypełnij tabelę dp
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (boxes[i].canBeAbove(boxes[j])) {
        if (dp[j] + boxes[i].height > dp[i]) {
          dp[i] = dp[j] + boxes[i].height;
          parent[i] = j; // Track parent / Śledź rodzica
        }
      }
    }
  }

  // Find index with maximum height / Znajdź indeks z maksymalną wysokością
  let maxHeight = 0;
  let maxIndex = -1;

  for (let i = 0; i < n; i++) {
    if (dp[i] > maxHeight) {
      maxHeight = dp[i];
      maxIndex = i;
    }
  }

  // Reconstruct stack / Rekonstruuj stos
  const stack = [];
  let current = maxIndex;

  while (current !== -1) {
    stack.push(boxes[current]);
    current = parent[current];
  }

  stack.reverse(); // Bottom to top / Od dołu do góry

  return { height: maxHeight, stack };
}

// ============================================================================
// HELPER FUNCTIONS FOR TESTING / FUNKCJE POMOCNICZE DO TESTOWANIA
// ============================================================================

/**
 * Generate random boxes / Generuj losowe pudełka
 */
function generateRandomBoxes(count, maxDim = 20) {
  const boxes = [];
  for (let i = 0; i < count; i++) {
    const width = Math.floor(Math.random() * maxDim) + 1;
    const height = Math.floor(Math.random() * maxDim) + 1;
    const depth = Math.floor(Math.random() * maxDim) + 1;
    boxes.push(new Box(width, height, depth));
  }
  return boxes;
}

/**
 * Print stack / Wyświetl stos
 */
function printStack(stack, description = '') {
  if (description) {
    console.log(description);
  }

  console.log('Stack (bottom to top) / Stos (od dołu do góry):');
  let totalHeight = 0;

  stack.forEach((box, index) => {
    console.log(`  ${index + 1}. ${box.toString()}`);
    totalHeight += box.height;
  });

  console.log(`Total height / Całkowita wysokość: ${totalHeight}`);
  console.log();
}

/**
 * Validate stack / Waliduj stos
 */
function validateStack(stack) {
  for (let i = 1; i < stack.length; i++) {
    if (!stack[i].canBeAbove(stack[i - 1])) {
      return false;
    }
  }
  return true;
}

/**
 * Test all approaches / Testuj wszystkie podejścia
 */
function testAllApproaches(boxes, description) {
  console.log('='.repeat(70));
  console.log(description);
  console.log('='.repeat(70));

  console.log(`Number of boxes: ${boxes.length}`);
  console.log('Boxes:');
  boxes.forEach((box, i) => {
    console.log(`  ${i + 1}. ${box.toString()}`);
  });
  console.log();

  // Test different approaches / Testuj różne podejścia
  console.time('Recursive');
  const result1 = maxStackHeightRecursive([...boxes]);
  console.timeEnd('Recursive');

  console.time('Memoization');
  const result2 = maxStackHeightMemo([...boxes]);
  console.timeEnd('Memoization');

  console.time('Bottom-Up DP');
  const result3 = maxStackHeightDP([...boxes]);
  console.timeEnd('Bottom-Up DP');

  console.time('With Reconstruction');
  const result4 = maxStackWithReconstruction([...boxes]);
  console.timeEnd('With Reconstruction');

  console.log();
  console.log(`Results / Wyniki:`);
  console.log(`  Recursive:        ${result1}`);
  console.log(`  Memoization:      ${result2}`);
  console.log(`  Bottom-Up DP:     ${result3}`);
  console.log(`  Reconstruction:   ${result4.height}`);

  const allMatch = result1 === result2 && result2 === result3 && result3 === result4.height;
  console.log();
  console.log(`All approaches match: ${allMatch ? '✓' : '✗'}`);
  console.log();

  // Show actual stack / Pokaż rzeczywisty stos
  printStack(result4.stack, 'Optimal Stack / Optymalny Stos:');

  // Validate / Waliduj
  const isValid = validateStack(result4.stack);
  console.log(`Stack is valid: ${isValid ? '✓' : '✗'}`);
  console.log();

  return result3;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('\n');
console.log('='.repeat(70));
console.log('STACK OF BOXES - MAXIMUM HEIGHT STACK');
console.log('STOS PUDEŁEK - STOS MAKSYMALNEJ WYSOKOŚCI');
console.log('='.repeat(70));
console.log('\n');

// Test 1: Simple case with clear solution
console.log('TEST 1: Simple case with clear ordering');
console.log('       Prosty przypadek z wyraźną kolejnością');
const boxes1 = [
  new Box(10, 10, 10),
  new Box(8, 8, 8),
  new Box(6, 6, 6),
  new Box(4, 4, 4),
  new Box(2, 2, 2)
];
testAllApproaches(boxes1, 'TEST 1');

// Test 2: Not all boxes can be used
console.log('TEST 2: Not all boxes fit together');
console.log('       Nie wszystkie pudełka pasują razem');
const boxes2 = [
  new Box(5, 5, 5),
  new Box(4, 6, 4),   // Can't stack with others due to height / Nie może być na stosie z innymi przez wysokość
  new Box(3, 3, 3),
  new Box(2, 2, 2)
];
testAllApproaches(boxes2, 'TEST 2');

// Test 3: Multiple possible stacks
console.log('TEST 3: Multiple valid stacks, need to find best');
console.log('       Wiele prawidłowych stosów, trzeba znaleźć najlepszy');
const boxes3 = [
  new Box(10, 2, 10),  // Wide but short / Szerokie ale niskie
  new Box(8, 8, 8),    // Tall / Wysokie
  new Box(6, 6, 6),
  new Box(4, 4, 4)
];
testAllApproaches(boxes3, 'TEST 3');

// Test 4: Boxes with different dimensions
console.log('TEST 4: Varied dimensions');
console.log('       Zróżnicowane wymiary');
const boxes4 = [
  new Box(12, 3, 10),
  new Box(10, 5, 8),
  new Box(8, 4, 6),
  new Box(6, 2, 4),
  new Box(4, 1, 2)
];
testAllApproaches(boxes4, 'TEST 4');

// Test 5: Only one box can be used at a time
console.log('TEST 5: No boxes can stack (all incompatible)');
console.log('       Żadne pudełka nie mogą być na stosie (wszystkie niekompatybilne)');
const boxes5 = [
  new Box(5, 10, 5),
  new Box(10, 5, 10),
  new Box(7, 7, 3)
];
testAllApproaches(boxes5, 'TEST 5');

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log('\n');

// Edge Case 1: Single box
console.log('EDGE CASE 1: Single box');
console.log('-'.repeat(70));
const singleBox = [new Box(5, 10, 5)];
const result1 = maxStackHeightDP(singleBox);
console.log(`Single box height: ${result1} ${result1 === 10 ? '✓' : '✗'}`);
console.log();

// Edge Case 2: Two identical boxes (can't stack)
console.log('EDGE CASE 2: Two identical boxes (cannot stack)');
console.log('            Dwa identyczne pudełka (nie mogą być na stosie)');
console.log('-'.repeat(70));
const identicalBoxes = [new Box(5, 5, 5), new Box(5, 5, 5)];
const result2 = maxStackHeightDP(identicalBoxes);
console.log(`Height: ${result2} ${result2 === 5 ? '✓ (only one box)' : '✗'}`);
console.log();

// Edge Case 3: Large number of boxes
console.log('EDGE CASE 3: Performance test with many boxes');
console.log('            Test wydajności z wieloma pudełkami');
console.log('-'.repeat(70));
const manyBoxes = generateRandomBoxes(20);
console.time('20 random boxes');
const resultMany = maxStackHeightDP(manyBoxes);
console.timeEnd('20 random boxes');
console.log(`Maximum height with 20 boxes: ${resultMany}`);
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Recursive Brute Force / Rekurencyjne Brute Force');
console.log('  Time:  O(2^n) - Try all subsets / Spróbuj wszystkich podzbiorów');
console.log('  Space: O(n) - Recursion stack / Stos rekurencji');
console.log();
console.log('APPROACH 2: DP with Memoization / DP z Memoizacją');
console.log('  Time:  O(n^2) - Each box with each other / Każde pudełko z każdym innym');
console.log('  Space: O(n) - Memo table and recursion / Tabela memo i rekurencja');
console.log();
console.log('APPROACH 3: Bottom-Up DP (BEST) / DP Od Dołu (NAJLEPSZE)');
console.log('  Time:  O(n^2) - Nested loops / Zagnieżdżone pętle');
console.log('  Space: O(n) - DP array / Tablica DP');
console.log();
console.log('Key insight: Similar to Longest Increasing Subsequence (LIS)');
console.log('Kluczowe spostrzeżenie: Podobne do Najdłuższego Rosnącego Podciągu (LIS)');
console.log();
console.log('Sorting optimization: O(n log n) for sorting + O(n^2) for DP = O(n^2)');
console.log('Optymalizacja sortowania: O(n log n) sortowanie + O(n^2) DP = O(n^2)');
console.log();
console.log('='.repeat(70));
