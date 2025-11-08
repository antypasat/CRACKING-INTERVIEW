class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

// ============================================================================
// APPROACH 1: HASH SET (Brute Force)
// PODEJŚCIE 1: HASH SET (Siłowe)
// ============================================================================

/**
 * Detect Loop - Hash Set Approach
 * Wykryj Pętlę - Podejście Hash Set
 *
 * Store visited nodes, return first revisited node
 * Przechowuj odwiedzone węzły, zwróć pierwszy ponownie odwiedzony węzeł
 *
 * Time: O(n), Space: O(n)
 *
 * @param {Node} head - Head of linked list / Głowa listy połączonej
 * @returns {Node|null} - Start of loop or null / Początek pętli lub null
 */
function detectLoopHashSet(head) {
  const visited = new Set();
  let current = head;

  while (current) {
    if (visited.has(current)) {
      return current; // Found loop start! / Znaleziono początek pętli!
    }
    visited.add(current);
    current = current.next;
  }

  return null; // No loop / Brak pętli
}

// ============================================================================
// APPROACH 2: FLOYD'S CYCLE DETECTION (Optimal)
// PODEJŚCIE 2: WYKRYWANIE CYKLU FLOYDA (Optymalne)
// ============================================================================

/**
 * Detect Loop - Floyd's Algorithm (Tortoise and Hare)
 * Wykryj Pętlę - Algorytm Floyda (Żółw i Zając)
 *
 * FAMOUS ALGORITHM / SŁYNNY ALGORYTM:
 * Also known as "Floyd's Cycle Detection" or "Tortoise and Hare"
 * Znany także jako "Wykrywanie Cyklu Floyda" lub "Żółw i Zając"
 *
 * HOW IT WORKS / JAK TO DZIAŁA:
 *
 * Phase 1: Detect if loop exists / Faza 1: Wykryj czy pętla istnieje
 *   - Use two pointers: slow (1 step) and fast (2 steps)
 *   - If they meet, loop exists
 *   - Użyj dwóch wskaźników: wolny (1 krok) i szybki (2 kroki)
 *   - Jeśli się spotkają, pętla istnieje
 *
 * Phase 2: Find loop start / Faza 2: Znajdź początek pętli
 *   - Move one pointer to head
 *   - Move both at same speed (1 step)
 *   - They meet at loop start!
 *   - Przesuń jeden wskaźnik na początek
 *   - Przesuwaj oba z tą samą prędkością (1 krok)
 *   - Spotkają się na początku pętli!
 *
 * MATHEMATICAL PROOF / DOWÓD MATEMATYCZNY:
 * Let k = distance from head to loop start
 * Let m = distance from loop start to meeting point
 * Let L = loop length
 *
 * When they meet:
 *   slow traveled: k + m
 *   fast traveled: k + m + nL (n loops)
 *   fast = 2 * slow: k + m + nL = 2(k + m)
 *   Simplify: k = nL - m
 *
 * This means: distance from head to loop start =
 *             distance from meeting point to loop start (going around)
 *
 * Time: O(n), Space: O(1)
 *
 * @param {Node} head - Head of linked list / Głowa listy połączonej
 * @returns {Node|null} - Start of loop or null / Początek pętli lub null
 */
function detectLoop(head) {
  if (!head || !head.next) return null;

  // Phase 1: Detect loop / Faza 1: Wykryj pętlę
  let slow = head;
  let fast = head;

  // Move slow by 1, fast by 2 / Przesuń wolny o 1, szybki o 2
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // Loop detected! / Pętla wykryta!
      break;
    }
  }

  // No loop found / Nie znaleziono pętli
  if (!fast || !fast.next) {
    return null;
  }

  // Phase 2: Find loop start / Faza 2: Znajdź początek pętli
  slow = head; // Move slow to head / Przesuń wolny na początek

  // Move both at same speed until they meet / Przesuwaj oba z tą samą prędkością aż się spotkają
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }

  // They meet at loop start! / Spotykają się na początku pętli!
  return slow;
}

