# 8.13 Stack of Boxes

## Original Problem / Oryginalne Zadanie

**Stack of Boxes:** You have a stack of n boxes, with widths w<sub>i</sub>, heights h<sub>i</sub>, and depths d<sub>i</sub>. The boxes cannot be rotated and can only be stacked on top of one another if each box in the stack is strictly larger than the box above it in width, height, and depth. Implement a method to compute the height of the tallest possible stack. The height of a stack is the sum of the heights of each box.

Hints: #155, #194, #214, #260, #322, #368, #378

---

## Understanding the Problem / Zrozumienie Problemu

Build the **tallest stack** of boxes following these rules:
Zbuduj **najwyższy stos** pudełek według tych zasad:

### Constraints / Ograniczenia

1. **Strict ordering:** Box on top must be **strictly smaller** in ALL dimensions
   **Ścisła kolejność:** Pudełko na górze musi być **ściśle mniejsze** we WSZYSTKICH wymiarach

2. **No rotation:** Boxes have fixed orientation / Pudełka mają ustaloną orientację

3. **Not all boxes must be used:** Pick subset that maximizes height
   **Nie wszystkie pudełka muszą być użyte:** Wybierz podzbiór maksymalizujący wysokość

### Example / Przykład

```
Boxes:
  A: 10×10×10 (width × height × depth)
  B: 8×8×8
  C: 6×6×6
  D: 4×4×4

Valid stack (bottom to top):
  A (10×10×10)
  B (8×8×8)    ✓ 8 < 10 in all dimensions
  C (6×6×6)    ✓ 6 < 8 in all dimensions
  D (4×4×4)    ✓ 4 < 6 in all dimensions

Total height = 10 + 8 + 6 + 4 = 28

Invalid stack:
  A (10×10×10)
  E (8×12×8)   ✗ 12 > 10 (height exceeds)
```

### Key Insight / Kluczowe Spostrzeżenie

This is similar to **Longest Increasing Subsequence (LIS)**, but with 3D constraints!
To jest podobne do **Najdłuższego Rosnącego Podciągu (LIS)**, ale z ograniczeniami 3D!

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Recursive (Try All Combinations)

**Strategy:** For each box, try using it as bottom and recursively build on top
**Strategia:** Dla każdego pudełka, spróbuj użyć go jako podstawy i rekurencyjnie buduj na górze

```javascript
function maxStackHeight(boxes) {
  let maxHeight = 0;

  // Try each box as the bottom / Spróbuj każdego pudełka jako podstawy
  for (let i = 0; i < boxes.length; i++) {
    const height = maxStackHelper(boxes, i);
    maxHeight = Math.max(maxHeight, height);
  }

  return maxHeight;
}

function maxStackHelper(boxes, bottomIndex) {
  const bottom = boxes[bottomIndex];
  let maxHeight = 0;

  // Try placing each compatible box on top / Spróbuj umieścić każde kompatybilne pudełko na górze
  for (let i = 0; i < boxes.length; i++) {
    if (i !== bottomIndex && boxes[i].canBeAbove(bottom)) {
      const height = maxStackHelper(boxes, i);
      maxHeight = Math.max(maxHeight, height);
    }
  }

  return bottom.height + maxHeight;
}
```

**Checking compatibility / Sprawdzanie kompatybilności:**
```javascript
class Box {
  canBeAbove(other) {
    // All dimensions must be strictly smaller / Wszystkie wymiary muszą być ściśle mniejsze
    return this.width < other.width &&
           this.height < other.height &&
           this.depth < other.depth;
  }
}
```

**Pros:** Simple to understand / Proste do zrozumienia
**Cons:** O(2^n) - exponential! / Wykładnicze!

---

### Approach 2: DP with Memoization (Top-Down)

**Strategy:** Cache results to avoid recomputing same subproblems
**Strategia:** Cache'uj wyniki aby uniknąć ponownego obliczania tych samych podproblemów

