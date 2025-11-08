/**
 * Stack of Plates - SetOfStacks
 * Stos Talerzy - Zestaw Stosów
 *
 * Simulates real-world stack of plates with height limit
 * Symuluje rzeczywisty stos talerzy z limitem wysokości
 *
 * When one stack reaches capacity, start a new stack
 * Gdy jeden stos osiągnie pojemność, rozpocznij nowy stos
 */

class SetOfStacks {
  constructor(capacity) {
    if (capacity < 1) {
      throw new Error('Capacity must be at least 1');
    }
    this.capacity = capacity; // Max size per stack / Maks rozmiar na stos
    this.stacks = [];         // Array of stacks / Tablica stosów
  }

  /**
   * Push value onto set of stacks / Włóż wartość na zestaw stosów
   */
  push(value) {
    const lastStack = this.getLastStack();

    // If no stack or last stack is full, create new stack
    // Jeśli brak stosu lub ostatni stos pełny, utwórz nowy stos
    if (!lastStack || lastStack.length >= this.capacity) {
      this.stacks.push([value]);
    } else {
      lastStack.push(value);
    }
  }

  /**
   * Pop value from set of stacks / Zdejmij wartość z zestawu stosów
   */
  pop() {
    const lastStack = this.getLastStack();

    if (!lastStack) {
      throw new Error('Stack is empty / Stos jest pusty');
    }

    const value = lastStack.pop();

    // Remove empty stack / Usuń pusty stos
    if (lastStack.length === 0) {
      this.stacks.pop();
    }

    return value;
  }

  /**
   * Peek at top value / Zajrzyj na szczyt
   */
  peek() {
    const lastStack = this.getLastStack();

    if (!lastStack) {
      throw new Error('Stack is empty / Stos jest pusty');
    }

    return lastStack[lastStack.length - 1];
  }

  /**
   * Check if empty / Sprawdź czy pusty
   */
  isEmpty() {
    return this.stacks.length === 0;
  }

  /**
   * Get last stack / Pobierz ostatni stos
   */
  getLastStack() {
    if (this.stacks.length === 0) return null;
    return this.stacks[this.stacks.length - 1];
  }

  /**
   * FOLLOW UP: Pop from specific sub-stack
   * FOLLOW UP: Zdejmij z konkretnego pod-stosu
   *
   * This is tricky! When we pop from middle stack, it creates gap.
   * To jest trudne! Gdy zdejmujemy ze środkowego stosu, tworzy się luka.
   *
   * Solution: "Roll over" - shift elements from subsequent stacks
   * Rozwiązanie: "Przewiń" - przesuń elementy z kolejnych stosów
   */
  popAt(index) {
    if (index < 0 || index >= this.stacks.length) {
      throw new Error(`Invalid stack index / Nieprawidłowy indeks stosu: ${index}`);
    }

    return this.leftShift(index, true);
  }

  /**
   * Left shift - remove bottom from stack[index] and shift left
   * Lewe przesunięcie - usuń dół ze stacks[index] i przesuń w lewo
   */
  leftShift(index, removeTop) {
    const stack = this.stacks[index];
    let removedItem;

    if (removeTop) {
      removedItem = stack.pop(); // Remove from top / Usuń ze szczytu
    } else {
      removedItem = stack.shift(); // Remove from bottom / Usuń z dołu
    }

    // If stack is now empty, remove it / Jeśli stos jest teraz pusty, usuń go
    if (stack.length === 0) {
      this.stacks.splice(index, 1);
    } else if (this.stacks.length > index + 1) {
      // Pull from next stack / Pobierz z następnego stosu
      const nextValue = this.leftShift(index + 1, false);
      stack.push(nextValue);
    }

    return removedItem;
  }

  /**
   * Get number of stacks / Pobierz liczbę stosów
   */
  numberOfStacks() {
    return this.stacks.length;
  }

  /**
   * Get total size / Pobierz całkowity rozmiar
   */
  size() {
    return this.stacks.reduce((sum, stack) => sum + stack.length, 0);
  }

  /**
   * Display all stacks / Wyświetl wszystkie stosy
   */
  display() {
    return this.stacks.map((stack, i) =>
      `Stack ${i}: [${stack.join(', ')}]`
    ).join('\n');
  }
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('STACK OF PLATES / STOS TALERZY');
console.log('='.repeat(70));
console.log();

console.log('TEST 1: Basic push and automatic stack creation');
console.log('-'.repeat(70));
const stacks = new SetOfStacks(3); // Capacity 3 per stack / Pojemność 3 na stos

console.log('Pushing: 1, 2, 3, 4, 5, 6, 7, 8, 9');
for (let i = 1; i <= 9; i++) {
  stacks.push(i);
  console.log(`Pushed ${i}, total stacks: ${stacks.numberOfStacks()}`);
}

console.log('\nCurrent state:');
console.log(stacks.display());
console.log();

console.log('TEST 2: Pop operations');
console.log('-'.repeat(70));
console.log(`Pop: ${stacks.pop()} (expected 9)`);
console.log(`Pop: ${stacks.pop()} (expected 8)`);
console.log(`Pop: ${stacks.pop()} (expected 7)`);
console.log('\nAfter 3 pops:');
console.log(stacks.display());
console.log();

console.log('TEST 3: popAt() - pop from specific stack');
console.log('-'.repeat(70));
const stacks2 = new SetOfStacks(3);
for (let i = 1; i <= 12; i++) {
  stacks2.push(i);
}

console.log('Initial state (12 elements):');
console.log(stacks2.display());
console.log();

console.log('popAt(0) - pop from first stack:');
const popped = stacks2.popAt(0);
console.log(`Popped: ${popped}`);
console.log('\nAfter popAt(0) with rolling:');
console.log(stacks2.display());
console.log();

console.log('TEST 4: Edge cases');
console.log('-'.repeat(70));
const stacks3 = new SetOfStacks(2);
stacks3.push(1);
stacks3.push(2);
stacks3.push(3);

console.log('State: [[1,2], [3]]');
console.log(`Peek: ${stacks3.peek()} (expected 3)`);
console.log(`Size: ${stacks3.size()}`);
console.log(`isEmpty: ${stacks3.isEmpty()}`);

// Pop all
console.log('\nPopping all:');
while (!stacks3.isEmpty()) {
  console.log(`  Pop: ${stacks3.pop()}`);
}
console.log(`isEmpty: ${stacks3.isEmpty()} ✓`);
console.log();

console.log('='.repeat(70));
console.log('COMPLEXITY / ZŁOŻONOŚĆ');
console.log('='.repeat(70));
console.log('push():   O(1)');
console.log('pop():    O(1)');
console.log('popAt():  O(n) - may need to shift elements from subsequent stacks');
console.log('          O(n) - może wymagać przesunięcia elementów z kolejnych stosów');
console.log('='.repeat(70));
