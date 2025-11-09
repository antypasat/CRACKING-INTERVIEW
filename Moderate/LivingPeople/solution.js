/**
 * Living People - Year with Most People Alive
 * Rok z największą liczbą żyjących osób
 */

/**
 * Podejście 1: Brute Force - O(n * years)
 * Approach 1: Brute Force - O(n * years)
 *
 * Dla każdego roku sprawdź ile osób żyło
 * For each year check how many people were alive
 */
function maxAliveYearBruteForce(people, minYear = 1900, maxYear = 2000) {
  if (!people || people.length === 0) {
    return { year: null, count: 0 };
  }

  let maxAlive = 0;
  let bestYear = minYear;

  // Dla każdego roku w zakresie
  // For each year in range
  for (let year = minYear; year <= maxYear; year++) {
    let alive = 0;

    // Zlicz ile osób żyło w tym roku
    // Count how many people were alive this year
    for (let person of people) {
      if (person.birth <= year && person.death >= year) {
        alive++;
      }
    }

    if (alive > maxAlive) {
      maxAlive = alive;
      bestYear = year;
    }
  }

  return { year: bestYear, count: maxAlive };
}

/**
 * Podejście 2: Delta Array - O(n + years)
 * Approach 2: Delta Array - O(n + years)
 *
 * Używamy tablicy zmian: +1 przy narodzinach, -1 po śmierci
 * Use delta array: +1 at birth, -1 after death
 */
function maxAliveYearDelta(people, minYear = 1900, maxYear = 2000) {
  if (!people || people.length === 0) {
    return { year: null, count: 0 };
  }

  const years = maxYear - minYear + 1;
  const delta = new Array(years + 2).fill(0);

  // Zapisz zmiany liczby żyjących osób
  // Record changes in alive count
  for (let person of people) {
    const birthIdx = person.birth - minYear;
    const deathIdx = person.death - minYear + 1; // +1 bo osoba żyje w roku śmierci

    if (birthIdx >= 0 && birthIdx < delta.length) {
      delta[birthIdx]++;
    }
    if (deathIdx >= 0 && deathIdx < delta.length) {
      delta[deathIdx]--;
    }
  }

  // Przejdź przez lata i znajdź maksimum
  // Iterate through years and find maximum
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

/**
 * Podejście 3: Sortowanie Wydarzeń - O(n log n)
 * Approach 3: Event Sorting - O(n log n)
 *
 * Traktuj narodziny i śmierci jako wydarzenia
 * Treat births and deaths as events
 */
function maxAliveYearEvents(people) {
  if (!people || people.length === 0) {
    return { year: null, count: 0 };
  }

  const events = [];

  // Stwórz wydarzenia dla narodzin i śmierci
  // Create events for births and deaths
  for (let person of people) {
    events.push({ year: person.birth, type: 'birth' });
    events.push({ year: person.death + 1, type: 'death' }); // +1 bo żyje w roku śmierci
  }

  // Sortuj: najpierw po roku, potem narodziny przed śmierciami
  // Sort: first by year, then births before deaths
  events.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.type === 'birth' ? -1 : 1;
  });

  let currentAlive = 0;
  let maxAlive = 0;
  let maxYear = events[0].year;

  // Przetwórz wydarzenia
  // Process events
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

/**
 * Funkcja pomocnicza: Szczegółowa analiza po latach
 * Helper function: Detailed year-by-year analysis
 */
