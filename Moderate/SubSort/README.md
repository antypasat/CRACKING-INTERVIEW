# 16.16 Sub Sort

## Opis Zadania / Problem Description

**Sub Sort**: Given an array of integers, write a method to find indices m and n such that if you sorted elements m through n, the entire array would be sorted. Minimize n - m (that is, find the smallest such sequence).

**Pod-Sortowanie**: Dla tablicy liczb całkowitych, napisz metodę znajdującą indeksy m i n takie, że jeśli posortowałbyś elementy od m do n, cała tablica byłaby posortowana. Zminimalizuj n - m (czyli znajdź najmniejszą taką sekwencję).

EXAMPLE
Input: [1, 2, 4, 7, 10, 11, 7, 12, 6, 7, 16, 18, 19]
Output: (3, 9)

Explanation: Jeśli posortujemy elementy od indeksu 3 do 9 [7, 10, 11, 7, 12, 6, 7], otrzymamy [6, 7, 7, 7, 10, 11, 12], a cała tablica stanie się [1, 2, 4, 6, 7, 7, 7, 10, 11, 12, 16, 18, 19].

Hints: #482, #553, #667, #708, #735, #746

## Wyjaśnienie Problemu / Problem Explanation

Musimy znaleźć najmniejszy podciąg, który po posortowaniu sprawi, że cała tablica będzie posortowana. Kluczowa obserwacja: elementy poza tym podciągiem muszą już być na swoich właściwych pozycjach.

We need to find the smallest subarray that, when sorted, will make the entire array sorted. Key observation: elements outside this subarray must already be in their correct positions.

**Intuicja / Intuition**:
1. Jeśli tablica jest już posortowana, zwróć `(-1, -1)` lub `null`
2. W przeciwnym razie, znajdź lewą granicę (pierwszy element "nie na miejscu")
3. Znajdź prawą granicę (ostatni element "nie na miejscu")
4. "Nie na miejscu" oznacza, że element nie pasuje do posortowanej sekwencji

**Przykłady / Examples**:
```
[1, 2, 4, 7, 10, 11, 7, 12, 6, 7, 16, 18, 19]
            ↑                 ↑
            m=3               n=9

[1, 2, 3, 4, 5] → (-1, -1) (już posortowane)

[5, 4, 3, 2, 1] → (0, 4) (całą tablicę trzeba posortować)

[1, 3, 2, 4, 5] → (1, 2) (tylko środkowe elementy)
```

## Rozwiązania / Solutions

### Podejście 1: Brute Force - Sortowanie i Porównanie - O(n log n)

**Idea**: Posortuj kopię tablicy, potem porównaj z oryginałem.

**Idea**: Sort a copy of the array, then compare with original.

```javascript
function findUnsortedSequenceBruteForce(arr) {
  const sorted = [...arr].sort((a, b) => a - b);

  let left = 0;
  let right = arr.length - 1;

  // Znajdź pierwszy element różny od posortowanego
  while (left < arr.length && arr[left] === sorted[left]) {
    left++;
  }

  // Jeśli cała tablica jest posortowana
  if (left === arr.length) {
    return { m: -1, n: -1 };
  }

  // Znajdź ostatni element różny od posortowanego
  while (right >= 0 && arr[right] === sorted[right]) {
    right--;
  }

  return { m: left, n: right };
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n log n) - sortowanie
- Pamięciowa / Space: O(n) - kopia tablicy

**Zalety / Advantages**: Proste, łatwe do zrozumienia
**Wady / Disadvantages**: Wymaga sortowania i dodatkowej pamięci

### Podejście 2: Znajdź Lewą i Prawą Część - O(n) ✓ OPTYMALNE

**Idea**:
1. Znajdź koniec lewej posortowanej części
2. Znajdź początek prawej posortowanej części
3. Znajdź min i max w środkowej części
4. Rozszerz granice jeśli potrzeba, by uwzględnić min/max

**Idea**:
1. Find end of left sorted part
2. Find start of right sorted part
3. Find min and max in middle part
4. Extend boundaries if needed to accommodate min/max

```javascript
function findUnsortedSequence(arr) {
  // Krok 1: Znajdź koniec lewej posortowanej części
  let endLeft = findEndOfLeftSubsequence(arr);
  if (endLeft >= arr.length - 1) {
    return { m: -1, n: -1 }; // Już posortowane
  }

  // Krok 2: Znajdź początek prawej posortowanej części
  let startRight = findStartOfRightSubsequence(arr);

  // Krok 3: Znajdź min i max w środkowej części
  let minIndex = endLeft + 1;
  let maxIndex = startRight - 1;

  for (let i = endLeft + 1; i <= startRight; i++) {
    if (arr[i] < arr[minIndex]) minIndex = i;
    if (arr[i] > arr[maxIndex]) maxIndex = i;
  }

  // Krok 4: Rozszerz granice w lewo by uwzględnić minimum
  let leftBound = shrinkLeft(arr, minIndex, endLeft);

  // Krok 5: Rozszerz granice w prawo by uwzględnić maksimum
  let rightBound = shrinkRight(arr, maxIndex, startRight);

  return { m: leftBound, n: rightBound };
}

