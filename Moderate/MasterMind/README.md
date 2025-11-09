# 16.15 Master Mind

## Opis Zadania / Problem Description

**Master Mind**: The Game of Master Mind is played as follows: The computer has four slots, and each slot will contain a ball that is red (R), yellow (Y), green (G) or blue (B). For example, the computer might have RGGB (the "solution"). You, the user, are trying to guess the solution. You might, for example, guess YRGB. When you guess the correct color for the correct slot, you get a "hit". If you guess a color that exists but is in the wrong slot, you get a "pseudo-hit". Note that a slot that is a hit can never count as a pseudo-hit. For example, if the actual solution is RGBY and you guess GGRR, you have one hit and one pseudo-hit. Write a method that, given a guess and a solution, returns the number of hits and pseudo-hits.

**Gra Master Mind**: Gra Master Mind przebiega następująco: Komputer ma cztery sloty, a każdy slot zawiera kulkę w kolorze czerwonym (R), żółtym (Y), zielonym (G) lub niebieskim (B). Na przykład, komputer może mieć RGGB (rozwiązanie). Ty, użytkownik, próbujesz odgadnąć rozwiązanie. Możesz na przykład zgadnąć YRGB. Gdy odgadniesz poprawny kolor w poprawnym slocie, dostajesz "trafienie" (hit). Jeśli odgadniesz kolor, który istnieje ale jest w złym slocie, dostajesz "pseudo-trafienie" (pseudo-hit). Zauważ, że slot będący trafieniem nigdy nie może być liczony jako pseudo-trafienie. Na przykład, jeśli prawdziwe rozwiązanie to RGBY, a Ty zgadniesz GGRR, masz jedno trafienie i jedno pseudo-trafienie. Napisz metodę, która dla podanego zgadnięcia i rozwiązania zwraca liczbę trafień i pseudo-trafień.

Hints: #639, #730

## Wyjaśnienie Problemu / Problem Explanation

Master Mind to klasyczna gra logiczna. W naszej implementacji musimy porównać dwa stringi reprezentujące rozwiązanie i zgadnięcie.

Master Mind is a classic logic game. In our implementation, we need to compare two strings representing the solution and the guess.

**Zasady / Rules**:
1. **Hit (Trafienie)**: Kolor i pozycja są poprawne
2. **Pseudo-Hit**: Kolor istnieje w rozwiązaniu, ale jest w złej pozycji
3. **Ważne**: Każdy kolor może być użyty tylko raz. Jeśli kolor jest już "hit", nie może być "pseudo-hit"

**Example**:
```
Solution: RGBY
Guess:    GGRR

Position 0: G ≠ R → nie hit
Position 1: G = G → HIT! ✓
Position 2: R ≠ B → nie hit
Position 3: R ≠ Y → nie hit

Teraz sprawdzamy pseudo-hits dla pozycji 0, 2, 3:
Position 0: G istnieje w solution[1], ale już użyty jako hit → skip
Position 2: R istnieje w solution[0], nie użyty → PSEUDO-HIT! ✓
Position 3: R już użyty w position 2 → skip

Result: hits = 1, pseudo-hits = 1
```

## Rozwiązania / Solutions

### Podejście 1: Dwa Przejścia - O(n)

**Idea**: Najpierw znajdź wszystkie "hits", następnie dla pozostałych znajdź "pseudo-hits".

**Idea**: First find all "hits", then for the remaining find "pseudo-hits".

