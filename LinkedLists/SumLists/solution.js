class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

// ============================================================================
// PART 1: REVERSE ORDER (digits stored in reverse)
// CZĘŚĆ 1: ODWRÓCONA KOLEJNOŚĆ (cyfry przechowane odwrotnie)
// ============================================================================

/**
 * Sum Lists (Reverse Order) - adds two numbers represented as linked lists
 * Suma List (Odwrócona Kolejność) - dodaje dwie liczby reprezentowane jako listy
 *
 * The digits are stored in REVERSE order (1's digit at head)
 * Cyfry są przechowane w ODWRÓCONEJ kolejności (jedności na początku)
 *
 * Example / Przykład:
 * Input:  (7 -> 1 -> 6) + (5 -> 9 -> 2)  represents 617 + 295
 * Output: (2 -> 1 -> 9)                  represents 912
 *
 * APPROACH: Simulate addition with carry
 * PODEJŚCIE: Symuluj dodawanie z przeniesieniem
 *
 * @param {Node} l1 - First number / Pierwsza liczba
 * @param {Node} l2 - Second number / Druga liczba
 * @returns {Node} - Sum as linked list / Suma jako lista
 */
function sumListsReverse(l1, l2) {
  let dummyHead = new Node(0); // Dummy node for result / Węzeł dummy dla wyniku
  let current = dummyHead;
  let carry = 0; // Carry from previous addition / Przeniesienie z poprzedniego dodawania

  // Continue while there are nodes or carry / Kontynuuj gdy są węzły lub przeniesienie
  while (l1 || l2 || carry) {
    // Get values (0 if node is null) / Pobierz wartości (0 jeśli węzeł jest null)
    const val1 = l1 ? l1.data : 0;
    const val2 = l2 ? l2.data : 0;

    // Calculate sum / Oblicz sumę
    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10); // New carry / Nowe przeniesienie
    const digit = sum % 10;        // Current digit / Obecna cyfra

    // Create new node for result / Utwórz nowy węzeł dla wyniku
    current.next = new Node(digit);
    current = current.next;

    // Move to next nodes / Przejdź do następnych węzłów
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return dummyHead.next; // Return result (skip dummy) / Zwróć wynik (pomiń dummy)
}

// ============================================================================
// PART 2: FORWARD ORDER (digits stored in forward order)
// CZĘŚĆ 2: NORMALNA KOLEJNOŚĆ (cyfry przechowane normalnie)
// ============================================================================

/**
 * Sum Lists (Forward Order) - adds two numbers in forward order
 * Suma List (Normalna Kolejność) - dodaje dwie liczby w normalnej kolejności
 *
 * The digits are stored in FORWARD order (most significant digit at head)
 * Cyfry są przechowane w NORMALNEJ kolejności (najbardziej znacząca cyfra na początku)
 *
 * Example / Przykład:
 * Input:  (6 -> 1 -> 7) + (2 -> 9 -> 5)  represents 617 + 295
 * Output: (9 -> 1 -> 2)                  represents 912
 *
 * APPROACH 1: Reverse, add, reverse back
 * PODEJŚCIE 1: Odwróć, dodaj, odwróć z powrotem
 *
 * @param {Node} l1 - First number / Pierwsza liczba
 * @param {Node} l2 - Second number / Druga liczba
 * @returns {Node} - Sum as linked list / Suma jako lista
 */
function sumListsForward(l1, l2) {
  // Step 1: Reverse both lists / Krok 1: Odwróć obie listy
  const rev1 = reverseList(l1);
  const rev2 = reverseList(l2);

  // Step 2: Add reversed lists / Krok 2: Dodaj odwrócone listy
  const revSum = sumListsReverse(rev1, rev2);

  // Step 3: Reverse result back / Krok 3: Odwróć wynik z powrotem
  return reverseList(revSum);
}

/**
 * Helper: Reverse a linked list / Pomocnicza: Odwróć listę połączoną
 */
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next; // Save next / Zapisz next
    current.next = prev;       // Reverse pointer / Odwróć wskaźnik
    prev = current;            // Move prev forward / Przesuń prev
    current = next;            // Move current forward / Przesuń current
  }

  return prev; // New head / Nowa głowa
}