function findEndOfLeftSubsequence(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return i - 1;
    }
  }
  return arr.length - 1;
}

function findStartOfRightSubsequence(arr) {
  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] > arr[i + 1]) {
      return i + 1;
    }
  }
  return 0;
}

function shrinkLeft(arr, minIndex, start) {
  let comp = arr[minIndex];
  for (let i = start; i >= 0; i--) {
    if (arr[i] <= comp) {
      return i + 1;
    }
  }
  return 0;
}

function shrinkRight(arr, maxIndex, start) {
  let comp = arr[maxIndex];
  for (let i = start; i < arr.length; i++) {
    if (arr[i] >= comp) {
      return i - 1;
    }
  }
  return arr.length - 1;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n) - kilka przejść przez tablicę
- Pamięciowa / Space: O(1) - tylko stałe zmienne

### Podejście 3: Uproszczone - O(n) ✓ CZYTELNIEJSZE

**Idea**: Znajdź min/max w nieposortowanej części, potem znajdź gdzie powinny być.

**Idea**: Find min/max in unsorted part, then find where they should be.

```javascript
function findUnsortedSequenceSimple(arr) {
  if (arr.length <= 1) return { m: -1, n: -1 };

  // Krok 1: Znajdź lewą granicę (pierwszy element z maksimum na prawo < element)
  let left = 0;
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < max) {
      left = i; // Ta pozycja jest potencjalną prawą granicą
    } else {
      max = arr[i];
    }
  }

  // Jeśli nie znaleziono, tablica jest posortowana
  if (left === 0) return { m: -1, n: -1 };

  // Krok 2: Znajdź prawą granicę (ostatni element z minimum na lewo > element)
  let right = arr.length - 1;
  let min = arr[arr.length - 1];

  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] > min) {
      right = i; // Ta pozycja jest potencjalną lewą granicą
    } else {
      min = arr[i];
    }
  }

  return { m: right, n: left };
}
```

**Kluczowa Obserwacja / Key Observation**:
- Przechodząc od lewej: jeśli jakikolwiek element z prawej jest mniejszy niż obecne maksimum, ten element musi być w nieposortowanej części
- Przechodząc od prawej: jeśli jakikolwiek element z lewej jest większy niż obecne minimum, ten element musi być w nieposortowanej części

**Złożoność / Complexity**:
- Czasowa / Time: O(n) - dwa przejścia
- Pamięciowa / Space: O(1)

## Szczególne Przypadki / Edge Cases

1. **Pusta tablica**: `[]` → `{m: -1, n: -1}`
2. **Jeden element**: `[5]` → `{m: -1, n: -1}`
3. **Już posortowana**: `[1, 2, 3, 4, 5]` → `{m: -1, n: -1}`
4. **Odwrócona**: `[5, 4, 3, 2, 1]` → `{m: 0, n: 4}`
5. **Duplikaty**: `[1, 2, 2, 3, 3, 4]` → `{m: -1, n: -1}` (już posortowane z duplikatami)
6. **Dwa elementy wymienione**: `[1, 3, 2, 4, 5]` → `{m: 1, n: 2}`

