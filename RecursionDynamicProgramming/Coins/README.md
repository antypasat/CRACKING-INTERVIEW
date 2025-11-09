# 8.11 Coins

## Original Problem / Oryginalne Zadanie

**Coins:** Given an infinite number of quarters (25 cents), dimes (10 cents), nickels (5 cents), and pennies (1 cent), write code to calculate the number of ways of representing n cents.

Hints: #300, #324, #343, #380, #394

---

## Understanding the Problem / Zrozumienie Problemu

This is a classic **coin change problem** - counting combinations, not permutations!
To klasyczny **problem wydawania reszty** - liczymy kombinacje, nie permutacje!

### Key Difference / Kluczowa Różnica

**Combinations:** Order doesn't matter / Kolejność nie ma znaczenia
- `1Q + 2D` and `2D + 1Q` are the SAME way

**Permutations:** Order matters / Kolejność ma znaczenie
- `1Q + 2D` and `2D + 1Q` would be different ways

**We want combinations!** / **Chcemy kombinacje!**

### Examples / Przykłady

```
5 cents:
  1. 1N (5¢)                    ✓
  2. 5P (1¢ × 5)                ✓
  Total: 2 ways

10 cents:
  1. 1D (10¢)                   ✓
  2. 2N (5¢ × 2)                ✓
  3. 1N + 5P (5¢ + 1¢ × 5)      ✓
  4. 10P (1¢ × 10)              ✓
  Total: 4 ways

25 cents:
  1. 1Q (25¢)                   ✓
  2. 2D + 1N (10¢ × 2 + 5¢)     ✓
  3. 2D + 5P (10¢ × 2 + 1¢ × 5) ✓
  ... (13 total ways)
```

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Recursive (Brute Force)

**Strategy:** For each coin, try using 0, 1, 2, ... of it, then recurse on remaining amount
**Strategia:** Dla każdej monety, spróbuj użyć 0, 1, 2, ..., potem rekurencja na pozostałej kwocie

```javascript
function makeChangeRecursive(n) {
  const denoms = [25, 10, 5, 1];
  return makeChangeHelper(n, denoms, 0);
}

function makeChangeHelper(amount, denoms, index) {
  if (index >= denoms.length - 1) {
    return 1; // Only pennies left, one way / Zostały tylko pensy, jeden sposób
  }

  const denomAmount = denoms[index];
  let ways = 0;

  // Try using 0, 1, 2, ... of current coin / Spróbuj użyć 0, 1, 2, ... bieżącej monety
  for (let i = 0; i * denomAmount <= amount; i++) {
    const remaining = amount - i * denomAmount;
    ways += makeChangeHelper(remaining, denoms, index + 1);
  }

  return ways;
}
```

**Example for 10 cents / Przykład dla 10 centów:**
```
makeChange(10, index=0) // Quarters / Ćwiartki
  ├─ Use 0Q: makeChange(10, index=1)  // Dimes / Dziesięciocentówki
  │   ├─ Use 0D: makeChange(10, index=2)  // Nickels / Pięciocentówki
  │   │   ├─ Use 0N: makeChange(10, index=3) → 1 (10 pennies)
  │   │   ├─ Use 1N: makeChange(5, index=3)  → 1 (5 pennies)
  │   │   └─ Use 2N: makeChange(0, index=3)  → 1 (0 pennies)
  │   └─ Use 1D: makeChange(0, index=2) → 1 (0 nickels/pennies)
  └─ Use 1Q: (not possible, 25 > 10)
Total: 4 ways
```

**Pros:** Simple, intuitive / Proste, intuicyjne
**Cons:** O(4^n) - extremely slow! / Ekstremalnie wolne!

---

### Approach 2: Dynamic Programming (Memoization)

**Strategy:** Cache results of subproblems to avoid recomputation
**Strategia:** Cache'uj wyniki podproblemów aby uniknąć ponownego obliczania

```javascript
function makeChangeMemo(n) {
  const denoms = [25, 10, 5, 1];
  const memo = new Map();
  return makeChangeHelper(n, denoms, 0, memo);
}

function makeChangeHelper(amount, denoms, index, memo) {
  if (amount === 0) return 1;
  if (index >= denoms.length) return 0;

  const key = `${amount}-${index}`;
  if (memo.has(key)) return memo.get(key);

  const denom = denoms[index];
  let ways = 0;

  for (let i = 0; i * denom <= amount; i++) {
    ways += makeChangeHelper(amount - i * denom, denoms, index + 1, memo);
  }

  memo.set(key, ways);
  return ways;
}
```

