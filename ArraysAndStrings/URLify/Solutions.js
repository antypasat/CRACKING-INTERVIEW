// Rozwiązanie 1: Proste, używające wbudowanych metod
// Solution 1: Simple, using built-in methods
function urlify(str, trueLength) {
  // Obetnij ciąg do prawdziwej długości i zamień spacje
  // Trim string to true length and replace spaces
  return str.substring(0, trueLength).replaceAll(" ", "%20");
}

// Rozwiązanie 2: Bardziej "ręczne" (bliższe intencji zadania)
// Solution 2: More "manual" (closer to the task's intent)
function urlifyManual(str, trueLength) {
  // Weź tylko część ciągu o prawdziwej długości
  // Take only the part of string with true length
  let result = "";

  for (let i = 0; i < trueLength; i++) {
    if (str[i] === " ") {
      // Jeśli spacja, dodaj '%20'
      // If space, add '%20'
      result += "%20";
    } else {
      // W przeciwnym razie, dodaj znak
      // Otherwise, add the character
      result += str[i];
    }
  }

  return result;
}

// Rozwiązanie 3: Używając split i join (eleganckie)
// Solution 3: Using split and join (elegant)
function urlifyClean(str, trueLength) {
  return str.substring(0, trueLength).split(" ").join("%20");
}

// Testy / Tests
console.log(urlify("Mr John Smith    ", 13)); // "Mr%20John%20Smith"
console.log(urlifyManual("Mr John Smith    ", 13)); // "Mr%20John%20Smith"
console.log(urlifyClean("Mr John Smith    ", 13)); // "Mr%20John%20Smith"
