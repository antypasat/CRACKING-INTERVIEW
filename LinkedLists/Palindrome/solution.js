class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

// ============================================================================
// APPROACH 1: REVERSE AND COMPARE
// PODEJŚCIE 1: ODWRÓĆ I PORÓWNAJ
// ============================================================================

/**
 * Palindrome Check - Reverse and Compare
 * Sprawdzenie Palindromu - Odwróć i Porównaj
 *
 * Creates a reversed copy of the list and compares with original
 * Tworzy odwróconą kopię listy i porównuje z oryginałem
 *
 * Time: O(n), Space: O(n)
 *
 * @param {Node} head - Head of linked list / Głowa listy połączonej
 * @returns {boolean} - true if palindrome / true jeśli palindrom
 */
function isPalindromeReverse(head) {
  if (!head || !head.next) return true; // 0 or 1 node is palindrome

  // Create reversed copy / Utwórz odwróconą kopię
  const reversed = reverseAndClone(head);

  // Compare original with reversed / Porównaj oryginał z odwróconym
  return isEqual(head, reversed);
}

/**
 * Helper: Clone and reverse list / Pomocnicza: Klonuj i odwróć listę
 */
function reverseAndClone(head) {
  let newHead = null;
  let current = head;

  while (current) {
    const newNode = new Node(current.data); // Clone / Klonuj
    newNode.next = newHead;
    newHead = newNode;
    current = current.next;
  }

  return newHead;
}

/**
 * Helper: Compare two lists / Pomocnicza: Porównaj dwie listy
 */
function isEqual(l1, l2) {
  while (l1 && l2) {
    if (l1.data !== l2.data) return false;
    l1 = l1.next;
    l2 = l2.next;
  }
  return l1 === null && l2 === null; // Both should end at same time
}

// ============================================================================
// APPROACH 2: STACK (Half List)
// PODEJŚCIE 2: STOS (Połowa Listy)
// ============================================================================

/**
 * Palindrome Check - Stack Approach
 * Sprawdzenie Palindromu - Podejście ze Stosem
 *
 * Uses fast/slow runner to find middle, pushes first half to stack,
 * then compares second half with stack
 * Używa szybkiego/wolnego wskaźnika do znalezienia środka, odkłada pierwszą
 * połowę na stos, potem porównuje drugą połowę ze stosem
 *
 * Time: O(n), Space: O(n/2) = O(n)
 *
 * @param {Node} head - Head of linked list / Głowa listy połączonej
 * @returns {boolean} - true if palindrome / true jeśli palindrom
 */
function isPalindromeStack(head) {
  if (!head || !head.next) return true;

  // Use runner technique to find middle / Użyj techniki runner do znalezienia środka
  let slow = head;
  let fast = head;
  const stack = [];

  // Push first half onto stack / Odłóż pierwszą połowę na stos
  while (fast && fast.next) {
    stack.push(slow.data);
    slow = slow.next;      // Move 1 step / Przesuń o 1 krok
    fast = fast.next.next; // Move 2 steps / Przesuń o 2 kroki
  }

  // If odd number of elements, skip middle / Jeśli nieparzysta liczba elementów, pomiń środek
  if (fast) {
    slow = slow.next;
  }

  // Compare second half with stack / Porównaj drugą połowę ze stosem
  while (slow) {
    const top = stack.pop();
    if (top !== slow.data) {
      return false;
    }
    slow = slow.next;
  }

  return true;
}

// ============================================================================
// APPROACH 3: RECURSIVE
// PODEJŚCIE 3: REKURENCYJNE
// ============================================================================

/**
 * Palindrome Check - Recursive
 * Sprawdzenie Palindromu - Rekurencyjne
 *
 * Uses recursion to compare nodes from outside-in
 * Używa rekurencji do porównania węzłów od zewnątrz do środka
 *
 * Time: O(n), Space: O(n) for recursion stack
 *
 * @param {Node} head - Head of linked list / Głowa listy połączonej
 * @returns {boolean} - true if palindrome / true jeśli palindrom
 */
function isPalindromeRecursive(head) {
  const length = getLength(head);
  const result = isPalindromeRecurseHelper(head, length);
  return result.isPalindrome;
}