/**
 * Sum Lists Forward (Recursive Approach)
 * Suma List Normalnie (Podejście Rekurencyjne)
 *
 * APPROACH 2: Use recursion to process from right to left
 * PODEJŚCIE 2: Użyj rekurencji aby przetwarzać od prawej do lewej
 *
 * More complex but doesn't modify input lists
 * Bardziej złożone ale nie modyfikuje list wejściowych
 */
function sumListsForwardRecursive(l1, l2) {
  // First, pad the shorter list with zeros / Najpierw dopełnij krótszą listę zerami
  const len1 = getLength(l1);
  const len2 = getLength(l2);

  if (len1 < len2) {
    l1 = padList(l1, len2 - len1);
  } else if (len2 < len1) {
    l2 = padList(l2, len1 - len2);
  }

  // Add lists recursively / Dodaj listy rekurencyjnie
  const result = addListsHelper(l1, l2);

  // If there's a carry, add new node at front / Jeśli jest przeniesienie, dodaj nowy węzeł na początku
  if (result.carry > 0) {
    const newNode = new Node(result.carry);
    newNode.next = result.sum;
    return newNode;
  }

  return result.sum;
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

/**
 * Helper: Pad list with zeros / Pomocnicza: Dopełnij listę zerami
 */
function padList(head, padding) {
  for (let i = 0; i < padding; i++) {
    const newNode = new Node(0);
    newNode.next = head;
    head = newNode;
  }
  return head;
}

/**
 * Helper: Recursive addition / Pomocnicza: Dodawanie rekurencyjne
 */
function addListsHelper(l1, l2) {
  // Base case: both lists are null / Przypadek bazowy: obie listy są null
  if (!l1 && !l2) {
    return { sum: null, carry: 0 };
  }

  // Recursively add rest of lists / Rekurencyjnie dodaj resztę list
  const result = addListsHelper(l1.next, l2.next);

  // Add current digits plus carry / Dodaj obecne cyfry plus przeniesienie
  const sum = l1.data + l2.data + result.carry;
  const digit = sum % 10;
  const carry = Math.floor(sum / 10);

  // Create node for current digit / Utwórz węzeł dla obecnej cyfry
  const node = new Node(digit);
  node.next = result.sum;

  return { sum: node, carry: carry };
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
 * Convert list to number (for verification) / Konwertuj listę na liczbę (do weryfikacji)
 */
function listToNumberReverse(head) {
  let num = 0;
  let multiplier = 1;
  let current = head;

  while (current) {
    num += current.data * multiplier;
    multiplier *= 10;
    current = current.next;
  }

  return num;
}

function listToNumberForward(head) {
  let num = 0;
  let current = head;

  while (current) {
    num = num * 10 + current.data;
    current = current.next;
  }

  return num;
}

/**
 * Print list with description / Wyświetl listę z opisem
 */
function printList(head, description) {
  const arr = linkedListToArray(head);
  console.log(`${description}: ${arr.join(' -> ')}`);
}

// ============================================================================
// TEST CASES - REVERSE ORDER / PRZYPADKI TESTOWE - ODWRÓCONA KOLEJNOŚĆ
// ============================================================================

console.log('='.repeat(70));
console.log('SUM LISTS - REVERSE ORDER / SUMA LIST - ODWRÓCONA KOLEJNOŚĆ');
console.log('(1\'s digit at head / Jedności na początku)');
console.log('='.repeat(70));
console.log();

// Test 1: Example from problem / Przykład z zadania
console.log('TEST 1: 617 + 295 = 912');
console.log('-'.repeat(70));
const l1_1 = createLinkedList([7, 1, 6]); // 617
const l2_1 = createLinkedList([5, 9, 2]); // 295
printList(l1_1, 'List 1 (617)');
printList(l2_1, 'List 2 (295)');
const sum1 = sumListsReverse(l1_1, l2_1);
printList(sum1, 'Sum        ');
const num1 = listToNumberReverse(sum1);
console.log(`Result: ${num1} (expected 912)`);
console.log(`Verification: ${listToNumberReverse(l1_1)} + ${listToNumberReverse(l2_1)} = ${num1}`);
console.log();

// Test 2: Different lengths / Różne długości
console.log('TEST 2: 99 + 1 = 100 (different lengths)');
console.log('       99 + 1 = 100 (różne długości)');
console.log('-'.repeat(70));
const l1_2 = createLinkedList([9, 9]);    // 99
const l2_2 = createLinkedList([1]);       // 1
printList(l1_2, 'List 1 (99) ');
printList(l2_2, 'List 2 (1)  ');
const sum2 = sumListsReverse(l1_2, l2_2);
printList(sum2, 'Sum         ');
const num2 = listToNumberReverse(sum2);
console.log(`Result: ${num2} (expected 100)`);
console.log();

// Test 3: Carry propagation / Propagacja przeniesienia
console.log('TEST 3: 999 + 1 = 1000 (carry propagation)');
console.log('       999 + 1 = 1000 (propagacja przeniesienia)');
console.log('-'.repeat(70));
const l1_3 = createLinkedList([9, 9, 9]); // 999
const l2_3 = createLinkedList([1]);       // 1
printList(l1_3, 'List 1 (999)');
printList(l2_3, 'List 2 (1)  ');
const sum3 = sumListsReverse(l1_3, l2_3);
printList(sum3, 'Sum         ');
const num3 = listToNumberReverse(sum3);
console.log(`Result: ${num3} (expected 1000)`);
console.log();

// Test 4: Both empty / Obie puste
console.log('TEST 4: 0 + 0 = 0');
console.log('-'.repeat(70));
const l1_4 = createLinkedList([0]);
const l2_4 = createLinkedList([0]);
printList(l1_4, 'List 1 (0)');
printList(l2_4, 'List 2 (0)');
const sum4 = sumListsReverse(l1_4, l2_4);
printList(sum4, 'Sum       ');
console.log();

// ============================================================================
// TEST CASES - FORWARD ORDER / PRZYPADKI TESTOWE - NORMALNA KOLEJNOŚĆ
// ============================================================================

console.log('='.repeat(70));
console.log('SUM LISTS - FORWARD ORDER / SUMA LIST - NORMALNA KOLEJNOŚĆ');
console.log('(Most significant digit at head / Najbardziej znacząca cyfra na początku)');
console.log('='.repeat(70));
console.log();

// Test 5: Example from problem / Przykład z zadania
console.log('TEST 5: 617 + 295 = 912 (Forward Order / Normalna Kolejność)');
console.log('-'.repeat(70));
const l1_5 = createLinkedList([6, 1, 7]); // 617
const l2_5 = createLinkedList([2, 9, 5]); // 295
printList(l1_5, 'List 1 (617)');
printList(l2_5, 'List 2 (295)');
const sum5 = sumListsForward(l1_5, l2_5);
printList(sum5, 'Sum         ');
const num5 = listToNumberForward(sum5);
console.log(`Result: ${num5} (expected 912)`);
console.log();

// Test 6: Different lengths / Różne długości
console.log('TEST 6: 99 + 1 = 100 (Forward Order)');
console.log('-'.repeat(70));
const l1_6 = createLinkedList([9, 9]);    // 99
const l2_6 = createLinkedList([1]);       // 1
printList(l1_6, 'List 1 (99) ');
printList(l2_6, 'List 2 (1)  ');
const sum6 = sumListsForward(l1_6, l2_6);
printList(sum6, 'Sum         ');
const num6 = listToNumberForward(sum6);
console.log(`Result: ${num6} (expected 100)`);
console.log();

// Test 7: Carry propagation / Propagacja przeniesienia
console.log('TEST 7: 999 + 1 = 1000 (Forward Order)');
console.log('-'.repeat(70));
const l1_7 = createLinkedList([9, 9, 9]); // 999
const l2_7 = createLinkedList([1]);       // 1
printList(l1_7, 'List 1 (999)');
printList(l2_7, 'List 2 (1)  ');
const sum7 = sumListsForward(l1_7, l2_7);
printList(sum7, 'Sum         ');
const num7 = listToNumberForward(sum7);
console.log(`Result: ${num7} (expected 1000)`);
console.log();

// Test 8: Large numbers / Duże liczby
console.log('TEST 8: 12345 + 6789 = 19134 (Forward Order)');
console.log('-'.repeat(70));
const l1_8 = createLinkedList([1, 2, 3, 4, 5]); // 12345
const l2_8 = createLinkedList([6, 7, 8, 9]);    // 6789
printList(l1_8, 'List 1 (12345)');
printList(l2_8, 'List 2 (6789) ');
const sum8 = sumListsForward(l1_8, l2_8);
printList(sum8, 'Sum           ');
const num8 = listToNumberForward(sum8);
console.log(`Result: ${num8} (expected 19134)`);
console.log();

// ============================================================================
// TEST RECURSIVE APPROACH / TEST PODEJŚCIA REKURENCYJNEGO
// ============================================================================

console.log('='.repeat(70));
console.log('RECURSIVE APPROACH TEST / TEST PODEJŚCIA REKURENCYJNEGO');
console.log('='.repeat(70));
console.log();

console.log('TEST 9: 617 + 295 = 912 (Recursive)');
console.log('-'.repeat(70));
const l1_9 = createLinkedList([6, 1, 7]); // 617
const l2_9 = createLinkedList([2, 9, 5]); // 295
printList(l1_9, 'List 1 (617)');
printList(l2_9, 'List 2 (295)');
const sum9 = sumListsForwardRecursive(l1_9, l2_9);
printList(sum9, 'Sum         ');
const num9 = listToNumberForward(sum9);
console.log(`Result: ${num9} (expected 912)`);
console.log();

console.log('TEST 10: 99 + 1 = 100 (Recursive, different lengths)');
console.log('-'.repeat(70));
const l1_10 = createLinkedList([9, 9]);   // 99
const l2_10 = createLinkedList([1]);      // 1
printList(l1_10, 'List 1 (99) ');
printList(l2_10, 'List 2 (1)  ');
const sum10 = sumListsForwardRecursive(l1_10, l2_10);
printList(sum10, 'Sum         ');
const num10 = listToNumberForward(sum10);
console.log(`Result: ${num10} (expected 100)`);
console.log();

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: One null list / Jedna pusta lista
console.log('EDGE CASE 1: null + 123 (Reverse Order)');
console.log('-'.repeat(70));
const l1_11 = null;
const l2_11 = createLinkedList([3, 2, 1]); // 123
console.log('List 1      : (null)');
printList(l2_11, 'List 2 (123)');
const sum11 = sumListsReverse(l1_11, l2_11);
printList(sum11, 'Sum         ');
console.log();

// Edge Case 2: Single digit / Pojedyncza cyfra
console.log('EDGE CASE 2: 5 + 7 = 12');
console.log('-'.repeat(70));
const l1_12 = createLinkedList([5]);
const l2_12 = createLinkedList([7]);
printList(l1_12, 'List 1 (5)');
printList(l2_12, 'List 2 (7)');
const sum12 = sumListsReverse(l1_12, l2_12);
printList(sum12, 'Sum       ');
console.log(`Result: ${listToNumberReverse(sum12)} (expected 12)`);
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('REVERSE ORDER / ODWRÓCONA KOLEJNOŚĆ:');
console.log('  Time Complexity / Złożoność czasowa:  O(n + m)');
console.log('    where n, m are list lengths / gdzie n, m to długości list');
console.log('  Space Complexity / Złożoność pamięciowa: O(max(n, m))');
console.log('    for result list / dla listy wynikowej');
console.log();
console.log('FORWARD ORDER (Reverse approach) / NORMALNA KOLEJNOŚĆ (Podejście odwracania):');
console.log('  Time Complexity / Złożoność czasowa:  O(n + m)');
console.log('    3 passes: reverse, add, reverse / 3 przejścia: odwróć, dodaj, odwróć');
console.log('  Space Complexity / Złożoność pamięciowa: O(max(n, m))');
console.log();
console.log('FORWARD ORDER (Recursive) / NORMALNA KOLEJNOŚĆ (Rekurencyjne):');
console.log('  Time Complexity / Złożoność czasowa:  O(n + m)');
console.log('  Space Complexity / Złożoność pamięciowa: O(max(n, m))');
console.log('    includes recursion stack / zawiera stos rekurencji');
console.log('='.repeat(70));
