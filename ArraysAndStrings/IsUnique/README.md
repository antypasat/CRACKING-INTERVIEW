Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego)

: 

Is Unique: Implement an algorithm to determine if a string has all unique characters. What if you
cannot use additional data structures?


===================


# Is Unique - Sprawdzanie Unikalności Znaków w Stringu

Świetne pytanie rekrutacyjne! Pokażę ci kilka podejść z różnymi kompromisami.
Great interview question! I'll show you several approaches with different trade-offs.

## Podejście 1: Używając Set (Z Dodatkową Strukturą Danych)
## Approach 1: Using a Set (With Additional Data Structure)

```javascript
function isUnique(str) {
  // Set automatycznie obsługuje unikalność
  // Set automatically handles uniqueness
  return new Set(str).size === str.length;
}

// Alternatywa z wcześniejszym zwrotem
// Alternative with early return
function isUniqueSet(str) {
  const seen = new Set();
  
  for (let char of str) {
    if (seen.has(char)) {
      return false; // Znaleziono duplikat / Found duplicate
    }
    seen.add(char);
  }
  
  return true;
}
```

**Złożoność czasowa / Time Complexity:** O(n)  
**Złożoność pamięciowa / Space Complexity:** O(min(n, a)) gdzie a to rozmiar alfabetu / where a is the alphabet size

## Podejście 2: Używając Obiektu/Mapy
## Approach 2: Using an Object/Map

```javascript
function isUniqueMap(str) {
  const charMap = {};
  
  for (let char of str) {
    if (charMap[char]) {
      return false; // Znak już istnieje / Character already exists
    }
    charMap[char] = true;
  }
  
  return true;
}
```

**Złożoność czasowa / Time Complexity:** O(n)  
**Złożoność pamięciowa / Space Complexity:** O(min(n, a))

## Podejście 3: Bez Dodatkowych Struktur Danych - Zagnieżdżona Pętla
## Approach 3: No Additional Data Structures - Nested Loop

```javascript
function isUniqueNoDS(str) {
  // Porównaj każdy znak z każdym innym znakiem
  // Compare each character with every other character
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j < str.length; j++) {
      if (str[i] === str[j]) {
        return false; // Znaleziono duplikat / Found duplicate
      }
    }
  }
  
  return true;
}
```

**Złożoność czasowa / Time Complexity:** O(n²)  
**Złożoność pamięciowa / Space Complexity:** O(1)

## Podejście 4: Sortowanie (Bez Dodatkowej Pamięci - Modyfikuje String)
## Approach 4: Sorting (No Extra Memory - Modifies String)

```javascript
function isUniqueSort(str) {
  // Sortuj znaki i sprawdź sąsiadujące
  // Sort characters and check adjacent ones
  const sorted = str.split('').sort().join('');
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] === sorted[i + 1]) {
      return false; // Duplikat obok siebie / Duplicate next to each other
    }
  }
  
  return true;
}
```

**Złożoność czasowa / Time Complexity:** O(n log n)  
**Złożoność pamięciowa / Space Complexity:** O(n) dla tablicy / for array

## Podejście 5: Bit Vector (Tylko dla ASCII/małych liter)
## Approach 5: Bit Vector (Only for ASCII/lowercase letters)

```javascript
function isUniqueBitVector(str) {
  // Zakładamy tylko małe litery a-z
  // Assume only lowercase letters a-z
  let checker = 0;
  
  for (let char of str) {
    const val = char.charCodeAt(0) - 'a'.charCodeAt(0);
    
    // Sprawdź czy bit jest już ustawiony
    // Check if bit is already set
    if ((checker & (1 << val)) > 0) {
      return false;
    }
    
    // Ustaw bit dla tego znaku
    // Set bit for this character
    checker |= (1 << val);
  }
  
  return true;
}
```

**Złożoność czasowa / Time Complexity:** O(n)  
**Złożoność pamięciowa / Space Complexity:** O(1)

## Testy / Tests

```javascript
// Przypadki testowe / Test cases
console.log(isUnique("abcdef"));      // true
console.log(isUnique("hello"));       // false (dwa 'l' / two 'l's)
console.log(isUnique(""));            // true (pusty string / empty string)
console.log(isUnique("a"));           // true
console.log(isUnique("aA"));          // true (rozróżnia wielkość liter / case sensitive)

// Bez dodatkowych struktur / Without additional structures
console.log(isUniqueNoDS("abcdef")); // true
console.log(isUniqueNoDS("hello"));  // false
```

## Optymalizacja: Wczesne Zakończenie
## Optimization: Early Termination

```javascript
function isUniqueOptimized(str) {
  // Jeśli długość > 128 (ASCII) lub 256 (Extended ASCII),
  // musi być duplikat (Zasada Szufladkowa Dirichleta)
  // If length > 128 (ASCII) or 256 (Extended ASCII),
  // must have duplicate (Pigeonhole Principle)
  if (str.length > 128) return false;
  
  const seen = new Set();
  
  for (let char of str) {
    if (seen.has(char)) return false;
    seen.add(char);
  }
  
  return true;
}
```

## Pytania Do Rozmówcy / Questions for Interviewer

1. **Jaki zestaw znaków?** / **What character set?**
   - ASCII (128 znaków) / ASCII (128 characters)
   - Extended ASCII (256 znaków) / Extended ASCII (256 characters)  
   - Unicode (setki tysięcy) / Unicode (hundreds of thousands)

2. **Czy wielkość liter ma znaczenie?** / **Is case sensitive?**
   - "Aa" jest unikalne czy nie? / Is "Aa" unique or not?

3. **Ograniczenia pamięci?** / **Memory constraints?**
   - Możemy użyć dodatkowych struktur? / Can we use additional structures?

## Która Metoda Kiedy? / Which Method When?

- **Set/Map**: Najlepsze ogólne rozwiązanie / Best general solution
- **Zagnieżdżona pętla / Nested loop**: Gdy pamięć jest ograniczona / When memory is constrained
- **Bit Vector**: Gdy znamy alfabet (np. a-z) / When we know alphabet (e.g., a-z)
- **Sortowanie / Sorting**: Kompromis między czasem a pamięcią / Trade-off between time and space