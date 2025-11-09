# 8.14 Boolean Evaluation

## Original Problem / Oryginalne Zadanie

**Boolean Evaluation:** Given a boolean expression consisting of the symbols 0 (false), 1 (true), & (AND), | (OR), and ^ (XOR), and a desired boolean result value `result`, implement a function to count the number of ways of parenthesizing the expression such that it evaluates to `result`.

**Example:**
```
countEval("1^0|0|1", false) → 2
countEval("0&0&0&1^1|0", true) → 10
```

Hints: #148, #168, #197, #305, #327

---

## Understanding the Problem / Zrozumienie Problemu

Count how many **different ways** to add parentheses to get the desired result.
Policz ile **różnych sposobów** dodania nawiasów aby dostać pożądany wynik.

### Expression Components / Komponenty Wyrażenia

**Values:** `0` (false), `1` (true)
**Operators:**
- `&` (AND): true only if both operands true / prawda tylko jeśli oba operandy prawda
- `|` (OR): true if at least one operand true / prawda jeśli przynajmniej jeden operand prawda
- `^` (XOR): true if operands are different / prawda jeśli operandy są różne

### Example / Przykład

```
Expression: "1^0|0|1"
Want: false

Different parenthesizations:
1. 1^((0|0)|1) = 1^(0|1) = 1^1 = 0 ✓
2. 1^(0|(0|1)) = 1^(0|1) = 1^1 = 0 ✓
3. (1^0)|(0|1) = 1|(0|1) = 1|1 = 1 ✗
4. (1^(0|0))|1 = (1^0)|1 = 1|1 = 1 ✗
5. ((1^0)|0)|1 = (1|0)|1 = 1|1 = 1 ✗

Count = 2 ways to get false
```

### Key Insight / Kluczowe Spostrzeżenie

This is about **counting parenthesizations**, not evaluating!
To jest o **liczeniu nawiskowań**, nie ewaluacji!

Similar to **Matrix Chain Multiplication** - try splitting at different operators.
Podobne do **Mnożenia Łańcucha Macierzy** - próbuj podziału na różnych operatorach.

---

## Solution Approach: Divide and Conquer + DP / Podejście: Dziel i Rządź + DP

### Strategy / Strategia

1. **Try splitting at each operator** / **Spróbuj podziału na każdym operatorze**
2. **Recursively count ways for left and right subexpressions** / **Rekurencyjnie policz sposoby dla lewych i prawych podwyrażeń**
3. **Combine counts based on operator** / **Połącz liczniki na podstawie operatora**
4. **Use memoization to avoid recomputation** / **Użyj memoizacji aby uniknąć ponownego obliczania**

### Implementation / Implementacja

```javascript
function countEval(expr, result) {
  // Base case: single value / Przypadek bazowy: pojedyncza wartość
  if (expr.length === 1) {
    const value = expr === '1';
    return value === result ? 1 : 0;
  }

  let ways = 0;

  // Try splitting at each operator / Spróbuj podziału na każdym operatorze
  for (let i = 1; i < expr.length; i += 2) {
    const operator = expr[i];
    const left = expr.substring(0, i);
    const right = expr.substring(i + 1);

    // Count ways for each side to be true/false
    // Policz sposoby dla każdej strony aby być prawdą/fałszem
    const leftTrue = countEval(left, true);
    const leftFalse = countEval(left, false);
    const rightTrue = countEval(right, true);
    const rightFalse = countEval(right, false);

    // Combine based on operator / Połącz na podstawie operatora
    let totalTrue = 0;

    if (operator === '&') {
      // AND: true only if both true / AND: prawda tylko jeśli oba prawda
      totalTrue = leftTrue * rightTrue;
    } else if (operator === '|') {
      // OR: true if at least one true / OR: prawda jeśli przynajmniej jedno prawda
      totalTrue = leftTrue * rightTrue +
                  leftTrue * rightFalse +
                  leftFalse * rightTrue;
    } else if (operator === '^') {
      // XOR: true if different / XOR: prawda jeśli różne
      totalTrue = leftTrue * rightFalse +
                  leftFalse * rightTrue;
    }

    const total = (leftTrue + leftFalse) * (rightTrue + rightFalse);
    const totalFalse = total - totalTrue;

    ways += result ? totalTrue : totalFalse;
  }

  return ways;
}
```

