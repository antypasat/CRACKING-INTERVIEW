Najpierw porównaj długości: różnica >1 → false.

Dla równej długości sprawdź czy są co najwyżej jedne różniące się znaki (replace).

Dla długości różniących się o 1: użyj dwóch wskaźników, przesuwaj je i pozwól na jedno wstawienie/usunięcie — jeśli potrzeba więcej niż jedno przesunięcie → false.

Działa w O(n) czasie, O(1) dodatkowej pamięci.