**Key insight:** State is determined by `(amount, index)` pair
**Kluczowe spostrzeżenie:** Stan jest określony przez parę `(kwota, indeks)`

**Pros:** Much faster than recursive / Dużo szybsze niż rekurencyjne
**Cons:** Still uses recursion stack / Nadal używa stosu rekurencji

---

### Approach 3: Dynamic Programming (Tabulation) - BEST!

**Strategy:** Build table bottom-up, one coin type at a time
**Strategia:** Buduj tabelę od dołu, po jednym typie monety

```javascript
function makeChangeDP(n) {
  const denoms = [25, 10, 5, 1];

  // dp[i] = ways to make amount i / sposoby na kwotę i
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // One way to make 0: no coins / Jeden sposób na 0: brak monet

  // For each coin type / Dla każdego typu monety
  for (const denom of denoms) {
    // Update all amounts that can use this coin
    // Aktualizuj wszystkie kwoty które mogą użyć tej monety
    for (let amount = denom; amount <= n; amount++) {
      dp[amount] += dp[amount - denom];
    }
  }

  return dp[n];
}
```

**Step-by-step for 10 cents / Krok po kroku dla 10 centów:**

```
Initial: dp = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                0  1  2  3  4  5  6  7  8  9 10

After quarters (25): No change (25 > 10)
dp = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

After dimes (10):
  amount=10: dp[10] += dp[10-10] = dp[10] + dp[0] = 0 + 1 = 1
dp = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]

After nickels (5):
  amount=5:  dp[5]  += dp[0]  = 0 + 1 = 1
  amount=10: dp[10] += dp[5]  = 1 + 1 = 2
dp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2]

After pennies (1):
  amount=1:  dp[1]  += dp[0]  = 0 + 1 = 1
  amount=2:  dp[2]  += dp[1]  = 0 + 1 = 1
  ...
  amount=10: dp[10] += dp[9]  = 2 + 2 = 4
dp = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 4]

Result: dp[10] = 4 ways ✓
```

**Pros:**
- O(n*d) time where d = number of denominations / liczba nominałów
- O(n) space - only need 1D array / tylko potrzebna tablica 1D
- No recursion / Bez rekurencji
- **Optimal!** / **Optymalne!**

**Cons:** None for this problem / Brak dla tego problemu

---

## Why Order of Coins Matters / Dlaczego Kolejność Monet Ma Znaczenie

**IMPORTANT:** Process coins in a consistent order to avoid counting duplicates!
**WAŻNE:** Przetwarzaj monety w spójnej kolejności aby uniknąć liczenia duplikatów!

### Wrong Approach (Permutations) / Złe Podejście (Permutacje)

```javascript
// ❌ WRONG - counts permutations, not combinations
for (let amount = 1; amount <= n; amount++) {
  for (const denom of denoms) {
    if (amount >= denom) {
      dp[amount] += dp[amount - denom];
    }
  }
}
```

This counts `1Q + 2D` and `2D + 1Q` as different!
To liczy `1Q + 2D` i `2D + 1Q` jako różne!

### Correct Approach (Combinations) / Prawidłowe Podejście (Kombinacje)

```javascript
// ✓ CORRECT - counts combinations
for (const denom of denoms) {          // Fix coin order / Ustal kolejność monet
  for (let amount = denom; amount <= n; amount++) {
    dp[amount] += dp[amount - denom];
  }
}
```

By processing each coin type completely before moving to the next, we ensure each combination is counted once!
Przetwarzając każdy typ monety całkowicie przed przejściem do następnego, zapewniamy że każda kombinacja jest liczona raz!

---

## Key Insights / Kluczowe Spostrzeżenia

### 1. Subproblem Structure / Struktura Podproblemu

```
Ways(n, coins) = Sum of:
  - Ways(n - 0*coin[0], coins[1:])
  - Ways(n - 1*coin[0], coins[1:])
  - Ways(n - 2*coin[0], coins[1:])
  - ...
  - Ways(n - k*coin[0], coins[1:]) where k*coin[0] <= n
```

### 2. Base Cases / Przypadki Bazowe

```javascript
if (amount === 0) return 1;  // Found a valid way / Znaleziono prawidłowy sposób
if (index >= denoms.length) return 0; // No more coins / Brak więcej monet
```

### 3. DP Recurrence / Rekurencja DP

```
dp[amount] = sum of dp[amount - denom] for all valid denoms
```

Each `dp[amount]` accumulates ways from all coin types.
Każde `dp[amount]` akumuluje sposoby ze wszystkich typów monet.

### 4. Coin Order Prevents Duplicates / Kolejność Monet Zapobiega Duplikatom

