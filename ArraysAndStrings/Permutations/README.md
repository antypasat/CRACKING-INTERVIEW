Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego):

Check Permutation: Given two strings, write a method to decide if one is a permutation of the other.

====================================


# Check Permutation - Interview Question
*Sprawdź Permutację - Pytanie rekrutacyjne*

## Problem Understanding | Zrozumienie problemu

**English:** We need to check if two strings are permutations of each other.
**Polski:** Musimy sprawdzić, czy dwa stringi są permutacjami siebie nawzajem.

**English:** A permutation means both strings contain the same characters with the same frequencies.
**Polski:** Permutacja oznacza, że oba stringi zawierają te same znaki z tymi samymi częstotliwościami.

**Example | Przykład:**
- `"abc"` and `"bca"` → `true` (permutations)
- `"abc"` and `"def"` → `false` (different characters)

---

## Solution 1: Sorting Approach | Podejście z sortowaniem

**English:** Sort both strings and compare them.
**Polski:** Posortuj oba stringi i porównaj je.

```javascript
function checkPermutation(str1, str2) {
  // English: If lengths differ, they cannot be permutations
  // Polski: Jeśli długości się różnią, nie mogą być permutacjami
  if (str1.length !== str2.length) {
    return false;
  }

  // English: Sort both strings and compare
  // Polski: Posortuj oba stringi i porównaj
  const sorted1 = str1.split('').sort().join('');
  const sorted2 = str2.split('').sort().join('');

  return sorted1 === sorted2;
}

// Test cases | Przypadki testowe
console.log(checkPermutation("abc", "bca"));  // true
console.log(checkPermutation("abc", "def"));  // false
console.log(checkPermutation("hello", "olleh")); // true
```

**Time Complexity | Złożoność czasowa:** O(n log n) due to sorting | z powodu sortowania
**Space Complexity | Złożoność pamięciowa:** O(n) for the sorted strings | dla posortowanych stringów

---

## Solution 2: Character Count (Hash Map) | Liczenie znaków (Mapa haszująca)

**English:** Count character frequencies using a hash map.
**Polski:** Zlicz częstotliwości znaków używając mapy haszującej.

```javascript
function checkPermutation(str1, str2) {
  // English: If lengths differ, they cannot be permutations
  // Polski: Jeśli długości się różnią, nie mogą być permutacjami
  if (str1.length !== str2.length) {
    return false;
  }

  // English: Create a character count map
  // Polski: Utwórz mapę liczności znaków
  const charCount = {};

  // English: Count characters in first string
  // Polski: Zlicz znaki w pierwszym stringu
  for (let char of str1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // English: Subtract counts for second string
  // Polski: Odejmij liczności dla drugiego stringu
  for (let char of str2) {
    if (!charCount[char]) {
      // English: Character not found or count already zero
      // Polski: Znak nie znaleziony lub liczność już zero
      return false;
    }
    charCount[char]--;
  }

  // English: If we got here, strings are permutations
  // Polski: Jeśli dotarliśmy tutaj, stringi są permutacjami
  return true;
}

// Test cases | Przypadki testowe
console.log(checkPermutation("abc", "bca"));  // true
console.log(checkPermutation("abc", "def"));  // false
console.log(checkPermutation("aab", "aba"));  // true
```

**Time Complexity | Złożoność czasowa:** O(n) linear time | czas liniowy
**Space Complexity | Złożoność pamięciowa:** O(n) for the hash map | dla mapy haszującej

---

## Solution 3: Using Map (Modern JS) | Używając Map (Nowoczesny JS)

```javascript
function checkPermutation(str1, str2) {
  // English: Check lengths first
  // Polski: Najpierw sprawdź długości
  if (str1.length !== str2.length) return false;

  // English: Use Map for character counting
  // Polski: Użyj Map do liczenia znaków
  const charMap = new Map();

  // English: Increment counts for str1
  // Polski: Zwiększ liczności dla str1
  for (let char of str1) {
    charMap.set(char, (charMap.get(char) || 0) + 1);
  }

  // English: Decrement counts for str2
  // Polski: Zmniejsz liczności dla str2
  for (let char of str2) {
    if (!charMap.has(char)) return false;
    charMap.set(char, charMap.get(char) - 1);
    if (charMap.get(char) < 0) return false;
  }

  return true;
}
```

