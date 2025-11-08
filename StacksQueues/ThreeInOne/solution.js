// ============================================================================
// APPROACH 1: FIXED DIVISION (Simple)
// PODEJŚCIE 1: STAŁY PODZIAŁ (Proste)
// ============================================================================

/**
 * Three Stacks in One Array - Fixed Division
 * Trzy Stosy w Jednej Tablicy - Stały Podział
 *
 * Divide array into 3 equal parts, each part is a stack
 * Podziel tablicę na 3 równe części, każda część to stos
 *
 * Stack 0: [0, n/3)
 * Stack 1: [n/3, 2n/3)
 * Stack 2: [2n/3, n)
 *
 * Pros: Simple, no complex logic / Proste, brak złożonej logiki
 * Cons: Fixed size per stack, may waste space / Stały rozmiar na stos, może marnować miejsce
 */
class FixedMultiStack {
  constructor(stackSize) {
    this.stackSize = stackSize; // Size of each stack / Rozmiar każdego stosu
    this.numberOfStacks = 3;
    this.values = new Array(stackSize * 3); // One array for all / Jedna tablica dla wszystkich
    this.sizes = [0, 0, 0]; // Current size of each stack / Obecny rozmiar każdego stosu
  }

  /**
   * Push value onto stack / Włóż wartość na stos
   */
  push(stackNum, value) {
    if (this.isFull(stackNum)) {
      throw new Error(`Stack ${stackNum} is full / Stos ${stackNum} jest pełny`);
    }

    this.sizes[stackNum]++; // Increment size / Zwiększ rozmiar
    const index = this.indexOfTop(stackNum);
    this.values[index] = value;
  }

  /**
   * Pop value from stack / Zdejmij wartość ze stosu
   */
  pop(stackNum) {
    if (this.isEmpty(stackNum)) {
      throw new Error(`Stack ${stackNum} is empty / Stos ${stackNum} jest pusty`);
    }

    const index = this.indexOfTop(stackNum);
    const value = this.values[index];
    this.values[index] = undefined; // Clear value / Wyczyść wartość
    this.sizes[stackNum]--; // Decrement size / Zmniejsz rozmiar
    return value;
  }

  /**
   * Peek at top of stack / Zajrzyj na szczyt stosu
   */
  peek(stackNum) {
    if (this.isEmpty(stackNum)) {
      throw new Error(`Stack ${stackNum} is empty / Stos ${stackNum} jest pusty`);
    }

    const index = this.indexOfTop(stackNum);
    return this.values[index];
  }

  /**
   * Check if stack is empty / Sprawdź czy stos jest pusty
   */
  isEmpty(stackNum) {
    return this.sizes[stackNum] === 0;
  }

  /**
   * Check if stack is full / Sprawdź czy stos jest pełny
   */
  isFull(stackNum) {
    return this.sizes[stackNum] === this.stackSize;
  }

  /**
   * Get index of top element in stack / Pobierz indeks szczytu stosu
   */
  indexOfTop(stackNum) {
    const offset = stackNum * this.stackSize; // Start of this stack / Początek tego stosu
    const size = this.sizes[stackNum];
    return offset + size - 1;
  }

  /**
   * Get all values in a stack / Pobierz wszystkie wartości w stosie
   */
  getStackValues(stackNum) {
    const offset = stackNum * this.stackSize;
    const size = this.sizes[stackNum];
    return this.values.slice(offset, offset + size);
  }
}

// ============================================================================
// APPROACH 2: FLEXIBLE DIVISION (Complex but optimal)
// PODEJŚCIE 2: ELASTYCZNY PODZIAŁ (Złożone ale optymalne)
// ============================================================================

/**
 * Three Stacks with Flexible Division
 * Trzy Stosy z Elastycznym Podziałem
 *
 * Each stack can grow dynamically until array is full
 * Każdy stos może rosnąć dynamicznie dopóki tablica nie jest pełna
 *
 * Uses circular buffer approach with shifting
 * Używa podejścia bufora kołowego z przesuwaniem
 *
 * Pros: Space efficient / Efektywne przestrzennie
 * Cons: Complex, shifting needed / Złożone, wymaga przesuwania
 */
