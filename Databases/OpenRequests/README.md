# Open Requests - Counting Open Requests per Building

## Problem Description / Opis Problemu

**English:**
Write a SQL query to get a list of all buildings and the number of open requests (Requests in which status equals 'Open').

**Polski:**
Napisz zapytanie SQL, które zwróci listę wszystkich budynków i liczbę otwartych zgłoszeń (Requests, w których status równa się 'Open').

## Database Schema / Schemat Bazy Danych

Given the following tables:

```
Buildings
---------
BuildingID      int
ComplexID       int
BuildingName    varchar(100)
Address         varchar(500)

Apartments
----------
AptID           int
UnitNumber      varchar(10)
BuildingID      int
Address         varchar(500)

Requests
--------
RequestID       int
Status          varchar(100)    -- 'Open', 'Closed', 'In Progress', etc.
AptID           int
Description     varchar(500)
```

## Understanding the Problem / Zrozumienie Problemu

**English:**
This query requires careful consideration because we need to:
1. Show **ALL buildings**, not just those with open requests
2. Count only requests with status = 'Open'
3. Buildings with no open requests should show 0, not be excluded
4. This means we need a LEFT JOIN, not an INNER JOIN

**Polski:**
To zapytanie wymaga starannego rozważenia, ponieważ musimy:
1. Pokazać **WSZYSTKIE budynki**, nie tylko te z otwartymi zgłoszeniami
2. Policzyć tylko zgłoszenia ze statusem = 'Open'
3. Budynki bez otwartych zgłoszeń powinny pokazywać 0, a nie być wykluczone
4. To oznacza, że potrzebujemy LEFT JOIN, a nie INNER JOIN

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: LEFT JOIN with COUNT and GROUP BY

**SQL Query:**
```sql
SELECT
    b.BuildingID,
    b.BuildingName,
    b.Address,
    COUNT(r.RequestID) AS OpenRequestCount
FROM Buildings b
LEFT JOIN Apartments a ON b.BuildingID = a.BuildingID
LEFT JOIN Requests r ON a.AptID = r.AptID AND r.Status = 'Open'
GROUP BY b.BuildingID, b.BuildingName, b.Address
ORDER BY OpenRequestCount DESC, b.BuildingName;
```

**Explanation / Wyjaśnienie:**

