# Joins - Types and Use Cases

## Problem Description / Opis Problemu

**English:**
What are the different types of joins? Please explain how they differ and why certain types are better in certain situations.

**Polski:**
Jakie są różne typy połączeń (joins)? Proszę wyjaśnić, czym się różnią i dlaczego pewne typy są lepsze w pewnych sytuacjach.

## Understanding Joins / Zrozumienie Joins

**English:**
A JOIN is a SQL operation that combines rows from two or more tables based on a related column between them. The join type determines how rows are matched and which rows are included in the result set.

**Polski:**
JOIN to operacja SQL, która łączy wiersze z dwóch lub więcej tabel na podstawie powiązanej kolumny między nimi. Typ złączenia określa, jak wiersze są dopasowywane i które wiersze są uwzględnione w wyniku.

## Types of Joins / Typy Joins

### 1. INNER JOIN

**Definition / Definicja:**

**English:**
Returns only the rows where there is a match in BOTH tables. This is the most common type of join.

**Polski:**
Zwraca tylko wiersze, w których istnieje dopasowanie w OBIE tablicach. To najpopularniejszy typ złączenia.

**Syntax:**
```sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.key = table2.key;
```

**Visual Representation / Wizualizacja:**
```
Table A         Table B         Result (A ∩ B)
┌─────┐        ┌─────┐         ┌─────┐
│  1  │        │  2  │         │  2  │
│  2  │───┬────│  3  │    →    │  3  │
│  3  │   │    │  4  │         └─────┘
│  5  │   └─────────────
└─────┘                Only matching rows
```

**Example / Przykład:**
```sql
-- Get employees and their department names
-- Pobierz pracowników i nazwy ich działów

SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

**When to Use / Kiedy Używać:**

**English:**
- When you only want data that exists in both tables
- Most common for retrieving related data
- When NULL matches are not needed
- Example: Get orders with customer information (exclude orders without customers)

**Polski:**
- Gdy chcesz tylko dane, które istnieją w obu tabelach
- Najczęściej do pobierania powiązanych danych
- Gdy dopasowania NULL nie są potrzebne
- Przykład: Pobierz zamówienia z informacjami o klientach (wyklucz zamówienia bez klientów)

### 2. LEFT JOIN (LEFT OUTER JOIN)

**Definition / Definicja:**

**English:**
Returns ALL rows from the left table, and matching rows from the right table. If no match, NULL values are returned for right table columns.

**Polski:**
Zwraca WSZYSTKIE wiersze z lewej tabeli i dopasowane wiersze z prawej tabeli. Jeśli nie ma dopasowania, wartości NULL są zwracane dla kolumn prawej tabeli.

**Syntax:**
```sql
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.key = table2.key;
```

**Visual Representation / Wizualizacja:**
```
Table A         Table B         Result (A + A∩B)
┌─────┐        ┌─────┐         ┌─────┐
│  1  │────────│  2  │         │  1  │ (NULL)
│  2  │───┬────│  3  │    →    │  2  │
│  3  │   │    │  4  │         │  3  │
│  5  │   │                    │  5  │ (NULL)
└─────┘   └────────────        └─────┘
         All from A + matches
```

**Example / Przykład:**
```sql
-- Get all employees and their departments (include employees without departments)
-- Pobierz wszystkich pracowników i ich działy (uwzględnij pracowników bez działów)

SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

**When to Use / Kiedy Używać:**

**English:**
- When you want ALL records from one table, regardless of matches
- Finding orphaned records (WHERE right_table.id IS NULL)
- Preserving all data from the primary table
- Example: Get all customers and their orders (include customers without orders)

**Polski:**
- Gdy chcesz WSZYSTKIE rekordy z jednej tabeli, niezależnie od dopasowań
- Znajdowanie osieroconych rekordów (WHERE right_table.id IS NULL)
- Zachowanie wszystkich danych z głównej tabeli
- Przykład: Pobierz wszystkich klientów i ich zamówienia (uwzględnij klientów bez zamówień)

### 3. RIGHT JOIN (RIGHT OUTER JOIN)

**Definition / Definicja:**

**English:**
Returns ALL rows from the right table, and matching rows from the left table. If no match, NULL values are returned for left table columns. (Mirror of LEFT JOIN)

**Polski:**
Zwraca WSZYSTKIE wiersze z prawej tabeli i dopasowane wiersze z lewej tabeli. Jeśli nie ma dopasowania, wartości NULL są zwracane dla kolumn lewej tabeli. (Lustrzane odbicie LEFT JOIN)

**Syntax:**
```sql
SELECT columns
FROM table1
RIGHT JOIN table2 ON table1.key = table2.key;
```

**Visual Representation / Wizualizacja:**
```
Table A         Table B         Result (B + A∩B)
┌─────┐        ┌─────┐         ┌─────┐
│  1  │        │  2  │         │  2  │
│  2  │───┬────│  3  │    →    │  3  │
│  3  │   │    │  4  │         │  4  │ (NULL)
└─────┘   └────│  6  │         │  6  │ (NULL)
               └─────┘         └─────┘
                All from B + matches
```

