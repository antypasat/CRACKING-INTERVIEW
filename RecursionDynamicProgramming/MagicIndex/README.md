# 8.3 Magic Index

## Original Problem / Oryginalne Zadanie

**Magic Index:** A magic index in an array `A[0...n-1]` is defined to be an index such that `A[i] = i`. Given a sorted array of distinct integers, write a method to find a magic index, if one exists, in array A.

**FOLLOW UP:** What if the values are not distinct?

**Magiczny Indeks:** Magiczny indeks w tablicy `A[0...n-1]` jest zdefiniowany jako indeks taki że `A[i] = i`. Dana jest posortowana tablica różnych liczb całkowitych, napisz metodę znajdującą magiczny indeks, jeśli istnieje, w tablicy A.

**UZUPEŁNIENIE:** Co jeśli wartości nie są różne?

Hints: #170, #204, #240, #286, #340

---

## Understanding the Problem / Zrozumienie Problemu

We're looking for an index where **the index equals the value**.
Szukamy indeksu gdzie **indeks równa się wartości**.

```
Example / Przykład:

Array: [-10, -5, 2, 3, 7, 9, 12, 13]
Index:   0   1  2  3  4  5   6   7
                  ^^
         Magic index at position 3 (A[3] = 3)

Array: [0, 2, 5, 8, 17]
Index: 0  1  2  3   4
       ^^
       Magic index at position 0 (A[0] = 0)

Array: [-10, -5, -1, 0, 1, 2, 4, 6]
Index:   0   1   2  3  4  5  6  7
                            No magic index!
```

### Key Properties / Kluczowe Właściwości

1. **Array is sorted** - enables binary search
   **Tablica jest posortowana** - umożliwia wyszukiwanie binarne

2. **Looking for A[i] = i** - specific condition
   **Szukamy A[i] = i** - konkretny warunek

3. **Distinct vs Non-Distinct** - changes approach
   **Różne vs Nierozróżnialne** - zmienia podejście

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Linear Search / Wyszukiwanie Liniowe

**Strategy:** Check every element
**Strategia:** Sprawdź każdy element

```javascript
function magicIndexLinear(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === i) {
      return i;
    }
  }
  return -1;
}
```

**Time:** O(n) - must check all elements
**Space:** O(1) - no extra space

**When to use:** Small arrays, or as baseline
**Kiedy używać:** Małe tablice lub jako punkt odniesienia

---

### Approach 2: Binary Search (Distinct Values) / Wyszukiwanie Binarne (Różne Wartości)

**Strategy:** Use sorted property to eliminate half the search space
**Strategia:** Użyj właściwości posortowania aby wyeliminować połowę przestrzeni

```javascript
function magicIndexBinaryDistinct(arr) {
  return helper(arr, 0, arr.length - 1);
}

function helper(arr, start, end) {
  if (start > end) return -1;

  const mid = Math.floor((start + end) / 2);

  if (arr[mid] === mid) {
    return mid;  // Found it!
  }

  if (arr[mid] > mid) {
    // Magic index must be on left
    return helper(arr, start, mid - 1);
  } else {
    // Magic index must be on right
    return helper(arr, mid + 1, end);
  }
}
```

**Why this works / Dlaczego to działa:**

```
If arr[mid] > mid:
  Example: arr[5] = 10

  Since array is sorted and values are distinct:
  - arr[6] ≥ arr[5] + 1 = 11 > 6
  - arr[7] ≥ arr[6] + 1 ≥ 12 > 7
  - arr[8] ≥ arr[7] + 1 ≥ 13 > 8

  All elements to the right have value > index
  → Magic index must be on LEFT

If arr[mid] < mid:
  Example: arr[5] = 2

  Since array is sorted and values are distinct:
  - arr[4] ≤ arr[5] - 1 = 1 < 4
  - arr[3] ≤ arr[4] - 1 ≤ 0 < 3
  - arr[2] ≤ arr[3] - 1 ≤ -1 < 2

  All elements to the left have value < index
  → Magic index must be on RIGHT
```

