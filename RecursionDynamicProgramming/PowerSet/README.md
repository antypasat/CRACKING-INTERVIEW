# 8.4 Power Set

## Original Problem / Oryginalne Zadanie

**Power Set:** Write a method to return all subsets of a set.

**Zbiór Potęgowy:** Napisz metodę zwracającą wszystkie podzbiory zbioru.

Hints: #273, #290, #338, #354, #373

---

## Understanding the Problem / Zrozumienie Problemu

The **power set** of a set S is the set of all subsets of S, including the empty set and S itself.
**Zbiór potęgowy** zbioru S to zbiór wszystkich podzbiorów S, włączając zbiór pusty i sam S.

```
Example / Przykład:

Input:  {1, 2, 3}
Output: {
  ∅,           // Empty set / Zbiór pusty
  {1},
  {2},
  {3},
  {1, 2},
  {1, 3},
  {2, 3},
  {1, 2, 3}    // Full set / Pełny zbiór
}

Total: 8 subsets = 2^3
```

### Key Properties / Kluczowe Właściwości

1. **Size of power set:** For set of size n, power set has **2^n** subsets
   **Rozmiar zbioru potęgowego:** Dla zbioru rozmiaru n, zbiór potęgowy ma **2^n** podzbiorów

2. **Always includes:** Empty set (∅) and full set
   **Zawsze zawiera:** Zbiór pusty (∅) i pełny zbiór

3. **Each element:** Can be either included or excluded (2 choices per element)
   **Każdy element:** Może być uwzględniony lub wykluczony (2 wybory na element)

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Recursive (Backtracking) / Rekurencyjne (Cofanie)

**Strategy:** For each element, explore two branches: include it or exclude it
**Strategia:** Dla każdego elementu, eksploruj dwie gałęzie: uwzględnij go lub wyklucz

```javascript
function powerSet(set) {
  const result = [];
  helper(set, 0, [], result);
  return result;
}

function helper(set, index, current, result) {
  // Base case: processed all elements
  if (index === set.length) {
    result.push([...current]);
    return;
  }

  // Branch 1: Exclude current element
  helper(set, index + 1, current, result);

  // Branch 2: Include current element
  current.push(set[index]);
  helper(set, index + 1, current, result);
  current.pop(); // Backtrack
}
```

**Decision Tree for {1, 2, 3}:**
```
                        []
                      /    \
              Exclude 1    Include 1
                 []            [1]
                /  \          /   \
             []    [2]     [1]   [1,2]
            / \    / \     / \    / \
          [] [3] [2][2,3][1][1,3][1,2][1,2,3]
```

**Time:** O(n × 2^n) - generate 2^n subsets, each O(n) to copy
**Space:** O(n × 2^n) - store all subsets

---

### Approach 2: Recursive (Combinatorial) / Rekurencyjne (Kombinatoryczne)

**Strategy:** Build power set using mathematical definition
**Strategia:** Buduj zbiór potęgowy używając definicji matematycznej

**Formula / Wzór:**
```
P(S) = P(S - {x}) ∪ {s ∪ {x} : s ∈ P(S - {x})}

In words:
Power set of S = (power set without x) + (power set without x, each with x added)

Po polsku:
Zbiór potęgowy S = (zbiór potęgowy bez x) + (zbiór potęgowy bez x, każdy z dodanym x)
```

```javascript
function powerSet(set, index = 0) {
  // Base case: empty set
  if (index === set.length) {
    return [[]];
  }

  // Get subsets without current element
  const subsetsWithout = powerSet(set, index + 1);

  // Add current element to each subset
  const subsetsWith = subsetsWithout.map(subset =>
    [set[index], ...subset]
  );

  // Return union
  return [...subsetsWithout, ...subsetsWith];
}
```

**Step-by-step for {1, 2, 3}:**
```
powerSet([1,2,3], 0)
  → subsetsWithout = powerSet([1,2,3], 1)
      → subsetsWithout = powerSet([1,2,3], 2)
          → subsetsWithout = powerSet([1,2,3], 3)
              → [[]]  // Base case
          → subsetsWith = [[3]]
          → return [[], [3]]
      → subsetsWith = [[2], [2,3]]
      → return [[], [3], [2], [2,3]]
  → subsetsWith = [[1], [1,3], [1,2], [1,2,3]]
  → return [[], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3]]
```

