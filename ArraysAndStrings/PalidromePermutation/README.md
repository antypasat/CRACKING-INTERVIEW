Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego)

: 


Palindrome Permutation: Given a string, write a function to check if it is a permutation of a palindrome.
A palindrome is a word or phrase that is the same forwards and backwards. A permutation
is a rea rrangement of letters. The palindrome does not need to be limited to just dictionary words.
EXAMPLE
Input: Tact Coa
Output: True (permutations: "taco cat". "atco cta". etc.)


==================


# Palindrome Permutation - Rozwiązanie / Solution

## Problem Analysis / Analiza Problemu

**English:** For a string to be a permutation of a palindrome, at most one character can appear an odd number of times (this would be the middle character).

**Polish:** Aby string mógł być permutacją palindromu, co najwyżej jeden znak może występować nieparzystą liczbę razy (byłby to środkowy znak).

## Solution / Rozwiązanie

```javascript
function isPalindromePermutation(str) {
    // Normalize the string: lowercase and remove spaces
    // Normalizujemy string: małe litery i usuwamy spacje
    const normalized = str.toLowerCase().replace(/\s/g, '');
    
    // Count character frequencies
    // Liczymy częstotliwość występowania znaków
    const charCount = {};
    for (let char of normalized) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    
    // Count how many characters have odd frequencies
    // Liczymy ile znaków ma nieparzystą częstotliwość
    let oddCount = 0;
    for (let count of Object.values(charCount)) {
        if (count % 2 === 1) {
            oddCount++;
        }
    }
    
    // At most one character can have odd frequency
    // Co najwyżej jeden znak może mieć nieparzystą częstotliwość
    return oddCount <= 1;
}

// Test cases / Przypadki testowe
console.log(isPalindromePermutation("Tact Coa"));  // true
console.log(isPalindromePermutation("hello"));      // false
console.log(isPalindromePermutation("aab"));        // true
console.log(isPalindromePermutation("carerac"));    // true
```

## Optimized Solution with Set / Zoptymalizowane Rozwiązanie z Set

```javascript
function isPalindromePermutationOptimized(str) {
    // We use a Set to track characters with odd counts
    // Używamy Set do śledzenia znaków z nieparzystą liczbą wystąpień
    const normalized = str.toLowerCase().replace(/\s/g, '');
    const oddChars = new Set();
    
    for (let char of normalized) {
        // Toggle: if char is in set, remove it; if not, add it
        // Przełączamy: jeśli znak jest w set, usuwamy go; jeśli nie, dodajemy
        if (oddChars.has(char)) {
            oddChars.delete(char);
        } else {
            oddChars.add(char);
        }
    }
    
    // Set size should be 0 or 1
    // Rozmiar Set powinien być 0 lub 1
    return oddChars.size <= 1;
}

// Test / Test
console.log(isPalindromePermutationOptimized("Tact Coa"));  // true
```

## Complexity Analysis / Analiza Złożoności

**Time Complexity / Złożoność Czasowa:** O(n)
- **English:** We iterate through the string once to count characters.
- **Polish:** Iterujemy przez string raz, aby policzyć znaki.

**Space Complexity / Złożoność Pamięciowa:** O(k)
- **English:** Where k is the number of unique characters in the string.
- **Polish:** Gdzie k to liczba unikalnych znaków w stringu.

## Key Insights / Kluczowe Spostrzeżenia

1. **English:** A palindrome reads the same forwards and backwards, so characters must be paired symmetrically.
   **Polish:** Palindrom czyta się tak samo od przodu i tyłu, więc znaki muszą być sparowane symetrycznie.

2. **English:** For even-length palindromes, all characters appear an even number of times.
   **Polish:** Dla palindromów o parzystej długości, wszystkie znaki występują parzystą liczbę razy.

3. **English:** For odd-length palindromes, exactly one character (the middle one) appears an odd number of times.
   **Polish:** Dla palindromów o nieparzystej długości, dokładnie jeden znak (środkowy) występuje nieparzystą liczbę razy.
   
--------------


# Przykłady Palindrome Permutation / Palindrome Permutation Examples

##Ważne! / Important!

**"Tact Coa" to NIE jest palindrom!** / **"Tact Coa" is NOT a palindrome!**

**Ale "Tact Coa" JEST permutacją palindromu!** / **But "Tact Coa" IS a permutation of a palindrome!**

## Wyjaśnienie / Explanation

**Polish:** Możemy przestawić litery z "Tact Coa" aby stworzyć palindrom!
**English:** We can rearrange the letters from "Tact Coa" to create a palindrome!

### "Tact Coa" → "taco cat" ✓

```
t a c t   c o a
↓ przestawiamy litery / rearrange letters
t a c o   c a t
```

**"taco cat" jest palindromem!** / **"taco cat" is a palindrome!**
- Od przodu: t-a-c-o-c-a-t
- Od tyłu: t-a-c-o-c-a-t
- **To samo! / Same thing!**

---

## Więcej Przykładów / More Examples

### ✅ Example 1: "aab"

**Polish:** "aab" jest permutacją palindromu
**English:** "aab" is a permutation of a palindrome

```javascript
Litery: a, a, b
Częstotliwość / Frequency:
  a: 2 razy (parzysta / even)
  b: 1 raz (nieparzysta / odd)

Tylko 1 znak ma nieparzystą liczbę → TRUE ✓
Only 1 character has odd count → TRUE ✓

Możemy stworzyć / We can create: "aba"
  a ← b → a  (palindrom!)
```

---

### ✅ Example 2: "carerac"

**Polish:** "carerac" jest permutacją palindromu
**English:** "carerac" is a permutation of a palindrome