**Visual Example / Przykład Wizualny:**

```
Array: [-10, -5, 2, 3, 7, 9, 12, 13]
Index:   0   1  2  3  4  5   6   7

Step 1: Check mid = 3
  arr[3] = 3 → FOUND!

Another example:
Array: [-10, -5, 2, 5, 7, 9, 12, 13]
Index:   0   1  2  3  4  5   6   7

Step 1: mid = 3, arr[3] = 5 > 3
  → Search left: [0, 1, 2]

Step 2: mid = 1, arr[1] = -5 < 1
  → Search right: [2]

Step 3: mid = 2, arr[2] = 2
  → FOUND at index 2!
```

**Time:** O(log n) - binary search / wyszukiwanie binarne
**Space:** O(log n) - recursion stack / stos rekurencji

✅ **OPTIMAL for distinct values / OPTYMALNE dla różnych wartości**

---

### Approach 3: Binary Search (Non-Distinct Values) / Wyszukiwanie Binarne (Wartości Nierozróżnialne)

**Problem with duplicates / Problem z duplikatami:**

```
Array: [-10, -5, 2, 2, 2, 5, 5, 7, 9, 12, 13]
Index:   0   1  2  3  4  5  6  7  8   9  10

At mid = 5, arr[5] = 5 (magic!)

But if arr[5] = 2:
  - We can't eliminate right side (arr[7] might be 7)
  - We can't eliminate left side (arr[2] might be 2)
  - We must search BOTH sides!
```

**Strategy:** Search both sides, but optimize bounds
**Strategia:** Przeszukaj obie strony, ale optymalizuj granice

```javascript
function magicIndexBinaryNonDistinct(arr) {
  return helper(arr, 0, arr.length - 1);
}

function helper(arr, start, end) {
  if (start > end) return -1;

  const mid = Math.floor((start + end) / 2);
  const midValue = arr[mid];

  if (midValue === mid) {
    return mid;
  }

  // Search left: optimize end point
  // If arr[mid] = 5 and mid = 7,
  // then arr[6] can't be 6 (sorted array)
  // So only search up to min(mid-1, midValue)
  const leftEnd = Math.min(mid - 1, midValue);
  const leftResult = helper(arr, start, leftEnd);
  if (leftResult !== -1) return leftResult;

  // Search right: optimize start point
  // If arr[mid] = 3 and mid = 1,
  // then arr[2] can't be 2 (sorted array)
  // So only search from max(mid+1, midValue)
  const rightStart = Math.max(mid + 1, midValue);
  return helper(arr, rightStart, end);
}
```

**Optimization Visualization / Wizualizacja Optymalizacji:**

```
Array: [-10, -5, 2, 2, 2, 5, 5, 7, 9, 12, 13]
Index:   0   1  2  3  4  5  6  7  8   9  10

mid = 5, arr[5] = 5 → MAGIC!

Another example:
Array: [-10, -5, 2, 2, 2, 7, 7, 8, 9, 12, 13]
Index:   0   1  2  3  4  5  6  7  8   9  10

mid = 5, arr[5] = 7

Left search:
  Normal: search [0, 4]
  Optimized: search [0, min(4, 7)] = [0, 4]
  → Check indices 0-4

Right search:
  Normal: search [6, 10]
  Optimized: search [max(6, 7), 10] = [7, 10]
  → Skip index 6! (arr[6] can't be 6 if arr[5]=7 and sorted)
```

**Time:** O(n) worst case, but better in practice
**Space:** O(log n) - recursion stack

---

## Comparison / Porównanie

| Approach / Podejście | Time | Space | Best For / Najlepsze Dla |
|---|---|---|---|
| Linear Search | O(n) | O(1) | Small arrays / Małe tablice |
| Binary (Distinct) | **O(log n)** | O(log n) | **Distinct sorted values** |
| Binary (Non-Distinct) | O(n) worst | O(log n) | Duplicates, better avg than linear |

---

## Key Insights / Kluczowe Spostrzeżenia

