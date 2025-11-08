# Iteracja w JavaScript - String, Obiekt, Tablica
# Iteration in JavaScript - String, Object, Array

## 1. STRING - Iteracja po Znakach
## 1. STRING - Iterate Over Characters

```javascript
const str = "hello";

// for...of - iteruje po znakach
// for...of - iterates over characters
for (let char of str) {
  console.log(char); // 'h', 'e', 'l', 'l', 'o'
}

// Tradycyjna pętla for z indeksem
// Traditional for loop with index
for (let i = 0; i < str.length; i++) {
  console.log(str[i]); // 'h', 'e', 'l', 'l', 'o'
}

// forEach - NIE DZIAŁA bezpośrednio na stringach!
// forEach - DOESN'T WORK directly on strings!
// str.forEach() // ❌ Error

// Ale możesz przekonwertować: / But you can convert:
[...str].forEach(char => console.log(char));
```

## 2. OBIEKT - Iteracja po Propertiach
## 2. OBJECT - Iterate Over Properties

```javascript
const obj = {
  name: "John",
  age: 30,
  city: "Warsaw"
};

// ❌ for...of NIE DZIAŁA na obiektach!
// ❌ for...of DOESN'T WORK on objects!
// for (let prop of obj) // Error: obj is not iterable

// ✅ for...in - iteruje po KLUCZACH (keys)
// ✅ for...in - iterates over KEYS
for (let key in obj) {
  console.log(key);        // 'name', 'age', 'city'
  console.log(obj[key]);   // 'John', 30, 'Warsaw'
}

// ✅ Object.keys() + forEach
// ✅ Object.keys() + forEach
Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
});

// ✅ Object.values() - tylko wartości
// ✅ Object.values() - values only
Object.values(obj).forEach(value => {
  console.log(value); // 'John', 30, 'Warsaw'
});

// ✅ Object.entries() - pary [klucz, wartość]
// ✅ Object.entries() - [key, value] pairs
Object.entries(obj).forEach(([key, value]) => {
  console.log(key, value);
});

// ✅ for...of z Object.entries()
// ✅ for...of with Object.entries()
for (let [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

## 3. TABLICA - Iteracja po Elementach
## 3. ARRAY - Iterate Over Elements

```javascript
const arr = ['a', 'b', 'c'];

// ✅ for...of - iteruje po WARTOŚCIACH
// ✅ for...of - iterates over VALUES
for (let element of arr) {
  console.log(element); // 'a', 'b', 'c'
}

// ✅ forEach - z indeksem i tablicą
// ✅ forEach - with index and array
arr.forEach((element, index, array) => {
  console.log(element, index);
});

// ✅ Tradycyjna pętla for
// ✅ Traditional for loop
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// ⚠️ for...in - iteruje po INDEKSACH (nie polecane)
// ⚠️ for...in - iterates over INDEXES (not recommended)
for (let index in arr) {
  console.log(index);     // '0', '1', '2' (stringi!)
  console.log(arr[index]); // 'a', 'b', 'c'
}

// ✅ map - tworzy nową tablicę
// ✅ map - creates new array
const newArr = arr.map(el => el.toUpperCase());

// ✅ filter - filtruje elementy
// ✅ filter - filters elements
const filtered = arr.filter(el => el !== 'b');
```

## PORÓWNANIE - Przykład z isUnique
## COMPARISON - isUnique Example

### STRING
```javascript
function isUniqueString(str) {
  const seen = new Set();
  
  // for...of dla znaków
  // for...of for characters
  for (let char of str) {
    if (seen.has(char)) return false;
    seen.add(char);
  }
  return true;
}
```

### OBIEKT - Sprawdzanie unikalnych wartości
### OBJECT - Check unique values
```javascript
function hasUniqueValues(obj) {
  const seen = new Set();
  
  // for...in dla kluczy obiektu
  // for...in for object keys
  for (let key in obj) {
    if (seen.has(obj[key])) return false;
    seen.add(obj[key]);
  }
  return true;
}

// LUB z Object.values() / OR with Object.values()
function hasUniqueValues2(obj) {
  const values = Object.values(obj);
  return new Set(values).size === values.length;
}

// Przykład / Example
const person = { name: "John", age: 30, id: 30 };
console.log(hasUniqueValues(person)); // false (30 się powtarza)
```

### TABLICA - Sprawdzanie unikalnych elementów
### ARRAY - Check unique elements
```javascript
function hasUniqueElements(arr) {
  const seen = new Set();
  
  // for...of dla elementów tablicy
  // for...of for array elements
  for (let element of arr) {
    if (seen.has(element)) return false;
    seen.add(element);
  }
  return true;
}

// LUB prościej / OR simpler
function hasUniqueElements2(arr) {
  return new Set(arr).size === arr.length;
}

// Przykład / Example
console.log(hasUniqueElements([1, 2, 3]));    // true
console.log(hasUniqueElements([1, 2, 2, 3])); // false
```

## TABELA PODSUMOWUJĄCA
## SUMMARY TABLE

| Typ / Type | for...of | for...in | forEach | Zwraca / Returns |
|------------|----------|----------|---------|------------------|
| **String** | ✅ znaki / chars | ✅ indeksy / indexes | ❌ (trzeba [...str]) | wartości / values |
| **Object** | ❌ Error | ✅ klucze / keys | ❌ (użyj Object.keys()) | klucze / keys |
| **Array** | ✅ elementy / elements | ⚠️ indeksy / indexes | ✅ elementy / elements | wartości / values |

## DODATKOWE METODY DLA OBIEKTÓW
## ADDITIONAL METHODS FOR OBJECTS

```javascript
const obj = { a: 1, b: 2, c: 3 };

// Object.keys() - tablica kluczy
// Object.keys() - array of keys
console.log(Object.keys(obj)); // ['a', 'b', 'c']

// Object.values() - tablica wartości
// Object.values() - array of values
console.log(Object.values(obj)); // [1, 2, 3]

// Object.entries() - tablica par [klucz, wartość]
// Object.entries() - array of [key, value] pairs
console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]

// Object.fromEntries() - obiekt z par
// Object.fromEntries() - object from pairs
const entries = [['x', 10], ['y', 20]];
console.log(Object.fromEntries(entries)); // { x: 10, y: 20 }
```

## WAŻNE RÓŻNICE!
## IMPORTANT DIFFERENCES!

1. **for...of** = wartości (values) → String, Array, Set, Map
2. **for...in** = klucze (keys) → Object, (Array - nie polecane)
3. **forEach** = tylko Array (i Set, Map)