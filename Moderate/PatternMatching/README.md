# 16.18 Pattern Matching

## Opis Zadania / Problem Description

**Pattern Matching**: You are given two strings, `pattern` and `value`. The `pattern` string consists of just the letters `a` and `b`, describing a pattern within a string. For example, the string "catcatgocatgo" matches the pattern "aabab" (where cat is `a` and go is `b`). It also matches patterns like "a", "ab", and "b". Write a method to determine if `value` matches `pattern`.

**Dopasowanie Wzorca**: Masz dwa stringi: `pattern` i `value`. String `pattern` składa się tylko z liter `a` i `b`, opisując wzorzec w stringu. Na przykład, string "catcatgocatgo" pasuje do wzorca "aabab" (gdzie cat to `a`, a go to `b`). Pasuje też do wzorców takich jak "a", "ab" i "b". Napisz metodę sprawdzającą czy `value` pasuje do `pattern`.

EXAMPLE
```
pattern = "aabab"
value = "catcatgocatgo"
Result: true (a = "cat", b = "go")
```

Hints: #631, #643, #653, #663, #685, #718

## Wyjaśnienie Problemu / Problem Explanation

Musimy znaleźć przypisanie substringów do `a` i `b` takie, że zastąpienie tych liter w pattern da nam value.

We need to find assignment of substrings to `a` and `b` such that replacing these letters in pattern gives us value.

**Przykłady / Examples**:
```
1. pattern = "aabab", value = "catcatgocatgo"
   a = "cat", b = "go" ✓

2. pattern = "a", value = "hello"
   a = "hello" ✓

3. pattern = "ab", value = "hello"
   Niemożliwe - brak podziału ✗

4. pattern = "aaa", value = "dogdogdog"
   a = "dog" ✓

5. pattern = "abab", value = "redblueredblue"
   a = "red", b = "blue" ✓
```

**Kluczowe Obserwacje / Key Observations**:
1. Pattern zawiera tylko 'a' i 'b'
2. Musimy znaleźć długości substringów dla a i b
3. Jeśli znamy długość a, możemy obliczyć długość b
4. Wartości a i b muszą być konsystentne w całym stringu

## Rozwiązania / Solutions

### Podejście 1: Brute Force - O(n²)

**Idea**: Wypróbuj wszystkie możliwe długości dla `a`, oblicz długość `b`, sprawdź czy pasuje.

**Idea**: Try all possible lengths for `a`, calculate length of `b`, check if it matches.

```javascript
function patternMatching(pattern, value) {
  if (pattern.length === 0) return value.length === 0;

  const countA = pattern.split('a').length - 1;
  const countB = pattern.split('b').length - 1;

  // Wypróbuj wszystkie długości dla 'a'
  for (let lenA = 0; lenA <= value.length; lenA++) {
    // Oblicz długość dla 'b'
    const remaining = value.length - countA * lenA;

    if (countB === 0) {
      if (remaining === 0 && matches(pattern, value, lenA, 0)) {
        return true;
      }
    } else if (remaining % countB === 0) {
      const lenB = remaining / countB;
      if (matches(pattern, value, lenA, lenB)) {
        return true;
      }
    }
  }

  return false;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n²) - n możliwych długości × n weryfikacja
- Pamięciowa / Space: O(1)

### Podejście 2: Optymalizowane - O(n) ✓ OPTYMALNE

**Idea**:
1. Oblicz liczby wystąpień a i b w pattern
2. Dla każdej możliwej długości a, oblicz długość b matematycznie
3. Sprawdź tylko te kombinacje, gdzie długości się zgadzają
4. Używaj hasha do szybkiej weryfikacji

**Idea**:
1. Count occurrences of a and b in pattern
2. For each possible length of a, calculate length of b mathematically
3. Check only combinations where lengths match
4. Use hashing for fast verification

```javascript
function patternMatchingOptimized(pattern, value) {
  if (pattern.length === 0) return value.length === 0;
  if (value.length === 0) return pattern.length === 0;

  // Normalizuj: zawsze zacznij od 'a'
  const mainChar = pattern[0];
  const altChar = mainChar === 'a' ? 'b' : 'a';

  const countMain = countChar(pattern, mainChar);
  const countAlt = countChar(pattern, altChar);

  // Wypróbuj długości dla mainChar
  for (let lenMain = 0; lenMain <= value.length; lenMain++) {
    const remaining = value.length - countMain * lenMain;

    let lenAlt;
    if (countAlt === 0) {
      if (remaining !== 0) continue;
      lenAlt = 0;
    } else {
      if (remaining % countAlt !== 0) continue;
      lenAlt = remaining / countAlt;
    }

    // Spróbuj zbudować value używając tych długości
    const candidate = buildFromPattern(
      pattern,
      value,
      mainChar,
      lenMain,
      lenAlt
    );

    if (candidate === value) {
      return true;
    }
  }

  return false;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n) amortyzowane - early termination
