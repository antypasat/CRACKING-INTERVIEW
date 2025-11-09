/**
 * LRU Cache - Least Recently Used Cache
 * Cache LRU - Cache Najmniej Ostatnio Używany
 */

/**
 * Node dla Doubly Linked List
 * Node for Doubly Linked List
 */
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * Podejście 1: Array - O(n) operacje
 * Approach 1: Array - O(n) operations
 *
 * Proste ale nieefektywne
 * Simple but inefficient
 */
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

  toString() {
    return `[${this.items.map(item => `${item.key}:${item.value}`).join(', ')}]`;
  }
}

/**
 * Podejście 2: Map + Doubly Linked List - O(1) ✓ OPTYMALNE (uniwersalne)
 * Approach 2: Map + Doubly Linked List - O(1) ✓ OPTIMAL (universal)
 *
 * Standardowe rozwiązanie dla języków bez uporządkowanej Map
 * Standard solution for languages without ordered Map
 */
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

  // Pomocnicze metody do debugowania
  size() {
    return this.map.size;
  }

  toString() {
    const items = [];
    let current = this.head.next;
    while (current !== this.tail) {
      items.push(`${current.key}:${current.value}`);
      current = current.next;
    }
    return `[${items.join(', ')}]`;
  }

  getKeys() {
    const keys = [];
    let current = this.head.next;
    while (current !== this.tail) {
      keys.push(current.key);
      current = current.next;
    }
    return keys;
  }
}

/**
 * Podejście 3: Używając JavaScript Map (ES6+) - O(1) ✓ NAJPROSTSZE
 * Approach 3: Using JavaScript Map (ES6+) - O(1) ✓ SIMPLEST
 *
 * Map w JS zachowuje kolejność wstawienia
 * Map in JS preserves insertion order
 */
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

  size() {
    return this.cache.size;
  }

  toString() {
    const items = Array.from(this.cache.entries()).map(([k, v]) => `${k}:${v}`);
    return `[${items.join(', ')}]`;
  }

  getKeys() {
    return Array.from(this.cache.keys());
  }
}

/**
 * Funkcja pomocnicza: Test sekwencji operacji
 * Helper function: Test operation sequence
 */
function testSequence(CacheClass, operations, maxSize = 3) {
  console.log(`\nTestowanie ${CacheClass.name}:`);
  const cache = new CacheClass(maxSize);

  operations.forEach(([op, key, value], idx) => {
    if (op === 'put') {
      cache.put(key, value);
      console.log(`  ${idx + 1}. put('${key}', ${value}) → ${cache.toString()}`);
    } else if (op === 'get') {
      const result = cache.get(key);
      console.log(`  ${idx + 1}. get('${key}') → ${result} → ${cache.toString()}`);
    }
  });
}

/**
 * Funkcja pomocnicza: Test wydajności
 * Helper function: Performance test
 */
