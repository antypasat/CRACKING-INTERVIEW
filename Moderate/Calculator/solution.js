/**
 * Calculator - Arithmetic Expression Evaluator
 * Kalkulator - Ewaluator Wyrażeń Arytmetycznych
 */

/**
 * Podejście 1: Parsowanie i Ewaluacja w Dwóch Przejściach - O(n)
 * Approach 1: Parse and Evaluate in Two Passes - O(n)
 *
 * Najpierw sparsuj, potem wykonaj * / a nastepnie + -
 * First parse, then execute * / then + -
 */
function calculateTwoPass(expression) {
  // Usuń spacje
  expression = expression.replace(/\s/g, '');

  // Krok 1: Parsuj na liczby i operatory
  const { numbers, operators } = parse(expression);

  // Krok 2: Wykonaj */ (wysokie priorytety)
  let i = 0;
  while (i < operators.length) {
    if (operators[i] === '*' || operators[i] === '/') {
      const result = operators[i] === '*'
        ? numbers[i] * numbers[i + 1]
        : numbers[i] / numbers[i + 1];

      // Zastąp dwie liczby wynikiem
      numbers.splice(i, 2, result);
      operators.splice(i, 1);
    } else {
      i++;
    }
  }

  // Krok 3: Wykonaj +- (niskie priorytety)
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '+') {
      result += numbers[i + 1];
    } else {
      result -= numbers[i + 1];
    }
  }

  return result;
}

function parse(expression) {
  const numbers = [];
  const operators = [];
  let currentNumber = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if ((char >= '0' && char <= '9') || char === '.') {
      currentNumber += char;
    } else if (char === '+' || char === '-' || char === '*' || char === '/') {
      numbers.push(parseFloat(currentNumber));
      operators.push(char);
      currentNumber = '';
    }
  }

  // Dodaj ostatnią liczbę
  if (currentNumber) {
    numbers.push(parseFloat(currentNumber));
  }

  return { numbers, operators };
}

/**
 * Podejście 2: Stack-based (Jedno Przejście) - O(n) ✓ OPTYMALNE
 * Approach 2: Stack-based (Single Pass) - O(n) ✓ OPTIMAL
 *
 * Używaj stacka do obsługi priorytetów
 * Use stack to handle priorities
 */
function calculate(expression) {
  // Usuń spacje
  expression = expression.replace(/\s/g, '');

  const stack = [];
  let num = 0;
  let operation = '+'; // Początkowa operacja

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    // Buduj liczbę (obsługuje wielocyfrowe liczby)
    if (char >= '0' && char <= '9') {
      num = num * 10 + parseInt(char);
    }

    // Gdy napotkamy operator lub koniec
    if ((char < '0' || char > '9') || i === expression.length - 1) {
      if (operation === '+') {
        stack.push(num);
      } else if (operation === '-') {
        stack.push(-num);
      } else if (operation === '*') {
        stack.push(stack.pop() * num);
      } else if (operation === '/') {
        stack.push(stack.pop() / num);
      }

      operation = char;
      num = 0;
    }
  }

  // Suma wszystkich liczb na stacku
  return stack.reduce((sum, n) => sum + n, 0);
}

/**
 * Podejście 3: Bez Stacka (O(1) pamięć) - O(n)
 * Approach 3: Without Stack (O(1) space) - O(n)
 *
 * Śledź poprzednią liczbę zamiast używać stacka
 * Track previous number instead of using stack
 */
function calculateNoStack(expression) {
  expression = expression.replace(/\s/g, '');

  let result = 0;
  let currentNum = 0;
  let lastNum = 0;
  let operation = '+';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char >= '0' && char <= '9') {
      currentNum = currentNum * 10 + parseInt(char);
    }

    if ((char < '0' || char > '9') || i === expression.length - 1) {
      if (operation === '+' || operation === '-') {
        result += lastNum;
        lastNum = operation === '+' ? currentNum : -currentNum;
      } else if (operation === '*') {
        lastNum = lastNum * currentNum;
      } else if (operation === '/') {
        lastNum = lastNum / currentNum;
      }

      operation = char;
      currentNum = 0;
    }
  }

  return result + lastNum;
}

/**
 * Podejście 4: RPN (Reverse Polish Notation) - Shunting Yard Algorithm - O(n)
 * Approach 4: RPN (Reverse Polish Notation) - Shunting Yard Algorithm - O(n)
 *
 * Przekształć do RPN, potem ewaluuj
 * Convert to RPN, then evaluate
 */
