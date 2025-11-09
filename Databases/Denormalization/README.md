# Denormalization - Database Design Trade-offs

## Problem Description / Opis Problemu

**English:**
What is denormalization? Explain the pros and cons.

**Polski:**
Czym jest denormalizacja? Wyjaśnij wady i zalety.

## Understanding Normalization First / Najpierw Zrozumienie Normalizacji

**English:**
Before understanding denormalization, we need to understand normalization.

**Normalization** is the process of organizing data in a database to:
- Reduce data redundancy (duplication)
- Ensure data integrity
- Make the database more efficient
- Follow specific normal forms (1NF, 2NF, 3NF, BCNF, etc.)

**Polski:**
Zanim zrozumiemy denormalizację, musimy zrozumieć normalizację.

**Normalizacja** to proces organizacji danych w bazie danych, aby:
- Zmniejszyć redundancję danych (duplikację)
- Zapewnić integralność danych
- Uczynić bazę danych bardziej wydajną
- Przestrzegać określonych postaci normalnych (1NF, 2NF, 3NF, BCNF, itd.)

## What is Denormalization? / Czym jest Denormalizacja?

**English:**
**Denormalization** is the process of intentionally introducing redundancy into a normalized database by combining tables or duplicating data. It's done to improve read performance at the cost of write complexity and data integrity risks.

**Key Point:** Denormalization is a deliberate design decision, not a mistake. You should first normalize, then denormalize strategically where needed.

**Polski:**
**Denormalizacja** to proces celowego wprowadzania redundancji do znormalizowanej bazy danych poprzez łączenie tabel lub duplikowanie danych. Robi się to, aby poprawić wydajność odczytu kosztem złożoności zapisu i ryzyka integralności danych.

**Kluczowy punkt:** Denormalizacja to celowa decyzja projektowa, nie błąd. Powinieneś najpierw znormalizować, a następnie strategicznie zdenormalizować tam, gdzie to potrzebne.

## Example: Normalized vs Denormalized / Przykład: Znormalizowane vs Zdenormalizowane

### Normalized Schema (3NF) / Znormalizowany Schemat (3NF)

```sql
-- Orders table
Orders
------
OrderID      INT
CustomerID   INT (FK)
OrderDate    DATE

-- Customers table
Customers
---------
CustomerID   INT
CustomerName VARCHAR(100)
Email        VARCHAR(100)
City         VARCHAR(50)

-- To get order with customer info, need JOIN:
SELECT o.OrderID, o.OrderDate, c.CustomerName, c.Email, c.City
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID;
```

### Denormalized Schema / Zdenormalizowany Schemat

```sql
-- Orders table (with customer data duplicated)
Orders
------
OrderID      INT
CustomerID   INT
CustomerName VARCHAR(100)  -- Duplicated!
Email        VARCHAR(100)  -- Duplicated!
City         VARCHAR(50)   -- Duplicated!
OrderDate    DATE

-- No JOIN needed:
SELECT OrderID, OrderDate, CustomerName, Email, City
FROM Orders;
```

## Pros of Denormalization / Zalety Denormalizacji

### 1. Faster Read Performance / Szybsze Odczyty

**English:**
- **Fewer JOINs**: Reading from a single table is faster than joining multiple tables
- **Reduced I/O**: Less disk access needed
- **Better for Read-Heavy Applications**: E-commerce product listings, social media feeds

**Example:**
```sql
-- Normalized: Requires JOIN (slower)
SELECT o.OrderID, c.CustomerName
FROM Orders o JOIN Customers c ON o.CustomerID = c.CustomerID;

-- Denormalized: Direct read (faster)
SELECT OrderID, CustomerName FROM Orders;
```

**Polski:**
- **Mniej JOIN**: Czytanie z jednej tabeli jest szybsze niż łączenie wielu tabel
- **Zmniejszone I/O**: Potrzebny mniejszy dostęp do dysku
- **Lepsze dla aplikacji z dużą liczbą odczytów**: Listy produktów e-commerce, kanały mediów społecznościowych

