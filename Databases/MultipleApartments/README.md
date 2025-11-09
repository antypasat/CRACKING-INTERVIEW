# Multiple Apartments - Finding Tenants with Multiple Rentals

## Problem Description / Opis Problemu

**English:**
Write a SQL query to get a list of tenants who are renting more than one apartment.

**Polski:**
Napisz zapytanie SQL, które zwróci listę najemców, którzy wynajmują więcej niż jeden apartament.

## Database Schema / Schemat Bazy Danych

Given the following tables:

```
Apartments
----------
AptID           int
UnitNumber      varchar(10)
BuildingID      int
Address         varchar(500)

Buildings
---------
BuildingID      int
ComplexID       int
BuildingName    varchar(100)
Address         varchar(500)

Tenants
-------
TenantID        int
TenantName      varchar(100)

AptTenants (Junction Table / Tabela Łącząca)
----------
TenantID        int
AptID           int

Requests
--------
RequestID       int
Status          varchar(100)
AptID           int
Description     varchar(500)

Complexes
---------
ComplexID       int
ComplexName     varchar(100)
```

## Understanding the Problem / Zrozumienie Problemu

**English:**
This is a classic SQL aggregation problem. We need to:
1. Look at the `AptTenants` junction table which links tenants to apartments
2. Group by `TenantID` to see how many apartments each tenant has
3. Filter to only show tenants with more than one apartment
4. Join with `Tenants` table to get tenant names

**Polski:**
To klasyczny problem agregacji SQL. Musimy:
1. Przyjrzeć się tabeli łączącej `AptTenants`, która łączy najemców z apartamentami
2. Pogrupować po `TenantID`, aby zobaczyć ile apartamentów ma każdy najemca
3. Odfiltrować, aby pokazać tylko najemców z więcej niż jednym apartamentem
4. Połączyć z tabelą `Tenants`, aby uzyskać imiona najemców

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: Using GROUP BY and HAVING / Używając GROUP BY i HAVING

**SQL Query:**
```sql
SELECT
    t.TenantID,
    t.TenantName,
    COUNT(at.AptID) AS ApartmentCount
FROM Tenants t
INNER JOIN AptTenants at ON t.TenantID = at.TenantID
GROUP BY t.TenantID, t.TenantName
HAVING COUNT(at.AptID) > 1
ORDER BY ApartmentCount DESC;
```

**Explanation / Wyjaśnienie:**

**English:**
1. **FROM Tenants t**: Start with the Tenants table to get tenant information
2. **INNER JOIN AptTenants**: Join with the junction table to connect tenants with their apartments
3. **GROUP BY TenantID, TenantName**: Group all records by tenant to aggregate their apartment count
4. **HAVING COUNT(AptID) > 1**: Filter groups to only include tenants with more than one apartment
5. **ORDER BY ApartmentCount DESC**: Sort by number of apartments (most to least)

**Polski:**
1. **FROM Tenants t**: Zaczynamy od tabeli Tenants, aby uzyskać informacje o najemcach
2. **INNER JOIN AptTenants**: Łączymy z tabelą łączącą, aby połączyć najemców z ich apartamentami
3. **GROUP BY TenantID, TenantName**: Grupujemy wszystkie rekordy według najemcy, aby zagregować liczbę apartamentów
4. **HAVING COUNT(AptID) > 1**: Filtrujemy grupy, aby uwzględnić tylko najemców z więcej niż jednym apartamentem
5. **ORDER BY ApartmentCount DESC**: Sortujemy według liczby apartamentów (od największej do najmniejszej)

**Time Complexity / Złożoność Czasowa:** O(n log n) due to GROUP BY and ORDER BY
**Space Complexity / Złożoność Pamięciowa:** O(n) for grouping

### Approach 2: With Additional Apartment Details / Z Dodatkowymi Szczegółami Apartamentów

**SQL Query:**
```sql
SELECT
    t.TenantID,
    t.TenantName,
    COUNT(at.AptID) AS ApartmentCount,
    STRING_AGG(a.UnitNumber, ', ') AS UnitNumbers,
    STRING_AGG(CAST(a.AptID AS VARCHAR), ', ') AS ApartmentIDs
FROM Tenants t
INNER JOIN AptTenants at ON t.TenantID = at.TenantID
INNER JOIN Apartments a ON at.AptID = a.AptID
GROUP BY t.TenantID, t.TenantName
HAVING COUNT(at.AptID) > 1
ORDER BY ApartmentCount DESC;
```

**Note:** `STRING_AGG` is SQL Server syntax. Use `GROUP_CONCAT` in MySQL or `array_agg` in PostgreSQL.

**Explanation / Wyjaśnienie:**

**English:**
This approach extends the first one by:
- Joining with the Apartments table to get apartment details
- Using STRING_AGG to concatenate unit numbers and apartment IDs into comma-separated lists
- Providing more detailed information about which apartments each tenant is renting

