/**
 * English Int - Convert number to English words
 */

function numberToWords(num) {
  if (num === 0) return "Zero";
  if (num < 0) return "Negative " + numberToWords(-num);

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
                 "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion", "Trillion"];

  function convertHundreds(n) {
    if (n === 0) return "";
    else if (n < 10) return ones[n];
    else if (n < 20) return teens[n - 10];
    else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    else return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertHundreds(n % 100) : "");
  }

  let result = "";
  let groupIndex = 0;

  while (num > 0) {
    const group = num % 1000;
    if (group !== 0) {
      const groupWords = convertHundreds(group);
      const suffix = thousands[groupIndex] ? " " + thousands[groupIndex] : "";
      result = groupWords + suffix + (result ? ", " + result : "");
    }
    num = Math.floor(num / 1000);
    groupIndex++;
  }

  return result;
}

console.log('=== Number to English Words ===\n');

// Testy
console.log(numberToWords(0)); // Zero
console.log(numberToWords(1)); // One
console.log(numberToWords(10)); // Ten
console.log(numberToWords(19)); // Nineteen
console.log(numberToWords(20)); // Twenty
console.log(numberToWords(99)); // Ninety Nine
console.log(numberToWords(123)); // One Hundred Twenty Three
console.log(numberToWords(1234)); // One Thousand, Two Hundred Thirty Four
console.log(numberToWords(12345)); // Twelve Thousand, Three Hundred Forty Five
console.log(numberToWords(123456)); // One Hundred Twenty Three Thousand, Four Hundred Fifty Six
console.log(numberToWords(1234567)); // One Million, Two Hundred Thirty Four Thousand, Five Hundred Sixty Seven
console.log(numberToWords(1000000000)); // One Billion
console.log(numberToWords(-1234)); // Negative One Thousand, Two Hundred Thirty Four