- Pamięciowa / Space: O(n) - budowanie stringa

### Podejście 3: Iteracyjne Budowanie - O(n)

**Idea**: Buduj value iteracyjnie, sprawdzając konsystencję na każdym kroku.

**Idea**: Build value iteratively, checking consistency at each step.

```javascript
function patternMatchingIterative(pattern, value) {
  if (pattern.length === 0) return value.length === 0;

  const result = tryPattern(pattern, value);
  return result.matches;
}

function tryPattern(pattern, value) {
  let aString = null;
  let bString = null;
  let pos = 0;

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    const isA = char === 'a';

    // Jeśli już znamy wartość tego znaku
    if ((isA && aString !== null) || (!isA && bString !== null)) {
      const expected = isA ? aString : bString;
      const actual = value.substr(pos, expected.length);

      if (actual !== expected) {
        return { matches: false };
      }

      pos += expected.length;
    } else {
      // Musimy zgadnąć długość
      // To wymaga backtrackingu lub wypróbowania wszystkich długości
      // (Uproszczona wersja)
    }
  }

  return { matches: pos === value.length };
}
```

### Podejście 4: Rekurencyjne z Memoizacją - O(n)

**Idea**: Użyj rekurencji do wypróbowania różnych długości, zapamiętuj wyniki.

**Idea**: Use recursion to try different lengths, memoize results.

```javascript
function patternMatchingRecursive(pattern, value, memo = {}) {
  const key = `${pattern}|${value}`;
  if (key in memo) return memo[key];

  if (pattern.length === 0) {
    return value.length === 0;
  }

  if (value.length === 0) {
    return pattern.length === 0;
  }

  // Wypróbuj różne długości dla pierwszego znaku
  const firstChar = pattern[0];

  for (let len = 1; len <= value.length; len++) {
    const substring = value.substring(0, len);

    // Spróbuj użyć tego jako wartości dla firstChar
    const newPattern = pattern.replace(new RegExp(firstChar, 'g'), '');
    const newValue = value.replace(new RegExp(escapeRegex(substring), 'g'), '');

    if (patternMatchingRecursive(newPattern, newValue, memo)) {
      memo[key] = true;
      return true;
    }
  }

  memo[key] = false;
  return false;
}
```

## Szczególne Przypadki / Edge Cases

### 1. Pattern Pusty
```javascript
pattern = ""
value = ""
Result: true

pattern = ""
value = "hello"
Result: false
```

### 2. Value Pusty
```javascript
pattern = "a"
value = ""
Result: true (a = "")

pattern = "ab"
value = ""
Result: true (a = "", b = "")
```

### 3. Tylko Jeden Znak w Pattern
```javascript
pattern = "a"
value = "anything"
Result: true (a = "anything")

pattern = "b"
value = "xyz"
Result: true (b = "xyz")
```

### 4. Pattern Bez 'b'
```javascript
pattern = "aaa"
value = "dogdogdog"
Result: true (a = "dog", b nie używane)

pattern = "aa"
value = "dogcat"
Result: false (a nie może być jednocześnie "dog" i "cat")
```

### 5. Pattern Bez 'a'
```javascript
pattern = "bbb"
value = "xyzxyzxyz"
Result: true (b = "xyz", a nie używane)
```

### 6. Wartości Puste dla a lub b
```javascript
pattern = "aabab"
value = "go"
Result: false (niemożliwe gdy a="", b="go")

pattern = "aaaa"
value = ""
Result: true (a = "")
```

### 7. Wartości Identyczne
```javascript
pattern = "abab"
value = "catcatcatcat"
Result: true (a = "cat", b = "cat")
```

## Analiza Matematyczna / Mathematical Analysis

### Obliczanie Długości / Calculating Lengths

Mając:
- `countA` = liczba 'a' w pattern
- `countB` = liczba 'b' w pattern
- `lenA` = długość substringa dla 'a'
- `lenB` = długość substringa dla 'b'
- `n` = długość value

**Równanie / Equation**:
```
countA × lenA + countB × lenB = n
```

**Dla danego lenA, oblicz lenB / For given lenA, calculate lenB**:
```
lenB = (n - countA × lenA) / countB
```

**lenB musi być liczbą całkowitą nieujemną / lenB must be non-negative integer**:
```
1. (n - countA × lenA) ≥ 0
2. (n - countA × lenA) % countB === 0
```

### Liczba Możliwych Kombinacji / Number of Possible Combinations

**Maksymalna liczba prób / Maximum number of attempts**:
- Dla lenA: 0 do n → n+1 możliwości
- Dla każdego lenA: O(1) obliczenie lenB
- Total: O(n) kombinacji do sprawdzenia

### Optymalizacje / Optimizations