class FlexibleMultiStack {
  constructor(totalSize) {
    this.totalSize = totalSize;
    this.numberOfStacks = 3;
    this.values = new Array(totalSize);

    // Stack info: where each stack starts and what's its size
    // Info o stosie: gdzie każdy stos się zaczyna i jaki ma rozmiar
    this.info = [];

    // Initialize each stack / Inicjalizuj każdy stos
    const stackCapacity = Math.floor(totalSize / this.numberOfStacks);
    for (let i = 0; i < this.numberOfStacks; i++) {
      this.info[i] = {
        start: stackCapacity * i,
        size: 0,
        capacity: stackCapacity
      };
    }
  }

  push(stackNum, value) {
    if (this.allStacksAreFull()) {
      throw new Error('All stacks are full / Wszystkie stosy są pełne');
    }

    const stack = this.info[stackNum];

    // If stack is full, expand it / Jeśli stos jest pełny, rozszerz go
    if (stack.size >= stack.capacity) {
      this.expand(stackNum);
    }

    // Find top index and insert / Znajdź indeks szczytu i wstaw
    stack.size++;
    const index = this.indexOfTop(stackNum);
    this.values[index] = value;
  }

  pop(stackNum) {
    const stack = this.info[stackNum];
    if (stack.size === 0) {
      throw new Error(`Stack ${stackNum} is empty / Stos ${stackNum} jest pusty`);
    }

    const index = this.indexOfTop(stackNum);
    const value = this.values[index];
    this.values[index] = undefined;
    stack.size--;
    return value;
  }

  peek(stackNum) {
    const stack = this.info[stackNum];
    if (stack.size === 0) {
      throw new Error(`Stack ${stackNum} is empty / Stos ${stackNum} jest pusty`);
    }

    const index = this.indexOfTop(stackNum);
    return this.values[index];
  }

  isEmpty(stackNum) {
    return this.info[stackNum].size === 0;
  }

  /**
   * Get index of top element (handles wrapping)
   * Pobierz indeks szczytu (obsługuje zawijanie)
   */
  indexOfTop(stackNum) {
    const stack = this.info[stackNum];
    return this.adjustIndex(stack.start + stack.size - 1);
  }

  /**
   * Adjust index to wrap around array / Dopasuj indeks do zawijania tablicy
   */
  adjustIndex(index) {
    const max = this.totalSize;
    return ((index % max) + max) % max; // Handle negative wrap / Obsłuż ujemne zawijanie
  }

  /**
   * Check if all stacks are full / Sprawdź czy wszystkie stosy są pełne
   */
  allStacksAreFull() {
    return this.numberOfElements() === this.totalSize;
  }

  /**
   * Get total number of elements / Pobierz całkowitą liczbę elementów
   */
  numberOfElements() {
    return this.info.reduce((sum, stack) => sum + stack.size, 0);
  }

  /**
   * Expand stack capacity / Rozszerz pojemność stosu
   */
  expand(stackNum) {
    this.shift((stackNum + 1) % this.numberOfStacks);
    this.info[stackNum].capacity++;
  }

  /**
   * Shift elements to make space / Przesuń elementy aby zrobić miejsce
   */
  shift(stackNum) {
    const stack = this.info[stackNum];

    // If stack has extra capacity, don't need to shift
    // Jeśli stos ma dodatkową pojemność, nie trzeba przesuwać
    if (stack.size >= stack.capacity) {
      const nextStack = (stackNum + 1) % this.numberOfStacks;
      this.shift(nextStack); // Recursive shift / Rekurencyjne przesunięcie
      stack.capacity++;
    }

    // Shift all elements in stack by one / Przesuń wszystkie elementy w stosie o jeden
    let index = this.indexOfTop(stackNum);
    while (stack.size > 0) {
      const prevIndex = this.previousIndex(index);
      this.values[index] = this.values[prevIndex];
      index = prevIndex;
      stack.size--;
    }

    // Move start position / Przesuń pozycję startową
    stack.start = this.adjustIndex(stack.start + 1);
    stack.size = 0;
  }