## Przykłady Krok po Kroku / Step-by-Step Examples

### Przykład 1: [1, 2, 4, 7, 10, 11, 7, 12, 6, 7, 16, 18, 19]

**Metoda Uproszczona**:

```
Przejście od lewej (szukamy prawej granicy):
i=0: arr[0]=1,  max=1,  arr[0]≮max → max=1
i=1: arr[1]=2,  max=1,  arr[1]≮max → max=2
i=2: arr[2]=4,  max=2,  arr[2]≮max → max=4
i=3: arr[3]=7,  max=4,  arr[3]≮max → max=7
i=4: arr[4]=10, max=7,  arr[4]≮max → max=10
i=5: arr[5]=11, max=10, arr[5]≮max → max=11
i=6: arr[6]=7,  max=11, arr[6]<max → left=6 ✓
i=7: arr[7]=12, max=11, arr[7]≮max → max=12
i=8: arr[8]=6,  max=12, arr[8]<max → left=8 ✓
i=9: arr[9]=7,  max=12, arr[9]<max → left=9 ✓
i=10: arr[10]=16, max=12, arr[10]≮max → max=16
i=11: arr[11]=18, max=16, arr[11]≮max → max=18
i=12: arr[12]=19, max=18, arr[12]≮max → max=19

Prawa granica: left = 9

Przejście od prawej (szukamy lewej granicy):
i=12: arr[12]=19, min=19, arr[12]≯min → min=19
i=11: arr[11]=18, min=19, arr[11]≯min → min=18
i=10: arr[10]=16, min=18, arr[10]≯min → min=16
i=9: arr[9]=7, min=16, arr[9]≯min → min=7
i=8: arr[8]=6, min=7, arr[8]≯min → min=6
i=7: arr[7]=12, min=6, arr[7]>min → right=7 ✓
i=6: arr[6]=7, min=6, arr[6]>min → right=6 ✓
i=5: arr[5]=11, min=6, arr[5]>min → right=5 ✓
i=4: arr[4]=10, min=6, arr[4]>min → right=4 ✓
i=3: arr[3]=7, min=6, arr[3]>min → right=3 ✓
i=2: arr[2]=4, min=6, arr[2]≯min → min=4
i=1: arr[1]=2, min=4, arr[1]≯min → min=2
i=0: arr[0]=1, min=2, arr[0]≯min → min=1

Lewa granica: right = 3

Wynik: {m: 3, n: 9}
```

### Przykład 2: [1, 3, 2, 4, 5]

```
Przejście od lewej:
max: 1 → 3 → 3 (arr[2]=2<3, left=2) → 4 → 5
left = 2

Przejście od prawej:
min: 5 → 4 → 2 (arr[1]=3>2, right=1) → 3 → 1
right = 1

Wynik: {m: 1, n: 2}
```

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Uproszczone (Podejście 3)**: Najlepsze! Proste, czytelne, O(n)
- **Klasyczne (Podejście 2)**: Bardziej szczegółowe, edukacyjne
- **Brute Force (Podejście 1)**: Gdy nie ma problemu z pamięcią i czasem

## Wnioski / Conclusions

To zadanie uczy:
1. **Analizy wzorców**: Rozpoznawanie posortowanych i nieposortowanych części
2. **Optymalizacji**: Od O(n log n) do O(n) przez lepsze zrozumienie problemu
3. **Myślenia dwukierunkowego**: Analiza od lewej i od prawej strony

This problem teaches:
1. **Pattern analysis**: Recognizing sorted and unsorted parts
2. **Optimization**: From O(n log n) to O(n) through better problem understanding
3. **Bidirectional thinking**: Analysis from both left and right sides

## Zastosowania / Applications

1. **Optymalizacja sortowania**: Sortuj tylko to, co potrzebne
2. **Analiza danych**: Znajdowanie anomalii w prawie posortowanych danych
3. **Walidacja**: Sprawdzanie integralności danych
4. **Kompresja**: Identyfikacja niezmiennych regionów