```javascript
function masterMind(solution, guess) {
  if (solution.length !== guess.length) {
    throw new Error('Solution and guess must have the same length');
  }

  let hits = 0;
  let pseudoHits = 0;

  // Tablice do śledzenia, które pozycje zostały użyte
  const solutionUsed = new Array(solution.length).fill(false);
  const guessUsed = new Array(guess.length).fill(false);

  // Przejście 1: Znajdź hits
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === guess[i]) {
      hits++;
      solutionUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Przejście 2: Znajdź pseudo-hits
  for (let i = 0; i < guess.length; i++) {
    if (guessUsed[i]) continue; // Already a hit

    for (let j = 0; j < solution.length; j++) {
      if (solutionUsed[j]) continue; // Already used

      if (guess[i] === solution[j]) {
        pseudoHits++;
        solutionUsed[j] = true;
        break; // Move to next guess position
      }
    }
  }

  return { hits, pseudoHits };
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n²) w najgorszym przypadku (nested loops w drugim przejściu)
- Pamięciowa / Space: O(n) - dla tablic używanych pozycji

### Podejście 2: Mapa Częstości - O(n) ✓ OPTYMALNE

**Idea**: Użyj mapy do zliczania kolorów w rozwiązaniu, pomijając hits.

**Idea**: Use a map to count colors in solution, excluding hits.

```javascript
function masterMindOptimal(solution, guess) {
  if (solution.length !== guess.length) {
    throw new Error('Solution and guess must have the same length');
  }

  let hits = 0;
  const colorCount = {}; // Częstość kolorów w solution (bez hits)

  // Przejście 1: Znajdź hits i zbuduj mapę kolorów
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === guess[i]) {
      hits++;
    } else {
      // Dodaj kolor z solution do mapy (nie jest hit)
      colorCount[solution[i]] = (colorCount[solution[i]] || 0) + 1;
    }
  }

  // Przejście 2: Znajdź pseudo-hits
  let pseudoHits = 0;
  for (let i = 0; i < guess.length; i++) {
    // Pomiń jeśli to hit
    if (solution[i] === guess[i]) continue;

    // Sprawdź czy ten kolor istnieje w mapie
    if (colorCount[guess[i]] > 0) {
      pseudoHits++;
      colorCount[guess[i]]--;
    }
  }

  return { hits, pseudoHits };
}
```

**Zalety / Advantages**:
- Prawdziwe O(n) - tylko dwa niezależne przejścia
- Czytelny kod
- Łatwy do debugowania

**Złożoność / Complexity**:
- Czasowa / Time: O(n) - dwa niezależne przejścia
- Pamięciowa / Space: O(1) - mapa ma maksymalnie 4 kolory (R, G, B, Y)

### Podejście 3: Kompaktowe - O(n)

**Idea**: Połącz oba kroki w bardziej zwięzły sposób.

**Idea**: Combine both steps in a more compact way.

```javascript
function masterMindCompact(solution, guess) {
  let hits = 0;
  let solutionCounts = {};
  let guessCounts = {};

  // Jedno przejście: znajdź hits i zlicz nie-hits
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === guess[i]) {
      hits++;
    } else {
      solutionCounts[solution[i]] = (solutionCounts[solution[i]] || 0) + 1;
      guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
    }
  }

  // Oblicz pseudo-hits jako minimum liczności każdego koloru
  let pseudoHits = 0;
  for (let color in guessCounts) {
    if (solutionCounts[color]) {
      pseudoHits += Math.min(guessCounts[color], solutionCounts[color]);
    }
  }

  return { hits, pseudoHits };
}
```

## Szczególne Przypadki / Edge Cases

1. **Wszystkie trafienia**: `masterMind("RGBY", "RGBY")` → `{hits: 4, pseudoHits: 0}`
2. **Brak trafień, wszystkie pseudo**: `masterMind("RGBY", "BYGR")` → `{hits: 0, pseudoHits: 4}`
3. **Brak trafień ani pseudo**: `masterMind("RRRR", "YYYY")` → `{hits: 0, pseudoHits: 0}`
4. **Powtórzenia kolorów**: `masterMind("RRRR", "RRYY")` → `{hits: 2, pseudoHits: 0}`
5. **Złożony przypadek**: `masterMind("RGBY", "GGRR")` → `{hits: 1, pseudoHits: 1}`
6. **Pusta tablica**: `masterMind("", "")` → `{hits: 0, pseudoHits: 0}`

## Przykłady Krok po Kroku / Step-by-Step Examples

### Przykład 1: RGBY vs GGRR

```
Solution: R G B Y
Guess:    G G R R

Krok 1: Znajdź hits
Position 0: R ≠ G → brak hit, dodaj R do solution map, G do guess map
Position 1: G = G → HIT! hits = 1
Position 2: B ≠ R → brak hit, dodaj B do solution map, R do guess map
Position 3: Y ≠ R → brak hit, dodaj Y do solution map, R do guess map

solutionCounts = { R: 1, B: 1, Y: 1 }
guessCounts = { G: 1, R: 2 }

Krok 2: Oblicz pseudo-hits
Dla G: solutionCounts[G] = undefined → 0 pseudo-hits
Dla R: min(guessCounts[R], solutionCounts[R]) = min(2, 1) = 1 pseudo-hit

Result: { hits: 1, pseudoHits: 1 }
```

### Przykład 2: RRRR vs RRYY

```
Solution: R R R R
Guess:    R R Y Y

Krok 1: Znajdź hits
Position 0: R = R → HIT! hits = 1
Position 1: R = R → HIT! hits = 2
Position 2: R ≠ Y → dodaj R do solution, Y do guess
Position 3: R ≠ Y → dodaj R do solution, Y do guess

solutionCounts = { R: 2 }
guessCounts = { Y: 2 }

Krok 2: Oblicz pseudo-hits
Dla Y: solutionCounts[Y] = undefined → 0 pseudo-hits

Result: { hits: 2, pseudoHits: 0 }
```

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Mapa Częstości (Podejście 2)**: Najlepsze! Prawdziwe O(n), czytelne
- **Kompaktowe (Podejście 3)**: Gdy potrzebujesz zwięzłego kodu
- **Dwa Przejścia (Podejście 1)**: Najbardziej intuicyjne dla początkujących

## Rozszerzenia / Extensions

1. **Więcej kolorów**: Rozwiązanie działa dla dowolnej liczby kolorów
2. **Dłuższy kod**: Działa dla kodu o dowolnej długości
3. **Zwróć pozycje**: Rozszerz by zwracać które pozycje są hits/pseudo-hits
4. **Gra interaktywna**: Użyj w pełnej grze Master Mind z wieloma próbami

## Wnioski / Conclusions

Master Mind to świetny przykład problemu wymagającego:
- Precyzyjnego liczenia i śledzenia użytych elementów
- Optymalizacji przez użycie odpowiednich struktur danych (mapa)
- Uważnego rozróżnienia między różnymi typami dopasowań

Master Mind is a great example of a problem requiring:
- Precise counting and tracking of used elements
- Optimization through appropriate data structures (map)
- Careful distinction between different types of matches