function analyzeYears(people, minYear = 1900, maxYear = 2000) {
  console.log('\nSzczegółowa analiza po latach:');

  const delta = new Array(maxYear - minYear + 2).fill(0);

  for (let person of people) {
    delta[person.birth - minYear]++;
    delta[person.death - minYear + 1]--;
  }

  let currentAlive = 0;
  let maxAlive = 0;
  let maxYear = minYear;

  console.log('\nZmiany liczby żyjących osób:');
  for (let i = 0; i <= maxYear - minYear; i++) {
    if (delta[i] !== 0) {
      currentAlive += delta[i];
      console.log(`  Rok ${minYear + i}: ${delta[i] > 0 ? '+' : ''}${delta[i]} → ${currentAlive} osób żyje`);

      if (currentAlive > maxAlive) {
        maxAlive = currentAlive;
        maxYear = minYear + i;
      }
    }
  }

  console.log(`\nMaksimum: ${maxAlive} osób w roku ${maxYear}`);
  return { year: maxYear, count: maxAlive };
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Living People - Year with Most Alive ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład podstawowy');
const people1 = [
  { birth: 1900, death: 1960 },
  { birth: 1920, death: 1975 },
  { birth: 1950, death: 2000 },
  { birth: 1910, death: 1980 }
];

console.log('Osoby:');
people1.forEach((p, i) => console.log(`  Osoba ${i + 1}: ${p.birth}-${p.death}`));

const result1Brute = maxAliveYearBruteForce(people1);
const result1Delta = maxAliveYearDelta(people1);
const result1Events = maxAliveYearEvents(people1);

console.log(`\nWyniki:`);
console.log(`  Brute Force: rok ${result1Brute.year}, ${result1Brute.count} osób`);
console.log(`  Delta Array: rok ${result1Delta.year}, ${result1Delta.count} osób`);
console.log(`  Events:      rok ${result1Events.year}, ${result1Events.count} osób`);
console.log(`  (Oczekiwane: rok 1950, 4 osoby)\n`);

// Test 2: Szczegółowa analiza
console.log('Test 2: Szczegółowa analiza');
analyzeYears(people1);
console.log();

// Test 3: Osoby żyjące w różnych okresach
console.log('Test 3: Różne okresy życia');
const people2 = [
  { birth: 1900, death: 1920 },
  { birth: 1905, death: 1925 },
  { birth: 1910, death: 1930 },
  { birth: 1915, death: 1935 },
  { birth: 1920, death: 1940 }
];

const result2 = maxAliveYearDelta(people2);
console.log(`Wynik: rok ${result2.year}, ${result2.count} osób`);
console.log(`(Oczekiwane: ok. 1920, 5 osób)\n`);

// Test 4: Wszyscy żyją w tym samym czasie
console.log('Test 4: Wszyscy żyją w tym samym czasie');
const people3 = [
  { birth: 1940, death: 1960 },
  { birth: 1945, death: 1965 },
  { birth: 1950, death: 1970 }
];

const result3 = maxAliveYearDelta(people3);
console.log(`Wynik: rok ${result3.year}, ${result3.count} osób`);
console.log(`(Oczekiwane: 1950-1960, 3 osoby)\n`);

// Test 5: Nikt się nie pokrywa
console.log('Test 5: Okresy życia się nie pokrywają');
const people4 = [
  { birth: 1900, death: 1910 },
  { birth: 1920, death: 1930 },
  { birth: 1940, death: 1950 }
];

const result4 = maxAliveYearDelta(people4);
console.log(`Wynik: rok ${result4.year}, ${result4.count} osób`);
console.log(`(Oczekiwane: dowolny rok, 1 osoba)\n`);

// Test 6: Edge cases
console.log('Test 6: Edge cases');

console.log('a) Pusta lista:');
const result6a = maxAliveYearDelta([]);
console.log(`   Wynik: rok ${result6a.year}, ${result6a.count} osób`);

console.log('b) Jedna osoba:');
const result6b = maxAliveYearDelta([{ birth: 1950, death: 1990 }]);
console.log(`   Wynik: rok ${result6b.year}, ${result6b.count} osób`);

console.log('c) Osoba żyje tylko rok (birth = death):');
const result6c = maxAliveYearDelta([{ birth: 1950, death: 1950 }]);
console.log(`   Wynik: rok ${result6c.year}, ${result6c.count} osób`);

console.log('d) Wszyscy urodzeni tego samego roku:');
const people6d = [
  { birth: 1950, death: 1960 },
  { birth: 1950, death: 1970 },
  { birth: 1950, death: 1980 }
];
const result6d = maxAliveYearDelta(people6d);
console.log(`   Wynik: rok ${result6d.year}, ${result6d.count} osób\n`);

// Test 7: Duża liczba osób
console.log('Test 7: Duża liczba osób (test wydajności)');
const bigPeople = [];
for (let i = 0; i < 10000; i++) {
  const birth = 1900 + Math.floor(Math.random() * 80);
  const death = birth + 20 + Math.floor(Math.random() * 60);
  bigPeople.push({ birth, death: Math.min(death, 2000) });
}

let start = Date.now();
const resultBrute = maxAliveYearBruteForce(bigPeople);
const timeBrute = Date.now() - start;

start = Date.now();
const resultDelta = maxAliveYearDelta(bigPeople);
const timeDelta = Date.now() - start;

start = Date.now();
const resultEvents = maxAliveYearEvents(bigPeople);
const timeEvents = Date.now() - start;

console.log(`Brute Force:  ${timeBrute}ms - rok ${resultBrute.year}, ${resultBrute.count} osób`);
console.log(`Delta Array:  ${timeDelta}ms - rok ${resultDelta.year}, ${resultDelta.count} osób`);
console.log(`Events:       ${timeEvents}ms - rok ${resultEvents.year}, ${resultEvents.count} osób`);
console.log();

// Test 8: Poprawność wszystkich metod
console.log('Test 8: Weryfikacja zgodności wszystkich metod');
const testCases = [
  [
    { birth: 1900, death: 1950 },
    { birth: 1925, death: 1975 },
    { birth: 1940, death: 1960 }
  ],
  [
    { birth: 1910, death: 1990 },
    { birth: 1920, death: 1980 },
    { birth: 1930, death: 1970 },
    { birth: 1940, death: 1960 }
  ],
  [
    { birth: 1900, death: 1920 },
    { birth: 1930, death: 1950 },
    { birth: 1960, death: 1980 }
  ]
];

testCases.forEach((testCase, idx) => {
  const r1 = maxAliveYearBruteForce(testCase);
  const r2 = maxAliveYearDelta(testCase);
  const r3 = maxAliveYearEvents(testCase);

  const match = r1.count === r2.count && r2.count === r3.count;
  console.log(`Test Case ${idx + 1}: ${match ? '✓' : '✗'} (count: ${r1.count}/${r2.count}/${r3.count})`);
});
console.log();

// Test 9: Wszystkie granice zakresu
console.log('Test 9: Granice zakresu lat (1900-2000)');
const people9 = [
  { birth: 1900, death: 1900 }, // Tylko 1900
  { birth: 2000, death: 2000 }, // Tylko 2000
  { birth: 1900, death: 2000 }, // Cały zakres
  { birth: 1950, death: 1950 }  // Środek
];

console.log('Osoby:');
people9.forEach((p, i) => console.log(`  Osoba ${i + 1}: ${p.birth}-${p.death}`));

const result9 = maxAliveYearDelta(people9);
console.log(`Wynik: rok ${result9.year}, ${result9.count} osób\n`);

// Test 10: Wiele osób z tą samą datą urodzenia
console.log('Test 10: Baby boom - wiele osób urodzonych w tym samym roku');
const people10 = [];
for (let i = 0; i < 20; i++) {
  people10.push({ birth: 1946, death: 1946 + 50 + Math.floor(Math.random() * 30) });
}

const result10 = maxAliveYearDelta(people10);
console.log(`Wynik: rok ${result10.year}, ${result10.count} osób`);
console.log(`(Oczekiwane: prawdopodobnie 1946, gdy wszyscy się urodzili)\n`);

console.log('=== Podsumowanie / Summary ===');
console.log('Brute Force:     O(n * years) - proste, ale wolne dla dużego zakresu lat');
console.log('Delta Array:     O(n + years) - najlepsze dla znanego zakresu lat (1900-2000)');
console.log('Event Sorting:   O(n log n)   - najlepsze dla nieznanego zakresu lat');
console.log('\nDla tego zadania (1900-2000): Delta Array jest optymalne!');