---

## Edge Cases to Consider | Przypadki brzegowe do rozważenia

```javascript
// English: Empty strings
// Polski: Puste stringi
console.log(checkPermutation("", ""));  // true

// English: Case sensitivity
// Polski: Rozróżnianie wielkości liter
console.log(checkPermutation("Abc", "abc"));  // false

// English: Whitespace matters
// Polski: Białe znaki mają znaczenie
console.log(checkPermutation("a b", "ab"));  // false

// English: Special characters
// Polski: Znaki specjalne
console.log(checkPermutation("a@b", "b@a"));  // true
```

---

## Which Solution to Use? | Którego rozwiązania użyć?

**English:** In an interview, I'd recommend **Solution 2 (Hash Map)** because:
**Polski:** Na rozmowie kwalifikacyjnej polecam **Rozwiązanie 2 (Mapa haszująca)** ponieważ:

1. **English:** Better time complexity O(n) vs O(n log n)
   **Polski:** Lepsza złożoność czasowa O(n) vs O(n log n)

2. **English:** Shows understanding of hash tables
   **Polski:** Pokazuje zrozumienie tablic haszujących

3. **English:** More efficient for large strings
   **Polski:** Bardziej wydajne dla dużych stringów









-----------


# Mniej oczywiste przykłady permutacji
*Less obvious permutation examples*

## ✅ TO SĄ PERMUTACJE | THESE ARE PERMUTATIONS

```javascript
// 1. Powtarzające się znaki | Repeating characters
checkPermutation("aabbcc", "abcabc")  // true
// English: Same characters with same frequencies
// Polski: Te same znaki z tymi samymi częstotliwościami

// 2. Tylko spacje | Only spaces
checkPermutation("   ", "   ")  // true
// English: Three spaces in both strings
// Polski: Trzy spacje w obu stringach

// 3. Mix spacji i liter | Mix of spaces and letters
checkPermutation("a b c", "c a b")  // true
// English: Spaces count as characters too!
// Polski: Spacje też liczą się jako znaki!

// 4. Liczby jako stringi | Numbers as strings
checkPermutation("112233", "321321")  // true
// English: Character '1' appears twice in both
// Polski: Znak '1' pojawia się dwa razy w obu

// 5. Znaki specjalne | Special characters
checkPermutation("!@#!@#", "#!@#!@")  // true
// English: Special chars follow same rules
// Polski: Znaki specjalne podlegają tym samym regułom

// 6. Emoji!
checkPermutation("🎉🎊🎉", "🎉🎉🎊")  // true
// English: Each emoji counts as one character (usually)
// Polski: Każde emoji liczy się jako jeden znak (zazwyczaj)

// 7. Pojedynczy znak powtórzony | Single character repeated
checkPermutation("aaaaaaa", "aaaaaaa")  // true
// English: Seven 'a's in both
// Polski: Siedem 'a' w obu
```

---

## ❌ TO NIE SĄ PERMUTACJE | THESE ARE NOT PERMUTATIONS

```javascript
// 1. Różna liczba powtórzeń | Different number of repetitions
checkPermutation("aab", "abb")  // false
// English: First has 2 'a's, second has 2 'b's - different frequencies!
// Polski: Pierwszy ma 2 'a', drugi ma 2 'b' - różne częstotliwości!

// 2. Wielkie vs małe litery | Uppercase vs lowercase
checkPermutation("Abc", "abc")  // false
// English: 'A' and 'a' are different characters
// Polski: 'A' i 'a' to różne znaki

// 3. Różna liczba spacji | Different number of spaces
checkPermutation("a b", "ab")  // false
// English: First has a space, second doesn't
// Polski: Pierwszy ma spację, drugi nie ma

// 4. Prawie identyczne | Almost identical
checkPermutation("listen", "silent1")  // false
// English: Second has extra '1' at the end
// Polski: Drugi ma dodatkową '1' na końcu

// 5. Podstring | Substring
checkPermutation("abc", "abcd")  // false
// English: Different lengths - cannot be permutations
// Polski: Różne długości - nie mogą być permutacjami

// 6. Unicode tricks - wyglądają podobnie | Unicode tricks - look similar
checkPermutation("resume", "résumé")  // false
// English: 'e' and 'é' are different Unicode characters
// Polski: 'e' i 'é' to różne znaki Unicode

// 7. Puste vs spacja | Empty vs space
checkPermutation("", " ")  // false
// English: Empty string vs string with one space
// Polski: Pusty string vs string z jedną spacją

// 8. Takie same znaki ale różne ilości | Same chars but different counts
checkPermutation("aabbcc", "abc")  // false
// English: First has 6 chars, second has 3
// Polski: Pierwszy ma 6 znaków, drugi ma 3
```

