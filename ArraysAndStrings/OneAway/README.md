Interview question for implementation in javascript (Kod po polsku wyjaśnienia w obu językach - zdanie angielski obok polskiego)
: 


One Away: There are three types of edits that can be performed on strings: insert a character,
remove a character, or replace a character. Given two strings, write a function to check if they are
one edit (or zero edits) away.
EXAMPLE
pale, pIe -> true
pales. pale -> true
pale. bale -> true
pale. bake -> false



================


# One Away - Interview Question

**Problem** / **Problem**  
Check if two strings are one (or zero) edits away. / Sprawdź czy dwa stringi są oddalone o jedną (lub zero) edycję.

**Three edit types** / **Trzy typy edycji**:
- Insert a character / Wstaw znak
- Remove a character / Usuń znak  
- Replace a character / Zamień znak

## Solution / Rozwiązanie

```javascript
function oneEditAway(str1, str2) {
    // If length difference is more than 1, impossible to be one edit away
    // Jeśli różnica długości jest większa niż 1, niemożliwe aby były oddalone o jedną edycję
    const lengthDiff = Math.abs(str1.length - str2.length);
    if (lengthDiff > 1) {
        return false;
    }
    
    // Get the shorter and longer strings
    // Pobierz krótszy i dłuższy string
    const shorter = str1.length < str2.length ? str1 : str2;
    const longer = str1.length >= str2.length ? str1 : str2;
    
    let index1 = 0; // pointer for shorter / wskaźnik dla krótszego
    let index2 = 0; // pointer for longer / wskaźnik dla dłuższego
    let foundDifference = false; // flag for tracking if we found a difference / flaga śledząca czy znaleźliśmy różnicę
    
    while (index1 < shorter.length && index2 < longer.length) {
        if (shorter[index1] !== longer[index2]) {
            // If we already found a difference, return false
            // Jeśli już znaleźliśmy różnicę, zwróć false
            if (foundDifference) {
                return false;
            }
            foundDifference = true;
            
            // If same length, move both pointers (replace case)
            // Jeśli ta sama długość, przesuń oba wskaźniki (przypadek zamiany)
            if (shorter.length === longer.length) {
                index1++;
            }
            // If different length, move only longer pointer (insert/remove case)
            // Jeśli różna długość, przesuń tylko dłuższy wskaźnik (przypadek wstawienia/usunięcia)
        } else {
            // Characters match, move shorter pointer
            // Znaki pasują, przesuń krótszy wskaźnik
            index1++;
        }
        // Always move longer pointer
        // Zawsze przesuń dłuższy wskaźnik
        index2++;
    }
    
    return true;
}

// Test cases / Przypadki testowe
console.log(oneEditAway("pale", "ple"));   // true - remove 'a' / usuń 'a'
console.log(oneEditAway("pales", "pale")); // true - remove 's' / usuń 's'
console.log(oneEditAway("pale", "bale"));  // true - replace 'p' with 'b' / zamień 'p' na 'b'
console.log(oneEditAway("pale", "bake"));  // false - 2 edits needed / potrzebne 2 edycje
console.log(oneEditAway("pale", "pale"));  // true - 0 edits / 0 edycji
```

## Algorithm Explanation / Wyjaśnienie algorytmu

**Time Complexity: O(n)** where n is the length of shorter string / gdzie n to długość krótszego stringa  
**Space Complexity: O(1)** constant space / stała przestrzeń

### Steps / Kroki:

1. **Check length difference** / **Sprawdź różnicę długości**  
   If more than 1, return false immediately / Jeśli więcej niż 1, natychmiast zwróć false

2. **Identify shorter and longer strings** / **Zidentyfikuj krótszy i dłuższy string**  
   This simplifies logic for insert/remove cases / To upraszcza logikę dla przypadków wstawienia/usunięcia

3. **Use two pointers** / **Użyj dwóch wskaźników**  
   Traverse both strings simultaneously / Przejdź przez oba stringi jednocześnie

4. **When difference found** / **Gdy różnica znaleziona**:
   - If already found one difference, return false / Jeśli już znaleziono jedną różnicę, zwróć false
   - If same length: replace operation, move both pointers / Jeśli ta sama długość: operacja zamiany, przesuń oba wskaźniki
   - If different length: insert/remove operation, move only longer pointer / Jeśli różna długość: operacja wstawienia/usunięcia, przesuń tylko dłuższy wskaźnik

5. **If loop completes, return true** / **Jeśli pętla się zakończy, zwróć true**  
   At most one difference was found / Co najwyżej jedna różnica została znaleziona
