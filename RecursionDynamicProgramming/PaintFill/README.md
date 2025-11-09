# 8.10 Paint Fill

## Original Problem / Oryginalne Zadanie

**Paint Fill:** Implement the "paint fill" function that one might see on many image editing programs. That is, given a screen (represented by a two-dimensional array of colors), a point, and a new color, fill in the surrounding area until the color changes from the original color.

Hints: #364, #382

---

## Understanding the Problem / Zrozumienie Problemu

This is the classic **flood fill algorithm** - the same one used in:
To jest klasyczny **algorytm zalewania** - ten sam używany w:

- Paint programs (paint bucket tool / narzędzie wiaderka farby)
- Minesweeper (revealing connected cells / odkrywanie połączonych pól)
- Image editing (magic wand selection / zaznaczenie różdżką)

### Input / Wejście
```javascript
screen = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1]
]
point = (1, 1)  // row, column / wiersz, kolumna
newColor = 2
```

### Output / Wyjście
```javascript
[
  [2, 2, 2],
  [2, 2, 0],  // Only connected 1's become 2 / Tylko połączone 1 stają się 2
  [2, 0, 1]   // Bottom-right 1 is isolated / Prawy dolny 1 jest izolowany
]
```

### Key Concepts / Kluczowe Koncepcje

1. **Connected pixels:** Pixels sharing an edge (4-directional: up, down, left, right)
   **Połączone piksele:** Piksele dzielące krawędź (4 kierunki: góra, dół, lewo, prawo)

2. **Original color:** The color at the starting point
   **Oryginalny kolor:** Kolor w punkcie startowym

3. **Fill area:** All pixels connected to start point with same original color
   **Obszar wypełnienia:** Wszystkie piksele połączone z punktem startowym o tym samym oryginalnym kolorze

---

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Recursive DFS

**Strategy:** Use recursion to explore all connected pixels
**Strategia:** Użyj rekurencji do eksploracji wszystkich połączonych pikseli

```javascript
function paintFillRecursive(screen, row, col, newColor) {
  const originalColor = screen[row][col];

  // Early exit if already target color / Wczesne wyjście jeśli już docelowy kolor
  if (originalColor === newColor) return screen;

  paintFillRecurse(screen, row, col, originalColor, newColor);
  return screen;
}

function paintFillRecurse(screen, row, col, originalColor, newColor) {
  // Base cases / Przypadki bazowe
  if (row < 0 || row >= screen.length ||
      col < 0 || col >= screen[0].length) {
    return; // Out of bounds / Poza granicami
  }

  if (screen[row][col] !== originalColor) {
    return; // Different color / Inny kolor
  }

  // Fill current pixel / Wypełnij bieżący piksel
  screen[row][col] = newColor;

  // Recurse on 4 neighbors / Rekurencja na 4 sąsiadach
  paintFillRecurse(screen, row - 1, col, originalColor, newColor); // Up
  paintFillRecurse(screen, row + 1, col, originalColor, newColor); // Down
  paintFillRecurse(screen, row, col - 1, originalColor, newColor); // Left
  paintFillRecurse(screen, row, col + 1, originalColor, newColor); // Right
}
```

**Visual Example / Przykład Wizualny:**
```
Screen:        Step 1:       Step 2:       Final:
1 1 1          2 1 1         2 2 1         2 2 2
1 1 0    →     2 1 0    →    2 2 0    →    2 2 0
1 0 1          2 0 1         2 0 1         2 0 1
Start (0,0)    Fill up       Fill right    Complete
```

**Pros:**
- Simple and intuitive / Proste i intuicyjne
- Clean code / Czysty kod

**Cons:**
- Stack overflow risk on large screens / Ryzyko przepełnienia stosu na dużych ekranach
- O(m*n) space for call stack / O(m*n) przestrzeń dla stosu wywołań

---

### Approach 2: BFS with Queue

**Strategy:** Use queue to explore pixels level by level
**Strategia:** Użyj kolejki do eksploracji pikseli poziom po poziomie

```javascript
function paintFillBFS(screen, row, col, newColor) {
  const originalColor = screen[row][col];
  if (originalColor === newColor) return screen;

  const queue = [[row, col]];
  screen[row][col] = newColor;

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;

      if (newRow >= 0 && newRow < screen.length &&
          newCol >= 0 && newCol < screen[0].length &&
          screen[newRow][newCol] === originalColor) {

        screen[newRow][newCol] = newColor;
        queue.push([newRow, newCol]);
      }
    }
  }

  return screen;
}
```