/**
 * Helper: Recursive palindrome check / Pomocnicza: Rekurencyjne sprawdzenie palindromu
 *
 * Returns { node, isPalindrome }
 * - node: the next node to compare (for parent call)
 * - isPalindrome: whether the sublist is a palindrome
 */
function isPalindromeRecurseHelper(head, length) {
  // Base cases / Przypadki bazowe
  if (length === 0) {
    return { node: head, isPalindrome: true };
  }
  if (length === 1) {
    return { node: head.next, isPalindrome: true };
  }

  // Recurse on sublist / Rekurencja na podliście
  const result = isPalindromeRecurseHelper(head.next, length - 2);

  // If sublist is not palindrome, propagate / Jeśli podlista nie jest palindromem, propaguj
  if (!result.isPalindrome) {
    return result;
  }

  // Compare first and last of current sublist / Porównaj pierwszy i ostatni obecnej podlisty
  const matches = head.data === result.node.data;

  // Return next node for comparison / Zwróć następny węzeł do porównania
  return {
    node: result.node.next,
    isPalindrome: matches
  };
}

/**
 * Helper: Get length of list / Pomocnicza: Pobierz długość listy
 */
function getLength(head) {
  let length = 0;
  let current = head;
  while (current) {
    length++;
    current = current.next;
  }
  return length;
}

// ============================================================================
// APPROACH 4: IN-PLACE (Modify List)
// PODEJŚCIE 4: W MIEJSCU (Modyfikuj Listę)
// ============================================================================

/**
 * Palindrome Check - In-place (modifies list temporarily)
 * Sprawdzenie Palindromu - W miejscu (tymczasowo modyfikuje listę)
 *
 * Reverses second half in-place, compares, then restores
 * Odwraca drugą połowę w miejscu, porównuje, potem przywraca
 *
 * Time: O(n), Space: O(1)
 *
 * @param {Node} head - Head of linked list / Głowa listy połączonej
 * @returns {boolean} - true if palindrome / true jeśli palindrom
 */
function isPalindromeInPlace(head) {
  if (!head || !head.next) return true;

  // Step 1: Find middle using runner / Krok 1: Znajdź środek używając runner
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 2: Reverse second half / Krok 2: Odwróć drugą połowę
  let secondHalf = reverseList(slow);
  const secondHalfHead = secondHalf; // Save for later restoration / Zapisz do późniejszego przywrócenia

  // Step 3: Compare first and second half / Krok 3: Porównaj pierwszą i drugą połowę
  let firstHalf = head;
  let isPalindrome = true;

  while (secondHalf) {
    if (firstHalf.data !== secondHalf.data) {
      isPalindrome = false;
      break;
    }
    firstHalf = firstHalf.next;
    secondHalf = secondHalf.next;
  }

  // Step 4: Restore list (optional but good practice)
  // Krok 4: Przywróć listę (opcjonalne ale dobra praktyka)
  reverseList(secondHalfHead);

  return isPalindrome;
}

/**
 * Helper: Reverse list in-place / Pomocnicza: Odwróć listę w miejscu
 */
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

// ============================================================================
// HELPER FUNCTIONS FOR TESTING / FUNKCJE POMOCNICZE DO TESTOWANIA
// ============================================================================

/**
 * Create linked list from array / Tworzy listę połączoną z tablicy
 */
function createLinkedList(arr) {
  if (!arr || arr.length === 0) return null;

  const head = new Node(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new Node(arr[i]);
    current = current.next;
  }

  return head;
}

/**
 * Convert linked list to array / Konwertuje listę na tablicę
 */
function linkedListToArray(head) {
  const result = [];
  let current = head;

  while (current) {
    result.push(current.data);
    current = current.next;
  }

  return result;
}

/**
 * Print list with description / Wyświetl listę z opisem
 */
function printList(head, description) {
  const arr = linkedListToArray(head);
  console.log(`${description}: ${arr.join(' -> ')}`);
}

/**
 * Test all approaches / Testuj wszystkie podejścia
 */
