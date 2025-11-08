/**
 * Queue via Stacks - MyQueue
 * Kolejka przez Stosy
 *
 * Implement a queue using TWO stacks
 * Zaimplementuj kolejkę używając DWÓCH stosów
 *
 * KEY INSIGHT / KLUCZOWA OBSERWACJA:
 * Stack is LIFO, Queue is FIFO
 * Stos to LIFO, Kolejka to FIFO
 *
 * Use two stacks: one for enqueue, one for dequeue
 * Użyj dwóch stosów: jeden dla enqueue, jeden dla dequeue
 *
 * When dequeuing, if dequeue stack is empty, transfer all from enqueue stack
 * Przy usuwaniu, jeśli stos dequeue jest pusty, przenieś wszystko ze stosu enqueue
 */

class MyQueue {
  constructor() {
    this.stackNewest = []; // For enqueue / Dla enqueue
    this.stackOldest = [];  // For dequeue / Dla dequeue
  }

  /**
   * Add element to queue / Dodaj element do kolejki
   * O(1) time
   */
  enqueue(value) {
    this.stackNewest.push(value);
  }

  /**
   * Remove element from queue / Usuń element z kolejki
   * O(1) amortized, O(n) worst case
   */
  dequeue() {
    this.shiftStacks(); // Ensure oldest stack has elements / Upewnij się że najstarszy stos ma elementy

    if (this.stackOldest.length === 0) {
      throw new Error('Queue is empty / Kolejka jest pusta');
    }

    return this.stackOldest.pop();
  }

  /**
   * Peek at front of queue / Zajrzyj na przód kolejki
   * O(1) amortized
   */
  peek() {
    this.shiftStacks();

    if (this.stackOldest.length === 0) {
      throw new Error('Queue is empty / Kolejka jest pusta');
    }

    return this.stackOldest[this.stackOldest.length - 1];
  }

  /**
   * Check if empty / Sprawdź czy pusta
   */
  isEmpty() {
    return this.stackNewest.length === 0 && this.stackOldest.length === 0;
  }

  /**
   * Get size / Pobierz rozmiar
   */
  size() {
    return this.stackNewest.length + this.stackOldest.length;
  }

  /**
   * Transfer elements from newest to oldest stack
   * Przenieś elementy z najnowszego do najstarszego stosu
   *
   * CRITICAL: Only do this when oldest is empty!
   * KRYTYCZNE: Rób to tylko gdy najstarszy jest pusty!
   */
  shiftStacks() {
    // Only shift if oldest is empty / Tylko przenoś jeśli najstarszy jest pusty
    if (this.stackOldest.length === 0) {
      while (this.stackNewest.length > 0) {
        this.stackOldest.push(this.stackNewest.pop());
      }
    }
  }