/**
 * Alternative: Just detect if loop exists (boolean)
 * Alternatywa: Tylko wykryj czy pętla istnieje (boolean)
 */
function hasLoop(head) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}

/**
 * Get loop length / Pobierz długość pętli
 */
function getLoopLength(head) {
  const loopStart = detectLoop(head);
  if (!loopStart) return 0;

  let current = loopStart.next;
  let length = 1;

  while (current !== loopStart) {
    length++;
    current = current.next;
  }

  return length;
}

// ============================================================================
// HELPER FUNCTIONS FOR TESTING / FUNKCJE POMOCNICZE DO TESTOWANIA
// ============================================================================

/**
 * Create linked list with loop / Utwórz listę połączoną z pętlą
 *
 * @param {Array} values - Node values / Wartości węzłów
 * @param {number} loopStart - Index where loop starts (-1 for no loop)
 * @returns {Object} - {head, loopNode}
 */
function createListWithLoop(values, loopStartIndex) {
  if (!values || values.length === 0) return { head: null, loopNode: null };

  // Create nodes / Utwórz węzły
  const head = new Node(values[0]);
  const nodes = [head];
  let current = head;

  for (let i = 1; i < values.length; i++) {
    current.next = new Node(values[i]);
    current = current.next;
    nodes.push(current);
  }

  // Create loop if specified / Utwórz pętlę jeśli określono
  let loopNode = null;
  if (loopStartIndex >= 0 && loopStartIndex < nodes.length) {
    loopNode = nodes[loopStartIndex];
    current.next = loopNode; // Point last node to loop start / Ustaw ostatni węzeł na początek pętli
  }

  return { head, loopNode };
}

/**
 * Convert list to string (handling loops) / Konwertuj listę na string (obsługując pętle)
 */
function listToString(head, maxNodes = 20) {
  const result = [];
  const visited = new Set();
  let current = head;
  let count = 0;

  while (current && count < maxNodes) {
    if (visited.has(current)) {
      result.push(`[${current.data} - loop detected]`);
      break;
    }

    result.push(current.data);
    visited.add(current);
    current = current.next;
    count++;
  }

  if (current && count >= maxNodes) {
    result.push('...');
  }

  return result.join(' -> ');
}

/**
 * Get all node values in order / Pobierz wszystkie wartości węzłów w kolejności
 */