function testAllApproaches(arr, expectedResult) {
  const list1 = createLinkedList(arr);
  const list2 = createLinkedList(arr);
  const list3 = createLinkedList(arr);
  const list4 = createLinkedList(arr);

  const result1 = isPalindromeReverse(list1);
  const result2 = isPalindromeStack(list2);
  const result3 = isPalindromeRecursive(list3);
  const result4 = isPalindromeInPlace(list4);

  const allMatch = result1 === result2 && result2 === result3 && result3 === result4;
  const correct = result1 === expectedResult;

  return {
    reverse: result1,
    stack: result2,
    recursive: result3,
    inPlace: result4,
    allMatch,
    correct
  };
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('PALINDROME CHECK - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Classic palindrome (odd length) / Klasyczny palindrom (nieparzysta długość)
console.log('TEST 1: Classic palindrome - odd length');
console.log('       Klasyczny palindrom - nieparzysta długość');
console.log('-'.repeat(70));
const arr1 = [1, 2, 3, 2, 1];
printList(createLinkedList(arr1), 'List');
const results1 = testAllApproaches(arr1, true);
console.log(`Reverse approach    / Podejście odwracania:   ${results1.reverse}`);
console.log(`Stack approach      / Podejście stosu:        ${results1.stack}`);
console.log(`Recursive approach  / Podejście rekurencyjne: ${results1.recursive}`);
console.log(`In-place approach   / Podejście w miejscu:    ${results1.inPlace}`);
console.log(`All match: ${results1.allMatch ? '✓' : '✗'}, Correct: ${results1.correct ? '✓' : '✗'}`);
console.log(`Expected: true / Oczekiwano: true`);
console.log();

// Test 2: Classic palindrome (even length) / Klasyczny palindrom (parzysta długość)
console.log('TEST 2: Classic palindrome - even length');
console.log('       Klasyczny palindrom - parzysta długość');
console.log('-'.repeat(70));
const arr2 = [1, 2, 2, 1];
printList(createLinkedList(arr2), 'List');
const results2 = testAllApproaches(arr2, true);
console.log(`All approaches: ${results2.reverse} (expected true)`);
console.log(`All match: ${results2.allMatch ? '✓' : '✗'}, Correct: ${results2.correct ? '✓' : '✗'}`);
console.log();

// Test 3: Not a palindrome / Nie palindrom
console.log('TEST 3: Not a palindrome');
console.log('       Nie palindrom');
console.log('-'.repeat(70));
const arr3 = [1, 2, 3, 4, 5];
printList(createLinkedList(arr3), 'List');
const results3 = testAllApproaches(arr3, false);
console.log(`All approaches: ${results3.reverse} (expected false)`);
console.log(`All match: ${results3.allMatch ? '✓' : '✗'}, Correct: ${results3.correct ? '✓' : '✗'}`);
console.log();

// Test 4: Single character / Pojedynczy znak
console.log('TEST 4: Single character (palindrome)');
console.log('       Pojedynczy znak (palindrom)');
console.log('-'.repeat(70));
const arr4 = ['a'];
printList(createLinkedList(arr4), 'List');
const results4 = testAllApproaches(arr4, true);
console.log(`All approaches: ${results4.reverse} (expected true)`);
console.log(`All match: ${results4.allMatch ? '✓' : '✗'}, Correct: ${results4.correct ? '✓' : '✗'}`);
console.log();

// Test 5: Two same characters / Dwa te same znaki
console.log('TEST 5: Two same characters (palindrome)');
console.log('       Dwa te same znaki (palindrom)');
console.log('-'.repeat(70));
const arr5 = ['a', 'a'];
printList(createLinkedList(arr5), 'List');
const results5 = testAllApproaches(arr5, true);
console.log(`All approaches: ${results5.reverse} (expected true)`);
console.log(`All match: ${results5.allMatch ? '✓' : '✗'}, Correct: ${results5.correct ? '✓' : '✗'}`);
console.log();

// Test 6: Two different characters / Dwa różne znaki
console.log('TEST 6: Two different characters (not palindrome)');
console.log('       Dwa różne znaki (nie palindrom)');
console.log('-'.repeat(70));
const arr6 = ['a', 'b'];
printList(createLinkedList(arr6), 'List');
const results6 = testAllApproaches(arr6, false);
console.log(`All approaches: ${results6.reverse} (expected false)`);
console.log(`All match: ${results6.allMatch ? '✓' : '✗'}, Correct: ${results6.correct ? '✓' : '✗'}`);
console.log();

// Test 7: Long palindrome / Długi palindrom
console.log('TEST 7: Long palindrome with letters');
console.log('       Długi palindrom z literami');
console.log('-'.repeat(70));
const arr7 = ['r', 'a', 'c', 'e', 'c', 'a', 'r'];
printList(createLinkedList(arr7), 'List');
const results7 = testAllApproaches(arr7, true);
console.log(`All approaches: ${results7.reverse} (expected true)`);
console.log(`All match: ${results7.allMatch ? '✓' : '✗'}, Correct: ${results7.correct ? '✓' : '✗'}`);
console.log();

// Test 8: Almost palindrome / Prawie palindrom
console.log('TEST 8: Almost palindrome (not palindrome)');
console.log('       Prawie palindrom (nie palindrom)');
console.log('-'.repeat(70));
const arr8 = [1, 2, 3, 3, 1];
printList(createLinkedList(arr8), 'List');
const results8 = testAllApproaches(arr8, false);
console.log(`All approaches: ${results8.reverse} (expected false)`);
console.log(`All match: ${results8.allMatch ? '✓' : '✗'}, Correct: ${results8.correct ? '✓' : '✗'}`);
console.log();

// Test 9: Numbers palindrome / Palindrom liczbowy
console.log('TEST 9: Numbers palindrome');
console.log('       Palindrom liczbowy');
console.log('-'.repeat(70));
const arr9 = [1, 2, 3, 4, 3, 2, 1];
printList(createLinkedList(arr9), 'List');
const results9 = testAllApproaches(arr9, true);
console.log(`All approaches: ${results9.reverse} (expected true)`);
console.log(`All match: ${results9.allMatch ? '✓' : '✗'}, Correct: ${results9.correct ? '✓' : '✗'}`);
console.log();

// Test 10: Long non-palindrome / Długi nie-palindrom
console.log('TEST 10: Long non-palindrome');
console.log('        Długi nie-palindrom');
console.log('-'.repeat(70));
const arr10 = [1, 2, 3, 4, 5, 6, 7, 8];
printList(createLinkedList(arr10), 'List');
const results10 = testAllApproaches(arr10, false);
console.log(`All approaches: ${results10.reverse} (expected false)`);
console.log(`All match: ${results10.allMatch ? '✓' : '✗'}, Correct: ${results10.correct ? '✓' : '✗'}`);
console.log();

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: Empty list / Pusta lista
console.log('EDGE CASE 1: Empty list (palindrome)');
console.log('            Pusta lista (palindrom)');
console.log('-'.repeat(70));
const results11 = testAllApproaches([], true);
console.log(`List: (empty)`);
console.log(`All approaches: ${results11.reverse} (expected true)`);
console.log(`All match: ${results11.allMatch ? '✓' : '✗'}, Correct: ${results11.correct ? '✓' : '✗'}`);
console.log();

// Edge Case 2: Duplicate values / Duplikujące się wartości
console.log('EDGE CASE 2: All same values (palindrome)');
console.log('            Wszystkie te same wartości (palindrom)');
console.log('-'.repeat(70));
const arr12 = [5, 5, 5, 5, 5];
printList(createLinkedList(arr12), 'List');
const results12 = testAllApproaches(arr12, true);
console.log(`All approaches: ${results12.reverse} (expected true)`);
console.log(`All match: ${results12.allMatch ? '✓' : '✗'}, Correct: ${results12.correct ? '✓' : '✗'}`);
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Reverse and Compare / Odwróć i Porównaj');
console.log('  Time: O(n)   - Clone and reverse list / Klonuj i odwróć listę');
console.log('  Space: O(n)  - Reversed copy / Odwrócona kopia');
console.log();
console.log('APPROACH 2: Stack / Stos');
console.log('  Time: O(n)   - Single pass with runner / Jedno przejście z runner');
console.log('  Space: O(n/2) = O(n) - Stack for half list / Stos dla połowy listy');
console.log();
console.log('APPROACH 3: Recursive / Rekurencyjne');
console.log('  Time: O(n)   - Visit each node / Odwiedź każdy węzeł');
console.log('  Space: O(n)  - Recursion stack / Stos rekurencji');
console.log();
console.log('APPROACH 4: In-place / W miejscu');
console.log('  Time: O(n)   - Find middle + reverse + compare / Znajdź środek + odwróć + porównaj');
console.log('  Space: O(1)  - Only pointers / Tylko wskaźniki');
console.log('  Note: Modifies list temporarily / Uwaga: Tymczasowo modyfikuje listę');
console.log('='.repeat(70));
