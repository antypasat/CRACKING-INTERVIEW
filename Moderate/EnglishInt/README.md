# 16.8 English Int

## Opis Zadania / Problem Description

**English Int**: Given any integer, print an English phrase that describes the integer (e.g., "One Thousand, Two Hundred Thirty Four").

**Liczba po Angielsku**: Dla dowolnej liczby całkowitej, wypisz frazę po angielsku opisującą tę liczbę.

Hints: #502, #588, #688

## Rozwiązanie / Solution

Podziel liczbę na grupy po 3 cyfry (setki, dziesiątki, jedności) i dodaj odpowiednie sufiksy (Thousand, Million, Billion).

Divide number into groups of 3 digits (hundreds, tens, ones) and add appropriate suffixes (Thousand, Million, Billion).

```javascript
function numberToWords(num) {
  if (num === 0) return "Zero";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion"];

  function helper(n) {
    if (n === 0) return "";
    else if (n < 10) return ones[n];
    else if (n < 20) return teens[n - 10];
    else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    else return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + helper(n % 100) : "");
  }

  let result = "";
  let i = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      result = helper(num % 1000) + (thousands[i] ? " " + thousands[i] : "") + (result ? ", " + result : "");
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return result;
}
```
