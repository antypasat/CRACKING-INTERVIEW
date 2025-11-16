String Compression: Implement a method to perform basic string compression using the counts
of repeated characters. For example, the string aabcccccaaa would become a2b1c5a3. If the
"compressed" string would not become smaller than the original string, your method should return
the original string. You can assume the string has only uppercase and lowercase letters (a - z).


=============


# String Compression - Implementacja w JavaScript
*String Compression - Implementation in JavaScript*

## Rozwiązanie / Solution

```javascript
function compressString(str) {
    // Sprawdź przypadek brzegowy: pusty string lub jeden znak
    // Check edge case: empty string or single character
    if (str.length <= 1) {
        return str;
    }
    
    // Zbuduj skompresowany string
    // Build compressed string
    let compressed = '';
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        // Jeśli następny znak jest taki sam, zwiększ licznik
        // If next character is the same, increase counter
        if (i + 1 < str.length && str[i] === str[i + 1]) {
            count++;
        } else {
            // Dodaj znak i jego liczbę do wyniku
            // Add character and its count to result
            compressed += str[i] + count;
            count = 1; // Reset licznika / Reset counter
        }
    }
    
    // Zwróć krótszy string (oryginalny lub skompresowany)
    // Return shorter string (original or compressed)
    return compressed.length < str.length ? compressed : str;
}

// Testy / Tests
console.log(compressString("aabcccccaaa"));  // "a2b1c5a3"
console.log(compressString("abcdef"));        // "abcdef" (kompresja nie skraca / compression doesn't shorten)
console.log(compressString("aabbcc"));        // "aabbcc" (równa długość, zwróć oryginał / equal length, return original)
console.log(compressString("aaaa"));          // "a4"
console.log(compressString("a"));             // "a"
console.log(compressString(""));              // ""
```

## Złożoność / Complexity

- **Złożoność czasowa / Time Complexity**: O(n)
  - Przechodzimy przez string tylko raz / We iterate through the string only once
  
- **Złożoność pamięciowa / Space Complexity**: O(n)
  - W najgorszym przypadku skompresowany string może być dłuższy / In worst case, compressed string could be longer

## Alternatywne rozwiązanie z wcześniejszą optymalizacją
*Alternative solution with early optimization*

```javascript
function compressStringOptimized(str) {
    // Sprawdź długość przed kompresją
    // Check length before compression
    const finalLength = calculateCompressedLength(str);
    if (finalLength >= str.length) {
        return str;
    }
    
    // Buduj skompresowany string tylko jeśli będzie krótszy
    // Build compressed string only if it will be shorter
    let compressed = '';
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        if (i + 1 < str.length && str[i] === str[i + 1]) {
            count++;
        } else {
            compressed += str[i] + count;
            count = 1;
        }
    }
    
    return compressed;
}

function calculateCompressedLength(str) {
    // Oblicz długość bez budowania stringa
    // Calculate length without building the string
    let compressedLength = 0;
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        if (i + 1 < str.length && str[i] === str[i + 1]) {
            count++;
        } else {
            compressedLength += 1 + count.toString().length;
            count = 1;
        }
    }
    
    return compressedLength;
}
```

## Kluczowe punkty do omówienia na rozmowie kwalifikacyjnej
*Key points to discuss in interview*

1. **Przypadki brzegowe / Edge cases**:
   - Pusty string / Empty string
   - String z jednym znakiem / Single character string
   - String bez powtórzeń / String without repetitions

2. **Optymalizacja / Optimization**:
   - Można najpierw obliczyć długość wynikową / Can calculate final length first
   - Unikamy niepotrzebnego budowania stringa / Avoid unnecessary string building

3. **Użycie StringBuilder (w innych językach) / StringBuilder usage (in other languages)**:
   - W JavaScript konkatenacja stringów jest akceptowalna dla małych stringów / String concatenation is acceptable for small strings in JavaScript
   - W Javie lepiej użyć StringBuilder / In Java, better to use StringBuilder
   
   
-------------


# Świetne pytanie! / Excellent question!

## Krótka odpowiedź / Short answer

**TAK, wpływa na złożoność czasową w praktyce, ale NIE w notacji Big O**
*YES, it affects time complexity in practice, but NOT in Big O notation*

## Szczegółowe wyjaśnienie / Detailed explanation

### Wersja podstawowa / Basic version
```javascript
function compressString(str) {
    let compressed = '';
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        if (i + 1 < str.length && str[i] === str[i + 1]) {
            count++;
        } else {
            compressed += str[i] + count;  // Budujemy string ZAWSZE
            count = 1;                      // We build string ALWAYS
        }
    }
    
    // Dopiero na końcu sprawdzamy czy miało sens
    // Only at the end we check if it made sense
    return compressed.length < str.length ? compressed : str;
}
```

**Złożoność / Complexity**: O(n) - ale wykonujemy O(n) operacji konkatenacji
*but we perform O(n) concatenation operations*

