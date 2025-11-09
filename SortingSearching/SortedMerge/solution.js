/**
 * Sorted Merge - Scalanie Posortowanych Tablic
 *
 * Scala tablicę B do tablicy A w posortowanej kolejności.
 * A ma wystarczająco dużo miejsca na końcu dla wszystkich elementów B.
 *
 * Merges array B into array A in sorted order.
 * A has enough space at the end for all elements of B.
 *
 * @param {number[]} a - Tablica A z buforem / Array A with buffer
 * @param {number[]} b - Tablica B do scalenia / Array B to merge
 * @param {number} lastA - Indeks ostatniego elementu A / Index of last element in A
 * @param {number} lastB - Indeks ostatniego elementu B / Index of last element in B
 */
function sortedMerge(a, b, lastA, lastB) {
  let indexA = lastA;           // Wskaźnik na ostatni element A / Pointer to last element of A
  let indexB = lastB;           // Wskaźnik na ostatni element B / Pointer to last element of B
  let indexMerged = lastA + lastB + 1; // Wskaźnik na ostatnią pozycję / Pointer to last position

  // Scalaj elementy od końca / Merge elements from end
  while (indexB >= 0) {
    // Jeśli są jeszcze elementy w A i element A jest większy
    // If there are still elements in A and A element is larger
    if (indexA >= 0 && a[indexA] > b[indexB]) {
      a[indexMerged] = a[indexA];
      indexA--;
    } else {
      // Element B jest większy lub nie ma więcej elementów w A
      // B element is larger or no more A elements
      a[indexMerged] = b[indexB];
      indexB--;
    }
    indexMerged--;
  }

  // Elementy A, które nie zostały przeniesione, są już na właściwych pozycjach
  // A elements that weren't moved are already in correct positions
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("=== Test 1: Standardowy przypadek / Standard case ===");
let a1 = [1, 3, 5, 7, 0, 0, 0, 0]; // 4 elementy + 4 puste miejsca
let b1 = [2, 4, 6, 8];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a1);
console.log("B:", b1);
sortedMerge(a1, b1, 3, 3); // lastA=3 (indeks 7), lastB=3 (indeks 8)
console.log("Po scaleniu / After merge:");
console.log("A:", a1);
console.log("Oczekiwane / Expected: [1, 2, 3, 4, 5, 6, 7, 8]");
console.log();

console.log("=== Test 2: Wszystkie elementy B większe / All B elements larger ===");
let a2 = [1, 2, 3, 0, 0, 0];
let b2 = [4, 5, 6];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a2);
console.log("B:", b2);
sortedMerge(a2, b2, 2, 2);
console.log("Po scaleniu / After merge:");
console.log("A:", a2);
console.log("Oczekiwane / Expected: [1, 2, 3, 4, 5, 6]");
console.log();

console.log("=== Test 3: Wszystkie elementy B mniejsze / All B elements smaller ===");
let a3 = [4, 5, 6, 0, 0, 0];
let b3 = [1, 2, 3];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a3);
console.log("B:", b3);
sortedMerge(a3, b3, 2, 2);
console.log("Po scaleniu / After merge:");
console.log("A:", a3);
console.log("Oczekiwane / Expected: [1, 2, 3, 4, 5, 6]");
console.log();

console.log("=== Test 4: Elementy przeplatane / Interleaved elements ===");
let a4 = [1, 5, 9, 0, 0, 0];
let b4 = [2, 3, 7];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a4);
console.log("B:", b4);
sortedMerge(a4, b4, 2, 2);
console.log("Po scaleniu / After merge:");
console.log("A:", a4);
console.log("Oczekiwane / Expected: [1, 2, 3, 5, 7, 9]");
console.log();

console.log("=== Test 5: B jest pusta / B is empty ===");
let a5 = [1, 2, 3];
let b5 = [];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a5);
console.log("B:", b5);
sortedMerge(a5, b5, 2, -1); // lastB = -1 bo B jest pusta
console.log("Po scaleniu / After merge:");
console.log("A:", a5);
console.log("Oczekiwane / Expected: [1, 2, 3]");
console.log();

console.log("=== Test 6: A jest pusta (tylko bufor) / A is empty (only buffer) ===");
let a6 = [0, 0, 0];
let b6 = [1, 2, 3];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a6);
console.log("B:", b6);
sortedMerge(a6, b6, -1, 2); // lastA = -1 bo A jest pusta
console.log("Po scaleniu / After merge:");
console.log("A:", a6);
console.log("Oczekiwane / Expected: [1, 2, 3]");
console.log();

console.log("=== Test 7: Duplikaty / Duplicates ===");
let a7 = [1, 3, 3, 5, 0, 0, 0];
let b7 = [2, 3, 4];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a7);
console.log("B:", b7);
sortedMerge(a7, b7, 3, 2);
console.log("Po scaleniu / After merge:");
console.log("A:", a7);
console.log("Oczekiwane / Expected: [1, 2, 3, 3, 3, 4, 5]");
console.log();

console.log("=== Test 8: Pojedyncze elementy / Single elements ===");
let a8 = [5, 0];
let b8 = [3];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a8);
console.log("B:", b8);
sortedMerge(a8, b8, 0, 0);
console.log("Po scaleniu / After merge:");
console.log("A:", a8);
console.log("Oczekiwane / Expected: [3, 5]");
console.log();

console.log("=== Test 9: Liczby ujemne / Negative numbers ===");
let a9 = [-5, -2, 0, 3, 0, 0, 0, 0];
let b9 = [-3, -1, 2, 4];
console.log("Przed scaleniem / Before merge:");
console.log("A:", a9);
console.log("B:", b9);
sortedMerge(a9, b9, 3, 3);
console.log("Po scaleniu / After merge:");
console.log("A:", a9);
console.log("Oczekiwane / Expected: [-5, -3, -2, -1, 0, 2, 3, 4]");
console.log();

// Eksportuj funkcję dla innych modułów / Export function for other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sortedMerge;
}
