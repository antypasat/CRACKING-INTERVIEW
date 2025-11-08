class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

/**
 * Partition - partitions a linked list around a value x
 * Dzieli listę połączoną wokół wartości x
 *
 * All nodes less than x come before all nodes greater than or equal to x
 * Wszystkie węzły mniejsze niż x znajdują się przed węzłami większymi lub równymi x
 *
 * APPROACH: Two separate lists
 * PODEJŚCIE: Dwie osobne listy
 *
 * 1. Create two lists: before (< x) and after (>= x)
 *    Tworzymy dwie listy: before (< x) i after (>= x)
 * 2. Traverse original list and add nodes to appropriate list
 *    Przechodzimy oryginalną listę i dodajemy węzły do odpowiedniej listy
 * 3. Connect before list to after list
 *    Łączymy listę before z listą after
 *
 * @param {Node} head - Head of the linked list / Głowa listy połączonej
 * @param {number} x - Partition value / Wartość podziału
 * @returns {Node} - New head of partitioned list / Nowa głowa podzielonej listy
 */
function partition(head, x) {
  // Edge case: empty list / Przypadek brzegowy: pusta lista
  if (!head) return null;

  // Create dummy nodes for two lists / Tworzymy węzły dummy dla dwóch list
  let beforeHead = new Node(0); // Dummy head for nodes < x / Dummy head dla węzłów < x
  let afterHead = new Node(0);  // Dummy head for nodes >= x / Dummy head dla węzłów >= x

  let before = beforeHead; // Pointer for before list / Wskaźnik dla listy before
  let after = afterHead;   // Pointer for after list / Wskaźnik dla listy after

  let current = head;

  // Traverse the list / Przechodzimy listę
  while (current) {
    if (current.data < x) {
      // Add to before list / Dodajemy do listy before
      before.next = current;
      before = before.next;
    } else {
      // Add to after list / Dodajemy do listy after
      after.next = current;
      after = after.next;
    }
    current = current.next;
  }

  // Important: terminate after list to prevent cycles
  // Ważne: zamknij listę after aby zapobiec cyklom
  after.next = null;

  // Connect before list to after list / Łączymy listę before z listą after
  before.next = afterHead.next;

  // Return the head (skip dummy node) / Zwracamy głowę (pomijając dummy node)
  return beforeHead.next;
}

/**
 * Alternative approach: Growing lists at head
 * Alternatywne podejście: Rozwijanie list od głowy
 *
 * This approach adds nodes to the beginning of each partition
 * To podejście dodaje węzły na początek każdej partycji
 */