---

## Combining Counts / Łączenie Liczników

### Truth Table for Operators / Tablica Prawdy dla Operatorów

For each operator, count how many combinations give true/false:
Dla każdego operatora, policz ile kombinacji daje prawdę/fałsz:

#### AND (&)

| Left | Right | Result | Count |
|------|-------|--------|-------|
| T | T | T | leftTrue × rightTrue |
| T | F | F | leftTrue × rightFalse |
| F | T | F | leftFalse × rightTrue |
| F | F | F | leftFalse × rightFalse |

```javascript
totalTrue = leftTrue * rightTrue;
totalFalse = leftTrue * rightFalse +
             leftFalse * rightTrue +
             leftFalse * rightFalse;
```

#### OR (|)

| Left | Right | Result | Count |
|------|-------|--------|-------|
| T | T | T | leftTrue × rightTrue |
| T | F | T | leftTrue × rightFalse |
| F | T | T | leftFalse × rightTrue |
| F | F | F | leftFalse × rightFalse |

```javascript
totalTrue = leftTrue * rightTrue +
            leftTrue * rightFalse +
            leftFalse * rightTrue;
totalFalse = leftFalse * rightFalse;
```

#### XOR (^)

| Left | Right | Result | Count |
|------|-------|--------|-------|
| T | T | F | leftTrue × rightTrue |
| T | F | T | leftTrue × rightFalse |
| F | T | T | leftFalse × rightTrue |
| F | F | F | leftFalse × rightFalse |

```javascript
totalTrue = leftTrue * rightFalse +
            leftFalse * rightTrue;
totalFalse = leftTrue * rightTrue +
             leftFalse * rightFalse;
```

---

## Example Walkthrough / Przykład Krok Po Kroku

```
Expression: "1^0|1"
Want: true

Split at position 1 (operator ^):
  Left: "1"
    leftTrue = 1  (1 is true)
    leftFalse = 0

  Right: "0|1"
    Split at position 1 (operator |):
      Left: "0"  → rightTrue = 0, rightFalse = 1
      Right: "1" → rightTrue = 1, rightFalse = 0

    For "0|1":
      totalTrue = 0*1 + 0*0 + 1*1 = 1
      totalFalse = 1*0 = 0

    rightTrue = 1, rightFalse = 0

  For "1^(0|1)":
    operator = ^
    totalTrue = leftTrue * rightFalse + leftFalse * rightTrue
              = 1 * 0 + 0 * 1 = 0

Split at position 3 (operator |):
  Left: "1^0"
    totalTrue = 1*0 + 0*1 = 0
    totalFalse = 1*1 + 0*0 = 1
    leftTrue = 0, leftFalse = 1

  Right: "1"
    rightTrue = 1, rightFalse = 0

  For "(1^0)|1":
    operator = |
    totalTrue = 0*1 + 0*0 + 1*1 = 1

Total ways to get true = 0 + 1 = 1
```

---

## Optimization: Memoization / Optymalizacja: Memoizacja

### Problem / Problem

Without memoization, many subexpressions computed multiple times!
Bez memoizacji, wiele podwyrażeń obliczanych wielokrotnie!

```
"1^0|0|1" calls:
  "1^0", "0|0|1"
  "1^0|0", "1"
  "1", "0|0|1"

"0|0|1" appears in multiple branches!
```

### Solution: Cache Results / Rozwiązanie: Cache'uj Wyniki

```javascript
function countEvalMemo(expr, result) {
  const memo = new Map();
  return helper(expr, result, memo);
}

function helper(expr, result, memo) {
  if (expr.length === 1) {
    const value = expr === '1';
    return value === result ? 1 : 0;
  }

  // Check memo / Sprawdź memo
  const key = `${expr}-${result}`;
  if (memo.has(key)) {
    return memo.get(key);
  }

  let ways = 0;
  // ... computation ...

  memo.set(key, ways);
  return ways;
}
```

