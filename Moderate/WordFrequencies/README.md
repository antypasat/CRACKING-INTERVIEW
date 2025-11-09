# 16.2 Word Frequencies

## Opis Zadania / Problem Description

**Word Frequencies**: Design a method to find the frequency of occurrences of any given word in a book. What if we were running this algorithm multiple times?

**Częstość Słów**: Zaprojektuj metodę do znalezienia częstości występowania danego słowa w książce. Co jeśli będziemy uruchamiać ten algorytm wiele razy?

Hints: #489, #536

## Wyjaśnienie Problemu / Problem Explanation

Mamy tekst (książkę) i musimy znaleźć ile razy dane słowo występuje w tym tekście. Problem ma dwa aspekty:

1. **Pojedyncze zapytanie**: Znajdź częstość jednego słowa
2. **Wiele zapytań**: Optymalizuj dla wielu zapytań o różne słowa

We have text (a book) and need to find how many times a given word appears in that text. The problem has two aspects:

1. **Single query**: Find frequency of one word
2. **Multiple queries**: Optimize for many queries about different words

### Kluczowe Pytania / Key Questions:
- Czy wielkość liter ma znaczenie? / Is case sensitive?
- Jak traktować znaki interpunkcyjne? / How to handle punctuation?
- Co to jest "słowo"? / What is a "word"?
- Ile zapytań będziemy wykonywać? / How many queries will we perform?

## Rozwiązania / Solutions

### Podejście 1: Proste Zliczanie (Pojedyncze Zapytanie)
### Approach 1: Simple Counting (Single Query)

**Idea**: Przejdź przez cały tekst i zlicz wystąpienia słowa.

**Idea**: Iterate through entire text and count word occurrences.

```javascript
function getFrequency(book, word) {
  // Normalizuj słowo do małych liter
  word = word.toLowerCase();

  // Podziel tekst na słowa i zlicz
  const words = book.toLowerCase().split(/\s+/);
  let count = 0;

  for (let w of words) {
    // Usuń znaki interpunkcyjne
    w = w.replace(/[.,!?;:]/g, '');
    if (w === word) {
      count++;
    }
  }

  return count;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n) gdzie n to liczba słów / where n is number of words
- Pamięciowa / Space: O(n) dla tablicy słów / for words array

**Zalety / Advantages**:
- Proste / Simple
- Nie wymaga preprocessingu / No preprocessing needed
- Małe zużycie pamięci jeśli mało zapytań / Low memory if few queries

**Wady / Disadvantages**:
- Nieefektywne dla wielu zapytań / Inefficient for multiple queries
- Każde zapytanie wymaga O(n) czasu / Each query requires O(n) time

### Podejście 2: Hash Map (Wiele Zapytań)
### Approach 2: Hash Map (Multiple Queries)

**Idea**: Zbuduj hash mapę raz, potem odpowiadaj na zapytania w O(1).

**Idea**: Build hash map once, then answer queries in O(1).

```javascript
class WordFrequencyCounter {
  constructor(book) {
    this.frequencyMap = new Map();
    this.buildFrequencyMap(book);
  }

  buildFrequencyMap(book) {
    // Podziel na słowa i zlicz każde
    const words = book.toLowerCase().split(/\s+/);

    for (let word of words) {
      // Usuń znaki interpunkcyjne
      word = word.replace(/[.,!?;:]/g, '');

      if (word) {
        this.frequencyMap.set(
          word,
          (this.frequencyMap.get(word) || 0) + 1
        );
      }
    }
  }

  getFrequency(word) {
    word = word.toLowerCase().replace(/[.,!?;:]/g, '');
    return this.frequencyMap.get(word) || 0;
  }
}
```

**Złożoność / Complexity**:
- Preprocessing: O(n) czasu, O(k) pamięci gdzie k = unikalne słowa
- Każde zapytanie: O(1) czasu
- Space: O(k) gdzie k to liczba unikalnych słów / where k is number of unique words

**Zalety / Advantages**:
- O(1) zapytania / O(1) queries
- Idealne dla wielu zapytań / Perfect for multiple queries
- Można dodać więcej metod (top N słów, itp.) / Can add more methods

**Wady / Disadvantages**:
- Wymaga O(k) pamięci / Requires O(k) memory
- Preprocessing może być kosztowny / Preprocessing can be expensive

### Podejście 3: Trie (Dla Prefiksów i Auto-complete)
### Approach 3: Trie (For Prefixes and Auto-complete)

**Idea**: Jeśli potrzebujemy także wyszukiwać słowa po prefiksie.

**Idea**: If we also need to search words by prefix.

```javascript
class TrieNode {
  constructor() {
    this.children = new Map();
    this.count = 0;
    this.isEndOfWord = false;
  }
}

class WordFrequencyTrie {
  constructor(book) {
    this.root = new TrieNode();
    this.buildTrie(book);
  }

  buildTrie(book) {
    const words = book.toLowerCase().split(/\s+/);

    for (let word of words) {
      word = word.replace(/[.,!?;:]/g, '');
      if (word) {
        this.insert(word);
      }
    }
  }

  insert(word) {
    let node = this.root;

    for (let char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }

    node.isEndOfWord = true;
    node.count++;
  }

  getFrequency(word) {
    word = word.toLowerCase().replace(/[.,!?;:]/g, '');
    let node = this.root;

    for (let char of word) {
      if (!node.children.has(char)) {
        return 0;
      }
      node = node.children.get(char);
    }

    return node.isEndOfWord ? node.count : 0;
  }

  // Bonus: Znajdź wszystkie słowa z danym prefiksem
  findWordsWithPrefix(prefix) {
    prefix = prefix.toLowerCase();
    let node = this.root;

    // Nawiguj do końca prefiksu
    for (let char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }

    // Zbierz wszystkie słowa z tego węzła
    return this.collectWords(node, prefix);
  }

  collectWords(node, prefix, words = []) {
    if (node.isEndOfWord) {
      words.push({ word: prefix, count: node.count });
    }

    for (let [char, childNode] of node.children) {
      this.collectWords(childNode, prefix + char, words);
    }

    return words;
  }
}
```

**Złożoność / Complexity**:
- Preprocessing: O(n * m) gdzie m = średnia długość słowa
- Zapytanie: O(m) gdzie m = długość słowa
- Space: O(ALPHABET_SIZE * N * M) w najgorszym przypadku

## Porównanie Podejść / Approach Comparison

| Aspekt | Proste | Hash Map | Trie |
|--------|---------|----------|------|
| Preprocessing | Brak | O(n) | O(n*m) |
| Zapytanie | O(n) | O(1) | O(m) |
| Pamięć | O(1) | O(k) | O(k*m) |
| Wielokrotne zapytania | Wolne | Szybkie | Szybkie |
| Wyszukiwanie prefiksu | Nie | Nie | Tak |

## Kiedy Użyć Którego Podejścia? / When to Use Which?

1. **Proste zliczanie**:
   - Jedno lub mało zapytań
   - Ograniczona pamięć
   - Prosty kod

2. **Hash Map**:
   - Wiele zapytań
   - Szybkie wyszukiwanie dokładnych słów
   - Balans między pamięcią a wydajnością

3. **Trie**:
   - Potrzeba wyszukiwania po prefiksie
   - Auto-complete
   - Duży słownik z wieloma podobnymi słowami
