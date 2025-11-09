/**
 * Number Swapper - Podejście Destructuring (ES6+)
 *
 * Zamiana dwóch liczb używając destrukturyzacji tablicy ES6.
 * Swap two numbers using ES6 array destructuring.
 *
 * UWAGA: To technicznie używa tymczasowej tablicy "pod spodem",
 * więc nie jest to prawdziwa zamiana "in-place" bez dodatkowej pamięci.
 * Jednak składnia jest bardzo elegancka i czytelna.
 *
 * NOTE: This technically uses a temporary array "under the hood",
 * so it's not a true "in-place" swap without extra memory.
 * However, the syntax is very elegant and readable.
 */

function swapDestructuring(a, b) {
  console.log(`Przed zamianą / Before swap: a = ${a}, b = ${b}`);

  // Destrukturyzacja pozwala na zamianę w jednej linii
  // Destructuring allows swapping in one line
  [a, b] = [b, a];

  console.log(`Po zamianie / After swap: a = ${a}, b = ${b}\n`);

  return [a, b];
}

// Wariant z użyciem w tablicy
// Variant using within an array
function swapInArray(arr, i, j) {
  console.log(`Przed zamianą / Before swap: arr[${i}] = ${arr[i]}, arr[${j}] = ${arr[j]}`);

  [arr[i], arr[j]] = [arr[j], arr[i]];

  console.log(`Po zamianie / After swap: arr[${i}] = ${arr[i]}, arr[${j}] = ${arr[j]}`);
  console.log(`Cała tablica / Whole array: [${arr}]\n`);

  return arr;
}

// Wariant z użyciem w obiekcie
// Variant using with object properties
function swapObjectProperties(obj) {
  console.log(`Przed zamianą / Before swap: obj.a = ${obj.a}, obj.b = ${obj.b}`);

  [obj.a, obj.b] = [obj.b, obj.a];

  console.log(`Po zamianie / After swap: obj.a = ${obj.a}, obj.b = ${obj.b}\n`);

  return obj;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Podejście Destructuring (ES6+) ===\n');

// Test 1: Podstawowa zamiana / Basic swap
console.log('Test 1: Podstawowa zamiana / Basic swap');
swapDestructuring(10, 20);

// Test 2: Liczby ujemne / Negative numbers
console.log('Test 2: Liczby ujemne / Negative numbers');
swapDestructuring(-5, 15);

// Test 3: Liczby zmiennoprzecinkowe / Floating point
console.log('Test 3: Liczby zmiennoprzecinkowe / Floating point');
swapDestructuring(3.14, 2.71);

// Test 4: Zero
console.log('Test 4: Zero');
swapDestructuring(0, 42);

// Test 5: Liczby równe / Equal numbers
console.log('Test 5: Liczby równe / Equal numbers');
swapDestructuring(7, 7);

// Test 6: Zamiana stringów / Swapping strings
console.log('Test 6: Zamiana stringów (działa też dla innych typów!)');
console.log('Swapping strings (works for other types too!)');
let str1 = "Hello";
let str2 = "World";
console.log(`Przed: str1 = "${str1}", str2 = "${str2}"`);
[str1, str2] = [str2, str1];
console.log(`Po: str1 = "${str1}", str2 = "${str2}"\n`);

// Test 7: Zamiana w tablicy / Swapping in array
console.log('Test 7: Zamiana elementów w tablicy / Swapping elements in array');
const numbers = [1, 2, 3, 4, 5];
console.log(`Oryginalna tablica / Original array: [${numbers}]`);
swapInArray(numbers, 0, 4);
swapInArray(numbers, 1, 3);

// Test 8: Zamiana właściwości obiektu / Swapping object properties
console.log('Test 8: Zamiana właściwości obiektu / Swapping object properties');
const point = { a: 10, b: 20 };
swapObjectProperties(point);

// Test 9: Zamiana wielu wartości naraz / Swapping multiple values at once
console.log('Test 9: Zamiana wielu wartości naraz (rotacja)');
console.log('Swapping multiple values at once (rotation)');
let x = 1, y = 2, z = 3;
console.log(`Przed: x = ${x}, y = ${y}, z = ${z}`);
[x, y, z] = [z, x, y]; // Rotacja w prawo / Rotate right
console.log(`Po rotacji w prawo: x = ${x}, y = ${y}, z = ${z}\n`);

// Test 10: Duże liczby / Large numbers
console.log('Test 10: Duże liczby / Large numbers');
swapDestructuring(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

// ============================================
// Porównanie wydajności / Performance comparison
// ============================================

console.log('\n=== Porównanie Wydajności / Performance Comparison ===\n');

function swapTemp(a, b) {
  let temp = a;
  a = b;
  b = temp;
  return [a, b];
}

function swapArithmetic(a, b) {
  a = a + b;
  b = a - b;
  a = a - b;
  return [a, b];
}

function swapXOR(a, b) {
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;
  return [a, b];
}

function benchmark(fn, name, iterations = 1000000) {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    fn(i, i + 1);
  }
  const end = Date.now();
  console.log(`${name}: ${end - start}ms dla ${iterations} iteracji`);
}

console.log('Test wydajności dla 1,000,000 operacji:');
benchmark(swapTemp, 'Temp Variable   ', 1000000);
benchmark(swapDestructuring, 'Destructuring   ', 1000000);
benchmark(swapArithmetic, 'Arithmetic      ', 1000000);
benchmark(swapXOR, 'XOR             ', 1000000);

console.log('\nWniosek / Conclusion:');
console.log('Destructuring jest najczytelniejsze, ale może być wolniejsze.');
console.log('XOR jest zazwyczaj najszybsze dla liczb całkowitych.');
console.log('Destructuring is most readable, but may be slower.');
console.log('XOR is typically fastest for integers.');
