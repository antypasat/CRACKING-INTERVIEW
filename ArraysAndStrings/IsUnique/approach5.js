function isUniqueBitVector(str) {
  // Zakładamy tylko małe litery a-z
  // Assume only lowercase letters a-z
  let checker = 0;

  for (let char of str) {
    const val = char.charCodeAt(0) - "a".charCodeAt(0);

    // Sprawdź czy bit jest już ustawiony
    // Check if bit is already set
    if ((checker & (1 << val)) > 0) {
      return false;
    }

    // Ustaw bit dla tego znaku
    // Set bit for this character
    checker |= 1 << val;
  }

  return true;
}
