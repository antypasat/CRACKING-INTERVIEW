Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego):

Rotate Matrix: Given an image represented by an NxN matrix, where each pixel in the image is 4
bytes, write a method to rotate the image by 90 degrees. (an you do this in place?


=============================

# Rotate Matrix 90 Degrees
*Obrót macierzy o 90 stopni*

## Problem Understanding | Zrozumienie problemu

**English:** We need to rotate an NxN matrix 90 degrees clockwise, ideally in-place (without using extra space for another matrix).

**Polski:** Musimy obrócić macierz NxN o 90 stopni zgodnie z ruchem wskazówek zegara, najlepiej w miejscu (bez używania dodatkowej pamięci na inną macierz).

## Approach | Podejście

**English:** The key insight is that a 90-degree clockwise rotation can be achieved in two steps:

**Polski:** Kluczowa obserwacja: obrót o 90 stopni zgodnie z ruchem wskazówek zegara można osiągnąć w dwóch krokach:

1. **Transpose the matrix** | **Transponuj macierz** - swap elements across the diagonal (matrix[i][j] ↔ matrix[j][i])
2. **Reverse each row** | **Odwróć każdy wiersz** - reverse the order of elements in each row

## Implementation | Implementacja

```javascript
/**
 * Rotates an NxN matrix 90 degrees clockwise in-place
 * Obraca macierz NxN o 90 stopni zgodnie z ruchem wskazówek zegara w miejscu
 *
 * @param {number[][]} matrix - NxN matrix to rotate
 * @returns {number[][]} - The rotated matrix (same reference)
 */
function rotateMatrix(matrix) {
    // Check if matrix is valid | Sprawdź czy macierz jest poprawna
    if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
        return matrix;
    }

    const n = matrix.length;

    // Step 1: Transpose the matrix | Krok 1: Transponuj macierz
    // Swap elements across diagonal | Zamień elementy wzdłuż przekątnej
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // Swap matrix[i][j] with matrix[j][i]
            // Zamień matrix[i][j] z matrix[j][i]
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // Step 2: Reverse each row | Krok 2: Odwróć każdy wiersz
    for (let i = 0; i < n; i++) {
        let left = 0;
        let right = n - 1;

        while (left < right) {
            // Swap elements | Zamień elementy
            [matrix[i][left], matrix[i][right]] = [matrix[i][right], matrix[i][left]];
            left++;
            right--;
        }
    }

    return matrix;
}
```

## Visual Example | Wizualny przykład

```javascript
// Original matrix | Oryginalna macierz
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// After transpose | Po transpozycji
// [1, 4, 7]
// [2, 5, 8]
// [3, 6, 9]

// After reversing rows | Po odwróceniu wierszy
// [7, 4, 1]
// [8, 5, 2]
// [9, 6, 3]
```

## Alternative: Layer-by-Layer Rotation | Alternatywa: Obrót warstwa po warstwie

**English:** Another approach is to rotate the matrix layer by layer, swapping 4 elements at a time.

**Polski:** Inne podejście to obracanie macierzy warstwa po warstwie, zamieniając 4 elementy naraz.

```javascript
function rotateMatrixLayerByLayer(matrix) {
    if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
        return matrix;
    }

    const n = matrix.length;

    // Process layer by layer | Przetwarzaj warstwę po warstwie
    for (let layer = 0; layer < Math.floor(n / 2); layer++) {
        const first = layer;
        const last = n - 1 - layer;

        for (let i = first; i < last; i++) {
            const offset = i - first;

            // Save top | Zapisz górę
            const top = matrix[first][i];

            // left -> top | lewy -> góra
            matrix[first][i] = matrix[last - offset][first];

            // bottom -> left | dół -> lewy
            matrix[last - offset][first] = matrix[last][last - offset];

            // right -> bottom | prawy -> dół
            matrix[last][last - offset] = matrix[i][last];

            // top -> right | góra -> prawy
            matrix[i][last] = top;
        }
    }

    return matrix;
}
```

## Complexity Analysis | Analiza złożoności

**Time Complexity | Złożoność czasowa:** O(n²)
- **English:** We visit each element once
- **Polski:** Odwiedzamy każdy element raz

**Space Complexity | Złożoność pamięciowa:** O(1)
- **English:** In-place rotation, only constant extra space
- **Polski:** Obrót w miejscu, tylko stała dodatkowa pamięć

## Test Cases | Przypadki testowe

```javascript
// Test 1: 3x3 matrix
console.log(rotateMatrix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]));
// Expected | Oczekiwany wynik: [[7,4,1],[8,5,2],[9,6,3]]

// Test 2: 4x4 matrix
console.log(rotateMatrix([
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9,  10, 11, 12],
    [13, 14, 15, 16]
]));
// Expected | Oczekiwany wynik: [[13,9,5,1],[14,10,6,2],[15,11,7,3],[16,12,8,4]]

// Test 3: 1x1 matrix
console.log(rotateMatrix([[1]]));
// Expected | Oczekiwany wynik: [[1]]
```

## Interview Tips | Wskazówki do rozmowy kwalifikacyjnej

**English:**
1. Clarify if rotation should be clockwise or counter-clockwise
2. Ask about the size constraints (will it fit in memory?)
3. Mention both approaches and their trade-offs
4. Test with edge cases (1x1, 2x2 matrices)

**Polski:**
1. Wyjaśnij czy obrót ma być zgodnie czy przeciwnie do ruchu wskazówek zegara
2. Zapytaj o ograniczenia rozmiaru (czy zmieści się w pamięci?)
3. Wspomnij oba podejścia i ich wady/zalety
4. Przetestuj przypadki brzegowe (macierze 1x1, 2x2)


----------------------------



# Szczegółowe rozwinięcie wskazówek | Detailed expansion of tips

## 1. Ograniczenia rozmiaru (pamięć) | Size constraints (memory)

### Pytania do zadania podczas interview | Questions to ask during interview:

**English:** "What's the maximum size of N we need to handle?"

**Polski:** "Jaki jest maksymalny rozmiar N, który musimy obsłużyć?"

---

### Analiza pamięci | Memory analysis:

```javascript
// Przykład: macierz 1000x1000 z 4-bajtowymi pikselami
// Example: 1000x1000 matrix with 4-byte pixels

const n = 1000;
const bytesPerPixel = 4;
const totalBytes = n * n * bytesPerPixel;
// = 1,000,000 × 4 = 4,000,000 bytes = ~4 MB

console.log(`Memory needed | Potrzebna pamięć: ${totalBytes / 1024 / 1024} MB`);
```

**English:** For reasonable image sizes (up to 10,000×10,000), in-place rotation is feasible.

**Polski:** Dla rozsądnych rozmiarów obrazów (do 10,000×10,000), obrót w miejscu jest wykonalny.

---

### Różne scenariusze | Different scenarios:

```javascript
// Mała macierz | Small matrix
// 100×100 = 40 KB ✓ Żaden problem | No problem

// Średnia macierz | Medium matrix
// 1,000×1,000 = 4 MB ✓ OK

// Duża macierz | Large matrix
// 10,000×10,000 = 400 MB ✓ Możliwe ale wolne | Possible but slow

// Bardzo duża macierz | Very large matrix
// 100,000×100,000 = 40 GB ✗ Nie zmieści się w RAM
//                          ✗ Won't fit in RAM
```

**English:** For very large matrices, you might need to discuss:
- Streaming/chunking approaches
- Disk-based processing
- Distributed processing

**Polski:** Dla bardzo dużych macierzy, możesz potrzebować omówić:
- Podejścia strumieniowe/fragmentami
- Przetwarzanie z użyciem dysku
- Przetwarzanie rozproszone

---

## 2. Porównanie obu podejść | Comparison of both approaches

### Podejście 1: Transpose + Reverse | Approach 1: Transpose + Reverse

```javascript
function rotateTransposeReverse(matrix) {
    const n = matrix.length;

    // Transpose | Transpozycja
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // Reverse rows | Odwróć wiersze
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }

    return matrix;
}
```

#### Zalety | Advantages:
✅ **English:** Easy to understand and explain
✅ **Polski:** Łatwe do zrozumienia i wyjaśnienia

✅ **English:** Clear two-step logic
✅ **Polski:** Jasna logika dwóch kroków

✅ **English:** Can use built-in `.reverse()` method
✅ **Polski:** Można użyć wbudowanej metody `.reverse()`

✅ **English:** Less prone to index calculation errors
✅ **Polski:** Mniej podatne na błędy w obliczeniach indeksów

#### Wady | Disadvantages:
❌ **English:** Two separate loops (though still O(n²))
❌ **Polski:** Dwie oddzielne pętle (choć dalej O(n²))

❌ **English:** Slightly more cache misses in transpose step
❌ **Polski:** Nieco więcej pudełek cache w kroku transpozycji

---

### Podejście 2: Layer-by-Layer | Approach 2: Warstwa po warstwie

```javascript
function rotateLayerByLayer(matrix) {
    const n = matrix.length;

    for (let layer = 0; layer < Math.floor(n / 2); layer++) {
        const first = layer;
        const last = n - 1 - layer;

        for (let i = first; i < last; i++) {
            const offset = i - first;
            const top = matrix[first][i];

            matrix[first][i] = matrix[last - offset][first];
            matrix[last - offset][first] = matrix[last][last - offset];
            matrix[last][last - offset] = matrix[i][last];
            matrix[i][last] = top;
        }
    }

    return matrix;
}
```

#### Zalety | Advantages:
✅ **English:** Single pass through matrix
✅ **Polski:** Jedno przejście przez macierz

✅ **English:** Better cache locality (processes layer by layer)
✅ **Polski:** Lepsza lokalność cache (przetwarza warstwę po warstwie)

✅ **English:** More "elegant" algorithmic approach
✅ **Polski:** Bardziej "eleganckie" podejście algorytmiczne

#### Wady | Disadvantages:
❌ **English:** More complex to understand and implement
❌ **Polski:** Bardziej skomplikowane do zrozumienia i implementacji

❌ **English:** Easy to make mistakes with index calculations
❌ **Polski:** Łatwo popełnić błędy w obliczeniach indeksów

❌ **English:** Harder to debug
❌ **Polski:** Trudniejsze do debugowania

---

## 3. Przypadki brzegowe | Edge cases

### Test Case 1: Macierz 1×1 | 1×1 Matrix

```javascript
const matrix1x1 = [[5]];
console.log('Before | Przed:', matrix1x1);
rotateMatrix(matrix1x1);
console.log('After | Po:', matrix1x1);
// Expected | Oczekiwany: [[5]]

// Wyjaśnienie | Explanation:
// English: Single element, rotation doesn't change anything
// Polski: Jeden element, obrót nic nie zmienia
```

---

### Test Case 2: Macierz 2×2 | 2×2 Matrix

```javascript
const matrix2x2 = [
    [1, 2],
    [3, 4]
];

console.log('Before | Przed:');
console.log('[1, 2]');
console.log('[3, 4]');

rotateMatrix(matrix2x2);

console.log('After | Po:');
console.log('[3, 1]');
console.log('[4, 2]');

// Krok po kroku | Step by step:
//
// Original | Oryginał:     Transpose | Transpozycja:     Reverse | Odwrócenie:
// [1, 2]                    [1, 3]                        [3, 1]
// [3, 4]                    [2, 4]                        [4, 2]
```

---

### Test Case 3: Pusta macierz | Empty matrix

```javascript
const emptyMatrix = [];
console.log(rotateMatrix(emptyMatrix)); // []

// English: Should return empty array without crashing
// Polski: Powinno zwrócić pustą tablicę bez crashowania
```

---

### Test Case 4: Null/Undefined

```javascript
console.log(rotateMatrix(null));      // null
console.log(rotateMatrix(undefined)); // undefined

// English: Should handle gracefully
// Polski: Powinno obsłużyć z gracją
```

---

### Test Case 5: Macierz niekwadratowa | Non-square matrix

```javascript
const nonSquare = [
    [1, 2, 3],
    [4, 5, 6]
];

console.log(rotateMatrix(nonSquare));
// Expected | Oczekiwany: zwraca oryginalną macierz bez zmian
//                        returns original matrix unchanged

// English: Should return original matrix or throw error (depending on spec)
// Polski: Powinno zwrócić oryginalną macierz lub rzucić błąd (zależnie od specyfikacji)
```

---

### Test Case 6: Macierz z powtarzającymi się wartościami | Matrix with duplicate values

```javascript
const duplicates = [
    [1, 1, 1],
    [2, 2, 2],
    [3, 3, 3]
];

rotateMatrix(duplicates);
console.log(duplicates);
// Expected | Oczekiwany:
// [3, 2, 1]
// [3, 2, 1]
// [3, 2, 1]

// English: Make sure algorithm doesn't rely on unique values
// Polski: Upewnij się, że algorytm nie polega na unikalnych wartościach
```

---

### Test Case 7: Duża macierz (performance) | Large matrix

```javascript
function testPerformance() {
    const n = 1000;
    const largeMatrix = Array(n).fill(0).map((_, i) =>
        Array(n).fill(0).map((_, j) => i * n + j)
    );

    console.time('Rotation time | Czas obrotu');
    rotateMatrix(largeMatrix);
    console.timeEnd('Rotation time | Czas obrotu');
}

testPerformance();

// English: Test if algorithm performs well with large inputs
// Polski: Przetestuj czy algorytm działa dobrze z dużymi danymi wejściowymi
```

---

## Pytania do zadania na interview | Questions to ask during interview:

1. **English:** "Should I handle non-square matrices or can I assume NxN?"
   **Polski:** "Czy powinienem obsługiwać niekwadratowe macierze czy mogę założyć NxN?"

2. **English:** "Is 90° clockwise or counter-clockwise?"
   **Polski:** "Czy 90° zgodnie czy przeciwnie do ruchu wskazówek zegara?"

3. **English:** "What should I return for invalid inputs?"
   **Polski:** "Co powinienem zwrócić dla nieprawidłowych danych wejściowych?"

4. **English:** "Are there any constraints on N (min/max size)?"
   **Polski:** "Czy są jakieś ograniczenia na N (min/max rozmiar)?"

5. **English:** "Can I modify the input matrix or should I create a new one?"
   **Polski:** "Czy mogę modyfikować macierz wejściową czy powinienem stworzyć nową?"