function partitionAlternative(head, x) {
  if (!head) return null;

  let beforeHead = null;
  let afterHead = null;

  let current = head;

  while (current) {
    let next = current.next; // Save next / Zapisz next

    if (current.data < x) {
      // Add to beginning of before list / Dodaj na początek listy before
      current.next = beforeHead;
      beforeHead = current;
    } else {
      // Add to beginning of after list / Dodaj na początek listy after
      current.next = afterHead;
      afterHead = current;
    }

    current = next;
  }

  // If no elements before x, return after list
  // Jeśli nie ma elementów przed x, zwróć listę after
  if (!beforeHead) return afterHead;

  // Connect the lists / Połącz listy
  let beforeTail = beforeHead;
  while (beforeTail.next) {
    beforeTail = beforeTail.next;
  }
  beforeTail.next = afterHead;

  return beforeHead;
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
 * Verify partition is correct / Sprawdź czy podział jest poprawny
 */
function verifyPartition(head, x) {
  let foundGreaterOrEqual = false;
  let current = head;

  while (current) {
    if (current.data >= x) {
      foundGreaterOrEqual = true;
    } else if (foundGreaterOrEqual) {
      // Found element < x after element >= x - partition is incorrect
      // Znaleziono element < x po elemencie >= x - podział niepoprawny
      return false;
    }
    current = current.next;
  }

  return true;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('PARTITION - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Example from the problem / Przykład z zadania
console.log('TEST 1: Partition around 5');
console.log('       Podział wokół 5');
console.log('-'.repeat(70));
const list1 = createLinkedList([3, 5, 8, 5, 10, 2, 1]);
printList(list1, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 5`);
const result1 = partition(list1, 5);
printList(result1, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result1, 5)}`);
console.log(`Elements < 5 before >= 5 / Elementy < 5 przed >= 5`);
console.log();

// Test 2: All elements less than partition / Wszystkie elementy mniejsze niż podział
console.log('TEST 2: All elements less than partition value');
console.log('       Wszystkie elementy mniejsze niż wartość podziału');
console.log('-'.repeat(70));
const list2 = createLinkedList([1, 2, 3, 4]);
printList(list2, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 10`);
const result2 = partition(list2, 10);
printList(result2, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result2, 10)}`);
console.log(`All elements should remain in same order / Wszystkie elementy powinny pozostać w tej samej kolejności`);
console.log();

// Test 3: All elements greater than or equal to partition
// Wszystkie elementy większe lub równe podziałowi
console.log('TEST 3: All elements >= partition value');
console.log('       Wszystkie elementy >= wartość podziału');
console.log('-'.repeat(70));
const list3 = createLinkedList([10, 20, 30, 40]);
printList(list3, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 5`);
const result3 = partition(list3, 5);
printList(result3, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result3, 5)}`);
console.log();

// Test 4: Partition value not in list / Wartość podziału nie ma w liście
console.log('TEST 4: Partition value not in list');
console.log('       Wartość podziału nie ma w liście');
console.log('-'.repeat(70));
const list4 = createLinkedList([7, 2, 9, 1, 8, 3]);
printList(list4, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 5`);
const result4 = partition(list4, 5);
printList(result4, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result4, 5)}`);
console.log(`Expected: [2, 1, 3] before [7, 9, 8] / Oczekiwano: [2, 1, 3] przed [7, 9, 8]`);
console.log();

// Test 5: Single element / Pojedynczy element
console.log('TEST 5: Single element list');
console.log('       Lista jednoelementowa');
console.log('-'.repeat(70));
const list5 = createLinkedList([5]);
printList(list5, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 3`);
const result5 = partition(list5, 3);
printList(result5, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result5, 3)}`);
console.log();

// Test 6: Two elements / Dwa elementy
console.log('TEST 6: Two elements needing swap');
console.log('       Dwa elementy wymagające zamiany');
console.log('-'.repeat(70));
const list6 = createLinkedList([10, 5]);
printList(list6, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 8`);
const result6 = partition(list6, 8);
printList(result6, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result6, 8)}`);
console.log(`Expected: 5 before 10 / Oczekiwano: 5 przed 10`);
console.log();

// Test 7: Duplicates of partition value / Duplikaty wartości podziału
console.log('TEST 7: Multiple occurrences of partition value');
console.log('       Wielokrotne wystąpienia wartości podziału');
console.log('-'.repeat(70));
const list7 = createLinkedList([5, 5, 5, 2, 5, 8, 5, 1]);
printList(list7, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 5`);
const result7 = partition(list7, 5);
printList(result7, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result7, 5)}`);
console.log(`All 5's should be in the "after" partition / Wszystkie 5 powinny być w partycji "after"`);
console.log();

// ============================================================================
// TESTING ALTERNATIVE APPROACH / TESTOWANIE ALTERNATYWNEGO PODEJŚCIA
// ============================================================================

console.log('='.repeat(70));
console.log('ALTERNATIVE APPROACH TEST / TEST ALTERNATYWNEGO PODEJŚCIA');
console.log('='.repeat(70));
console.log();

console.log('TEST: Growing lists at head approach');
console.log('     Podejście rozwijania list od głowy');
console.log('-'.repeat(70));
const list8 = createLinkedList([3, 5, 8, 5, 10, 2, 1]);
printList(list8, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 5`);
const result8 = partitionAlternative(list8, 5);
printList(result8, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result8, 5)}`);
console.log(`Note: Order may differ but partition is valid`);
console.log(`     Uwaga: Kolejność może się różnić ale podział jest poprawny`);
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
const list9 = null;
console.log('Before / Przed      : (empty)');
const result9 = partition(list9, 5);
console.log(`After / Po          : ${result9 === null ? '(empty)' : linkedListToArray(result9).join(' -> ')}`);
console.log();

// Edge Case 2: Negative numbers / Liczby ujemne
console.log('EDGE CASE 2: List with negative numbers');
console.log('            Lista z liczbami ujemnymi');
console.log('-'.repeat(70));
const list10 = createLinkedList([-5, 10, -3, 7, 0, -1, 3]);
printList(list10, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 0`);
const result10 = partition(list10, 0);
printList(result10, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result10, 0)}`);
console.log(`Negative numbers before zero and positives / Liczby ujemne przed zerem i dodatnimi`);
console.log();

// Edge Case 3: Already partitioned / Już podzielona
console.log('EDGE CASE 3: Already partitioned list');
console.log('            Lista już podzielona');
console.log('-'.repeat(70));
const list11 = createLinkedList([1, 2, 3, 5, 7, 9]);
printList(list11, 'Before / Przed      ');
console.log(`Partition value / Wartość podziału: 5`);
const result11 = partition(list11, 5);
printList(result11, 'After / Po          ');
console.log(`Valid partition / Poprawny podział: ${verifyPartition(result11, 5)}`);
console.log(`Should remain largely unchanged / Powinna pozostać w dużej mierze niezmieniona`);
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('Time Complexity / Złożoność czasowa:  O(n)');
console.log('  - Single pass through the list / Jedno przejście przez listę');
console.log('  - Each node visited once / Każdy węzeł odwiedzony raz');
console.log();
console.log('Space Complexity / Złożoność pamięciowa: O(1)');
console.log('  - Only rearranging pointers / Tylko przestawianie wskaźników');
console.log('  - Constant extra space for pointers / Stała dodatkowa przestrzeń dla wskaźników');
console.log('  - In-place partition / Podział w miejscu');
console.log();
console.log('KEY POINTS / KLUCZOWE PUNKTY:');
console.log('  - Stable partition (relative order preserved within partitions)');
console.log('    Stabilny podział (względna kolejność zachowana w partycjach)');
console.log('  - Elements equal to x go to "after" partition');
console.log('    Elementy równe x trafiają do partycji "after"');
console.log('  - No new nodes created, just rearranging existing ones');
console.log('    Nie tworzymy nowych węzłów, tylko przestawiamy istniejące');
console.log('='.repeat(70));
