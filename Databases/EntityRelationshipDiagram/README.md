# Entity-Relationship Diagram - Companies, People, and Professionals

## Problem Description / Opis Problemu

**English:**
Draw an entity-relationship diagram for a database with companies, people, and professionals (people who work for companies).

**Polski:**
Narysuj diagram związków encji dla bazy danych z firmami, ludźmi i profesjonalistami (ludźmi, którzy pracują dla firm).

## Understanding the Requirements / Zrozumienie Wymagań

**English:**
We need to model three concepts:
1. **Companies**: Organizations/businesses
2. **People**: Individuals (can be anyone)
3. **Professionals**: People who work for companies (a subset of people)

**Key Relationships:**
- A person can work for one or more companies
- A company can employ multiple professionals
- Not all people are professionals
- A professional is a person (inheritance/subtype relationship)

**Polski:**
Musimy zamodelować trzy koncepty:
1. **Firmy (Companies)**: Organizacje/przedsiębiorstwa
2. **Ludzie (People)**: Osoby (mogą być kimkolwiek)
3. **Profesjonaliści (Professionals)**: Ludzie, którzy pracują dla firm (podzbiór ludzi)

**Kluczowe relacje:**
- Osoba może pracować dla jednej lub więcej firm
- Firma może zatrudniać wielu profesjonalistów
- Nie wszyscy ludzie są profesjonalistami
- Profesjonalista to osoba (relacja dziedziczenia/podtypu)

## Entity-Relationship Diagram / Diagram Związków Encji

### Approach 1: Separate Professional Table (Inheritance)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ENTITY-RELATIONSHIP DIAGRAM                      │
│                   DIAGRAM ZWIĄZKÓW ENCJI                            │
└─────────────────────────────────────────────────────────────────────┘

                        ┌──────────────────┐
                        │     People       │
                        │                  │
                        │ PK  PersonID     │
                        │     FirstName    │
                        │     LastName     │
                        │     Email        │
                        │     Phone        │
                        │     DateOfBirth  │
                        └────────┬─────────┘
                                 │
                                 │ IS-A (Inheritance)
                                 │ One-to-One
                                 │
                        ┌────────▼─────────┐
                        │  Professionals   │
                        │                  │
                        │ PK  ProfessionalID│
                        │ FK  PersonID     │───────┐
                        │     Title        │       │
                        │     Specialty    │       │
                        │     HireDate     │       │
                        │     Salary       │       │
                        └──────────────────┘       │
                                 │                 │
                                 │                 │
                                 │ Many-to-Many    │
                                 │                 │
                        ┌────────▼─────────┐       │
                        │   Employment     │       │
                        │  (Junction Table)│       │
                        │                  │       │
                        │ PK  EmploymentID │       │
                        │ FK  ProfessionalID◄──────┘
                        │ FK  CompanyID    │───────┐
                        │     StartDate    │       │
                        │     EndDate      │       │
                        │     Position     │       │
                        │     Department   │       │
                        └──────────────────┘       │
                                 │                 │
                                 │                 │
                                 │ Many-to-One     │
                                 │                 │
                        ┌────────▼─────────┐       │
                        │    Companies     │       │
                        │                  │       │
                        │ PK  CompanyID    │◄──────┘
                        │     CompanyName  │
                        │     Industry     │
                        │     Location     │
                        │     FoundedDate  │
                        │     Website      │
                        └──────────────────┘

LEGEND / LEGENDA:
─────────────────
PK = Primary Key / Klucz główny
FK = Foreign Key / Klucz obcy
│  = Relationship / Relacja
▼  = Direction of relationship / Kierunek relacji
```

### Cardinality Notation / Notacja Kardynalności

```
People (1) ──────── (0..1) Professionals
  "A person may or may not be a professional"
  "Osoba może być lub nie być profesjonalistą"

Professionals (1) ──────── (M) Employment
  "A professional can have multiple employments"
  "Profesjonalista może mieć wiele zatrudnień"

Companies (1) ──────── (M) Employment
  "A company can employ multiple professionals"
  "Firma może zatrudniać wielu profesjonalistów"

Therefore: Professionals (M) ──────── (N) Companies
  "Many-to-Many relationship through Employment"
  "Relacja wiele-do-wielu przez Employment"