**Time:** O(n × 2^n)
**Space:** O(n × 2^n)

---

### Approach 3: Iterative (Build Up) / Iteracyjne (Buduj w Górę)

**Strategy:** Start with empty set, add each element to all existing subsets
**Strategia:** Zacznij od zbioru pustego, dodaj każdy element do wszystkich istniejących podzbiorów

```javascript
function powerSet(set) {
  let result = [[]]; // Start with empty set

  for (const element of set) {
    const newSubsets = [];

    // Add current element to each existing subset
    for (const subset of result) {
      newSubsets.push([...subset, element]);
    }

    // Combine old and new subsets
    result = [...result, ...newSubsets];
  }

  return result;
}
```

**Visualization for {1, 2, 3}:**
```
Start:           [[]]

Add 1:
  Existing:      [[]]
  Add 1 to each: [[1]]
  Result:        [[], [1]]

Add 2:
  Existing:      [[], [1]]
  Add 2 to each: [[2], [1,2]]
  Result:        [[], [1], [2], [1,2]]

Add 3:
  Existing:      [[], [1], [2], [1,2]]
  Add 3 to each: [[3], [1,3], [2,3], [1,2,3]]
  Result:        [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
```

**Pattern / Wzór:**
- Start: 1 subset
- After element 1: 2 subsets (2^1)
- After element 2: 4 subsets (2^2)
- After element 3: 8 subsets (2^3)

**Time:** O(n × 2^n)
**Space:** O(n × 2^n)

✅ **RECOMMENDED - Easiest to explain in interview / Najłatwiejsze do wyjaśnienia na rozmowie**

---

### Approach 4: Bit Manipulation / Manipulacja Bitowa

**Strategy:** Represent each subset as a binary number
**Strategia:** Reprezentuj każdy podzbiór jako liczbę binarną

**Key Insight / Kluczowy Wgląd:**
Each subset corresponds to a binary number from 0 to 2^n - 1
- Bit at position i = 1 → include element i
- Bit at position i = 0 → exclude element i

```javascript
function powerSet(set) {
  const n = set.length;
  const powerSetSize = 1 << n; // 2^n
  const result = [];

  // Iterate from 0 to 2^n - 1
  for (let i = 0; i < powerSetSize; i++) {
    const subset = [];

    // Check each bit
    for (let j = 0; j < n; j++) {
      // If j-th bit is set, include element j
      if ((i & (1 << j)) !== 0) {
        subset.push(set[j]);
      }
    }

    result.push(subset);
  }

  return result;
}
```

**Binary Representation for {a, b, c}:**
```
Decimal  Binary  Subset      Explanation
0        000     []          No bits set / Żadne bity nieustawione
1        001     [a]         Bit 0 set / Bit 0 ustawiony
2        010     [b]         Bit 1 set / Bit 1 ustawiony
3        011     [a, b]      Bits 0,1 set / Bity 0,1 ustawione
4        100     [c]         Bit 2 set / Bit 2 ustawiony
5        101     [a, c]      Bits 0,2 set / Bity 0,2 ustawione
6        110     [b, c]      Bits 1,2 set / Bity 1,2 ustawione
7        111     [a, b, c]   All bits set / Wszystkie bity ustawione
```

**Bit Operations / Operacje Bitowe:**
```javascript
1 << n           // 2^n (left shift / przesunięcie w lewo)
i & (1 << j)     // Check if j-th bit is set / Sprawdź czy j-ty bit jest ustawiony
```

**Time:** O(n × 2^n)
**Space:** O(n × 2^n)

**Limitations / Ograniczenia:**
- Set size limited by integer size (typically n ≤ 30-32)
- Rozmiar zbioru ograniczony rozmiarem liczby całkowitej (zazwyczaj n ≤ 30-32)

---

## Comparison / Porównanie