### 2. Simpler Queries / Prostsze Zapytania

**English:**
- Easier to write queries
- Less complex SQL
- Fewer chances for query errors
- Better for junior developers or non-technical users

**Polski:**
- Łatwiejsze pisanie zapytań
- Mniej złożony SQL
- Mniejsze szanse na błędy w zapytaniach
- Lepsze dla młodszych programistów lub użytkowników nietechnicznych

### 3. Improved Performance for Specific Use Cases / Lepsza Wydajność dla Konkretnych Przypadków

**English:**
- **Reporting and Analytics**: Aggregated data readily available
- **Caching**: Easier to cache complete data
- **API Responses**: Faster response times
- **Mobile Apps**: Fewer round trips to database

**Polski:**
- **Raportowanie i Analityka**: Zagregowane dane łatwo dostępne
- **Pamięć podręczna**: Łatwiejsze buforowanie kompletnych danych
- **Odpowiedzi API**: Szybsze czasy odpowiedzi
- **Aplikacje mobilne**: Mniej podróży do bazy danych

### 4. Reduced Load on Database / Zmniejszone Obciążenie Bazy

**English:**
- Fewer complex JOIN operations
- Lower CPU usage
- Better scalability for read operations

**Polski:**
- Mniej złożonych operacji JOIN
- Niższe zużycie CPU
- Lepsza skalowalność dla operacji odczytu

## Cons of Denormalization / Wady Denormalizacji

### 1. Data Redundancy / Redundancja Danych

**English:**
- **Duplicate Data**: Same information stored in multiple places
- **Increased Storage**: More disk space required
- **Higher Memory Usage**: More data to cache

**Example:**
```sql
-- If customer "John Doe" has 100 orders:
-- Normalized: Name stored once (1 row in Customers)
-- Denormalized: Name stored 100 times (100 rows in Orders)
```

**Polski:**
- **Duplikowane dane**: Ta sama informacja przechowywana w wielu miejscach
- **Zwiększona pamięć**: Wymagana większa przestrzeń dyskowa
- **Większe zużycie pamięci**: Więcej danych do buforowania

### 2. Data Anomalies / Anomalie Danych

**English:**
- **Update Anomaly**: Updating data in one place but not others
- **Insertion Anomaly**: Difficulty adding new data
- **Deletion Anomaly**: Losing data unintentionally

**Update Anomaly Example:**
```sql
-- Customer changes email address
-- Normalized: Update one row
UPDATE Customers SET Email = 'new@email.com' WHERE CustomerID = 123;

-- Denormalized: Update many rows (risk of inconsistency!)
UPDATE Orders SET Email = 'new@email.com' WHERE CustomerID = 123;
-- What if you miss some rows? Data becomes inconsistent!
```

**Polski:**
- **Anomalia aktualizacji**: Aktualizacja danych w jednym miejscu, ale nie w innych
- **Anomalia wstawiania**: Trudność w dodawaniu nowych danych
- **Anomalia usuwania**: Niezamierzona utrata danych

### 3. Complex Updates / Złożone Aktualizacje

**English:**
- **Slower Writes**: Must update multiple places
- **Transaction Complexity**: More complex transaction logic
- **Application Logic**: Application must ensure consistency

**Example:**
```javascript
// Normalized: Simple update
updateCustomerEmail(customerId, newEmail);

// Denormalized: Complex update (must update everywhere!)
async function updateCustomerEmail(customerId, newEmail) {
  await db.updateCustomers({ customerId, email: newEmail });
  await db.updateOrders({ customerId, email: newEmail });
  await db.updateInvoices({ customerId, email: newEmail });
  await db.updateShipments({ customerId, email: newEmail });
  // If any fails, data becomes inconsistent!
}
```

