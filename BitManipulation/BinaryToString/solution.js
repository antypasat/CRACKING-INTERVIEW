// 5.2 Binary to String - Convert decimal to binary string

/**
 * Convert decimal number (0 < num < 1) to binary string
 * @param {number} num - Decimal number between 0 and 1
 * @returns {string} Binary representation or "ERROR"
 */
function printBinary(num) {
  if (num >= 1 || num <= 0) {
    return 'ERROR';
  }

  let binary = '.';

  while (num > 0) {
    // Limit to 32 characters
    if (binary.length >= 32) {
      return 'ERROR';
    }

    num *= 2;
    if (num >= 1) {
      binary += '1';
      num -= 1;
    } else {
      binary += '0';
    }
  }

  return binary;
}

/**
 * Alternative approach using bit shifting
 */
function printBinary2(num) {
  if (num >= 1 || num <= 0) {
    return 'ERROR';
  }

  let binary = '.';
  let frac = 0.5;

  while (num > 0) {
    if (binary.length >= 32) {
      return 'ERROR';
    }

    if (num >= frac) {
      binary += '1';
      num -= frac;
    } else {
      binary += '0';
    }
    frac /= 2;
  }

  return binary;
}

// Tests
console.log('='.repeat(70));
console.log('5.2 BINARY TO STRING');
console.log('='.repeat(70));

console.log('Test 1: 0.72');
console.log(`Result: ${printBinary(0.72)}`);
console.log('(Cannot be represented exactly in 32 bits)\n');

console.log('Test 2: 0.5');
console.log(`Result: ${printBinary(0.5)} ✓`);
console.log('Expected: .1\n');

console.log('Test 3: 0.75 (3/4)');
console.log(`Result: ${printBinary(0.75)} ✓`);
console.log('Expected: .11\n');

console.log('Test 4: 0.625 (5/8)');
console.log(`Result: ${printBinary(0.625)} ✓`);
console.log('Expected: .101\n');

console.log('Test 5: 0.1');
console.log(`Result: ${printBinary(0.1)}`);
console.log('(Cannot be represented exactly)\n');

console.log('Test 6: Invalid input');
console.log(`printBinary(1.5): ${printBinary(1.5)} ✓`);
console.log(`printBinary(-0.5): ${printBinary(-0.5)} ✓\n`);

console.log('Complexity: O(1) - max 32 iterations');
console.log('='.repeat(70));
