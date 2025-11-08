class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

// ============================================================================
// APPROACH 1: HASH SET (Brute Force Optimized)
// PODEJŚCIE 1: HASH SET (Zoptymalizowana Siłowa)
// ============================================================================

/**
 * Find Intersection - Hash Set Approach
 * Znajdź Przecięcie - Podejście Hash Set
 *
 * Store all nodes from list1 in a set, then traverse list2 to find first match
 * Przechowaj wszystkie węzły z list1 w zbiorze, potem przejdź list2 aby znaleźć pierwsze dopasowanie
 *
 * Time: O(n + m), Space: O(n)
 *
 * @param {Node} head1 - First list / Pierwsza lista
 * @param {Node} head2 - Second list / Druga lista
 * @returns {Node|null} - Intersecting node or null / Węzeł przecięcia lub null
 */
function findIntersectionHashSet(head1, head2) {
  if (!head1 || !head2) return null;

  // Store all nodes from list1 / Przechowaj wszystkie węzły z list1
  const nodes = new Set();
  let current = head1;

  while (current) {
    nodes.add(current); // Store node reference, not value / Przechowuj referencję węzła, nie wartość
    current = current.next;
  }

  // Traverse list2 and find first node in set / Przejdź list2 i znajdź pierwszy węzeł w zbiorze
  current = head2;
  while (current) {
    if (nodes.has(current)) {
      return current; // Found intersection! / Znaleziono przecięcie!
    }
    current = current.next;
  }

  return null; // No intersection / Brak przecięcia
}

// ============================================================================
// APPROACH 2: OPTIMAL (Length-based)
// PODEJŚCIE 2: OPTYMALNE (Oparte na długości)
// ============================================================================

/**
 * Find Intersection - Optimal Approach
 * Znajdź Przecięcie - Podejście Optymalne
 *
 * KEY INSIGHT / KLUCZOWA OBSERWACJA:
 * If lists intersect, they share a common "tail" from intersection to end
 * Jeśli listy się przecinają, dzielą wspólny "ogon" od przecięcia do końca
 *
 * Strategy / Strategia:
 * 1. Get lengths of both lists / Pobierz długości obu list
 * 2. Advance longer list by difference / Przesuń dłuższą listę o różnicę
 * 3. Traverse both in parallel to find intersection / Przejdź obie równolegle aby znaleźć przecięcie
 *
 * Time: O(n + m), Space: O(1)
 *
 * @param {Node} head1 - First list / Pierwsza lista
 * @param {Node} head2 - Second list / Druga lista
 * @returns {Node|null} - Intersecting node or null / Węzeł przecięcia lub null
 */
function findIntersection(head1, head2) {
  if (!head1 || !head2) return null;

  // Step 1: Get lengths and tail nodes / Krok 1: Pobierz długości i węzły końcowe
  const result1 = getLengthAndTail(head1);
  const result2 = getLengthAndTail(head2);

  // If tails are different, no intersection / Jeśli końce są różne, brak przecięcia
  if (result1.tail !== result2.tail) {
    return null;
  }

  // Step 2: Align starting positions / Krok 2: Wyrównaj pozycje startowe
  let shorter = result1.length < result2.length ? head1 : head2;
  let longer = result1.length < result2.length ? head2 : head1;
  const diff = Math.abs(result1.length - result2.length);

  // Advance longer list by difference / Przesuń dłuższą listę o różnicę
  for (let i = 0; i < diff; i++) {
    longer = longer.next;
  }

  // Step 3: Traverse in parallel to find intersection / Krok 3: Przejdź równolegle
  while (shorter !== longer) {
    shorter = shorter.next;
    longer = longer.next;
  }

  return shorter; // This is the intersection node / To jest węzeł przecięcia
}

/**
 * Helper: Get length and tail of list / Pomocnicza: Pobierz długość i ogon listy
 */
function getLengthAndTail(head) {
  let length = 0;
  let current = head;

  while (current) {
    length++;
    if (!current.next) {
      return { length, tail: current };
    }
    current = current.next;
  }

  return { length: 0, tail: null };
}

// ============================================================================
// APPROACH 3: TWO POINTERS (Elegant)
// PODEJŚCIE 3: DWA WSKAŹNIKI (Eleganckie)
// ============================================================================

/**
 * Find Intersection - Two Pointers Approach
 * Znajdź Przecięcie - Podejście Dwóch Wskaźników
 *
 * CLEVER TRICK / SPRYTNA SZTUCZKA:
 * When pointer reaches end, redirect to other list's head
 * Gdy wskaźnik dotrze do końca, przekieruj do głowy drugiej listy
 *
 * Both pointers will meet at intersection (or null if no intersection)
 * Oba wskaźniki spotkają się w przecięciu (lub null jeśli brak przecięcia)
 *
 * Why it works / Dlaczego działa:
 * Length of path A: a + c (a = unique to list1, c = common tail)
 * Length of path B: b + c (b = unique to list2, c = common tail)
 * After swap: both travel a + c + b = b + c + a
 *
 * Time: O(n + m), Space: O(1)
 */
