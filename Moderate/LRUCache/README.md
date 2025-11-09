# 16.25 LRU Cache

## Opis Zadania / Problem Description

**LRU Cache**: Design and build a "least recently used" cache, which evicts the least recently used item. The cache should map from keys to values (allowing you to insert and retrieve a value associated with a particular key) and be initialized with a max size. When it is full, it should evict the least recently used item.

**Cache LRU**: Zaprojektuj i zbuduj cache "najmniej ostatnio używany" (Least Recently Used), który usuwa najmniej ostatnio używany element. Cache powinien mapować klucze na wartości (umożliwiając wstawienie i odczytanie wartości powiązanej z kluczem) i być inicjalizowany z maksymalnym rozmiarem. Gdy jest pełny, powinien usunąć najmniej ostatnio używany element.

Hints: #524, #630, #694

## Wyjaśnienie Problemu / Problem Explanation

LRU Cache to struktura danych często używana w systemach do przechowywania najczęściej/ostatnio używanych danych w szybkiej pamięci.

LRU Cache is a data structure commonly used in systems to store most frequently/recently used data in fast memory.

**Wymagania / Requirements**:
1. **get(key)**: Zwróć wartość dla klucza, lub null jeśli nie istnieje. Oznacz element jako ostatnio użyty.
2. **put(key, value)**: Wstaw lub zaktualizuj wartość. Jeśli cache jest pełny, usuń najmniej ostatnio używany element.
3. **Obie operacje w O(1)** czasie!

**Przykład / Example**:
```javascript
cache = new LRUCache(3);  // max size = 3

cache.put('a', 1);  // cache: {a:1}
cache.put('b', 2);  // cache: {a:1, b:2}
cache.put('c', 3);  // cache: {a:1, b:2, c:3}
cache.get('a');     // returns 1, cache: {b:2, c:3, a:1} (a moved to most recent)
cache.put('d', 4);  // cache: {c:3, a:1, d:4} (b evicted as LRU)
cache.get('b');     // returns null (b was evicted)
cache.get('c');     // returns 3, cache: {a:1, d:4, c:3}
cache.put('e', 5);  // cache: {d:4, c:3, e:5} (a evicted as LRU)
```

## Rozwiązania / Solutions

### Podejście 1: Array - O(n) operacje

**Idea**: Użyj tablicy, przenieś używane elementy na koniec.

**Idea**: Use array, move used items to end.

```javascript
class LRUCacheArray {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.items = []; // [{key, value}]
  }

  get(key) {
    const index = this.items.findIndex(item => item.key === key);
    if (index === -1) return null;

    // Przenieś na koniec (most recently used)
    const item = this.items.splice(index, 1)[0];
    this.items.push(item);
    return item.value;
  }

  put(key, value) {
    const index = this.items.findIndex(item => item.key === key);

    // Jeśli istnieje, usuń starą wersję
    if (index !== -1) {
      this.items.splice(index, 1);
    }

    // Dodaj na koniec
    this.items.push({ key, value });

    // Jeśli przekroczono rozmiar, usuń pierwszy (LRU)
    if (this.items.length > this.maxSize) {
      this.items.shift();
    }
  }
}
```

**Złożoność / Complexity**:
- get: O(n) - findIndex
- put: O(n) - findIndex, shift

**Wady / Disadvantages**: Za wolne dla dużych cache'ów

### Podejście 2: Map + Array - O(n) dla get

**Idea**: Użyj Map do O(1) lookup, array do śledzenia kolejności.

**Idea**: Use Map for O(1) lookup, array for tracking order.

```javascript
class LRUCacheMapArray {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.map = new Map();
    this.keys = []; // Kolejność użycia
  }

  get(key) {
    if (!this.map.has(key)) return null;

    // Przenieś klucz na koniec
    const index = this.keys.indexOf(key);
    this.keys.splice(index, 1);
    this.keys.push(key);

    return this.map.get(key);
  }

  put(key, value) {
    if (this.map.has(key)) {
      // Usuń starą pozycję w keys
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
    } else if (this.keys.length >= this.maxSize) {
      // Usuń LRU
      const lruKey = this.keys.shift();
      this.map.delete(lruKey);
    }

    this.map.set(key, value);
    this.keys.push(key);
  }
}
```

**Złożoność / Complexity**:
- get: O(n) - indexOf, splice
- put: O(n) - indexOf, splice

**Wady / Disadvantages**: Nadal O(n) przez operacje na tablicy

### Podejście 3: Map + Doubly Linked List - O(1) ✓ OPTYMALNE

**Idea**: Użyj Map do O(1) lookup i Doubly Linked List do O(1) reorder.

**Idea**: Use Map for O(1) lookup and Doubly Linked List for O(1) reorder.

**Kluczowa obserwacja**:
- Map daje O(1) dostęp do wartości
- Doubly Linked List daje O(1) przenoszenie elementów
- Połączenie daje O(1) dla obu operacji!

```javascript
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.map = new Map(); // key -> Node
    this.head = new Node(null, null); // Dummy head (most recent)
    this.tail = new Node(null, null); // Dummy tail (least recent)
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Przenieś node na początek (most recently used)
  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  // Dodaj node zaraz po head
  addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  // Usuń node z listy
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // Usuń node przed tail (LRU)
  removeTail() {
    const node = this.tail.prev;
    this.removeNode(node);
    return node;
  }

  get(key) {
    if (!this.map.has(key)) return null;

    const node = this.map.get(key);
    this.moveToHead(node); // Oznacz jako ostatnio użyty
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      // Aktualizuj istniejący
      const node = this.map.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      // Dodaj nowy
      const node = new Node(key, value);

      // Usuń LRU jeśli pełny
      if (this.map.size >= this.maxSize) {
        const lruNode = this.removeTail();
        this.map.delete(lruNode.key);
      }

      this.addToHead(node);
      this.map.set(key, node);
    }
  }
}
```

