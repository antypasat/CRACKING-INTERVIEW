# 16.26 Calculator

## Opis Zadania / Problem Description

**Calculator**: Given an arithmetic equation consisting of positive integers, +, -, *, and / (no parentheses), compute the result.

**Kalkulator**: Mając równanie arytmetyczne składające się z dodatnich liczb całkowitych, +, -, * i / (bez nawiasów), oblicz wynik.

EXAMPLE
Input: "2*3+5/6*3+15"
Output: 23.5

Hints: #521, #624, #665, #698

## Wyjaśnienie Problemu / Problem Explanation

Musimy zaimplementować kalkulator, który respektuje kolejność operacji (PEMDAS/BODMAS):
1. Mnożenie (*) i dzielenie (/) mają wyższy priorytet niż dodawanie (+) i odejmowanie (-)
2. Operacje o tym samym priorytecie wykonujemy od lewej do prawej
3. Nie ma nawiasów w tym zadaniu

We need to implement a calculator that respects order of operations (PEMDAS/BODMAS):
1. Multiplication (*) and division (/) have higher priority than addition (+) and subtraction (-)
2. Operations with the same priority are executed left to right
3. There are no parentheses in this problem

**Przykłady / Examples**:
```
"1+2" → 3
"2*3" → 6
"2*3+5" → 11 (not 16, because * before +)
"2+3*4" → 14 (not 20, because * before +)
"2*3+5/6*3+15" → 23.5
```

## Rozwiązania / Solutions

### Podejście 1: Parsowanie i Ewaluacja w Dwóch Przejściach

**Idea**:
1. Sparsuj string na liczby i operatory
2. Wykonaj najpierw wszystkie */ (wysokie priorytety)
3. Potem wykonaj wszystkie +- (niskie priorytety)

**Idea**:
1. Parse string into numbers and operators
2. Execute all */ first (high priority)
3. Then execute all +- (low priority)

