# 8.12 Eight Queens

## Original Problem / Oryginalne Zadanie

**Eight Queens:** Write an algorithm to print all ways of arranging eight queens on an 8x8 chess board so that none of them share the same row, column, or diagonal. In this case, "diagonal" means all diagonals, not just the two that bisect the board.

Hints: #308, #350, #371

---

## Understanding the Problem / Zrozumienie Problemu

This is the classic **N-Queens problem** - a fundamental backtracking challenge!
To klasyczny **problem N-Hetmanów** - fundamentalne wyzwanie backtrackingowe!

### Queen Attack Rules / Zasady Ataku Hetmana

A queen can attack any piece in:
Hetman może zaatakować dowolną figurę w:

1. **Same row** / **Ten sam wiersz**
2. **Same column** / **Ta sama kolumna**
3. **Same diagonal** (both / and \) / **Ta sama diagonala** (obie / i \)

```
. . . Q . . . .   Queen at (0,3) attacks:
. . . . . . . .   - Row 0 (horizontal)
. . . . . . . .   - Column 3 (vertical)
Q . . X . . . X   - Both diagonals (/)(\)
. . . . . . . .
. . . . . . . .
. . . . . . . .
X . . . . . . .
```

### The Goal / Cel

Place 8 queens on 8×8 board so NO queen attacks another.
Umieść 8 hetmanów na planszy 8×8 tak, aby ŻADEN hetman nie atakował drugiego.

**Key insight:** Each row must have exactly ONE queen!
**Kluczowe spostrzeżenie:** Każdy wiersz musi mieć dokładnie JEDNEGO hetmana!

---

## Solution Approach: Backtracking / Podejście: Backtracking

### Strategy / Strategia

1. **Place queens row by row** (one per row guaranteed)
   **Umieszczaj hetmany wiersz po wierszu** (jeden na wiersz gwarantowany)

2. **For each row, try each column**
   **Dla każdego wiersza, spróbuj każdej kolumny**

3. **Check if position is valid** (no conflicts)
   **Sprawdź czy pozycja jest prawidłowa** (brak konfliktów)

4. **If valid, place queen and recurse to next row**
   **Jeśli prawidłowa, umieść hetmana i rekurencja do następnego wiersza**

5. **If reach end (row 8), found solution!**
   **Jeśli osiągniesz koniec (wiersz 8), znaleziono rozwiązanie!**

6. **If stuck, backtrack and try different position**
   **Jeśli utknąłeś, cofnij się i spróbuj innej pozycji**

### Implementation / Implementacja

```javascript
function solveNQueens(n = 8) {
  const results = [];
  const columns = []; // columns[row] = column of queen in that row

  placeQueens(0, columns, results, n);
  return results;
}

function placeQueens(row, columns, results, n) {
  // Base case: All queens placed / Przypadek bazowy: Wszystkie hetmany umieszczone
  if (row === n) {
    results.push([...columns]);
    return;
  }

  // Try each column in current row / Spróbuj każdej kolumny w bieżącym wierszu
  for (let col = 0; col < n; col++) {
    if (isValidPosition(columns, row, col)) {
      columns[row] = col;           // Place queen / Umieść hetmana
      placeQueens(row + 1, columns, results, n); // Recurse / Rekurencja
      // Backtrack happens automatically / Backtrack dzieje się automatycznie
    }
  }
}
```

### Validation: Check if Position is Valid / Walidacja: Sprawdź czy Pozycja jest Prawidłowa

```javascript
function isValidPosition(columns, row1, col1) {
  // Check all previously placed queens / Sprawdź wszystkie wcześniej umieszczone hetmany
  for (let row2 = 0; row2 < row1; row2++) {
    const col2 = columns[row2];

    // Same column? / Ta sama kolumna?
    if (col1 === col2) {
      return false;
    }

    // Same diagonal? / Ta sama diagonala?
    // Diagonal if: |row1 - row2| === |col1 - col2|
    // Diagonala jeśli: |wiersz1 - wiersz2| === |kol1 - kol2|
    if (Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
      return false;
    }
  }

  return true; // No conflicts / Brak konfliktów
}
```

