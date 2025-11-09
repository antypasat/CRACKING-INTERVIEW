/**
 * Number Swapper - Podejście XOR / XOR Approach
 *
 * Zamiana dwóch liczb bez zmiennej tymczasowej używając operacji XOR.
 * Swap two numbers without a temporary variable using XOR operation.
 *
 * Właściwości XOR / XOR Properties:
 * - a ^ a = 0 (każda liczba XOR sama ze sobą daje 0)
 * - a ^ 0 = a (każda liczba XOR 0 daje tę liczbę)
 * - a ^ b ^ b = a (XOR jest odwracalny)
 * - XOR jest przemienny: a ^ b = b ^ a
 * - XOR jest łączny: (a ^ b) ^ c = a ^ (b ^ c)
 */

function swapXOR(a, b) {
  console.log(`Przed zamianą / Before swap: a = ${a}, b = ${b}`);
  console.log(`  W formacie binarnym / In binary: a = ${a.toString(2)}, b = ${b.toString(2)}`);

  // Krok 1: a = a XOR b
  // Step 1: a = a XOR b
  a = a ^ b;
  console.log(`  Po a = a ^ b: a = ${a} (${a.toString(2)}), b = ${b}`);

  // Krok 2: b = (a XOR b) XOR b = a (oryginalne)
  // Step 2: b = (a XOR b) XOR b = a (original)
  b = a ^ b;
  console.log(`  Po b = a ^ b: a = ${a}, b = ${b} (${b.toString(2)})`);

  // Krok 3: a = (a XOR b) XOR a (oryginalne) = b (oryginalne)
  // Step 3: a = (a XOR b) XOR a (original) = b (original)
  a = a ^ b;
  console.log(`  Po a = a ^ b: a = ${a} (${a.toString(2)}), b = ${b}`);

  console.log(`Po zamianie / After swap: a = ${a}, b = ${b}\n`);

  return [a, b];
}

// Pomocnicza funkcja pokazująca krok po kroku działanie XOR
// Helper function showing step-by-step XOR operation
function explainXOR(a, b) {
  console.log(`\n=== Wyjaśnienie XOR dla a=${a}, b=${b} ===`);
  console.log(`Binary: a = ${a.toString(2).padStart(8, '0')}, b = ${b.toString(2).padStart(8, '0')}`);

  const step1 = a ^ b;
  console.log(`\nKrok 1: a = a ^ b`);
  console.log(`  ${a.toString(2).padStart(8, '0')} (a = ${a})`);
  console.log(`^ ${b.toString(2).padStart(8, '0')} (b = ${b})`);
  console.log(`= ${step1.toString(2).padStart(8, '0')} (a = ${step1})`);

  const step2 = step1 ^ b;
  console.log(`\nKrok 2: b = a ^ b = (a^b) ^ b`);
  console.log(`  ${step1.toString(2).padStart(8, '0')} (a = ${step1})`);
  console.log(`^ ${b.toString(2).padStart(8, '0')} (b = ${b})`);
  console.log(`= ${step2.toString(2).padStart(8, '0')} (b = ${step2}) <- to jest oryginalne a!`);

  const step3 = step1 ^ step2;
  console.log(`\nKrok 3: a = a ^ b = (a^b) ^ a`);
  console.log(`  ${step1.toString(2).padStart(8, '0')} (a = ${step1})`);
  console.log(`^ ${step2.toString(2).padStart(8, '0')} (b = ${step2})`);
  console.log(`= ${step3.toString(2).padStart(8, '0')} (a = ${step3}) <- to jest oryginalne b!`);
  console.log(`\nWynik / Result: a = ${step3}, b = ${step2}\n`);
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Podejście XOR / XOR Approach ===\n');

// Test 1: Liczby dodatnie / Positive numbers
console.log('Test 1: Liczby dodatnie / Positive numbers');
swapXOR(10, 20);

// Szczegółowe wyjaśnienie dla pierwszego testu
// Detailed explanation for first test
explainXOR(10, 20);

// Test 2: Liczby ujemne / Negative numbers
console.log('Test 2: Liczby ujemne / Negative numbers');
swapXOR(-5, 15);

// Test 3: Obie liczby ujemne / Both negative
console.log('Test 3: Obie liczby ujemne / Both negative');
swapXOR(-10, -20);

// Test 4: Jedna liczba to zero / One number is zero
console.log('Test 4: Jedna liczba to zero / One number is zero');
swapXOR(0, 42);

// Test 5: Obie liczby to zero / Both numbers are zero
console.log('Test 5: Obie liczby to zero / Both numbers are zero');
swapXOR(0, 0);

// Test 6: Liczby równe / Equal numbers
console.log('Test 6: Liczby równe / Equal numbers');
swapXOR(7, 7);

// Test 7: Małe liczby / Small numbers
console.log('Test 7: Małe liczby / Small numbers');
swapXOR(1, 2);
explainXOR(1, 2);

// Test 8: Potęgi dwójki / Powers of two
console.log('Test 8: Potęgi dwójki / Powers of two');
swapXOR(16, 32);
explainXOR(16, 32);

// Test 9: Bardzo duże liczby całkowite
console.log('Test 9: Bardzo duże liczby całkowite / Very large integers');
swapXOR(2147483647, 1073741824); // Max 32-bit signed int

// Edge Cases
console.log('\n=== Edge Cases ===\n');

console.log('Uwaga: XOR działa tylko dla liczb całkowitych!');
console.log('Note: XOR only works for integers!');
console.log('Liczby zmiennoprzecinkowe są konwertowane do int32:');
console.log('Floating point numbers are converted to int32:');

// XOR konwertuje do 32-bit integer, więc 3.14 staje się 3
console.log(`3.14 ^ 2.71 = ${3.14 ^ 2.71} (not what we want for floats!)`);