| Approach / Podejście | Pros / Zalety | Cons / Wady |
|---|---|---|
| Recursive (Backtracking) | Clear decision tree / Jasne drzewo decyzji | Requires backtracking / Wymaga cofania |
| Recursive (Combinatorial) | Mathematical, elegant / Matematyczne, eleganckie | More allocations / Więcej alokacji |
| **Iterative** | **Easy to explain, no recursion** | Slightly more memory usage |
| Bit Manipulation | Fast, clever / Szybkie, sprytne | Limited to small sets / Ograniczone do małych zbiorów |

**Recommendation / Rekomendacja:**
- **Interview:** Iterative - clearest explanation
- **Production:** Bit manipulation for n ≤ 20, otherwise iterative

---

## Mathematical Foundation / Fundament Matematyczny

### Why 2^n Subsets? / Dlaczego 2^n Podzbiorów?

**Combinatorial Argument / Argument Kombinatoryczny:**

For each element, we have 2 choices: include or exclude
Dla każdego elementu mamy 2 wybory: uwzględnić lub wykluczyć

```
Element 1: 2 choices (in or out)
Element 2: 2 choices (in or out)
Element 3: 2 choices (in or out)
...
Element n: 2 choices (in or out)

Total combinations: 2 × 2 × 2 × ... × 2 (n times) = 2^n
```

### Recursive Formula / Wzór Rekurencyjny

```
|P(S)| = |P(S - {x})| + |{s ∪ {x} : s ∈ P(S - {x})}|
       = |P(S - {x})| + |P(S - {x})|
       = 2 × |P(S - {x})|

Base case: |P(∅)| = 1 (just the empty set)

Solution:
|P(S)| = 2^n where n = |S|
```

---

## Step-by-Step Example / Przykład Krok po Kroku

**Problem:** Generate power set of {1, 2, 3}
**Problem:** Wygeneruj zbiór potęgowy {1, 2, 3}

**Using Iterative Approach / Używając Podejścia Iteracyjnego:**

```
Step 0: Initialize
  result = [[]]

Step 1: Process element 1
  Current result: [[]]
  New subsets (add 1 to each): [[1]]
  Updated result: [[], [1]]

Step 2: Process element 2
  Current result: [[], [1]]
  New subsets (add 2 to each): [[2], [1,2]]
  Updated result: [[], [1], [2], [1,2]]

Step 3: Process element 3
  Current result: [[], [1], [2], [1,2]]
  New subsets (add 3 to each): [[3], [1,3], [2,3], [1,2,3]]
  Final result: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

Total: 8 subsets = 2^3 ✓
```

---

## Common Mistakes / Częste Błędy

### 1. Forgetting to Copy Subsets / Zapominanie o Kopiowaniu Podzbiorów

```javascript
// ❌ WRONG - all references point to same array
result.push(current); // Reference, not copy!

// ✅ CORRECT - create new array
result.push([...current]); // Spread operator creates copy
result.push(current.slice()); // Or use slice()
```

### 2. Not Including Empty Set / Nie Uwzględnianie Zbioru Pustego

```javascript
// ❌ WRONG - missing empty set
let result = [];

// ✅ CORRECT - start with empty set
let result = [[]];
```

### 3. Modifying While Iterating / Modyfikowanie Podczas Iteracji

```javascript
// ❌ WRONG - modifying array while iterating
for (const subset of result) {
  result.push([...subset, element]); // Infinite loop!
}

// ✅ CORRECT - create separate array for new subsets
const newSubsets = [];
for (const subset of result) {
  newSubsets.push([...subset, element]);
}
result = [...result, ...newSubsets];
```

### 4. Integer Overflow in Bit Manipulation / Przepełnienie Liczby w Manipulacji Bitowej

```javascript
// ❌ WRONG - overflow for large n
const powerSetSize = Math.pow(2, 50); // Too large!

// ✅ CORRECT - check size limit
if (n > 30) {
  throw new Error('Set too large for bit manipulation');
}
const powerSetSize = 1 << n;
```

---

## Edge Cases / Przypadki Brzegowe