```javascript
function maxStackHeightMemo(boxes) {
  // Sort by base area for optimization / Sortuj według powierzchni podstawy dla optymalizacji
  boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

  const memo = new Map();
  let maxHeight = 0;

  for (let i = 0; i < boxes.length; i++) {
    const height = maxStackHelper(boxes, i, memo);
    maxHeight = Math.max(maxHeight, height);
  }

  return maxHeight;
}

function maxStackHelper(boxes, bottomIndex, memo) {
  if (memo.has(bottomIndex)) {
    return memo.get(bottomIndex);
  }

  const bottom = boxes[bottomIndex];
  let maxHeight = 0;

  // Try boxes that can go on top / Spróbuj pudełka które mogą iść na górę
  for (let i = bottomIndex + 1; i < boxes.length; i++) {
    if (boxes[i].canBeAbove(bottom)) {
      const height = maxStackHelper(boxes, i, memo);
      maxHeight = Math.max(maxHeight, height);
    }
  }

  const result = bottom.height + maxHeight;
  memo.set(bottomIndex, result);
  return result;
}
```

**Why sorting helps / Dlaczego sortowanie pomaga:**
- Larger boxes come first / Większe pudełka najpierw
- Only need to check boxes AFTER current one / Tylko trzeba sprawdzić pudełka PO bieżącym
- Reduces search space / Zmniejsza przestrzeń przeszukiwania

**Pros:** Much faster than recursive / Dużo szybsze niż rekurencyjne
**Cons:** Still uses recursion stack / Nadal używa stosu rekurencji

---

### Approach 3: Bottom-Up DP (OPTIMAL!)

**Strategy:** Build solution from smallest boxes up, like LIS
**Strategia:** Buduj rozwiązanie od najmniejszych pudełek w górę, jak LIS

```javascript
function maxStackHeightDP(boxes) {
  // Sort by base area (descending) / Sortuj według powierzchni podstawy (malejąco)
  boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

  const n = boxes.length;
  const dp = new Array(n);

  // Base case: Each box alone / Przypadek bazowy: Każde pudełko samo
  for (let i = 0; i < n; i++) {
    dp[i] = boxes[i].height;
  }

  // For each box, find best stack it can be placed on
  // Dla każdego pudełka, znajdź najlepszy stos na który może być umieszczone
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // If box i can go on top of box j / Jeśli pudełko i może iść na pudełko j
      if (boxes[i].canBeAbove(boxes[j])) {
        dp[i] = Math.max(dp[i], dp[j] + boxes[i].height);
      }
    }
  }

  // Return maximum across all stacks / Zwróć maksimum ze wszystkich stosów
  return Math.max(...dp);
}
```

**How it works / Jak to działa:**

```
Boxes (sorted by base area):
  0: Box(10×10×10)
  1: Box(8×8×8)
  2: Box(6×6×6)

dp[i] = max height of stack with box i on top
        maksymalna wysokość stosu z pudełkiem i na górze

Initialize:
  dp = [10, 8, 6]  // Each box alone

Process box 1 (8×8×8):
  Can it go on box 0? Yes! (8 < 10 in all dims)
  dp[1] = max(8, dp[0] + 8) = max(8, 18) = 18

Process box 2 (6×6×6):
  Can it go on box 0? Yes!
  dp[2] = max(6, dp[0] + 6) = max(6, 16) = 16

  Can it go on box 1? Yes!
  dp[2] = max(16, dp[1] + 6) = max(16, 24) = 24

Final dp = [10, 18, 24]
Maximum = 24 ✓
```

**Pros:**
- O(n²) time / O(n²) czas
- O(n) space / O(n) przestrzeń
- No recursion / Bez rekurencji
- **Optimal!** / **Optymalne!**

**Cons:** None for this problem / Brak dla tego problemu

---

## Comparison with LIS / Porównanie z LIS

### Longest Increasing Subsequence (LIS)

```javascript
// 1D: Just compare values / 1D: Tylko porównuj wartości
if (arr[i] > arr[j]) {
  dp[i] = max(dp[i], dp[j] + 1);
}
```

### Stack of Boxes (3D LIS)

