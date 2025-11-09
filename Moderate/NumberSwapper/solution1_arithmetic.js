/**
 * Number Swapper - Podejście Arytmetyczne / Arithmetic Approach
 *
 * Zamiana dwóch liczb bez zmiennej tymczasowej używając dodawania i odejmowania.
 * Swap two numbers without a temporary variable using addition and subtraction.
 */

function swapArithmetic(a, b) {
  console.log(`Przed zamianą / Before swap: a = ${a}, b = ${b}`);

  // Krok 1: Zapisz sumę w 'a'
  // Step 1: Store sum in 'a'
  a = a + b;
  console.log(`  Po a = a + b: a = ${a}, b = ${b}`);

  // Krok 2: Odejmij 'b' od sumy, aby uzyskać oryginalne 'a', zapisz w 'b'
  // Step 2: Subtract 'b' from sum to get original 'a', store in 'b'
  b = a - b;
  console.log(`  Po b = a - b: a = ${a}, b = ${b}`);

  // Krok 3: Odejmij nowe 'b' (które jest oryginalnym 'a') od sumy, aby uzyskać oryginalne 'b'
  // Step 3: Subtract new 'b' (which is original 'a') from sum to get original 'b'
  a = a - b;
  console.log(`  Po a = a - b: a = ${a}, b = ${b}`);

  console.log(`Po zamianie / After swap: a = ${a}, b = ${b}\n`);

  return [a, b];
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Podejście Arytmetyczne / Arithmetic Approach ===\n');

// Test 1: Liczby dodatnie / Positive numbers
console.log('Test 1: Liczby dodatnie / Positive numbers');
swapArithmetic(10, 20);

// Test 2: Liczby ujemne / Negative numbers
console.log('Test 2: Liczby ujemne / Negative numbers');
swapArithmetic(-5, 15);

// Test 3: Obie liczby ujemne / Both negative
console.log('Test 3: Obie liczby ujemne / Both negative');
swapArithmetic(-10, -20);

// Test 4: Jedna liczba to zero / One number is zero
console.log('Test 4: Jedna liczba to zero / One number is zero');
swapArithmetic(0, 42);

// Test 5: Obie liczby to zero / Both numbers are zero
console.log('Test 5: Obie liczby to zero / Both numbers are zero');
swapArithmetic(0, 0);

// Test 6: Liczby równe / Equal numbers
console.log('Test 6: Liczby równe / Equal numbers');
swapArithmetic(7, 7);

// Test 7: Duże liczby / Large numbers
console.log('Test 7: Duże liczby / Large numbers');
swapArithmetic(1000000, 2000000);

// Test 8: Liczby zmiennoprzecinkowe / Floating point numbers
console.log('Test 8: Liczby zmiennoprzecinkowe / Floating point numbers');
swapArithmetic(3.14, 2.71);

// Test 9: Bardzo duże liczby (test overflow)
console.log('Test 9: Bardzo duże liczby - test overflow');
swapArithmetic(Number.MAX_SAFE_INTEGER - 10, 100);

// Edge case: Potencjalny overflow
console.log('Edge Case: Potencjalny overflow z dużymi liczbami');
console.log('Uwaga: W JavaScript liczby są 64-bitowe float, więc overflow jest rzadki');
console.log('Note: In JavaScript numbers are 64-bit floats, so overflow is rare');
const largeA = Number.MAX_SAFE_INTEGER;
const largeB = 1000;
console.log(`Przed: a = ${largeA}, b = ${largeB}`);
// Ten przypadek może nie działać poprawnie z powodu overflow
// This case may not work correctly due to overflow
