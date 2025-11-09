# Missing Int - Brakująca Liczba Całkowita

## Treść Zadania / Problem Statement

**English:**
Given an input file with four billion non-negative integers, provide an algorithm to generate an integer that is not contained in the file. Assume you have 1 GB of memory available for this task.

**FOLLOW UP:** What if you have only 10 MB of memory? Assume that all the values are distinct and we now have no more than one billion non-negative integers.

**Polski:**
Mając plik wejściowy z czterema miliardami nieujemnych liczb całkowitych, podaj algorytm generujący liczbę całkowitą, której nie ma w pliku. Załóż, że masz 1 GB pamięci dostępnej do tego zadania.

**FOLLOW UP:** Co jeśli masz tylko 10 MB pamięci? Załóż, że wszystkie wartości są unikalne i mamy nie więcej niż miliard nieujemnych liczb całkowitych.

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
Kluczowe informacje:
- 4 miliardy liczb całkowitych nieujemnych
- Integer (32-bit) może reprezentować około 2^32 ≈ 4.3 miliarda różnych wartości
- Więc **musi** istnieć co najmniej jedna liczba, której nie ma w pliku!

**English:**
Key information:
- 4 billion non-negative integers
- Integer (32-bit) can represent about 2^32 ≈ 4.3 billion different values
- So there **must** exist at least one number not in the file!

## Rozwiązanie 1: Bit Vector (1 GB RAM)

### Podejście: Bit Vector

**Intuicja / Intuition:**
- Użyj **bit vector** do śledzenia, które liczby istnieją
- Każdy bit reprezentuje jedną liczbę (0 = nie ma, 1 = jest)
- 4 miliardy bitów = 4,000,000,000 / 8 = 500 MB RAM ✓

**Use bit vector to track which numbers exist**
- Each bit represents one number (0 = absent, 1 = present)
- 4 billion bits = 4,000,000,000 / 8 = 500 MB RAM ✓

### Algorytm / Algorithm:

1. Stwórz bit vector dla 4 miliardów liczb (500 MB)
2. Czytaj plik i ustaw odpowiednie bity na 1
3. Przejdź przez bit vector i znajdź pierwszy bit = 0
4. To jest brakująca liczba!

**Steps:**
1. Create bit vector for 4 billion numbers (500 MB)
2. Read file and set corresponding bits to 1
3. Iterate through bit vector and find first bit = 0
4. That's the missing number!

### Implementacja / Implementation:

```javascript
function findMissingInt(file) {
  const MAX_INT = 4294967296; // 2^32
  const bitVector = new BitVector(MAX_INT);

  // Czytaj plik i oznacz istniejące liczby
  // Read file and mark existing numbers
  for (let num of readFile(file)) {
    bitVector.set(num);
  }

  // Znajdź pierwszą brakującą / Find first missing
  for (let i = 0; i < MAX_INT; i++) {
    if (!bitVector.get(i)) {
      return i; // Znaleziono brakującą / Found missing
    }
  }

  return -1; // Wszystkie istnieją (niemożliwe) / All exist (impossible)
}
```

## Rozwiązanie 2: Podział na Bloki (10 MB RAM)

### Podejście: Two-Pass Algorithm z Blokami

**Intuicja / Intuition:**
- 10 MB to za mało na bit vector dla miliarda liczb (125 MB)
- Rozwiązanie: **podziel przestrzeń liczb na bloki**
- Użyj tablicy liczników do znalezienia bloku z brakującą liczbą
- Potem użyj bit vector tylko dla tego bloku

**10 MB is too small for bit vector for billion numbers (125 MB)**
- Solution: **divide number space into blocks**
- Use counter array to find block with missing number
- Then use bit vector only for that block

### Algorytm / Algorithm:

**Pass 1: Znajdź blok z brakującą liczbą**
1. Podziel zakres [0, 1 billion] na bloki (np. 1000 bloków po 1M liczb)
2. Tablica liczników: counters[block] = ile liczb z tego bloku widzieliśmy
3. Czytaj plik i inkrementuj odpowiednie counters[block]
4. Znajdź blok, gdzie counter < rozmiar bloku

**Pass 1: Find block with missing number**
1. Divide range [0, 1 billion] into blocks (e.g., 1000 blocks of 1M numbers)
2. Counter array: counters[block] = how many numbers from this block we saw
3. Read file and increment appropriate counters[block]
4. Find block where counter < block size

**Pass 2: Znajdź dokładną liczbę w bloku**
5. Stwórz bit vector dla znalezionego bloku
6. Czytaj plik ponownie, oznaczaj tylko liczby z tego bloku
7. Znajdź brakujący bit w tym bloku

