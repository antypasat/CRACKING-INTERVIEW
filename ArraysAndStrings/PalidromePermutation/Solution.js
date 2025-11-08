function isPalindromePermutation(str) {
  // Normalize the string: lowercase and remove spaces
  // Normalizujemy string: małe litery i usuwamy spacje
  const normalized = str.toLowerCase().replace(/\s/g, "");

  // Count character frequencies
  // Liczymy częstotliwość występowania znaków
  const charCount = {};
  for (let char of normalized) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Count how many characters have odd frequencies
  // Liczymy ile znaków ma nieparzystą częstotliwość
  let oddCount = 0;
  for (let count of Object.values(charCount)) {
    if (count % 2 === 1) {
      oddCount++;
    }
  }

  // At most one character can have odd frequency
  // Co najwyżej jeden znak może mieć nieparzystą częstotliwość
  return oddCount <= 1;
}

// Test cases / Przypadki testowe
console.log(isPalindromePermutation("Tact Coa")); // true
console.log(isPalindromePermutation("hello")); // false
console.log(isPalindromePermutation("aab")); // true
console.log(isPalindromePermutation("carerac")); // true