**BFS Traversal / Przechodzenie BFS:**
```
Start: (1,1)

Queue: [(1,1)]
Level 0:  Process (1,1)
          Add neighbors: (0,1), (2,1), (1,0), (1,2)

Queue: [(0,1), (2,1), (1,0), (1,2)]
Level 1:  Process all 4 neighbors
          Add their valid neighbors

Continue until queue empty...
```

**Pros:**
- No recursion (no stack overflow) / Bez rekurencji (bez przepełnienia stosu)
- Level-by-level filling / Wypełnianie poziom po poziomie
- More predictable memory usage / Bardziej przewidywalne użycie pamięci

**Cons:**
- Queue can still use O(m*n) space / Kolejka może nadal używać O(m*n) przestrzeni

---

### Approach 3: Iterative DFS with Stack

**Strategy:** Use explicit stack instead of call stack
**Strategia:** Użyj jawnego stosu zamiast stosu wywołań

```javascript
function paintFillDFS(screen, row, col, newColor) {
  const originalColor = screen[row][col];
  if (originalColor === newColor) return screen;

  const stack = [[row, col]];
  screen[row][col] = newColor;

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (stack.length > 0) {
    const [r, c] = stack.pop(); // DFS uses pop / DFS używa pop

    for (const [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;

      if (newRow >= 0 && newRow < screen.length &&
          newCol >= 0 && newCol < screen[0].length &&
          screen[newRow][newCol] === originalColor) {

        screen[newRow][newCol] = newColor;
        stack.push([newRow, newCol]);
      }
    }
  }

  return screen;
}
```

**Pros:**
- No recursion overhead / Bez narzutu rekurencji
- Explicit control over stack / Jawna kontrola nad stosem

**Cons:**
- Similar space complexity to BFS / Podobna złożoność przestrzenna do BFS

---

## Comparison / Porównanie

| Approach | Time | Space | Pros | Cons |
|---|---|---|---|---|
| Recursive DFS | O(m*n) | O(m*n) | Simple, clean | Stack overflow risk |
| BFS Queue | O(m*n) | O(m*n) | Level-order, no recursion | Queue memory |
| Iterative DFS | O(m*n) | O(m*n) | Controlled stack | Still O(m*n) space |

All three have same time complexity but different traversal patterns.
Wszystkie trzy mają tę samą złożoność czasową ale różne wzorce przechodzenia.

---

## Key Insights / Kluczowe Spostrzeżenia

### 1. Early Exit Optimization / Optymalizacja Wczesnego Wyjścia

```javascript
if (originalColor === newColor) return screen;
```

If the target color is the same as original, no work needed!
Jeśli kolor docelowy jest taki sam jak oryginalny, nie trzeba nic robić!

### 2. Mark as Visited / Oznacz jako Odwiedzone

```javascript
screen[row][col] = newColor; // Mark BEFORE adding to queue/stack
```

Paint the pixel **immediately** to avoid infinite loops.
Pomaluj piksel **natychmiast** aby uniknąć nieskończonych pętli.

### 3. 4-Directional vs 8-Directional

Standard paint fill uses **4-directional** (edge-connected).
Standardowe wypełnienie używa **4 kierunków** (połączenie krawędziowe).

For diagonal connectivity (8-directional):
Dla połączenia diagonalnego (8 kierunków):
```javascript
const directions = [
  [-1, 0], [1, 0], [0, -1], [0, 1],  // 4-directional
  [-1, -1], [-1, 1], [1, -1], [1, 1] // Add diagonals / Dodaj diagonale
];
```

### 4. In-Place Modification / Modyfikacja w Miejscu

The algorithm modifies the screen **in-place** (no extra screen copy needed).
Algorytm modyfikuje ekran **w miejscu** (nie potrzeba dodatkowej kopii).

---

## Common Mistakes / Częste Błędy

### 1. Infinite Loop from Not Marking Visited

```javascript
// ❌ WRONG - will loop forever
while (stack.length > 0) {
  const [r, c] = stack.pop();
  screen[r][c] = newColor; // Marking here is TOO LATE
  // Neighbors might add this back to stack!
}

// ✅ CORRECT
if (screen[newRow][newCol] === originalColor) {
  screen[newRow][newCol] = newColor; // Mark immediately
  stack.push([newRow, newCol]);
}
```

### 2. Not Checking Bounds

```javascript
// ❌ WRONG - will crash
if (screen[row][col] === originalColor) { ... }

// ✅ CORRECT
if (row >= 0 && row < screen.length &&
    col >= 0 && col < screen[0].length &&
    screen[row][col] === originalColor) { ... }
```

### 3. Using Wrong Data Structure

```javascript
// Queue for BFS / Kolejka dla BFS
queue.shift()  // Remove from front / Usuń z przodu

// Stack for DFS / Stos dla DFS
stack.pop()    // Remove from back / Usuń z tyłu
```