**Złożoność / Complexity**:
- get: O(1) - Map lookup + list reorder
- put: O(1) - Map set + list add/remove
- Pamięć / Space: O(maxSize)

**Zalety / Advantages**:
- Obie operacje O(1)
- Wydajne dla dużych cache'ów
- Standardowe rozwiązanie w przemyśle

### Podejście 4: Używając JavaScript Map (zachowuje kolejność wstawienia)

**Idea**: JavaScript Map zachowuje kolejność wstawienia elementów (od ES6).

**Idea**: JavaScript Map preserves insertion order of elements (since ES6).

```javascript
class LRUCacheSimple {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Odczytaj wartość
    const value = this.cache.get(key);

    // Usuń i wstaw ponownie (przenieś na koniec)
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // Jeśli istnieje, usuń (by przenieść na koniec)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Wstaw na koniec
    this.cache.set(key, value);

    // Usuń pierwszy (LRU) jeśli przekroczono rozmiar
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

**Złożoność / Complexity**:
- get: O(1) amortyzowany (delete + set)
- put: O(1) amortyzowany
- Prostsze niż Doubly Linked List!

**Zalety / Advantages**:
- Bardzo prosty kod
- Wykorzystuje wbudowaną funkcjonalność Map
- Czytelny i łatwy w utrzymaniu

**Uwaga / Note**: To działa tylko w JavaScript/TypeScript z ES6 Map. W innych językach potrzebujesz Doubly Linked List.

## Szczególne Przypadki / Edge Cases

1. **Rozmiar 0 lub 1**: `new LRUCache(0)`, `new LRUCache(1)`
2. **Aktualizacja istniejącego klucza**: Powinno zaktualizować wartość i przenieść na początek
3. **Wielokrotne get tego samego klucza**: Powinno pozostać na początku
4. **Pusta cache przy get**: Zwróć null
5. **Put po eviction**: Upewnij się, że evicted key nie istnieje w cache

## Przykłady Krok po Kroku / Step-by-Step Examples

### Przykład: Operacje na cache z maxSize=3

```
Initial: cache = {} (empty)

put('a', 1):
  cache = {a:1}
  order: [a] (a is MRU)

put('b', 2):
  cache = {a:1, b:2}
  order: [a, b] (b is MRU)

put('c', 3):
  cache = {a:1, b:2, c:3}
  order: [a, b, c] (c is MRU)

get('a') → 1:
  cache = {a:1, b:2, c:3}
  order: [b, c, a] (a moved to MRU)

put('d', 4):
  cache is full, evict LRU (b)
  cache = {a:1, c:3, d:4}
  order: [c, a, d] (d is MRU)

get('c') → 3:
  cache = {a:1, c:3, d:4}
  order: [a, d, c] (c moved to MRU)

put('a', 10):
  update existing key a
  cache = {a:10, c:3, d:4}
  order: [d, c, a] (a moved to MRU)
```

## Porównanie Podejść / Approach Comparison

| Podejście | get | put | Pamięć | Złożoność implementacji |
|-----------|-----|-----|--------|------------------------|
| Array | O(n) | O(n) | O(n) | Prosta |
| Map + Array | O(n) | O(n) | O(n) | Średnia |
| Map + DLL | O(1) | O(1) | O(n) | Złożona |
| Map (ES6) | O(1) | O(1) | O(n) | Bardzo prosta |

## Które Rozwiązanie Wybrać? / Which Solution to Choose?

- **Map (ES6) - Podejście 4**: Najlepsze w JavaScript! Proste i efektywne
- **Map + DLL - Podejście 3**: Gdy potrzebujesz uniwersalnego rozwiązania dla każdego języka
- **Array - Podejście 1**: Tylko dla bardzo małych cache'ów lub prototypów

## Zastosowania w Praktyce / Real-World Applications

1. **Przeglądarki**: Cache stron internetowych
2. **Bazy danych**: Buffer pool dla często używanych stron
3. **Systemy operacyjne**: Page replacement w pamięci wirtualnej
4. **CDN**: Cache często odwiedzanych zasobów
5. **CPU**: Cache linii procesora (L1, L2, L3)

## Rozszerzenia / Extensions

### LFU Cache (Least Frequently Used)

```javascript
// Zamiast śledzić "ostatnio używany", śledź "częstotliwość użycia"
// Instead of tracking "recently used", track "frequency of use"
```

### TTL Cache (Time To Live)

```javascript
// Dodaj timestamp i automatycznie usuwaj wygasłe elementy
// Add timestamp and automatically remove expired items
```

### Weighted LRU

```javascript
// Różne elementy mają różne "wagi" przy ewiction
// Different items have different "weights" for eviction
```

## Wnioski / Conclusions

LRU Cache to klasyczny problem pokazujący:
1. **Optymalizację przez struktury danych**: Map + Doubly Linked List dają O(1)
2. **Trade-offs**: Prostota vs wydajność
3. **Praktyczne zastosowanie**: Używane w każdym dużym systemie

LRU Cache is a classic problem showing:
1. **Optimization through data structures**: Map + Doubly Linked List give O(1)
2. **Trade-offs**: Simplicity vs performance
3. **Practical application**: Used in every large system
