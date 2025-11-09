/**
 * T9 - Text on 9 keys
 * Znajdź słowa pasujące do sekwencji cyfr z klawiatury telefonicznej
 * Find words matching digit sequence from phone keypad
 */

/**
 * Mapowanie cyfr na litery / Digit to letter mapping
 */
const DIGIT_TO_LETTERS = {
  '0': ' ',
  '1': '',
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz'
};

/**
 * Mapowanie liter na cyfry / Letter to digit mapping
 */
const LETTER_TO_DIGIT = {
  'a': '2', 'b': '2', 'c': '2',
  'd': '3', 'e': '3', 'f': '3',
  'g': '4', 'h': '4', 'i': '4',
  'j': '5', 'k': '5', 'l': '5',
  'm': '6', 'n': '6', 'o': '6',
  'p': '7', 'q': '7', 'r': '7', 's': '7',
  't': '8', 'u': '8', 'v': '8',
  'w': '9', 'x': '9', 'y': '9', 'z': '9'
};

/**
 * Podejście 1: Brute Force - Generuj wszystkie kombinacje
 * Approach 1: Brute Force - Generate all combinations
 *
 * O(4^n × m) - wolne dla dużych n
 * O(4^n × m) - slow for large n
 */
function t9BruteForce(digits, dictionary) {
  if (!digits || digits.length === 0) return [];
  if (!dictionary || dictionary.length === 0) return [];

  const combinations = generateCombinations(digits);
  const dictSet = new Set(dictionary.map(w => w.toLowerCase()));

  return combinations.filter(combo => dictSet.has(combo));
}

function generateCombinations(digits) {
  if (digits.length === 0) return [''];

  const firstDigit = digits[0];
  const letters = DIGIT_TO_LETTERS[firstDigit] || '';
  const rest = generateCombinations(digits.slice(1));

  if (letters.length === 0) {
    return rest; // Cyfra bez liter (0, 1)
  }

  const result = [];
  for (const letter of letters) {
    for (const suffix of rest) {
      result.push(letter + suffix);
    }
  }

  return result;
}

/**
 * Podejście 2: Dictionary Filtering - O(m × n) ✓ DOBRE
 * Approach 2: Dictionary Filtering - O(m × n) ✓ GOOD
 *
 * Filtruj dictionary - sprawdź które słowa pasują
 * Filter dictionary - check which words match
 */
function t9Filtering(digits, dictionary) {
  if (!digits || digits.length === 0) return [];
  if (!dictionary || dictionary.length === 0) return [];

  return dictionary.filter(word => matchesDigits(word, digits));
}

function matchesDigits(word, digits) {
  if (word.length !== digits.length) return false;

  for (let i = 0; i < word.length; i++) {
    const digit = digits[i];
    const letter = word[i].toLowerCase();
    const validLetters = DIGIT_TO_LETTERS[digit] || '';

    if (!validLetters.includes(letter)) {
      return false;
    }
  }

  return true;
}

/**
 * Podejście 3: Trie-based - O(m × k) preprocessing + O(4^n) query
 * Approach 3: Trie-based - O(m × k) preprocessing + O(4^n) query
 *
 * Używa Trie do szybkiego przeszukiwania
 * Uses Trie for fast searching
 */
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
    const normalized = word.toLowerCase();

    for (const char of normalized) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }

    node.isWord = true;
    node.word = word;
  }

  searchT9(digits) {
    const results = [];
    this.dfs(this.root, digits, 0, results);
    return results;
  }

  dfs(node, digits, index, results) {
    // Zakończono sekwencję cyfr
    if (index === digits.length) {
      if (node.isWord) {
        results.push(node.word);
      }
      return;
    }

    const digit = digits[index];
    const letters = DIGIT_TO_LETTERS[digit] || '';

    // Wypróbuj każdą możliwą literę dla tej cyfry
    for (const letter of letters) {
      if (node.children[letter]) {
        this.dfs(node.children[letter], digits, index + 1, results);
      }
    }
  }

  // Dodatkowa funkcja: znajdź słowa zaczynające się od digits
  findWordsStartingWith(digits) {
    const results = [];
    let node = this.root;

    // Przejdź do węzła odpowiadającego sekwencji cyfr
    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
      const letters = DIGIT_TO_LETTERS[digit] || '';

      let found = false;
      for (const letter of letters) {
        if (node.children[letter]) {
          node = node.children[letter];
          found = true;
          break; // Weź pierwszą pasującą literę
        }
      }

      if (!found) return results;
    }

    // Zbierz wszystkie słowa z tego węzła
    this.collectWords(node, results);
    return results;
  }

  collectWords(node, results) {
    if (node.isWord) {
      results.push(node.word);
    }

    for (const child of Object.values(node.children)) {
      this.collectWords(child, results);
    }
  }
}

