/**
 * Sorted Search, No Size - Wyszukiwanie bez Rozmiaru
 *
 * Wyszukuje element w strukturze Listy bez metody size.
 * Searches for element in Listy structure without size method.
 */

/**
 * Klasa Listy - symulacja struktury danych z zadania
 * Listy class - simulation of data structure from problem
 */
class Listy {
  constructor(arr) {
    this.arr = arr;
  }

  /**
   * Zwraca element na indeksie i lub -1 jeśli poza zakresem
   * Returns element at index i or -1 if out of bounds
   */
  elementAt(i) {
    if (i < 0 || i >= this.arr.length) {
      return -1;
    }
    return this.arr[i];
  }
}

/**
 * Wyszukuje element x w Listy
 * Searches for element x in Listy
 *
 * @param {Listy} listy - Struktura danych / Data structure
 * @param {number} target - Element do znalezienia / Element to find
 * @return {number} - Indeks elementu lub -1 / Index of element or -1
 */
function searchListy(listy, target) {
  // Faza 1: Znajdź zakres wykładniczo
  // Phase 1: Find range exponentially

  // Sprawdź czy lista jest pusta / Check if list is empty
  if (listy.elementAt(0) === -1) {
    return -1;
  }

  // Znajdź górną granicę / Find upper bound
  let index = 1;
  while (listy.elementAt(index) !== -1 && listy.elementAt(index) < target) {
    index *= 2; // Podwajaj indeks / Double index
  }

  // Faza 2: Binary search między index/2 a index
  // Phase 2: Binary search between index/2 and index
  return binarySearch(listy, target, Math.floor(index / 2), index);
}

/**
 * Binary search w Listy
 * Binary search in Listy
 */
function binarySearch(listy, target, left, right) {
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const element = listy.elementAt(mid);

    // Znaleziono / Found
    if (element === target) {
      return mid;
    }

    // Poza zakresem lub za duże - szukaj w lewo
    // Out of bounds or too large - search left
    if (element === -1 || element > target) {
      right = mid - 1;
    }
    // Za małe - szukaj w prawo
    // Too small - search right
    else {
      left = mid + 1;
    }
  }

  return -1; // Nie znaleziono / Not found
}

/**
 * Alternatywna wersja: zoptymalizowana dla małych wartości
 * Alternative version: optimized for small values
 */