**Example / Przykład:**
```sql
-- Get all departments and their employees (include departments without employees)
-- Pobierz wszystkie działy i ich pracowników (uwzględnij działy bez pracowników)

SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
RIGHT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

**When to Use / Kiedy Używać:**

**English:**
- Same as LEFT JOIN but from the opposite perspective
- Less common than LEFT JOIN (can be rewritten as LEFT JOIN by swapping tables)
- Some developers prefer LEFT JOIN for consistency
- Example: Get all products and their sales (include products that haven't been sold)

**Polski:**
- To samo co LEFT JOIN, ale z przeciwnej perspektywy
- Mniej popularne niż LEFT JOIN (można przepisać jako LEFT JOIN, zamieniając tabele)
- Niektórzy programiści wolą LEFT JOIN dla spójności
- Przykład: Pobierz wszystkie produkty i ich sprzedaż (uwzględnij produkty, które nie zostały sprzedane)

### 4. FULL OUTER JOIN

**Definition / Definicja:**

**English:**
Returns ALL rows from BOTH tables. If there's no match, NULL values are returned for the missing side.

**Polski:**
Zwraca WSZYSTKIE wiersze z OBU tabel. Jeśli nie ma dopasowania, wartości NULL są zwracane dla brakującej strony.

**Syntax:**
```sql
SELECT columns
FROM table1
FULL OUTER JOIN table2 ON table1.key = table2.key;
```

**Visual Representation / Wizualizacja:**
```
Table A         Table B         Result (A ∪ B)
┌─────┐        ┌─────┐         ┌─────┐
│  1  │────────│  2  │         │  1  │ (NULL from B)
│  2  │───┬────│  3  │    →    │  2  │
│  3  │   │    │  4  │         │  3  │
│  5  │   │    │  6  │         │  5  │ (NULL from B)
└─────┘   └────└─────┘         │  4  │ (NULL from A)
                                │  6  │ (NULL from A)
                All from both   └─────┘
```

**Example / Przykład:**
```sql
-- Get all employees and all departments (even if not connected)
-- Pobierz wszystkich pracowników i wszystkie działy (nawet jeśli nie są połączone)

SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
FULL OUTER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

**When to Use / Kiedy Używać:**

**English:**
- When you want to see ALL data from BOTH tables
- Finding mismatches in both directions
- Data reconciliation and finding orphaned records on both sides
- Example: Compare two lists and find items unique to each

**Polski:**
- Gdy chcesz zobaczyć WSZYSTKIE dane z OBU tabel
- Znajdowanie niedopasowań w obu kierunkach
- Uzgadnianie danych i znajdowanie osieroconych rekordów po obu stronach
- Przykład: Porównaj dwie listy i znajdź elementy unikalne dla każdej

**Note:** MySQL doesn't support FULL OUTER JOIN directly. Use UNION of LEFT and RIGHT JOIN instead.

### 5. CROSS JOIN (CARTESIAN PRODUCT)

**Definition / Definicja:**

**English:**
Returns the Cartesian product of both tables - every row from table1 combined with every row from table2.

**Polski:**
Zwraca iloczyn kartezjański obu tabel - każdy wiersz z table1 połączony z każdym wierszem z table2.

**Syntax:**
```sql
SELECT columns
FROM table1
CROSS JOIN table2;

-- Or simply:
SELECT columns
FROM table1, table2;
```

**Visual Representation / Wizualizacja:**
```
Table A (3 rows)    Table B (2 rows)    Result (3 × 2 = 6 rows)
┌─────┐            ┌─────┐              ┌─────────┐
│  1  │            │  A  │              │ (1, A)  │
│  2  │      ×     │  B  │        →     │ (1, B)  │
│  3  │            └─────┘              │ (2, A)  │
└─────┘                                 │ (2, B)  │
                                        │ (3, A)  │
                                        │ (3, B)  │
                                        └─────────┘
```

**Example / Przykład:**
```sql
-- Get all combinations of colors and sizes for products
-- Pobierz wszystkie kombinacje kolorów i rozmiarów dla produktów

SELECT c.ColorName, s.SizeName
FROM Colors c
CROSS JOIN Sizes s;
```

**When to Use / Kiedy Używać:**

**English:**
- Generating all possible combinations
- Creating test data
- Calendar/time series generation
- **WARNING**: Can produce HUGE result sets! (n × m rows)
- Example: Generate all possible product variations (color × size)

**Polski:**
- Generowanie wszystkich możliwych kombinacji
- Tworzenie danych testowych
- Generowanie kalendarza/szeregów czasowych
- **OSTRZEŻENIE**: Może wygenerować OGROMNE zestawy wyników! (n × m wierszy)
- Przykład: Wygeneruj wszystkie możliwe warianty produktów (kolor × rozmiar)

### 6. SELF JOIN

**Definition / Definicja:**

**English:**
A table joined with itself. Used to compare rows within the same table or establish hierarchical relationships.

**Polski:**
Tabela połączona sama ze sobą. Używane do porównywania wierszy w tej samej tabeli lub ustanawiania relacji hierarchicznych.

