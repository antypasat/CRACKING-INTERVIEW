# 8.1 Triple Step

## Original Problem / Oryginalne Zadanie

**Triple Step:** A child is running up a staircase with n steps and can hop either 1 step, 2 steps, or 3 steps at a time. Implement a method to count how many possible ways the child can run up the stairs.

**Potrójny Krok:** Dziecko wspina się po schodach z n stopni i może przeskoczyć 1 stopień, 2 stopnie lub 3 stopnie naraz. Zaimplementuj metodę liczącą ile możliwych sposobów dziecko ma na pokonanie schodów.

Hints: #152, #178, #217, #237, #262, #359

---

## Understanding the Problem / Zrozumienie Problemu

This is a **classic dynamic programming** problem similar to Fibonacci, but with **three** choices instead of two.
To jest **klasyczny problem programowania dynamicznego** podobny do Fibonacciego, ale z **trzema** wyborami zamiast dwóch.

```
Example / Przykład:
n = 3:
  Way 1: (1, 1, 1) - three 1-steps
  Way 2: (1, 2)    - one 1-step, one 2-step
  Way 3: (2, 1)    - one 2-step, one 1-step
  Way 4: (3)       - one 3-step

Total: 4 ways / sposobów
```

### Key Insight / Kluczowy Wgląd

To reach step `n`, the child must come from:
- Step `n-1` (with a 1-step hop)
- Step `n-2` (with a 2-step hop)
- Step `n-3` (with a 3-step hop)

Aby dotrzeć do stopnia `n`, dziecko musi przyjść z:
- Stopnia `n-1` (skokiem 1-stopniowym)
- Stopnia `n-2` (skokiem 2-stopniowym)
- Stopnia `n-3` (skokiem 3-stopniowym)

**Recurrence Relation / Relacja Rekurencyjna:**
```
ways(n) = ways(n-1) + ways(n-2) + ways(n-3)
```

**Base Cases / Przypadki Bazowe:**
```
ways(0) = 1  (one way to stay at ground / jeden sposób na zostanie)
ways(1) = 1  (only: 1)
ways(2) = 2  (options: (1,1) or (2))
ways(3) = 4  (options: (1,1,1), (1,2), (2,1), (3))
```

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Naive Recursive / Naiwna Rekurencja

**Strategy:** Direct recursion following the recurrence relation
**Strategia:** Bezpośrednia rekurencja według relacji rekurencyjnej

```javascript
function countWaysNaive(n) {
  if (n < 0) return 0;
  if (n === 0) return 1;

  return countWaysNaive(n - 1) +   // Try 1 step
         countWaysNaive(n - 2) +   // Try 2 steps
         countWaysNaive(n - 3);    // Try 3 steps
}
```

**Recursion Tree for n=4:**
```
                      ways(4)
           /            |            \
       ways(3)       ways(2)       ways(1)
      /  |  \         /    \           |
  w(2) w(1) w(0)   w(1)  w(0)        w(0)
  / \    |                |
w(1) w(0) w(0)          w(0)
  |
w(0)
```

**Problems / Problemy:**
- Overlapping subproblems / Nakładające się podproblemy
- Exponential time complexity / Wykładnicza złożoność czasowa
- Many redundant calculations / Wiele zbędnych obliczeń

**Time:** O(3^n) - exponential / wykładnicza
**Space:** O(n) - recursion stack / stos rekurencji

---

### Approach 2: Memoization (Top-Down DP) / Memoizacja (DP od Góry)

**Strategy:** Cache results to avoid recomputation
**Strategia:** Buforuj wyniki aby uniknąć ponownych obliczeń

```javascript
function countWaysMemo(n) {
  const memo = new Map();
  return helper(n, memo);
}

function helper(n, memo) {
  if (n < 0) return 0;
  if (n === 0) return 1;

  if (memo.has(n)) return memo.get(n);

  const result = helper(n - 1, memo) +
                 helper(n - 2, memo) +
                 helper(n - 3, memo);

  memo.set(n, result);
  return result;
}
```

**Execution Flow / Przepływ Wykonania:**
```
n=5 with memoization:

Call ways(5):
  → needs ways(4), ways(3), ways(2)

Call ways(4):
  → needs ways(3), ways(2), ways(1)

Call ways(3):
  → needs ways(2), ways(1), ways(0)

Call ways(2):
  → needs ways(1), ways(0)

Call ways(1), ways(0): base cases

Now all subsequent calls use cached values!
```

**Time:** O(n) - each state computed once / każdy stan raz
**Space:** O(n) - memo + recursion stack / memo + stos rekurencji

---

### Approach 3: Tabulation (Bottom-Up DP) / Tabulacja (DP od Dołu)