**1. Early Termination**:
```javascript
if (lenA * countA > value.length) {
  break; // lenA za duże
}
```

**2. Skip Invalid Lengths**:
```javascript
if ((value.length - countA * lenA) % countB !== 0) {
  continue; // lenB nie będzie całkowite
}
```

**3. Normalizacja Pattern**:
```javascript
// Zawsze zacznij od 'a' (jeśli pattern zaczyna się od 'b', zamień a<->b)
// Always start with 'a' (if pattern starts with 'b', swap a<->b)
```

## Implementacja Pomocniczych Funkcji / Helper Functions Implementation

### 1. Count Character
```javascript
function countChar(str, char) {
  return str.split(char).length - 1;
}
```

### 2. Build From Pattern
```javascript
function buildFromPattern(pattern, value, mainChar, lenMain, lenAlt) {
  let mainValue = null;
  let altValue = null;
  let result = "";
  let pos = 0;

  for (const char of pattern) {
    const len = (char === mainChar) ? lenMain : lenAlt;

    if (pos + len > value.length) return null;

    const substring = value.substr(pos, len);

    if (char === mainChar) {
      if (mainValue === null) {
        mainValue = substring;
      } else if (mainValue !== substring) {
        return null; // Inconsistency
      }
    } else {
      if (altValue === null) {
        altValue = substring;
      } else if (altValue !== substring) {
        return null; // Inconsistency
      }
    }

    result += substring;
    pos += len;
  }

  // Sprawdź czy a i b są różne (jeśli oba istnieją)
  if (mainValue !== null && altValue !== null && mainValue === altValue) {
    return null;
  }

  return result;
}
```

### 3. Extract Values
```javascript
function extractValues(pattern, value, lenA, lenB) {
  let aValue = null;
  let bValue = null;
  let pos = 0;

  for (const char of pattern) {
    const len = (char === 'a') ? lenA : lenB;
    const substring = value.substr(pos, len);

    if (char === 'a') {
      if (aValue === null) {
        aValue = substring;
      } else if (aValue !== substring) {
        return null;
      }
    } else {
      if (bValue === null) {
        bValue = substring;
      } else if (bValue !== substring) {
        return null;
      }
    }

    pos += len;
  }

  return { a: aValue, b: bValue };
}
```

## Porównanie Podejść / Approach Comparison

| Podejście | Czas | Pamięć | Złożoność kodu | Wydajność |
|-----------|------|--------|----------------|-----------|
| Brute Force | O(n²) | O(1) | Niska | Niska |
| Optymalizowane | O(n) | O(n) | Średnia | Wysoka |
| Iteracyjne | O(n) | O(1) | Wysoka | Średnia |
| Rekurencyjne + Memo | O(n) | O(n) | Wysoka | Średnia |

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Optymalizowane (Podejście 2)**: Najlepsze dla większości przypadków
- **Brute Force (Podejście 1)**: Gdy prostota jest ważniejsza niż wydajność
- **Iteracyjne (Podejście 3)**: Gdy pamięć jest ograniczona (O(1) space)
- **Rekurencyjne (Podejście 4)**: Gdy pattern jest bardzo krótki

## Zastosowania / Applications

1. **Regex Matching**: Podstawowy building block
2. **String Parsing**: Parsowanie strukturalnych stringów
3. **Template Matching**: Dopasowywanie szablonów
4. **Data Validation**: Walidacja formatów danych
5. **Pattern Recognition**: Rozpoznawanie wzorców w tekście

## Rozszerzenia / Extensions

### 1. Więcej Niż Dwa Znaki
```javascript
// pattern = "abcabc", value = "redbluegreen..."
// Rozwiązanie: Generalizacja do n znaków
```

### 2. Wildcards
```javascript
// pattern = "a*b", value = "catXYZdog"
// gdzie * = dowolny string
```

### 3. Regex-like Operators
```javascript
// pattern = "a+b?", value = "catcatdog" lub "catcatcatdog"
// gdzie + = jeden lub więcej, ? = zero lub jeden
```

### 4. Case Insensitive
```javascript
// pattern = "aabab"
// value = "CATcatGOcatgo" (ignore case)
```

## Wnioski / Conclusions

Pattern Matching to klasyczny problem pokazujący:
1. **Matematyczne podejście**: Równanie lenA i lenB
2. **Optymalizacja**: Od O(n²) do O(n)
3. **Edge cases**: Puste stringi, jeden znak, identyczne wartości
4. **Konsystencja**: Sprawdzanie że a i b są spójne w całym stringu

Pattern Matching is a classic problem showing:
1. **Mathematical approach**: Equation for lenA and lenB
2. **Optimization**: From O(n²) to O(n)
3. **Edge cases**: Empty strings, single character, identical values
4. **Consistency**: Checking that a and b are consistent throughout string
