# 16.4 Tic Tac Win

## Opis Zadania / Problem Description

**Tic Tac Win**: Design an algorithm to figure out if someone has won a game of tic-tac-toe.

**Kółko i Krzyżyk Wygrana**: Zaprojektuj algorytm, który sprawdza czy ktoś wygrał grę w kółko i krzyżyk.

Hints: #710, #732

## Wyjaśnienie Problemu / Problem Explanation

Mamy planszę 3x3 (lub NxN) do gry w kółko i krzyżyk. Musimy sprawdzić czy któryś gracz wygrał. Wygrana następuje gdy:
- Cały rząd zawiera ten sam symbol
- Cała kolumna zawiera ten sam symbol
- Cała przekątna zawiera ten sam symbol

We have a 3x3 (or NxN) tic-tac-toe board. We need to check if any player has won. A win occurs when:
- An entire row contains the same symbol
- An entire column contains the same symbol
- An entire diagonal contains the same symbol

## Podejście / Approach

### Podejście 1: Sprawdź Wszystkie Możliwości (Brute Force)
Sprawdź każdy rząd, każdą kolumnę i obie przekątne.

**Złożoność**: O(N²) gdzie N to rozmiar planszy

### Podejście 2: Optymalizacja
Jeśli znamy ostatni ruch, sprawdź tylko rząd, kolumnę i ewentualnie przekątne zawierające ten ruch.

**Złożoność**: O(N) gdzie N to rozmiar planszy