function findIntersectionTwoPointers(head1, head2) {
  if (!head1 || !head2) return null;

  let p1 = head1;
  let p2 = head2;

  // Traverse until they meet or both become null
  // Przejdź aż się spotkają lub oba staną się null
  while (p1 !== p2) {
    // When reaching end, switch to other list / Gdy dotrzesz do końca, przełącz na drugą listę
    p1 = p1 ? p1.next : head2;
    p2 = p2 ? p2.next : head1;
  }

  return p1; // Either intersection node or null / Albo węzeł przecięcia albo null
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
 * Create intersecting lists / Utwórz przecinające się listy
 *
 * @param {Array} arr1 - Values for list1 before intersection
 * @param {Array} arr2 - Values for list2 before intersection
 * @param {Array} common - Common values after intersection
 */
function createIntersectingLists(arr1, arr2, common) {
  // Create common tail / Utwórz wspólny ogon
  const commonHead = createLinkedList(common);

  // Create list1 / Utwórz list1
  const head1 = createLinkedList(arr1);
  if (head1) {
    let tail1 = head1;
    while (tail1.next) tail1 = tail1.next;
    tail1.next = commonHead; // Connect to common tail / Połącz ze wspólnym ogonem
  } else {
    head1 = commonHead;
  }

  // Create list2 / Utwórz list2
  const head2 = createLinkedList(arr2);
  if (head2) {
    let tail2 = head2;
    while (tail2.next) tail2 = tail2.next;
    tail2.next = commonHead; // Connect to same common tail / Połącz z tym samym wspólnym ogonem
  } else {
    head2 = commonHead;
  }

  return { head1, head2, intersection: commonHead };
}

/**
 * Convert list to string for display / Konwertuj listę na string do wyświetlenia
 */
function listToString(head, maxNodes = 20) {
  const result = [];
  let current = head;
  let count = 0;

  while (current && count < maxNodes) {
    result.push(current.data);
    current = current.next;
    count++;
  }

  if (current) result.push('...');
  return result.join(' -> ');
}

/**
 * Get node at index / Pobierz węzeł na indeksie
 */
function getNodeAt(head, index) {
  let current = head;
  for (let i = 0; i < index && current; i++) {
    current = current.next;
  }
  return current;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('INTERSECTION - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Basic intersection / Podstawowe przecięcie
console.log('TEST 1: Basic intersection');
console.log('       Podstawowe przecięcie');
console.log('-'.repeat(70));
const test1 = createIntersectingLists([1, 2, 3], [9, 8], [4, 5, 6]);
console.log(`List 1: ${listToString(test1.head1)}`);
console.log(`List 2: ${listToString(test1.head2)}`);
console.log(`Expected intersection at node with data: ${test1.intersection.data}`);
const result1a = findIntersectionHashSet(test1.head1, test1.head2);
const result1b = findIntersection(test1.head1, test1.head2);
const result1c = findIntersectionTwoPointers(test1.head1, test1.head2);
console.log(`Hash Set:      ${result1a ? result1a.data : 'null'} ${result1a === test1.intersection ? '✓' : '✗'}`);
console.log(`Optimal:       ${result1b ? result1b.data : 'null'} ${result1b === test1.intersection ? '✓' : '✗'}`);
console.log(`Two Pointers:  ${result1c ? result1c.data : 'null'} ${result1c === test1.intersection ? '✓' : '✗'}`);
console.log();

// Test 2: No intersection / Brak przecięcia
console.log('TEST 2: No intersection');
console.log('       Brak przecięcia');
console.log('-'.repeat(70));
const list2a = createLinkedList([1, 2, 3, 4, 5]);
const list2b = createLinkedList([6, 7, 8, 9]);
console.log(`List 1: ${listToString(list2a)}`);
console.log(`List 2: ${listToString(list2b)}`);
const result2a = findIntersectionHashSet(list2a, list2b);
const result2b = findIntersection(list2a, list2b);
const result2c = findIntersectionTwoPointers(list2a, list2b);
console.log(`Hash Set:      ${result2a === null ? 'null ✓' : 'ERROR ✗'}`);
console.log(`Optimal:       ${result2b === null ? 'null ✓' : 'ERROR ✗'}`);
console.log(`Two Pointers:  ${result2c === null ? 'null ✓' : 'ERROR ✗'}`);
console.log();

// Test 3: Same length lists / Listy tej samej długości
console.log('TEST 3: Same length lists with intersection');
console.log('       Listy tej samej długości z przecięciem');
console.log('-'.repeat(70));
const test3 = createIntersectingLists([1, 2], [7, 8], [3, 4, 5]);
console.log(`List 1: ${listToString(test3.head1)}`);
console.log(`List 2: ${listToString(test3.head2)}`);
const result3 = findIntersection(test3.head1, test3.head2);
console.log(`Intersection: ${result3 ? result3.data : 'null'} ${result3 === test3.intersection ? '✓' : '✗'}`);
console.log();

// Test 4: Intersection at head / Przecięcie na początku
console.log('TEST 4: Intersection at head (entire list is common)');
console.log('       Przecięcie na początku (cała lista wspólna)');
console.log('-'.repeat(70));
const commonList = createLinkedList([1, 2, 3, 4]);
console.log(`List 1: ${listToString(commonList)}`);
console.log(`List 2: ${listToString(commonList)} (same list / ta sama lista)`);
const result4 = findIntersection(commonList, commonList);
console.log(`Intersection: ${result4 ? result4.data : 'null'} ${result4 === commonList ? '✓' : '✗'}`);
console.log();

// Test 5: Very different lengths / Bardzo różne długości
console.log('TEST 5: Very different lengths');
console.log('       Bardzo różne długości');
console.log('-'.repeat(70));
const test5 = createIntersectingLists([1, 2, 3, 4, 5, 6, 7], [9], [8, 10]);
console.log(`List 1: ${listToString(test5.head1)}`);
console.log(`List 2: ${listToString(test5.head2)}`);
const result5 = findIntersection(test5.head1, test5.head2);
console.log(`Intersection: ${result5 ? result5.data : 'null'} ${result5 === test5.intersection ? '✓' : '✗'}`);
console.log();

// Test 6: Intersection at last node / Przecięcie na ostatnim węźle
console.log('TEST 6: Intersection at last node only');
console.log('       Przecięcie tylko na ostatnim węźle');
console.log('-'.repeat(70));
const test6 = createIntersectingLists([1, 2, 3], [4, 5, 6], [7]);
console.log(`List 1: ${listToString(test6.head1)}`);
console.log(`List 2: ${listToString(test6.head2)}`);
const result6 = findIntersection(test6.head1, test6.head2);
console.log(`Intersection: ${result6 ? result6.data : 'null'} ${result6 === test6.intersection ? '✓' : '✗'}`);
console.log();

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: One null list / Jedna pusta lista
console.log('EDGE CASE 1: One list is null');
console.log('            Jedna lista jest null');
console.log('-'.repeat(70));
const list7 = createLinkedList([1, 2, 3]);
const result7 = findIntersection(list7, null);
console.log(`Result: ${result7 === null ? 'null ✓' : 'ERROR ✗'}`);
console.log();

// Edge Case 2: Both null / Obie null
console.log('EDGE CASE 2: Both lists are null');
console.log('            Obie listy są null');
console.log('-'.repeat(70));
const result8 = findIntersection(null, null);
console.log(`Result: ${result8 === null ? 'null ✓' : 'ERROR ✗'}`);
console.log();

// Edge Case 3: Single node intersection / Przecięcie jednego węzła
console.log('EDGE CASE 3: Single node lists with intersection');
console.log('            Jednoelementowe listy z przecięciem');
console.log('-'.repeat(70));
const singleNode = new Node(42);
const result9 = findIntersection(singleNode, singleNode);
console.log(`Lists: [42] and [42] (same node / ten sam węzeł)`);
console.log(`Result: ${result9 === singleNode ? '42 ✓' : 'ERROR ✗'}`);
console.log();

// ============================================================================
// VISUAL DEMONSTRATION / DEMONSTRACJA WIZUALNA
// ============================================================================

console.log('='.repeat(70));
console.log('VISUAL DEMONSTRATION / DEMONSTRACJA WIZUALNA');
console.log('='.repeat(70));
console.log();
console.log('Example: Two lists intersecting / Przykład: Dwie listy przecinające się');
console.log();
console.log('List 1: 1 -> 2 -> 3 \\');
console.log('                     -> 7 -> 8 -> 9 -> null');
console.log('List 2: 4 -> 5 -> 6 /');
console.log();
console.log('Intersection node: 7 (by reference, not value)');
console.log('Węzeł przecięcia: 7 (przez referencję, nie wartość)');
console.log();

// ============================================================================
// COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('APPROACH 1: Hash Set / Zbiór Hash');
console.log('  Time: O(n + m)   - Traverse both lists / Przejdź obie listy');
console.log('  Space: O(n)      - Store first list in set / Przechowuj pierwszą listę w zbiorze');
console.log();
console.log('APPROACH 2: Optimal (Length-based) / Optymalne (Oparte na długości)');
console.log('  Time: O(n + m)   - Get lengths + aligned traversal / Pobierz długości + wyrównane przejście');
console.log('  Space: O(1)      - Only pointers / Tylko wskaźniki');
console.log();
console.log('APPROACH 3: Two Pointers / Dwa Wskaźniki');
console.log('  Time: O(n + m)   - Each pointer traverses at most n + m nodes');
console.log('  Space: O(1)      - Only pointers / Tylko wskaźniki');
console.log();
console.log('Best approach: Optimal or Two Pointers (O(1) space)');
console.log('Najlepsze podejście: Optymalne lub Dwa Wskaźniki (O(1) przestrzeń)');
console.log('='.repeat(70));
