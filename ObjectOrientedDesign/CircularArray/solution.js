// 7.9 CircularArray - Generic rotatable array with O(1) rotation
// 7.9 CircularArray - Generyczna obracalna tablica z rotacją O(1)

// Iterator for CircularArray / Iterator dla CircularArray
class CircularArrayIterator {
  constructor(circularArray) {
    this.array = circularArray;
    this.current = 0;
  }

  next() {
    if (this.current < this.array.size()) {
      return {
        value: this.array.get(this.current++),
        done: false
      };
    }
    return { done: true };
  }
}

// CircularArray - Array-like structure with efficient rotation
// CircularArray - Struktura podobna do tablicy z efektywną rotacją
class CircularArray {
  constructor(items = []) {
    // Store a copy of the items
    this.items = [...items];
    // Head points to the logical start of the array
    this.head = 0;
  }

  // Convert logical index to physical index
  // Konwertuj logiczny indeks na fizyczny indeks
  _convertIndex(index) {
    if (index < 0 || index >= this.items.length) {
      throw new Error(`Index ${index} out of bounds [0, ${this.items.length - 1}]`);
    }
    return (this.head + index) % this.items.length;
  }

  // Get element at logical index / Pobierz element na logicznym indeksie
  get(index) {
    return this.items[this._convertIndex(index)];
  }

  // Set element at logical index / Ustaw element na logicznym indeksie
  set(index, item) {
    this.items[this._convertIndex(index)] = item;
  }

  // Rotate the array by shiftRight positions (negative = left rotation)
  // Obróć tablicę o shiftRight pozycji (ujemna = rotacja w lewo)
  rotate(shiftRight) {
    if (this.items.length === 0) return;

    // Normalize shift to be within array bounds
    shiftRight = shiftRight % this.items.length;

    // Handle negative rotation (convert to equivalent positive rotation)
    if (shiftRight < 0) {
      shiftRight = this.items.length + shiftRight;
    }

    // Update head pointer - rotation is O(1)!
    // Right rotation means moving head left in physical array
    this.head = (this.head - shiftRight + this.items.length) % this.items.length;
  }

  // Get size of array / Pobierz rozmiar tablicy
  size() {
    return this.items.length;
  }

  // Iterator support for for...of loops / Wsparcie iteratora dla pętli for...of
  [Symbol.iterator]() {
    return new CircularArrayIterator(this);
  }

  // Convert to regular array (respecting rotation) / Konwertuj na zwykłą tablicę (respektując rotację)
  toArray() {
    const result = [];
    for (let i = 0; i < this.size(); i++) {
      result.push(this.get(i));
    }
    return result;
  }