function t9Trie(digits, dictionary) {
  if (!digits || digits.length === 0) return [];
  if (!dictionary || dictionary.length === 0) return [];

  const trie = new Trie();
  for (const word of dictionary) {
    trie.insert(word);
  }

  return trie.searchT9(digits);
}

/**
 * Podejście 4: HashMap Pre-processing - O(m × k) + O(1) ✓ OPTYMALNE
 * Approach 4: HashMap Pre-processing - O(m × k) + O(1) ✓ OPTIMAL
 *
 * Pre-process dictionary: zamień słowa na sekwencje cyfr
 * Pre-process dictionary: convert words to digit sequences
 */
function t9HashMap(digits, dictionary) {
  if (!digits || digits.length === 0) return [];
  if (!dictionary || dictionary.length === 0) return [];

  // Pre-processing: zbuduj mapę cyfry → słowa
  const digitMap = new Map();

  for (const word of dictionary) {
    const digitSeq = wordToDigits(word);

    if (!digitMap.has(digitSeq)) {
      digitMap.set(digitSeq, []);
    }

    digitMap.get(digitSeq).push(word);
  }

  return digitMap.get(digits) || [];
}

function wordToDigits(word) {
  let result = '';
  for (const char of word.toLowerCase()) {
    result += LETTER_TO_DIGIT[char] || '';
  }
  return result;
}

/**
 * Podejście 5: HashMap z Cache (dla wielu zapytań)
 * Approach 5: HashMap with Cache (for multiple queries)
 */
class T9Dictionary {
  constructor(dictionary) {
    this.digitMap = new Map();
    this.buildMap(dictionary);
  }

  buildMap(dictionary) {
    for (const word of dictionary) {
      const digitSeq = wordToDigits(word);

      if (!this.digitMap.has(digitSeq)) {
        this.digitMap.set(digitSeq, []);
      }

      this.digitMap.get(digitSeq).push(word);
    }
  }

  search(digits) {
    return this.digitMap.get(digits) || [];
  }

  // Znajdź wszystkie słowa pasujące do prefix
  searchPrefix(digitPrefix) {
    const results = [];

    for (const [digitSeq, words] of this.digitMap.entries()) {
      if (digitSeq.startsWith(digitPrefix)) {
        results.push(...words);
      }
    }

    return results;
  }

  // Statystyki
  getStats() {
    return {
      totalWords: Array.from(this.digitMap.values()).reduce((sum, arr) => sum + arr.length, 0),
      uniqueSequences: this.digitMap.size,
      averageWordsPerSeq: Array.from(this.digitMap.values()).reduce((sum, arr) => sum + arr.length, 0) / this.digitMap.size
    };
  }
}

/**
 * Główna funkcja - używamy HashMap jako domyślne
 * Main function - use HashMap as default
 */
function t9(digits, dictionary) {
  return t9HashMap(digits, dictionary);
}

// ============================================
// Funkcje pomocnicze / Helper functions
// ============================================

/**
 * Wyświetl możliwe kombinacje dla sekwencji cyfr
 * Display possible combinations for digit sequence
 */