```javascript
// 3D: Compare all dimensions / 3D: Porównaj wszystkie wymiary
if (boxes[i].canBeAbove(boxes[j])) {
  dp[i] = max(dp[i], dp[j] + boxes[i].height);
}
```

**Key difference:** Instead of counting length, we sum heights!
**Kluczowa różnica:** Zamiast liczyć długość, sumujemy wysokości!

---

## Why Sorting Helps / Dlaczego Sortowanie Pomaga

### Without Sorting / Bez Sortowania

```javascript
// Must check ALL boxes
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {  // Check all j
    if (i !== j && boxes[i].canBeAbove(boxes[j])) { ... }
  }
}
```

### With Sorting / Z Sortowaniem

```javascript
// Only check PREVIOUS boxes (j < i)
boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) {  // Only j < i
    if (boxes[i].canBeAbove(boxes[j])) { ... }
  }
}
```

**Benefit:** Sorted by base area ensures larger boxes come first
**Korzyść:** Sortowanie według powierzchni podstawy zapewnia że większe pudełka są pierwsze

---

## Stack Reconstruction / Rekonstrukcja Stosu

To get the actual stack (not just height):
Aby dostać rzeczywisty stos (nie tylko wysokość):

```javascript
function maxStackWithReconstruction(boxes) {
  boxes.sort((a, b) => (b.width * b.depth) - (a.width * a.depth));

  const n = boxes.length;
  const dp = new Array(n);
  const parent = new Array(n).fill(-1);  // Track parent for reconstruction

  // Initialize / Inicjalizuj
  for (let i = 0; i < n; i++) {
    dp[i] = boxes[i].height;
  }

  // Fill DP table / Wypełnij tabelę DP
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (boxes[i].canBeAbove(boxes[j])) {
        if (dp[j] + boxes[i].height > dp[i]) {
          dp[i] = dp[j] + boxes[i].height;
          parent[i] = j;  // Remember which box is below / Zapamiętaj które pudełko jest poniżej
        }
      }
    }
  }

  // Find max / Znajdź max
  let maxHeight = 0;
  let maxIndex = -1;
  for (let i = 0; i < n; i++) {
    if (dp[i] > maxHeight) {
      maxHeight = dp[i];
      maxIndex = i;
    }
  }

  // Reconstruct stack / Rekonstruuj stos
  const stack = [];
  let current = maxIndex;
  while (current !== -1) {
    stack.push(boxes[current]);
    current = parent[current];
  }
  stack.reverse();  // Bottom to top / Od dołu do góry

  return { height: maxHeight, stack };
}
```

---

## Common Mistakes / Częste Błędy

### 1. Using >= Instead of >

```javascript
// ❌ WRONG - boxes with equal dimensions can't stack
if (this.width <= other.width) { ... }

// ✅ CORRECT - must be strictly smaller
if (this.width < other.width) { ... }
```

### 2. Checking Only Some Dimensions

```javascript
// ❌ WRONG - must check ALL dimensions
if (this.width < other.width && this.height < other.height) { ... }

// ✅ CORRECT - all three dimensions
if (this.width < other.width &&
    this.height < other.height &&
    this.depth < other.depth) { ... }
```

### 3. Not Sorting Boxes

```javascript
// ❌ WRONG - inefficient, must check all pairs
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (i !== j && ...) { ... }
  }
}

// ✅ CORRECT - sort first, only check previous
boxes.sort(...);
for (let i = 0; i < n; i++) {
  for (let j = 0; j < i; j++) { ... }
}
```

### 4. Initializing DP to 0

```javascript
// ❌ WRONG
const dp = new Array(n).fill(0);

// ✅ CORRECT - each box alone has its own height
for (let i = 0; i < n; i++) {
  dp[i] = boxes[i].height;
}
```

---

## Edge Cases / Przypadki Brzegowe

1. **Single box:** Return its height / Zwróć jego wysokość
   ```javascript
   boxes = [Box(5×10×5)] → height = 10
   ```

2. **No boxes can stack:** Return max individual height
   ```javascript
   boxes = [Box(5×10×5), Box(10×5×10)] → height = 10
   ```

