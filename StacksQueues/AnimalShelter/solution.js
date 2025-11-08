/**
 * Animal Shelter - FIFO for dogs and cats
 * Schronisko dla Zwierząt - FIFO dla psów i kotów
 *
 * People can adopt:
 * Ludzie mogą adoptować:
 * 1. Oldest animal (any type) / Najstarsze zwierzę (dowolny typ)
 * 2. Oldest dog / Najstarszy pies
 * 3. Oldest cat / Najstarszy kot
 *
 * STRATEGY / STRATEGIA:
 * Use two queues (one for dogs, one for cats) with timestamps
 * Użyj dwóch kolejek (jedna dla psów, jedna dla kotów) z znacznikami czasu
 */

class Animal {
  constructor(name) {
    this.name = name;
    this.order = 0; // Timestamp / Znacznik czasu
  }

  setOrder(order) {
    this.order = order;
  }

  isOlderThan(other) {
    return this.order < other.order;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
    this.type = 'Dog';
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    this.type = 'Cat';
  }
}

class AnimalQueue {
  constructor() {
    this.dogs = []; // Queue of dogs / Kolejka psów
    this.cats = []; // Queue of cats / Kolejka kotów
    this.order = 0; // Global timestamp / Globalny znacznik czasu
  }

  /**
   * Enqueue animal / Dodaj zwierzę do kolejki
   */
  enqueue(animal) {
    animal.setOrder(this.order);
    this.order++;

    if (animal instanceof Dog) {
      this.dogs.push(animal);
    } else if (animal instanceof Cat) {
      this.cats.push(animal);
    } else {
      throw new Error('Invalid animal type / Nieprawidłowy typ zwierzęcia');
    }
  }

  /**
   * Dequeue any - return oldest animal / Usuń dowolne - zwróć najstarsze zwierzę
   */
  dequeueAny() {
    if (this.dogs.length === 0 && this.cats.length === 0) {
      throw new Error('No animals available / Brak dostępnych zwierząt');
    }

    if (this.dogs.length === 0) {
      return this.dequeueCat();
    }

    if (this.cats.length === 0) {
      return this.dequeueDog();
    }

    // Compare oldest dog and cat / Porównaj najstarszego psa i kota
    const oldestDog = this.dogs[0];
    const oldestCat = this.cats[0];

    if (oldestDog.isOlderThan(oldestCat)) {
      return this.dequeueDog();
    } else {
      return this.dequeueCat();
    }
  }

  /**
   * Dequeue dog / Usuń psa
   */
  dequeueDog() {
    if (this.dogs.length === 0) {
      throw new Error('No dogs available / Brak dostępnych psów');
    }
    return this.dogs.shift();
  }

  /**
   * Dequeue cat / Usuń kota
   */
  dequeueCat() {
    if (this.cats.length === 0) {
      throw new Error('No cats available / Brak dostępnych kotów');
    }
    return this.cats.shift();
  }

  /**
   * Peek at next animals / Zajrzyj na następne zwierzęta
   */
  peekDogs() {
    return this.dogs.map(d => `${d.name}(${d.order})`);
  }

  peekCats() {
    return this.cats.map(c => `${c.name}(${c.order})`);
  }

  isEmpty() {
    return this.dogs.length === 0 && this.cats.length === 0;
  }

  size() {
    return this.dogs.length + this.cats.length;
  }
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(70));
console.log('ANIMAL SHELTER / SCHRONISKO DLA ZWIERZĄT');
console.log('='.repeat(70));
console.log();

console.log('TEST 1: Basic operations');
console.log('-'.repeat(70));
const shelter = new AnimalQueue();

console.log('Enqueue animals:');
shelter.enqueue(new Dog('Rex'));
console.log('  Dog Rex (order 0)');
shelter.enqueue(new Cat('Whiskers'));
console.log('  Cat Whiskers (order 1)');
shelter.enqueue(new Dog('Buddy'));
console.log('  Dog Buddy (order 2)');
shelter.enqueue(new Cat('Mittens'));
console.log('  Cat Mittens (order 3)');
shelter.enqueue(new Dog('Max'));
console.log('  Dog Max (order 4)');

console.log(`\nDogs: [${shelter.peekDogs()}]`);
console.log(`Cats: [${shelter.peekCats()}]`);
console.log();

console.log('TEST 2: Dequeue any (oldest overall)');
console.log('-'.repeat(70));
let adopted = shelter.dequeueAny();
console.log(`Adopted: ${adopted.type} ${adopted.name} (order ${adopted.order})`);
console.log('Expected: Dog Rex (oldest overall)');

adopted = shelter.dequeueAny();
console.log(`Adopted: ${adopted.type} ${adopted.name} (order ${adopted.order})`);
console.log('Expected: Cat Whiskers (next oldest)');

console.log(`\nRemaining Dogs: [${shelter.peekDogs()}]`);
console.log(`Remaining Cats: [${shelter.peekCats()}]`);
console.log();