**Key for memoization:** `(expression, result)` pair
**Klucz dla memoizacji:** para `(wyrażenie, wynik)`

---

## Further Optimization: Compute Both at Once / Dalsza Optymalizacja: Oblicz Obie Naraz

Instead of making separate calls for `true` and `false`, compute both!
Zamiast robić oddzielne wywołania dla `prawdy` i `fałszu`, oblicz obie!

```javascript
function countEvalOptimized(expr, result) {
  const memo = new Map();
  const counts = helper(expr, memo);
  return result ? counts.trueCount : counts.falseCount;
}

function helper(expr, memo) {
  if (expr.length === 1) {
    const isTrue = expr === '1';
    return {
      trueCount: isTrue ? 1 : 0,
      falseCount: isTrue ? 0 : 1
    };
  }

  if (memo.has(expr)) {
    return memo.get(expr);
  }

  let trueCount = 0;
  let falseCount = 0;

  for (let i = 1; i < expr.length; i += 2) {
    const operator = expr[i];
    const left = helper(expr.substring(0, i), memo);
    const right = helper(expr.substring(i + 1), memo);

    // Calculate based on operator / Oblicz na podstawie operatora
    if (operator === '&') {
      trueCount += left.trueCount * right.trueCount;
      falseCount += left.trueCount * right.falseCount +
                    left.falseCount * right.trueCount +
                    left.falseCount * right.falseCount;
    }
    // ... other operators ...
  }

  const result = { trueCount, falseCount };
  memo.set(expr, result);
  return result;
}
```

**Benefit:** Fewer memo lookups, compute both counts in one pass!
**Korzyść:** Mniej odwołań do memo, oblicz oba liczniki w jednym przejściu!

---

## Common Mistakes / Częste Błędy

### 1. Forgetting to Skip Non-Operators

```javascript
// ❌ WRONG - treats digits as operators
for (let i = 1; i < expr.length; i++) {
  const operator = expr[i];
  // ...
}

// ✅ CORRECT - skip non-operators
for (let i = 1; i < expr.length; i += 2) {  // Jump by 2
  const operator = expr[i];
  if (operator === '&' || operator === '|' || operator === '^') {
    // ...
  }
}
```

### 2. Wrong Combination Logic

```javascript
// ❌ WRONG for OR
totalTrue = leftTrue * rightTrue;

// ✅ CORRECT for OR
totalTrue = leftTrue * rightTrue +   // T | T = T
            leftTrue * rightFalse +  // T | F = T
            leftFalse * rightTrue;   // F | T = T
```

### 3. Not Memoizing Both Result Values

```javascript
// ❌ INEFFICIENT - separate calls for true/false
const key = `${expr}-${result}`;

// ✅ BETTER - cache both at once
const key = expr;  // Cache both true and false counts together
```

### 4. Wrong Base Case

```javascript
// ❌ WRONG
if (expr.length === 0) return 0;

// ✅ CORRECT
if (expr.length === 1) {
  const value = expr === '1';
  return value === result ? 1 : 0;
}
```

---

## Edge Cases / Przypadki Brzegowe

1. **Single value:** `"1"` or `"0"` / `"1"` lub `"0"`
   - Count = 1 if matches result / Licznik = 1 jeśli pasuje do wyniku
   - Count = 0 otherwise / Licznik = 0 w przeciwnym razie

2. **Single operation:** `"1&0"` / `"1&0"`
   - Only one way to parenthesize / Tylko jeden sposób nawiskowania

3. **All same operator:** `"1|1|1|1"` / `"1|1|1|1"`
   - Catalan number of ways / Liczba Catalana sposobów

4. **Alternating operators:** `"1^0&1|0"` / `"1^0&1|0"`
   - Many different combinations / Wiele różnych kombinacji

---

## Relationship to Catalan Numbers / Związek z Liczbami Catalana

The number of ways to parenthesize an expression with `n` operators is the **n-th Catalan number**!
Liczba sposobów nawiskowania wyrażenia z `n` operatorami to **n-ta liczba Catalana**!

