function isUniqueNoDS(str) {
  // Porównaj każdy znak z każdym innym znakiem
  // Compare each character with every other character
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j < str.length; j++) {
      if (str[i] === str[j]) {
        return false; // Znaleziono duplikat / Found duplicate
      }
    }
  }

  return true;
}