```

## Database Schema / Schemat Bazy Danych

### Table Definitions / Definicje Tabel

#### 1. People Table

```sql
CREATE TABLE People (
    PersonID         INT PRIMARY KEY AUTO_INCREMENT,
    FirstName        VARCHAR(50) NOT NULL,
    LastName         VARCHAR(50) NOT NULL,
    Email            VARCHAR(100) UNIQUE,
    Phone            VARCHAR(20),
    DateOfBirth      DATE,
    Address          VARCHAR(255),
    City             VARCHAR(50),
    State            VARCHAR(50),
    ZipCode          VARCHAR(10),
    Country          VARCHAR(50),
    CreatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_people_email ON People(Email);
CREATE INDEX idx_people_name ON People(LastName, FirstName);
```

**Purpose / Cel:**
Stores information about all individuals, whether they are professionals or not.

#### 2. Companies Table

```sql
CREATE TABLE Companies (
    CompanyID        INT PRIMARY KEY AUTO_INCREMENT,
    CompanyName      VARCHAR(100) NOT NULL,
    Industry         VARCHAR(50),
    Location         VARCHAR(255),
    City             VARCHAR(50),
    State            VARCHAR(50),
    Country          VARCHAR(50),
    FoundedDate      DATE,
    Website          VARCHAR(255),
    EmployeeCount    INT,
    Revenue          DECIMAL(15, 2),
    Description      TEXT,
    CreatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_companies_name ON Companies(CompanyName);
CREATE INDEX idx_companies_industry ON Companies(Industry);
```

**Purpose / Cel:**
Stores information about companies/organizations.

#### 3. Professionals Table

```sql
CREATE TABLE Professionals (
    ProfessionalID   INT PRIMARY KEY AUTO_INCREMENT,
    PersonID         INT NOT NULL UNIQUE,
    Title            VARCHAR(100),        -- e.g., "Software Engineer", "Manager"
    Specialty        VARCHAR(100),        -- e.g., "Backend Development", "Marketing"
    YearsExperience  INT,
    Education        VARCHAR(255),
    Certifications   TEXT,
    LinkedInURL      VARCHAR(255),
    Resume           TEXT,
    CreatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (PersonID) REFERENCES People(PersonID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX idx_professionals_person ON Professionals(PersonID);
CREATE INDEX idx_professionals_specialty ON Professionals(Specialty);
```

**Purpose / Cel:**
Extends the People table with professional-specific attributes. Implements inheritance through foreign key.

#### 4. Employment Table (Junction/Bridge Table)

```sql
CREATE TABLE Employment (
    EmploymentID     INT PRIMARY KEY AUTO_INCREMENT,
    ProfessionalID   INT NOT NULL,
    CompanyID        INT NOT NULL,
    Position         VARCHAR(100) NOT NULL,
    Department       VARCHAR(100),
    StartDate        DATE NOT NULL,
    EndDate          DATE,                -- NULL if currently employed
    Salary           DECIMAL(10, 2),
    EmploymentType   ENUM('Full-time', 'Part-time', 'Contract', 'Intern') DEFAULT 'Full-time',
    IsCurrentJob     BOOLEAN GENERATED ALWAYS AS (EndDate IS NULL) STORED,
    ReasonForLeaving VARCHAR(255),
    CreatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ProfessionalID) REFERENCES Professionals(ProfessionalID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Prevent duplicate current employments at same company
    UNIQUE KEY unique_current_employment (ProfessionalID, CompanyID, IsCurrentJob)
);

-- Indexes
CREATE INDEX idx_employment_professional ON Employment(ProfessionalID);
CREATE INDEX idx_employment_company ON Employment(CompanyID);
CREATE INDEX idx_employment_dates ON Employment(StartDate, EndDate);
CREATE INDEX idx_employment_current ON Employment(IsCurrentJob);
```

**Purpose / Cel:**
Implements the many-to-many relationship between Professionals and Companies. Stores employment history.

## Relationships Explained / Wyjaśnienie Relacji

### 1. People → Professionals (One-to-Zero-or-One)

**English:**
- **Type**: IS-A relationship (inheritance/subtype)
- **Cardinality**: One Person can be at most one Professional
- **Implementation**: Foreign key from Professionals to People with UNIQUE constraint
- **Business Rule**: Not all people are professionals, but every professional must be a person

**Polski:**
- **Typ**: Relacja IS-A (dziedziczenie/podtyp)
- **Kardynalność**: Jedna osoba może być co najwyżej jednym profesjonalistą
- **Implementacja**: Klucz obcy z Professionals do People z ograniczeniem UNIQUE
- **Reguła biznesowa**: Nie wszyscy ludzie są profesjonalistami, ale każdy profesjonalista musi być osobą

### 2. Professionals → Employment (One-to-Many)

**English:**
- **Type**: One-to-Many
- **Cardinality**: One Professional can have many Employment records
- **Business Rule**: Tracks employment history (past and current jobs)

**Polski:**
- **Typ**: Jeden-do-wielu
- **Kardynalność**: Jeden profesjonalista może mieć wiele rekordów Employment
- **Reguła biznesowa**: Śledzi historię zatrudnienia (przeszłe i obecne prace)

### 3. Companies → Employment (One-to-Many)

**English:**
- **Type**: One-to-Many
- **Cardinality**: One Company can have many Employment records
- **Business Rule**: Company can employ multiple professionals

**Polski:**
- **Typ**: Jeden-do-wielu
- **Kardynalność**: Jedna firma może mieć wiele rekordów Employment
- **Reguła biznesowa**: Firma może zatrudniać wielu profesjonalistów

### 4. Professionals ↔ Companies (Many-to-Many)

**English:**
- **Type**: Many-to-Many (through Employment junction table)
- **Cardinality**: Professional can work for many Companies; Company can employ many Professionals
- **Business Rule**: Tracks current and historical relationships

**Polski:**
- **Typ**: Wiele-do-wielu (przez tabelę łączącą Employment)
- **Kardynalność**: Profesjonalista może pracować dla wielu firm; Firma może zatrudniać wielu profesjonalistów
- **Reguła biznesowa**: Śledzi obecne i historyczne relacje

## Sample Queries / Przykładowe Zapytania

### Query 1: Get all professionals working for a specific company

```sql
SELECT
    p.FirstName,
    p.LastName,
    pr.Title,
    e.Position,
    e.Department,
    e.StartDate
FROM People p
INNER JOIN Professionals pr ON p.PersonID = pr.PersonID
INNER JOIN Employment e ON pr.ProfessionalID = e.ProfessionalID
WHERE e.CompanyID = 1
  AND e.EndDate IS NULL  -- Currently employed
ORDER BY e.StartDate;
```

### Query 2: Get employment history for a person

```sql
SELECT
    c.CompanyName,
    e.Position,
    e.StartDate,
    e.EndDate,
    CASE
        WHEN e.EndDate IS NULL THEN 'Current'
        ELSE 'Former'
    END AS Status
FROM People p
INNER JOIN Professionals pr ON p.PersonID = pr.PersonID
INNER JOIN Employment e ON pr.ProfessionalID = e.ProfessionalID
INNER JOIN Companies c ON e.CompanyID = c.CompanyID
WHERE p.PersonID = 123
ORDER BY e.StartDate DESC;
```

### Query 3: Find people who are NOT professionals

```sql
SELECT
    p.PersonID,
    p.FirstName,
    p.LastName,
    p.Email
FROM People p
LEFT JOIN Professionals pr ON p.PersonID = pr.PersonID
WHERE pr.ProfessionalID IS NULL;
```

### Query 4: Get companies with their employee count

```sql
SELECT
    c.CompanyID,
    c.CompanyName,
    COUNT(DISTINCT e.ProfessionalID) AS CurrentEmployees
FROM Companies c
LEFT JOIN Employment e ON c.CompanyID = e.CompanyID AND e.EndDate IS NULL
GROUP BY c.CompanyID, c.CompanyName
ORDER BY CurrentEmployees DESC;
```

### Query 5: Find professionals who have worked for multiple companies

```sql
SELECT
    p.PersonID,
    p.FirstName,
    p.LastName,
    COUNT(DISTINCT e.CompanyID) AS CompanyCount
FROM People p
INNER JOIN Professionals pr ON p.PersonID = pr.PersonID
INNER JOIN Employment e ON pr.ProfessionalID = e.ProfessionalID
GROUP BY p.PersonID, p.FirstName, p.LastName
HAVING COUNT(DISTINCT e.CompanyID) > 1
ORDER BY CompanyCount DESC;
```

## Alternative Design: Single Table with Flag / Alternatywny Projekt: Jedna Tabela z Flagą

```sql
-- Simpler but less normalized approach
CREATE TABLE People (
    PersonID         INT PRIMARY KEY AUTO_INCREMENT,
    FirstName        VARCHAR(50) NOT NULL,
    LastName         VARCHAR(50) NOT NULL,
    Email            VARCHAR(100) UNIQUE,
    IsProfessional   BOOLEAN DEFAULT FALSE,

    -- Professional-specific fields (NULL for non-professionals)
    Title            VARCHAR(100),
    Specialty        VARCHAR(100),
    YearsExperience  INT
);
```

**Pros:** Simpler design, fewer joins
**Cons:** Many NULL values for non-professionals, violates normalization

## Design Decisions / Decyzje Projektowe

### Why Separate Professionals Table?

**English:**
1. **Clear Separation**: Not all people are professionals
2. **Flexibility**: Easy to add professional-specific attributes
3. **Data Integrity**: Enforces that professional data only exists for actual professionals
4. **Extensibility**: Can add other subtypes (e.g., Students, Customers) later

**Polski:**
1. **Jasna separacja**: Nie wszyscy ludzie są profesjonalistami
2. **Elastyczność**: Łatwo dodać atrybuty specyficzne dla profesjonalistów
3. **Integralność danych**: Wymusza, że dane profesjonalne istnieją tylko dla rzeczywistych profesjonalistów
4. **Rozszerzalność**: Można później dodać inne podtypy (np. Students, Customers)

### Why Employment Junction Table?

**English:**
1. **Many-to-Many**: Models real-world scenario where professionals change jobs
2. **Employment History**: Tracks past and current employments
3. **Rich Relationship**: Stores employment-specific data (position, dates, salary)
4. **Flexibility**: Supports consultants working for multiple companies simultaneously

**Polski:**
1. **Wiele-do-wielu**: Modeluje rzeczywisty scenariusz, w którym profesjonaliści zmieniają pracę
2. **Historia zatrudnienia**: Śledzi przeszłe i obecne zatrudnienia
3. **Bogata relacja**: Przechowuje dane specyficzne dla zatrudnienia (stanowisko, daty, wynagrodzenie)
4. **Elastyczność**: Obsługuje konsultantów pracujących dla wielu firm jednocześnie

## Implementation / Implementacja

See `solution.js` for:
- Sample data insertion
- Complex queries demonstrating relationships
- Data validation examples
- Common operations (hiring, termination, job change)
