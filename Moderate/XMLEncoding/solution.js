/**
 * XML Encoding - Compress XML by mapping tags to integers
 * Kodowanie XML - Kompresja XML poprzez mapowanie tagów na liczby całkowite
 */

/**
 * Klasy reprezentujące strukturę XML
 * Classes representing XML structure
 */
class Attribute {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class Element {
  constructor(tag) {
    this.tag = tag;
    this.attributes = [];
    this.children = [];
    this.text = null;
  }

  addAttribute(name, value) {
    this.attributes.push(new Attribute(name, value));
    return this;
  }

  addChild(child) {
    this.children.push(child);
    return this;
  }

  setText(text) {
    this.text = text;
    return this;
  }

  toString(indent = 0) {
    const spaces = '  '.repeat(indent);
    let result = `${spaces}<${this.tag}`;

    // Atrybuty
    for (const attr of this.attributes) {
      result += ` ${attr.name}="${attr.value}"`;
    }

    if (this.children.length === 0 && !this.text) {
      result += '/>\n';
    } else {
      result += '>\n';

      // Tekst
      if (this.text) {
        result += `${spaces}  ${this.text}\n`;
      }

      // Dzieci
      for (const child of this.children) {
        result += child.toString(indent + 1);
      }

      result += `${spaces}</${this.tag}>\n`;
    }

    return result;
  }
}

/**
 * Podejście 1: Rekurencyjne DFS - O(n) ✓ OPTYMALNE
 * Approach 1: Recursive DFS - O(n) ✓ OPTIMAL
 *
 * Gramatyka / Grammar:
 * Element --> Tag Attributes END Children END
 * Attribute --> Tag Value
 * END --> 0
 */
function encodeXML(element, tagMap) {
  const result = [];

  // 1. Tag elementu / Element tag
  result.push(tagMap[element.tag]);

  // 2. Atrybuty / Attributes
  for (const attr of element.attributes) {
    result.push(tagMap[attr.name]);
    result.push(attr.value);
  }

  // 3. Koniec atrybutów / End of attributes
  result.push(0);

  // 4. Tekst wewnętrzny / Inner text
  if (element.text) {
    result.push(element.text);
  }

  // 5. Dzieci rekurencyjnie / Children recursively
  for (const child of element.children) {
    const encoded = encodeXML(child, tagMap);
    result.push(...encoded);
  }

  // 6. Koniec dzieci / End of children
  result.push(0);

  return result;
}

/**
 * Podejście 2: Iteracyjne z Stackiem - O(n)
 * Approach 2: Iterative with Stack - O(n)
 *
 * Używa stacka do symulacji rekurencji
 * Uses stack to simulate recursion
 */
function encodeXMLIterative(element, tagMap) {
  const result = [];
  const stack = [{ element, phase: 'start' }];

  while (stack.length > 0) {
    const { element, phase } = stack.pop();

    if (phase === 'start') {
      // Tag + atrybuty
      result.push(tagMap[element.tag]);

      for (const attr of element.attributes) {
        result.push(tagMap[attr.name]);
        result.push(attr.value);
      }

      result.push(0); // Koniec atrybutów

      if (element.text) {
        result.push(element.text);
      }

      // Dodaj marker końca
      stack.push({ element, phase: 'end' });

      // Dodaj dzieci w odwrotnej kolejności (LIFO)
      for (let i = element.children.length - 1; i >= 0; i--) {
        stack.push({ element: element.children[i], phase: 'start' });
      }
    } else if (phase === 'end') {
      result.push(0); // Koniec dzieci
    }
  }

  return result;
}

/**
 * Podejście 3: Builder Pattern - O(n)
 * Approach 3: Builder Pattern - O(n)
 *
 * Użyj klasy Builder dla czytelności
 * Use Builder class for readability
 */
class XMLEncoder {
  constructor(tagMap) {
    this.tagMap = tagMap;
    this.result = [];
  }

  encode(element) {
    this.encodeElement(element);
    return this.result;
  }

  encodeElement(element) {
    // 1. Tag
    this.addTag(element.tag);

    // 2. Atrybuty
    this.encodeAttributes(element.attributes);

    // 3. Koniec atrybutów
    this.addEnd();

    // 4. Tekst
    if (element.text) {
      this.addValue(element.text);
    }

    // 5. Dzieci
    this.encodeChildren(element.children);

    // 6. Koniec dzieci
    this.addEnd();
  }

  encodeAttributes(attributes) {
    for (const attr of attributes) {
      this.addTag(attr.name);
      this.addValue(attr.value);
    }
  }

  encodeChildren(children) {
    for (const child of children) {
      this.encodeElement(child);
    }
  }

  addTag(tag) {
    this.result.push(this.tagMap[tag]);
  }

