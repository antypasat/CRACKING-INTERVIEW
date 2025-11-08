Kluczowy trik: jeśli s2 jest rotacją s1, to s2 musi być substringem s1+s1. Zatem sprawdź: len(s1)==len(s2) i isSubstring(s1+s1, s2).

Wymaga tylko jednego wywołania isSubstring na dłuższym stringu, stąd efektywność.

Upewnij się, że funkcja isSubstring jest opłacalna; ogólny koszt to O(n) lub O(n*m) zależnie od implementacji.
