/**
 * Peaks and Valleys - Szczyty i Doliny
 */

function peaksAndValleys(arr) {
  for (let i = 1; i < arr.length; i += 2) {
    // Upewnij się że element na nieparzystym indeksie jest szczytem
    // Ensure element at odd index is a peak

    const prev = arr[i - 1];
    const curr = arr[i];
    const next = i + 1 < arr.length ? arr[i + 1] : Number.MIN_SAFE_INTEGER;

    // Znajdź największy z trzech
    const maxVal = Math.max(prev, curr, next);

    if (maxVal === prev) {
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]; // Zamień z prev
    } else if (maxVal === next) {
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; // Zamień z next
    }
    // Jeśli curr jest największy, nic nie rób
  }
  return arr;
}

function isPeaksAndValleys(arr) {
  for (let i = 1; i < arr.length - 1; i++) {
    const prev = arr[i - 1];
    const curr = arr[i];
    const next = arr[i + 1];

    const isPeak = curr >= prev && curr >= next;
    const isValley = curr <= prev && curr <= next;

    if (!isPeak && !isValley) {
      return false;
    }
  }
  return true;
}

// TESTY
console.log("=== Peaks and Valleys ===\n");

const arr1 = [5, 3, 1, 2, 3];
console.log("Input:", arr1);
console.log("Output:", peaksAndValleys([...arr1]));
console.log("Is valid?", isPeaksAndValleys(peaksAndValleys([...arr1])));
console.log();

const arr2 = [9, 1, 0, 4, 8, 7];
console.log("Input:", arr2);
const result2 = peaksAndValleys([...arr2]);
console.log("Output:", result2);
console.log("Is valid?", isPeaksAndValleys(result2));
console.log();

const arr3 = [1, 2, 3, 4, 5];
console.log("Input:", arr3);
const result3 = peaksAndValleys([...arr3]);
console.log("Output:", result3);
console.log("Is valid?", isPeaksAndValleys(result3));

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { peaksAndValleys, isPeaksAndValleys };
}
