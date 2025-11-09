# Close All Requests - UPDATE Statement for Building Renovation

## Problem Description / Opis Problemu

**English:**
Building #11 is undergoing a major renovation. Implement a query to close all requests from apartments in this building.

**Polski:**
Budynek #11 przechodzi gruntowny remont. Zaimplementuj zapytanie, które zamknie wszystkie zgłoszenia z apartamentów w tym budynku.

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
This is an UPDATE query problem that requires:
1. Updating the `Status` field in the `Requests` table
2. Only for requests associated with apartments in Building #11
3. Need to JOIN through the Apartments table to connect Requests to Buildings
4. Should handle multiple approaches: direct UPDATE with JOIN vs subquery

**Polski:**
To problem zapytania UPDATE, który wymaga:
1. Aktualizacji pola `Status` w tabeli `Requests`
2. Tylko dla zgłoszeń związanych z apartamentami w budynku #11
3. Potrzeba JOIN przez tabelę Apartments, aby połączyć Requests z Buildings
4. Powinien obsługiwać wiele podejść: bezpośredni UPDATE z JOIN vs podzapytanie

## Solution Approaches / Podejścia do Rozwiązania

### Approach 1: UPDATE with JOIN (SQL Server, PostgreSQL 9.5+)

**SQL Query (SQL Server syntax):**
```sql
UPDATE r
SET r.Status = 'Closed'
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11;
```

**SQL Query (PostgreSQL syntax):**
```sql
UPDATE Requests r
SET Status = 'Closed'
FROM Apartments a
WHERE r.AptID = a.AptID
  AND a.BuildingID = 11;
```

**Explanation / Wyjaśnienie:**

**English:**
1. **UPDATE Requests**: Target table to update
2. **INNER JOIN Apartments**: Connect requests to apartments
3. **WHERE BuildingID = 11**: Filter for only Building #11
4. **SET Status = 'Closed'**: Change status to 'Closed'
5. This updates ALL requests (Open, In Progress, etc.) in Building #11

**Polski:**
1. **UPDATE Requests**: Tabela docelowa do aktualizacji
2. **INNER JOIN Apartments**: Łączy zgłoszenia z apartamentami
3. **WHERE BuildingID = 11**: Filtruje tylko budynek #11
4. **SET Status = 'Closed'**: Zmienia status na 'Closed'
5. To aktualizuje WSZYSTKIE zgłoszenia (Open, In Progress, itd.) w budynku #11

### Approach 2: UPDATE with Subquery (MySQL, All SQL Databases)

**SQL Query:**
```sql
UPDATE Requests
SET Status = 'Closed'
WHERE AptID IN (
    SELECT AptID
    FROM Apartments
    WHERE BuildingID = 11
);
```

**Explanation / Wyjaśnienie:**

**English:**
1. **Subquery**: First find all AptIDs in Building #11
2. **WHERE AptID IN (...)**: Match requests to those apartments
3. **SET Status = 'Closed'**: Update the status
4. More portable across different SQL databases
5. May be less efficient than JOIN approach on large datasets

**Polski:**
1. **Podzapytanie**: Najpierw znajdź wszystkie AptID w budynku #11
2. **WHERE AptID IN (...)**: Dopasuj zgłoszenia do tych apartamentów
3. **SET Status = 'Closed'**: Zaktualizuj status
4. Bardziej przenośne między różnymi bazami SQL
5. Może być mniej wydajne niż podejście JOIN na dużych zbiorach danych

### Approach 3: UPDATE Only Non-Closed Requests

**SQL Query:**
```sql
UPDATE Requests
SET Status = 'Closed'
WHERE AptID IN (
    SELECT AptID
    FROM Apartments
    WHERE BuildingID = 11
)
AND Status != 'Closed';
```

**Explanation / Wyjaśnienie:**

**English:**
1. Same as Approach 2 but adds **AND Status != 'Closed'**
2. Only updates requests that aren't already closed
3. More efficient - doesn't update already-closed requests
4. Better for logging/auditing (fewer rows affected)
5. Prevents unnecessary database triggers from firing

