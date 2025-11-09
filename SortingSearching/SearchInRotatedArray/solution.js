/**
 * Search in Rotated Array - Wyszukiwanie w Obróconej Tablicy
 *
 * Znajduje element w posortowanej tablicy, która została obrócona.
 * Finds an element in a sorted array that has been rotated.
 *
 * @param {number[]} arr - Obrócona posortowana tablica / Rotated sorted array
 * @param {number} target - Element do znalezienia / Element to find
 * @return {number} - Indeks elementu lub -1 / Index of element or -1
 */
function searchRotated(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Znaleziono element / Found element
    if (arr[mid] === target) {
      return mid;
    }

    // Określ, która połowa jest posortowana
    // Determine which half is sorted

    // Lewa połowa jest posortowana / Left half is sorted
    if (arr[left] <= arr[mid]) {
      // Sprawdź czy target jest w posortowanej lewej połowie
      // Check if target is in the sorted left half
      if (target >= arr[left] && target < arr[mid]) {
        right = mid - 1; // Szukaj w lewej / Search left
      } else {
        left = mid + 1;  // Szukaj w prawej / Search right
      }
    }
    // Prawa połowa jest posortowana / Right half is sorted
    else {
      // Sprawdź czy target jest w posortowanej prawej połowie
      // Check if target is in the sorted right half
      if (target > arr[mid] && target <= arr[right]) {
        left = mid + 1;  // Szukaj w prawej / Search right
      } else {
        right = mid - 1; // Szukaj w lewej / Search left
      }
    }
  }

  return -1; // Element nie znaleziony / Element not found
}

/**
 * Znajduje punkt rotacji w tablicy
 * Finds the rotation point in the array
 *
 * @param {number[]} arr - Obrócona tablica / Rotated array
 * @return {number} - Indeks najmniejszego elementu / Index of smallest element
 */
function findRotationPoint(arr) {
  let left = 0;
  let right = arr.length - 1;

  // Jeśli tablica nie jest rotowana / If array is not rotated
  if (arr[left] <= arr[right]) {
    return 0;
  }

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Punkt rotacji znaleziony - następny element jest mniejszy
    // Rotation point found - next element is smaller
    if (mid < arr.length - 1 && arr[mid] > arr[mid + 1]) {
      return mid + 1;
    }

    // Poprzedni element jest większy - to też punkt rotacji
    // Previous element is larger - this is also rotation point
    if (mid > 0 && arr[mid] < arr[mid - 1]) {
      return mid;
    }

    // Decyduj, w której połowie szukać
    // Decide which half to search
    if (arr[left] <= arr[mid]) {
      left = mid + 1;  // Punkt rotacji w prawej połowie / Rotation point in right half
    } else {
      right = mid - 1; // Punkt rotacji w lewej połowie / Rotation point in left half
    }
  }

  return 0;
}

/**
 * Alternatywne rozwiązanie: najpierw znajdź punkt rotacji, potem binary search
 * Alternative solution: first find rotation point, then binary search
 */
function searchRotatedAlternative(arr, target) {
  const rotationPoint = findRotationPoint(arr);

  // Binary search w odpowiedniej połowie / Binary search in appropriate half
  function binarySearch(left, right) {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] === target) {
        return mid;
      }

      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return -1;
  }

  // Sprawdź, w której części szukać / Check which part to search
  if (rotationPoint === 0) {
    // Tablica nie jest rotowana / Array is not rotated
    return binarySearch(0, arr.length - 1);
  }

  // Sprawdź lewą część (większe wartości) / Check left part (larger values)
  if (target >= arr[0]) {
    return binarySearch(0, rotationPoint - 1);
  }

  // Sprawdź prawą część (mniejsze wartości) / Check right part (smaller values)
  return binarySearch(rotationPoint, arr.length - 1);
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("=== Test 1: Przykład z zadania / Example from problem ===");
const arr1 = [15, 16, 19, 20, 25, 1, 3, 4, 5, 7, 10, 14];
console.log("Tablica / Array:", arr1);
console.log("Szukamy / Searching for: 5");
console.log("Wynik / Result:", searchRotated(arr1, 5));
console.log("Oczekiwane / Expected: 8");
console.log();

console.log("=== Test 2: Element na początku / Element at start ===");
console.log("Tablica / Array:", arr1);
console.log("Szukamy / Searching for: 15");
console.log("Wynik / Result:", searchRotated(arr1, 15));
console.log("Oczekiwane / Expected: 0");
console.log();

