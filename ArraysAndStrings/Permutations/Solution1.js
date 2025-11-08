function checkPermutation(str1, str2) {
  // English: If lengths differ, they cannot be permutations
  // Polski: Jeśli długości się różnią, nie mogą być permutacjami
  if (str1.length !== str2.length) {
    return false;
  }

  // English: Sort both strings and compare
  // Polski: Posortuj oba stringi i porównaj
  const sorted1 = str1.split("").sort().join("");
  const sorted2 = str2.split("").sort().join("");

  return sorted1 === sorted2;
}

// Test cases | Przypadki testowe
console.log(checkPermutation("abc", "bca")); // true
console.log(checkPermutation("abc", "def")); // false
console.log(checkPermutation("hello", "olleh")); // true
