function checkPermutation(str1, str2) {
  // English: Check lengths first
  // Polski: Najpierw sprawdź długości
  if (str1.length !== str2.length) return false;

  // English: Use Map for character counting
  // Polski: Użyj Map do liczenia znaków
  const charMap = new Map();

  // English: Increment counts for str1
  // Polski: Zwiększ liczności dla str1
  for (let char of str1) {
    charMap.set(char, (charMap.get(char) || 0) + 1);
  }

  // English: Decrement counts for str2
  // Polski: Zmniejsz liczności dla str2
  for (let char of str2) {
    if (!charMap.has(char)) return false;
    charMap.set(char, charMap.get(char) - 1);
    if (charMap.get(char) < 0) return false;
  }

  return true;
}
