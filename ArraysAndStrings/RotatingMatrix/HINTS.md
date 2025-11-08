Rotacja 90° w miejscu (in-place) możliwa przez warstwowe wykonywanie operacji: dla każdej „warstwy” macierz przesuwasz cztery elementy po cyklu (góra→prawo→dół→lewo).

Podejście warstwa po warstwie daje O(N^2) czasu i O(1) dodatkowej pamięci.

Alternatywnie: transpozycja macierzy + odwrócenie kolumn (lub wierszy) daje czytelne rozwiązanie.
