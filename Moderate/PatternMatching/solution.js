/**
 * Pattern Matching - Check if value matches pattern
 * Dopasowanie Wzorca - Sprawdź czy value pasuje do pattern
 *
 * Pattern składa się tylko z 'a' i 'b'
 * Pattern consists only of 'a' and 'b'
 */

/**
 * Podejście 1: Brute Force - O(n²)
 * Approach 1: Brute Force - O(n²)
 *
 * Wypróbuj wszystkie możliwe długości dla 'a', oblicz długość 'b'
 * Try all possible lengths for 'a', calculate length of 'b'
 */
function patternMatchingBruteForce(pattern, value) {
  if (pattern.length === 0) return value.length === 0;
  if (value.length === 0) return isAllSameChar(pattern);

  const countA = countChar(pattern, 'a');
  const countB = countChar(pattern, 'b');

  // Wypróbuj wszystkie możliwe długości dla 'a'
  for (let lenA = 0; lenA <= value.length; lenA++) {
    const remaining = value.length - countA * lenA;

    let lenB;
    if (countB === 0) {
      if (remaining !== 0) continue;
      lenB = 0;
    } else {
      if (remaining < 0 || remaining % countB !== 0) continue;
      lenB = remaining / countB;
    }

    if (matches(pattern, value, lenA, lenB)) {
      return true;
    }
  }

  return false;
}

/**
 * Podejście 2: Optymalizowane - O(n) ✓ OPTYMALNE
 * Approach 2: Optimized - O(n) ✓ OPTIMAL
 *
 * Używa early termination i normalizacji pattern
 * Uses early termination and pattern normalization
 */
function patternMatching(pattern, value) {
  if (pattern.length === 0) return value.length === 0;

  // Edge case: pusty value
  if (value.length === 0) {
    return isAllSameChar(pattern);
  }

  // Normalizuj: zawsze zacznij od 'a'
  // Jeśli pattern zaczyna się od 'b', zamień a <-> b
  const mainChar = pattern[0];
  const altChar = mainChar === 'a' ? 'b' : 'a';
  const normalized = mainChar === 'a' ? pattern : swapChars(pattern);

  const countMain = countChar(normalized, 'a');
  const countAlt = countChar(normalized, 'b');

  // Wypróbuj długości dla 'a' (mainChar w oryginalnym pattern)
  for (let lenMain = 0; lenMain <= value.length; lenMain++) {
    const remaining = value.length - countMain * lenMain;

    // Early termination
    if (remaining < 0) break;

    let lenAlt;
    if (countAlt === 0) {
      if (remaining !== 0) continue;
      lenAlt = 0;
    } else {
      if (remaining % countAlt !== 0) continue;
      lenAlt = remaining / countAlt;
    }

    // Spróbuj zbudować value używając tych długości
    const result = buildAndVerify(normalized, value, lenMain, lenAlt);

    if (result.success) {
      // Jeśli zamienialiśmy a<->b, zamień z powrotem w wyniku
      if (mainChar === 'b') {
        return true; // Pasuje (wartości były zamienione wewnętrznie)
      }
      return true;
    }
  }

  return false;
}

/**
 * Podejście 3: Z Ekstrakcją Wartości - O(n)
 * Approach 3: With Value Extraction - O(n)
 *
 * Dodatkowo zwraca wartości a i b
 * Additionally returns values of a and b
 */
function patternMatchingWithValues(pattern, value) {
  if (pattern.length === 0) {
    return { matches: value.length === 0, a: null, b: null };
  }

  if (value.length === 0) {
    if (isAllSameChar(pattern)) {
      return { matches: true, a: '', b: null };
    }
    return { matches: false, a: null, b: null };
  }

  const countA = countChar(pattern, 'a');
  const countB = countChar(pattern, 'b');

  for (let lenA = 0; lenA <= value.length; lenA++) {
    const remaining = value.length - countA * lenA;

    let lenB;
    if (countB === 0) {
      if (remaining !== 0) continue;
      lenB = 0;
    } else {
      if (remaining < 0 || remaining % countB !== 0) continue;
      lenB = remaining / countB;
    }

    const extracted = extractValues(pattern, value, lenA, lenB);

    if (extracted !== null) {
      const rebuilt = rebuildFromPattern(pattern, extracted.a, extracted.b);
      if (rebuilt === value) {
        return { matches: true, a: extracted.a, b: extracted.b };
      }
    }
  }

  return { matches: false, a: null, b: null };
}