console.log("=== Test 3: Element na końcu / Element at end ===");
console.log("Tablica / Array:", arr1);
console.log("Szukamy / Searching for: 14");
console.log("Wynik / Result:", searchRotated(arr1, 14));
console.log("Oczekiwane / Expected: 11");
console.log();

console.log("=== Test 4: Element nie istnieje / Element doesn't exist ===");
console.log("Tablica / Array:", arr1);
console.log("Szukamy / Searching for: 6");
console.log("Wynik / Result:", searchRotated(arr1, 6));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 5: Tablica nierotowana / Non-rotated array ===");
const arr5 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log("Tablica / Array:", arr5);
console.log("Szukamy / Searching for: 5");
console.log("Wynik / Result:", searchRotated(arr5, 5));
console.log("Oczekiwane / Expected: 4");
console.log();

console.log("=== Test 6: Rotacja o 1 / Rotation by 1 ===");
const arr6 = [9, 1, 2, 3, 4, 5, 6, 7, 8];
console.log("Tablica / Array:", arr6);
console.log("Szukamy / Searching for: 3");
console.log("Wynik / Result:", searchRotated(arr6, 3));
console.log("Oczekiwane / Expected: 3");
console.log();

console.log("=== Test 7: Pojedynczy element / Single element ===");
const arr7 = [5];
console.log("Tablica / Array:", arr7);
console.log("Szukamy / Searching for: 5");
console.log("Wynik / Result:", searchRotated(arr7, 5));
console.log("Oczekiwane / Expected: 0");
console.log("Szukamy / Searching for: 3");
console.log("Wynik / Result:", searchRotated(arr7, 3));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 8: Dwa elementy / Two elements ===");
const arr8 = [2, 1];
console.log("Tablica / Array:", arr8);
console.log("Szukamy / Searching for: 1");
console.log("Wynik / Result:", searchRotated(arr8, 1));
console.log("Oczekiwane / Expected: 1");
console.log("Szukamy / Searching for: 2");
console.log("Wynik / Result:", searchRotated(arr8, 2));
console.log("Oczekiwane / Expected: 0");
console.log();

console.log("=== Test 9: Znajdź punkt rotacji / Find rotation point ===");
console.log("Tablica / Array:", arr1);
console.log("Punkt rotacji / Rotation point:", findRotationPoint(arr1));
console.log("Element na tym indeksie / Element at this index:", arr1[findRotationPoint(arr1)]);
console.log("Oczekiwane / Expected: indeks 5, wartość 1");
console.log();

console.log("=== Test 10: Porównanie metod / Compare methods ===");
const arr10 = [4, 5, 6, 7, 0, 1, 2];
console.log("Tablica / Array:", arr10);
console.log("Szukamy / Searching for: 0");
console.log("Metoda 1 (zmodyfikowany binary search):", searchRotated(arr10, 0));
console.log("Metoda 2 (znajdź punkt rotacji, potem binary search):", searchRotatedAlternative(arr10, 0));
console.log("Obie powinny zwrócić / Both should return: 4");
console.log();

console.log("=== Test 11: Wszystkie elementy / All elements ===");
const arr11 = [7, 8, 9, 1, 2, 3, 4, 5, 6];
console.log("Tablica / Array:", arr11);
console.log("Szukanie wszystkich elementów / Searching all elements:");
for (let i = 0; i < arr11.length; i++) {
  const result = searchRotated(arr11, arr11[i]);
  console.log(`  Szukam ${arr11[i]}, znaleziono na indeksie ${result}, oczekiwane ${i}:`, result === i ? "✓" : "✗");
}
console.log();

console.log("=== Test 12: Edge cases ===");
console.log("Pusta tablica / Empty array:");
console.log("  Wynik / Result:", searchRotated([], 5));
console.log("  Oczekiwane / Expected: -1");
console.log();

console.log("Liczby ujemne / Negative numbers:");
const arr12 = [3, 4, 5, -2, -1, 0, 1, 2];
console.log("  Tablica / Array:", arr12);
console.log("  Szukamy -1 / Searching for -1:", searchRotated(arr12, -1));
console.log("  Oczekiwane / Expected: 4");
console.log();

// Eksportuj funkcje / Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchRotated,
    findRotationPoint,
    searchRotatedAlternative
  };
}
