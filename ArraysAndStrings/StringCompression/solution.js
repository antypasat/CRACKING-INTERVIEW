function compressString(str) {
  // Sprawdź przypadek brzegowy: pusty string lub jeden znak
  // Check edge case: empty string or single character
  if (str.length <= 1) {
    return str;
  }

  // Zbuduj skompresowany string
  // Build compressed string
  let compressed = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    // Jeśli następny znak jest taki sam, zwiększ licznik
    // If next character is the same, increase counter
    if (i + 1 < str.length && str[i] === str[i + 1]) {
      count++;
    } else {
      // Dodaj znak i jego liczbę do wyniku
      // Add character and its count to result
      compressed += str[i] + count;
      count = 1; // Reset licznika / Reset counter
    }
  }

  // Zwróć krótszy string (oryginalny lub skompresowany)
  // Return shorter string (original or compressed)
  return compressed.length < str.length ? compressed : str;
}

// Testy / Tests
console.log(compressString("aabcccccaaa")); // "a2b1c5a3"
console.log(compressString("abcdef")); // "abcdef" (kompresja nie skraca / compression doesn't shorten)
console.log(compressString("aabbcc")); // "aabbcc" (równa długość, zwróć oryginał / equal length, return original)
console.log(compressString("aaaa")); // "a4"
console.log(compressString("a")); // "a"
console.log(compressString("")); // ""