console.log('TEST 3: Dequeue specific type');
console.log('-'.repeat(70));
adopted = shelter.dequeueDog();
console.log(`Adopted dog: ${adopted.name} (order ${adopted.order})`);
console.log('Expected: Buddy');

adopted = shelter.dequeueCat();
console.log(`Adopted cat: ${adopted.name} (order ${adopted.order})`);
console.log('Expected: Mittens');

console.log(`\nRemaining Dogs: [${shelter.peekDogs()}]`);
console.log(`Remaining Cats: [${shelter.peekCats()}]`);
console.log();

console.log('TEST 4: Interleaved operations');
console.log('-'.repeat(70));
const shelter2 = new AnimalQueue();

console.log('Enqueue: Dog A, Cat B, Dog C');
shelter2.enqueue(new Dog('A'));
shelter2.enqueue(new Cat('B'));
shelter2.enqueue(new Dog('C'));

console.log('Dequeue dog:', shelter2.dequeueDog().name, '(expected A)');

console.log('\nEnqueue: Cat D, Dog E');
shelter2.enqueue(new Cat('D'));
shelter2.enqueue(new Dog('E'));

console.log('Dequeue any:', shelter2.dequeueAny().name, '(expected B - oldest overall)');
console.log('Dequeue any:', shelter2.dequeueAny().name, '(expected C - next oldest)');
console.log('Dequeue any:', shelter2.dequeueAny().name, '(expected D)');
console.log('Dequeue any:', shelter2.dequeueAny().name, '(expected E)');
console.log();

console.log('TEST 5: Edge cases');
console.log('-'.repeat(70));
const shelter3 = new AnimalQueue();

try {
  shelter3.dequeueAny();
  console.log('ERROR: Should throw');
} catch (e) {
  console.log(`Empty shelter throws: ${e.message} ✓`);
}

shelter3.enqueue(new Dog('Solo'));
console.log('\nOnly dogs in shelter:');
console.log('Dequeue any:', shelter3.dequeueAny().name, '(returns dog ✓)');

shelter3.enqueue(new Cat('Lonely'));
console.log('\nOnly cats in shelter:');
console.log('Dequeue any:', shelter3.dequeueAny().name, '(returns cat ✓)');
console.log();

console.log('TEST 6: Large shelter');
console.log('-'.repeat(70));
const shelter4 = new AnimalQueue();

console.log('Adding 10 animals alternating...');
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) {
    shelter4.enqueue(new Dog(`Dog${i}`));
  } else {
    shelter4.enqueue(new Cat(`Cat${i}`));
  }
}

console.log(`Total animals: ${shelter4.size()}`);
console.log(`Dogs: ${shelter4.dogs.length}`);
console.log(`Cats: ${shelter4.cats.length}`);

console.log('\nAdopting all animals (dequeueAny):');
const adopted4 = [];
while (!shelter4.isEmpty()) {
  const animal = shelter4.dequeueAny();
  adopted4.push(`${animal.type[0]}${animal.name.slice(3)}`);
}
console.log(`Order: ${adopted4.join(' -> ')}`);
console.log('Should be in arrival order: D0 -> C1 -> D2 -> C3 -> ...');
console.log();

console.log('='.repeat(70));
console.log('DESIGN DECISIONS / DECYZJE PROJEKTOWE');
console.log('='.repeat(70));
console.log();
console.log('WHY TWO QUEUES? / DLACZEGO DWA KOLEJKI?');
console.log('  - Separate queues maintain FIFO order for each type');
console.log('  - Osobne kolejki utrzymują kolejność FIFO dla każdego typu');
console.log('  - Can efficiently get oldest dog or oldest cat: O(1)');
console.log('  - Można efektywnie pobrać najstarszego psa lub kota: O(1)');
console.log();
console.log('WHY TIMESTAMPS? / DLACZEGO ZNACZNIKI CZASU?');
console.log('  - To compare oldest dog vs oldest cat for dequeueAny()');
console.log('  - Aby porównać najstarszego psa vs najstarszego kota dla dequeueAny()');
console.log('  - Without timestamps, cannot determine overall oldest');
console.log('  - Bez znaczników czasu, nie można określić ogólnie najstarszego');
console.log();
console.log('ALTERNATIVE DESIGN / ALTERNATYWNY PROJEKT:');
console.log('  - Single queue with all animals');
console.log('  - Pojedyncza kolejka ze wszystkimi zwierzętami');
console.log('  - Pros: Simple / Zalety: Proste');
console.log('  - Cons: dequeueDog/Cat becomes O(n) / Wady: dequeueDog/Cat staje się O(n)');
console.log();

console.log('='.repeat(70));
console.log('COMPLEXITY / ZŁOŻONOŚĆ');
console.log('='.repeat(70));
console.log('enqueue:      O(1)');
console.log('dequeueAny:   O(1) - just compare two heads / tylko porównaj dwie głowy');
console.log('dequeueDog:   O(1)');
console.log('dequeueCat:   O(1)');
console.log('Space:        O(n) where n is number of animals / gdzie n to liczba zwierząt');
console.log('='.repeat(70));