### Why This Works / Dlaczego To Działa

**Row conflicts:** Impossible - we place one queen per row!
**Konflikty wierszy:** Niemożliwe - umieszczamy jednego hetmana na wiersz!

**Column conflicts:** Checked explicitly with `col1 === col2`
**Konflikty kolumn:** Sprawdzane jawnie z `kol1 === kol2`

**Diagonal conflicts:** Mathematical check!
**Konflikty diagonalne:** Matematyczne sprawdzenie!

```
Same diagonal if slope = ±1:
  Slope = (row1 - row2) / (col1 - col2)

For slope = ±1:
  row1 - row2 = ±(col1 - col2)
  |row1 - row2| = |col1 - col2|  ✓
```

---

## Visual Example / Przykład Wizualny

### 4-Queens Solution Process / Proces Rozwiązania 4-Hetmanów

```
Step 1: Place queen in row 0
Krok 1: Umieść hetmana w wierszu 0

Try col 0:        Try col 1:        Try col 2: ✓
Q . . .           . Q . .           . . Q .
. . . .           . . . .           . . . .
. . . .           . . . .           . . . .
. . . .           . . . .           . . . .

Step 2: Place queen in row 1 (with row 0 at col 2)
. . Q .
. . . .  ← Try each column...
. . . .
. . . .

Col 0: Diagonal conflict / Konflikt diagonalny
Col 1: Diagonal conflict / Konflikt diagonalny
Col 2: Column conflict / Konflikt kolumny
Col 3: Invalid / Nieprawidłowe

Backtrack! Try next position in row 0...
Cofnij się! Spróbuj następnej pozycji w wierszu 0...

Eventually find solution:
Ostatecznie znajdź rozwiązanie:

. Q . .
. . . Q
Q . . .
. . Q .

Columns: [1, 3, 0, 2]
```

---

## Key Insights / Kluczowe Spostrzeżenia

### 1. One Queen Per Row / Jeden Hetman Na Wiersz

By placing queens row by row, we guarantee:
Umieszczając hetmanów wiersz po wierszu, gwarantujemy:
- No two queens in same row / Żadne dwa hetmany w tym samym wierszu
- We only need to track column positions / Musimy tylko śledzić pozycje kolumn

**Data structure:** `columns[row] = col`
```javascript
columns = [1, 3, 0, 2] means:
  Row 0: Queen at column 1
  Row 1: Queen at column 3
  Row 2: Queen at column 0
  Row 3: Queen at column 2
```

### 2. Diagonal Check Math / Matematyka Sprawdzania Diagonalnej

Two positions `(r1, c1)` and `(r2, c2)` are on same diagonal if:
Dwie pozycje `(w1, k1)` i `(w2, k2)` są na tej samej diagonalnej jeśli:

```
|r1 - r2| === |c1 - c2|
```

**Why?** Slope of diagonal is ±1:
**Dlaczego?** Nachylenie diagonalnej to ±1:

```
/ diagonal: slope = -1 (row increases, col decreases)
\ diagonal: slope = +1 (row increases, col increases)
```

### 3. Backtracking is Automatic / Backtracking Jest Automatyczny

```javascript
for (let col = 0; col < n; col++) {
  if (isValidPosition(columns, row, col)) {
    columns[row] = col;              // Try this position / Spróbuj tej pozycji
    placeQueens(row + 1, ...);       // Recurse / Rekurencja
    // When recursion returns, we automatically try next col
    // Gdy rekurencja wraca, automatycznie próbujemy następnej kolumny
  }
}
```

No explicit "undo" needed - the loop tries next option!
Nie potrzeba jawnego "cofnięcia" - pętla próbuje następnej opcji!

