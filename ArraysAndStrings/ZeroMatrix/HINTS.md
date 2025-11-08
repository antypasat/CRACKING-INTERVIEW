Jeśli element [i][j] == 0, cała i-ta kolumna i j-ty wiersz powinny być zero.

Proste (ale kosztowne): zapisz lokalizacje zer i potem ustaw odpowiednie wiersze/kolumny na 0 — pamięć O(M+N).

Optymalizacja in-place: użyj pierwszego wiersza i pierwszej kolumny jako pamięci pomocniczej (flag), dodatkowo trzymaj dwie zmienne wskazujące czy pierwszy wiersz/kolumna oryginalnie miały zero; potem użyj tych flag do wyzerowania — O(1) dodatkowej pamięci.
