# Wyjaśnienie zadania / Task Explanation

**Po polsku:**
Zadanie polega na napisanie funkcji, która zamienia wszystkie spacje w ciągu znaków na '%20'. To jest sposób kodowania URL (stąd nazwa "URLify"), gdzie spacje są reprezentowane jako '%20'.

**In English:**
The task is to write a function that replaces all spaces in a string with '%20'. This is URL encoding (hence "URLify"), where spaces are represented as '%20'.

---

## Szczegółowe wyjaśnienie / Detailed Explanation

**Po polsku:**
- **Wejście (Input):** Otrzymujesz ciąg znaków, np. "Mr John Smith", oraz liczbę 13 (prawdziwa długość użytecznego tekstu)
- **Wyjście (Output):** Zwracasz ciąg z spacjami zamienionymi na '%20', np. "Mr%20John%20Smith"
- **Dlaczego liczba 13?** Bo w oryginalnym ciągu "Mr John Smith" jest dokładnie 13 znaków (łącznie ze spacjami)
- **Uwaga o Javie:** W Javie używalibyśmy tablicy znaków, żeby zrobić to "in place" (bez tworzenia nowego ciągu). W JavaScript jest to łatwiejsze.

**In English:**
- **Input:** You receive a string, e.g., "Mr John Smith", and the number 13 (the true length of useful text)
- **Output:** You return a string with spaces replaced by '%20', e.g., "Mr%20John%20Smith"
- **Why 13?** Because the original string "Mr John Smith" has exactly 13 characters (including spaces)
- **Java note:** In Java, we'd use a character array to do this "in place" (without creating a new string). In JavaScript, this is easier.

---

## Implementacja w JavaScript / JavaScript Implementation

```javascript
// Rozwiązanie 1: Proste, używające wbudowanych metod
// Solution 1: Simple, using built-in methods
function urlify(str, trueLength) {
    // Obetnij ciąg do prawdziwej długości i zamień spacje
    // Trim string to true length and replace spaces
    return str.substring(0, trueLength).replaceAll(' ', '%20');
}

// Rozwiązanie 2: Bardziej "ręczne" (bliższe intencji zadania)
// Solution 2: More "manual" (closer to the task's intent)
function urlifyManual(str, trueLength) {
    // Weź tylko część ciągu o prawdziwej długości
    // Take only the part of string with true length
    let result = '';

    for (let i = 0; i < trueLength; i++) {
        if (str[i] === ' ') {
            // Jeśli spacja, dodaj '%20'
            // If space, add '%20'
            result += '%20';
        } else {
            // W przeciwnym razie, dodaj znak
            // Otherwise, add the character
            result += str[i];
        }
    }

    return result;
}

// Rozwiązanie 3: Używając split i join (eleganckie)
// Solution 3: Using split and join (elegant)
function urlifyClean(str, trueLength) {
    return str.substring(0, trueLength).split(' ').join('%20');
}

// Testy / Tests
console.log(urlify("Mr John Smith    ", 13));        // "Mr%20John%20Smith"
console.log(urlifyManual("Mr John Smith    ", 13));  // "Mr%20John%20Smith"
console.log(urlifyClean("Mr John Smith    ", 13));   // "Mr%20John%20Smith"
```

---

## Wyjaśnienie przykładu / Example Explanation

**Po polsku:**
- **Input:** `"Mr John Smith    "` (z dodatkowymi spacjami na końcu) oraz `13`
- Prawdziwa długość to 13, więc bierzemy tylko: `"Mr John Smith"` (13 znaków)
- Są 2 spacje w tym ciągu (po "Mr" i po "John")
- Zamieniamy je na `%20`: `"Mr%20John%20Smith"`

**In English:**
- **Input:** `"Mr John Smith    "` (with extra spaces at the end) and `13`
- True length is 13, so we take only: `"Mr John Smith"` (13 characters)
- There are 2 spaces in this string (after "Mr" and after "John")
- We replace them with `%20`: `"Mr%20John%20Smith"`

---

## Złożoność / Complexity

**Po polsku:**
- **Czas:** O(n), gdzie n to prawdziwa długość ciągu
- **Pamięć:** O(n) dla nowego ciągu (w JavaScript nie możemy modyfikować stringów "in place")

**In English:**
- **Time:** O(n), where n is the true length of the string
- **Space:** O(n) for the new string (in JavaScript we cannot modify strings "in place")



--------------



# Tak, ale z ważnym zastrzeżeniem / Yes, but with an important caveat

**Po polsku:**
Tak, złożoność O(n) czasu i O(n) pamięci dotyczy Rozwiązania 2 (manual), które jest najbliższe intencji zadania. ALE...

**In English:**
Yes, the O(n) time and O(n) space complexity applies to Solution 2 (manual), which is closest to the task's intent. BUT...

---

## Ważne wyjaśnienie / Important Clarification

**Po polsku:**
W **JavaScript** stringi są **immutable** (niezmienne), więc:
- Każde `result += ...` tworzy NOWY string
- To teoretycznie daje O(n²) w najgorszym przypadku!

Ale w praktyce:
- Nowoczesne silniki JS optymalizują to do ~O(n)
- Dla małych stringów różnica jest niewidoczna

**In English:**
In **JavaScript** strings are **immutable**, so:
- Each `result += ...` creates a NEW string
- This theoretically gives O(n²) in worst case!

But in practice:
- Modern JS engines optimize this to ~O(n)
- For small strings the difference is negligible

---

## Prawdziwe rozwiązanie O(n) / True O(n) Solution

**Po polsku:**
Żeby być zgodnym z intencją Javy (modyfikacja "in place"), w JS możemy użyć **tablicy**:

**In English:**
To be consistent with Java's intent (in-place modification), in JS we can use an **array**:

```javascript
// Rozwiązanie prawdziwie O(n) czasu i pamięci
// True O(n) time and space solution
function urlifyOptimal(str, trueLength) {
    // Tablica znaków (jak w Javie)
    // Character array (like in Java)
    const chars = [];

    // Jeden przechód przez string
    // Single pass through string
    for (let i = 0; i < trueLength; i++) {
        if (str[i] === ' ') {
            // Dodaj '%20' jako 3 osobne znaki
            // Add '%20' as 3 separate characters
            chars.push('%');
            chars.push('2');
            chars.push('0');
        } else {
            chars.push(str[i]);
        }
    }

    // Połącz tablicę w string (O(n))
    // Join array into string (O(n))
    return chars.join('');
}

console.log(urlifyOptimal("Mr John Smith    ", 13)); // "Mr%20John%20Smith"
```

---

## Podsumowanie złożoności / Complexity Summary

| Rozwiązanie / Solution | Czas / Time | Pamięć / Space | Uwagi / Notes |
|------------------------|-------------|----------------|---------------|
| **Solution 1** (replaceAll) | O(n) | O(n) | Najprostrze / Simplest |
| **Solution 2** (+=) | O(n²)* | O(n²)* | *Teoretycznie, praktycznie ~O(n) |
| **Solution 3** (split/join) | O(n) | O(n) | Najbardziej eleganckie / Most elegant |
| **urlifyOptimal** (array) | **O(n)** | **O(n)** | **Zgodne z intencją / True to intent** |

**Po polsku:**
Więc **urlifyOptimal** z tablicą to prawdziwe O(n) rozwiązanie zgodne z intencją pytającego!

**In English:**
So **urlifyOptimal** with array is the true O(n) solution consistent with the interviewer's intent!