  toString() {
    return '[' + this.toArray().join(', ') + ']';
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.9 CIRCULAR ARRAY');
console.log('='.repeat(70));
console.log();

console.log('Test 1: Basic Creation and Access');
console.log('-'.repeat(70));
const arr1 = new CircularArray([1, 2, 3, 4, 5]);
console.log(`Array: ${arr1}`);
console.log(`Size: ${arr1.size()}`);
console.log(`arr[0] = ${arr1.get(0)}`);
console.log(`arr[2] = ${arr1.get(2)}`);
console.log(`arr[4] = ${arr1.get(4)}`);
console.log();

console.log('Test 2: Right Rotation');
console.log('-'.repeat(70));
const arr2 = new CircularArray([1, 2, 3, 4, 5]);
console.log(`Original: ${arr2}`);
console.log('Rotating right by 2...');
arr2.rotate(2);
console.log(`After rotate(2): ${arr2}`);
console.log(`arr[0] = ${arr2.get(0)} (was at index 3)`);
console.log(`arr[1] = ${arr2.get(1)} (was at index 4)`);
console.log(`arr[4] = ${arr2.get(4)} (was at index 2)`);
console.log();

console.log('Test 3: Left Rotation (Negative)');
console.log('-'.repeat(70));
const arr3 = new CircularArray(['A', 'B', 'C', 'D', 'E']);
console.log(`Original: ${arr3}`);
console.log('Rotating left by 1 (rotate(-1))...');
arr3.rotate(-1);
console.log(`After rotate(-1): ${arr3}`);
console.log(`arr[0] = ${arr3.get(0)} (was 'B')`);
console.log(`arr[4] = ${arr3.get(4)} (was 'A')`);
console.log();

console.log('Test 4: Multiple Rotations');
console.log('-'.repeat(70));
const arr4 = new CircularArray([10, 20, 30, 40, 50]);
console.log(`Original: ${arr4}`);
arr4.rotate(1);
console.log(`After rotate(1): ${arr4}`);
arr4.rotate(2);
console.log(`After rotate(2): ${arr4}`);
arr4.rotate(-1);
console.log(`After rotate(-1): ${arr4}`);
console.log();

console.log('Test 5: Iterator and for...of Loop');
console.log('-'.repeat(70));
const arr5 = new CircularArray(['X', 'Y', 'Z']);
console.log(`Original: ${arr5}`);
console.log('Iterating with for...of:');
for (let item of arr5) {
  console.log(`  ${item}`);
}

console.log('\nAfter rotate(1):');
arr5.rotate(1);
console.log(`Rotated: ${arr5}`);
console.log('Iterating with for...of:');
for (let item of arr5) {
  console.log(`  ${item}`);
}
console.log();

console.log('Test 6: Spread Operator (Uses Iterator)');
console.log('-'.repeat(70));
const arr6 = new CircularArray([100, 200, 300]);
console.log(`Original: ${arr6}`);
console.log(`Spread: [${[...arr6]}]`);
arr6.rotate(1);
console.log(`After rotate(1): ${arr6}`);
console.log(`Spread: [${[...arr6]}]`);
console.log();

console.log('Test 7: Set Method');
console.log('-'.repeat(70));
const arr7 = new CircularArray([1, 2, 3, 4, 5]);
console.log(`Original: ${arr7}`);
arr7.set(2, 99);
console.log(`After set(2, 99): ${arr7}`);
arr7.rotate(2);
console.log(`After rotate(2): ${arr7}`);
arr7.set(0, 77);
console.log(`After set(0, 77): ${arr7}`);
console.log();

console.log('Test 8: Generic Types');
console.log('-'.repeat(70));
const strArr = new CircularArray(['apple', 'banana', 'cherry']);
console.log(`Strings: ${strArr}`);
strArr.rotate(1);
console.log(`After rotate(1): ${strArr}`);

const objArr = new CircularArray([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
]);
console.log('\nObjects:');
for (let obj of objArr) {
  console.log(`  ${obj.id}: ${obj.name}`);
}
objArr.rotate(1);
console.log('After rotate(1):');
for (let obj of objArr) {
  console.log(`  ${obj.id}: ${obj.name}`);
}
console.log();

console.log('Test 9: Large Rotation (Greater than Size)');
console.log('-'.repeat(70));
const arr9 = new CircularArray([1, 2, 3, 4, 5]);
console.log(`Original: ${arr9}`);
console.log('Rotating by 7 (equivalent to rotating by 2)...');
arr9.rotate(7);
console.log(`After rotate(7): ${arr9}`);
console.log();

console.log('Test 10: Edge Cases');
console.log('-'.repeat(70));

// Empty array
const emptyArr = new CircularArray([]);
console.log(`Empty array: ${emptyArr}`);
console.log(`Size: ${emptyArr.size()}`);
emptyArr.rotate(5); // Should not crash
console.log('After rotate(5): (no effect on empty array)');

// Single element
const singleArr = new CircularArray([42]);
console.log(`\nSingle element: ${singleArr}`);
singleArr.rotate(3);
console.log(`After rotate(3): ${singleArr}`);

// Two elements
const twoArr = new CircularArray(['A', 'B']);
console.log(`\nTwo elements: ${twoArr}`);
twoArr.rotate(1);
console.log(`After rotate(1): ${twoArr}`);
twoArr.rotate(1);
console.log(`After rotate(1): ${twoArr}`);
console.log();

console.log('Test 11: Performance - O(1) Rotation');
console.log('-'.repeat(70));
const largeArr = new CircularArray(Array.from({ length: 1000 }, (_, i) => i));
console.log(`Created array with 1000 elements`);
console.log(`First 5 elements: [${largeArr.get(0)}, ${largeArr.get(1)}, ${largeArr.get(2)}, ${largeArr.get(3)}, ${largeArr.get(4)}]`);

const start = Date.now();
for (let i = 0; i < 10000; i++) {
  largeArr.rotate(1);
}
const elapsed = Date.now() - start;

console.log(`Performed 10,000 rotations in ${elapsed}ms`);
console.log(`Average per rotation: ${(elapsed / 10000).toFixed(4)}ms`);
console.log('(Should be very fast - O(1) per rotation)');
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Encapsulation: Head pointer hidden, only expose get/set/rotate');
console.log('- Abstraction: Simple array interface despite rotation complexity');
console.log('- Iterator Pattern: Implements Symbol.iterator for for...of loops');
console.log('- Generic Programming: Works with any data type');
console.log('- Efficiency: O(1) rotation vs O(n) for naive implementation');
console.log('='.repeat(70));
