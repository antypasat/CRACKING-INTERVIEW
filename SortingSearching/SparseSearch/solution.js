/**
 * Sparse Search - Rzadkie Wyszukiwanie
 *
 * Wyszukuje string w posortowanej tablicy przeplatanych pustych stringów.
 * Searches for string in sorted array interspersed with empty strings.
 *
 * @param {string[]} arr - Tablica stringów / Array of strings
 * @param {string} target - String do znalezienia / String to find
 * @return {number} - Indeks elementu lub -1 / Index of element or -1
 */
function sparseSearch(arr, target) {
  if (!arr || arr.length === 0 || target === "") {
    return -1;
  }
  return sparseSearchHelper(arr, target, 0, arr.length - 1);
}

/**
 * Rekurencyjna funkcja pomocnicza
 * Recursive helper function
 */
function sparseSearchHelper(arr, target, left, right) {
  if (left > right) {
    return -1; // Nie znaleziono / Not found
  }

  let mid = Math.floor((left + right) / 2);

  // Jeśli mid jest pusty, znajdź najbliższy niepusty string
  // If mid is empty, find nearest non-empty string
  if (arr[mid] === "") {
    let leftIdx = mid - 1;
    let rightIdx = mid + 1;

    // Szukaj niepustego w obu kierunkach jednocześnie
    // Search for non-empty in both directions simultaneously
    while (true) {
      // Sprawdź czy wyszliśmy poza zakres w obu kierunkach
      // Check if we went out of bounds in both directions
      if (leftIdx < left && rightIdx > right) {
        return -1; // Wszystkie stringi w zakresie są puste / All strings in range are empty
      }

      // Sprawdź po prawej stronie / Check right side
      if (rightIdx <= right && arr[rightIdx] !== "") {
        mid = rightIdx;
        break;
      }

      // Sprawdź po lewej stronie / Check left side
      if (leftIdx >= left && arr[leftIdx] !== "") {
        mid = leftIdx;
        break;
      }

      // Rozszerz zakres wyszukiwania / Expand search range
      leftIdx--;
      rightIdx++;
    }
  }

  // Teraz wykonaj normalny binary search / Now perform normal binary search
  if (arr[mid] === target) {
    return mid; // Znaleziono / Found
  } else if (arr[mid] < target) {
    // Szukaj w prawej połowie / Search right half
    return sparseSearchHelper(arr, target, mid + 1, right);
  } else {
    // Szukaj w lewej połowie / Search left half
    return sparseSearchHelper(arr, target, left, mid - 1);
  }
}

/**
 * Wersja iteracyjna (bez rekurencji)
 * Iterative version (without recursion)
 */
