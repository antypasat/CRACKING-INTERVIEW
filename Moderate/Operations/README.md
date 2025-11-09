# 16.9 Operations

## Opis Zadania / Problem Description

**Operations**: Write methods to implement the multiply, subtract, and divide operations for integers. The results of all of these are integers. Use only the add operator.

**Operacje**: Napisz metody implementujące mnożenie, odejmowanie i dzielenie dla liczb całkowitych. Wyniki wszystkich operacji są liczbami całkowitymi. Użyj tylko operatora dodawania.

Hints: #572, #600, #613, #648

## Rozwiązanie / Solution

### Odejmowanie: a - b
```javascript
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
```

### Mnożenie: a * b
```javascript
function multiply(a, b) {
  if (b === 0) return 0;
  let result = 0;
  let absB = b < 0 ? negate(b) : b;
  for (let i = 0; i < absB; i++) {
    result += a;
  }
  return b < 0 ? negate(result) : result;
}
```

### Dzielenie: a / b
```javascript
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
```
