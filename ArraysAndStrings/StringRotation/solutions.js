function isRotation(s1, s2) {
  // Check if lengths are equal and not empty
  // Sprawdź czy długości są równe i niepuste
  if (s1.length !== s2.length || s1.length === 0) {
    return false;
  }

  // Concatenate s1 with itself
  // Połącz s1 ze sobą
  const s1s1 = s1 + s1;

  // Check if s2 is substring of s1+s1 (only one call to isSubstring)
  // Sprawdź czy s2 jest podciągiem s1+s1 (tylko jedno wywołanie isSubstring)
  return isSubstring(s1s1, s2);
}

// Helper function (this would be provided in the problem)
// Funkcja pomocnicza (to byłoby dostarczone w problemie)
function isSubstring(str, substr) {
  return str.includes(substr);
}

// Test cases / Przypadki testowe
console.log(isRotation("waterbottle", "erbottlewat")); // true
console.log(isRotation("hello", "lohel")); // true
console.log(isRotation("hello", "world")); // false
console.log(isRotation("abc", "bca")); // true
console.log(isRotation("abc", "cab")); // true
console.log(isRotation("abc", "acb")); // false (not a rotation / nie rotacja)
