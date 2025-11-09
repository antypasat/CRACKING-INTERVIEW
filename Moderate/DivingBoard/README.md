# 16.11 Diving Board

## Opis Zadania / Problem Description

**Diving Board**: You are building a diving board by placing a bunch of planks of wood end-to-end. There are two types of planks, one of length `shorter` and one of length `longer`. You must use exactly K planks of wood. Write a method to generate all possible lengths for the diving board.

**Trampolina do Nurkowania**: Budujesz trampolinę do nurkowania układając deski drewniane jedna za drugą. Są dwa typy desek: jedna o długości `shorter` (krótsza) i jedna o długości `longer` (dłuższa). Musisz użyć dokładnie K desek. Napisz metodę generującą wszystkie możliwe długości trampoliny.

EXAMPLE
Input: shorter = 1, longer = 2, k = 3
Output: [3, 4, 5]
Explanation:
- 3 shorter planks: 1 + 1 + 1 = 3
- 2 shorter, 1 longer: 1 + 1 + 2 = 4
- 1 shorter, 2 longer: 1 + 2 + 2 = 5
- 3 longer planks: 2 + 2 + 2 = 6

Hints: #632, #650, #688

## Wyjaśnienie Problemu / Problem Explanation

Mamy:
- `k` desek do użycia (dokładnie k, nie mniej, nie więcej)
- Dwa rodzaje desek: długość `shorter` i `longer`
- Musimy znaleźć wszystkie możliwe długości trampoliny

We have:
- `k` planks to use (exactly k, not less, not more)
- Two types of planks: length `shorter` and `longer`
- We must find all possible board lengths

## Kluczowa Obserwacja / Key Observation

Jeśli użyjemy:
- `i` desek krótszych (shorter)
- `k - i` desek dłuższych (longer)

Całkowita długość = `i * shorter + (k - i) * longer`

Gdzie `i` może być od 0 do k.

If we use:
- `i` shorter planks
- `k - i` longer planks

Total length = `i * shorter + (k - i) * longer`

Where `i` can be from 0 to k.

## Rozwiązania / Solutions

### Podejście 1: Brute Force z Rekurencją - O(2^k)

**Idea**: Generuj wszystkie kombinacje desek, oblicz długości.

**Wada**: Eksponencjalna złożoność, generuje duplikaty.

```javascript
function allLengthsBruteForce(k, shorter, longer) {
  const lengths = new Set();

  function generate(remaining, currentLength) {
    if (remaining === 0) {
      lengths.add(currentLength);
      return;
    }
    generate(remaining - 1, currentLength + shorter);
    generate(remaining - 1, currentLength + longer);
  }

  generate(k, 0);
  return Array.from(lengths).sort((a, b) => a - b);
}
```

### Podejście 2: Iteracyjne z Matematyką - O(k)

**Idea**: Dla każdej liczby `i` krótkich desek (od 0 do k), oblicz długość.

**Optymalizacja**: Jeśli shorter === longer, wszystkie długości są takie same!

```javascript
function allLengths(k, shorter, longer) {
  // Edge cases
  if (k <= 0) return [];
  if (shorter === longer) return [k * shorter];

  // Zapewnij shorter < longer dla uproszczenia
  if (shorter > longer) [shorter, longer] = [longer, shorter];

  const lengths = [];

  // i = liczba krótkich desek
  for (let i = 0; i <= k; i++) {
    const numShorter = i;
    const numLonger = k - i;
    const length = numShorter * shorter + numLonger * longer;
    lengths.push(length);
  }

  return lengths;
}
```

**Matematyczna Obserwacja**:
```
length(i) = i * shorter + (k - i) * longer
         = i * shorter + k * longer - i * longer
         = k * longer + i * (shorter - longer)
```

Ponieważ `i` rośnie od 0 do k, a `(shorter - longer)` jest stałe (ujemne), długości są w kolejności malejącej (lub rosnącej jeśli zamienimy shorter i longer).

Since `i` grows from 0 to k, and `(shorter - longer)` is constant (negative), lengths are in descending order (or ascending if we swap shorter and longer).

### Podejście 3: Bezpośrednie Wyliczenie - O(k)

**Idea**: Skoro długości różnią się o stałą wartość `(longer - shorter)`, możemy je generować bezpośrednio.

```javascript
function allLengthsDirect(k, shorter, longer) {
  if (k <= 0) return [];
  if (shorter === longer) return [k * shorter];

  if (shorter > longer) [shorter, longer] = [longer, shorter];

  const lengths = [];
  const minLength = k * shorter;       // Wszystkie krótkie
  const diff = longer - shorter;       // Różnica między deskami

  // Każda zamiana shorter → longer dodaje diff
  for (let i = 0; i <= k; i++) {
    lengths.push(minLength + i * diff);
  }

  return lengths;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(k) - generujemy k+1 wartości
- Pamięciowa / Space: O(k) - tablica wynikowa

## Szczególne Przypadki / Edge Cases

1. **k = 0**: Brak desek, zwróć pustą tablicę
2. **k < 0**: Niepoprawne dane, zwróć pustą tablicę
3. **shorter === longer**: Tylko jedna możliwa długość: k * shorter
4. **k = 1**: Dwie możliwe długości: [shorter, longer]
5. **shorter = 0**: Tylko jedna długość: k * longer
6. **Bardzo duże k**: Działa efektywnie dzięki O(k)

## Przykłady / Examples

### Przykład 1:
```
shorter = 1, longer = 2, k = 3
- 0 krótkich, 3 długie: 0*1 + 3*2 = 6
- 1 krótka,  2 długie: 1*1 + 2*2 = 5
- 2 krótkie, 1 długa:  2*1 + 1*2 = 4
- 3 krótkie, 0 długich: 3*1 + 0*2 = 3

Wynik: [3, 4, 5, 6]
```

### Przykład 2:
```
shorter = 3, longer = 5, k = 4
minLength = 4 * 3 = 12
diff = 5 - 3 = 2

Długości: 12, 14, 16, 18, 20
(każda zamiana dodaje 2)
```

### Przykład 3 (identyczne deski):
```
shorter = 5, longer = 5, k = 10
Wynik: [50]
(tylko jedna możliwa długość)
```

## Optymalizacje / Optimizations

1. **Sprawdź shorter === longer na początku**: Oszczędza O(k) operacji
2. **Uporządkuj shorter < longer**: Upraszcza logikę
3. **Użyj wzoru matematycznego**: minLength + i * diff zamiast pełnego obliczania
4. **Nie używaj Set**: Skoro wiemy że długości są unikalne (gdy shorter ≠ longer)

## Analiza Matematyczna / Mathematical Analysis

```
Wzór ogólny:
length(i) = k * longer + i * (shorter - longer)

Gdzie:
- i ∈ [0, k] - liczba krótkich desek
- k - i - liczba długich desek

Różnica między sąsiednimi długościami:
length(i+1) - length(i) = longer - shorter

Liczba możliwych długości:
- Jeśli shorter = longer: 1
- W przeciwnym razie: k + 1
```