function searchListyOptimized(listy, target) {
  // Sprawdź bezpośrednio początkowe indeksy / Check initial indices directly
  if (listy.elementAt(0) === target) return 0;
  if (listy.elementAt(0) === -1) return -1;
  if (listy.elementAt(0) > target) return -1;

  // Wykładnicze wyszukiwanie / Exponential search
  let index = 1;
  let prevIndex = 0;

  while (true) {
    const element = listy.elementAt(index);

    // Koniec listy / End of list
    if (element === -1) {
      return binarySearch(listy, target, prevIndex, index - 1);
    }

    // Znaleziono dokładnie / Found exactly
    if (element === target) {
      return index;
    }

    // Przekroczono target / Exceeded target
    if (element > target) {
      return binarySearch(listy, target, prevIndex, index - 1);
    }

    // Kontynuuj wykładnicze zwiększanie / Continue exponential increase
    prevIndex = index;
    index *= 2;
  }
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("=== Test 1: Podstawowy przykład / Basic example ===");
const list1 = new Listy([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]);
console.log("Lista (ukryta długość) / List (hidden length):", list1.arr);
console.log("Szukamy / Searching for: 17");
console.log("Wynik / Result:", searchListy(list1, 17));
console.log("Oczekiwane / Expected: 8");
console.log();

console.log("=== Test 2: Element na początku / Element at start ===");
console.log("Szukamy / Searching for: 1");
console.log("Wynik / Result:", searchListy(list1, 1));
console.log("Oczekiwane / Expected: 0");
console.log();

console.log("=== Test 3: Element na końcu / Element at end ===");
console.log("Szukamy / Searching for: 25");
console.log("Wynik / Result:", searchListy(list1, 25));
console.log("Oczekiwane / Expected: 12");
console.log();

console.log("=== Test 4: Element nie istnieje / Element doesn't exist ===");
console.log("Szukamy / Searching for: 18");
console.log("Wynik / Result:", searchListy(list1, 18));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 5: Element mniejszy niż wszystkie / Element smaller than all ===");
console.log("Szukamy / Searching for: 0");
console.log("Wynik / Result:", searchListy(list1, 0));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 6: Element większy niż wszystkie / Element larger than all ===");
console.log("Szukamy / Searching for: 100");
console.log("Wynik / Result:", searchListy(list1, 100));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 7: Pusta lista / Empty list ===");
const list7 = new Listy([]);
console.log("Lista / List:", list7.arr);
console.log("Szukamy / Searching for: 5");
console.log("Wynik / Result:", searchListy(list7, 5));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 8: Jeden element / Single element ===");
const list8 = new Listy([5]);
console.log("Lista / List:", list8.arr);
console.log("Szukamy / Searching for: 5");
console.log("Wynik / Result:", searchListy(list8, 5));
console.log("Oczekiwane / Expected: 0");
console.log("Szukamy / Searching for: 3");
console.log("Wynik / Result:", searchListy(list8, 3));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 9: Dwa elementy / Two elements ===");
const list9 = new Listy([5, 10]);
console.log("Lista / List:", list9.arr);
console.log("Szukamy / Searching for: 5");
console.log("Wynik / Result:", searchListy(list9, 5));
console.log("Oczekiwane / Expected: 0");
console.log("Szukamy / Searching for: 10");
console.log("Wynik / Result:", searchListy(list9, 10));
console.log("Oczekiwane / Expected: 1");
console.log();

console.log("=== Test 10: Duża lista / Large list ===");
const largeArr = [];
for (let i = 0; i < 10000; i++) {
  largeArr.push(i * 2); // Parzyste liczby / Even numbers
}
const list10 = new Listy(largeArr);
console.log("Lista długości / List of length:", largeArr.length);
console.log("Szukamy / Searching for: 5000");
console.log("Wynik / Result:", searchListy(list10, 5000));
console.log("Oczekiwane / Expected: 2500");
console.log("Szukamy / Searching for: 5001 (nie istnieje)");
console.log("Wynik / Result:", searchListy(list10, 5001));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 11: Porównanie metod / Compare methods ===");
const list11 = new Listy([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
console.log("Lista / List:", list11.arr);
const target = 14;
console.log("Szukamy / Searching for:", target);
console.log("Metoda standardowa:", searchListy(list11, target));
console.log("Metoda zoptymalizowana:", searchListyOptimized(list11, target));
console.log("Obie powinny zwrócić / Both should return: 6");
console.log();

console.log("=== Test 12: Wizualizacja procesu wyszukiwania ===");
console.log("=== Visualization of search process ===");

// Wrapper do śledzenia wywołań / Wrapper to track calls
class ListyWithTracking extends Listy {
  constructor(arr) {
    super(arr);
    this.accessCount = 0;
  }

  elementAt(i) {
    this.accessCount++;
    const result = super.elementAt(i);
    console.log(`  elementAt(${i}) = ${result}`);
    return result;
  }
}

const list12 = new ListyWithTracking([1, 3, 5, 7, 9, 11, 13, 15]);
console.log("Szukamy 11 w:", list12.arr);
const result12 = searchListy(list12, 11);
console.log(`Znaleziono na indeksie ${result12}`);
console.log(`Liczba wywołań elementAt: ${list12.accessCount}`);
console.log(`Teoretyczne minimum (log n): ${Math.ceil(Math.log2(list12.arr.length))}`);
console.log();

console.log("=== Test 13: Wszystkie elementy / All elements ===");
const list13 = new Listy([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
console.log("Lista / List:", list13.arr);
console.log("Szukanie wszystkich elementów / Searching all elements:");
let allCorrect = true;
for (let i = 0; i < list13.arr.length; i++) {
  const result = searchListy(list13, list13.arr[i]);
  const isCorrect = result === i;
  if (!isCorrect) allCorrect = false;
  console.log(`  Szukam ${list13.arr[i]}, znaleziono na ${result}, oczekiwane ${i}:`, isCorrect ? "✓" : "✗");
}
console.log("Wszystkie poprawne / All correct:", allCorrect ? "✓" : "✗");
console.log();

// Eksportuj funkcje / Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Listy,
    searchListy,
    searchListyOptimized,
    binarySearch
  };
}
