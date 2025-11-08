// Rozwiązanie prawdziwie O(n) czasu i pamięci
// True O(n) time and space solution
function urlifyOptimal(str, trueLength) {
  // Tablica znaków (jak w Javie)
  // Character array (like in Java)
  const chars = [];

  // Jeden przechód przez string
  // Single pass through string
  for (let i = 0; i < trueLength; i++) {
    if (str[i] === " ") {
      // Dodaj '%20' jako 3 osobne znaki
      // Add '%20' as 3 separate characters
      chars.push("%");
      chars.push("2");
      chars.push("0");
    } else {
      chars.push(str[i]);
    }
  }

  // Połącz tablicę w string (O(n))
  // Join array into string (O(n))
  return chars.join("");
}

console.log(urlifyOptimal("Mr John Smith    ", 13)); // "Mr%20John%20Smith"