**Strategy:** Build solution iteratively from base cases
**Strategia:** Buduj rozwiązanie iteracyjnie od przypadków bazowych

```javascript
function countWaysTabulation(n) {
  if (n < 0) return 0;
  if (n === 0) return 1;

  const dp = new Array(n + 1);
  dp[0] = 1;
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
  }

  return dp[n];
}
```

**DP Table for n=5:**
```
i:    0   1   2   3   4   5
dp: [ 1,  1,  2,  4,  7,  13 ]
      ↑   ↑   ↑
    base cases

dp[3] = dp[2] + dp[1] + dp[0] = 2 + 1 + 1 = 4
dp[4] = dp[3] + dp[2] + dp[1] = 4 + 2 + 1 = 7
dp[5] = dp[4] + dp[3] + dp[2] = 7 + 4 + 2 = 13
```

**Time:** O(n) - single loop / jedna pętla
**Space:** O(n) - dp array / tablica dp

---

### Approach 4: Space-Optimized DP / DP Zoptymalizowane Pamięciowo

**Strategy:** Only keep last 3 values instead of entire array
**Strategia:** Przechowuj tylko ostatnie 3 wartości zamiast całej tablicy

```javascript
function countWaysOptimized(n) {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (n === 1) return 1;
  if (n === 2) return 2;

  let threeBack = 1;  // dp[i-3]
  let twoBack = 1;    // dp[i-2]
  let oneBack = 2;    // dp[i-1]

  for (let i = 3; i <= n; i++) {
    const current = oneBack + twoBack + threeBack;

    threeBack = twoBack;
    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}
```

**Sliding Window Visualization / Wizualizacja Okna:**
```
Initial: [1, 1, 2]
         ↑  ↑  ↑
         3B 2B 1B

i=3: current = 2 + 1 + 1 = 4
     [1, 2, 4]  → shift window

i=4: current = 4 + 2 + 1 = 7
     [2, 4, 7]  → shift window

i=5: current = 7 + 4 + 2 = 13
     [4, 7, 13] → return 13
```

**Time:** O(n) - single loop / jedna pętla
**Space:** O(1) - only 3 variables / tylko 3 zmienne

✅ **OPTIMAL SOLUTION / OPTYMALNE ROZWIĄZANIE**

---

## Comparison / Porównanie

| Approach / Podejście | Time / Czas | Space / Pamięć | Pros / Zalety | Cons / Wady |
|---|---|---|---|---|
| Naive Recursive | O(3^n) | O(n) | Simple / Proste | Too slow / Zbyt wolne |
| Memoization | O(n) | O(n) | Easy to code / Łatwe do kodowania | Uses recursion / Używa rekurencji |
| Tabulation | O(n) | O(n) | Iterative / Iteracyjne | Uses array / Używa tablicy |
| Space-Optimized | O(n) | **O(1)** | **OPTIMAL** | Slightly complex / Nieco złożone |

---

## Pattern Recognition / Rozpoznawanie Wzorów

This problem belongs to the **counting paths** family:
Ten problem należy do rodziny **liczenia ścieżek**:

```
Similar Problems / Podobne Problemy:
1. Fibonacci Numbers (2 choices)
2. Triple Step (3 choices) ← This problem
3. Climbing Stairs with k steps (k choices)
4. Coin Change (counting ways)
5. Decode Ways
```

**General Pattern / Ogólny Wzór:**
```
dp[i] = sum of ways to reach previous positions
dp[i] = suma sposobów dotarcia do poprzednich pozycji
```

---

## Step-by-Step Example / Przykład Krok po Kroku

**Problem:** How many ways to climb 4 steps?
**Problem:** Ile sposobów na pokonanie 4 stopni?

```
Manual Enumeration / Manualne Wyliczenie:
1. (1, 1, 1, 1)    - four 1-steps
2. (1, 1, 2)       - two 1-steps, one 2-step
3. (1, 2, 1)       - 1-step, 2-step, 1-step
4. (2, 1, 1)       - 2-step, two 1-steps
5. (2, 2)          - two 2-steps
6. (1, 3)          - 1-step, 3-step
7. (3, 1)          - 3-step, 1-step

Total: 7 ways ✓
```

**Using DP / Używając DP:**
```
dp[0] = 1  (base case)
dp[1] = 1  (base case: only (1))
dp[2] = 2  (base case: (1,1) or (2))
dp[3] = dp[2] + dp[1] + dp[0] = 2 + 1 + 1 = 4
dp[4] = dp[3] + dp[2] + dp[1] = 4 + 2 + 1 = 7 ✓
```

---

## Common Mistakes / Częste Błędy