  addValue(value) {
    this.result.push(value);
  }

  addEnd() {
    this.result.push(0);
  }

  toString() {
    return this.result.join(' ');
  }
}

/**
 * Dekoder XML - konwersja z powrotem do drzewa
 * XML Decoder - convert back to tree
 */
function decodeXML(encoded, reverseTagMap) {
  let i = 0;

  function decodeElement() {
    const element = new Element(reverseTagMap[encoded[i++]]);

    // Dekoduj atrybuty / Decode attributes
    while (encoded[i] !== 0) {
      const attrName = reverseTagMap[encoded[i++]];
      const attrValue = encoded[i++];
      element.addAttribute(attrName, attrValue);
    }
    i++; // Pomiń 0 / Skip 0

    // Dekoduj dzieci i tekst / Decode children and text
    while (encoded[i] !== 0) {
      if (typeof encoded[i] === 'number') {
        element.addChild(decodeElement());
      } else {
        element.setText(encoded[i++]);
      }
    }
    i++; // Pomiń 0 / Skip 0

    return element;
  }

  return decodeElement();
}

/**
 * Funkcja pomocnicza: Konwersja zakodowanej tablicy na string
 * Helper function: Convert encoded array to string
 */
function encodedToString(encoded) {
  return encoded.join(' ');
}

/**
 * Funkcja pomocnicza: Oblicz współczynnik kompresji
 * Helper function: Calculate compression ratio
 */
function compressionRatio(element, encoded) {
  const xmlString = element.toString();
  const encodedString = encodedToString(encoded);

  const originalSize = xmlString.length;
  const compressedSize = encodedString.length;
  const ratio = (originalSize / compressedSize).toFixed(2);

  return {
    originalSize,
    compressedSize,
    ratio,
    savings: ((1 - compressedSize / originalSize) * 100).toFixed(1) + '%'
  };
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== XML Encoding ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania (from problem description)');

const tagMap = {
  family: 1,
  person: 2,
  firstName: 3,
  lastName: 4,
  state: 5
};

const reverseTagMap = {};
for (const [key, value] of Object.entries(tagMap)) {
  reverseTagMap[value] = key;
}

// Buduj drzewo XML
const family = new Element('family')
  .addAttribute('lastName', 'McDowell')
  .addAttribute('state', 'CA');

const person = new Element('person')
  .addAttribute('firstName', 'Gayle')
  .setText('Some Message');

family.addChild(person);

console.log('Oryginalny XML:');
console.log(family.toString());

const encoded1 = encodeXML(family, tagMap);
console.log('Zakodowany:');
console.log(encodedToString(encoded1));
console.log('\nOczekiwany: 1 4 McDowell 5 CA 0 2 3 Gayle 0 Some Message 0 0');
console.log(`Test ${encodedToString(encoded1) === '1 4 McDowell 5 CA 0 2 3 Gayle 0 Some Message 0 0' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: Dekodowanie
console.log('Test 2: Dekodowanie (round-trip test)');
const decoded1 = decodeXML(encoded1, reverseTagMap);
console.log('Zdekodowany XML:');
console.log(decoded1.toString());

const reencoded = encodeXML(decoded1, tagMap);
console.log(`Round-trip test: ${encodedToString(encoded1) === encodedToString(reencoded) ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: Element bez atrybutów
console.log('Test 3: Element bez atrybutów');
const simple = new Element('person').setText('Hello');
const encoded3 = encodeXML(simple, tagMap);
console.log('XML: <person>Hello</person>');
console.log(`Zakodowany: ${encodedToString(encoded3)}`);
console.log(`Oczekiwany: 2 0 Hello 0`);
console.log(`Test ${encodedToString(encoded3) === '2 0 Hello 0' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 4: Element bez dzieci i tekstu (samozamykający)
console.log('Test 4: Pusty element (self-closing)');
const empty = new Element('person');
const encoded4 = encodeXML(empty, tagMap);
console.log('XML: <person/>');
console.log(`Zakodowany: ${encodedToString(encoded4)}`);
console.log(`Oczekiwany: 2 0 0`);
console.log(`Test ${encodedToString(encoded4) === '2 0 0' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 5: Element z wieloma atrybutami
console.log('Test 5: Element z wieloma atrybutami');
const multiAttr = new Element('person')
  .addAttribute('firstName', 'John')
  .addAttribute('lastName', 'Doe')
  .addAttribute('state', 'NY');

const encoded5 = encodeXML(multiAttr, tagMap);
console.log('XML: <person firstName="John" lastName="Doe" state="NY"/>');
console.log(`Zakodowany: ${encodedToString(encoded5)}`);
console.log(`Oczekiwany: 2 3 John 4 Doe 5 NY 0 0`);
console.log(`Test ${encodedToString(encoded5) === '2 3 John 4 Doe 5 NY 0 0' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 6: Element z wieloma dziećmi
console.log('Test 6: Element z wieloma dziećmi');
const parent = new Element('family');
const child1 = new Element('person').addAttribute('firstName', 'Alice');
const child2 = new Element('person').addAttribute('firstName', 'Bob');
parent.addChild(child1).addChild(child2);

const encoded6 = encodeXML(parent, tagMap);
console.log('XML:');
console.log(parent.toString());
console.log(`Zakodowany: ${encodedToString(encoded6)}`);
console.log(`Oczekiwany: 1 0 2 3 Alice 0 0 2 3 Bob 0 0 0\n`);

// Test 7: Głęboka hierarchia
console.log('Test 7: Głęboka hierarchia (nested elements)');
const root = new Element('family');
const level1 = new Element('person').addAttribute('firstName', 'Parent');
const level2 = new Element('person').addAttribute('firstName', 'Child');
const level3 = new Element('person').addAttribute('firstName', 'Grandchild');

level2.addChild(level3);
level1.addChild(level2);
root.addChild(level1);

const encoded7 = encodeXML(root, tagMap);
console.log('XML (3 poziomy zagnieżdżenia):');
console.log(root.toString());
console.log(`Zakodowany: ${encodedToString(encoded7)}\n`);

// Test 8: Porównanie wszystkich metod
console.log('Test 8: Porównanie wszystkich metod');
const testElement = family;

const r1 = encodeXML(testElement, tagMap);
const r2 = encodeXMLIterative(testElement, tagMap);
const encoder = new XMLEncoder(tagMap);
const r3 = encoder.encode(testElement);

console.log(`Recursive:  ${encodedToString(r1)}`);
console.log(`Iterative:  ${encodedToString(r2)}`);
console.log(`Builder:    ${encodedToString(r3)}`);
console.log(`Wszystkie zgodne: ${
  encodedToString(r1) === encodedToString(r2) &&
  encodedToString(r2) === encodedToString(r3) ? '✓' : '✗'
}\n`);

// Test 9: Analiza kompresji
console.log('Test 9: Analiza kompresji');

function analyzeCompression(element, encoded, name) {
  const stats = compressionRatio(element, encoded);
  console.log(`${name}:`);
  console.log(`  Oryginalny rozmiar: ${stats.originalSize} bajtów`);
  console.log(`  Skompresowany rozmiar: ${stats.compressedSize} bajtów`);
  console.log(`  Współczynnik kompresji: ${stats.ratio}x`);
  console.log(`  Oszczędność: ${stats.savings}\n`);
}

analyzeCompression(simple, encoded3, 'Prosty element');
analyzeCompression(family, encoded1, 'Przykład z zadania');
analyzeCompression(root, encoded7, 'Głęboka hierarchia');

// Test 10: Edge cases
console.log('Test 10: Edge cases');

console.log('a) Tekst z spacjami:');
const textWithSpaces = new Element('person').setText('Hello World  From  XML');
const encoded10a = encodeXML(textWithSpaces, tagMap);
console.log(`  "${textWithSpaces.text}"`);
console.log(`  Zakodowany: ${encodedToString(encoded10a)}`);

console.log('\nb) Pusta wartość atrybutu:');
const emptyAttr = new Element('person').addAttribute('firstName', '');
const encoded10b = encodeXML(emptyAttr, tagMap);
console.log(`  <person firstName=""/>`);
console.log(`  Zakodowany: ${encodedToString(encoded10b)}`);

console.log('\nc) Wartość z cyframi:');
const numberValue = new Element('person').addAttribute('firstName', '123');
const encoded10c = encodeXML(numberValue, tagMap);
console.log(`  <person firstName="123"/>`);
console.log(`  Zakodowany: ${encodedToString(encoded10c)}\n`);

// Test 11: Duże drzewo
console.log('Test 11: Duże drzewo (large tree)');

const largeFamily = new Element('family');
for (let i = 0; i < 5; i++) {
  const person = new Element('person')
    .addAttribute('firstName', `Person${i}`)
    .addAttribute('lastName', `Last${i}`);

  for (let j = 0; j < 3; j++) {
    const child = new Element('person')
      .addAttribute('firstName', `Child${i}-${j}`);
    person.addChild(child);
  }

  largeFamily.addChild(person);
}

const encoded11 = encodeXML(largeFamily, tagMap);
console.log(`Liczba elementów: ${5 + 5 * 3} (5 rodziców + 15 dzieci)`);
console.log(`Długość zakodowanej tablicy: ${encoded11.length} elementów`);
analyzeCompression(largeFamily, encoded11, 'Duże drzewo');

// Test 12: Round-trip dla wszystkich testów
console.log('Test 12: Round-trip test dla wszystkich przypadków');

const testCases = [
  { name: 'Przykład z zadania', element: family },
  { name: 'Prosty', element: simple },
  { name: 'Pusty', element: empty },
  { name: 'Wiele atrybutów', element: multiAttr },
  { name: 'Wiele dzieci', element: parent },
  { name: 'Głęboka hierarchia', element: root },
  { name: 'Duże drzewo', element: largeFamily }
];

let allPassed = true;
for (const { name, element } of testCases) {
  const encoded = encodeXML(element, tagMap);
  const decoded = decodeXML(encoded, reverseTagMap);
  const reencoded = encodeXML(decoded, tagMap);

  const passed = encodedToString(encoded) === encodedToString(reencoded);
  allPassed = allPassed && passed;

  console.log(`  ${name}: ${passed ? '✓' : '✗'}`);
}
console.log(`\nWszystkie round-trip testy: ${allPassed ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 13: Wizualizacja krok po kroku
console.log('Test 13: Wizualizacja kodowania krok po kroku');

function encodeVerbose(element, tagMap, indent = 0) {
  const spaces = '  '.repeat(indent);
  const result = [];

  console.log(`${spaces}Element: <${element.tag}>`);

  // Tag
  console.log(`${spaces}  [1] Tag: ${element.tag} → ${tagMap[element.tag]}`);
  result.push(tagMap[element.tag]);

  // Atrybuty
  if (element.attributes.length > 0) {
    console.log(`${spaces}  [2] Atrybuty:`);
    for (const attr of element.attributes) {
      console.log(`${spaces}      ${attr.name}="${attr.value}" → ${tagMap[attr.name]} "${attr.value}"`);
      result.push(tagMap[attr.name]);
      result.push(attr.value);
    }
  }

  // Koniec atrybutów
  console.log(`${spaces}  [3] END (atrybuty) → 0`);
  result.push(0);

  // Tekst
  if (element.text) {
    console.log(`${spaces}  [4] Tekst: "${element.text}"`);
    result.push(element.text);
  }

  // Dzieci
  if (element.children.length > 0) {
    console.log(`${spaces}  [5] Dzieci:`);
    for (const child of element.children) {
      const childEncoded = encodeVerbose(child, tagMap, indent + 1);
      result.push(...childEncoded);
    }
  }

  // Koniec dzieci
  console.log(`${spaces}  [6] END (dzieci) → 0`);
  result.push(0);

  console.log(`${spaces}Wynik: [${result.join(', ')}]\n`);
  return result;
}

console.log('Przykład:');
const verboseExample = new Element('person')
  .addAttribute('firstName', 'John')
  .setText('Message');

encodeVerbose(verboseExample, tagMap);

// Test 14: Performance test
console.log('Test 14: Test wydajności (1000 kodowań)');

const iterations = 1000;

let start = Date.now();
for (let i = 0; i < iterations; i++) {
  encodeXML(largeFamily, tagMap);
}
const timeRecursive = Date.now() - start;

start = Date.now();
for (let i = 0; i < iterations; i++) {
  encodeXMLIterative(largeFamily, tagMap);
}
const timeIterative = Date.now() - start;

start = Date.now();
for (let i = 0; i < iterations; i++) {
  new XMLEncoder(tagMap).encode(largeFamily);
}
const timeBuilder = Date.now() - start;

console.log(`Recursive:  ${timeRecursive}ms`);
console.log(`Iterative:  ${timeIterative}ms`);
console.log(`Builder:    ${timeBuilder}ms`);
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('XML Encoding - Kompresja XML przez mapowanie tagów');
console.log('\nZłożoność:');
console.log('  Czasowa:  O(n) gdzie n = liczba węzłów + atrybuty');
console.log('  Pamięciowa: O(h) gdzie h = wysokość drzewa (stack)');
console.log('\nGramatyka:');
console.log('  Element    → Tag Attributes END Children END');
console.log('  Attribute  → Tag Value');
console.log('  END        → 0');
console.log('\nKluczowa idea:');
console.log('  - Mapuj powtarzające się tagi na liczby całkowite');
console.log('  - Użyj 0 jako markera końca (separatora)');
console.log('  - Przeglądaj drzewo DFS (głębokość najpierw)');
console.log('  - Kompresja ~5-10x w stosunku do zwykłego XML');
console.log('\nZastosowania:');
console.log('  - Kompresja danych XML');
console.log('  - Przesyłanie przez sieć (mniejsze pakiety)');
console.log('  - Serializacja dla API i mobile');
console.log('  - Oszczędność miejsca w storage');
console.log('  - Szybsze parsowanie (liczby vs stringi)');
