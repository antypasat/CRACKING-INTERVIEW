# Find Duplicates - Znajdź Duplikaty

## Treść Zadania / Problem Statement

**English:**
You have an array with all the numbers from 1 to N, where N is at most 32,000. The array may have duplicate entries and you do not know what N is. With only 4 kilobytes of memory available, how would you print all duplicate elements in the array?

**Polski:**
Masz tablicę ze wszystkimi liczbami od 1 do N, gdzie N wynosi co najwyżej 32,000. Tablica może mieć duplikaty i nie wiesz, ile wynosi N. Mając tylko 4 kilobajty pamięci, jak wydrukować wszystkie zduplikowane elementy w tablicy?

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
Kluczowe ograniczenia:
- N ≤ 32,000
- Tylko 4 KB pamięci = 4,000 bajtów = 32,000 bitów
- Musisz znaleźć **wszystkie** duplikaty

**Kluczowa obserwacja:**
- 32,000 bitów / 32,000 możliwych liczb = dokładnie 1 bit na liczbę!
- Możemy użyć **bit vector** do śledzenia, które liczby już widzieliśmy

**English:**
Key constraints:
- N ≤ 32,000
- Only 4 KB memory = 4,000 bytes = 32,000 bits
- Must find **all** duplicates

**Key observation:**
- 32,000 bits / 32,000 possible numbers = exactly 1 bit per number!
- We can use **bit vector** to track which numbers we've seen

## Rozwiązanie: Bit Vector

### Algorytm / Algorithm:

1. Stwórz bit vector dla 32,000 liczb (4 KB)
2. Dla każdej liczby w tablicy:
   - Sprawdź bit: czy już widzieliśmy tę liczbę?
   - Jeśli tak (bit = 1) → to jest duplikat, wydrukuj
   - Jeśli nie (bit = 0) → ustaw bit na 1
3. Gotowe!

**Steps:**
1. Create bit vector for 32,000 numbers (4 KB)
2. For each number in array:
   - Check bit: have we seen this number?
   - If yes (bit = 1) → it's a duplicate, print it
   - If no (bit = 0) → set bit to 1
3. Done!

### Wizualizacja / Visualization:

```
Tablica: [1, 3, 5, 3, 7, 1, 5, 9]

Bit Vector początkowo: [0, 0, 0, 0, 0, 0, ...]
                        1  2  3  4  5  6

Krok 1: Widzimy 1
  Bit[1] = 0 → ustaw na 1
  Bit Vector: [1, 0, 0, 0, 0, 0, ...]

Krok 2: Widzimy 3
  Bit[3] = 0 → ustaw na 1
  Bit Vector: [1, 0, 1, 0, 0, 0, ...]

Krok 3: Widzimy 5
  Bit[5] = 0 → ustaw na 1
  Bit Vector: [1, 0, 1, 0, 1, 0, ...]

Krok 4: Widzimy 3
  Bit[3] = 1 → DUPLIKAT! Wydrukuj 3
  Bit Vector: [1, 0, 1, 0, 1, 0, ...]

Krok 5: Widzimy 7
  Bit[7] = 0 → ustaw na 1

Krok 6: Widzimy 1
  Bit[1] = 1 → DUPLIKAT! Wydrukuj 1

Krok 7: Widzimy 5
  Bit[5] = 1 → DUPLIKAT! Wydrukuj 5

Wynik: Duplikaty to [3, 1, 5]
```

### Implementacja / Implementation:

```javascript
class BitVector {
  constructor(size) {
    // 32 bity na element tablicy
    this.bits = new Array(Math.ceil(size / 32)).fill(0);
  }

  get(index) {
    const arrayIndex = Math.floor(index / 32);
    const bitIndex = index % 32;
    return (this.bits[arrayIndex] & (1 << bitIndex)) !== 0;
  }

  set(index) {
    const arrayIndex = Math.floor(index / 32);
    const bitIndex = index % 32;
    this.bits[arrayIndex] |= (1 << bitIndex);
  }
}

function findDuplicates(arr) {
  const bitVector = new BitVector(32000);
  const duplicates = [];

  for (let num of arr) {
    // Sprawdź czy widzieliśmy już tę liczbę
    if (bitVector.get(num)) {
      // To jest duplikat!
      duplicates.push(num);
    } else {
      // Pierwszy raz widzimy tę liczbę
      bitVector.set(num);
    }
  }

  return duplicates;
}
```