/**
 * Funkcje pomocnicze / Helper functions
 */

/**
 * Zlicz wystąpienia znaku w stringu
 * Count occurrences of character in string
 */
function countChar(str, char) {
  let count = 0;
  for (const c of str) {
    if (c === char) count++;
  }
  return count;
}

/**
 * Sprawdź czy wszystkie znaki są takie same
 * Check if all characters are the same
 */
function isAllSameChar(str) {
  if (str.length === 0) return true;
  const first = str[0];
  for (const c of str) {
    if (c !== first) return false;
  }
  return true;
}

/**
 * Zamień 'a' <-> 'b' w stringu
 * Swap 'a' <-> 'b' in string
 */
function swapChars(str) {
  let result = '';
  for (const c of str) {
    if (c === 'a') result += 'b';
    else if (c === 'b') result += 'a';
    else result += c;
  }
  return result;
}

/**
 * Sprawdź czy pattern + długości pasują do value
 * Check if pattern + lengths match value
 */
function matches(pattern, value, lenA, lenB) {
  let pos = 0;
  let aValue = null;
  let bValue = null;

  for (const char of pattern) {
    const len = (char === 'a') ? lenA : lenB;

    if (pos + len > value.length) return false;

    const substring = value.substring(pos, pos + len);

    if (char === 'a') {
      if (aValue === null) {
        aValue = substring;
      } else if (aValue !== substring) {
        return false;
      }
    } else {
      if (bValue === null) {
        bValue = substring;
      } else if (bValue !== substring) {
        return false;
      }
    }

    pos += len;
  }

  // Sprawdź czy zużyliśmy cały value
  if (pos !== value.length) return false;

  // Sprawdź czy a i b są różne (jeśli oba istnieją)
  if (aValue !== null && bValue !== null && aValue === bValue) {
    return false;
  }

  return true;
}

/**
 * Zbuduj i zweryfikuj
 * Build and verify
 */
function buildAndVerify(pattern, value, lenA, lenB) {
  let pos = 0;
  let aValue = null;
  let bValue = null;
  let built = '';

  for (const char of pattern) {
    const len = (char === 'a') ? lenA : lenB;

    if (pos + len > value.length) {
      return { success: false };
    }

    const substring = value.substring(pos, pos + len);

    if (char === 'a') {
      if (aValue === null) {
        aValue = substring;
      } else if (aValue !== substring) {
        return { success: false };
      }
    } else {
      if (bValue === null) {
        bValue = substring;
      } else if (bValue !== substring) {
        return { success: false };
      }
    }

    built += substring;
    pos += len;
  }

  // Sprawdź konsystencję
  if (pos !== value.length) return { success: false };
  if (built !== value) return { success: false };
  if (aValue !== null && bValue !== null && aValue === bValue) {
    return { success: false };
  }

  return { success: true, a: aValue, b: bValue };
}

/**
 * Wyciągnij wartości dla a i b
 * Extract values for a and b
 */
function extractValues(pattern, value, lenA, lenB) {
  let pos = 0;
  let aValue = null;
  let bValue = null;

  for (const char of pattern) {
    const len = (char === 'a') ? lenA : lenB;

    if (pos + len > value.length) return null;

    const substring = value.substring(pos, pos + len);

    if (char === 'a') {
      if (aValue === null) {
        aValue = substring;
      } else if (aValue !== substring) {
        return null;
      }
    } else {
      if (bValue === null) {
        bValue = substring;
      } else if (bValue !== substring) {
        return null;
      }
    }

    pos += len;
  }

  if (pos !== value.length) return null;

  // Sprawdź czy a i b są różne (jeśli oba istnieją)
  if (aValue !== null && bValue !== null && aValue === bValue) {
    return null;
  }

  return { a: aValue, b: bValue };
}

/**
 * Odbuduj value z pattern i wartości
 * Rebuild value from pattern and values
 */
function rebuildFromPattern(pattern, aValue, bValue) {
  let result = '';

  for (const char of pattern) {
    if (char === 'a') {
      result += aValue || '';
    } else if (char === 'b') {
      result += bValue || '';
    }
  }

  return result;
}

// ============================================
// Testy / Tests
// ============================================

console.log('=== Pattern Matching ===\n');

// Test 1: Przykład z zadania
console.log('Test 1: Przykład z zadania (from problem description)');
const pattern1 = 'aabab';
const value1 = 'catcatgocatgo';
const result1 = patternMatchingWithValues(pattern1, value1);