**Polski:**
- **Wolniejsze zapisy**: Musi aktualizować wiele miejsc
- **Złożoność transakcji**: Bardziej złożona logika transakcji
- **Logika aplikacji**: Aplikacja musi zapewniać spójność

### 4. Data Integrity Risks / Ryzyko Integralności Danych

**English:**
- **Inconsistency**: Data can become out of sync
- **Stale Data**: Old data might remain in some tables
- **No Foreign Key Constraints**: Harder to enforce relationships
- **Maintenance Nightmare**: Difficult to keep consistent over time

**Polski:**
- **Niespójność**: Dane mogą się rozsynchronizować
- **Przestarzałe dane**: Stare dane mogą pozostać w niektórych tabelach
- **Brak ograniczeń klucza obcego**: Trudniej egzekwować relacje
- **Koszmar konserwacji**: Trudne utrzymanie spójności w czasie

### 5. Increased Development Complexity / Zwiększona Złożoność Rozwoju

**English:**
- More code to maintain consistency
- Complex validation logic
- Difficult debugging
- Higher chance of bugs

**Polski:**
- Więcej kodu do utrzymania spójności
- Złożona logika walidacji
- Trudne debugowanie
- Większa szansa na błędy

## When to Denormalize / Kiedy Denormalizować

### Good Candidates for Denormalization / Dobre Kandydaty do Denormalizacji

**1. Read-Heavy Applications / Aplikacje z Dużą Liczbą Odczytów**
- E-commerce product catalogs
- News websites
- Social media feeds
- Analytics dashboards

**2. Historical/Archival Data / Dane Historyczne/Archiwalne**
- Data that rarely changes
- Audit logs
- Snapshots at a point in time
- **Example:** Order history (customer name at time of order)

**3. Frequently Accessed Together / Często Odwiedczane Razem**
- Data always queried together
- **Example:** User profile with avatar URL

**4. Calculated/Aggregated Data / Dane Obliczone/Zagregowane**
- Pre-computed sums, averages, counts
- **Example:** Total order count per customer

### Bad Candidates for Denormalization / Złe Kandydaty do Denormalizacji

**1. Frequently Updated Data / Często Aktualizowane Dane**
- User profiles
- Inventory levels
- Prices

**2. Write-Heavy Applications / Aplikacje z Dużą Liczbą Zapisów**
- Transaction processing systems
- Real-time data ingestion

**3. Data Requiring Strict Consistency / Dane Wymagające Ścisłej Spójności**
- Financial data
- Medical records
- Legal documents

## Denormalization Strategies / Strategie Denormalizacji

### 1. Add Redundant Columns / Dodaj Redundantne Kolumny

```sql
-- Add frequently accessed foreign data
ALTER TABLE Orders
ADD CustomerName VARCHAR(100),
ADD CustomerEmail VARCHAR(100);
```

### 2. Pre-Compute Aggregates / Oblicz Zagregowane Dane Wcześniej

```sql
-- Add calculated fields
ALTER TABLE Customers
ADD TotalOrders INT,
ADD TotalSpent DECIMAL(10,2),
ADD LastOrderDate DATE;

-- Update via trigger or scheduled job
```

### 3. Create Summary Tables / Utwórz Tabele Podsumowujące

```sql
-- Materialized view / aggregation table
CREATE TABLE DailySalesSummary (
    Date DATE,
    TotalOrders INT,
    TotalRevenue DECIMAL(10,2),
    AvgOrderValue DECIMAL(10,2)
);
```

### 4. Use Caching / Użyj Buforowania

```javascript
// Instead of denormalizing, use cache
const customerCache = new Map();

function getCustomerName(customerId) {
  if (customerCache.has(customerId)) {
    return customerCache.get(customerId);
  }
  const name = db.query('SELECT Name FROM Customers WHERE ID = ?', customerId);
  customerCache.set(customerId, name);
  return name;
}
```

### 5. Combine Tables / Połącz Tabele

