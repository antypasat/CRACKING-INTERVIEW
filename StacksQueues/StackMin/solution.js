/**
 * Stack Min - Stack with O(1) min() operation
 * Stos Min - Stos z operacją min() w O(1)
 *
 * KEY INSIGHT / KLUCZOWA OBSERWACJA:
 * Track minimum at each level of the stack
 * Śledź minimum na każdym poziomie stosu
 *
 * APPROACH 1: Each node stores current min
 * PODEJŚCIE 1: Każdy węzeł przechowuje obecne minimum
 *
 * When we push, we check if new value is smaller than current min
 * Gdy dodajemy, sprawdzamy czy nowa wartość jest mniejsza niż obecne minimum
 */

class NodeWithMin {
  constructor(value, min) {
    this.value = value; // Node value / Wartość węzła
    this.min = min;     // Min at this level / Minimum na tym poziomie
  }
}

class StackWithMin {
  constructor() {
    this.stack = [];
  }

  /**
   * Push value onto stack / Włóż wartość na stos
   * O(1) time
   */
  push(value) {
    const newMin = Math.min(value, this.min());
    this.stack.push(new NodeWithMin(value, newMin));
  }

  /**
   * Pop value from stack / Zdejmij wartość ze stosu
   * O(1) time
   */
  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty / Stos jest pusty');
    }
    return this.stack.pop().value;
  }

  /**
   * Get minimum value / Pobierz wartość minimalną
   * O(1) time ⭐
   */
  min() {
    if (this.isEmpty()) {
      return Infinity; // No elements / Brak elementów
    }
    return this.stack[this.stack.length - 1].min;
  }

  /**
   * Peek at top / Zajrzyj na szczyt
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty / Stos jest pusty');
    }
    return this.stack[this.stack.length - 1].value;
  }

  /**
   * Check if empty / Sprawdź czy pusty
   */
  isEmpty() {
    return this.stack.length === 0;
  }

  /**
   * Get size / Pobierz rozmiar
   */
  size() {
    return this.stack.length;
  }

  /**
   * Get all values / Pobierz wszystkie wartości
   */
  getValues() {
    return this.stack.map(node => node.value);
  }

  /**
   * Get all mins at each level / Pobierz wszystkie minima na każdym poziomie
   */
  getMins() {
    return this.stack.map(node => node.min);
  }
}

// ============================================================================
// APPROACH 2: Separate min stack (space optimized)
// PODEJŚCIE 2: Osobny stos minimów (zoptymalizowany przestrzennie)
// ============================================================================

/**
 * Stack with Min - Using separate min stack
 * Stos z Min - Używając osobnego stosu minimów
 *
 * Only push to min stack when new minimum is found
 * Tylko dodawaj do stosu minimów gdy znajdziesz nowe minimum
 *
 * Space: O(n) worst case, but can be better in practice
 * Przestrzeń: O(n) najgorszy przypadek, ale może być lepiej w praktyce
 */
class StackWithMin2 {
  constructor() {
    this.stack = [];    // Main stack / Główny stos
    this.minStack = []; // Stack of minimums / Stos minimów
  }

  push(value) {
    // Always push to main stack / Zawsze dodaj do głównego stosu
    this.stack.push(value);

    // Only push to min stack if new min / Tylko dodaj do stosu min jeśli nowe minimum
    if (this.minStack.length === 0 || value <= this.min()) {
      this.minStack.push(value);
    }
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty / Stos jest pusty');
    }

    const value = this.stack.pop();

    // If popping current min, remove from min stack too
    // Jeśli zdejmujemy obecne minimum, usuń też ze stosu minimów
    if (value === this.min()) {
      this.minStack.pop();
    }

    return value;
  }

  min() {
    if (this.minStack.length === 0) {
      return Infinity;
    }
    return this.minStack[this.minStack.length - 1];
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty / Stos jest pusty');
    }
    return this.stack[this.stack.length - 1];
  }

  isEmpty() {
    return this.stack.length === 0;
  }

  size() {
    return this.stack.length;
  }

  getValues() {
    return [...this.stack];
  }

  getMinStack() {
    return [...this.minStack];
  }
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('STACK MIN - APPROACH 1 (Node with Min)');
console.log('='.repeat(70));
console.log();

console.log('TEST 1: Basic operations');
console.log('-'.repeat(70));
const stack1 = new StackWithMin();

console.log('Push: 5, 6, 3, 7, 2, 8');
stack1.push(5);
console.log(`  Pushed 5, min: ${stack1.min()}`);
stack1.push(6);
console.log(`  Pushed 6, min: ${stack1.min()}`);
stack1.push(3);
console.log(`  Pushed 3, min: ${stack1.min()}`);
stack1.push(7);
console.log(`  Pushed 7, min: ${stack1.min()}`);
stack1.push(2);
console.log(`  Pushed 2, min: ${stack1.min()}`);
stack1.push(8);
console.log(`  Pushed 8, min: ${stack1.min()}`);

console.log(`\nStack: [${stack1.getValues()}]`);
console.log(`Mins:  [${stack1.getMins()}]`);
console.log(`Current min: ${stack1.min()} (expected 2) ✓`);
console.log();

