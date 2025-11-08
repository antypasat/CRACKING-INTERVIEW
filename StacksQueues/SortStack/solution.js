/**
 * Sort Stack - Sort a stack with smallest on top
 * Sortuj Stos - Posortuj stos z najmniejszymi na górze
 *
 * Can only use ONE additional temporary stack
 * Można użyć tylko JEDNEGO dodatkowego stosu tymczasowego
 *
 * STRATEGY / STRATEGIA:
 * Use temporary stack to hold sorted elements
 * Użyj stosu tymczasowego do trzymania posortowanych elementów
 *
 * Like insertion sort: insert each element in correct position in temp stack
 * Jak sortowanie przez wstawianie: wstaw każdy element na właściwe miejsce w stosie tymczasowym
 */

/**
 * Sort stack with smallest items on top
 * Posortuj stos z najmniejszymi elementami na górze
 *
 * @param {Array} stack - Input stack / Stos wejściowy
 * @returns {Array} - Sorted stack / Posortowany stos
 */
function sortStack(stack) {
  const tempStack = [];

  while (stack.length > 0) {
    // Pop element from original stack / Zdejmij element z oryginalnego stosu
    const tmp = stack.pop();

    // While temp stack's top > tmp, move back to original
    // Podczas gdy szczyt stosu tymczasowego > tmp, przenieś z powrotem do oryginalnego
    while (tempStack.length > 0 && tempStack[tempStack.length - 1] > tmp) {
      stack.push(tempStack.pop());
    }

    // Insert tmp in correct position / Wstaw tmp na właściwą pozycję
    tempStack.push(tmp);
  }

  // Transfer back to original stack (largest on top now)
  // Przenieś z powrotem do oryginalnego stosu (największe na górze teraz)
  while (tempStack.length > 0) {
    stack.push(tempStack.pop());
  }

  return stack;
}

/**
 * Helper: Display stack / Pomocnicza: Wyświetl stos
 */