  /**
   * Display queue state / Wyświetl stan kolejki
   */
  display() {
    // Show oldest first (front of queue) / Pokaż najstarsze pierwsze (przód kolejki)
    const oldest = [...this.stackOldest].reverse();
    const newest = [...this.stackNewest];
    return `Front -> [${oldest.concat(newest).join(', ')}] <- Back`;
  }
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('QUEUE VIA STACKS / KOLEJKA PRZEZ STOSY');
console.log('='.repeat(70));
console.log();

console.log('TEST 1: Basic enqueue and dequeue');
console.log('-'.repeat(70));
const q = new MyQueue();

console.log('Enqueue: 1, 2, 3, 4, 5');
[1, 2, 3, 4, 5].forEach(v => {
  q.enqueue(v);
  console.log(`  Enqueued ${v}, ${q.display()}`);
});

console.log('\nDequeue operations:');
console.log(`Dequeue: ${q.dequeue()} (expected 1 - FIFO)`);
console.log(`Dequeue: ${q.dequeue()} (expected 2)`);
console.log(`Dequeue: ${q.dequeue()} (expected 3)`);
console.log(`\n${q.display()}`);
console.log();

console.log('TEST 2: Interleaved operations');
console.log('-'.repeat(70));
const q2 = new MyQueue();

console.log('Enqueue 1, 2, 3');
q2.enqueue(1);
q2.enqueue(2);
q2.enqueue(3);
console.log(q2.display());

console.log(`\nDequeue: ${q2.dequeue()}`);
console.log(`Dequeue: ${q2.dequeue()}`);

console.log('\nEnqueue 4, 5');
q2.enqueue(4);
q2.enqueue(5);
console.log(q2.display());

console.log(`\nDequeue: ${q2.dequeue()} (expected 3)`);
console.log(`Dequeue: ${q2.dequeue()} (expected 4)`);
console.log(`Dequeue: ${q2.dequeue()} (expected 5)`);
console.log();

console.log('TEST 3: Peek operation');
console.log('-'.repeat(70));
const q3 = new MyQueue();
q3.enqueue('A');
q3.enqueue('B');
q3.enqueue('C');

console.log(`Peek: ${q3.peek()} (expected A)`);
console.log(`Peek: ${q3.peek()} (still A - peek doesn't remove)`);
console.log(`Dequeue: ${q3.dequeue()} (now removed)`);
console.log(`Peek: ${q3.peek()} (expected B)`);
console.log();

console.log('TEST 4: Edge cases');
console.log('-'.repeat(70));
const q4 = new MyQueue();

console.log(`isEmpty: ${q4.isEmpty()} ✓`);

try {
  q4.dequeue();
  console.log('ERROR: Should throw');
} catch (e) {
  console.log(`Correctly threw: ${e.message} ✓`);
}

q4.enqueue(1);
console.log(`\nEnqueued 1, isEmpty: ${q4.isEmpty()} (false)`);
q4.dequeue();
console.log(`Dequeued, isEmpty: ${q4.isEmpty()} (true) ✓`);
console.log();

console.log('TEST 5: How the stacks work internally');
console.log('-'.repeat(70));
const q5 = new MyQueue();

console.log('Enqueue 1, 2, 3:');
q5.enqueue(1);
q5.enqueue(2);
q5.enqueue(3);
console.log(`  stackNewest: [${q5.stackNewest}]`);
console.log(`  stackOldest: [${q5.stackOldest}]`);

console.log('\nFirst dequeue triggers shift:');
q5.dequeue();
console.log(`  stackNewest: [${q5.stackNewest}] (empty now)`);
console.log(`  stackOldest: [${q5.stackOldest}] (reversed order)`);

console.log('\nEnqueue 4, 5:');
q5.enqueue(4);
q5.enqueue(5);
console.log(`  stackNewest: [${q5.stackNewest}] (new elements)`);
console.log(`  stackOldest: [${q5.stackOldest}] (old elements)`);

console.log('\nDequeue again:');
q5.dequeue();
console.log(`  stackNewest: [${q5.stackNewest}] (unchanged)`);
console.log(`  stackOldest: [${q5.stackOldest}] (popped from here)`);
console.log();

console.log('='.repeat(70));
console.log('HOW IT WORKS / JAK TO DZIAŁA');
console.log('='.repeat(70));
console.log();
console.log('Example: enqueue 1,2,3 then dequeue');
console.log();
console.log('After enqueue(1,2,3):');
console.log('  stackNewest: [1, 2, 3] (top is 3)');
console.log('  stackOldest: []');
console.log();
console.log('On first dequeue():');
console.log('  1. stackOldest is empty, so shift from stackNewest');
console.log('  2. Pop from stackNewest and push to stackOldest:');
console.log('     - Pop 3, push to oldest -> [3]');
console.log('     - Pop 2, push to oldest -> [3, 2]');
console.log('     - Pop 1, push to oldest -> [3, 2, 1]');
console.log('  3. Now stackOldest: [3, 2, 1] (top is 1!)');
console.log('  4. Pop from stackOldest returns 1 ✓');
console.log();
console.log('Key: Reversing the stack gives us FIFO order!');
console.log('     Odwrócenie stosu daje nam kolejność FIFO!');
console.log();

console.log('='.repeat(70));
console.log('COMPLEXITY / ZŁOŻONOŚĆ');
console.log('='.repeat(70));
console.log('enqueue: O(1)');
console.log('dequeue: O(1) amortized / zamortyzowane');
console.log('         O(n) worst case (when shifting) / najgorszy (przy przesunięciu)');
console.log('peek:    O(1) amortized');
console.log();
console.log('Why amortized O(1)? / Dlaczego zamortyzowane O(1)?');
console.log('  Each element is moved at most twice:');
console.log('  1. Pushed to stackNewest');
console.log('  2. Moved to stackOldest (once)');
console.log('  So total O(2n) = O(n) for n operations = O(1) amortized per operation');
console.log('='.repeat(70));