function calculateRPN(expression) {
  expression = expression.replace(/\s/g, '');

  // Krok 1: Konwertuj do RPN
  const rpn = toRPN(expression);

  // Krok 2: Ewaluuj RPN
  return evaluateRPN(rpn);
}

function toRPN(expression) {
  const output = [];
  const operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  let num = '';

  for (let char of expression) {
    if ((char >= '0' && char <= '9') || char === '.') {
      num += char;
    } else if (char in precedence) {
      if (num) {
        output.push(parseFloat(num));
        num = '';
      }

      // Pop operators z wyższym lub równym priorytetem
      while (operators.length > 0 &&
             precedence[operators[operators.length - 1]] >= precedence[char]) {
        output.push(operators.pop());
      }

      operators.push(char);
    }
  }

  // Dodaj ostatnią liczbę
  if (num) output.push(parseFloat(num));

  // Pop pozostałe operatory
  while (operators.length > 0) {
    output.push(operators.pop());
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];

  for (let token of rpn) {
    if (typeof token === 'number') {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();

      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
      }
    }
  }

  return stack[0];
}

/**
 * Funkcja pomocnicza: Wizualizacja stack-based evaluation
 * Helper function: Visualize stack-based evaluation
 */
function calculateVerbose(expression) {
  console.log(`\nEwaluacja: "${expression}"`);
  expression = expression.replace(/\s/g, '');

  const stack = [];
  let num = 0;
  let operation = '+';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char >= '0' && char <= '9') {
      num = num * 10 + parseInt(char);
    }

    if ((char < '0' || char > '9') || i === expression.length - 1) {
      console.log(`i=${i}, char='${char}', num=${num}, operation='${operation}'`);

      if (operation === '+') {
        console.log(`  Push ${num} → stack=[${[...stack, num]}]`);
        stack.push(num);
      } else if (operation === '-') {
        console.log(`  Push -${num} → stack=[${[...stack, -num]}]`);
        stack.push(-num);
      } else if (operation === '*') {
        const prev = stack.pop();
        const result = prev * num;
        console.log(`  Pop ${prev}, push ${prev}*${num}=${result} → stack=[${[...stack, result]}]`);
        stack.push(result);
      } else if (operation === '/') {
        const prev = stack.pop();
        const result = prev / num;
        console.log(`  Pop ${prev}, push ${prev}/${num}=${result} → stack=[${[...stack, result]}]`);
        stack.push(result);
      }

      operation = char;
      num = 0;
    }
  }

  const result = stack.reduce((sum, n) => sum + n, 0);
  console.log(`\nFinal sum: ${stack.join(' + ')} = ${result}`);
  return result;
}

/**
 * Funkcja pomocnicza: Test poprawności
 * Helper function: Test correctness
 */