---

## 🤔 PODCHWYTLIWE PRZYPADKI | TRICKY CASES

```javascript
// 1. Tabulatory i spacje wyglądają podobnie | Tabs and spaces look similar
checkPermutation("a\tb", "a b")  // false
// English: '\t' (tab) is different from ' ' (space)
// Polski: '\t' (tabulator) różni się od ' ' (spacja)

// 2. Nowe linie | New lines
checkPermutation("a\nb", "ab")  // false
// English: '\n' (newline) is a character
// Polski: '\n' (nowa linia) to znak

// 3. Zero vs litera O | Zero vs letter O
checkPermutation("0O0", "O00")  // false
// English: Has two '0' and one 'O' vs one 'O' and two '0' - wait, this IS true!
// Polski: Ma dwa '0' i jedno 'O' vs jedno 'O' i dwa '0' - czekaj, to JEST true!
checkPermutation("0O0", "000")  // false (THIS is false)
// English: Number zero vs letter O are different
// Polski: Cyfra zero vs litera O to różne znaki

// 4. Puste stringi | Empty strings
checkPermutation("", "")  // true
// English: Both empty - technically permutations of each other
// Polski: Oba puste - technicznie są permutacjami siebie

// 5. Znaki Unicode o zmiennej długości | Variable-length Unicode
checkPermutation("👨‍👩‍👧‍👦", "👦👧👩👨")  // false (probably)
// English: Family emoji is actually multiple codepoints joined!
// Polski: Emoji rodziny to faktycznie wiele punktów kodowych połączonych!

// 6. Wszystkie te same znaki | All same characters
checkPermutation("aaaa", "aaaa")  // true
// English: Boring but valid
// Polski: Nudne ale poprawne

// 7. Anagram słów | Word anagrams
checkPermutation("listen", "silent")  // true
// English: Classic anagram - both have same letters
// Polski: Klasyczny anagram - oba mają te same litery

checkPermutation("conversation", "conservation")  // false
// English: Look similar but 'conversation' has 't' instead of second 's'
// Polski: Wyglądają podobnie ale 'conversation' ma 't' zamiast drugiego 's'
```

---

## 🧪 Test Complete | Kompletny test

```javascript
function runTrickyTests() {
  const tests = [
    // [str1, str2, expected result, description]
    ["aab", "aba", true, "Same chars, different order | Te same znaki, inna kolejność"],
    ["aab", "abb", false, "Different frequencies | Różne częstotliwości"],
    ["   ", "   ", true, "Only spaces | Tylko spacje"],
    ["a b", "ab", false, "Space matters | Spacja ma znaczenie"],
    ["", "", true, "Both empty | Oba puste"],
    ["Aa", "aA", true, "Case sensitive but same | Wielkość liter ważna ale te same"],
    ["112", "121", true, "Numbers reordered | Liczby przestawione"],
    ["abc", "abcd", false, "Different lengths | Różne długości"],
  ];

  tests.forEach(([s1, s2, expected, desc]) => {
    const result = checkPermutation(s1, s2);
    const status = result === expected ? "✅" : "❌";
    console.log(`${status} "${s1}" & "${s2}": ${result} - ${desc}`);
  });
}
```

**English:** The key insight is that permutations need EXACT same character counts!
**Polski:** Kluczowa obserwacja to że permutacje potrzebują DOKŁADNIE tych samych liczności znaków!
