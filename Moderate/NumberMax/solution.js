/**
 * Number Max - bez if-else / without if-else
 */

function max(a, b) {
  const diff = a - b;
  // Przesunięcie arytmetyczne w prawo - kopiuje bit znaku
  const sign = (diff >> 31) & 1; // 1 jeśli diff < 0, 0 jeśli diff >= 0
  return a * (1 - sign) + b * sign;
}

function min(a, b) {
  const diff = a - b;
  const sign = (diff >> 31) & 1;
  return a * sign + b * (1 - sign);
}

console.log('=== Number Max (bez if-else) ===\n');

// Testy
console.log(`max(5, 10) = ${max(5, 10)} (oczekiwane: 10)`);
console.log(`max(10, 5) = ${max(10, 5)} (oczekiwane: 10)`);
console.log(`max(-5, 10) = ${max(-5, 10)} (oczekiwane: 10)`);
console.log(`max(-10, -5) = ${max(-10, -5)} (oczekiwane: -5)`);
console.log(`max(0, 0) = ${max(0, 0)} (oczekiwane: 0)`);

console.log(`\nmin(5, 10) = ${min(5, 10)} (oczekiwane: 5)`);
console.log(`min(-10, -5) = ${min(-10, -5)} (oczekiwane: -10)`);