3. **All boxes identical:** Only one can be used
   ```javascript
   boxes = [Box(5×5×5), Box(5×5×5)] → height = 5
   ```

4. **Perfect nesting:** All boxes stack
   ```javascript
   boxes = [Box(10×10×10), Box(8×8×8), Box(6×6×6)]
   → height = 10 + 8 + 6 = 24
   ```

---

## Applications / Zastosowania

1. **Packing problems:** Container optimization / Optymalizacja kontenerów
2. **Scheduling:** Tasks with multiple constraints / Zadania z wieloma ograniczeniami
3. **Resource allocation:** Hierarchical dependencies / Hierarchiczne zależności
4. **3D modeling:** Object placement with constraints / Umieszczanie obiektów z ograniczeniami

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Perfect nesting (all boxes stack) / Idealne zagnieżdżenie
- ✅ Partial stacking (some boxes incompatible) / Częściowe układanie
- ✅ Multiple valid stacks (need to find best) / Wiele prawidłowych stosów
- ✅ No valid stacks / Brak prawidłowych stosów
- ✅ Edge cases (single box, identical boxes) / Przypadki brzegowe
- ✅ Stack reconstruction / Rekonstrukcja stosu
- ✅ Stack validation / Walidacja stosu
- ✅ All approaches verified / Wszystkie podejścia zweryfikowane

---

## Time & Space Complexity / Złożoność Czasowa i Pamięciowa

| Approach | Time | Space | Notes |
|---|---|---|---|
| Recursive | O(2^n) | O(n) | Too slow / Za wolne |
| Memoization | O(n²) | O(n) | Good / Dobre |
| Bottom-Up DP | O(n²) | O(n) | **Optimal** |

**Note:** Sorting adds O(n log n), but dominated by O(n²) DP
**Uwaga:** Sortowanie dodaje O(n log n), ale dominuje O(n²) DP

---

## Interview Tips / Wskazówki do Rozmowy

1. **Recognize pattern:** "This is like Longest Increasing Subsequence but in 3D."
   **Rozpoznaj wzór:** "To jest jak Najdłuższy Rosnący Podciąg ale w 3D."

2. **Mention sorting:** "I'll sort boxes by base area to optimize the search."
   **Wspomnij sortowanie:** "Posortuję pudełka według powierzchni podstawy aby zoptymalizować wyszukiwanie."

3. **Explain strict comparison:** "All three dimensions must be strictly smaller, not equal."
   **Wyjaśnij ścisłe porównanie:** "Wszystkie trzy wymiary muszą być ściśle mniejsze, nie równe."

4. **Discuss DP state:** "dp[i] represents max height of stack with box i on top."
   **Omów stan DP:** "dp[i] reprezentuje max wysokość stosu z pudełkiem i na górze."

5. **Offer reconstruction:** "I can also reconstruct the actual stack using parent pointers."
   **Zaproponuj rekonstrukcję:** "Mogę też zrekonstruować rzeczywisty stos używając wskaźników rodzica."

---

## Key Takeaways / Kluczowe Wnioski

1. **Similar to LIS** but with 3D constraints and sum instead of count
   **Podobne do LIS** ale z ograniczeniami 3D i sumą zamiast licznika

2. **Sorting optimization** reduces comparisons from n² to n(n-1)/2
   **Optymalizacja sortowania** zmniejsza porównania z n² do n(n-1)/2

3. **All dimensions must be strictly smaller** for valid stacking
   **Wszystkie wymiary muszą być ściśle mniejsze** dla prawidłowego układania

4. **DP recurrence:** `dp[i] = max(dp[i], dp[j] + boxes[i].height)` for valid j
   **Rekurencja DP:** `dp[i] = max(dp[i], dp[j] + boxes[i].height)` dla prawidłowych j

5. **Can reconstruct stack** using parent pointers
   **Można zrekonstruować stos** używając wskaźników rodzica

---

**Time Complexity:** O(n²) with sorting / O(n²) z sortowaniem
**Space Complexity:** O(n)
**Difficulty:** Medium-Hard / Średnio-Trudny
