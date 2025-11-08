function oneEditAway(str1, str2) {
  // If length difference is more than 1, impossible to be one edit away
  // Jeśli różnica długości jest większa niż 1, niemożliwe aby były oddalone o jedną edycję
  const lengthDiff = Math.abs(str1.length - str2.length);
  if (lengthDiff > 1) {
    return false;
  }

  // Get the shorter and longer strings
  // Pobierz krótszy i dłuższy string
  const shorter = str1.length < str2.length ? str1 : str2;
  const longer = str1.length >= str2.length ? str1 : str2;

  let index1 = 0; // pointer for shorter / wskaźnik dla krótszego
  let index2 = 0; // pointer for longer / wskaźnik dla dłuższego
  let foundDifference = false; // flag for tracking if we found a difference / flaga śledząca czy znaleźliśmy różnicę

  while (index1 < shorter.length && index2 < longer.length) {
    if (shorter[index1] !== longer[index2]) {
      // If we already found a difference, return false
      // Jeśli już znaleźliśmy różnicę, zwróć false
      if (foundDifference) {
        return false;
      }
      foundDifference = true;

      // If same length, move both pointers (replace case)
      // Jeśli ta sama długość, przesuń oba wskaźniki (przypadek zamiany)
      if (shorter.length === longer.length) {
        index1++;
      }
      // If different length, move only longer pointer (insert/remove case)
      // Jeśli różna długość, przesuń tylko dłuższy wskaźnik (przypadek wstawienia/usunięcia)
    } else {
      // Characters match, move shorter pointer
      // Znaki pasują, przesuń krótszy wskaźnik
      index1++;
    }
    // Always move longer pointer
    // Zawsze przesuń dłuższy wskaźnik
    index2++;
  }

  return true;
}

// Test cases / Przypadki testowe
console.log(oneEditAway("pale", "ple")); // true - remove 'a' / usuń 'a'
console.log(oneEditAway("pales", "pale")); // true - remove 's' / usuń 's'
console.log(oneEditAway("pale", "bale")); // true - replace 'p' with 'b' / zamień 'p' na 'b'
console.log(oneEditAway("pale", "bake")); // false - 2 edits needed / potrzebne 2 edycje
console.log(oneEditAway("pale", "pale")); // true - 0 edits / 0 edycji