### 1. Wrong Base Cases / Złe Przypadki Bazowe

```javascript
// ❌ WRONG
function countWays(n) {
  if (n === 0) return 0;  // Should be 1!
  ...
}

// ✅ CORRECT
function countWays(n) {
  if (n === 0) return 1;  // One way to stay at ground
  ...
}
```

**Why n=0 is 1, not 0:**
- There's **one way** to "climb 0 steps": do nothing
- This is a mathematical convention for empty sum
- It makes the recurrence relation work correctly

### 2. Missing Negative Check / Brak Sprawdzenia Ujemnych

```javascript
// ❌ WRONG - crashes on negative
function countWays(n) {
  if (n === 0) return 1;
  return countWays(n - 1) + countWays(n - 2) + countWays(n - 3);
}

// ✅ CORRECT
function countWays(n) {
  if (n < 0) return 0;  // Invalid path
  if (n === 0) return 1;
  ...
}
```

### 3. Off-by-One in Loop / Błąd o Jeden w Pętli

```javascript
// ❌ WRONG
for (let i = 3; i < n; i++) {  // Should be i <= n
  dp[i] = dp[i-1] + dp[i-2] + dp[i-3];
}

// ✅ CORRECT
for (let i = 3; i <= n; i++) {
  dp[i] = dp[i-1] + dp[i-2] + dp[i-3];
}
```

---

## Edge Cases / Przypadki Brzegowe

```javascript
countWays(-1) → 0   // Negative steps / Ujemne stopnie
countWays(0)  → 1   // No steps / Bez stopni
countWays(1)  → 1   // Only: (1)
countWays(2)  → 2   // (1,1) or (2)
countWays(3)  → 4   // (1,1,1), (1,2), (2,1), (3)
```

---

## Extensions / Rozszerzenia

### 1. K Steps at a Time / K Kroków Naraz

**Problem:** What if child can hop 1, 2, ..., k steps?
**Problem:** Co jeśli dziecko może skoczyć 1, 2, ..., k kroków?

```javascript
function countWaysK(n, k) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= k && j <= i; j++) {
      dp[i] += dp[i - j];
    }
  }

  return dp[n];
}
```

### 2. Print All Paths / Wypisz Wszystkie Ścieżki

```javascript
function printAllPaths(n) {
  const paths = [];

  function helper(remaining, path) {
    if (remaining === 0) {
      paths.push([...path]);
      return;
    }
    if (remaining < 0) return;

    helper(remaining - 1, [...path, 1]);
    helper(remaining - 2, [...path, 2]);
    helper(remaining - 3, [...path, 3]);
  }

  helper(n, []);
  return paths;
}

// printAllPaths(3) → [[1,1,1], [1,2], [2,1], [3]]
```

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Small values (0-5) with all approaches
- ✅ Step-by-step walkthrough
- ✅ Medium values (10, 15, 20)
- ✅ Large values (30, 35)
- ✅ Edge cases (negative, zero)
- ✅ Pattern visualization
- ✅ Performance comparison

---

## Interview Tips / Wskazówki do Rozmowy

1. **Start with recurrence relation:** "To reach step n, I can come from n-1, n-2, or n-3."

2. **Identify overlapping subproblems:** "Naive recursion recomputes the same values many times."

3. **Optimize progressively:**
   - Start: Naive recursion
   - Better: Add memoization
   - Best: Space-optimized DP

4. **Explain base cases clearly:** "n=0 is 1 because there's one way to do nothing."

5. **Draw it out:** Visual representation helps interviewer follow your logic.

6. **Mention extensions:** "This generalizes to k steps with minor changes."

---

## Key Takeaways / Kluczowe Wnioski

1. **Recognize the pattern:** Similar to Fibonacci but with 3 choices
   **Rozpoznaj wzór:** Podobne do Fibonacciego ale z 3 wyborami

2. **Overlapping subproblems** make DP necessary
   **Nakładające się podproblemy** wymagają DP

3. **Memoization** (top-down) is easiest to code
   **Memoizacja** (od góry) jest najłatwiejsza do kodowania

4. **Tabulation** (bottom-up) avoids recursion overhead
   **Tabulacja** (od dołu) unika narzutu rekurencji

5. **Space optimization** reduces O(n) to O(1)
   **Optymalizacja przestrzeni** redukuje O(n) do O(1)

6. Base case `ways(0) = 1` is crucial for correct recurrence
   Przypadek bazowy `ways(0) = 1` jest kluczowy dla poprawnej rekurencji

---

**Time Complexity:** O(n) for DP approaches
**Space Complexity:** O(1) for optimized, O(n) for others
**Difficulty:** Easy-Medium / Łatwy-Średni
