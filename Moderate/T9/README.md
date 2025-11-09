# 16.20 T9

## Opis Zadania / Problem Description

**T9**: On old cell phones, users typed on a numeric keypad and the phone would provide a list of words that matched these numbers. Each digit mapped to a set of 0-4 letters. Implement an algorithm to return a list of matching words, given a sequence of digits. You are provided a list of valid words (provided in whatever data structure you'd like). The mapping is shown below:

**T9**: Na starych telefonach komórkowych użytkownicy wpisywali na klawiaturze numerycznej, a telefon dostarczał listę słów pasujących do tych cyfr. Każda cyfra mapowała na zestaw 0-4 liter. Zaimplementuj algorytm zwracający listę pasujących słów dla danej sekwencji cyfr. Masz dostęp do listy poprawnych słów (w dowolnej strukturze danych). Mapowanie pokazano poniżej:

KEYPAD MAPPING
```
1: (none)
2: abc
3: def
4: ghi
5: jkl
6: mno
7: pqrs
8: tuv
9: wxyz
0: (space)
```

EXAMPLE
```
Input: "8733"
Output: ["tree", "used"]

Explanation:
8 → t,u,v
7 → p,q,r,s
3 → d,e,f
3 → d,e,f

Możliwe kombinacje: tree, tred, tref, tsed, ...
Z dictionary: tree, used
```

Hints: #470, #487, #654, #703, #726, #744

## Wyjaśnienie Problemu / Problem Explanation

To klasyczny problem T9 (Text on 9 keys) z dawnych telefonów. Musimy znaleźć wszystkie słowa z dictionary, które pasują do sekwencji cyfr.

This is the classic T9 (Text on 9 keys) problem from old phones. We need to find all words from dictionary that match the digit sequence.

**Przykłady / Examples**:
```
1. digits = "2"
   Możliwe litery: a, b, c
   Dictionary words: "a", "b", "c"

2. digits = "22"
   Możliwe kombinacje: aa, ab, ac, ba, bb, bc, ca, cb, cc
   Dictionary words (przykład): "ba"

3. digits = "8733"
   t(8) r(7) e(3) e(3) = "tree" ✓
   u(8) s(7) e(3) d(3) = "used" ✓

4. digits = "4663"
   g(4) o(6) o(6) d(3) = "good" ✓
   h(4) o(6) m(6) e(3) = "home" ✓
   i(4) n(6) n(6) e(3) = "inne"

5. digits = ""
   Output: [] (pusty input)
```

**Kluczowe Obserwacje / Key Observations**:
1. Każda cyfra mapuje na 3-4 litery (z wyjątkiem 0, 1)
2. Nie wszystkie kombinacje są poprawnymi słowami
3. Potrzebujemy dictionary do weryfikacji
4. Długość słowa = długość sekwencji cyfr
5. Możemy użyć Trie dla szybkiego wyszukiwania

## Rozwiązania / Solutions

### Podejście 1: Brute Force z Dictionary Lookup - O(4^n × m)

**Idea**: Wygeneruj wszystkie możliwe kombinacje liter, sprawdź każdą w dictionary.

**Idea**: Generate all possible letter combinations, check each in dictionary.

```javascript
function t9BruteForce(digits, dictionary) {
  if (!digits || digits.length === 0) return [];

  const mapping = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };

  const combinations = generateCombinations(digits, mapping);
  const dictSet = new Set(dictionary);

  return combinations.filter(word => dictSet.has(word));
}

function generateCombinations(digits, mapping) {
  if (digits.length === 0) return [''];

  const firstDigit = digits[0];
  const letters = mapping[firstDigit] || '';
  const rest = generateCombinations(digits.slice(1), mapping);

  const result = [];
  for (const letter of letters) {
    for (const suffix of rest) {
      result.push(letter + suffix);
    }
  }

  return result;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(4^n × m) - generuj 4^n kombinacji, sprawdź każdą w dict (m słów)
- Pamięciowa / Space: O(4^n) - przechowuj wszystkie kombinacje

### Podejście 2: Dictionary Filtering - O(m × n) ✓ LEPSZE

**Idea**: Zamiast generować kombinacje, filtruj dictionary - sprawdź które słowa pasują do cyfr.

**Idea**: Instead of generating combinations, filter dictionary - check which words match digits.

```javascript
function t9Filtering(digits, dictionary) {
  if (!digits || digits.length === 0) return [];

  const mapping = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };

  return dictionary.filter(word => matchesDigits(word, digits, mapping));
}