**Polski:**
To podejście rozszerza pierwsze o:
- Połączenie z tabelą Apartments, aby uzyskać szczegóły apartamentów
- Użycie STRING_AGG do konkatenacji numerów jednostek i ID apartamentów w listy oddzielone przecinkami
- Dostarczenie bardziej szczegółowych informacji o tym, które apartamenty wynajmuje każdy najemca

### Approach 3: Subquery Approach / Podejście z Podzapytaniem

**SQL Query:**
```sql
SELECT
    t.TenantID,
    t.TenantName,
    apt_count.ApartmentCount
FROM Tenants t
INNER JOIN (
    SELECT
        TenantID,
        COUNT(AptID) AS ApartmentCount
    FROM AptTenants
    GROUP BY TenantID
    HAVING COUNT(AptID) > 1
) apt_count ON t.TenantID = apt_count.TenantID
ORDER BY apt_count.ApartmentCount DESC;
```

**Explanation / Wyjaśnienie:**

**English:**
This approach uses a subquery to:
1. First calculate the apartment count for each tenant in the subquery
2. Filter in the subquery to only tenants with more than one apartment
3. Join the result with the Tenants table to get names
4. This separates the aggregation logic from the join logic, which can be more readable

**Polski:**
To podejście używa podzapytania, aby:
1. Najpierw obliczyć liczbę apartamentów dla każdego najemcy w podzapytaniu
2. Odfiltrować w podzapytaniu tylko najemców z więcej niż jednym apartamentem
3. Połączyć wynik z tabelą Tenants, aby uzyskać nazwy
4. To oddziela logikę agregacji od logiki łączenia, co może być bardziej czytelne

## Key SQL Concepts / Kluczowe Koncepcje SQL

### GROUP BY vs HAVING

**English:**
- **GROUP BY**: Groups rows that have the same values in specified columns into aggregated data
- **HAVING**: Filters groups after aggregation (works on aggregated data)
- **WHERE**: Filters rows before aggregation (works on individual rows)

**Polski:**
- **GROUP BY**: Grupuje wiersze, które mają te same wartości w określonych kolumnach w zagregowane dane
- **HAVING**: Filtruje grupy po agregacji (działa na zagregowanych danych)
- **WHERE**: Filtruje wiersze przed agregacją (działa na pojedynczych wierszach)

**Example:**
```sql
-- WRONG: Cannot use WHERE with aggregate functions
SELECT TenantID
FROM AptTenants
WHERE COUNT(AptID) > 1  -- ERROR!

-- CORRECT: Use HAVING after GROUP BY
SELECT TenantID
FROM AptTenants
GROUP BY TenantID
HAVING COUNT(AptID) > 1  -- WORKS!
```

### Aggregate Functions / Funkcje Agregujące

Common aggregate functions used in SQL:
- **COUNT()**: Counts the number of rows
- **SUM()**: Adds up values
- **AVG()**: Calculates average
- **MAX()**: Finds maximum value
- **MIN()**: Finds minimum value
- **STRING_AGG()** / **GROUP_CONCAT()**: Concatenates strings

## Edge Cases / Przypadki Brzegowe

**English:**
1. **No tenants with multiple apartments**: Query returns empty result set
2. **Tenant with same apartment listed twice**: Depends on business logic - should AptTenants allow duplicates?
3. **Inactive tenants**: Should we filter by tenant status if such a column exists?
4. **NULL values**: INNER JOIN excludes tenants not in AptTenants table

**Polski:**
1. **Brak najemców z wieloma apartamentami**: Zapytanie zwraca pusty zestaw wyników
2. **Najemca z tym samym apartamentem wymienionym dwukrotnie**: Zależy od logiki biznesowej - czy AptTenants powinien pozwalać na duplikaty?
3. **Nieaktywni najemcy**: Czy powinniśmy filtrować według statusu najemcy, jeśli taka kolumna istnieje?
4. **Wartości NULL**: INNER JOIN wyklucza najemców, którzy nie są w tabeli AptTenants

## Performance Considerations / Uwagi dotyczące Wydajności

**English:**
1. **Indexes**: Create indexes on `TenantID` in both Tenants and AptTenants tables
2. **Covering Index**: Create composite index on AptTenants(TenantID, AptID) for better performance
3. **Query Plan**: Use EXPLAIN to analyze query execution plan
4. **Large Datasets**: Consider pagination if result set is large

**Polski:**
1. **Indeksy**: Utwórz indeksy na `TenantID` w tabelach Tenants i AptTenants
2. **Indeks Pokrywający**: Utwórz indeks złożony na AptTenants(TenantID, AptID) dla lepszej wydajności
3. **Plan Zapytania**: Użyj EXPLAIN do analizy planu wykonania zapytania
4. **Duże Zbiory Danych**: Rozważ paginację, jeśli zestaw wyników jest duży

## Related Questions / Powiązane Pytania

1. How would you find tenants renting in multiple buildings?
2. How would you find the tenant renting the most apartments?
3. How would you find apartments with multiple tenants?
4. How would you calculate the total rent collected from multi-apartment tenants?

## Implementation / Implementacja

See `solution.js` for a JavaScript implementation that simulates the database and demonstrates all approaches with test cases.