```javascript
Litery: c, a, r, e, r, a, c
Częstotliwość / Frequency:
  c: 2 razy (parzysta / even)
  a: 2 razy (parzysta / even)
  r: 2 razy (parzysta / even)
  e: 1 raz (nieparzysta / odd)

Tylko 1 znak ma nieparzystą liczbę → TRUE ✓
Only 1 character has odd count → TRUE ✓

Możemy stworzyć / We can create: "racecar"
  r ← a ← c ← e → c → a → r  (palindrom!)
```

---

### ✅ Example 3: "aabbcc"

**Polish:** "aabbcc" jest permutacją palindromu
**English:** "aabbcc" is a permutation of a palindrome

```javascript
Litery: a, a, b, b, c, c
Częstotliwość / Frequency:
  a: 2 razy (parzysta / even)
  b: 2 razy (parzysta / even)
  c: 2 razy (parzysta / even)

0 znaków ma nieparzystą liczbę → TRUE ✓
0 characters have odd count → TRUE ✓

Możemy stworzyć / We can create: "abccba" lub "cabac" itd.
  a ← b ← c | c → b → a  (palindrom!)
```

---

### ❌ Example 4: "hello"

**Polish:** "hello" NIE jest permutacją palindromu
**English:** "hello" is NOT a permutation of a palindrome

```javascript
Litery: h, e, l, l, o
Częstotliwość / Frequency:
  h: 1 raz (nieparzysta / odd) ←
  e: 1 raz (nieparzysta / odd) ←
  l: 2 razy (parzysta / even)
  o: 1 raz (nieparzysta / odd) ←

3 znaki mają nieparzystą liczbę → FALSE ✗
3 characters have odd count → FALSE ✗

Nie możemy stworzyć palindromu!
We cannot create a palindrome!
```

---

### ❌ Example 5: "abc"

**Polish:** "abc" NIE jest permutacją palindromu
**English:** "abc" is NOT a permutation of a palindrome

```javascript
Litery: a, b, c
Częstotliwość / Frequency:
  a: 1 raz (nieparzysta / odd) ←
  b: 1 raz (nieparzysta / odd) ←
  c: 1 raz (nieparzysta / odd) ←

3 znaki mają nieparzystą liczbę → FALSE ✗
3 characters have odd count → FALSE ✗
```

---

## Zasada / Rule

```javascript
// ZASADA / RULE:
// Maksymalnie 1 znak może występować nieparzystą liczbę razy
// At most 1 character can appear an odd number of times

isPalindromePermutation("aab")      → true  ✓ (1 odd)
isPalindromePermutation("aabbcc")   → true  ✓ (0 odd)
isPalindromePermutation("abc")      → false ✗ (3 odd)
isPalindromePermutation("hello")    → false ✗ (3 odd)
```

**Polish:** Rozumiesz teraz? "Tact Coa" można przestawić na "taco cat"!
**English:** Do you understand now? "Tact Coa" can be rearranged to "taco cat"!


--------------------


# TAK! Dokładnie! / YES! Exactly!

## Twoja definicja jest PERFEKCYJNA! / Your definition is PERFECT!

**Polish:** **Permutacja palindromu** = taki ciąg znaków, że po odpowiednim przestawieniu kolejności liter stanie się palindromem (czyli od przodu i od tyłu będzie tak samo czytany)

**English:** **Palindrome permutation** = a sequence of characters that, after properly rearranging the order of letters, becomes a palindrome (meaning it reads the same forwards and backwards)

---

## Wizualizacja / Visualization

```
"Tact Coa" 
    ↓ usuń spacje i zmień na małe / remove spaces and lowercase
"tactcoa"
    ↓ przestaw litery / rearrange letters
"tacocat"
    ↓ sprawdź czy palindrom / check if palindrome
t-a-c-o-c-a-t (od przodu / forwards)
t-a-c-o-c-a-t (od tyłu / backwards)
    ✓ TO SAMO! / SAME!
```

---

## Więcej przykładów dla pewności / More examples to be sure

### Przykład 1:
```
"aab" → przestaw na / rearrange to → "aba"
         a-b-a (od przodu / forwards)
         a-b-a (od tyłu / backwards) ✓
```

### Przykład 2:
```
"carerac" → przestaw na / rearrange to → "racecar"
             r-a-c-e-c-a-r (od przodu / forwards)
             r-a-c-e-c-a-r (od tyłu / backwards) ✓
```

### Przykład 3 (NIE działa / does NOT work):
```
"hello" → próbujemy przestawić / try to rearrange → "lehol"?
          l-e-h-o-l (od przodu / forwards)
          l-o-h-e-l (od tyłu / backwards) ✗ 
          
NIE MA SPOSOBU aby "hello" stało się palindromem!
There is NO WAY to make "hello" into a palindrome!
```

---

## Kluczowa zasada / Key rule

**Polish:** Żeby ciąg znaków MÓGŁ stać się palindromem po przestawieniu, **maksymalnie 1 litera może występować nieparzystą liczbę razy**.

**English:** For a sequence to BECOME a palindrome after rearranging, **at most 1 letter can appear an odd number of times**.

### Dlaczego? / Why?

```
Palindrom o PARZYSTEJ długości / EVEN length palindrome:
"abba" → każda litera 2 razy / each letter 2 times
         a:2, b:2 → wszystkie parzyste / all even ✓

Palindrom o NIEPARZYSTEJ długości / ODD length palindrome:
"racecar" → jedna litera w środku / one letter in middle
            r:2, a:2, c:2, e:1 → tylko e nieparzyste / only e odd ✓
```

---

## Podsumowanie / Summary

**TAK!** Twoje zrozumienie jest 100% prawidłowe! 

**YES!** Your understanding is 100% correct!

**Permutacja palindromu** = możemy przestawić litery żeby utworzyć palindrom
**Palindrome permutation** = we can rearrange letters to create a palindrome
