Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego)
:

String Rotation: Assume you have a method isSubst ring which checks if one word is a substring
of another. Given two strings, 51 and 52, write code to check if 52 is a rotation of 51 using only one
call to isSubstring (e.g., "waterbottle" is a rotation of"erbottlewat").

=============


# String Rotation Problem
# Problem Rotacji Ciągu Znaków

**Question:** Check if s2 is a rotation of s1 using only one call to `isSubstring`
**Pytanie:** Sprawdź czy s2 jest rotacją s1 używając tylko jednego wywołania `isSubstring`

## Solution Explanation / Wyjaśnienie Rozwiązania

**Key Insight:** If s2 is a rotation of s1, then s2 will always be a substring of s1+s1
**Kluczowa obserwacja:** Jeśli s2 jest rotacją s1, to s2 zawsze będzie podciągiem s1+s1

**Example / Przykład:**
- s1 = "waterbottle"
- s2 = "erbottlewat"
- s1 + s1 = "waterbottlewaterbottle"
- s2 appears in s1+s1: wat**erbottlewat**erbottle ✓

**Why this works:** When you concatenate s1 with itself, you create all possible rotations within that string
**Dlaczego to działa:** Kiedy łączysz s1 ze sobą, tworzysz wszystkie możliwe rotacje wewnątrz tego ciągu

## JavaScript Implementation / Implementacja w JavaScript

```javascript
function isRotation(s1, s2) {
    // Check if lengths are equal and not empty
    // Sprawdź czy długości są równe i niepuste
    if (s1.length !== s2.length || s1.length === 0) {
        return false;
    }

    // Concatenate s1 with itself
    // Połącz s1 ze sobą
    const s1s1 = s1 + s1;

    // Check if s2 is substring of s1+s1 (only one call to isSubstring)
    // Sprawdź czy s2 jest podciągiem s1+s1 (tylko jedno wywołanie isSubstring)
    return isSubstring(s1s1, s2);
}

// Helper function (this would be provided in the problem)
// Funkcja pomocnicza (to byłoby dostarczone w problemie)
function isSubstring(str, substr) {
    return str.includes(substr);
}

// Test cases / Przypadki testowe
console.log(isRotation("waterbottle", "erbottlewat")); // true
console.log(isRotation("hello", "lohel"));              // true
console.log(isRotation("hello", "world"));              // false
console.log(isRotation("abc", "bca"));                  // true
console.log(isRotation("abc", "cab"));                  // true
console.log(isRotation("abc", "acb"));                  // false (not a rotation / nie rotacja)
```

## Complexity Analysis / Analiza Złożoności

**Time Complexity:** O(n) where n is the length of the string
**Złożoność czasowa:** O(n) gdzie n to długość ciągu

**Space Complexity:** O(n) for creating s1+s1
**Złożoność pamięciowa:** O(n) dla utworzenia s1+s1

## Step-by-Step Example / Przykład Krok po Kroku

```
s1 = "waterbottle"
s2 = "erbottlewat"

Step 1 / Krok 1: Check lengths / Sprawdź długości
- s1.length = 11
- s2.length = 11
- Equal ✓ / Równe ✓

Step 2 / Krok 2: Create s1+s1 / Utwórz s1+s1
- s1 + s1 = "waterbottlewaterbottle"

Step 3 / Krok 3: Check if s2 is in s1+s1 / Sprawdź czy s2 jest w s1+s1
- "waterbottlewaterbottle".includes("erbottlewat")
- Position / Pozycja: wat[erbottlewat]erbottle
- Found ✓ / Znalezione ✓
```

**Interview Tips / Wskazówki do Rozmowy Kwalifikacyjnej:**
1. First clarify the problem / Najpierw wyjaśnij problem
2. Discuss the key insight about s1+s1 / Omów kluczową obserwację o s1+s1
3. Mention edge cases (empty strings, different lengths) / Wymień przypadki brzegowe (puste ciągi, różne długości)
4. Discuss complexity / Omów złożoność