### 1. Why Binary Search Works (Distinct) / Dlaczego Wyszukiwanie Binarne Działa (Różne)

**Mathematical proof / Dowód matematyczny:**

```
If values are distinct and sorted:

Case 1: arr[i] > i
  - arr[i+1] ≥ arr[i] + 1  (sorted, distinct)
  - arr[i+1] ≥ i + 2       (substitution)
  - arr[i+1] > i + 1       (simplify)
  → arr[i+1] > its index
  → All elements to right have value > index

Case 2: arr[i] < i
  - arr[i-1] ≤ arr[i] - 1  (sorted, distinct)
  - arr[i-1] ≤ i - 2       (substitution)
  - arr[i-1] < i - 1       (simplify)
  → arr[i-1] < its index
  → All elements to left have value < index

Therefore: We can safely eliminate one half!
```

### 2. Why Duplicates Complicate Things / Dlaczego Duplikaty Komplikują

```
With duplicates:

Array: [2, 2, 2, 2, 2, 2, 6, 7]
Index: 0  1  2  3  4  5  6  7
              ^^

At mid=3, arr[3]=2 < 3

Normal binary search says: search right
But arr[2] = 2 is a magic index on the LEFT!

The distinct value proof breaks down.
Must search both sides.
```

### 3. Optimization for Non-Distinct / Optymalizacja dla Nierozróżnialnych

```
Key insight: Use the value to skip indices

If arr[mid] = v and mid = m:

Left side:
  If v < m: Can skip [v+1, m-1]
  Why? If arr[m] = v and sorted,
       then arr[v+1] to arr[m-1] must be ≥ v+1
       So they can't equal their indices

Right side:
  If v > m: Can skip [m+1, v-1]
  Why? If arr[m] = v and sorted,
       then arr[m+1] to arr[v-1] must be ≤ v-1
       So they can't equal their indices
```

---

## Common Mistakes / Częste Błędy

### 1. Using Binary Search for Non-Distinct Without Modification / Używanie Wyszukiwania Binarnego dla Nierozróżnialnych Bez Modyfikacji

```javascript
// ❌ WRONG - misses magic indices with duplicates
function magicIndex(arr, start, end) {
  const mid = Math.floor((start + end) / 2);
  if (arr[mid] === mid) return mid;

  if (arr[mid] > mid) {
    return magicIndex(arr, start, mid - 1);  // Only searches left
  } else {
    return magicIndex(arr, mid + 1, end);    // Only searches right
  }
}

// ✅ CORRECT - searches both sides for non-distinct
function magicIndex(arr, start, end) {
  // ... search both left and right ...
}
```

### 2. Not Optimizing Bounds for Non-Distinct / Nie Optymalizowanie Granic dla Nierozróżnialnych

```javascript
// ❌ INEFFICIENT - searches entire range
const leftResult = helper(arr, start, mid - 1);
const rightResult = helper(arr, mid + 1, end);

// ✅ OPTIMIZED - uses value to skip indices
const leftEnd = Math.min(mid - 1, arr[mid]);
const rightStart = Math.max(mid + 1, arr[mid]);
const leftResult = helper(arr, start, leftEnd);
const rightResult = helper(arr, rightStart, end);
```

### 3. Forgetting Base Case / Zapominanie o Przypadku Bazowym

```javascript
// ❌ WRONG - infinite recursion
function helper(arr, start, end) {
  const mid = Math.floor((start + end) / 2);
  if (arr[mid] === mid) return mid;
  // ... recurse ...
}

// ✅ CORRECT - check bounds first
function helper(arr, start, end) {
  if (start > end) return -1;  // Base case!
  // ... rest of logic ...
}
```

---

## Edge Cases / Przypadki Brzegowe