```javascript
1. Empty set:
   Input:  []
   Output: [[]]  (power set of empty set is {∅})

2. Single element:
   Input:  [1]
   Output: [[], [1]]

3. Two elements:
   Input:  [a, b]
   Output: [[], [a], [b], [a,b]]

4. Duplicate elements (if not handled):
   Input:  [1, 1, 2]
   Output: May include duplicate subsets
   Solution: Use Set to remove duplicates or handle in logic

5. Large set (n > 20):
   Warning: 2^20 = 1,048,576 subsets
            2^30 = 1,073,741,824 subsets
   May cause memory issues!
```

---

## Extensions / Rozszerzenia

### 1. K-Subsets / K-Podzbiory

Generate only subsets of size k:
Wygeneruj tylko podzbiory rozmiaru k:

```javascript
function kSubsets(set, k) {
  const result = [];

  function helper(index, current) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }

    if (index === set.length) return;

    // Include current element
    current.push(set[index]);
    helper(index + 1, current);
    current.pop();

    // Exclude current element
    helper(index + 1, current);
  }

  helper(0, []);
  return result;
}
```

### 2. Power Set with Duplicates / Zbiór Potęgowy z Duplikatami

```javascript
function powerSetWithDuplicates(set) {
  set.sort(); // Sort to group duplicates
  const result = [[]];

  let startIndex = 0;
  for (let i = 0; i < set.length; i++) {
    // If duplicate, only add to subsets created in last iteration
    const isDuplicate = i > 0 && set[i] === set[i - 1];
    const start = isDuplicate ? startIndex : 0;

    startIndex = result.length;

    for (let j = start; j < startIndex; j++) {
      result.push([...result[j], set[i]]);
    }
  }

  return result;
}
```

### 3. Count Subsets (Without Generating) / Policz Podzbiory (Bez Generowania)

```javascript
function countSubsets(n) {
  return 1 << n; // 2^n using bit shift
}
```

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Small sets (1, 2, 3 elements)
- ✅ Larger sets (4, 5 elements)
- ✅ Empty set
- ✅ All four approaches verified
- ✅ Step-by-step example
- ✅ Bit manipulation visualization
- ✅ Performance comparison

---

## Interview Tips / Wskazówki do Rozmowy

1. **Clarify input:**
   - "Can the set have duplicates?" (usually no)
   - "What's the maximum size?" (affects approach)

2. **Explain the concept:**
   - "Power set contains all possible subsets"
   - "For n elements, we have 2^n subsets"

3. **Start simple:**
   - "Let me show the approach with {1, 2, 3}"
   - Draw the tree or show iteration

4. **Recommend iterative:**
   - "Iterative approach is clearest to explain"
   - "We start with [[]], then add each element to all existing subsets"

5. **Mention alternatives:**
   - "Recursive backtracking explores decision tree"
   - "Bit manipulation is clever for small sets"

6. **Complexity:**
   - "Time: O(n × 2^n) - we generate 2^n subsets, each takes O(n) to copy"
   - "Space: O(n × 2^n) - we must store all subsets"

7. **Edge cases:**
   - "Empty set returns [[]]"
   - "Large sets may cause memory issues"

---

## Key Takeaways / Kluczowe Wnioski

1. **Power set size:** Always 2^n for set of size n
   **Rozmiar zbioru potęgowego:** Zawsze 2^n dla zbioru rozmiaru n

2. **Each element:** Binary choice (include or exclude)
   **Każdy element:** Binarny wybór (uwzględnij lub wyklucz)

3. **Iterative approach** is clearest for interviews
   **Podejście iteracyjne** jest najjaśniejsze na rozmowach

4. **Bit manipulation** works well for small sets (n ≤ 20)
   **Manipulacja bitowa** działa dobrze dla małych zbiorów (n ≤ 20)

5. **Complexity is exponential** - cannot be improved
   **Złożoność jest wykładnicza** - nie można poprawić

6. Always **copy subsets** when adding to result
   Zawsze **kopiuj podzbiory** podczas dodawania do wyniku

7. **Start with empty set** [[]] as base case
   **Zacznij od zbioru pustego** [[]] jako przypadek bazowy

---

**Time Complexity:** O(n × 2^n) for all approaches
**Space Complexity:** O(n × 2^n) - must store all subsets
**Difficulty:** Medium / Średni
