/**
 * Word Frequencies - Hash Map Approach
 *
 * Preprocessing: Zbuduj hash mapę wszystkich słów raz
 * Zapytania: O(1) dla każdego słowa
 *
 * Preprocessing: Build hash map of all words once
 * Queries: O(1) for each word
 *
 * Najlepsze dla: wielu zapytań o różne słowa
 * Best for: multiple queries for different words
 */

class WordFrequencyCounter {
  constructor(book) {
    this.frequencyMap = new Map();
    this.totalWords = 0;
    this.buildFrequencyMap(book);
  }

  buildFrequencyMap(book) {
    console.log('Budowanie mapy częstości... / Building frequency map...');

    // Podziel na słowa i normalizuj
    // Split into words and normalize
    const words = book.toLowerCase().split(/\s+/);
    this.totalWords = 0;

    for (let word of words) {
      // Usuń interpunkcję / Remove punctuation
      word = word.replace(/[.,!?;:'"]/g, '');

      if (word) {
        this.totalWords++;
        this.frequencyMap.set(
          word,
          (this.frequencyMap.get(word) || 0) + 1
        );
      }
    }

    console.log(`Mapa zbudowana! Unikalnych słów: ${this.frequencyMap.size}`);
    console.log(`Wszystkich słów: ${this.totalWords}\n`);
  }

  // Zwróć częstość słowa - O(1)
  // Return word frequency - O(1)
  getFrequency(word) {
    word = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
    return this.frequencyMap.get(word) || 0;
  }

  // Zwróć procent wystąpień
  // Return percentage of occurrences
  getPercentage(word) {
    const freq = this.getFrequency(word);
    return this.totalWords > 0 ? (freq / this.totalWords * 100).toFixed(2) : 0;
  }

  // Znajdź N najczęstszych słów
  // Find N most frequent words
  getTopN(n) {
    return Array.from(this.frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([word, count]) => ({ word, count, percentage: this.getPercentage(word) }));
  }

  // Znajdź wszystkie słowa o danej częstości
  // Find all words with given frequency
  getWordsWithFrequency(frequency) {
    return Array.from(this.frequencyMap.entries())
      .filter(([word, count]) => count === frequency)
      .map(([word, count]) => word);
  }

  // Wyświetl statystyki
  // Display statistics
  getStatistics() {
    return {
      totalWords: this.totalWords,
      uniqueWords: this.frequencyMap.size,
      averageFrequency: (this.totalWords / this.frequencyMap.size).toFixed(2)
    };
  }
}

// ============================================
// Testy / Tests
// ============================================

const sampleBook = `
  The quick brown fox jumps over the lazy dog.
  The dog was very lazy, and the fox was very quick.
  Quick! said the fox to the lazy dog.
  The, the, the - too many "the" words!
  Programming is fun. Programming is creative. Programming is powerful.
`;

console.log('=== Word Frequencies - Hash Map Approach ===\n');

// Utwórz counter
const counter = new WordFrequencyCounter(sampleBook);

// Test 1: Pojedyncze zapytania
console.log('Test 1: Pojedyncze zapytania o częstość');
console.log(`Częstość "the": ${counter.getFrequency('the')}`);
console.log(`Częstość "programming": ${counter.getFrequency('programming')}`);
console.log(`Częstość "quick": ${counter.getFrequency('quick')}`);
console.log(`Częstość "lazy": ${counter.getFrequency('lazy')}`);
console.log(`Częstość "cat" (nie istnieje): ${counter.getFrequency('cat')}\n`);

// Test 2: Zapytania z wielkimi literami
console.log('Test 2: Zapytania z wielkimi literami');
console.log(`Częstość "THE": ${counter.getFrequency('THE')}`);
console.log(`Częstość "Programming": ${counter.getFrequency('Programming')}`);
console.log(`(Normalizowane do małych liter)\n`);

// Test 3: Procenty
console.log('Test 3: Procenty wystąpień');
console.log(`"the" stanowi ${counter.getPercentage('the')}% wszystkich słów`);
console.log(`"programming" stanowi ${counter.getPercentage('programming')}% wszystkich słów\n`);

// Test 4: Top N słów
console.log('Test 4: Top 5 najczęstszych słów');
const top5 = counter.getTopN(5);
top5.forEach((item, index) => {
  console.log(`${index + 1}. "${item.word}": ${item.count} razy (${item.percentage}%)`);
});
console.log();

// Test 5: Słowa o określonej częstości
console.log('Test 5: Wszystkie słowa występujące 3 razy');
const wordsWithFreq3 = counter.getWordsWithFrequency(3);
console.log(wordsWithFreq3);
console.log();

// Test 6: Statystyki
console.log('Test 6: Statystyki książki');
const stats = counter.getStatistics();
console.log(`Wszystkich słów: ${stats.totalWords}`);
console.log(`Unikalnych słów: ${stats.uniqueWords}`);
console.log(`Średnia częstość: ${stats.averageFrequency}\n`);

// Test 7: Test wydajności wielu zapytań
console.log('Test 7: Test wydajności wielu zapytań');
const longBook = sampleBook.repeat(1000);
const counter2 = new WordFrequencyCounter(longBook);

const queries = ['the', 'programming', 'quick', 'lazy', 'fox', 'dog', 'very', 'is'];

console.log(`\nWykonywanie 10,000 zapytań...`);
const start = Date.now();

for (let i = 0; i < 10000; i++) {
  const word = queries[i % queries.length];
  counter2.getFrequency(word);
}

const end = Date.now();
console.log(`Czas wykonania: ${end - start}ms`);
console.log(`Średni czas na zapytanie: ${((end - start) / 10000).toFixed(4)}ms`);
console.log(`(O(1) dla każdego zapytania!)\n`);

// Test 8: Porównanie z prostym podejściem
console.log('Test 8: Porównanie z prostym podejściem');

function simpleGetFrequency(book, word) {
  word = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
  return book.toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[.,!?;:'"]/g, ''))
    .filter(w => w === word)
    .length;
}

const testBook = sampleBook.repeat(100);
const queries2 = ['the', 'programming', 'quick', 'lazy', 'fox'];

// Proste podejście
console.log('\nProste podejście (bez preprocessingu):');
const start1 = Date.now();
for (let word of queries2) {
  simpleGetFrequency(testBook, word);
}
const end1 = Date.now();
console.log(`Czas dla ${queries2.length} zapytań: ${end1 - start1}ms`);

// Hash Map podejście
console.log('\nHash Map podejście (z preprocessingiem):');
const start2 = Date.now();
const counter3 = new WordFrequencyCounter(testBook);
for (let word of queries2) {
  counter3.getFrequency(word);
}
const end2 = Date.now();
console.log(`Czas (preprocessing + ${queries2.length} zapytań): ${end2 - start2}ms`);

console.log('\nWniosek: Hash Map jest szybsze dla wielu zapytań!\n');

// Test 9: Duża książka z prawdziwym tekstem
console.log('Test 9: Analiza dłuższego tekstu');
const mobyDick = `
  Call me Ishmael. Some years ago—never mind how long precisely—having little or
  no money in my purse, and nothing particular to interest me on shore, I thought
  I would sail about a little and see the watery part of the world. It is a way I
  have of driving off the spleen and regulating the circulation. Whenever I find
  myself growing grim about the mouth; whenever it is a damp, drizzly November in
  my soul; whenever I find myself involuntarily pausing before coffin warehouses,
  and bringing up the rear of every funeral I meet; and especially whenever my
  hypos get such an upper hand of me, that it requires a strong moral principle
  to prevent me from deliberately stepping into the street, and methodically
  knocking people's hats off—then, I account it high time to get to sea as soon
  as I can.
`.repeat(10);

const mobyCounter = new WordFrequencyCounter(mobyDick);
console.log('\nAnaliza "Moby Dick":');
console.log(mobyCounter.getStatistics());
console.log('\nTop 10 słów:');
mobyCounter.getTopN(10).forEach((item, i) => {
  console.log(`${i + 1}. "${item.word}": ${item.count}`);
});

// Wnioski
console.log('\n=== Wnioski / Conclusions ===');
console.log('Hash Map podejście:');
console.log('✓ O(1) zapytania');
console.log('✓ Idealne dla wielu zapytań');
console.log('✓ Dodatkowe funkcje (top N, statystyki)');
console.log('✓ O(n) preprocessing (jeden raz)');
console.log('✗ O(k) pamięć (k = unikalne słowa)');