```javascript
1. Empty array: [] → -1

2. Single element (magic): [0] → 0

3. Single element (not magic): [5] → -1

4. All values too small: [-10, -5, -1, 0, 1] → -1

5. All values too large: [10, 11, 12, 13] → -1

6. All indices magic: [0, 1, 2, 3, 4] → 0 (or any)

7. Magic at start: [0, 5, 10, 15] → 0

8. Magic at end: [-5, -2, 0, 1, 2, 5] → 5

9. Multiple magic (duplicates): [2, 2, 2, 5, 5] → 2 or 5

10. All same value: [5, 5, 5, 5, 5, 5] → 5
```

---

## Extensions / Rozszerzenia

### 1. Find All Magic Indices / Znajdź Wszystkie Magiczne Indeksy

```javascript
function findAllMagicIndices(arr) {
  const results = [];
  helper(arr, 0, arr.length - 1, results);
  return results;
}

function helper(arr, start, end, results) {
  if (start > end) return;

  const mid = Math.floor((start + end) / 2);

  if (arr[mid] === mid) {
    results.push(mid);
  }

  // Search both sides
  helper(arr, start, Math.min(mid - 1, arr[mid]), results);
  helper(arr, Math.max(mid + 1, arr[mid]), end, results);
}
```

### 2. Find Magic Index in Unsorted Array / Znajdź Magiczny Indeks w Nieposortowanej Tablicy

```javascript
// Must use linear search - O(n)
function magicIndexUnsorted(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === i) return i;
  }
  return -1;
}
```

### 3. Magic Index in 2D Array / Magiczny Indeks w Tablicy 2D

```javascript
// Find (i, j) where arr[i][j] = i * cols + j
function magicIndex2D(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const expectedValue = i * cols + j;
      if (matrix[i][j] === expectedValue) {
        return [i, j];
      }
    }
  }
  return null;
}
```

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Simple cases with magic index
- ✅ Magic at start, middle, end
- ✅ No magic index (too small/large)
- ✅ Multiple magic indices (duplicates)
- ✅ All same value
- ✅ Sequential values (all magic)
- ✅ Edge cases (empty, single element)
- ✅ Performance comparison
- ✅ All approaches verified

---

## Interview Tips / Wskazówki do Rozmowy

1. **Clarify constraints:**
   - "Are values distinct?" (affects approach)
   - "Is the array sorted?" (yes, stated in problem)
   - "What if multiple magic indices?" (return any)

2. **Start with brute force:**
   - "Linear search is O(n), checking each element"
   - "But we can do better with binary search"

3. **Explain binary search optimization:**
   - "If arr[mid] > mid, all elements to the right are also > their indices"
   - "This is because the array is sorted and values are distinct"

4. **Handle follow-up (duplicates):**
   - "With duplicates, we can't eliminate one side completely"
   - "But we can still optimize using the value to skip indices"

5. **Complexity analysis:**
   - "Distinct: O(log n) time with binary search"
   - "Non-distinct: O(n) worst case, but better than linear in practice"

6. **Draw it out:**
   - Show example array with indices
   - Mark where arr[i] = i
   - Trace through binary search

---

## Key Takeaways / Kluczowe Wnioski

1. **Sorted + Distinct = Binary Search** is optimal
   **Posortowane + Różne = Wyszukiwanie Binarne** jest optymalne

2. **Key property:** If `arr[mid] > mid`, magic index must be left
   **Kluczowa właściwość:** Jeśli `arr[mid] > mid`, magiczny indeks musi być po lewej

3. **Duplicates complicate** - must search both sides
   **Duplikaty komplikują** - trzeba przeszukać obie strony

4. **Optimization for duplicates:** Use value to skip indices
   **Optymalizacja dla duplikatów:** Użyj wartości do pominięcia indeksów

5. **Time complexity:**
   - Distinct: O(log n)
   - Non-distinct: O(n) worst, better average
   - Linear: Always O(n)

6. Recognize this as a **modified binary search** problem
   Rozpoznaj to jako problem **zmodyfikowanego wyszukiwania binarnego**

---

**Time Complexity:** O(log n) for distinct, O(n) for non-distinct
**Space Complexity:** O(log n) for recursion stack
**Difficulty:** Easy-Medium / Łatwy-Średni
