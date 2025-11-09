// 5.4 Next Number - Next smallest and largest with same # of 1 bits

/**
 * Get next largest number with same number of 1 bits
 */
function getNext(n) {
  let c = n;
  let c0 = 0; // Count of trailing 0s
  let c1 = 0; // Count of 1s to the right of rightmost non-trailing 0

  // Count trailing 0s
  while (((c & 1) === 0) && (c !== 0)) {
    c0++;
    c >>= 1;
  }

  // Count 1s after trailing 0s
  while ((c & 1) === 1) {
    c1++;
    c >>= 1;
  }

  // Position of rightmost non-trailing 0
  const p = c0 + c1;

  // Error: if p is 31, no bigger number with same # of 1s
  if (p === 31 || p === 0) return -1;

  // Flip rightmost non-trailing 0
  n |= (1 << p);

  // Clear all bits to right of p
  n &= ~((1 << p) - 1);

  // Insert (c1-1) ones on the right
  n |= (1 << (c1 - 1)) - 1;

  return n;
}

/**
 * Get next smallest number with same number of 1 bits
 */
function getPrev(n) {
  let temp = n;
  let c0 = 0; // Count of trailing 1s
  let c1 = 0; // Count of 0s to the right of rightmost non-trailing 1

  // Count trailing 1s
  while ((temp & 1) === 1) {
    c1++;
    temp >>= 1;
  }

  // If all 1s, no smaller number
  if (temp === 0) return -1;

  // Count 0s after trailing 1s
  while (((temp & 1) === 0) && (temp !== 0)) {
    c0++;
    temp >>= 1;
  }

  const p = c0 + c1; // Position of rightmost non-trailing 1

  // Clear from bit p onwards
  n &= ((~0) << (p + 1));

  // Sequence of (c1+1) ones
  const mask = (1 << (c1 + 1)) - 1;
  n |= mask << (c0 - 1);

  return n;
}

// Tests
console.log('='.repeat(70));
console.log('5.4 NEXT NUMBER');
console.log('='.repeat(70));

const toBinary = (n) => n.toString(2).padStart(8, '0');
const countOnes = (n) => n.toString(2).split('1').length - 1;

console.log('Test 1: n = 13948 (binary: 11011001111100)');
const n1 = 13948;
console.log(`Binary: ${n1.toString(2)}`);
console.log(`Number of 1s: ${countOnes(n1)}\n`);

const next1 = getNext(n1);
const prev1 = getPrev(n1);

console.log(`Next:     ${next1} (${next1.toString(2)})`);
console.log(`Number of 1s: ${countOnes(next1)} ✓`);

console.log(`\nPrevious: ${prev1} (${prev1.toString(2)})`);
console.log(`Number of 1s: ${countOnes(prev1)} ✓\n`);

console.log('Test 2: n = 10 (binary: 1010)');
const n2 = 10;
console.log(`Binary: ${toBinary(n2)}`);
const next2 = getNext(n2);
const prev2 = getPrev(n2);
console.log(`Next: ${next2} (${toBinary(next2)}), ones: ${countOnes(next2)} ✓`);
console.log(`Prev: ${prev2} (${toBinary(prev2)}), ones: ${countOnes(prev2)} ✓\n`);

console.log('Test 3: Edge cases');
console.log(`getNext(7): ${getNext(7)} (binary: 111 -> 1011) ✓`);
console.log(`getPrev(7): ${getPrev(7)} (no smaller with 3 ones) ✓\n`);

console.log('Complexity: O(1) - constant number of bit operations');
console.log('='.repeat(70));