### Wersja zoptymalizowana / Optimized version
```javascript
function compressStringOptimized(str) {
    // NAJPIERW tylko obliczamy długość (szybkie)
    // FIRST we only calculate length (fast)
    const finalLength = calculateCompressedLength(str);
    
    if (finalLength >= str.length) {
        return str;  // ⚡ WCZESNE WYJŚCIE! Oszczędzamy pracę
                     // ⚡ EARLY EXIT! We save work
    }
    
    // Budujemy string tylko jeśli wiemy że będzie krótszy
    // We build string only if we know it will be shorter
    let compressed = '';
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        if (i + 1 < str.length && str[i] === str[i + 1]) {
            count++;
        } else {
            compressed += str[i] + count;
            count = 1;
        }
    }
    
    return compressed;
}
```

**Złożoność / Complexity**: Nadal O(n), ale w praktyce szybsze!
*Still O(n), but faster in practice!*

## Porównanie przypadków / Case comparison

### Przypadek 1: String bez powtórzeń / String without repetitions
```javascript
let str = "abcdefgh";  // 8 znaków / 8 characters

// Wersja podstawowa / Basic version:
// 1. Buduje "a1b1c1d1e1f1g1h1" (16 znaków) - O(n) operacji
//    Builds "a1b1c1d1e1f1g1h1" (16 chars) - O(n) operations
// 2. Porównuje 16 < 8 ? NIE
//    Compares 16 < 8 ? NO
// 3. Zwraca oryginalny string
//    Returns original string
// ZMARNOWANA PRACA! / WASTED WORK!

// Wersja zoptymalizowana / Optimized version:
// 1. Oblicza długość: 16 - O(n) ale tylko arytmetyka
//    Calculates length: 16 - O(n) but only arithmetic
// 2. Porównuje 16 >= 8 ? TAK
//    Compares 16 >= 8 ? YES
// 3. Zwraca oryginalny string NATYCHMIAST
//    Returns original string IMMEDIATELY
// ⚡ Nie budujemy niepotrzebnego stringa!
// ⚡ We don't build unnecessary string!
```

### Przypadek 2: String z powtórzeniami / String with repetitions
```javascript
let str = "aaaaabbbbb";  // 10 znaków / 10 characters

// Obie wersje / Both versions:
// 1. Obliczają/budują "a5b5" (4 znaki)
//    Calculate/build "a5b5" (4 chars)
// 2. 4 < 10 ✓
// 3. Zwracają skompresowany
//    Return compressed

// W tym przypadku optymalizacja nie pomaga dużo
// In this case optimization doesn't help much
```

## Wpływ na złożoność / Impact on complexity

| Aspekt / Aspect | Podstawowa / Basic | Zoptymalizowana / Optimized |
|-----------------|-------------------|----------------------------|
| **Big O notation** | O(n) | O(n) |
| **Liczba przejść / Number of passes** | 1 | 2 (ale drugie warunkowe / but second conditional) |
| **Operacje na stringach / String operations** | Zawsze / Always | Tylko gdy potrzebne / Only when needed |
| **Przypadek pesymistyczny / Worst case** | O(n) konkatenacji / concatenations | O(n) arytmetyki + O(n) konkatenacji / arithmetic + concatenations |
| **Przypadek optymistyczny / Best case** | O(n) konkatenacji / concatenations | O(n) arytmetyki (szybsze!) / arithmetic (faster!) |

## Dlaczego Big O się nie zmienia? / Why doesn't Big O change?

```javascript
// Wersja podstawowa / Basic version:
// T(n) = O(n)  - jedna pętla / one loop

// Wersja zoptymalizowana / Optimized version:
// T(n) = O(n) + O(n) = O(2n) = O(n)  - dwie pętle ale wciąż liniowe
//                                    - two loops but still linear

// W Big O stałe są ignorowane: O(2n) = O(n)
// In Big O constants are ignored: O(2n) = O(n)
```

## Ale w praktyce... / But in practice...

```javascript
// Konkatenacja stringów jest DROŻSZA niż arytmetyka
// String concatenation is MORE EXPENSIVE than arithmetic

// Arytmetyka: count++, compressedLength += 1
// ⚡ Bardzo szybkie operacje na liczbach
// ⚡ Very fast operations on numbers

// Konkatenacja: compressed += str[i] + count
// 🐌 Tworzenie nowych stringów w pamięci (stringi są immutable)
// 🐌 Creating new strings in memory (strings are immutable)
```

## Podsumowanie dla rozmowy kwalifikacyjnej / Interview summary

Na rozmowie powiedz / In interview say:

✅ **"Big O pozostaje O(n) w obu przypadkach"**
*"Big O remains O(n) in both cases"*

✅ **"Ale optymalizacja poprawia wydajność w praktyce, szczególnie dla stringów, które nie kompresują się dobrze"**
*"But optimization improves performance in practice, especially for strings that don't compress well"*

✅ **"Unikamy kosztownych operacji konkatenacji stringów, gdy wiemy że wynik będzie odrzucony"**
*"We avoid expensive string concatenation operations when we know the result will be discarded"*

✅ **"To trade-off: dodatkowe przejście przez string vs unikanie niepotrzebnej alokacji pamięci"**
*"It's a trade-off: additional pass through string vs avoiding unnecessary memory allocation"*

❌ **NIE mów:** "Zmienia się złożoność z O(n) na O(1)"
*DON'T say: "Complexity changes from O(n) to O(1)"*