**Syntax:**
```sql
SELECT a.column1, b.column2
FROM table1 a
INNER JOIN table1 b ON a.key = b.foreign_key;
```

**Example / Przykład:**
```sql
-- Get employees and their managers (both in Employees table)
-- Pobierz pracowników i ich menedżerów (obie w tabeli Employees)

SELECT
    e.EmployeeName AS Employee,
    m.EmployeeName AS Manager
FROM Employees e
LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID;
```

**When to Use / Kiedy Używać:**

**English:**
- Hierarchical data (employee-manager, category-subcategory)
- Comparing rows within the same table
- Finding duplicates or related records
- Example: Organization chart, file system hierarchy, product categories

**Polski:**
- Dane hierarchiczne (pracownik-menedżer, kategoria-podkategoria)
- Porównywanie wierszy w tej samej tabeli
- Znajdowanie duplikatów lub powiązanych rekordów
- Przykład: Schemat organizacyjny, hierarchia systemu plików, kategorie produktów

## Comparison Table / Tabela Porównawcza

| Join Type | Left Table Rows | Right Table Rows | Use Case |
|-----------|----------------|------------------|----------|
| **INNER** | Only matched | Only matched | Related data only |
| **LEFT** | All | Only matched | All from left, related from right |
| **RIGHT** | Only matched | All | All from right, related from left |
| **FULL OUTER** | All | All | All data from both tables |
| **CROSS** | All × All | All × All | All combinations |
| **SELF** | All (as needed) | All (same table) | Hierarchical or self-referential |

## Performance Considerations / Uwagi dotyczące Wydajności

### Indexes / Indeksy

**English:**
Always create indexes on columns used in JOIN conditions:

```sql
-- Index for JOIN performance
CREATE INDEX idx_employee_dept ON Employees(DepartmentID);
CREATE INDEX idx_department_id ON Departments(DepartmentID);
```

**Polski:**
Zawsze twórz indeksy na kolumnach używanych w warunkach JOIN.

### Join Order / Kolejność Join

**English:**
- Start with the smallest table
- Filter early with WHERE clauses
- Use EXPLAIN/EXPLAIN ANALYZE to check query plan

```sql
-- Good: Filter before joining
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
WHERE e.HireDate > '2020-01-01';  -- Filter early

-- Less optimal: Filter after joining
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
WHERE e.HireDate > '2020-01-01';  -- Same result but may be slower
```

### Avoid CROSS JOIN / Unikaj CROSS JOIN

**English:**
- CROSS JOIN creates n × m rows (can be millions!)
- Always add WHERE clause to filter if using implicit cross join
- Use INNER JOIN with ON clause instead when possible

## Common Mistakes / Typowe Błędy

### 1. Missing JOIN Condition

```sql
-- WRONG: Creates CROSS JOIN accidentally
SELECT *
FROM Employees e, Departments d;

-- CORRECT: Use proper JOIN
SELECT *
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

### 2. Using WHERE Instead of JOIN ON

```sql
-- Works but less clear
SELECT *
FROM Employees e, Departments d
WHERE e.DepartmentID = d.DepartmentID;

-- Better: Use explicit JOIN
SELECT *
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

### 3. Wrong JOIN Type

```sql
-- WRONG: Uses INNER JOIN but wants all employees
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
-- Excludes employees without department!

-- CORRECT: Use LEFT JOIN to include all employees
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

## Decision Tree / Drzewo Decyzyjne

```
Need data from multiple tables?
│
├─ YES → Do you need ALL rows from one table?
│        │
│        ├─ NO → Use INNER JOIN
│        │
│        ├─ YES from LEFT table → Use LEFT JOIN
│        │
│        ├─ YES from RIGHT table → Use RIGHT JOIN
│        │
│        └─ YES from BOTH tables → Use FULL OUTER JOIN
│
├─ Same table, hierarchical? → Use SELF JOIN
│
└─ All combinations? → Use CROSS JOIN (carefully!)
```

## Real-World Examples / Przykłady z Rzeczywistości

### E-commerce Order System

```sql
-- Get all orders with customer and product details
SELECT
    o.OrderID,
    c.CustomerName,
    p.ProductName,
    o.Quantity,
    o.TotalPrice
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN Products p ON o.ProductID = p.ProductID
WHERE o.OrderDate >= '2024-01-01';
```

### Finding Orphaned Records

```sql
-- Find customers who have never placed an order
SELECT c.CustomerID, c.CustomerName
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.OrderID IS NULL;
```

### Hierarchical Organization

```sql
-- Get employee hierarchy (up to 3 levels)
SELECT
    e1.EmployeeName AS Employee,
    e2.EmployeeName AS Manager,
    e3.EmployeeName AS ManagerOfManager
FROM Employees e1
LEFT JOIN Employees e2 ON e1.ManagerID = e2.EmployeeID
LEFT JOIN Employees e3 ON e2.ManagerID = e3.EmployeeID;
```

## Implementation / Implementacja

See `solution.js` for practical examples of all join types with sample data and visualizations.