### 4. Modifying Original Color Variable

```javascript
// ❌ WRONG
let originalColor = screen[row][col];
screen[row][col] = newColor;
// Now comparing against wrong color!

// ✅ CORRECT
const originalColor = screen[row][col]; // Save before any modifications
```

---

## Edge Cases / Przypadki Brzegowe

1. **Empty screen:** `[]` → return empty
   **Pusty ekran:** `[]` → zwróć pusty

2. **Single pixel:** `[[5]]` → fill the one pixel
   **Pojedynczy piksel:** `[[5]]` → wypełnij jeden piksel

3. **Already target color:** No changes needed
   **Już docelowy kolor:** Nie trzeba zmian

4. **Out of bounds:** Return unchanged screen
   **Poza granicami:** Zwróć niezmieniony ekran

5. **Entire screen same color:** Fill all pixels
   **Cały ekran tego samego koloru:** Wypełnij wszystkie piksele

6. **Isolated regions:** Only connected pixels change
   **Izolowane regiony:** Tylko połączone piksele się zmieniają

---

## Applications / Zastosowania

1. **Image editing:** Paint bucket tool / Narzędzie wiaderka
2. **Minesweeper:** Revealing connected empty cells / Odkrywanie połączonych pustych pól
3. **Go/Othello:** Capturing connected stones / Zbijanie połączonych kamieni
4. **Map coloring:** Filling regions / Wypełnianie regionów
5. **Maze solving:** Finding paths / Znajdowanie ścieżek

---

## Testing / Testowanie

Run comprehensive tests:
```bash
node solution.js
```

Tests include / Testy zawierają:
- ✅ Small and large grids / Małe i duże siatki
- ✅ Isolated regions / Izolowane regiony
- ✅ Complete fills / Kompletne wypełnienia
- ✅ Pattern fills / Wypełnienia wzorów
- ✅ Edge cases / Przypadki brzegowe
- ✅ Performance comparison / Porównanie wydajności
- ✅ All 3 approaches verified / Wszystkie 3 podejścia zweryfikowane

---

## Time & Space Complexity / Złożoność Czasowa i Pamięciowa

**All approaches:**

**Time:** O(m × n)
- Where m = number of rows / liczba wierszy
- And n = number of columns / liczba kolumn
- Must potentially visit every pixel / Musimy potencjalnie odwiedzić każdy piksel

**Space:** O(m × n)
- Recursive: Call stack depth / Głębokość stosu wywołań
- BFS: Queue size / Rozmiar kolejki
- DFS: Stack size / Rozmiar stosu
- Worst case: All pixels in queue/stack / Najgorszy przypadek: Wszystkie piksele w kolejce/stosie

**Best case:** O(1)
- When starting pixel already has target color / Gdy startowy piksel już ma docelowy kolor

---

## Interview Tips / Wskazówki do Rozmowy

1. **Clarify connectivity:** "Should I use 4-directional or 8-directional?"
   **Wyjaśnij łączność:** "Czy użyć 4 czy 8 kierunków?"

2. **Discuss approaches:** "I can implement this with DFS or BFS. BFS gives level-order traversal, DFS is simpler."
   **Omów podejścia:** "Mogę zaimplementować to z DFS lub BFS."

3. **Mention optimization:** "I'll check if the color is already the target to avoid unnecessary work."
   **Wspomnij optymalizację:** "Sprawdzę czy kolor już jest docelowy."

4. **Handle edge cases:** "I'll validate bounds and handle empty screens."
   **Obsłuż przypadki brzegowe:** "Sprawdzę granice i obsłużę puste ekrany."

5. **Consider in-place:** "This modifies the screen in-place. Should I return a copy instead?"
   **Rozważ w miejscu:** "To modyfikuje ekran w miejscu. Czy powinienem zwrócić kopię?"

---

## Key Takeaways / Kluczowe Wnioski

1. **Flood fill is graph traversal** on a grid / **Zalewanie to przechodzenie grafu** na siatce

2. **DFS and BFS both work** - same complexity, different patterns
   **DFS i BFS oba działają** - ta sama złożoność, różne wzorce

3. **Mark pixels immediately** when adding to queue/stack to avoid loops
   **Oznaczaj piksele natychmiast** gdy dodajesz do kolejki/stosu

4. **4-directional** is standard (up, down, left, right)
   **4 kierunki** to standard (góra, dół, lewo, prawo)

5. **Early exit optimization** saves work when colors match
   **Optymalizacja wczesnego wyjścia** oszczędza pracę gdy kolory pasują

---

**Time Complexity:** O(m × n)
**Space Complexity:** O(m × n)
**Difficulty:** Medium / Średni