**Polski:**
1. Tak samo jak podejście 2, ale dodaje **AND Status != 'Closed'**
2. Aktualizuje tylko zgłoszenia, które nie są jeszcze zamknięte
3. Bardziej wydajne - nie aktualizuje już zamkniętych zgłoszeń
4. Lepsze dla logowania/audytu (mniej dotkniętych wierszy)
5. Zapobiega niepotrzebnemu uruchamianiu wyzwalaczy bazy danych

### Approach 4: UPDATE with Additional Metadata

**SQL Query:**
```sql
UPDATE Requests
SET Status = 'Closed',
    ClosedDate = GETDATE(),  -- or NOW() in PostgreSQL/MySQL
    ClosedReason = 'Building renovation'
WHERE AptID IN (
    SELECT AptID
    FROM Apartments
    WHERE BuildingID = 11
)
AND Status != 'Closed';
```

**Explanation / Wyjaśnienie:**

**English:**
1. Updates multiple fields at once
2. **ClosedDate**: Timestamp of when request was closed
3. **ClosedReason**: Why the request was closed
4. Better for audit trail and historical data
5. Assumes these columns exist in the Requests table

**Polski:**
1. Aktualizuje wiele pól jednocześnie
2. **ClosedDate**: Znacznik czasu zamknięcia zgłoszenia
3. **ClosedReason**: Powód zamknięcia zgłoszenia
4. Lepsze dla ścieżki audytu i danych historycznych
5. Zakłada, że te kolumny istnieją w tabeli Requests

## Key SQL Concepts / Kluczowe Koncepcje SQL

### UPDATE Statement Syntax

**Basic UPDATE:**
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**UPDATE with JOIN (SQL Server):**
```sql
UPDATE t1
SET t1.column = value
FROM table1 t1
INNER JOIN table2 t2 ON t1.id = t2.id
WHERE condition;
```

**UPDATE with JOIN (MySQL):**
```sql
UPDATE table1 t1
INNER JOIN table2 t2 ON t1.id = t2.id
SET t1.column = value
WHERE condition;
```

### UPDATE vs DELETE

