// 7.12 HashTable - Hash table implementation with chaining
// 7.12 Tablica Haszująca - Implementacja tablicy haszującej z łańcuchowaniem

// Node for linked list in chaining / Węzeł dla listy w łańcuchowaniu
class HashNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

// Linked list for chaining / Lista wiązana dla łańcuchowania
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Insert or update key-value pair
  put(key, value) {
    // Search for existing key
    let current = this.head;
    while (current) {
      if (current.key === key) {
        // Update existing value
        const oldValue = current.value;
        current.value = value;
        return { updated: true, oldValue };
      }
      current = current.next;
    }

    // Key not found, insert new node at head
    const newNode = new HashNode(key, value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
    return { updated: false };
  }

  // Get value by key
  get(key) {
    let current = this.head;
    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }
    return undefined;
  }

  // Check if key exists
  has(key) {
    let current = this.head;
    while (current) {
      if (current.key === key) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  // Remove key-value pair
  remove(key) {
    if (!this.head) {
      return { found: false };
    }

    // Check head
    if (this.head.key === key) {
      const value = this.head.value;
      this.head = this.head.next;
      this.size--;
      return { found: true, value };
    }

    // Check rest of list
    let current = this.head;
    while (current.next) {
      if (current.next.key === key) {
        const value = current.next.value;
        current.next = current.next.next;
        this.size--;
        return { found: true, value };
      }
      current = current.next;
    }

    return { found: false };
  }

  // Get all key-value pairs
  getAll() {
    const pairs = [];
    let current = this.head;
    while (current) {
      pairs.push({ key: current.key, value: current.value });
      current = current.next;
    }
    return pairs;
  }

  // Get size
  getSize() {
    return this.size;
  }

  // Clear all nodes
  clear() {
    this.head = null;
    this.size = 0;
  }
}

// HashTable implementation with chaining / Implementacja tablicy haszującej z łańcuchowaniem
class HashTable {
  constructor(initialCapacity = 16) {
    this.capacity = initialCapacity;
    this.buckets = new Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = new LinkedList();
    }
    this.size = 0;
    this.loadFactorThreshold = 0.75;
    this.collisions = 0;
    this.totalProbes = 0;
    this.resizeCount = 0;
  }

  // Hash function / Funkcja haszująca
  hash(key) {
    // Convert key to string if not already
    const keyStr = String(key);
    let hash = 0;

    // Simple hash function: sum of character codes with prime multiplier
    for (let i = 0; i < keyStr.length; i++) {
      hash = (hash * 31 + keyStr.charCodeAt(i)) & 0x7FFFFFFF; // Keep positive
    }

    return hash;
  }

  // Get bucket index / Pobierz indeks bucketu
  getBucketIndex(key) {
    return this.hash(key) % this.capacity;
  }

  // Calculate current load factor
  getLoadFactor() {
    return this.size / this.capacity;
  }

  // Put key-value pair / Dodaj parę klucz-wartość
  put(key, value) {
    // Check if resize needed before insertion
    if (this.getLoadFactor() >= this.loadFactorThreshold) {
      this.resize();
    }

    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];

    // Track collision if bucket already has entries
    if (bucket.getSize() > 0) {
      this.collisions++;
    }

    const result = bucket.put(key, value);

    if (!result.updated) {
      // New key added
      this.size++;
    }

    return result.updated ? result.oldValue : undefined;
  }

  // Get value by key / Pobierz wartość po kluczu
  get(key) {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];
    this.totalProbes++;
    return bucket.get(key);
  }

  // Check if key exists
  has(key) {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];
    return bucket.has(key);
  }

  // Remove key-value pair / Usuń parę klucz-wartość
  remove(key) {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];
    const result = bucket.remove(key);

    if (result.found) {
      this.size--;
      return result.value;
    }

    return undefined;
  }

  // Resize hash table (double capacity) / Zmień rozmiar tablicy (podwój pojemność)
  resize() {
    const oldBuckets = this.buckets;
    const oldCapacity = this.capacity;

    // Double capacity
    this.capacity *= 2;
    this.buckets = new Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = new LinkedList();
    }

    // Reset size and stats (will be recalculated)
    this.size = 0;
    const oldCollisions = this.collisions;
    this.collisions = 0;
    this.resizeCount++;

    // Rehash all entries
    for (let bucket of oldBuckets) {
      const pairs = bucket.getAll();
      for (let pair of pairs) {
        this.put(pair.key, pair.value);
      }
    }

    console.log(`  [RESIZE] ${oldCapacity} → ${this.capacity} (collisions: ${oldCollisions} → ${this.collisions})`);
  }

  // Get all keys
  keys() {
    const keys = [];
    for (let bucket of this.buckets) {
      const pairs = bucket.getAll();
      for (let pair of pairs) {
        keys.push(pair.key);
      }
    }
    return keys;
  }

  // Get all values
  values() {
    const values = [];
    for (let bucket of this.buckets) {
      const pairs = bucket.getAll();
      for (let pair of pairs) {
        values.push(pair.value);
      }
    }
    return values;
  }

  // Get all key-value pairs
  entries() {
    const entries = [];
    for (let bucket of this.buckets) {
      const pairs = bucket.getAll();
      for (let pair of pairs) {
        entries.push([pair.key, pair.value]);
      }
    }
    return entries;
  }

  // Clear all entries
  clear() {
    for (let bucket of this.buckets) {
      bucket.clear();
    }
    this.size = 0;
    this.collisions = 0;
    this.totalProbes = 0;
  }

  // Get collision statistics / Pobierz statystyki kolizji
  getCollisionStats() {
    const bucketSizes = [];
    let maxChainLength = 0;
    let usedBuckets = 0;
    let emptyBuckets = 0;

    for (let bucket of this.buckets) {
      const size = bucket.getSize();
      bucketSizes.push(size);

      if (size > 0) {
        usedBuckets++;
        maxChainLength = Math.max(maxChainLength, size);
      } else {
        emptyBuckets++;
      }
    }

    // Calculate average chain length (only non-empty buckets)
    const totalChainLength = bucketSizes.reduce((sum, size) => sum + size, 0);
    const avgChainLength = usedBuckets > 0 ? totalChainLength / usedBuckets : 0;

    return {
      totalCollisions: this.collisions,
      maxChainLength,
      avgChainLength: avgChainLength.toFixed(2),
      usedBuckets,
      emptyBuckets,
      bucketDistribution: bucketSizes
    };
  }

  // Get statistics / Pobierz statystyki
  getStats() {
    const collisionStats = this.getCollisionStats();

    return {
      size: this.size,
      capacity: this.capacity,
      loadFactor: this.getLoadFactor().toFixed(3),
      resizeCount: this.resizeCount,
      totalCollisions: collisionStats.totalCollisions,
      maxChainLength: collisionStats.maxChainLength,
      avgChainLength: collisionStats.avgChainLength,
      usedBuckets: collisionStats.usedBuckets,
      emptyBuckets: collisionStats.emptyBuckets
    };
  }

  // Display bucket distribution
  displayDistribution() {
    console.log('\nBucket Distribution:');
    const stats = this.getCollisionStats();
    const bucketSizes = stats.bucketDistribution;

    // Group by size
    const sizeGroups = {};
    for (let size of bucketSizes) {
      sizeGroups[size] = (sizeGroups[size] || 0) + 1;
    }

    // Display histogram
    const sortedSizes = Object.keys(sizeGroups).map(Number).sort((a, b) => a - b);
    for (let size of sortedSizes) {
      const count = sizeGroups[size];
      const percentage = ((count / this.capacity) * 100).toFixed(1);
      const bar = '█'.repeat(Math.min(count, 50));
      console.log(`  ${size} items: ${count.toString().padStart(4)} buckets (${percentage}%) ${bar}`);
    }
  }

  // Display hash table contents (for debugging)
  display(maxBuckets = 10) {
    console.log(`\nHashTable Contents (showing first ${maxBuckets} non-empty buckets):`);
    let shown = 0;

    for (let i = 0; i < this.buckets.length && shown < maxBuckets; i++) {
      const bucket = this.buckets[i];
      if (bucket.getSize() > 0) {
        const pairs = bucket.getAll();
        const items = pairs.map(p => `${p.key}:${p.value}`).join(' → ');
        console.log(`  Bucket ${i}: ${items}`);
        shown++;
      }
    }
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.12 HASHTABLE - HASH TABLE WITH CHAINING');
console.log('='.repeat(70));
console.log();

console.log('Test 1: Basic Put and Get Operations');
console.log('-'.repeat(70));
const ht = new HashTable(8);

ht.put('name', 'Alice');
ht.put('age', 30);
ht.put('city', 'New York');
ht.put('country', 'USA');

console.log(`name: ${ht.get('name')}`);
console.log(`age: ${ht.get('age')}`);
console.log(`city: ${ht.get('city')}`);
console.log(`country: ${ht.get('country')}`);
console.log(`missing: ${ht.get('missing')}`);
console.log();

console.log('Test 2: Update Existing Keys');
console.log('-'.repeat(70));
console.log(`Before: name = ${ht.get('name')}`);
const oldValue = ht.put('name', 'Bob');
console.log(`Old value returned: ${oldValue}`);
console.log(`After: name = ${ht.get('name')}`);
console.log();

console.log('Test 3: Has and Remove Operations');
console.log('-'.repeat(70));
console.log(`Has 'city': ${ht.has('city')}`);
console.log(`Has 'missing': ${ht.has('missing')}`);

const removedValue = ht.remove('city');
console.log(`Removed 'city': ${removedValue}`);
console.log(`Has 'city' after removal: ${ht.has('city')}`);
console.log(`Try to get 'city': ${ht.get('city')}`);
console.log();

console.log('Test 4: Keys, Values, Entries');
console.log('-'.repeat(70));
ht.put('email', 'alice@example.com');
console.log(`Keys: ${ht.keys().join(', ')}`);
console.log(`Values: ${ht.values().join(', ')}`);
console.log('Entries:');
ht.entries().forEach(([key, value]) => {
  console.log(`  ${key} => ${value}`);
});
console.log();

console.log('Test 5: Collision Handling');
console.log('-'.repeat(70));
const ht2 = new HashTable(4); // Small capacity to force collisions

// Add many entries to force collisions
const testData = [
  'apple', 'banana', 'cherry', 'date', 'elderberry',
  'fig', 'grape', 'honeydew', 'kiwi', 'lemon'
];

console.log('Adding 10 items to hash table with capacity 4...');
for (let fruit of testData) {
  ht2.put(fruit, fruit.toUpperCase());
}

console.log(`Size: ${ht2.size}`);
console.log(`Capacity: ${ht2.capacity}`);
console.log(`Load factor: ${ht2.getLoadFactor().toFixed(3)}`);
ht2.display(5);
console.log();

console.log('Test 6: Automatic Resizing');
console.log('-'.repeat(70));
const ht3 = new HashTable(4);
console.log(`Initial capacity: ${ht3.capacity}`);
console.log(`Load factor threshold: ${ht3.loadFactorThreshold}`);
console.log();

console.log('Adding items (resize triggers at load factor >= 0.75):');
for (let i = 1; i <= 20; i++) {
  ht3.put(`key${i}`, `value${i}`);
  if (i % 5 === 0) {
    const stats = ht3.getStats();
    console.log(`  After ${i} items: size=${stats.size}, capacity=${stats.capacity}, load=${stats.loadFactor}`);
  }
}
console.log();

console.log('Test 7: Collision Statistics');
console.log('-'.repeat(70));
const ht4 = new HashTable(16);

// Add 50 random items
for (let i = 1; i <= 50; i++) {
  ht4.put(`item${i}`, i * 10);
}

const stats = ht4.getStats();
console.log('Hash Table Statistics:');
console.log(`  Total entries: ${stats.size}`);
console.log(`  Capacity: ${stats.capacity}`);
console.log(`  Load factor: ${stats.loadFactor}`);
console.log(`  Resize count: ${stats.resizeCount}`);
console.log(`  Total collisions: ${stats.totalCollisions}`);
console.log(`  Max chain length: ${stats.maxChainLength}`);
console.log(`  Avg chain length: ${stats.avgChainLength}`);
console.log(`  Used buckets: ${stats.usedBuckets}`);
console.log(`  Empty buckets: ${stats.emptyBuckets}`);

ht4.displayDistribution();
console.log();

console.log('Test 8: Different Key Types');
console.log('-'.repeat(70));
const ht5 = new HashTable();

// String keys
ht5.put('string', 'String value');

// Number keys (converted to string)
ht5.put(42, 'Number key');
ht5.put(3.14, 'Float key');

// Boolean keys (converted to string)
ht5.put(true, 'Boolean true');
ht5.put(false, 'Boolean false');

console.log('Retrieved values:');
console.log(`  'string': ${ht5.get('string')}`);
console.log(`  42: ${ht5.get(42)}`);
console.log(`  3.14: ${ht5.get(3.14)}`);
console.log(`  true: ${ht5.get(true)}`);
console.log(`  false: ${ht5.get(false)}`);
console.log();

console.log('Test 9: Clear Operation');
console.log('-'.repeat(70));
console.log(`Size before clear: ${ht5.size}`);
console.log(`Keys before: ${ht5.keys().join(', ')}`);

ht5.clear();

console.log(`Size after clear: ${ht5.size}`);
console.log(`Keys after: ${ht5.keys().join(', ')}`);
console.log(`Get 'string' after clear: ${ht5.get('string')}`);
console.log();

console.log('Test 10: Hash Function Distribution');
console.log('-'.repeat(70));
const ht6 = new HashTable(32);

// Test with similar strings to see distribution
const similarStrings = [
  'abc', 'bac', 'cab', 'acb', 'bca', 'cba',
  'test', 'tset', 'sett', 'etts',
  'hello', 'world', 'hash', 'table'
];

console.log('Hash values for similar strings:');
for (let str of similarStrings) {
  const hash = ht6.hash(str);
  const index = ht6.getBucketIndex(str);
  console.log(`  '${str}' → hash: ${hash.toString().padStart(10)}, bucket: ${index.toString().padStart(2)}`);
  ht6.put(str, str.length);
}
console.log();

console.log('Test 11: Performance with Many Items');
console.log('-'.repeat(70));
const ht7 = new HashTable(16);
const itemCount = 1000;

console.log(`Inserting ${itemCount} items...`);
const startTime = Date.now();

for (let i = 0; i < itemCount; i++) {
  ht7.put(`key_${i}`, `value_${i}`);
}

const insertTime = Date.now() - startTime;

console.log(`Insert time: ${insertTime}ms`);
console.log();

// Test retrieval
const lookupStart = Date.now();
for (let i = 0; i < itemCount; i++) {
  ht7.get(`key_${i}`);
}
const lookupTime = Date.now() - lookupStart;

console.log(`Lookup ${itemCount} items: ${lookupTime}ms`);

const finalStats = ht7.getStats();
console.log('\nFinal Statistics:');
console.log(`  Size: ${finalStats.size}`);
console.log(`  Capacity: ${finalStats.capacity}`);
console.log(`  Load factor: ${finalStats.loadFactor}`);
console.log(`  Resize count: ${finalStats.resizeCount}`);
console.log(`  Max chain length: ${finalStats.maxChainLength}`);
console.log(`  Avg chain length: ${finalStats.avgChainLength}`);
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Encapsulation: Internal bucket structure hidden from users');
console.log('- Abstraction: Simple put/get/remove interface');
console.log('- Composition: HashTable composed of LinkedLists and HashNodes');
console.log('- Dynamic resizing: Automatic capacity management');
console.log('- Chaining: Collision resolution via linked lists');
console.log('='.repeat(70));