  /**
   * Get previous index / Pobierz poprzedni indeks
   */
  previousIndex(index) {
    return this.adjustIndex(index - 1);
  }

  /**
   * Get next index / Pobierz następny indeks
   */
  nextIndex(index) {
    return this.adjustIndex(index + 1);
  }

  /**
   * Get stack values / Pobierz wartości stosu
   */
  getStackValues(stackNum) {
    const stack = this.info[stackNum];
    const result = [];
    let index = stack.start;

    for (let i = 0; i < stack.size; i++) {
      result.push(this.values[index]);
      index = this.nextIndex(index);
    }

    return result;
  }
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('THREE IN ONE - FIXED DIVISION / STAŁY PODZIAŁ');
console.log('='.repeat(70));
console.log();

// Test Fixed Division / Test Stałego Podziału
console.log('TEST 1: Fixed Division - Basic operations');
console.log('       Stały Podział - Podstawowe operacje');
console.log('-'.repeat(70));

const stack = new FixedMultiStack(5); // Each stack can hold 5 elements / Każdy stos może pomieścić 5 elementów

// Push to each stack / Włóż do każdego stosu
console.log('Pushing to Stack 0: 1, 2, 3');
stack.push(0, 1);
stack.push(0, 2);
stack.push(0, 3);

console.log('Pushing to Stack 1: 10, 20, 30');
stack.push(1, 10);
stack.push(1, 20);
stack.push(1, 30);

console.log('Pushing to Stack 2: 100, 200, 300');
stack.push(2, 100);
stack.push(2, 200);
stack.push(2, 300);

console.log(`Stack 0: [${stack.getStackValues(0)}]`);
console.log(`Stack 1: [${stack.getStackValues(1)}]`);
console.log(`Stack 2: [${stack.getStackValues(2)}]`);
console.log();

// Peek operations / Operacje peek
console.log('Peek operations / Operacje peek:');
console.log(`Stack 0 peek: ${stack.peek(0)} (expected 3)`);
console.log(`Stack 1 peek: ${stack.peek(1)} (expected 30)`);
console.log(`Stack 2 peek: ${stack.peek(2)} (expected 300)`);
console.log();

// Pop operations / Operacje pop
console.log('Pop operations / Operacje pop:');
console.log(`Stack 0 pop: ${stack.pop(0)} (expected 3)`);
console.log(`Stack 1 pop: ${stack.pop(1)} (expected 30)`);
console.log(`Stack 2 pop: ${stack.pop(2)} (expected 300)`);
console.log();

console.log('After pops / Po operacjach pop:');
console.log(`Stack 0: [${stack.getStackValues(0)}]`);
console.log(`Stack 1: [${stack.getStackValues(1)}]`);
console.log(`Stack 2: [${stack.getStackValues(2)}]`);
console.log();

// Test Full Stack / Test Pełnego Stosu
console.log('TEST 2: Fixed Division - Fill stack completely');
console.log('       Stały Podział - Wypełnij stos całkowicie');
console.log('-'.repeat(70));

const stack2 = new FixedMultiStack(3);
stack2.push(0, 'a');
stack2.push(0, 'b');
stack2.push(0, 'c');

console.log(`Stack 0: [${stack2.getStackValues(0)}] (full / pełny)`);
console.log(`Is full: ${stack2.isFull(0)} ✓`);

try {
  stack2.push(0, 'd');
  console.log('ERROR: Should have thrown exception / BŁĄD: Powinien rzucić wyjątek');
} catch (e) {
  console.log(`Correctly threw exception: ${e.message} ✓`);
}
console.log();

// Test Empty Stack / Test Pustego Stosu
console.log('TEST 3: Fixed Division - Empty stack operations');
console.log('       Stały Podział - Operacje na pustym stosie');
console.log('-'.repeat(70));

const stack3 = new FixedMultiStack(3);
console.log(`Is empty: ${stack3.isEmpty(0)} ✓`);

try {
  stack3.pop(0);
  console.log('ERROR: Should have thrown exception / BŁĄD: Powinien rzucić wyjątek');
} catch (e) {
  console.log(`Correctly threw exception: ${e.message} ✓`);
}
console.log();

// ============================================================================
// FLEXIBLE DIVISION TESTS / TESTY ELASTYCZNEGO PODZIAŁU
// ============================================================================

console.log('='.repeat(70));
console.log('THREE IN ONE - FLEXIBLE DIVISION / ELASTYCZNY PODZIAŁ');
console.log('='.repeat(70));
console.log();

console.log('TEST 4: Flexible Division - Dynamic growth');
console.log('       Elastyczny Podział - Dynamiczny wzrost');
console.log('-'.repeat(70));

const flexStack = new FlexibleMultiStack(9); // Total capacity 9 / Całkowita pojemność 9

console.log('Pushing many elements to Stack 0:');
for (let i = 1; i <= 6; i++) {
  flexStack.push(0, i);
  console.log(`  Pushed ${i}, Stack 0: [${flexStack.getStackValues(0)}]`);
}

console.log('\nPushing to Stack 1:');
flexStack.push(1, 10);
flexStack.push(1, 20);
console.log(`Stack 1: [${flexStack.getStackValues(1)}]`);

console.log('\nPushing to Stack 2:');
flexStack.push(2, 100);
console.log(`Stack 2: [${flexStack.getStackValues(2)}]`);
console.log();

console.log('Final state / Stan końcowy:');
console.log(`Stack 0: [${flexStack.getStackValues(0)}]`);
console.log(`Stack 1: [${flexStack.getStackValues(1)}]`);
console.log(`Stack 2: [${flexStack.getStackValues(2)}]`);
console.log(`Total elements: ${flexStack.numberOfElements()}/9`);
console.log();

// ============================================================================
// COMPARISON / PORÓWNANIE
// ============================================================================

console.log('='.repeat(70));
console.log('COMPARISON / PORÓWNANIE');
console.log('='.repeat(70));
console.log();

console.log('FIXED DIVISION / STAŁY PODZIAŁ:');
console.log('  Pros / Zalety:');
console.log('    - Simple implementation / Prosta implementacja');
console.log('    - O(1) all operations / O(1) wszystkie operacje');
console.log('    - No complex logic / Brak złożonej logiki');
console.log('  Cons / Wady:');
console.log('    - Fixed capacity per stack / Stała pojemność na stos');
console.log('    - May waste space / Może marnować miejsce');
console.log('    - One stack full, others empty possible / Jeden stos pełny, inne puste możliwe');
console.log();

console.log('FLEXIBLE DIVISION / ELASTYCZNY PODZIAŁ:');
console.log('  Pros / Zalety:');
console.log('    - Flexible capacity / Elastyczna pojemność');
console.log('    - Better space utilization / Lepsze wykorzystanie przestrzeni');
console.log('    - Stacks can grow as needed / Stosy mogą rosnąć według potrzeb');
console.log('  Cons / Wady:');
console.log('    - Complex implementation / Złożona implementacja');
console.log('    - Shift operations can be O(n) / Operacje przesunięcia mogą być O(n)');
console.log('    - More overhead / Więcej narzutu');
console.log();

console.log('='.repeat(70));
console.log('COMPLEXITY ANALYSIS / ANALIZA ZŁOŻONOŚCI');
console.log('='.repeat(70));
console.log();

console.log('FIXED DIVISION:');
console.log('  Space: O(n) where n is total capacity / gdzie n to całkowita pojemność');
console.log('  Push:  O(1)');
console.log('  Pop:   O(1)');
console.log('  Peek:  O(1)');
console.log();

console.log('FLEXIBLE DIVISION:');
console.log('  Space: O(n) where n is total capacity');
console.log('  Push:  O(n) worst case (due to shifting) / najgorszy przypadek (przesunięcie)');
console.log('         O(1) amortized / zamortyzowane');
console.log('  Pop:   O(1)');
console.log('  Peek:  O(1)');
console.log('='.repeat(70));