function sparseSearchIterative(arr, target) {
  if (!arr || arr.length === 0 || target === "") {
    return -1;
  }

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    // Znajdź najbliższy niepusty / Find nearest non-empty
    if (arr[mid] === "") {
      let leftIdx = mid - 1;
      let rightIdx = mid + 1;
      let found = false;

      while (leftIdx >= left || rightIdx <= right) {
        if (rightIdx <= right && arr[rightIdx] !== "") {
          mid = rightIdx;
          found = true;
          break;
        }
        if (leftIdx >= left && arr[leftIdx] !== "") {
          mid = leftIdx;
          found = true;
          break;
        }
        leftIdx--;
        rightIdx++;
      }

      if (!found) {
        return -1; // Wszystkie puste / All empty
      }
    }

    // Binary search / Binary search
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

/**
 * Wersja zoptymalizowana - wybiera kierunek szukania niepustego
 * Optimized version - chooses direction for finding non-empty
 */
function sparseSearchOptimized(arr, target) {
  if (!arr || arr.length === 0 || target === "") {
    return -1;
  }

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === "") {
      let leftIdx = mid - 1;
      let rightIdx = mid + 1;

      // Najpierw sprawdź sąsiadujące / First check adjacent
      if (rightIdx <= right && arr[rightIdx] !== "") {
        mid = rightIdx;
      } else if (leftIdx >= left && arr[leftIdx] !== "") {
        mid = leftIdx;
      } else {
        // Rozszerzone wyszukiwanie / Extended search
        let found = false;
        while (leftIdx >= left || rightIdx <= right) {
          if (rightIdx <= right && arr[rightIdx] !== "") {
            mid = rightIdx;
            found = true;
            break;
          }
          if (leftIdx >= left && arr[leftIdx] !== "") {
            mid = leftIdx;
            found = true;
            break;
          }
          leftIdx--;
          rightIdx++;
        }
        if (!found) return -1;
      }
    }

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// ============================================
// TESTY / TESTS
// ============================================

console.log("=== Test 1: Przykład z zadania / Example from problem ===");
const arr1 = ["at", "", "", "", "ball", "", "", "car", "", "", "dad", "", ""];
console.log("Tablica / Array:", arr1);
console.log("Szukamy / Searching for: 'ball'");
console.log("Wynik / Result:", sparseSearch(arr1, "ball"));
console.log("Oczekiwane / Expected: 4");
console.log();

console.log("=== Test 2: Różne stringi / Various strings ===");
console.log("Tablica / Array:", arr1);
const tests2 = ["at", "car", "dad"];
tests2.forEach(target => {
  console.log(`Szukamy '${target}':`, sparseSearch(arr1, target));
});
console.log("Oczekiwane / Expected: 0, 7, 10");
console.log();

console.log("=== Test 3: String nie istnieje / String doesn't exist ===");
console.log("Szukamy / Searching for: 'dog'");
console.log("Wynik / Result:", sparseSearch(arr1, "dog"));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 4: Bez pustych stringów / No empty strings ===");
const arr4 = ["apple", "banana", "cherry", "date", "elderberry"];
console.log("Tablica / Array:", arr4);
console.log("Szukamy / Searching for: 'cherry'");
console.log("Wynik / Result:", sparseSearch(arr4, "cherry"));
console.log("Oczekiwane / Expected: 2");
console.log();

console.log("=== Test 5: Wszystkie puste oprócz jednego / All empty except one ===");
const arr5 = ["", "", "", "only", "", "", ""];
console.log("Tablica / Array:", arr5);
console.log("Szukamy / Searching for: 'only'");
console.log("Wynik / Result:", sparseSearch(arr5, "only"));
console.log("Oczekiwane / Expected: 3");
console.log();

console.log("=== Test 6: Wszystkie puste / All empty ===");
const arr6 = ["", "", "", "", ""];
console.log("Tablica / Array:", arr6);
console.log("Szukamy / Searching for: 'test'");
console.log("Wynik / Result:", sparseSearch(arr6, "test"));
console.log("Oczekiwane / Expected: -1");
console.log();

console.log("=== Test 7: Element na początku / Element at start ===");
const arr7 = ["alpha", "", "", "beta", "", "gamma"];
console.log("Tablica / Array:", arr7);
console.log("Szukamy / Searching for: 'alpha'");
console.log("Wynik / Result:", sparseSearch(arr7, "alpha"));
console.log("Oczekiwane / Expected: 0");
console.log();

console.log("=== Test 8: Element na końcu / Element at end ===");
console.log("Tablica / Array:", arr7);
console.log("Szukamy / Searching for: 'gamma'");
console.log("Wynik / Result:", sparseSearch(arr7, "gamma"));
console.log("Oczekiwane / Expected: 5");
console.log();

console.log("=== Test 9: Pojedynczy element niepusty / Single non-empty element ===");
const arr9 = ["hello"];
console.log("Tablica / Array:", arr9);
console.log("Szukamy / Searching for: 'hello'");
console.log("Wynik / Result:", sparseSearch(arr9, "hello"));
console.log("Oczekiwane / Expected: 0");
console.log();

console.log("=== Test 10: Porównanie metod / Compare methods ===");
const arr10 = ["", "a", "", "", "b", "", "c", "", "", "d", ""];
console.log("Tablica / Array:", arr10);
const target = "c";
console.log("Szukamy / Searching for:", target);
console.log("Rekurencyjna:", sparseSearch(arr10, target));
console.log("Iteracyjna:", sparseSearchIterative(arr10, target));
console.log("Zoptymalizowana:", sparseSearchOptimized(arr10, target));
console.log("Wszystkie powinny zwrócić / All should return: 6");
console.log();

console.log("=== Test 11: Duplikaty (edge case) ===");
const arr11 = ["", "apple", "", "", "apple", "", "banana", ""];
console.log("Tablica / Array:", arr11);
console.log("Szukamy / Searching for: 'apple'");
console.log("Wynik / Result:", sparseSearch(arr11, "apple"));
console.log("Może zwrócić 1 lub 4 (dowolny) / May return 1 or 4 (any)");
console.log();

console.log("=== Test 12: Wizualizacja procesu / Process visualization ===");
function sparseSearchWithLog(arr, target) {
  console.log(`Rozpoczynam wyszukiwanie '${target}'`);

  function helper(left, right, depth = 0) {
    const indent = "  ".repeat(depth);
    console.log(`${indent}Zakres [${left}, ${right}]`);

    if (left > right) {
      console.log(`${indent}Zakres pusty - nie znaleziono`);
      return -1;
    }

    let mid = Math.floor((left + right) / 2);
    console.log(`${indent}Mid = ${mid}, arr[${mid}] = '${arr[mid]}'`);

    if (arr[mid] === "") {
      console.log(`${indent}Mid jest puste, szukam niepustego...`);
      let leftIdx = mid - 1;
      let rightIdx = mid + 1;

      while (true) {
        if (leftIdx < left && rightIdx > right) {
          console.log(`${indent}Wszystkie puste w zakresie`);
          return -1;
        }

        if (rightIdx <= right && arr[rightIdx] !== "") {
          console.log(`${indent}Znaleziono niepuste po prawej: ${rightIdx} = '${arr[rightIdx]}'`);
          mid = rightIdx;
          break;
        }

        if (leftIdx >= left && arr[leftIdx] !== "") {
          console.log(`${indent}Znaleziono niepuste po lewej: ${leftIdx} = '${arr[leftIdx]}'`);
          mid = leftIdx;
          break;
        }

        leftIdx--;
        rightIdx++;
      }
    }

    if (arr[mid] === target) {
      console.log(`${indent}✓ ZNALEZIONO na indeksie ${mid}!`);
      return mid;
    } else if (arr[mid] < target) {
      console.log(`${indent}'${arr[mid]}' < '${target}', szukam w prawo`);
      return helper(mid + 1, right, depth + 1);
    } else {
      console.log(`${indent}'${arr[mid]}' > '${target}', szukam w lewo`);
      return helper(left, mid - 1, depth + 1);
    }
  }

  return helper(0, arr.length - 1);
}

const arr12 = ["", "", "b", "", "", "f", "", "h", "", ""];
console.log("Tablica / Array:", arr12);
const result12 = sparseSearchWithLog(arr12, "f");
console.log("Wynik końcowy / Final result:", result12);
console.log();

// Eksportuj funkcje / Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sparseSearch,
    sparseSearchIterative,
    sparseSearchOptimized
  };
}