## Analiza Złożoności / Complexity Analysis

**Złożoność Czasowa / Time Complexity:** O(n)
- Jedno przejście przez tablicę
- Operacje na bit vector to O(1)
- One pass through array
- Bit vector operations are O(1)

**Złożoność Pamięciowa / Space Complexity:** O(1)
- Stała pamięć: 32,000 bitów = 4,000 bajtów = 4 KB ✓
- Nie zależy od rozmiaru wejścia
- Constant memory: 32,000 bits = 4,000 bytes = 4 KB ✓
- Doesn't depend on input size

## Optymalizacje / Optimizations

### 1. Drukuj od razu, nie przechowuj
Zamiast zbierać duplikaty w tablicy, drukuj je od razu:

Instead of collecting duplicates in array, print immediately:

```javascript
function printDuplicates(arr) {
  const bitVector = new BitVector(32000);

  for (let num of arr) {
    if (bitVector.get(num)) {
      console.log(num); // Drukuj od razu / Print immediately
    } else {
      bitVector.set(num);
    }
  }
}
```

### 2. Zliczaj duplikaty
Jeśli chcemy wiedzieć, ile razy każda liczba się powtarza:

If we want to know how many times each number repeats:

```javascript
// Wymaga więcej pamięci! / Requires more memory!
function countDuplicates(arr) {
  const counts = new Map();

  for (let num of arr) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  // Zwróć tylko te z count > 1
  return Array.from(counts.entries())
    .filter(([num, count]) => count > 1)
    .map(([num, count]) => ({ num, count }));
}
```

## Przypadki Brzegowe / Edge Cases

1. **Brak duplikatów** - zwróć pustą tablicę
2. **Wszystkie duplikaty** - każda liczba występuje 2+ razy
3. **Liczba pojawia się 3+ razy** - wydrukuj przy każdym kolejnym wystąpieniu
4. **Pusta tablica** - zwróć pustą tablicę
5. **Liczba poza zakresem [1, 32000]** - pomiń lub zgłoś błąd

1. **No duplicates** - return empty array
2. **All duplicates** - every number appears 2+ times
3. **Number appears 3+ times** - print at each subsequent occurrence
4. **Empty array** - return empty array
5. **Number outside range [1, 32000]** - skip or report error

## Warianty Problemu / Problem Variants

### Co jeśli N > 32,000?
Użyj podejścia z blokami (jak w zadaniu 10.7 Missing Int):
1. Podziel zakres na bloki mieszczące się w pamięci
2. Wielokrotne przejścia przez tablicę

Use block approach (like in problem 10.7 Missing Int):
1. Divide range into blocks that fit in memory
2. Multiple passes through array

### Co jeśli musimy zachować kolejność?
Obecne rozwiązanie drukuje duplikaty w kolejności pierwszego powtórzenia.

Current solution prints duplicates in order of first repetition.

## Pytania do Rekrutera / Questions for Interviewer

1. Czy liczby są tylko z zakresu [1, N]? / Are numbers only from range [1, N]?
2. Czy możemy modyfikować oryginalną tablicę? / Can we modify original array?
3. Czy drukować każde wystąpienie czy tylko raz? / Print each occurrence or only once?
4. Co z liczbami poza zakresem? / What about numbers outside range?
5. Czy kolejność duplikatów ma znaczenie? / Does order of duplicates matter?

## Kluczowe Wnioski / Key Takeaways

1. **Bit vector = 1 bit na element** - bardzo kompaktowe dla zbiorów
2. **32,000 liczb ≤ 4 KB** - idealne dopasowanie do ograniczenia
3. **O(n) czas, O(1) pamięć** - optymalne rozwiązanie
4. **Różnica między "widzieliśmy" a "zliczanie"** - bit vector vs mapa

1. **Bit vector = 1 bit per element** - very compact for sets
2. **32,000 numbers ≤ 4 KB** - perfect fit for constraint
3. **O(n) time, O(1) space** - optimal solution
4. **Difference between "seen" and "counting"** - bit vector vs map
