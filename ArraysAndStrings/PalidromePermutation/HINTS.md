Idea: permutacja palindromu ma co najwyżej jeden znak o nieparzystej liczbie wystąpień (dla nieparzystej długości), albo wszystkie znaki parzyste (dla parzystej).

Zlicz wystąpienia liter (ignoruj spacje i wielkość liter); sprawdź ile jest znaków z nieparzystą liczbą wystąpień.

Można użyć bitwektora (toggle bit dla każdej litery) aby sprawdzić warunek w O(n) i O(1) pamięci (dla ograniczonego alfabetu).