function showCombinations(digits, limit = 20) {
  const combinations = generateCombinations(digits);
  console.log(`Cyfry "${digits}" → ${combinations.length} kombinacji`);

  if (combinations.length <= limit) {
    console.log(`Wszystkie: ${combinations.join(', ')}`);
  } else {
    console.log(`Pierwsze ${limit}: ${combinations.slice(0, limit).join(', ')}...`);
  }
}

/**
 * Pokaż mapowanie dla słowa
 * Show mapping for word
 */
function showMapping(word) {
  const digits = wordToDigits(word);
  console.log(`"${word}" → ${digits}`);

  let mapping = '';
  for (let i = 0; i < word.length; i++) {
    mapping += `${word[i]}(${digits[i]}) `;
  }
  console.log(`Mapping: ${mapping}`);
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== T9 (Text on 9 Keys) ===\n');

// Przykładowy słownik / Sample dictionary
const dictionary = [
  'tree', 'used', 'user', 'tres', 'sued', 'deer',
  'good', 'home', 'gone', 'hood', 'hone', 'inne',
  'a', 'b', 'c', 'i', 'am', 'an', 'be', 'he',
  'hello', 'world', 'test', 'best', 'rest',
  'apple', 'application', 'apply'
];

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania (from problem)');
const digits1 = '8733';
const result1 = t9(digits1, dictionary);

console.log(`Digits: "${digits1}"`);
showCombinations(digits1, 10);
console.log(`Dictionary matches: [${result1.join(', ')}]`);
console.log(`Expected: tree, used`);
console.log(`Test ${result1.includes('tree') && result1.includes('used') ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: Pojedyncza cyfra
console.log('Test 2: Pojedyncza cyfra (single digit)');
const digits2 = '2';
const result2 = t9(digits2, dictionary);

console.log(`Digits: "${digits2}"`);
showCombinations(digits2);
console.log(`Dictionary matches: [${result2.join(', ')}]`);
console.log(`Expected: a, b, c`);
console.log(`Test ${result2.includes('a') && result2.includes('b') && result2.includes('c') ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: Wiele pasujących słów
console.log('Test 3: Wiele pasujących słów (multiple matches)');
const digits3 = '4663';
const result3 = t9(digits3, dictionary);

console.log(`Digits: "${digits3}"`);
console.log(`Dictionary matches: [${result3.join(', ')}]`);
result3.forEach(word => showMapping(word));
console.log();

// Test 4: Brak pasujących słów
console.log('Test 4: Brak pasujących słów (no matches)');
const digits4 = '1111';
const result4 = t9(digits4, dictionary);

console.log(`Digits: "${digits4}"`);
console.log(`Dictionary matches: [${result4.join(', ')}]`);
console.log(`Test ${result4.length === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 5: Pusty input
console.log('Test 5: Pusty input (empty input)');
const digits5 = '';
const result5 = t9(digits5, dictionary);

console.log(`Digits: ""`);
console.log(`Dictionary matches: [${result5.join(', ')}]`);
console.log(`Test ${result5.length === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 6: Długa sekwencja
console.log('Test 6: Długa sekwencja (long sequence)');
const digits6 = '43556';
const result6 = t9(digits6, dictionary);

console.log(`Digits: "${digits6}"`);
console.log(`Dictionary matches: [${result6.join(', ')}]`);
showMapping('hello');
console.log(`Test ${result6.includes('hello') ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 7: Porównanie wszystkich metod
console.log('Test 7: Porównanie wszystkich metod (compare methods)');
const testDigits = '8733';

const resultBrute = t9BruteForce(testDigits, dictionary);
const resultFilter = t9Filtering(testDigits, dictionary);
const resultTrie = t9Trie(testDigits, dictionary);
const resultHash = t9HashMap(testDigits, dictionary);

console.log(`Digits: "${testDigits}"`);
console.log(`Brute Force:  [${resultBrute.join(', ')}]`);
console.log(`Filtering:    [${resultFilter.join(', ')}]`);
console.log(`Trie:         [${resultTrie.join(', ')}]`);
console.log(`HashMap:      [${resultHash.join(', ')}]`);

const allSame = resultBrute.length === resultFilter.length &&
                resultFilter.length === resultTrie.length &&
                resultTrie.length === resultHash.length;

console.log(`Wszystkie zgodne (same count): ${allSame ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 8: T9Dictionary class
console.log('Test 8: T9Dictionary class (reusable)');
const t9Dict = new T9Dictionary(dictionary);

console.log('Stats:', t9Dict.getStats());
console.log(`Search "8733": [${t9Dict.search('8733').join(', ')}]`);
console.log(`Search "4663": [${t9Dict.search('4663').join(', ')}]`);
console.log(`Search "43556": [${t9Dict.search('43556').join(', ')}]`);
console.log();

// Test 9: Prefix search
console.log('Test 9: Prefix search (autocomplete)');
const prefix = '87';
const prefixResults = t9Dict.searchPrefix(prefix);

console.log(`Prefix: "${prefix}"`);
console.log(`Words starting with: [${prefixResults.join(', ')}]`);
prefixResults.forEach(word => showMapping(word));
console.log();

// Test 10: Performance test
console.log('Test 10: Performance test (różne metody)');

// Większy słownik
const largeDictionary = [];
for (let i = 0; i < 1000; i++) {
  const len = Math.floor(Math.random() * 8) + 3;
  let word = '';
  for (let j = 0; j < len; j++) {
    const charCode = 97 + Math.floor(Math.random() * 26);
    word += String.fromCharCode(charCode);
  }
  largeDictionary.push(word);
}

const testDigitSeq = '4663';

let start = Date.now();
const perfBrute = t9BruteForce(testDigitSeq, largeDictionary);
const timeBrute = Date.now() - start;

start = Date.now();
const perfFilter = t9Filtering(testDigitSeq, largeDictionary);
const timeFilter = Date.now() - start;

start = Date.now();
const perfTrie = t9Trie(testDigitSeq, largeDictionary);
const timeTrie = Date.now() - start;

start = Date.now();
const perfHash = t9HashMap(testDigitSeq, largeDictionary);
const timeHash = Date.now() - start;

console.log(`Dictionary size: ${largeDictionary.length} words`);
console.log(`Searching for: "${testDigitSeq}"`);
console.log(`Brute Force:  ${timeBrute}ms → ${perfBrute.length} results`);
console.log(`Filtering:    ${timeFilter}ms → ${perfFilter.length} results`);
console.log(`Trie:         ${timeTrie}ms → ${perfTrie.length} results`);
console.log(`HashMap:      ${timeHash}ms → ${perfHash.length} results`);
console.log();

// Test 11: Wszystkie cyfry
console.log('Test 11: Wszystkie cyfry 0-9');
for (let digit = 0; digit <= 9; digit++) {
  const letters = DIGIT_TO_LETTERS[digit.toString()];
  console.log(`  ${digit}: ${letters ? `"${letters}"` : '(none)'} (${letters.length} letters)`);
}
console.log();

// Test 12: Mapowanie konkretnych słów
console.log('Test 12: Mapowanie konkretnych słów');
const testWords = ['hello', 'world', 'tree', 'used', 'good'];
testWords.forEach(word => showMapping(word));
console.log();

// Test 13: Kolizje (różne słowa → te same cyfry)
console.log('Test 13: Kolizje (word collisions)');
const collisionDict = new T9Dictionary(dictionary);

console.log('Words that map to same digits:');
const digitGroups = new Map();

for (const word of dictionary) {
  const digits = wordToDigits(word);
  if (!digitGroups.has(digits)) {
    digitGroups.set(digits, []);
  }
  digitGroups.get(digits).push(word);
}

for (const [digits, words] of digitGroups.entries()) {
  if (words.length > 1) {
    console.log(`  ${digits}: [${words.join(', ')}]`);
  }
}
console.log();

// Test 14: Case insensitivity
console.log('Test 14: Case insensitivity');
const mixedCaseDict = ['Tree', 'USED', 'GoOd', 'hello'];
const result14 = t9('8733', mixedCaseDict);

console.log(`Dictionary: [${mixedCaseDict.join(', ')}]`);
console.log(`Search "8733": [${result14.join(', ')}]`);
console.log(`Test ${result14.some(w => w.toLowerCase() === 'tree') ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 15: Edge case - cyfry 0 i 1
console.log('Test 15: Cyfry 0 i 1 (no letters)');
const result15a = t9('0', dictionary);
const result15b = t9('1', dictionary);

console.log(`Search "0": [${result15a.join(', ')}]`);
console.log(`Search "1": [${result15b.join(', ')}]`);
console.log(`Test ${result15a.length === 0 && result15b.length === 0 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 16: Długość słowa = długość cyfr
console.log('Test 16: Filtrowanie po długości');
const shortDict = ['a', 'ab', 'abc', 'abcd', 'tree'];
const result16 = t9('8733', shortDict);

console.log(`Dictionary: [${shortDict.join(', ')}]`);
console.log(`Search "8733" (length 4): [${result16.join(', ')}]`);
console.log(`Test ${result16.includes('tree') && !result16.includes('a') ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 17: Duplikaty w dictionary
console.log('Test 17: Duplikaty w dictionary');
const dupDict = ['tree', 'tree', 'used', 'Tree'];
const result17 = t9('8733', dupDict);

console.log(`Dictionary: [${dupDict.join(', ')}]`);
console.log(`Search "8733": [${result17.join(', ')}]`);
console.log();

// Test 18: Kombinacje dla różnych długości
console.log('Test 18: Liczba kombinacji dla różnych długości');
for (let n = 1; n <= 6; n++) {
  const testDig = '7'.repeat(n); // Cyfra 7 ma 4 litery (max)
  const combos = generateCombinations(testDig);
  console.log(`  n=${n}: ${combos.length} kombinacji (4^${n} = ${Math.pow(4, n)})`);
}
console.log();

// Test 19: Specjalne słowa
console.log('Test 19: Specjalne przypadki');
const specialDict = ['i', 'a', 'am', 'an', 'be', 'he'];
console.log('Dictionary:', specialDict);

['4', '2', '26', '43'].forEach(dig => {
  const res = t9(dig, specialDict);
  console.log(`  "${dig}": [${res.join(', ')}]`);
});
console.log();

// Test 20: Wielokrotne wyszukiwania (cache test)
console.log('Test 20: Wielokrotne wyszukiwania (repeated queries)');
const t9Cache = new T9Dictionary(dictionary);

const queries = ['8733', '4663', '43556', '2', '4663', '8733'];
console.log('Queries:', queries);

start = Date.now();
const cacheResults = queries.map(q => t9Cache.search(q));
const cacheTime = Date.now() - start;

console.log(`Cache time: ${cacheTime}ms`);
cacheResults.forEach((res, i) => {
  console.log(`  "${queries[i]}": ${res.length} results`);
});
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('T9 - Text on 9 Keys (predictive text input)');
console.log('\nMetody:');
console.log('  Brute Force:  O(4^n × m) - generuj kombinacje');
console.log('  Filtering:    O(m × n)   - filtruj dictionary');
console.log('  Trie:         O(m×k) + O(4^n) - prefix tree');
console.log('  HashMap:      O(m×k) + O(1)   - najszybsze query ✓');
console.log('\nKluczowa idea:');
console.log('  - Pre-processing: słowo → cyfry');
console.log('  - Query: O(1) lookup w HashMap');
console.log('  - Trade-off: pamięć za szybkość');
console.log('\nMapowanie:');
console.log('  2:abc 3:def 4:ghi 5:jkl 6:mno 7:pqrs 8:tuv 9:wxyz');
console.log('\nZastosowania:');
console.log('  - Predictive text (T9 input)');
console.log('  - Autocomplete');
console.log('  - Spell checking');
console.log('  - Word games');
console.log('  - Password cracking');