**English:**
- **UPDATE**: Modifies existing data (changes field values)
- **DELETE**: Removes entire rows from table
- **TRUNCATE**: Removes all rows (faster than DELETE but can't be rolled back)

**Polski:**
- **UPDATE**: Modyfikuje istniejące dane (zmienia wartości pól)
- **DELETE**: Usuwa całe wiersze z tabeli
- **TRUNCATE**: Usuwa wszystkie wiersze (szybsze niż DELETE, ale nie można cofnąć)

### Transaction Safety

**English:**
ALWAYS use transactions for UPDATE operations:

```sql
BEGIN TRANSACTION;

UPDATE Requests
SET Status = 'Closed'
WHERE AptID IN (
    SELECT AptID FROM Apartments WHERE BuildingID = 11
);

-- Check the results
SELECT COUNT(*) FROM Requests WHERE Status = 'Closed';

-- If everything looks good:
COMMIT;

-- If something went wrong:
-- ROLLBACK;
```

**Polski:**
ZAWSZE używaj transakcji dla operacji UPDATE.

## Safety Checks / Sprawdzenia Bezpieczeństwa

### Before UPDATE

**English:**
1. **Count affected rows first:**
```sql
-- See how many rows will be affected
SELECT COUNT(*)
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11;
```

2. **Preview the changes:**
```sql
-- See which requests will be updated
SELECT r.RequestID, r.Status, r.Description, a.UnitNumber
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11;
```

3. **Backup the data:**
```sql
-- Create a backup before updating
SELECT * INTO Requests_Backup_20240101
FROM Requests
WHERE AptID IN (
    SELECT AptID FROM Apartments WHERE BuildingID = 11
);
```

### After UPDATE

**English:**
1. **Verify the update:**
```sql
-- Check that requests were updated
SELECT COUNT(*) AS ClosedRequests
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11 AND r.Status = 'Closed';
```

2. **Check for remaining open requests:**
```sql
-- Should return 0 if all were closed
SELECT COUNT(*)
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11 AND r.Status != 'Closed';
```

## Edge Cases / Przypadki Brzegowe

**English:**
1. **Building has no apartments**: UPDATE affects 0 rows (safe)
2. **Building has apartments but no requests**: UPDATE affects 0 rows (safe)
3. **All requests already closed**: UPDATE affects 0 rows (safe with proper WHERE clause)
4. **Invalid BuildingID**: UPDATE affects 0 rows (safe)
5. **NULL Status values**: Need to handle with IS NULL in WHERE clause
6. **Concurrent updates**: Use row-level locking or optimistic locking

**Polski:**
1. **Budynek nie ma apartamentów**: UPDATE wpływa na 0 wierszy (bezpieczne)
2. **Budynek ma apartamenty ale bez zgłoszeń**: UPDATE wpływa na 0 wierszy (bezpieczne)
3. **Wszystkie zgłoszenia już zamknięte**: UPDATE wpływa na 0 wierszy (bezpieczne z odpowiednim WHERE)
4. **Nieprawidłowe BuildingID**: UPDATE wpływa na 0 wierszy (bezpieczne)
5. **Wartości NULL w Status**: Trzeba obsłużyć z IS NULL w klauzuli WHERE
6. **Jednoczesne aktualizacje**: Użyj blokowania na poziomie wiersza lub optymistycznego blokowania

## Performance Considerations / Uwagi dotyczące Wydajności

**English:**
1. **Indexes**: Ensure indexes exist on:
   - Apartments.BuildingID
   - Apartments.AptID (primary key)
   - Requests.AptID (foreign key)
   - Requests.Status (for filtering)

2. **Batch Updates**: For very large datasets, update in batches:
```sql
-- Update in batches of 1000
WHILE 1=1
BEGIN
    UPDATE TOP (1000) Requests
    SET Status = 'Closed'
    WHERE AptID IN (SELECT AptID FROM Apartments WHERE BuildingID = 11)
      AND Status != 'Closed';

    IF @@ROWCOUNT = 0 BREAK;
END
```

3. **Use Proper Transaction Isolation**: Prevents dirty reads and lost updates

**Polski:**
1. **Indeksy**: Upewnij się, że istnieją indeksy na wymienionych kolumnach
2. **Aktualizacje wsadowe**: Dla bardzo dużych zbiorów danych aktualizuj partiami
3. **Użyj odpowiedniej izolacji transakcji**: Zapobiega brudnym odczytom i utraconym aktualizacjom

## Common Mistakes / Typowe Błędy

**English:**
1. **Forgetting WHERE clause**: Updates ALL requests in entire database!
```sql
-- WRONG: This closes ALL requests everywhere!
UPDATE Requests SET Status = 'Closed';
```

2. **Using = instead of IN with subquery**:
```sql
-- WRONG: Subquery returns multiple rows
UPDATE Requests
SET Status = 'Closed'
WHERE AptID = (SELECT AptID FROM Apartments WHERE BuildingID = 11);
```

3. **Not using transactions**: Can't rollback if something goes wrong

4. **Not checking affected rows**: No verification that update worked correctly

**Polski:**
1. **Zapominanie klauzuli WHERE**: Aktualizuje WSZYSTKIE zgłoszenia w całej bazie!
2. **Używanie = zamiast IN z podzapytaniem**: Podzapytanie zwraca wiele wierszy
3. **Nie używanie transakcji**: Nie można wycofać zmian, jeśli coś pójdzie nie tak
4. **Nie sprawdzanie dotkniętych wierszy**: Brak weryfikacji, że aktualizacja zadziałała poprawnie

## Related Operations / Powiązane Operacje

### Reopen All Requests

```sql
UPDATE Requests
SET Status = 'Open'
WHERE AptID IN (
    SELECT AptID FROM Apartments WHERE BuildingID = 11
)
AND Status = 'Closed';
```

### Delete All Requests (if needed)

```sql
DELETE FROM Requests
WHERE AptID IN (
    SELECT AptID FROM Apartments WHERE BuildingID = 11
);
```

### Archive Requests Before Closing

```sql
-- First, archive
INSERT INTO Requests_Archive
SELECT * FROM Requests
WHERE AptID IN (
    SELECT AptID FROM Apartments WHERE BuildingID = 11
);

-- Then, close
UPDATE Requests
SET Status = 'Closed'
WHERE AptID IN (
    SELECT AptID FROM Apartments WHERE BuildingID = 11
);
```

## Implementation / Implementacja

See `solution.js` for a JavaScript implementation that simulates the database and demonstrates all UPDATE approaches with safety checks and test cases.
