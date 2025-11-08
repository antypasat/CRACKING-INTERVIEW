function checkPermutation(str1, str2) {
  // English: If lengths differ, they cannot be permutations
  // Polski: Jeśli długości się różnią, nie mogą być permutacjami
  if (str1.length !== str2.length) {
    return false;
  }

  // English: Create a character count map
  // Polski: Utwórz mapę liczności znaków
  const charCount = {};

  // English: Count characters in first string
  // Polski: Zlicz znaki w pierwszym stringu
  for (let char of str1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // English: Subtract counts for second string
  // Polski: Odejmij liczności dla drugiego stringu
  for (let char of str2) {
    if (!charCount[char]) {
      // English: Character not found or count already zero
      // Polski: Znak nie znaleziony lub liczność już zero
      return false;
    }
    charCount[char]--;
  }

  // English: If we got here, strings are permutations
  // Polski: Jeśli dotarliśmy tutaj, stringi są permutacjami
  return true;
}

// Test cases | Przypadki testowe
console.log(checkPermutation("abc", "bca")); // true
console.log(checkPermutation("abc", "def")); // false
console.log(checkPermutation("aab", "aba")); // true