```sql
-- Instead of two tables:
-- Users(id, username) + UserProfiles(user_id, bio, avatar)

-- One table:
CREATE TABLE Users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    bio TEXT,
    avatar VARCHAR(255)
);
```

## Best Practices / Najlepsze Praktyki

**English:**

1. **Normalize First**: Start with a fully normalized design
2. **Measure Performance**: Use EXPLAIN and profiling to find bottlenecks
3. **Denormalize Selectively**: Only where proven necessary
4. **Document Decisions**: Clearly document what and why
5. **Maintain Consistency**: Use triggers, application logic, or scheduled jobs
6. **Consider Alternatives**: Caching, indexing, read replicas
7. **Monitor**: Track data consistency and performance metrics

**Polski:**

1. **Normalizuj najpierw**: Zacznij od w pełni znormalizowanego projektu
2. **Mierz wydajność**: Użyj EXPLAIN i profilowania, aby znaleźć wąskie gardła
3. **Denormalizuj selektywnie**: Tylko tam, gdzie to konieczne
4. **Dokumentuj decyzje**: Jasno dokumentuj co i dlaczego
5. **Utrzymuj spójność**: Użyj wyzwalaczy, logiki aplikacji lub zaplanowanych zadań
6. **Rozważ alternatywy**: Buforowanie, indeksowanie, repliki odczytu
7. **Monitoruj**: Śledź spójność danych i metryki wydajności

## Real-World Example / Przykład z Rzeczywistości

### E-commerce Order System

**Problem:** Slow query performance for order history page

**Normalized Design (Slow):**
```sql
SELECT o.OrderID, o.OrderDate,
       c.CustomerName, c.Email,
       p.ProductName, p.Price,
       oi.Quantity
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
JOIN OrderItems oi ON o.OrderID = oi.OrderID
JOIN Products p ON oi.ProductID = p.ProductID
WHERE o.CustomerID = 123;
-- 4 JOINs, slow!
```

**Denormalized Solution:**
```sql
-- Add snapshot columns to OrderItems
ALTER TABLE OrderItems
ADD ProductName VARCHAR(100),  -- Snapshot at order time
ADD ProductPrice DECIMAL(10,2), -- Price at order time
ADD CustomerName VARCHAR(100);  -- Customer name at order time

-- Now simple query:
SELECT OrderID, OrderDate, ProductName, ProductPrice, Quantity, CustomerName
FROM OrderItems
WHERE CustomerID = 123;
-- No JOINs, fast!
```

**Why this works:**
- Order history is **read-only** (historical data)
- Product names/prices **shouldn't change** in history
- Much **faster** for displaying order history
- **Trade-off**: More storage, but acceptable for better UX

## Decision Matrix / Macierz Decyzyjna

| Factor | Favor Normalization | Favor Denormalization |
|--------|-------------------|---------------------|
| Read/Write Ratio | Write-heavy | Read-heavy |
| Data Consistency | Critical | Less critical |
| Storage Cost | High | Low |
| Query Complexity | Can handle complex | Need simplicity |
| Data Volatility | Frequently updated | Rarely updated |
| Team Experience | Experienced | Less experienced |
| Data Size | Very large | Moderate |

## Conclusion / Podsumowanie

**English:**
Denormalization is a powerful optimization technique but should be used carefully. Always start with a normalized design, measure performance, and denormalize only where necessary. The key is finding the right balance between read performance and data integrity for your specific use case.

**Polski:**
Denormalizacja to potężna technika optymalizacji, ale powinna być używana ostrożnie. Zawsze zaczynaj od znormalizowanego projektu, mierz wydajność i denormalizuj tylko tam, gdzie to konieczne. Kluczem jest znalezienie odpowiedniej równowagi między wydajnością odczytu a integralnością danych dla konkretnego przypadku użycia.

## Implementation / Implementacja

See `solution.js` for practical examples comparing normalized vs denormalized schemas with performance demonstrations.