```javascript
function calculate(expression) {
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

    if (char >= '0' && char <= '9' || char === '.') {
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
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n) - dwa przejścia
- Pamięciowa / Space: O(n) - przechowujemy liczby i operatory

### Podejście 2: Stack-based (Jedno Przejście) - O(n) ✓ OPTYMALNE

**Idea**: Używaj stacka do obsługi priorytetów:
- Dla +: dodaj liczbę do stacka
- Dla -: dodaj ujemną liczbę do stacka
- Dla *: wymnóż z poprzednią liczbą na stacku
- Dla /: podziel poprzednią liczbę na stacku
- Na końcu: suma wszystkich liczb na stacku

**Idea**: Use stack to handle priorities:
- For +: push number to stack
- For -: push negative number to stack
- For *: multiply with previous number on stack
- For /: divide previous number on stack
- At end: sum all numbers on stack

```javascript
function calculateStack(expression) {
  const stack = [];
  let num = 0;
  let operation = '+'; // Początkowa operacja

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    // Buduj liczbę
    if (char >= '0' && char <= '9') {
      num = num * 10 + parseInt(char);
    }

    // Gdy napotkamy operator lub koniec
    if ((char !== ' ' && isNaN(char)) || i === expression.length - 1) {
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
```

**Kluczowa Idea / Key Idea**:
- Traktuj odejmowanie jako dodawanie liczby ujemnej
- Mnożenie i dzielenie wykonuj natychmiast (modyfikując ostatnią liczbę na stacku)
- Dodawanie i odejmowanie odkładamy (jako liczby na stacku)
- Na końcu sumujemy cały stack

**Złożoność / Complexity**:
- Czasowa / Time: O(n) - jedno przejście
- Pamięciowa / Space: O(n) - stack

### Podejście 3: Bez Stacka (Śledzenie Poprzedniego) - O(n)

**Idea**: Śledź poprzednią liczbę i obecny wynik zamiast używać stacka.

**Idea**: Track previous number and current result instead of using stack.

```javascript
function calculateNoStack(expression) {
  let result = 0;
  let currentNum = 0;
  let lastNum = 0;
  let operation = '+';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char >= '0' && char <= '9') {
      currentNum = currentNum * 10 + parseInt(char);
    }

    if ((char !== ' ' && isNaN(char)) || i === expression.length - 1) {
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
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n)
- Pamięciowa / Space: O(1) - tylko zmienne

### Podejście 4: Rekurencyjne (Shunting Yard Algorithm)

**Idea**: Przekształć do Reverse Polish Notation (RPN), potem ewaluuj.

**Idea**: Convert to Reverse Polish Notation (RPN), then evaluate.

```javascript
function calculateRPN(expression) {
  // Krok 1: Konwertuj do RPN (Shunting Yard)
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
    if (char >= '0' && char <= '9' || char === '.') {
      num += char;
    } else if (char in precedence) {
      if (num) {
        output.push(parseFloat(num));
        num = '';
      }

      while (operators.length > 0 &&
             precedence[operators[operators.length - 1]] >= precedence[char]) {
        output.push(operators.pop());
      }

      operators.push(char);
    }
  }

  if (num) output.push(parseFloat(num));

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
```

**Zalety / Advantages**:
- Łatwo rozszerzyć o nawiasy
- Eleganckie rozdzielenie parsowania i ewaluacji

## Szczególne Przypadki / Edge Cases

1. **Pojedyncza liczba**: `"42"` → `42`
2. **Dzielenie przez zero**: `"5/0"` → `Infinity` lub błąd
3. **Liczby zmiennoprzecinkowe**: `"5/2"` → `2.5`
4. **Spacje**: `"2 + 3"` → `5` (powinno ignorować spacje)
5. **Wiele operacji**: `"1+2+3+4"` → `10`
6. **Ujemny wynik pośredni**: `"5-10"` → `-5`
7. **Dzielenie przed dodawaniem**: `"2+6/3"` → `4` (nie 2.67)

## Przykłady Krok po Kroku / Step-by-Step Examples

### Przykład 1: "2*3+5/6*3+15" (Stack-based approach)

```
i=0: char='2', num=2
i=1: char='*', operation='+', stack=[2], operation='*', num=0
i=2: char='3', num=3
i=3: char='+', operation='*', stack=[2*3=6], operation='+', num=0
i=4: char='5', num=5
i=5: char='/', operation='+', stack=[6,5], operation='/', num=0
i=6: char='6', num=6
i=7: char='*', operation='/', stack=[6,5/6=0.833...], operation='*', num=0
i=8: char='3', num=3
i=9: char='+', operation='*', stack=[6,0.833*3=2.5], operation='+', num=0
i=10: char='1', num=1
i=11: char='5', num=15
i=12: koniec, operation='+', stack=[6,2.5,15]

Sum: 6 + 2.5 + 15 = 23.5 ✓
```

### Przykład 2: "2+3*4" (Pokazuje priorytet)

```
Stack-based:
i=0: '2'  → num=2
i=1: '+'  → stack=[2], operation='+', num=0
i=2: '3'  → num=3
i=3: '*'  → stack=[2,3], operation='*', num=0
i=4: '4'  → num=4
koniec    → stack=[2,3*4=12]

Sum: 2 + 12 = 14 ✓ (nie 20)
```

## Porównanie Podejść / Approach Comparison

| Podejście | Czas | Pamięć | Złożoność kodu | Rozszerzalność |
|-----------|------|--------|----------------|----------------|
| Dwa przejścia | O(n) | O(n) | Średnia | Niska |
| Stack-based | O(n) | O(n) | Niska | Średnia |
| Bez stacka | O(n) | O(1) | Średnia | Niska |
| RPN (Shunting Yard) | O(n) | O(n) | Wysoka | Wysoka |

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Stack-based (Podejście 2)**: Najlepsze! Proste, efektywne, czytelne
- **Bez stacka (Podejście 3)**: Gdy pamięć jest krytyczna (O(1) space)
- **RPN (Podejście 4)**: Gdy planujesz dodać nawiasy i więcej operatorów
- **Dwa przejścia (Podejście 1)**: Najbardziej intuicyjne dla początkujących

## Rozszerzenia / Extensions

### 1. Dodanie Nawiasów

```javascript
// Używając RPN (Shunting Yard) można łatwo dodać nawiasy
function calculateWithParentheses(expression) {
  // Modyfikacja toRPN by obsługiwać '(' i ')'
  // Nawiasy mają najwyższy priorytet
}
```

### 2. Więcej Operatorów

```javascript
// Dodaj ^ (potęgowanie), % (modulo), etc.
const precedence = {
  '+': 1, '-': 1,
  '*': 2, '/': 2, '%': 2,
  '^': 3
};
```

### 3. Funkcje

```javascript
// Dodaj sin(), cos(), sqrt(), etc.
// Wymagałoby parsowania nazw funkcji
```

### 4. Zmienne

```javascript
// Dodaj obsługę zmiennych: "x+2*y" gdzie x=3, y=4
function calculateWithVariables(expression, variables) {
  // Podstaw wartości zmiennych przed ewaluacją
}
```

## Analiza Priorytetów Operatorów / Operator Precedence Analysis

```
Priorytet (od najwyższego):
1. () - nawiasy (nie w tym zadaniu)
2. *, / - mnożenie, dzielenie (od lewej do prawej)
3. +, - - dodawanie, odejmowanie (od lewej do prawej)

Przykłady:
2+3*4     → 2+(3*4)  → 14
2*3+4     → (2*3)+4  → 10
2*3*4     → (2*3)*4  → 24
2+3+4     → (2+3)+4  → 9
6/2*3     → (6/2)*3  → 9 (nie 1, bo od lewej do prawej)
```

## Wnioski / Conclusions

Calculator to świetny przykład problemu wymagającego:
1. **Parsowania**: Przekształcenia stringa na strukturę danych
2. **Respektowania priorytetów**: Kolejność operacji jest kluczowa
3. **Struktury danych**: Stack idealnie nadaje się do tego problemu
4. **Optymalizacji**: Od O(n²) do O(n) przez lepszy algorytm

Calculator is a great example of a problem requiring:
1. **Parsing**: Converting string to data structure
2. **Respecting priorities**: Order of operations is crucial
3. **Data structures**: Stack is ideal for this problem
4. **Optimization**: From O(n²) to O(n) through better algorithm

## Zastosowania / Applications

1. **Kalkulatory**: Wszystkie kalkulatory używają podobnych algorytmów
2. **Kompilatory**: Parsowanie wyrażeń arytmetycznych
3. **Języki programowania**: Ewaluacja wyrażeń
4. **Systemy CAS**: Computer Algebra Systems (Mathematica, Wolfram Alpha)
5. **Arkusze kalkulacyjne**: Excel, Google Sheets (formuły)
