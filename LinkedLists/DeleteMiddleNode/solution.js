class Node {
  constructor(data) {
    this.data = data; // Node value / Wartość węzła
    this.next = null; // Pointer to next node / Wskaźnik do następnego węzła
  }
}

/**
 * Delete Middle Node - deletes a node from the middle of a singly linked list
 * Usuwa węzeł ze środka jednokierunkowej listy połączonej
 *
 * KEY INSIGHT / KLUCZOWA OBSERWACJA:
 * We can't actually delete the node because we don't have access to the previous node.
 * Nie możemy faktycznie usunąć węzła, bo nie mamy dostępu do poprzedniego węzła.
 *
 * Instead, we COPY the data from the next node and skip the next node.
 * Zamiast tego KOPIUJEMY dane z następnego węzła i pomijamy następny węzeł.
 *
 * @param {Node} node - The node to delete (not the head!) / Węzeł do usunięcia (nie head!)
 * @returns {boolean} - true if deleted successfully / true jeśli usunięto pomyślnie
 */
function deleteMiddleNode(node) {
  // Edge case: If node is null or it's the last node (no next), we can't delete it
  // Przypadek brzegowy: Jeśli węzeł jest null lub to ostatni węzeł (brak next), nie możemy go usunąć
  if (!node || !node.next) {
    return false; // Cannot delete last node with this approach / Nie można usunąć ostatniego węzła tym podejściem
  }

  // Copy data from next node to current node
  // Kopiujemy dane z następnego węzła do obecnego węzła
  node.data = node.next.data;

  // Skip the next node (effectively deleting it)
  // Pomijamy następny węzeł (efektywnie go usuwając)
  node.next = node.next.next;

  return true; // Successfully "deleted" the node / Pomyślnie "usunięto" węzeł
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
 * Convert linked list to array for easy display / Konwertuje listę na tablicę do łatwego wyświetlenia
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
 * Get node at specific index / Pobiera węzeł na określonym indeksie
 */
function getNodeAt(head, index) {
  let current = head;
  let i = 0;

  while (current && i < index) {
    current = current.next;
    i++;
  }

  return current;
}

/**
 * Print list with visual representation / Wyświetl listę z wizualizacją
 */
function printList(head, description) {
  const arr = linkedListToArray(head);
  console.log(`${description}: ${arr.join(' -> ')}`);
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('DELETE MIDDLE NODE - TEST CASES / PRZYPADKI TESTOWE');
console.log('='.repeat(70));
console.log();

// Test 1: Basic case from the problem / Podstawowy przypadek z zadania
console.log('TEST 1: Delete node "c" from a->b->c->d->e->f');
console.log('       Usuń węzeł "c" z a->b->c->d->e->f');
console.log('-'.repeat(70));
const list1 = createLinkedList(['a', 'b', 'c', 'd', 'e', 'f']);
printList(list1, 'Before / Przed');
const nodeC = getNodeAt(list1, 2); // Get node 'c' / Pobierz węzeł 'c'
console.log(`Deleting node with data: "${nodeC.data}"`);
const success1 = deleteMiddleNode(nodeC);
printList(list1, 'After / Po   ');
console.log(`Success / Sukces: ${success1}`);
console.log(`Expected / Oczekiwano: a -> b -> d -> e -> f`);
console.log();

// Test 2: Delete second node from the list / Usuń drugi węzeł z listy
console.log('TEST 2: Delete node "2" from 1->2->3->4->5');
console.log('       Usuń węzeł "2" z 1->2->3->4->5');
console.log('-'.repeat(70));
const list2 = createLinkedList([1, 2, 3, 4, 5]);
printList(list2, 'Before / Przed');
const node2 = getNodeAt(list2, 1); // Get node with data 2 / Pobierz węzeł z danymi 2
console.log(`Deleting node with data: ${node2.data}`);
const success2 = deleteMiddleNode(node2);
printList(list2, 'After / Po   ');
console.log(`Success / Sukces: ${success2}`);
console.log(`Expected / Oczekiwano: 1 -> 3 -> 4 -> 5`);
console.log();

// Test 3: Delete node from the exact middle / Usuń węzeł z dokładnego środka
console.log('TEST 3: Delete exact middle node from 1->2->3->4->5');
console.log('       Usuń węzeł ze środka z 1->2->3->4->5');
console.log('-'.repeat(70));
const list3 = createLinkedList([1, 2, 3, 4, 5]);
printList(list3, 'Before / Przed');
const node3 = getNodeAt(list3, 2); // Middle node (index 2) / Środkowy węzeł (indeks 2)
console.log(`Deleting node with data: ${node3.data}`);
const success3 = deleteMiddleNode(node3);
printList(list3, 'After / Po   ');
console.log(`Success / Sukces: ${success3}`);
console.log(`Expected / Oczekiwano: 1 -> 2 -> 4 -> 5`);
console.log();

// Test 4: Delete second-to-last node / Usuń przedostatni węzeł
console.log('TEST 4: Delete second-to-last node from 10->20->30->40');
console.log('       Usuń przedostatni węzeł z 10->20->30->40');
console.log('-'.repeat(70));
const list4 = createLinkedList([10, 20, 30, 40]);
printList(list4, 'Before / Przed');
const node4 = getNodeAt(list4, 2); // Second-to-last / Przedostatni
console.log(`Deleting node with data: ${node4.data}`);
const success4 = deleteMiddleNode(node4);
printList(list4, 'After / Po   ');
console.log(`Success / Sukces: ${success4}`);
console.log(`Expected / Oczekiwano: 10 -> 20 -> 40`);
console.log();

// Test 5: Three-node list / Lista trzech węzłów
console.log('TEST 5: Delete middle from three-node list: A->B->C');
console.log('       Usuń środkowy z trzyelementowej listy: A->B->C');
console.log('-'.repeat(70));
const list5 = createLinkedList(['A', 'B', 'C']);
printList(list5, 'Before / Przed');
const node5 = getNodeAt(list5, 1); // Middle node / Środkowy węzeł
console.log(`Deleting node with data: "${node5.data}"`);
const success5 = deleteMiddleNode(node5);
printList(list5, 'After / Po   ');
console.log(`Success / Sukces: ${success5}`);
console.log(`Expected / Oczekiwano: A -> C`);
console.log();

// ============================================================================
// EDGE CASES / PRZYPADKI BRZEGOWE
// ============================================================================

console.log('='.repeat(70));
console.log('EDGE CASES / PRZYPADKI BRZEGOWE');
console.log('='.repeat(70));
console.log();

// Edge Case 1: Try to delete last node (should fail)
// Przypadek brzegowy 1: Próba usunięcia ostatniego węzła (powinno się nie udać)
console.log('EDGE CASE 1: Try to delete the last node (should fail)');
console.log('            Próba usunięcia ostatniego węzła (powinno się nie udać)');
console.log('-'.repeat(70));
const list6 = createLinkedList([1, 2, 3, 4, 5]);
printList(list6, 'Before / Przed');
const lastNode = getNodeAt(list6, 4); // Last node / Ostatni węzeł
console.log(`Trying to delete last node with data: ${lastNode.data}`);
const success6 = deleteMiddleNode(lastNode);
printList(list6, 'After / Po   ');
console.log(`Success / Sukces: ${success6} (should be false / powinno być false)`);
console.log(`List unchanged / Lista niezmieniona (expected / oczekiwano)`);
console.log();

// Edge Case 2: Try to delete null node
// Przypadek brzegowy 2: Próba usunięcia węzła null
console.log('EDGE CASE 2: Try to delete null node');
console.log('            Próba usunięcia węzła null');
console.log('-'.repeat(70));
console.log('Trying to delete null node / Próba usunięcia węzła null');
const success7 = deleteMiddleNode(null);
console.log(`Success / Sukces: ${success7} (should be false / powinno być false)`);
console.log();

// Edge Case 3: Two-node list - delete first node
// Przypadek brzegowy 3: Lista dwóch węzłów - usuń pierwszy węzeł
console.log('EDGE CASE 3: Two-node list - delete first node');
console.log('            Lista dwóch węzłów - usuń pierwszy węzeł');
console.log('-'.repeat(70));
const list8 = createLinkedList([100, 200]);
printList(list8, 'Before / Przed');
const node8 = getNodeAt(list8, 0); // First node / Pierwszy węzeł
console.log(`Deleting first node with data: ${node8.data}`);
const success8 = deleteMiddleNode(node8);
printList(list8, 'After / Po   ');
console.log(`Success / Sukces: ${success8}`);
console.log(`Expected / Oczekiwano: 200`);
console.log(`Note / Uwaga: First node now contains data from second node`);
console.log(`             Pierwszy węzeł teraz zawiera dane z drugiego węzła`);
console.log();

// ============================================================================
// ANALYSIS / ANALIZA
// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();
console.log('Time Complexity / Złożoność czasowa:  O(1)');
console.log('  - Only constant time operations / Tylko operacje w stałym czasie');
console.log('  - Copy data and update pointer / Kopiuj dane i zaktualizuj wskaźnik');
console.log();
console.log('Space Complexity / Złożoność pamięciowa: O(1)');
console.log('  - No extra space needed / Nie potrzeba dodatkowej pamięci');
console.log('  - Only modify existing nodes / Tylko modyfikujemy istniejące węzły');
console.log();
console.log('LIMITATIONS / OGRANICZENIA:');
console.log('  - Cannot delete the last node / Nie można usunąć ostatniego węzła');
console.log('  - Requires access to the node to delete / Wymaga dostępu do węzła do usunięcia');
console.log('  - Works only for singly linked lists / Działa tylko dla list jednokierunkowych');
console.log('='.repeat(70));
