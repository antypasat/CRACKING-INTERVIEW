/**
 * Operations - tylko używając dodawania
 */

function negate(a) {
  let neg = 0;
  let d = a < 0 ? 1 : -1;
  while (a !== 0) {
    neg += d;
    a += d;
  }
  return neg;
}

function subtract(a, b) {
  return a + negate(b);
}

function multiply(a, b) {
  if (a === 0 || b === 0) return 0;

  let absA = a < 0 ? negate(a) : a;
  let absB = b < 0 ? negate(b) : b;
  let result = 0;

  for (let i = 0; i < absB; i++) {
    result += absA;
  }

  return (a < 0) !== (b < 0) ? negate(result) : result;
}

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");

  let absA = a < 0 ? negate(a) : a;
  let absB = b < 0 ? negate(b) : b;
  let quotient = 0;

  while (absA >= absB) {
    absA = subtract(absA, absB);
    quotient++;
  }

  return (a < 0) !== (b < 0) ? negate(quotient) : quotient;
}

console.log('=== Operations (tylko dodawanie) ===\n');

console.log('Negacja:');
console.log(`negate(5) = ${negate(5)}`);
console.log(`negate(-5) = ${negate(-5)}`);

console.log('\nOdejmowanie:');
console.log(`10 - 3 = ${subtract(10, 3)}`);
console.log(`3 - 10 = ${subtract(3, 10)}`);

console.log('\nMnożenie:');
console.log(`5 * 3 = ${multiply(5, 3)}`);
console.log(`5 * -3 = ${multiply(5, -3)}`);
console.log(`-5 * 3 = ${multiply(-5, 3)}`);

console.log('\nDzielenie:');
console.log(`10 / 3 = ${divide(10, 3)}`);
console.log(`15 / 3 = ${divide(15, 3)}`);
console.log(`-15 / 3 = ${divide(-15, 3)}`);