function matchesDigits(word, digits, mapping) {
  if (word.length !== digits.length) return false;

  for (let i = 0; i < word.length; i++) {
    const digit = digits[i];
    const letter = word[i].toLowerCase();
    const validLetters = mapping[digit] || '';

    if (!validLetters.includes(letter)) {
      return false;
    }
  }

  return true;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(m × n) - sprawdź m słów, każde długości ≤ n
- Pamięciowa / Space: O(1) - tylko wynik

### Podejście 3: Trie-based Lookup - O(m × k + n) ✓ OPTYMALNE

**Idea**: Zbuduj Trie z dictionary, przeszukuj tylko pasujące ścieżki.

**Idea**: Build Trie from dictionary, search only matching paths.

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
    this.word = null;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isWord = true;
    node.word = word;
  }

  searchT9(digits, mapping) {
    const results = [];
    this.dfs(this.root, digits, 0, mapping, results);
    return results;
  }

  dfs(node, digits, index, mapping, results) {
    if (index === digits.length) {
      if (node.isWord) {
        results.push(node.word);
      }
      return;
    }

    const digit = digits[index];
    const letters = mapping[digit] || '';

    for (const letter of letters) {
      if (node.children[letter]) {
        this.dfs(node.children[letter], digits, index + 1, mapping, results);
      }
    }
  }
}

function t9Trie(digits, dictionary) {
  if (!digits || digits.length === 0) return [];

  const mapping = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };

  const trie = new Trie();
  for (const word of dictionary) {
    trie.insert(word);
  }

  return trie.searchT9(digits, mapping);
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(m × k) budowa Trie + O(4^n) w najgorszym przypadku (ale tylko valid paths)
- Pamięciowa / Space: O(m × k) - Trie

### Podejście 4: Hash Map Pre-processing - O(m × k) ✓ BARDZO SZYBKIE

**Idea**: Przetwórz dictionary z góry - zamień każde słowo na sekwencję cyfr, użyj jako klucza.

**Idea**: Pre-process dictionary - convert each word to digit sequence, use as key.

