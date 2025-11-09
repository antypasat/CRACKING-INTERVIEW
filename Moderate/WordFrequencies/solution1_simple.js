/**
 * Word Frequencies - Proste Podejście / Simple Approach
 *
 * Zliczanie częstości słowa przez przejście przez cały tekst.
 * Count word frequency by iterating through entire text.
 *
 * Najlepsze dla: pojedynczych zapytań lub gdy pamięć jest ograniczona
 * Best for: single queries or when memory is limited
 */

function getFrequency(book, word) {
  // Normalizuj słowo (małe litery, bez interpunkcji)
  // Normalize word (lowercase, no punctuation)
  word = word.toLowerCase().replace(/[.,!?;:'"]/g, '');

  // Podziel książkę na słowa
  // Split book into words
  const words = book.toLowerCase().split(/\s+/);

  let count = 0;

  // Zlicz wystąpienia
  // Count occurrences
  for (let w of words) {
    // Usuń znaki interpunkcyjne z każdego słowa
    // Remove punctuation from each word
    w = w.replace(/[.,!?;:'"]/g, '');

    if (w === word) {
      count++;
    }
  }

  return count;
}

// Ulepszona wersja z użyciem filter i reduce
// Improved version using filter and reduce
function getFrequencyFunctional(book, word) {
  word = word.toLowerCase().replace(/[.,!?;:'"]/g, '');

  return book
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[.,!?;:'"]/g, ''))
    .filter(w => w === word)
    .length;
}

// Wersja z użyciem reduce (najbardziej funkcyjna)
// Version using reduce (most functional)
function getFrequencyReduce(book, word) {
  word = word.toLowerCase().replace(/[.,!?;:'"]/g, '');

  return book
    .toLowerCase()
    .split(/\s+/)
    .reduce((count, w) => {
      w = w.replace(/[.,!?;:'"]/g, '');
      return count + (w === word ? 1 : 0);
    }, 0);
}

// ============================================
// Testy / Tests
// ============================================

const sampleBook = `
  The quick brown fox jumps over the lazy dog.
  The dog was very lazy, and the fox was very quick.
  Quick! said the fox to the lazy dog.
  The, the, the - too many "the" words!
`;

console.log('=== Word Frequencies - Proste Podejście ===\n');

// Test 1: Podstawowe zliczanie
console.log('Test 1: Znajdź częstość słowa "the"');
console.log(`Książka:\n${sampleBook}`);
const theCount = getFrequency(sampleBook, 'the');
console.log(`Częstość słowa "the": ${theCount}`);
console.log(`(Powinno być 7 - wielkie i małe litery)\n`);

// Test 2: Słowo z wielką literą
console.log('Test 2: Wyszukiwanie "THE" (wielkie litery)');
console.log(`Częstość: ${getFrequency(sampleBook, 'THE')}`);
console.log(`(Powinno być 7 - normalizacja do małych liter)\n`);

// Test 3: Słowo z interpunkcją
console.log('Test 3: Wyszukiwanie "quick" (występuje też jako "Quick!")');
console.log(`Częstość: ${getFrequency(sampleBook, 'quick')}`);
console.log(`(Powinno być 3)\n`);

// Test 4: Słowo które nie istnieje
console.log('Test 4: Słowo które nie istnieje');
console.log(`Częstość słowa "cat": ${getFrequency(sampleBook, 'cat')}`);
console.log(`(Powinno być 0)\n`);

// Test 5: Słowo jednoliterowe
console.log('Test 5: Słowo jednoliterowe "a"');
const bookWithA = "I am a student. A good student is a happy student.";
console.log(`Książka: "${bookWithA}"`);
console.log(`Częstość słowa "a": ${getFrequency(bookWithA, 'a')}`);
console.log(`(Powinno być 3)\n`);

// Test 6: Porównanie różnych implementacji
console.log('Test 6: Porównanie różnych implementacji');
console.log(`getFrequency:           ${getFrequency(sampleBook, 'the')}`);
console.log(`getFrequencyFunctional: ${getFrequencyFunctional(sampleBook, 'the')}`);
console.log(`getFrequencyReduce:     ${getFrequencyReduce(sampleBook, 'the')}`);
console.log(`(Wszystkie powinny dać 7)\n`);

// Test 7: Edge case - pusty tekst
console.log('Test 7: Edge case - pusty tekst');
console.log(`Częstość w pustym tekście: ${getFrequency('', 'word')}`);
console.log(`(Powinno być 0)\n`);

// Test 8: Edge case - puste słowo
console.log('Test 8: Edge case - puste słowo do wyszukania');
console.log(`Częstość pustego słowa: ${getFrequency(sampleBook, '')}`);
console.log(`(Powinno być 0)\n`);

// Test 9: Tekst z wieloma spacjami i nowymi liniami
console.log('Test 9: Tekst z wieloma spacjami i nowymi liniami');
const messyBook = "hello    world\n\nhello\t\thello   world";
console.log(`Tekst: "${messyBook}"`);
console.log(`Częstość "hello": ${getFrequency(messyBook, 'hello')}`);
console.log(`Częstość "world": ${getFrequency(messyBook, 'world')}`);
console.log(`(hello: 3, world: 2)\n`);

// Test 10: Długi tekst (test wydajności)
console.log('Test 10: Test wydajności z dłuższym tekstem');
const longBook = sampleBook.repeat(1000); // Powtórz 1000 razy
console.log(`Długość tekstu: ${longBook.length} znaków`);

const start = Date.now();
const result = getFrequency(longBook, 'the');
const end = Date.now();

console.log(`Znaleziono słowo "the" ${result} razy`);
console.log(`Czas wykonania: ${end - start}ms`);
console.log(`(Dla pojedynczego zapytania to podejście jest OK)\n`);

// Test 11: Rzeczywisty przykład z dłuższym tekstem
console.log('Test 11: Liczenie słów w dłuższym fragmencie');
const mobyDick = `
  Call me Ishmael. Some years ago—never mind how long precisely—having little or
  no money in my purse, and nothing particular to interest me on shore, I thought
  I would sail about a little and see the watery part of the world. It is a way I
  have of driving off the spleen and regulating the circulation. Whenever I find
  myself growing grim about the mouth; whenever it is a damp, drizzly November in
  my soul; whenever I find myself involuntarily pausing before coffin warehouses.
`;

console.log('Fragment z "Moby Dick"');
console.log(`Częstość "I": ${getFrequency(mobyDick, 'I')}`);
console.log(`Częstość "the": ${getFrequency(mobyDick, 'the')}`);
console.log(`Częstość "a": ${getFrequency(mobyDick, 'a')}`);
console.log(`Częstość "myself": ${getFrequency(mobyDick, 'myself')}`);

// Wniosek
console.log('\n=== Wnioski / Conclusions ===');
console.log('Proste podejście:');
console.log('✓ Dobre dla pojedynczych zapytań');
console.log('✓ Małe zużycie pamięci');
console.log('✗ O(n) dla każdego zapytania');
console.log('✗ Nieefektywne dla wielu zapytań');
