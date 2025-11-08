function isPalindromePermutationOptimized(str) {
  // We use a Set to track characters with odd counts
  // Używamy Set do śledzenia znaków z nieparzystą liczbą wystąpień
  const normalized = str.toLowerCase().replace(/\s/g, "");
  const oddChars = new Set();

  for (let char of normalized) {
    // Toggle: if char is in set, remove it; if not, add it
    // Przełączamy: jeśli znak jest w set, usuwamy go; jeśli nie, dodajemy
    if (oddChars.has(char)) {
      oddChars.delete(char);
    } else {
      oddChars.add(char);
    }
  }

  // Set size should be 0 or 1
  // Rozmiar Set powinien być 0 lub 1
  return oddChars.size <= 1;
}

// Test / Test
console.log(isPalindromePermutationOptimized("Tact Coa")); // true