function getNodeValues(head, limit = 20) {
  const values = [];
  const visited = new Set();
  let current = head;

  while (current && values.length < limit) {
    if (visited.has(current)) break;
    values.push(current.data);
    visited.add(current);
    current = current.next;
  }

  return values;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('LOOP DETECTION - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Example from problem / Przykład z zadania
console.log('TEST 1: Loop starting at C');
console.log('       Pętla zaczynająca się w C');
console.log('-'.repeat(70));
console.log('List: A -> B -> C -> D -> E -> C (back to C)');
console.log('      Lista: A -> B -> C -> D -> E -> C (powrót do C)');
const test1 = createListWithLoop(['A', 'B', 'C', 'D', 'E'], 2);
console.log(`Visual: ${listToString(test1.head)}`);
const result1a = detectLoopHashSet(test1.head);
const result1b = detectLoop(test1.head);
const hasLoop1 = hasLoop(test1.head);
const loopLen1 = getLoopLength(test1.head);
console.log(`Hash Set:        ${result1a ? result1a.data : 'null'} ${result1a === test1.loopNode ? '✓' : '✗'}`);
console.log(`Floyd:           ${result1b ? result1b.data : 'null'} ${result1b === test1.loopNode ? '✓' : '✗'}`);
console.log(`Has Loop:        ${hasLoop1 ? 'Yes ✓' : 'No'}`);
console.log(`Loop Length:     ${loopLen1}`);
console.log(`Expected:        C (index 2)`);
console.log();

// Test 2: Loop at head / Pętla na początku
console.log('TEST 2: Loop starting at head');
console.log('       Pętla zaczynająca się na początku');
console.log('-'.repeat(70));
const test2 = createListWithLoop([1, 2, 3, 4], 0);
console.log(`Visual: ${listToString(test2.head)}`);
const result2 = detectLoop(test2.head);
console.log(`Result:  ${result2 ? result2.data : 'null'} ${result2 === test2.loopNode ? '✓' : '✗'}`);
console.log(`Expected: 1 (index 0)`);
console.log();

// Test 3: Loop at end / Pętla na końcu
console.log('TEST 3: Loop starting at last node');
console.log('       Pętla zaczynająca się na ostatnim węźle');
console.log('-'.repeat(70));
const test3 = createListWithLoop([1, 2, 3, 4, 5], 4);
console.log(`Visual: ${listToString(test3.head)}`);
const result3 = detectLoop(test3.head);
console.log(`Result:  ${result3 ? result3.data : 'null'} ${result3 === test3.loopNode ? '✓' : '✗'}`);
console.log(`Expected: 5 (index 4)`);
console.log();

// Test 4: No loop / Brak pętli
console.log('TEST 4: No loop');
console.log('       Brak pętli');
console.log('-'.repeat(70));
const test4 = createListWithLoop([1, 2, 3, 4, 5], -1);
console.log(`Visual: ${listToString(test4.head)}`);
const result4 = detectLoop(test4.head);
const hasLoop4 = hasLoop(test4.head);
console.log(`Result:   ${result4 === null ? 'null ✓' : 'ERROR ✗'}`);
console.log(`Has Loop: ${hasLoop4 ? 'Yes' : 'No ✓'}`);
console.log();

// Test 5: Small loop / Mała pętla
console.log('TEST 5: Small loop (2 nodes)');
console.log('       Mała pętla (2 węzły)');
console.log('-'.repeat(70));
const test5 = createListWithLoop([1, 2], 0);
console.log(`Visual: ${listToString(test5.head)}`);
const result5 = detectLoop(test5.head);
const loopLen5 = getLoopLength(test5.head);
console.log(`Result:      ${result5 ? result5.data : 'null'} ${result5 === test5.loopNode ? '✓' : '✗'}`);
console.log(`Loop Length: ${loopLen5}`);
console.log();

// Test 6: Self loop / Pętla do siebie
console.log('TEST 6: Self loop (points to itself)');
console.log('       Pętla do siebie (wskazuje na siebie)');
console.log('-'.repeat(70));
const selfLoopNode = new Node(42);
selfLoopNode.next = selfLoopNode; // Points to itself / Wskazuje na siebie
console.log(`Visual: 42 -> [42 - loop]`);
const result6 = detectLoop(selfLoopNode);
const loopLen6 = getLoopLength(selfLoopNode);
console.log(`Result:      ${result6 ? result6.data : 'null'} ${result6 === selfLoopNode ? '✓' : '✗'}`);
console.log(`Loop Length: ${loopLen6}`);
console.log();

// Test 7: Loop in middle / Pętla w środku
console.log('TEST 7: Loop in middle of list');
console.log('       Pętla w środku listy');
console.log('-'.repeat(70));
const test7 = createListWithLoop([1, 2, 3, 4, 5, 6, 7], 3);
console.log(`List: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> [4...]`);
const result7 = detectLoop(test7.head);
const loopLen7 = getLoopLength(test7.head);
console.log(`Result:      ${result7 ? result7.data : 'null'} ${result7 === test7.loopNode ? '✓' : '✗'}`);
console.log(`Loop Length: ${loopLen7}`);
console.log(`Expected:    4 (index 3), Loop length: 4`);
console.log();

// Test 8: Large loop / Duża pętla
console.log('TEST 8: Large loop');
console.log('       Duża pętla');
console.log('-'.repeat(70));
const values8 = Array.from({ length: 100 }, (_, i) => i + 1);
const test8 = createListWithLoop(values8, 10);
const result8 = detectLoop(test8.head);
const loopLen8 = getLoopLength(test8.head);
console.log(`List: 1 -> 2 -> ... -> 100 -> [11...]`);
console.log(`Result:      ${result8 ? result8.data : 'null'} ${result8 === test8.loopNode ? '✓' : '✗'}`);
console.log(`Loop Length: ${loopLen8}`);
console.log(`Expected:    11 (index 10), Loop length: 90`);
console.log();

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: Empty list / Pusta lista
console.log('EDGE CASE 1: Empty list');
console.log('            Pusta lista');
console.log('-'.repeat(70));
const result9 = detectLoop(null);
console.log(`Result: ${result9 === null ? 'null ✓' : 'ERROR ✗'}`);
console.log();

// Edge Case 2: Single node no loop / Pojedynczy węzeł bez pętli
console.log('EDGE CASE 2: Single node, no loop');
console.log('            Pojedynczy węzeł, brak pętli');
console.log('-'.repeat(70));
const singleNode = new Node(1);
const result10 = detectLoop(singleNode);
console.log(`Result: ${result10 === null ? 'null ✓' : 'ERROR ✗'}`);
console.log();

// Edge Case 3: Single node with self loop / Pojedynczy węzeł z pętlą do siebie
console.log('EDGE CASE 3: Single node with self loop');
console.log('            Pojedynczy węzeł z pętlą do siebie');
console.log('-'.repeat(70));
const selfLoop2 = new Node(5);
selfLoop2.next = selfLoop2;
const result11 = detectLoop(selfLoop2);
console.log(`Result: ${result11 ? result11.data : 'null'} ${result11 === selfLoop2 ? '✓' : '✗'}`);
console.log();

// ============================================================================
// VISUAL DEMONSTRATION / DEMONSTRACJA WIZUALNA
// ============================================================================

console.log('='.repeat(70));
console.log('VISUAL DEMONSTRATION / DEMONSTRACJA WIZUALNA');
console.log('='.repeat(70));
console.log();
console.log('Example: A -> B -> C -> D -> E -> C (loop back to C)');
console.log();
console.log('Phase 1: Detection / Faza 1: Wykrywanie');
console.log('  slow (1 step): A -> B -> C -> D -> E -> C -> D -> E');
console.log('  fast (2 step): A -> C -> E -> D     -> C -> E ...');
console.log('  They meet at E (inside the loop) / Spotykają się w E (w pętli)');
console.log();
console.log('Phase 2: Find start / Faza 2: Znajdź początek');
console.log('  slow = head (A), fast stays at meeting point (E)');
console.log('  Both move 1 step:');
console.log('    slow: A -> B -> C');
console.log('    fast: E -> C');
console.log('  They meet at C - loop start! / Spotykają się w C - początek pętli!');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Hash Set / Zbiór Hash');
console.log('  Time: O(n)   - Visit each node once / Odwiedź każdy węzeł raz');
console.log('  Space: O(n)  - Store all nodes / Przechowuj wszystkie węzły');
console.log();
console.log('APPROACH 2: Floyd\'s Algorithm / Algorytm Floyda');
console.log('  Time: O(n)   - Two passes: detect + find start');
console.log('                Dwa przejścia: wykryj + znajdź początek');
console.log('  Space: O(1)  - Only two pointers / Tylko dwa wskaźniki');
console.log();
console.log('Best approach: Floyd\'s Algorithm (O(1) space) ⭐');
console.log('Najlepsze: Algorytm Floyda (O(1) przestrzeń) ⭐');
console.log();
console.log('WHY IT\'S CALLED "TORTOISE AND HARE" / DLACZEGO "ŻÓŁW I ZAJĄC"');
console.log('  Slow pointer = tortoise (moves 1 step) / wolny = żółw');
console.log('  Fast pointer = hare (moves 2 steps) / szybki = zając');
console.log('  Eventually hare catches tortoise in loop!');
console.log('  W końcu zając dogania żółwia w pętli!');
console.log('='.repeat(70));