console.log('Pop operations:');
while (!stack1.isEmpty()) {
  const value = stack1.pop();
  const minAfter = stack1.isEmpty() ? 'empty' : stack1.min();
  console.log(`  Popped ${value}, min now: ${minAfter}`);
}
console.log();

// ============================================================================

console.log('='.repeat(70));
console.log('STACK MIN - APPROACH 2 (Separate Min Stack)');
console.log('='.repeat(70));
console.log();

console.log('TEST 2: Separate min stack');
console.log('-'.repeat(70));
const stack2 = new StackWithMin2();

console.log('Push: 5, 6, 3, 7, 3, 2, 8');
const values = [5, 6, 3, 7, 3, 2, 8];
values.forEach(v => {
  stack2.push(v);
  console.log(`  Pushed ${v}, min: ${stack2.min()}, minStack: [${stack2.getMinStack()}]`);
});

console.log(`\nMain Stack: [${stack2.getValues()}]`);
console.log(`Min Stack:  [${stack2.getMinStack()}]`);
console.log(`Current min: ${stack2.min()} (expected 2) ✓`);
console.log();

console.log('Note: Min stack only stores [5, 3, 3, 2] (duplicates included)');
console.log('      Not all values! This can save space.');
console.log();

// ============================================================================

console.log('TEST 3: Descending order (worst case for space)');
console.log('-'.repeat(70));
const stack3 = new StackWithMin2();

console.log('Push: 10, 9, 8, 7, 6, 5');
[10, 9, 8, 7, 6, 5].forEach(v => {
  stack3.push(v);
});

console.log(`Main Stack: [${stack3.getValues()}]`);
console.log(`Min Stack:  [${stack3.getMinStack()}]`);
console.log('Every value is a new min, so both stacks have all values');
console.log();

// ============================================================================

console.log('TEST 4: Ascending order (best case for space)');
console.log('-'.repeat(70));
const stack4 = new StackWithMin2();

console.log('Push: 1, 2, 3, 4, 5, 6');
[1, 2, 3, 4, 5, 6].forEach(v => {
  stack4.push(v);
});

console.log(`Main Stack: [${stack4.getValues()}]`);
console.log(`Min Stack:  [${stack4.getMinStack()}]`);
console.log('Only first value is min, so min stack has just [1] ⭐');
console.log('This is the space-saving benefit!');
console.log();

// ============================================================================

console.log('TEST 5: Duplicate minimums');
console.log('-'.repeat(70));
const stack5 = new StackWithMin2();

console.log('Push: 3, 3, 3, 3');
[3, 3, 3, 3].forEach(v => {
  stack5.push(v);
});

console.log(`Main Stack: [${stack5.getValues()}]`);
console.log(`Min Stack:  [${stack5.getMinStack()}]`);
console.log('All duplicates stored in min stack (important for correct pop!)');
console.log();

console.log('Pop all:');
while (!stack5.isEmpty()) {
  const value = stack5.pop();
  const minAfter = stack5.isEmpty() ? 'empty' : stack5.min();
  console.log(`  Popped ${value}, min: ${minAfter}, minStack: [${stack5.getMinStack()}]`);
}
console.log();

// ============================================================================

console.log('TEST 6: Edge cases');
console.log('-'.repeat(70));

// Empty stack
const stack6 = new StackWithMin();
console.log(`Empty stack min: ${stack6.min()} (expected Infinity) ✓`);

try {
  stack6.pop();
  console.log('ERROR: Should throw');
} catch (e) {
  console.log(`Correctly threw: ${e.message} ✓`);
}

// Single element
stack6.push(42);
console.log(`Single element min: ${stack6.min()} (expected 42) ✓`);

// Negative numbers
const stack7 = new StackWithMin();
stack7.push(-5);
stack7.push(10);
stack7.push(-10);
stack7.push(0);
console.log(`\nWith negatives: [${stack7.getValues()}]`);
console.log(`Min: ${stack7.min()} (expected -10) ✓`);
console.log();

// ============================================================================

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();

console.log('APPROACH 1: Node with Min');
console.log('  Push: O(1) time, O(1) extra space per element');
console.log('  Pop:  O(1) time');
console.log('  Min:  O(1) time ⭐');
console.log('  Space: O(n) - each node stores value + min');
console.log();

console.log('APPROACH 2: Separate Min Stack');
console.log('  Push: O(1) time, O(1) amortized space');
console.log('  Pop:  O(1) time');
console.log('  Min:  O(1) time ⭐');
console.log('  Space: O(n) worst case, O(1) best case');
console.log('         Best when values are ascending');
console.log('         Worst when values are descending');
console.log();

console.log('COMPARISON / PORÓWNANIE:');
console.log('  Approach 1: Simpler, consistent space');
console.log('  Approach 2: Better space in many cases, slightly more complex');
console.log();

console.log('KEY INSIGHT / KLUCZOWA OBSERWACJA:');
console.log('  The min at any point is either:');
console.log('  1. The value being pushed (if smaller than current min)');
console.log('  2. The current min (if value being pushed is larger)');
console.log();
console.log('  To maintain this after pop, we must:');
console.log('  - Store min info with each element (Approach 1), OR');
console.log('  - Track all minimum values in separate stack (Approach 2)');
console.log('='.repeat(70));