### 4. Pruning Saves Time / Przycinanie Oszczędza Czas

Instead of trying all 8^8 possible placements:
Zamiast próbować wszystkich 8^8 możliwych rozmieszczenia:
- We prune invalid branches early / Przycinamy nieprawidłowe gałęzie wcześnie
- Check conflicts before recursing / Sprawdzamy konflikty przed rekurencją
- Dramatically reduces search space / Drastycznie zmniejsza przestrzeń przeszukiwania

---

## Optimization: Bitwise Approach / Optymalizacja: Podejście Bitowe

For even faster checking, use bitmasks:
Dla jeszcze szybszego sprawdzania, użyj masek bitowych:

```javascript
function countNQueensBitwise(n = 8) {
  let count = 0;

  function backtrack(row, cols, diag1, diag2) {
    if (row === n) {
      count++;
      return;
    }

    // Available positions: not in cols, diag1, or diag2
    let available = ((1 << n) - 1) & ~(cols | diag1 | diag2);

    while (available) {
      const position = available & -available; // Get rightmost bit
      available -= position;                   // Remove it

      backtrack(
        row + 1,
        cols | position,          // Mark column occupied
        (diag1 | position) << 1,  // Mark / diagonal
        (diag2 | position) >> 1   // Mark \ diagonal
      );
    }
  }

  backtrack(0, 0, 0, 0);
  return count;
}
```

**Advantages / Zalety:**
- O(1) conflict checking using bitwise operations / Sprawdzanie konfliktów O(1) używając operacji bitowych
- Faster than array-based approach / Szybsze niż podejście oparte na tablicach
- More memory efficient / Bardziej wydajne pamięciowo

---

## Common Mistakes / Częste Błędy

### 1. Checking Row Conflicts

```javascript
// ❌ WRONG - Unnecessary
if (row1 === row2) return false;

// ✅ CORRECT - Don't need to check rows!
// We place one queen per row, so row conflicts impossible
```

### 2. Wrong Diagonal Check

```javascript
// ❌ WRONG
if (row1 - row2 === col1 - col2) return false;

// ✅ CORRECT - Need absolute values
if (Math.abs(row1 - row2) === Math.abs(col1 - col2)) return false;
```

### 3. Modifying Array Without Copying

```javascript
// ❌ WRONG
results.push(columns); // Pushes reference, will change!

// ✅ CORRECT
results.push([...columns]); // Push a copy
```

### 4. Not Considering All Rows

```javascript
// ❌ WRONG - Only checks row 0
if (isValidPosition(columns, 0, col)) { ... }

// ✅ CORRECT - Check all previous rows
for (let row2 = 0; row2 < row1; row2++) { ... }
```

---

## Interesting Facts / Ciekawe Fakty

### Number of Solutions / Liczba Rozwiązań

| N | Solutions | Unique* |
|---|-----------|---------|
| 1 | 1 | 1 |
| 2 | 0 | 0 |
| 3 | 0 | 0 |
| 4 | 2 | 1 |
| 5 | 10 | 2 |
| 6 | 4 | 1 |
| 7 | 40 | 6 |
| 8 | **92** | **12** |
| 9 | 352 | 46 |
| 10 | 724 | 92 |

*Unique = not counting rotations and reflections
*Unikalne = nie licząc obrotów i odbić

### Pattern / Wzór

- **No solutions** exist for N=2 and N=3 / **Brak rozwiązań** dla N=2 i N=3
- Solutions exist for **N=1 or N≥4** / Rozwiązania istnieją dla **N=1 lub N≥4**
- Number of solutions grows rapidly! / Liczba rozwiązań rośnie szybko!

---

## Edge Cases / Przypadki Brzegowe

1. **N=1:** One solution - queen anywhere / Jedno rozwiązanie - hetman gdziekolwiek
   ```
   Q
   ```

2. **N=2:** No solution possible / Brak możliwego rozwiązania
   ```
   Q .    . Q
   . .    . .
   Both positions attack each other!
   ```