```
C(0) = 1
C(1) = 1     (1 operator: "a•b" → 1 way)
C(2) = 2     (2 operators: "a•b•c" → 2 ways)
C(3) = 5     (3 operators: 5 ways)
C(4) = 14    (4 operators: 14 ways)

Formula: C(n) = (2n)! / ((n+1)! × n!)
```

Our problem counts how many of these evaluate to the desired result.
Nasz problem liczy ile z nich ewaluuje do pożądanego wyniku.

---

## Applications / Zastosowania

1. **Expression parsing:** Ambiguous grammars / Niejednoznaczne gramatyki
2. **Circuit design:** Boolean function minimization / Minimalizacja funkcji boolowskich
3. **Probability:** Counting favorable outcomes / Liczenie korzystnych wyników
4. **Compiler optimization:** Expression tree generation / Generowanie drzewa wyrażeń

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Classic example ("1^0|0|1") / Klasyczny przykład
- ✅ Different operators (AND, OR, XOR) / Różne operatory
- ✅ Longer expressions / Dłuższe wyrażenia
- ✅ Edge cases (single value, single operation) / Przypadki brzegowe
- ✅ Both true and false results / Oba wyniki prawda i fałsz
- ✅ Performance comparison / Porównanie wydajności
- ✅ All approaches verified / Wszystkie podejścia zweryfikowane

---

## Time & Space Complexity / Złożoność Czasowa i Pamięciowa

| Approach | Time | Space | Notes |
|---|---|---|---|
| Recursive | O(4^n) | O(n) | Exponential / Wykładnicze |
| Memoization | O(n³) | O(n²) | Good / Dobre |
| Optimized | O(n³) | O(n²) | **Best** |

**Time breakdown / Rozbicie czasu:**
- O(n²) unique subexpressions / unikalne podwyrażenia
- O(n) to compute each (try all split points) / aby obliczyć każde
- Total: O(n³)

**Space breakdown / Rozbicie przestrzeni:**
- O(n²) memo entries / wpisy memo
- Each stores constant data / Każdy przechowuje stałe dane
- Total: O(n²)

---

## Interview Tips / Wskazówki do Rozmowy

1. **Recognize pattern:** "This is similar to matrix chain multiplication - divide and conquer with DP."
   **Rozpoznaj wzór:** "To jest podobne do mnożenia łańcucha macierzy - dziel i rządź z DP."

2. **Start simple:** "Let me first solve without memoization, then optimize."
   **Zacznij prosto:** "Najpierw rozwiążę bez memoizacji, potem zoptymalizuję."

3. **Explain combinations:** "For each operator, I combine counts using truth table logic."
   **Wyjaśnij kombinacje:** "Dla każdego operatora, łączę liczniki używając logiki tablicy prawdy."

4. **Mention optimization:** "I can compute both true and false counts together to reduce memo lookups."
   **Wspomnij optymalizację:** "Mogę obliczyć oba liczniki prawda i fałsz razem aby zmniejszyć odwołania do memo."

5. **Discuss complexity:** "Without memoization it's exponential, with memoization it's O(n³)."
   **Omów złożoność:** "Bez memoizacji to wykładnicze, z memoizacją to O(n³)."

---

## Key Takeaways / Kluczowe Wnioski

1. **Divide and conquer** - try splitting at each operator
   **Dziel i rządź** - próbuj podziału na każdym operatorze

2. **Combine counts** using truth table logic for each operator
   **Łącz liczniki** używając logiki tablicy prawdy dla każdego operatora

3. **Memoization is essential** - reduces O(4^n) to O(n³)
   **Memoizacja jest niezbędna** - zmniejsza O(4^n) do O(n³)

4. **Compute both true/false together** for fewer cache lookups
   **Oblicz oba prawda/fałsz razem** dla mniejszej liczby odwołań do cache

5. **Related to Catalan numbers** - total parenthesizations
   **Związane z liczbami Catalana** - całkowite nawiskowania

---

**Time Complexity:** O(n³) with memoization
**Space Complexity:** O(n²)
**Difficulty:** Hard / Trudny