```javascript
function t9HashMap(digits, dictionary) {
  if (!digits || digits.length === 0) return [];

  const letterToDigit = {
    'a': '2', 'b': '2', 'c': '2',
    'd': '3', 'e': '3', 'f': '3',
    'g': '4', 'h': '4', 'i': '4',
    'j': '5', 'k': '5', 'l': '5',
    'm': '6', 'n': '6', 'o': '6',
    'p': '7', 'q': '7', 'r': '7', 's': '7',
    't': '8', 'u': '8', 'v': '8',
    'w': '9', 'x': '9', 'y': '9', 'z': '9'
  };

  // Pre-process: zbuduj mapę cyfry → słowa
  const digitMap = new Map();

  for (const word of dictionary) {
    const digitSeq = wordToDigits(word, letterToDigit);
    if (!digitMap.has(digitSeq)) {
      digitMap.set(digitSeq, []);
    }
    digitMap.get(digitSeq).push(word);
  }

  return digitMap.get(digits) || [];
}

function wordToDigits(word, letterToDigit) {
  let result = '';
  for (const char of word.toLowerCase()) {
    result += letterToDigit[char] || '';
  }
  return result;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(m × k) pre-processing + O(1) lookup
- Pamięciowa / Space: O(m × k) - hash map

## Szczególne Przypadki / Edge Cases

### 1. Pusty Input
```javascript
digits = ""
dictionary = ["hello", "world"]
Output: []
```

### 2. Puste Dictionary
```javascript
digits = "4663"
dictionary = []
Output: []
```

### 3. Brak Pasujących Słów
```javascript
digits = "1111"
dictionary = ["hello", "world"]
Output: [] (cyfra 1 nie ma liter)
```

### 4. Pojedyncza Cyfra
```javascript
digits = "2"
dictionary = ["a", "b", "c", "d"]
Output: ["a", "b", "c"]
```

### 5. Wszystkie Słowa Pasują
```javascript
digits = "4"
dictionary = ["g", "h", "i"]
Output: ["g", "h", "i"]
```

### 6. Case Sensitivity
```javascript
digits = "4663"
dictionary = ["Good", "HOME", "good"]
Output: ["Good", "good"] (case-insensitive matching)
```

### 7. Długie Sekwencje
```javascript
digits = "22233344455566677778888999"
// Bardzo mało słów będzie tak długich
```

## Mapowanie Liter / Letter Mapping

### Standardowe Mapowanie T9 / Standard T9 Mapping

```
Cyfra 0: (space)
Cyfra 1: (brak liter - zwykle znaki specjalne)
Cyfra 2: ABC
Cyfra 3: DEF
Cyfra 4: GHI
Cyfra 5: JKL
Cyfra 6: MNO
Cyfra 7: PQRS (4 litery!)
Cyfra 8: TUV
Cyfra 9: WXYZ (4 litery!)
```

### Reverse Mapping (Letter → Digit)

```javascript
const letterToDigit = {
  'a': '2', 'b': '2', 'c': '2',
  'd': '3', 'e': '3', 'f': '3',
  'g': '4', 'h': '4', 'i': '4',
  'j': '5', 'k': '5', 'l': '5',
  'm': '6', 'n': '6', 'o': '6',
  'p': '7', 'q': '7', 'r': '7', 's': '7',
  't': '8', 'u': '8', 'v': '8',
  'w': '9', 'x': '9', 'y': '9', 'z': '9'
};
```

## Porównanie Podejść / Approach Comparison

| Podejście | Preprocessing | Query | Space | Best For |
|-----------|---------------|-------|-------|----------|
| Brute Force | - | O(4^n × m) | O(4^n) | Małe n |
| Filtering | - | O(m × n) | O(1) | Małe m |
| Trie | O(m × k) | O(4^n)* | O(m × k) | Wiele zapytań |
| HashMap | O(m × k) | O(1) | O(m × k) | Najszybszy query |

*Ale tylko valid paths, więc w praktyce znacznie szybsze

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **HashMap (Podejście 4)**: Najszybsze dla wielu zapytań ✓ POLECANE
- **Filtering (Podejście 2)**: Gdy dictionary jest małe
- **Trie (Podejście 3)**: Gdy potrzebujemy dodatkowych funkcji (autocomplete)
- **Brute Force (Podejście 1)**: Tylko dla bardzo małych n

## Optymalizacje / Optimizations

### 1. Length Filtering
```javascript
// Najpierw filtruj po długości
const candidateWords = dictionary.filter(w => w.length === digits.length);
```

### 2. Early Termination
```javascript
// Przerwij sprawdzanie przy pierwszej niezgodności
for (let i = 0; i < word.length; i++) {
  if (!validLetters.includes(word[i])) {
    return false; // Early exit
  }
}
```

### 3. Cache Results
```javascript
// Cache wyników dla powtarzających się zapytań
const cache = new Map();
if (cache.has(digits)) return cache.get(digits);
```

### 4. Lazy Evaluation
```javascript
// Generator dla leniwej ewaluacji
function* t9Generator(digits, dictionary) {
  for (const word of dictionary) {
    if (matchesDigits(word, digits)) {
      yield word;
    }
  }
}
```

## Zastosowania / Applications

1. **Predictive Text**: T9 na telefonach (dawniej)
2. **Autocomplete**: Sugestie podczas pisania
3. **Spell Checking**: Korekta błędów w pisowni
4. **Password Cracking**: Słownikowe ataki
5. **Word Games**: Scrabble, Wordle helpers
6. **Natural Language Processing**: Text prediction

## Rozszerzenia / Extensions

### 1. Multiple Languages
```javascript
// Różne mapowania dla różnych języków
const polishMapping = {
  '2': 'abcą', '3': 'defę', ...
};
```

### 2. Ranking by Frequency
```javascript
// Sortuj wyniki według częstości użycia
return results.sort((a, b) => frequency[b] - frequency[a]);
```

### 3. Fuzzy Matching
```javascript
// Dopuszczaj 1-2 różnice (typos)
// Allow 1-2 differences (typos)
```

### 4. Multi-tap Support
```javascript
// "22" może oznaczać "b" (kliknij 2 razy)
// "22" can mean "b" (tap twice)
```

### 5. Word Completion
```javascript
// Zwróć słowa zaczynające się od digits
// Return words starting with digits prefix
```

## Analiza Złożoności / Complexity Analysis

### Liczba Kombinacji / Number of Combinations

Dla sekwencji n cyfr:
- Minimum: 0 (jeśli cyfra 0 lub 1)
- Średnio: 3^n (większość cyfr ma 3 litery)
- Maksimum: 4^n (cyfry 7 i 9 mają 4 litery)

**Przykłady / Examples**:
```
n=1: max 4 kombinacje
n=2: max 16 kombinacji
n=3: max 64 kombinacje
n=4: max 256 kombinacji ("8733" → tree, used, ...)
n=5: max 1024 kombinacje
n=10: max 1,048,576 kombinacji (brute force niemożliwy!)
```

### Dictionary Size Impact

| Dictionary Size | Filtering Time | HashMap Space |
|-----------------|----------------|---------------|
| 1,000 words | Fast | ~50 KB |
| 10,000 words | Medium | ~500 KB |
| 100,000 words | Slow | ~5 MB |
| 1,000,000 words | Very Slow | ~50 MB |

## Wnioski / Conclusions

T9 to klasyczny problem pokazujący:
1. **Pre-processing tradeoff**: Czas vs. pamięć
2. **Data structure choice**: Trie, HashMap, Array
3. **Query optimization**: Filtering, caching
4. **Real-world application**: Predictive text input

T9 is a classic problem showing:
1. **Pre-processing tradeoff**: Time vs. space
2. **Data structure choice**: Trie, HashMap, Array
3. **Query optimization**: Filtering, caching
4. **Real-world application**: Predictive text input

**Kluczowa decyzja / Key Decision**:
- Jedno zapytanie → Filtering (O(m × n))
- Wiele zapytań → HashMap preprocessing (O(1) per query)
- Dodatkowe funkcje → Trie