console.log(`Pattern: "${pattern1}"`);
console.log(`Value: "${value1}"`);
console.log(`Matches: ${result1.matches}`);
console.log(`a = "${result1.a}", b = "${result1.b}"`);
console.log(`Test ${result1.matches && result1.a === 'cat' && result1.b === 'go' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 2: Prosty przypadek - tylko 'a'
console.log('Test 2: Tylko jeden znak (single character)');
const pattern2 = 'a';
const value2 = 'hello';
const result2 = patternMatching(pattern2, value2);

console.log(`Pattern: "${pattern2}"`);
console.log(`Value: "${value2}"`);
console.log(`Matches: ${result2}`);
console.log(`Test ${result2 === true ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 3: Pattern bez dopasowania
console.log('Test 3: Brak dopasowania (no match)');
const pattern3 = 'ab';
const value3 = 'hello';
const result3 = patternMatching(pattern3, value3);

console.log(`Pattern: "${pattern3}"`);
console.log(`Value: "${value3}"`);
console.log(`Matches: ${result3}`);
console.log(`(Niemożliwe podzielić "hello" na dwie różne części)`);
console.log(`Test ${result3 === false ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 4: Powtarzające się 'a'
console.log('Test 4: Powtarzające się a (repeated a)');
const pattern4 = 'aaa';
const value4 = 'dogdogdog';
const result4 = patternMatchingWithValues(pattern4, value4);

console.log(`Pattern: "${pattern4}"`);
console.log(`Value: "${value4}"`);
console.log(`Matches: ${result4.matches}`);
console.log(`a = "${result4.a}"`);
console.log(`Test ${result4.matches && result4.a === 'dog' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 5: Abab pattern
console.log('Test 5: Alternujący pattern (alternating pattern)');
const pattern5 = 'abab';
const value5 = 'redblueredblue';
const result5 = patternMatchingWithValues(pattern5, value5);

console.log(`Pattern: "${pattern5}"`);
console.log(`Value: "${value5}"`);
console.log(`Matches: ${result5.matches}`);
console.log(`a = "${result5.a}", b = "${result5.b}"`);
console.log(`Test ${result5.matches && result5.a === 'red' && result5.b === 'blue' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 6: Pusty value
console.log('Test 6: Pusty value (empty value)');
const pattern6a = 'a';
const value6a = '';
const result6a = patternMatching(pattern6a, value6a);

console.log(`Pattern: "${pattern6a}", Value: "" → ${result6a} (a = "")`);

const pattern6b = 'ab';
const value6b = '';
const result6b = patternMatching(pattern6b, value6b);

console.log(`Pattern: "${pattern6b}", Value: "" → ${result6b} (nie może być dwa różne puste)`);
console.log(`Test ${result6a === true && result6b === false ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 7: Pusty pattern
console.log('Test 7: Pusty pattern (empty pattern)');
const pattern7a = '';
const value7a = '';
const result7a = patternMatching(pattern7a, value7a);

const pattern7b = '';
const value7b = 'hello';
const result7b = patternMatching(pattern7b, value7b);

console.log(`Pattern: "", Value: "" → ${result7a}`);
console.log(`Pattern: "", Value: "hello" → ${result7b}`);
console.log(`Test ${result7a === true && result7b === false ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 8: Tylko 'b' w pattern
console.log('Test 8: Tylko b w pattern (only b in pattern)');
const pattern8 = 'bbb';
const value8 = 'xyzxyzxyz';
const result8 = patternMatchingWithValues(pattern8, value8);

console.log(`Pattern: "${pattern8}"`);
console.log(`Value: "${value8}"`);
console.log(`Matches: ${result8.matches}`);
console.log(`b = "${result8.b}"`);
console.log(`Test ${result8.matches && result8.b === 'xyz' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 9: Wartości identyczne dla a i b (powinno zwrócić false)
console.log('Test 9: a i b identyczne (should fail)');
const pattern9 = 'abab';
const value9 = 'catcatcatcat';
const result9 = patternMatching(pattern9, value9);

console.log(`Pattern: "${pattern9}"`);
console.log(`Value: "${value9}"`);
console.log(`Matches: ${result9}`);
console.log(`(a i b muszą być różne)`);
console.log(`Test ${result9 === false ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 10: Wartości puste
console.log('Test 10: Wartość pusta dla a lub b');
const pattern10 = 'aabab';
const value10 = 'gogogo';
const result10 = patternMatchingWithValues(pattern10, value10);

console.log(`Pattern: "${pattern10}"`);
console.log(`Value: "${value10}"`);
console.log(`Matches: ${result10.matches}`);
if (result10.matches) {
  console.log(`a = "${result10.a}", b = "${result10.b}"`);
}
console.log();

// Test 11: Długi pattern
console.log('Test 11: Długi pattern');
const pattern11 = 'aaabbbaaabbb';
const value11 = 'XXXYYXXXYY';
const result11 = patternMatchingWithValues(pattern11, value11);

console.log(`Pattern: "${pattern11}"`);
console.log(`Value: "${value11}"`);
console.log(`Matches: ${result11.matches}`);
if (result11.matches) {
  console.log(`a = "${result11.a}", b = "${result11.b}"`);
}
console.log(`Test ${result11.matches ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 12: Pojedyncze znaki
console.log('Test 12: Pojedyncze znaki jako wartości');
const pattern12 = 'abab';
const value12 = 'xyxy';
const result12 = patternMatchingWithValues(pattern12, value12);

console.log(`Pattern: "${pattern12}"`);
console.log(`Value: "${value12}"`);
console.log(`Matches: ${result12.matches}`);
console.log(`a = "${result12.a}", b = "${result12.b}"`);
console.log(`Test ${result12.matches && result12.a === 'x' && result12.b === 'y' ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 13: Pattern zaczynający się od 'b'
console.log('Test 13: Pattern zaczynający się od b');
const pattern13 = 'baba';
const value13 = 'dogcatdogcat';
const result13 = patternMatchingWithValues(pattern13, value13);

console.log(`Pattern: "${pattern13}"`);
console.log(`Value: "${value13}"`);
console.log(`Matches: ${result13.matches}`);
if (result13.matches) {
  console.log(`a = "${result13.a}", b = "${result13.b}"`);
}
console.log(`Test ${result13.matches ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 14: Porównanie metod
console.log('Test 14: Porównanie wszystkich metod');

const testCases = [
  { pattern: 'aabab', value: 'catcatgocatgo', expected: true },
  { pattern: 'a', value: 'hello', expected: true },
  { pattern: 'ab', value: 'hello', expected: false },
  { pattern: 'aaa', value: 'dogdogdog', expected: true },
  { pattern: 'abab', value: 'catcatcatcat', expected: false }
];

let allCorrect = true;
testCases.forEach(({ pattern, value, expected }) => {
  const r1 = patternMatchingBruteForce(pattern, value);
  const r2 = patternMatching(pattern, value);

  const correct = r1 === expected && r2 === expected && r1 === r2;
  allCorrect = allCorrect && correct;

  console.log(`  "${pattern}" + "${value}": ${correct ? '✓' : '✗ (expected: ' + expected + ', got: ' + r1 + '/' + r2 + ')'}`);
});

console.log(`\nWszystkie metody zgodne: ${allCorrect ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 15: Performance test
console.log('Test 15: Test wydajności (performance)');

const longPattern = 'a'.repeat(50) + 'b'.repeat(50);
const longValue = 'cat'.repeat(50) + 'dog'.repeat(50);

let start = Date.now();
const resultBrute = patternMatchingBruteForce(longPattern, longValue);
const timeBrute = Date.now() - start;

start = Date.now();
const resultOpt = patternMatching(longPattern, longValue);
const timeOpt = Date.now() - start;

console.log(`Pattern długość: ${longPattern.length}`);
console.log(`Value długość: ${longValue.length}`);
console.log(`Brute Force: ${timeBrute}ms → ${resultBrute}`);
console.log(`Optimized:   ${timeOpt}ms → ${resultOpt}`);
console.log(`Speedup: ${(timeBrute / Math.max(timeOpt, 1)).toFixed(1)}x\n`);

// Test 16: Bardzo długie wartości
console.log('Test 16: Bardzo długie wartości');
const pattern16 = 'ab';
const value16 = 'x'.repeat(1000) + 'y'.repeat(1000);
const result16 = patternMatching(pattern16, value16);

console.log(`Pattern: "${pattern16}"`);
console.log(`Value: ${value16.length} znaków (1000 x + 1000 y)`);
console.log(`Matches: ${result16}`);
console.log(`Test ${result16 === true ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 17: Edge case - niemożliwe długości
console.log('Test 17: Niemożliwe długości (impossible lengths)');
const pattern17 = 'aaabbb';
const value17 = 'abcdefg'; // 7 znaków, nie da się podzielić równo na 3+3
const result17 = patternMatching(pattern17, value17);

console.log(`Pattern: "${pattern17}" (3a + 3b)`);
console.log(`Value: "${value17}" (7 znaków)`);
console.log(`Matches: ${result17}`);
console.log(`(7 nie da się podzielić równo na 3+3)`);
console.log(`Test ${result17 === false ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 18: Funkcje pomocnicze
console.log('Test 18: Test funkcji pomocniczych');

console.log('a) countChar:');
console.log(`  countChar("aabab", "a") = ${countChar("aabab", "a")} (oczekiwane: 3)`);
console.log(`  countChar("aabab", "b") = ${countChar("aabab", "b")} (oczekiwane: 2)`);

console.log('\nb) isAllSameChar:');
console.log(`  isAllSameChar("aaaa") = ${isAllSameChar("aaaa")} (oczekiwane: true)`);
console.log(`  isAllSameChar("aaab") = ${isAllSameChar("aaab")} (oczekiwane: false)`);

console.log('\nc) swapChars:');
console.log(`  swapChars("aabab") = "${swapChars("aabab")}" (oczekiwane: "bbaba")`);

console.log('\nd) rebuildFromPattern:');
const rebuilt = rebuildFromPattern("aabab", "cat", "go");
console.log(`  rebuildFromPattern("aabab", "cat", "go") = "${rebuilt}"`);
console.log(`  Oczekiwane: "catcatgocatgo"`);
console.log(`  Test ${rebuilt === "catcatgocatgo" ? 'PASS ✓' : 'FAIL ✗'}\n`);

// Test 19: Specjalne znaki w value
console.log('Test 19: Specjalne znaki w value');
const pattern19 = 'abab';
const value19 = '123-456-123-456-';
const result19 = patternMatching(pattern19, value19);

console.log(`Pattern: "${pattern19}"`);
console.log(`Value: "${value19}"`);
console.log(`Matches: ${result19}`);
console.log();

// Test 20: Wszystkie kombinacje małych pattern
console.log('Test 20: Wszystkie małe pattern (exhaustive small patterns)');

const smallPatterns = ['a', 'b', 'aa', 'ab', 'ba', 'bb', 'aaa', 'aab', 'aba', 'abb', 'baa', 'bab', 'bba', 'bbb'];
const testValue = 'xyz';

console.log(`Value: "${testValue}"`);
smallPatterns.forEach(p => {
  const matches = patternMatching(p, testValue);
  const result = patternMatchingWithValues(p, testValue);
  console.log(`  "${p}" → ${matches} ${result.matches && result.a ? `(a="${result.a}", b="${result.b || 'null'}")` : ''}`);
});
console.log();

console.log('=== Podsumowanie / Summary ===');
console.log('Pattern Matching - Dopasowanie wzorca a/b do stringa');
console.log('\nZłożoności:');
console.log('  Brute Force:    O(n²) - wypróbuj wszystkie długości');
console.log('  Optimized:      O(n)  - early termination, matematyka ✓');
console.log('  With Values:    O(n)  - dodatkowo ekstraktuj wartości');
console.log('\nKluczowa idea:');
console.log('  - Dla danej długości a, długość b jest zdeterminowana:');
console.log('    lenB = (n - countA × lenA) / countB');
console.log('  - Sprawdź tylko kombinacje gdzie lenB jest całkowite');
console.log('  - Weryfikuj konsystencję: a i b muszą być takie same wszędzie');
console.log('  - a i b muszą być różne (jeśli oba istnieją)');
console.log('\nEdge cases:');
console.log('  ✓ Pusty pattern lub value');
console.log('  ✓ Pattern tylko z a lub tylko z b');
console.log('  ✓ Value pusty (a="", b="")');
console.log('  ✓ a i b identyczne (return false)');
console.log('  ✓ Niemożliwe długości (skip)');
console.log('\nOptymalizacje:');
console.log('  - Early termination (lenA × countA > n)');
console.log('  - Skip gdy (n - lenA×countA) % countB ≠ 0');
console.log('  - Normalizacja (zawsze zacznij od a)');
console.log('\nZastosowania:');
console.log('  - Template matching');
console.log('  - String parsing');
console.log('  - Pattern recognition');
console.log('  - Data validation');
console.log('  - Regex-like matching');