function testExpression(expression, expected) {
  const result = calculate(expression);
  const correct = Math.abs(result - expected) < 0.0001; // Float comparison
  console.log(`"${expression}" = ${result} ${correct ? '✓' : '✗ (expected: ' + expected + ')'}`);
  return correct;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Calculator - Arithmetic Expression Evaluator ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania');
const result1 = calculate('2*3+5/6*3+15');
console.log(`"2*3+5/6*3+15" = ${result1}`);
console.log(`Oczekiwane: 23.5`);
console.log(`Test ${Math.abs(result1 - 23.5) < 0.0001 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: Wizualizacja krok po kroku
console.log('Test 2: Wizualizacja krok po kroku');
calculateVerbose('2*3+5/6*3+15');

// Test 3: Podstawowe operacje
console.log('\nTest 3: Podstawowe operacje');
const basicTests = [
  { expr: '1+2', expected: 3 },
  { expr: '5-3', expected: 2 },
  { expr: '4*5', expected: 20 },
  { expr: '10/2', expected: 5 },
  { expr: '7/2', expected: 3.5 }
];

basicTests.forEach(({ expr, expected }) => {
  testExpression(expr, expected);
});
console.log();

// Test 4: Priorytet operatorów
console.log('Test 4: Priorytet operatorów (PEMDAS)');
const priorityTests = [
  { expr: '2+3*4', expected: 14 },      // nie 20
  { expr: '2*3+4', expected: 10 },      // nie 14
  { expr: '10-2*3', expected: 4 },      // nie 24
  { expr: '2+6/3', expected: 4 },       // nie 2.67
  { expr: '6/3+2', expected: 4 },       // nie 1
  { expr: '2*3*4', expected: 24 },
  { expr: '24/2/3', expected: 4 },      // od lewej do prawej
  { expr: '6/2*3', expected: 9 }        // od lewej do prawej, nie 1
];

priorityTests.forEach(({ expr, expected }) => {
  testExpression(expr, expected);
});
console.log();

// Test 5: Dłuższe wyrażenia
console.log('Test 5: Dłuższe wyrażenia');
const longTests = [
  { expr: '1+2+3+4+5', expected: 15 },
  { expr: '10-1-2-3', expected: 4 },
  { expr: '2*3*4*5', expected: 120 },
  { expr: '100/2/5/2', expected: 5 },
  { expr: '1+2*3+4*5+6', expected: 33 },
  { expr: '10*2+5*3-4/2', expected: 33 }
];

longTests.forEach(({ expr, expected }) => {
  testExpression(expr, expected);
});
console.log();

// Test 6: Edge cases
console.log('Test 6: Edge cases');

console.log('a) Pojedyncza liczba:');
testExpression('42', 42);

console.log('\nb) Liczby zmiennoprzecinkowe:');
testExpression('5/2', 2.5);
testExpression('10/3', 3.333333);

console.log('\nc) Zero:');
testExpression('0+5', 5);
testExpression('5*0', 0);
testExpression('0/5', 0);

console.log('\nd) Dzielenie przez zero:');
const divZero = calculate('5/0');
console.log(`5/0 = ${divZero} (Infinity)`);

console.log('\ne) Ujemny wynik:');
testExpression('3-10', -7);
testExpression('2*3-10', -4);

console.log('\nf) Spacje w wyrażeniu:');
testExpression('2 + 3 * 4', 14);
testExpression('10 / 2 + 3', 8);
console.log();

// Test 7: Porównanie wszystkich metod
console.log('Test 7: Porównanie wszystkich metod');
const testExpr = '2*3+5/6*3+15';

const r1 = calculateTwoPass(testExpr);
const r2 = calculate(testExpr);
const r3 = calculateNoStack(testExpr);
const r4 = calculateRPN(testExpr);

console.log(`Wyrażenie: "${testExpr}"`);
console.log(`Two Pass:   ${r1}`);
console.log(`Stack:      ${r2}`);
console.log(`No Stack:   ${r3}`);
console.log(`RPN:        ${r4}`);
console.log(`Wszystkie zgodne: ${
  Math.abs(r1 - r2) < 0.0001 && Math.abs(r2 - r3) < 0.0001 && Math.abs(r3 - r4) < 0.0001 ? '✓' : '✗'
}\n`);

// Test 8: Test RPN conversion
console.log('Test 8: Konwersja do RPN (Reverse Polish Notation)');
const testExpressions = [
  '2+3',
  '2*3+4',
  '2+3*4',
  '2*3+5/6*3+15'
];

testExpressions.forEach(expr => {
  const rpn = toRPN(expr);
  const result = evaluateRPN(rpn);
  console.log(`"${expr}"`);
  console.log(`  RPN: ${rpn.join(' ')}`);
  console.log(`  Result: ${result}\n`);
});

// Test 9: Weryfikacja poprawności wszystkich metod
console.log('Test 9: Weryfikacja poprawności wszystkich metod');
const verificationTests = [
  { expr: '1+2', expected: 3 },
  { expr: '2*3+4', expected: 10 },
  { expr: '2+3*4', expected: 14 },
  { expr: '10-2*3', expected: 4 },
  { expr: '6/2*3', expected: 9 },
  { expr: '2*3+5/6*3+15', expected: 23.5 },
  { expr: '100/2/5', expected: 10 },
  { expr: '1+2+3+4+5', expected: 15 }
];

let allCorrect = true;
verificationTests.forEach(({ expr, expected }) => {
  const r1 = calculateTwoPass(expr);
  const r2 = calculate(expr);
  const r3 = calculateNoStack(expr);
  const r4 = calculateRPN(expr);

  const correct = Math.abs(r1 - expected) < 0.0001 &&
                  Math.abs(r2 - expected) < 0.0001 &&
                  Math.abs(r3 - expected) < 0.0001 &&
                  Math.abs(r4 - expected) < 0.0001;

  allCorrect = allCorrect && correct;

  console.log(`  "${expr}" = ${expected} ${correct ? '✓' : '✗'}`);
  if (!correct) {
    console.log(`    TwoPass=${r1}, Stack=${r2}, NoStack=${r3}, RPN=${r4}`);
  }
});

console.log(`\nWszystkie testy: ${allCorrect ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 10: Test wydajności
console.log('Test 10: Test wydajności (10,000 ewaluacji)');

const perfExpr = '2*3+5/6*3+15-10/2+8*9-7+6/3';
const iterations = 10000;

let start = Date.now();
for (let i = 0; i < iterations; i++) {
  calculateTwoPass(perfExpr);
}
const timeTwoPass = Date.now() - start;

start = Date.now();
for (let i = 0; i < iterations; i++) {
  calculate(perfExpr);
}
const timeStack = Date.now() - start;

start = Date.now();
for (let i = 0; i < iterations; i++) {
  calculateNoStack(perfExpr);
}
const timeNoStack = Date.now() - start;

start = Date.now();
for (let i = 0; i < iterations; i++) {
  calculateRPN(perfExpr);
}
const timeRPN = Date.now() - start;

console.log(`Two Pass:  ${timeTwoPass}ms`);
console.log(`Stack:     ${timeStack}ms`);
console.log(`No Stack:  ${timeNoStack}ms`);
console.log(`RPN:       ${timeRPN}ms`);
console.log();

// Test 11: Wielocyfrowe liczby
console.log('Test 11: Wielocyfrowe liczby');
const multiDigitTests = [
  { expr: '100+200', expected: 300 },
  { expr: '1234+5678', expected: 6912 },
  { expr: '99*99', expected: 9801 },
  { expr: '1000/10', expected: 100 },
  { expr: '123+456*789', expected: 359907 }
];

multiDigitTests.forEach(({ expr, expected }) => {
  testExpression(expr, expected);
});
console.log();

// Test 12: Bardzo długie wyrażenie
console.log('Test 12: Bardzo długie wyrażenie');
const longExpr = '1+2*3-4/2+5*6-7+8*9-10/2+11-12*13+14/2-15+16*17';
const result12 = calculate(longExpr);
console.log(`Wyrażenie: "${longExpr}"`);
console.log(`Wynik: ${result12}`);
console.log();

// Test 13: Testy brzegowe dla dzielenia
console.log('Test 13: Testy brzegowe dla dzielenia');
console.log('a) Dzielenie bez reszty:');
testExpression('10/5', 2);
testExpression('100/10', 10);

console.log('\nb) Dzielenie z resztą:');
testExpression('10/3', 3.333333);
testExpression('7/2', 3.5);

console.log('\nc) Dzielenie łańcuchowe:');
testExpression('100/10/2', 5);
testExpression('1000/10/10/10', 1);
console.log();

// Test 14: Kombinacje wszystkich operatorów
console.log('Test 14: Kombinacje wszystkich operatorów');
const comboTests = [
  '2+3-4+5',    // (2+3-4+5) = 6
  '2*3/6*4',    // ((2*3)/6)*4 = 4
  '10/2+3*4',   // (10/2)+(3*4) = 17
  '5-2*3+10/2'  // 5-(2*3)+(10/2) = 4
];

comboTests.forEach(expr => {
  const result = calculate(expr);
  console.log(`  "${expr}" = ${result}`);
});
console.log();

// Test 15: Wizualizacja różnych wyrażeń
console.log('Test 15: Wizualizacje różnych wyrażeń');

console.log('a) Proste dodawanie:');
calculateVerbose('1+2+3');

console.log('\nb) Z mnożeniem:');
calculateVerbose('2*3+4');

console.log('\nc) Złożone:');
calculateVerbose('10-2*3+8/4');

console.log('\n=== Podsumowanie / Summary ===');
console.log('Calculator - Ewaluator wyrażeń arytmetycznych');
console.log('\nZłożoność (optymalne rozwiązanie):');
console.log('  Czasowa:  O(n) - jedno przejście przez wyrażenie');
console.log('  Pamięciowa: O(n) dla stack-based, O(1) dla no-stack');
console.log('\nImplementacje:');
console.log('  1. Two Pass: Intuicyjna, dwa przejścia (parse + eval)');
console.log('  2. Stack-based: Najpopularniejsza, czytelna, efektywna');
console.log('  3. No Stack: Najbardziej oszczędna pamięciowo (O(1))');
console.log('  4. RPN (Shunting Yard): Najbardziej rozszerzalna (nawiasy, funkcje)');
console.log('\nKluczowa idea:');
console.log('  - Operacje */ mają wyższy priorytet niż +-');
console.log('  - Stack pozwala opóźnić dodawanie/odejmowanie');
console.log('  - Mnożenie/dzielenie wykonujemy natychmiast');
console.log('  - Traktuj odejmowanie jako dodawanie liczby ujemnej');
console.log('\nZastosowania:');
console.log('  - Kalkulatory (wszystkie typy)');
console.log('  - Kompilatory (parsowanie wyrażeń)');
console.log('  - Arkusze kalkulacyjne (Excel, Google Sheets)');
console.log('  - Języki programowania (ewaluacja wyrażeń)');
console.log('  - Systemy CAS (Computer Algebra Systems)');
