# Group Anagrams - Grupowanie Anagramów

## Treść Zadania / Problem Statement

**English:**
Write a method to sort an array of strings so that all the anagrams are next to each other.

**Polski:**
Napisz metodę, która posortuje tablicę stringów tak, aby wszystkie anagramy znajdowały się obok siebie.

## Wyjaśnienie Problemu / Problem Explanation

**Polski:**
Anagramy to słowa, które składają się z tych samych liter, ale w innej kolejności. Na przykład:
- "listen" i "silent" są anagramami
- "eart", "rate", "tear" są anagramami

Zadanie polega na tym, żeby przeorganizować tablicę stringów tak, aby wszystkie słowa będące anagramami znalazły się obok siebie w tablicy. Nie musimy sortować słów w obrębie grupy anagramów - ważne jest tylko ich zgrupowanie.

**English:**
Anagrams are words that consist of the same letters but in different order. For example:
- "listen" and "silent" are anagrams
- "earth", "heart", "hater" are anagrams

The task is to reorganize an array of strings so that all words that are anagrams are placed next to each other in the array. We don't need to sort words within an anagram group - only the grouping matters.

## Rozwiązanie / Solution

### Podejście 1: HashMap z Posortowanymi Literami / HashMap with Sorted Letters

**Kluczowa Intuicja / Key Intuition:**
- Wszystkie anagramy po posortowaniu swoich liter dadzą ten sam ciąg znaków
- "listen" → "eilnst"
- "silent" → "eilnst"
- Możemy użyć posortowanego stringa jako klucza w mapie

**All anagrams after sorting their letters will give the same string**
- "listen" → "eilnst"
- "silent" → "eilnst"
- We can use the sorted string as a key in a map

### Algorytm / Algorithm:

1. Stwórz mapę (HashMap), gdzie:
   - Klucz = posortowane litery słowa
   - Wartość = tablica słów o tych literach

2. Dla każdego słowa:
   - Posortuj jego litery
   - Dodaj słowo do odpowiedniej grupy w mapie

3. Połącz wszystkie grupy z powrotem w jedną tablicę

**Steps:**
1. Create a map (HashMap), where:
   - Key = sorted letters of word
   - Value = array of words with those letters

2. For each word:
   - Sort its letters
   - Add word to appropriate group in map

3. Combine all groups back into one array

### Wizualizacja / Visualization:

```
Input: ["acre", "race", "care", "dog", "god", "cat"]

Krok 1: Grupowanie według posortowanych liter
{
  "acer": ["acre", "race", "care"],
  "dgo":  ["dog", "god"],
  "act":  ["cat"]
}

Krok 2: Połącz grupy
Output: ["acre", "race", "care", "dog", "god", "cat"]
```

### Podejście 2: Sortowanie Niestandardowe / Custom Sorting

**Alternatywne Podejście / Alternative Approach:**
Użyj wbudowanej funkcji sortującej z niestandardowym komparatorem, który porównuje posortowane wersje stringów.

Use built-in sort function with custom comparator that compares sorted versions of strings.

## Implementacja / Implementation

Zobacz pliki:
- `solution.js` - podejście z HashMap
- `solution2.js` - podejście z sortowaniem niestandardowym

See files:
- `solution.js` - HashMap approach
- `solution2.js` - custom sorting approach

## Analiza Złożoności / Complexity Analysis

### Podejście 1: HashMap

**Złożoność Czasowa / Time Complexity:** O(n * k log k)
- n = liczba stringów / number of strings
- k = maksymalna długość stringa / max string length
- k log k = koszt sortowania każdego stringa / cost of sorting each string

**Złożoność Pamięciowa / Space Complexity:** O(n * k)
- Przechowujemy wszystkie stringi w mapie
- We store all strings in the map

### Podejście 2: Sortowanie Niestandardowe

**Złożoność Czasowa / Time Complexity:** O(n * k log k * log n)
- n log n = koszt sortowania tablicy / cost of sorting array
- k log k = koszt porównania (sortowanie liter) / cost of comparison (sorting letters)

**Złożoność Pamięciowa / Space Complexity:** O(k)
- Tylko tymczasowe stringi dla porównań
- Only temporary strings for comparisons

## Przypadki Brzegowe / Edge Cases

1. **Pusta tablica** - zwróć pustą tablicę
2. **Tablica z jednym elementem** - zwróć jak jest
3. **Brak anagramów** - każde słowo w osobnej grupie
4. **Wszystkie słowa to anagramy** - wszystkie w jednej grupie
5. **Różna wielkość liter** - czy "Listen" i "Silent" to anagramy?
6. **Puste stringi** - jak obsłużyć?

1. **Empty array** - return empty array
2. **Single element array** - return as is
3. **No anagrams** - each word in separate group
4. **All words are anagrams** - all in one group
5. **Different letter cases** - are "Listen" and "Silent" anagrams?
6. **Empty strings** - how to handle?

## Pytania do Rekrutera / Questions for Interviewer

1. Czy wielkość liter ma znaczenie? / Is case sensitivity important?
2. Czy możemy modyfikować oryginalną tablicę? / Can we modify the original array?
3. Czy w obrębie grup musimy zachować konkretną kolejność? / Must we preserve specific order within groups?
4. Czy mogą być puste stringi? / Can there be empty strings?
5. Czy możemy założyć tylko znaki ASCII? / Can we assume only ASCII characters?

## Kluczowe Wnioski / Key Takeaways

1. **Posortowane litery jako klucz** - elegancki sposób na identyfikację anagramów
2. **HashMap dla grupowania** - efektywne O(1) wstawianie
3. **Trade-off pamięć vs czas** - HashMap używa więcej pamięci ale jest szybsza
4. **Sortowanie niestandardowe** - alternatywa gdy nie możemy użyć dodatkowej pamięci

1. **Sorted letters as key** - elegant way to identify anagrams
2. **HashMap for grouping** - efficient O(1) insertion
3. **Memory vs time trade-off** - HashMap uses more memory but is faster
4. **Custom sorting** - alternative when we can't use extra memory