**English:**
1. **FROM Buildings b**: Start with Buildings table to ensure all buildings are included
2. **LEFT JOIN Apartments**: Connect buildings to their apartments (LEFT to keep buildings without apartments)
3. **LEFT JOIN Requests ... AND r.Status = 'Open'**: Connect to requests, but filter for 'Open' status in the JOIN condition
4. **COUNT(r.RequestID)**: Count request IDs (NULL values from LEFT JOIN won't be counted)
5. **GROUP BY**: Group by building to aggregate counts
6. **ORDER BY**: Sort by request count (most requests first), then by name

**Polski:**
1. **FROM Buildings b**: Zaczynamy od tabeli Buildings, aby zapewnić uwzględnienie wszystkich budynków
2. **LEFT JOIN Apartments**: Łączymy budynki z ich apartamentami (LEFT, aby zachować budynki bez apartamentów)
3. **LEFT JOIN Requests ... AND r.Status = 'Open'**: Łączymy ze zgłoszeniami, ale filtrujemy status 'Open' w warunku JOIN
4. **COUNT(r.RequestID)**: Liczymy ID zgłoszeń (wartości NULL z LEFT JOIN nie będą liczone)
5. **GROUP BY**: Grupujemy według budynku, aby zagregować liczby
6. **ORDER BY**: Sortujemy według liczby zgłoszeń (najwięcej najpierw), potem według nazwy

**Why filter in JOIN vs WHERE?**
```sql
-- WRONG: Filter in WHERE excludes buildings with no open requests
LEFT JOIN Requests r ON a.AptID = r.AptID
WHERE r.Status = 'Open'  -- This converts LEFT JOIN to INNER JOIN!

-- CORRECT: Filter in JOIN condition preserves all buildings
LEFT JOIN Requests r ON a.AptID = r.AptID AND r.Status = 'Open'
```

### Approach 2: Using Subquery with COUNT

**SQL Query:**
```sql
SELECT
    b.BuildingID,
    b.BuildingName,
    b.Address,
    COALESCE(open_counts.OpenRequestCount, 0) AS OpenRequestCount
FROM Buildings b
LEFT JOIN (
    SELECT
        a.BuildingID,
        COUNT(r.RequestID) AS OpenRequestCount
    FROM Apartments a
    INNER JOIN Requests r ON a.AptID = r.AptID
    WHERE r.Status = 'Open'
    GROUP BY a.BuildingID
) open_counts ON b.BuildingID = open_counts.BuildingID
ORDER BY OpenRequestCount DESC, b.BuildingName;
```

**Explanation / Wyjaśnienie:**

**English:**
1. **Subquery**: First calculate open request counts per building
2. **INNER JOIN in subquery**: We can use INNER JOIN here because we're only counting open requests
3. **LEFT JOIN with subquery**: Ensure all buildings are included
4. **COALESCE**: Convert NULL to 0 for buildings with no open requests
5. This approach separates the counting logic from the building retrieval

**Polski:**
1. **Podzapytanie**: Najpierw oblicz liczby otwartych zgłoszeń na budynek
2. **INNER JOIN w podzapytaniu**: Możemy użyć INNER JOIN tutaj, ponieważ liczymy tylko otwarte zgłoszenia
3. **LEFT JOIN z podzapytaniem**: Zapewniamy uwzględnienie wszystkich budynków
4. **COALESCE**: Konwertuj NULL na 0 dla budynków bez otwartych zgłoszeń
5. To podejście oddziela logikę liczenia od pobierania budynków

### Approach 3: Using CASE in COUNT

**SQL Query:**
```sql
SELECT
    b.BuildingID,
    b.BuildingName,
    b.Address,
    COUNT(CASE WHEN r.Status = 'Open' THEN 1 END) AS OpenRequestCount
FROM Buildings b
LEFT JOIN Apartments a ON b.BuildingID = a.BuildingID
LEFT JOIN Requests r ON a.AptID = r.AptID
GROUP BY b.BuildingID, b.BuildingName, b.Address
ORDER BY OpenRequestCount DESC, b.BuildingName;
```

**Explanation / Wyjaśnienie:**

**English:**
1. **COUNT(CASE WHEN...)**: Conditional counting
2. **CASE WHEN r.Status = 'Open' THEN 1 END**: Returns 1 for open requests, NULL otherwise
3. **COUNT ignores NULLs**: Only counts the 1s, giving us the count of open requests
4. This is more flexible if you want to count multiple statuses

**Polski:**
1. **COUNT(CASE WHEN...)**: Warunkowe liczenie
2. **CASE WHEN r.Status = 'Open' THEN 1 END**: Zwraca 1 dla otwartych zgłoszeń, w przeciwnym razie NULL
3. **COUNT ignoruje NULL**: Liczy tylko jedynki, dając nam liczbę otwartych zgłoszeń
4. To jest bardziej elastyczne, jeśli chcesz liczyć wiele statusów

## Key SQL Concepts / Kluczowe Koncepcje SQL

### LEFT JOIN vs INNER JOIN

**English:**

**INNER JOIN** - Only returns rows where there's a match in both tables
```sql
-- Returns only buildings WITH apartments AND requests
FROM Buildings b
INNER JOIN Apartments a ON b.BuildingID = a.BuildingID
INNER JOIN Requests r ON a.AptID = r.AptID
```

**LEFT JOIN** - Returns all rows from left table, with NULLs for non-matches
```sql
-- Returns ALL buildings, even without apartments or requests
FROM Buildings b
LEFT JOIN Apartments a ON b.BuildingID = a.BuildingID
LEFT JOIN Requests r ON a.AptID = r.AptID
```

**Polski:**

**INNER JOIN** - Zwraca tylko wiersze, gdzie jest dopasowanie w obu tabelach
**LEFT JOIN** - Zwraca wszystkie wiersze z lewej tabeli, z NULL dla niedopasowanych

### COUNT Behavior with NULLs

```sql
COUNT(*)           -- Counts all rows, including NULLs
COUNT(column)      -- Counts non-NULL values only
COUNT(DISTINCT c)  -- Counts unique non-NULL values
```

### WHERE vs JOIN Condition Filtering

```sql
-- Filter in JOIN: Keeps all left table rows
LEFT JOIN table2 ON table1.id = table2.id AND table2.status = 'Open'

-- Filter in WHERE: Excludes rows with NULL from LEFT JOIN
LEFT JOIN table2 ON table1.id = table2.id
WHERE table2.status = 'Open'  -- This excludes non-matching rows!
```

## Extended Queries / Rozszerzone Zapytania

### Count All Request Types by Building

**SQL Query:**
```sql
SELECT
    b.BuildingID,
    b.BuildingName,
    COUNT(CASE WHEN r.Status = 'Open' THEN 1 END) AS OpenCount,
    COUNT(CASE WHEN r.Status = 'Closed' THEN 1 END) AS ClosedCount,
    COUNT(CASE WHEN r.Status = 'In Progress' THEN 1 END) AS InProgressCount,
    COUNT(r.RequestID) AS TotalRequests
FROM Buildings b
LEFT JOIN Apartments a ON b.BuildingID = a.BuildingID
LEFT JOIN Requests r ON a.AptID = r.AptID
GROUP BY b.BuildingID, b.BuildingName
ORDER BY OpenCount DESC;
```

### Buildings with Most Open Requests

**SQL Query:**
```sql
SELECT TOP 5
    b.BuildingID,
    b.BuildingName,
    COUNT(r.RequestID) AS OpenRequestCount
FROM Buildings b
LEFT JOIN Apartments a ON b.BuildingID = a.BuildingID
LEFT JOIN Requests r ON a.AptID = r.AptID AND r.Status = 'Open'
GROUP BY b.BuildingID, b.BuildingName
ORDER BY OpenRequestCount DESC;
```

## Edge Cases / Przypadki Brzegowe

**English:**
1. **Building with no apartments**: Should show 0 open requests
2. **Building with apartments but no requests**: Should show 0 open requests
3. **Building with only closed requests**: Should show 0 open requests
4. **Multiple requests for same apartment**: Each counted separately
5. **NULL status values**: Should not be counted as 'Open'

**Polski:**
1. **Budynek bez apartamentów**: Powinien pokazywać 0 otwartych zgłoszeń
2. **Budynek z apartamentami ale bez zgłoszeń**: Powinien pokazywać 0 otwartych zgłoszeń
3. **Budynek tylko z zamkniętymi zgłoszeniami**: Powinien pokazywać 0 otwartych zgłoszeń
4. **Wiele zgłoszeń dla tego samego apartamentu**: Każde liczone osobno
5. **Wartości NULL w statusie**: Nie powinny być liczone jako 'Open'

## Performance Considerations / Uwagi dotyczące Wydajności

**English:**
1. **Index on BuildingID**: Both in Buildings and Apartments tables
2. **Composite Index**: On Apartments(BuildingID, AptID)
3. **Index on AptID**: In Requests table
4. **Index on Status**: In Requests table for filtering
5. **Covering Index**: Requests(AptID, Status, RequestID) to avoid table lookups

**Polski:**
1. **Indeks na BuildingID**: Zarówno w tabelach Buildings jak i Apartments
2. **Indeks złożony**: Na Apartments(BuildingID, AptID)
3. **Indeks na AptID**: W tabeli Requests
4. **Indeks na Status**: W tabeli Requests dla filtrowania
5. **Indeks pokrywający**: Requests(AptID, Status, RequestID), aby uniknąć wyszukiwań w tabeli

## Common Mistakes / Typowe Błędy

**English:**
1. **Using INNER JOIN instead of LEFT JOIN**: Excludes buildings without open requests
2. **Filtering in WHERE instead of JOIN**: Converts LEFT JOIN behavior to INNER JOIN
3. **Using COUNT(*) instead of COUNT(column)**: May count NULL rows incorrectly
4. **Forgetting to GROUP BY all non-aggregated columns**: Syntax error in most SQL databases

**Polski:**
1. **Używanie INNER JOIN zamiast LEFT JOIN**: Wyklucza budynki bez otwartych zgłoszeń
2. **Filtrowanie w WHERE zamiast JOIN**: Konwertuje zachowanie LEFT JOIN na INNER JOIN
3. **Używanie COUNT(*) zamiast COUNT(kolumna)**: Może niepoprawnie liczyć wiersze NULL
4. **Zapominanie o GROUP BY wszystkich niezagregowanych kolumn**: Błąd składni w większości baz SQL

## Implementation / Implementacja

See `solution.js` for a JavaScript implementation that simulates the database and demonstrates all approaches with comprehensive test cases including edge cases.