Processing coins in order (Q → D → N → P) ensures:
Przetwarzanie monet w kolejności (Q → D → N → P) zapewnia:
- Once we move past quarters, we never go back / Gdy przejdziemy ćwiartki, nigdy nie wracamy
- Each combination counted exactly once / Każda kombinacja liczona dokładnie raz

---

## Common Mistakes / Częste Błędy

### 1. Counting Permutations Instead of Combinations

```javascript
// ❌ WRONG - inner loop on coins
for (let amount = 1; amount <= n; amount++) {
  for (const denom of denoms) { ... }
}

// ✅ CORRECT - outer loop on coins
for (const denom of denoms) {
  for (let amount = denom; amount <= n; amount++) { ... }
}
```

### 2. Not Handling Base Case

```javascript
// ❌ WRONG
const dp = new Array(n + 1).fill(0);
// dp[0] is 0 - wrong!

// ✅ CORRECT
const dp = new Array(n + 1).fill(0);
dp[0] = 1; // One way to make 0 cents / Jeden sposób na 0 centów
```

### 3. Starting Inner Loop at 0

```javascript
// ❌ WRONG - wastes time
for (let amount = 0; amount <= n; amount++) {
  if (amount >= denom) { ... }
}

// ✅ CORRECT - start where useful
for (let amount = denom; amount <= n; amount++) { ... }
```

---

## Edge Cases / Przypadki Brzegowe

1. **n = 0:** Return 1 (one way: use no coins) / Zwróć 1 (jeden sposób: brak monet)

2. **n = 1:** Return 1 (one penny) / Zwróć 1 (jeden pens)

3. **n < smallest coin:** With [25,10,5,1], always possible / Zawsze możliwe

4. **Large n:** DP handles efficiently / DP obsługuje efektywnie

5. **Custom denominations:** Algorithm works for any coins! / Algorytm działa dla dowolnych monet!

---

## Applications / Zastosowania

1. **Currency exchange:** Making change / Wydawanie reszty
2. **Knapsack variant:** Counting ways to fill capacity / Liczenie sposobów na wypełnienie pojemności
3. **Subset sum:** Counting subsets with target sum / Liczenie podzbiorów z docelową sumą
4. **Combinatorics:** General counting problems / Ogólne problemy kombinatoryczne

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Small amounts (5, 10, 25 cents) / Małe kwoty
- ✅ Medium amounts (50, 100 cents) / Średnie kwoty
- ✅ Large amounts (200, 500 cents) / Duże kwoty
- ✅ Edge cases (0, 1 cent) / Przypadki brzegowe
- ✅ Custom denominations / Niestandardowe nominały
- ✅ Performance comparison / Porównanie wydajności
- ✅ All approaches verified / Wszystkie podejścia zweryfikowane

---

## Comparison Table / Tabela Porównania

| Approach | Time | Space | Pros | Cons |
|---|---|---|---|---|
| Recursive | O(4^n) | O(n) | Simple | Extremely slow |
| Memoization | O(n*d) | O(n*d) | Faster | Extra space |
| Tabulation | O(n*d) | O(n) | **Optimal** | - |

Where d = number of coin denominations (4 in this problem)
Gdzie d = liczba nominałów monet (4 w tym problemie)

---

## Interview Tips / Wskazówki do Rozmowy

1. **Clarify combinations vs permutations:** "I assume order doesn't matter, so 1Q+2D equals 2D+1Q?"

2. **Start with recursive approach:** "Let me first explain the recursive solution, then optimize with DP."

3. **Explain coin ordering:** "I'll process each coin type completely to avoid counting duplicates."

4. **Mention optimization:** "I can optimize from O(n*d) space to O(n) by using a 1D array."

5. **Discuss base cases:** "For 0 cents, there's one way - use no coins."

---

## Key Takeaways / Kluczowe Wnioski

1. **This is counting combinations, not permutations**
   **To liczenie kombinacji, nie permutacji**

2. **Process coins in fixed order** to avoid duplicates
   **Przetwarzaj monety w ustalonej kolejności** aby uniknąć duplikatów

3. **DP recurrence:** `dp[amount] += dp[amount - coin]`
   Build up from smaller amounts / Buduj od mniejszych kwot

4. **Base case:** `dp[0] = 1` - one way to make 0 cents
   **Przypadek bazowy:** `dp[0] = 1` - jeden sposób na 0 centów

5. **Tabulation is optimal:** O(n*d) time, O(n) space
   **Tabulacja jest optymalna:** O(n*d) czas, O(n) przestrzeń

---

**Time Complexity:** O(n × d) where d = number of denominations
**Space Complexity:** O(n)
**Difficulty:** Medium / Średni