3. **N=3:** No solution possible / Brak możliwego rozwiązania

4. **N=4:** 2 solutions / 2 rozwiązania

---

## Applications / Zastosowania

1. **Constraint satisfaction problems:** General CSP solving / Ogólne rozwiązywanie CSP
2. **Resource allocation:** No conflicts / Alokacja zasobów: brak konfliktów
3. **Scheduling:** No overlapping constraints / Szeregowanie: brak nakładających się ograniczeń
4. **Graph coloring:** Similar backtracking approach / Podobne podejście backtrackingowe

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ 4-Queens (small visualization) / 4-Hetmany (mała wizualizacja)
- ✅ 8-Queens (classic problem, 92 solutions) / 8-Hetmanów (klasyczny problem, 92 rozwiązania)
- ✅ Bitwise optimization comparison / Porównanie optymalizacji bitowej
- ✅ Different board sizes N=1 to N=10 / Różne rozmiary planszy N=1 do N=10
- ✅ Edge cases (N=1,2,3) / Przypadki brzegowe
- ✅ Solution validation / Walidacja rozwiązań
- ✅ Performance benchmarks / Benchmarki wydajności

---

## Time & Space Complexity / Złożoność Czasowa i Pamięciowa

**Time:** O(N!)
- We try different column permutations / Próbujemy różnych permutacji kolumn
- But pruning reduces actual work significantly / Ale przycinanie znacznie zmniejsza rzeczywistą pracę
- In practice, much better than brute force / W praktyce, znacznie lepiej niż brute force

**Space:** O(N)
- Recursion depth: N rows / Głębokość rekurencji: N wierszy
- Storing column positions: N integers / Przechowywanie pozycji kolumn: N liczb całkowitych

---

## Interview Tips / Wskazówki do Rozmowy

1. **Start with small example:** "Let me first solve 4-Queens to show the approach."
   **Zacznij od małego przykładu:** "Najpierw rozwiążę 4-Hetmanów aby pokazać podejście."

2. **Explain row-by-row strategy:** "Placing one queen per row guarantees no row conflicts."
   **Wyjaśnij strategię wiersz-po-wierszu:** "Umieszczanie jednego hetmana na wiersz gwarantuje brak konfliktów wierszy."

3. **Show diagonal math:** "Two positions are on same diagonal if |r1-r2| = |c1-c2|."
   **Pokaż matematykę diagonalną:** "Dwie pozycje są na tej samej diagonalnej jeśli |w1-w2| = |k1-k2|."

4. **Mention optimization:** "For better performance, I can use bitmasks instead of arrays."
   **Wspomnij optymalizację:** "Dla lepszej wydajności, mogę użyć masek bitowych zamiast tablic."

5. **Discuss pruning:** "Backtracking prunes invalid branches early, making this much faster than brute force."
   **Omów przycinanie:** "Backtracking przycina nieprawidłowe gałęzie wcześnie, czyniąc to znacznie szybszym niż brute force."

---

## Key Takeaways / Kluczowe Wnioski

1. **Classic backtracking problem** - try, check, recurse, backtrack
   **Klasyczny problem backtrackingowy** - próbuj, sprawdzaj, rekurencja, cofaj się

2. **One queen per row** simplifies problem significantly
   **Jeden hetman na wiersz** znacznie upraszcza problem

3. **Diagonal check:** `|r1-r2| === |c1-c2|`
   **Sprawdzanie diagonalne:** `|w1-w2| === |k1-k2|`

4. **Pruning is key** - check validity before recursing
   **Przycinanie jest kluczowe** - sprawdzaj poprawność przed rekurencją

5. **92 solutions for 8-Queens** (12 unique)
   **92 rozwiązania dla 8-Hetmanów** (12 unikalnych)

---

**Time Complexity:** O(N!) with pruning
**Space Complexity:** O(N)
**Difficulty:** Hard / Trudny
