Pracuj od końca tablicy znaków, kopiując znaki i zamieniając spacje na "%20" — wtedy operacja da się wykonać in-place bez nadpisania nieprzetworzonych znaków.

Najpierw policz liczbę spacji do true length, wyznacz indeks końcowy po ekspansji, potem przesuwaj od końca.

Upewnij się, że używasz „true length” (nie całej pojemności bufora), by nie zamieniać dodatkowych końcowych spacji.
