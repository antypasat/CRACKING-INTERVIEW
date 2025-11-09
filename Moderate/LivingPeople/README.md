# 16.10 Living People

## Opis Zadania / Problem Description

**Living People**: Given a list of people with their birth and death years, implement a method to compute the year with the most number of people alive. You may assume that all people were born between 1900 and 2000 (inclusive). If a person was alive during any portion of that year, they should be included in that year's count.

**Żyjące Osoby**: Mając listę osób z ich rokami narodzin i śmierci, zaimplementuj metodę obliczającą rok, w którym żyło najwięcej osób. Możesz założyć, że wszystkie osoby urodziły się między 1900 a 2000 (włącznie). Jeśli osoba żyła w jakiejkolwiek części danego roku, powinna być uwzględniona w liczbie osób dla tego roku.

EXAMPLE
Input:
- Person 1: 1900-1960
- Person 2: 1920-1975
- Person 3: 1950-2000
- Person 4: 1910-1980

Output: 1950 (4 people alive)

Hints: #476, #490, #507

## Wyjaśnienie Problemu / Problem Explanation

Musimy znaleźć rok między 1900 a 2000, w którym żyło najwięcej osób z podanej listy. Osoba jest liczona jako żywa w danym roku, jeśli:
- Urodziła się w tym roku lub wcześniej
- Zmarła w tym roku lub później (lub nadal żyje)

We need to find the year between 1900 and 2000 when the most people from the given list were alive. A person is counted as alive in a given year if:
- They were born in that year or earlier
- They died in that year or later (or are still alive)

## Rozwiązania / Solutions

### Podejście 1: Brute Force - O(n * years)

**Idea**: Dla każdego roku (1900-2000) zlicz ile osób żyło w tym roku.

**Idea**: For each year (1900-2000) count how many people were alive in that year.

```javascript
function maxAliveYearBruteForce(people, minYear = 1900, maxYear = 2000) {
  let maxAlive = 0;
  let maxYear = minYear;

  for (let year = minYear; year <= maxYear; year++) {
    let alive = 0;
    for (let person of people) {
      if (person.birth <= year && person.death >= year) {
        alive++;
      }
    }
    if (alive > maxAlive) {
      maxAlive = alive;
      maxYear = year;
    }
  }

  return { year: maxYear, count: maxAlive };
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n * years) = O(n * 101) = O(n)
- Pamięciowa / Space: O(1)

### Podejście 2: Delta Array - O(n + years)

**Idea**: Użyj tablicy zmian (delta array). Dla każdej osoby:
- Dodaj +1 w roku narodzin
- Dodaj -1 w roku po śmierci

Następnie przejdź przez lata, śledząc bieżącą liczbę żyjących osób.

**Idea**: Use a delta array. For each person:
- Add +1 in birth year
- Add -1 in the year after death

Then iterate through years, tracking the current count of alive people.

```javascript
function maxAliveYearDelta(people, minYear = 1900, maxYear = 2000) {
  const years = maxYear - minYear + 1;
  const delta = new Array(years + 2).fill(0);

  for (let person of people) {
    delta[person.birth - minYear]++;
    delta[person.death - minYear + 1]--;
  }

  let currentAlive = 0;
  let maxAlive = 0;
  let maxYearIdx = 0;

  for (let i = 0; i <= years; i++) {
    currentAlive += delta[i];
    if (currentAlive > maxAlive) {
      maxAlive = currentAlive;
      maxYearIdx = i;
    }
  }

  return { year: minYear + maxYearIdx, count: maxAlive };
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n + years) = O(n + 101) = O(n)
- Pamięciowa / Space: O(years) = O(101) = O(1)

### Podejście 3: Sortowanie Wydarzeń - O(n log n)

**Idea**: Traktuj narodziny i śmierci jako wydarzenia. Sortuj wszystkie wydarzenia chronologicznie i śledź liczbę żywych osób.

**Idea**: Treat births and deaths as events. Sort all events chronologically and track the count of alive people.

```javascript
function maxAliveYearEvents(people) {
  const events = [];

  for (let person of people) {
    events.push({ year: person.birth, type: 'birth' });
    events.push({ year: person.death + 1, type: 'death' });
  }

  // Sortuj: najpierw po roku, potem narodziny przed śmierciami
  events.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.type === 'birth' ? -1 : 1;
  });

  let currentAlive = 0;
  let maxAlive = 0;
  let maxYear = events[0].year;

  for (let event of events) {
    if (event.type === 'birth') {
      currentAlive++;
      if (currentAlive > maxAlive) {
        maxAlive = currentAlive;
        maxYear = event.year;
      }
    } else {
      currentAlive--;
    }
  }

  return { year: maxYear, count: maxAlive };
}
```

**Zalety / Advantages**:
- Działa dla dowolnego zakresu lat (nie tylko 1900-2000)
- Nie wymaga znania minYear i maxYear z góry
- Efektywne dla rzadkich danych

**Złożoność / Complexity**:
- Czasowa / Time: O(n log n) - sortowanie
- Pamięciowa / Space: O(n) - tablica wydarzeń

## Szczególne Przypadki / Edge Cases

1. **Wszystkie osoby żyły w tym samym roku**: Zwróć ten rok
2. **Puste dane**: Brak osób
3. **Jedna osoba**: Zwróć dowolny rok z jej życia
4. **Równa liczba osób w wielu latach**: Zwróć pierwszy taki rok
5. **Osoba żyje jedynie w roku narodzin i śmierci**: birth = death
6. **Wszyscy urodzeni w 1900, wszyscy zmarli w 2000**: Szczyt w latach środkowych

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Delta Array (Podejście 2)**: Najlepsze gdy zakres lat jest mały i znany (jak 1900-2000)
- **Sortowanie Wydarzeń (Podejście 3)**: Najlepsze gdy zakres lat jest duży lub nieznany
- **Brute Force (Podejście 1)**: Tylko do celów edukacyjnych lub bardzo małych danych

## Analiza Przykładu / Example Analysis

```
Osoby:
1. 1900-1960
2. 1920-1975
3. 1950-2000
4. 1910-1980

Analiza Delta:
1900: +1 (osoba 1) → 1 żyje
1910: +1 (osoba 4) → 2 żyją
1920: +1 (osoba 2) → 3 żyją
1950: +1 (osoba 3) → 4 żyją ← MAKSIMUM
1961: -1 (osoba 1 zmarła) → 3 żyją
1976: -1 (osoba 2 zmarła) → 2 żyją
1981: -1 (osoba 4 zmarła) → 1 żyje
2001: -1 (osoba 3 zmarła) → 0 żyje

Odpowiedź: 1950 z 4 osobami
```