**Pass 2: Find exact number in block**
5. Create bit vector for found block
6. Read file again, mark only numbers from this block
7. Find missing bit in this block

### Wizualizacja / Visualization:

```
Zakres: [0, 1,000,000,000]
Bloki po 1,000,000 liczb:

Block 0: [0 - 999,999]          counter = 1,000,000 ✓
Block 1: [1,000,000 - 1,999,999] counter = 999,999  ← TUTAJ!
Block 2: [2,000,000 - 2,999,999] counter = 1,000,000 ✓
...

Pass 2: Bit vector dla Block 1 [1M - 2M]
  Bit 0 (liczba 1,000,000): 1
  Bit 1 (liczba 1,000,001): 0  ← BRAKUJĄCA!
```

### Implementacja / Implementation:

```javascript
function findMissingIntLimitedMemory(file) {
  const RANGE_SIZE = 1000000000; // 1 billion
  const BLOCK_SIZE = 1000; // Liczba bloków
  const NUMBERS_PER_BLOCK = RANGE_SIZE / BLOCK_SIZE;

  // Pass 1: Zlicz liczby w każdym bloku
  const counters = new Array(BLOCK_SIZE).fill(0);

  for (let num of readFile(file)) {
    const blockIndex = Math.floor(num / NUMBERS_PER_BLOCK);
    counters[blockIndex]++;
  }

  // Znajdź blok z brakującą liczbą
  let targetBlock = -1;
  for (let i = 0; i < BLOCK_SIZE; i++) {
    if (counters[i] < NUMBERS_PER_BLOCK) {
      targetBlock = i;
      break;
    }
  }

  // Pass 2: Bit vector dla targetBlock
  const bitVector = new BitVector(NUMBERS_PER_BLOCK);
  const blockStart = targetBlock * NUMBERS_PER_BLOCK;
  const blockEnd = blockStart + NUMBERS_PER_BLOCK;

  for (let num of readFile(file)) {
    if (num >= blockStart && num < blockEnd) {
      bitVector.set(num - blockStart);
    }
  }

  // Znajdź brakujący bit
  for (let i = 0; i < NUMBERS_PER_BLOCK; i++) {
    if (!bitVector.get(i)) {
      return blockStart + i;
    }
  }
}
```

## Analiza Pamięci / Memory Analysis

### Rozwiązanie 1 (1 GB RAM):
- Bit vector: 4,000,000,000 bits / 8 = **500 MB**
- Dodatkowe zmienne: < 1 MB
- **Łącznie: ~500 MB < 1 GB ✓**

### Rozwiązanie 2 (10 MB RAM):
- Counters array: 1000 bloków × 4 bytes = **4 KB**
- Bit vector (1 blok): 1,000,000 bits / 8 = **125 KB**
- **Łącznie: ~130 KB << 10 MB ✓**

## Przypadki Brzegowe / Edge Cases

1. **Brak 0** - 0 nie występuje w pliku
2. **Brak MAX_INT** - największa możliwa liczba
3. **Plik ma < 4 miliardy liczb** - wiele brakujących
4. **Duplikaty** - nie wpływają na wynik (bit vector)

1. **Missing 0** - 0 doesn't appear in file
2. **Missing MAX_INT** - largest possible number
3. **File has < 4 billion numbers** - many missing
4. **Duplicates** - don't affect result (bit vector)

## Pytania do Rekrutera / Questions for Interviewer

1. Czy musimy zwrócić najmniejszą brakującą? / Must we return smallest missing?
2. Czy liczby są w zakresie [0, 2^32-1]? / Are numbers in range [0, 2^32-1]?
3. Czy możemy modyfikować plik? / Can we modify the file?
4. Ile razy możemy przeczytać plik? / How many times can we read the file?

## Kluczowe Wnioski / Key Takeaways

1. **Bit vector - kompaktowa reprezentacja** - 1 bit na liczbę
2. **Trade-off: pamięć vs przejścia** - mniej pamięci = więcej przejść przez plik
3. **Zasada szufladkowa Dirichleta** - 4B liczb w 4.3B możliwych = coś musi brakować
4. **Divide and conquer** - podział na bloki rozwiązuje problem pamięci

1. **Bit vector - compact representation** - 1 bit per number
2. **Trade-off: memory vs passes** - less memory = more file passes
3. **Pigeonhole principle** - 4B numbers in 4.3B possible = something must be missing
4. **Divide and conquer** - splitting into blocks solves memory problem
