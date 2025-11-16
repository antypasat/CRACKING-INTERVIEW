Sprawdź czy wystarczy użyć struktur pomocniczych (hash set, boolean array) aby zapamiętać już widziane znaki; to daje O(n) czasu i O(k) pamięci (k = rozmiar alfabetu).

Jeżeli nie możesz użyć dodatkowych struktur: posortuj ciąg i sprawdź sąsiadujące znaki (O(n log n) czasu, O(1) dodatkowej pamięci jeśli sortujesz in-place) lub porównuj każdy znak z każdym (O(n^2), O(1)).

Dla ograniczonych alfabetów (np. ASCII) możesz użyć bitwektora żeby zmniejszyć pamięć (jeśli tylko małe litery — użyj jednej liczby jako mapy bitowej).