function displayStack(stack, name = 'Stack') {
  return `${name}: [${stack.join(', ')}] <- top`;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('SORT STACK / SORTUJ STOS');
console.log('='.repeat(70));
console.log();

console.log('TEST 1: Random order');
console.log('-'.repeat(70));
const stack1 = [5, 2, 8, 1, 9, 3];
console.log('Before:', displayStack(stack1));
sortStack(stack1);
console.log('After: ', displayStack(stack1));
console.log('Expected: [9, 8, 5, 3, 2, 1] <- top (smallest on top)');
console.log();

console.log('TEST 2: Already sorted (best case)');
console.log('-'.repeat(70));
const stack2 = [5, 4, 3, 2, 1];
console.log('Before:', displayStack(stack2));
sortStack(stack2);
console.log('After: ', displayStack(stack2));
console.log('Already sorted with smallest on top ✓');
console.log();

console.log('TEST 3: Reverse sorted (worst case)');
console.log('-'.repeat(70));
const stack3 = [1, 2, 3, 4, 5];
console.log('Before:', displayStack(stack3));
sortStack(stack3);
console.log('After: ', displayStack(stack3));
console.log('Completely reversed');
console.log();

console.log('TEST 4: Duplicates');
console.log('-'.repeat(70));
const stack4 = [3, 1, 3, 2, 1, 3];
console.log('Before:', displayStack(stack4));
sortStack(stack4);
console.log('After: ', displayStack(stack4));
console.log('Expected: [3, 3, 3, 2, 1, 1]');
console.log();

console.log('TEST 5: Single element');
console.log('-'.repeat(70));
const stack5 = [42];
console.log('Before:', displayStack(stack5));
sortStack(stack5);
console.log('After: ', displayStack(stack5));
console.log('Unchanged ✓');
console.log();

console.log('TEST 6: Two elements');
console.log('-'.repeat(70));
const stack6 = [2, 1];
console.log('Before:', displayStack(stack6));
sortStack(stack6);
console.log('After: ', displayStack(stack6));
console.log('Expected: [2, 1] (already correct)');
console.log();

console.log('TEST 7: Negative numbers');
console.log('-'.repeat(70));
const stack7 = [5, -3, 8, -1, 0, 2];
console.log('Before:', displayStack(stack7));
sortStack(stack7);
console.log('After: ', displayStack(stack7));
console.log('Expected: [8, 5, 2, 0, -1, -3]');
console.log();

// ============================================================================
// STEP-BY-STEP EXAMPLE / PRZYKŁAD KROK PO KROKU
// ============================================================================

console.log('='.repeat(70));
console.log('STEP-BY-STEP EXAMPLE / PRZYKŁAD KROK PO KROKU');
console.log('='.repeat(70));
console.log();
console.log('Sorting: [5, 2, 8, 1]');
console.log();

console.log('Initial state:');
console.log('  original: [5, 2, 8, 1] <- top');
console.log('  temp:     []');
console.log();

console.log('Step 1: Pop 1 from original');
console.log('  tmp = 1');
console.log('  temp is empty, so push 1');
console.log('  original: [5, 2, 8]');
console.log('  temp:     [1] <- top');
console.log();

console.log('Step 2: Pop 8 from original');
console.log('  tmp = 8');
console.log('  temp top (1) < 8, so push 8');
console.log('  original: [5, 2]');
console.log('  temp:     [1, 8] <- top');
console.log();

console.log('Step 3: Pop 2 from original');
console.log('  tmp = 2');
console.log('  temp top (8) > 2, move 8 back to original');
console.log('  temp top (1) < 2, push 2');
console.log('  original: [5, 8]');
console.log('  temp:     [1, 2] <- top');
console.log();

console.log('Step 4: Pop 5 from original');
console.log('  tmp = 5');
console.log('  temp top (2) < 5, push 5');
console.log('  original: [8]');
console.log('  temp:     [1, 2, 5] <- top');
console.log();

console.log('Step 5: Pop 8 from original');
console.log('  tmp = 8');
console.log('  temp top (5) < 8, push 8');
console.log('  original: []');
console.log('  temp:     [1, 2, 5, 8] <- top (sorted!)');
console.log();

console.log('Step 6: Transfer back');
console.log('  Pop all from temp to original');
console.log('  original: [8, 5, 2, 1] <- top (smallest on top!)');
console.log('  temp:     []');
console.log();

console.log('='.repeat(70));
console.log('ALGORITHM EXPLANATION / WYJAŚNIENIE ALGORYTMU');
console.log('='.repeat(70));
console.log();
console.log('Think of it like insertion sort:');
console.log('Pomyśl o tym jak o sortowaniu przez wstawianie:');
console.log();
console.log('1. Take element from original stack');
console.log('   Weź element z oryginalnego stosu');
console.log();
console.log('2. Find correct position in temp stack:');
console.log('   Znajdź właściwą pozycję w stosie tymczasowym:');
console.log('   - If temp top > element, move temp elements back to original');
console.log('   - Jeśli szczyt temp > element, przenieś elementy temp z powrotem');
console.log('   - This makes room for element');
console.log('   - To robi miejsce dla elementu');
console.log();
console.log('3. Insert element in temp stack');
console.log('   Wstaw element do stosu tymczasowego');
console.log();
console.log('4. Repeat until original is empty');
console.log('   Powtarzaj dopóki oryginalny nie jest pusty');
console.log();
console.log('5. Temp stack now has elements in descending order (largest on top)');
console.log('   Stos tymczasowy ma teraz elementy malejąco (największe na górze)');
console.log();
console.log('6. Transfer back to get smallest on top');
console.log('   Przenieś z powrotem aby uzyskać najmniejsze na górze');
console.log();

console.log('='.repeat(70));
console.log('COMPLEXITY / ZŁOŻONOŚĆ');
console.log('='.repeat(70));
console.log();
console.log('Time Complexity / Złożoność czasowa:  O(n²)');
console.log('  - For each element, may need to move elements back');
console.log('  - Dla każdego elementu, może trzeba przenieść elementy z powrotem');
console.log('  - Similar to insertion sort / Podobnie jak sortowanie przez wstawianie');
console.log();
console.log('Space Complexity / Złożoność pamięciowa: O(n)');
console.log('  - One temporary stack / Jeden stos tymczasowy');
console.log();
console.log('Best case:  O(n) - already sorted / już posortowane');
console.log('Worst case: O(n²) - reverse sorted / odwrotnie posortowane');
console.log('='.repeat(70));