function performanceTest(CacheClass, size, operations) {
  const cache = new CacheClass(size);
  const start = Date.now();

  for (let i = 0; i < operations; i++) {
    const key = `key${Math.floor(Math.random() * (size * 2))}`;
    const value = Math.floor(Math.random() * 1000);

    if (Math.random() < 0.5) {
      cache.put(key, value);
    } else {
      cache.get(key);
    }
  }

  const time = Date.now() - start;
  return time;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== LRU Cache - Least Recently Used Cache ===\n');

// Test 1: Podstawowe operacje
console.log('Test 1: Podstawowe operacje (przykład z zadania)');
const operations1 = [
  ['put', 'a', 1],
  ['put', 'b', 2],
  ['put', 'c', 3],
  ['get', 'a'],
  ['put', 'd', 4],
  ['get', 'b'],
  ['get', 'c'],
  ['put', 'e', 5]
];

testSequence(LRUCache, operations1, 3);

// Test 2: Porównanie implementacji
console.log('\n\nTest 2: Porównanie wszystkich implementacji');
console.log('Sekwencja operacji:');
operations1.forEach(([op, key, value], idx) => {
  if (op === 'put') {
    console.log(`  ${idx + 1}. put('${key}', ${value})`);
  } else {
    console.log(`  ${idx + 1}. get('${key}')`);
  }
});

testSequence(LRUCache, operations1, 3);
testSequence(LRUCacheSimple, operations1, 3);
testSequence(LRUCacheArray, operations1, 3);

// Test 3: Edge case - maxSize = 1
console.log('\n\nTest 3: Edge case - maxSize = 1');
const operations3 = [
  ['put', 'a', 1],
  ['put', 'b', 2],
  ['get', 'a'],
  ['get', 'b'],
  ['put', 'c', 3],
  ['get', 'b'],
  ['get', 'c']
];

testSequence(LRUCacheSimple, operations3, 1);

// Test 4: Aktualizacja istniejącego klucza
console.log('\n\nTest 4: Aktualizacja istniejącego klucza');
const operations4 = [
  ['put', 'a', 1],
  ['put', 'b', 2],
  ['put', 'c', 3],
  ['put', 'a', 10], // Aktualizuj a
  ['get', 'a'],
  ['put', 'd', 4], // b powinno być evicted
  ['get', 'b']
];

testSequence(LRUCacheSimple, operations4, 3);

// Test 5: Wielokrotne get tego samego klucza
console.log('\n\nTest 5: Wielokrotne get tego samego klucza');
const operations5 = [
  ['put', 'a', 1],
  ['put', 'b', 2],
  ['put', 'c', 3],
  ['get', 'a'],
  ['get', 'a'],
  ['get', 'a'],
  ['put', 'd', 4], // b powinno być evicted (a było używane wielokrotnie)
  ['get', 'a'],
  ['get', 'b']
];

testSequence(LRUCacheSimple, operations5, 3);

// Test 6: Pusta cache przy get
console.log('\n\nTest 6: Pusta cache przy get');
const cache6 = new LRUCacheSimple(3);
console.log(`get('x') z pustej cache: ${cache6.get('x')}`);
console.log(`Cache: ${cache6.toString()}\n`);

// Test 7: maxSize = 0
console.log('Test 7: Edge case - maxSize = 0');
const cache7 = new LRUCacheSimple(0);
cache7.put('a', 1);
console.log(`put('a', 1) z maxSize=0`);
console.log(`Cache size: ${cache7.size()}`);
console.log(`get('a'): ${cache7.get('a')}\n`);

// Test 8: Sekwencja put-get-put-get
console.log('Test 8: Sekwencja put-get-put-get (pattern)');
const operations8 = [
  ['put', '1', 1],
  ['get', '1'],
  ['put', '2', 2],
  ['get', '1'],
  ['put', '3', 3],
  ['get', '2'],
  ['put', '4', 4],
  ['get', '1'],
  ['get', '3'],
  ['get', '4']
];

testSequence(LRUCacheSimple, operations8, 2);

// Test 9: Test poprawności - weryfikacja LRU
console.log('\n\nTest 9: Weryfikacja poprawności LRU');
const cache9 = new LRUCacheSimple(3);

cache9.put('a', 1);
cache9.put('b', 2);
cache9.put('c', 3);
console.log('Po put a,b,c:', cache9.getKeys());

cache9.get('a'); // a staje się MRU
console.log('Po get(a):', cache9.getKeys());

cache9.put('d', 4); // b powinno być evicted
console.log('Po put(d):', cache9.getKeys());

const testB = cache9.get('b');
const testA = cache9.get('a');
console.log(`get('b') = ${testB} (oczekiwane: null)`);
console.log(`get('a') = ${testA} (oczekiwane: 1)`);
console.log(`Test ${testB === null && testA === 1 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 10: Test wydajności
console.log('Test 10: Test wydajności (100,000 operacji)');

const sizes = [10, 100, 1000];
const ops = 100000;

console.log('\nCache Size | Array | DLL+Map | Simple Map');
console.log('-----------|-------|---------|------------');

sizes.forEach(size => {
  const timeArray = performanceTest(LRUCacheArray, size, Math.min(ops, 10000));
  const timeDLL = performanceTest(LRUCache, size, ops);
  const timeSimple = performanceTest(LRUCacheSimple, size, ops);

  console.log(`${size.toString().padStart(10)} | ${timeArray.toString().padStart(5)}ms | ${timeDLL.toString().padStart(7)}ms | ${timeSimple.toString().padStart(10)}ms`);
});
console.log();

// Test 11: Duży rozmiar cache
console.log('Test 11: Duży rozmiar cache (1000 elementów)');
const cache11 = new LRUCacheSimple(1000);

// Wypełnij cache
for (let i = 0; i < 1000; i++) {
  cache11.put(`key${i}`, i);
}
console.log(`Cache size po wypełnieniu: ${cache11.size()}`);

// Dostęp do pierwszego elementu
cache11.get('key0');

// Dodaj nowy element
cache11.put('new', 9999);

// Sprawdź co zostało usunięte
const test0 = cache11.get('key0');
const test1 = cache11.get('key1');
const testNew = cache11.get('new');

console.log(`get('key0') = ${test0} (powinno być 0, bo było get)`);
console.log(`get('key1') = ${test1} (powinno być null, evicted jako LRU)`);
console.log(`get('new') = ${testNew} (powinno być 9999)`);
console.log(`Test ${test0 === 0 && test1 === null && testNew === 9999 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 12: Stringowe i numeryczne klucze
console.log('Test 12: Różne typy kluczy');
const cache12 = new LRUCacheSimple(3);

cache12.put(1, 'one');
cache12.put('2', 'two');
cache12.put(3, 'three');

console.log(`get(1) = ${cache12.get(1)}`);
console.log(`get('2') = ${cache12.get('2')}`);
console.log(`get(3) = ${cache12.get(3)}`);
console.log(`Cache: ${cache12.toString()}\n`);

// Test 13: Weryfikacja kolejności po wielu operacjach
console.log('Test 13: Weryfikacja kolejności (MRU na końcu)');
const cache13 = new LRUCacheSimple(5);

cache13.put('a', 1);
cache13.put('b', 2);
cache13.put('c', 3);
cache13.put('d', 4);
cache13.put('e', 5);

console.log('Po put a-e:', cache13.getKeys());

cache13.get('a');
console.log('Po get(a):', cache13.getKeys());

cache13.get('c');
console.log('Po get(c):', cache13.getKeys());

cache13.put('f', 6);
console.log('Po put(f) - b evicted:', cache13.getKeys());

const expectedOrder = ['d', 'e', 'a', 'c', 'f'];
const actualOrder = cache13.getKeys();
const orderMatch = JSON.stringify(expectedOrder) === JSON.stringify(actualOrder);

console.log(`Oczekiwana kolejność: [${expectedOrder}]`);
console.log(`Rzeczywista kolejność: [${actualOrder}]`);
console.log(`Test ${orderMatch ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 14: Stress test - wiele operacji
console.log('Test 14: Stress test (10,000 losowych operacji)');
const cache14 = new LRUCacheSimple(50);
let getCount = 0;
let putCount = 0;
let hitCount = 0;

for (let i = 0; i < 10000; i++) {
  const key = `k${Math.floor(Math.random() * 100)}`;
  const value = Math.floor(Math.random() * 1000);

  if (Math.random() < 0.5) {
    cache14.put(key, value);
    putCount++;
  } else {
    const result = cache14.get(key);
    getCount++;
    if (result !== null) hitCount++;
  }
}

console.log(`Put operacji: ${putCount}`);
console.log(`Get operacji: ${getCount}`);
console.log(`Cache hits: ${hitCount} (${(hitCount / getCount * 100).toFixed(2)}%)`);
console.log(`Final cache size: ${cache14.size()}`);
console.log(`Test ${cache14.size() <= 50 ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 15: Porównanie poprawności wszystkich implementacji
console.log('Test 15: Weryfikacja zgodności wszystkich implementacji');
const testOps = [
  ['put', 'a', 1],
  ['put', 'b', 2],
  ['put', 'c', 3],
  ['get', 'a'],
  ['put', 'd', 4],
  ['get', 'b'],
  ['put', 'e', 5],
  ['get', 'c']
];

const cache15a = new LRUCache(3);
const cache15b = new LRUCacheSimple(3);
const cache15c = new LRUCacheArray(3);

const results = { DLL: [], Simple: [], Array: [] };

testOps.forEach(([op, key, value]) => {
  if (op === 'put') {
    cache15a.put(key, value);
    cache15b.put(key, value);
    cache15c.put(key, value);
  } else {
    results.DLL.push(cache15a.get(key));
    results.Simple.push(cache15b.get(key));
    results.Array.push(cache15c.get(key));
  }
});

console.log('Wyniki get() dla wszystkich implementacji:');
console.log(`DLL:    ${results.DLL}`);
console.log(`Simple: ${results.Simple}`);
console.log(`Array:  ${results.Array}`);

const allMatch = JSON.stringify(results.DLL) === JSON.stringify(results.Simple) &&
                 JSON.stringify(results.Simple) === JSON.stringify(results.Array);

console.log(`\nWszystkie zgodne: ${allMatch ? 'PASS ✓' : 'FAIL ✗'}\n`);

console.log('=== Podsumowanie / Summary ===');
console.log('LRU Cache - Least Recently Used Cache');
console.log('\nZłożoność (optymalne rozwiązania):');
console.log('  get():  O(1) - Map lookup + list reorder lub Map delete+set');
console.log('  put():  O(1) - Map set + list add/remove lub Map delete+set');
console.log('  Pamięć: O(maxSize) - Map + Doubly Linked List lub tylko Map');
console.log('\nImplementacje:');
console.log('  1. Map + Doubly Linked List: Uniwersalne, działa w każdym języku');
console.log('  2. ES6 Map: Najprostsze w JavaScript, wykorzystuje ordered Map');
console.log('  3. Array: Tylko dla małych cache\'ów, O(n) operacje');
console.log('\nZastosowania:');
console.log('  - Cache stron w przeglądarkach');
console.log('  - Buffer pool w bazach danych');
console.log('  - Page replacement w systemach operacyjnych');
console.log('  - CDN caching');
console.log('  - CPU cache replacement policy');
