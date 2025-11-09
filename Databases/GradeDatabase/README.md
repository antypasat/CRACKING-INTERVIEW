# Grade Database Design - Honor Roll Query

## Problem Description / Opis Problemu

**English:**
Imagine a simple database storing information for students' grades. Design what this database might look like and provide a SQL query to return a list of the honor roll students (top 10%), sorted by their grade point average.

**Polski:**
Wyobraź sobie prostą bazę danych przechowującą informacje o ocenach studentów. Zaprojektuj, jak taka baza danych mogłaby wyglądać i podaj zapytanie SQL, które zwróci listę studentów z listy honorowej (górne 10%), posortowanych według średniej ocen.

## Database Schema Design / Projekt Schematu Bazy Danych

### Entity-Relationship Diagram / Diagram Związków Encji

```
┌──────────────────────────────────────────────────────────────────────┐
│                    GRADE DATABASE SCHEMA                             │
│                    SCHEMAT BAZY DANYCH OCEN                          │
└──────────────────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │    Students      │
        │                  │
        │ PK StudentID     │
        │    FirstName     │
        │    LastName      │
        │    Email         │
        │    EnrollDate    │
        │    Major         │
        │    GraduationYear│
        └────────┬─────────┘
                 │
                 │ One-to-Many
                 │
        ┌────────▼─────────┐
        │    Enrollments   │        ┌──────────────────┐
        │ (Junction Table) │        │     Courses      │
        │                  │        │                  │
        │ PK EnrollmentID  │        │ PK  CourseID     │
        │ FK StudentID     │        │     CourseCode   │
        │ FK CourseID      │◄───────│     CourseName   │
        │    Semester      │        │     Credits      │
        │    Year          │        │     Department   │
        │    Grade         │        │     Difficulty   │
        │    GradePoint    │        └──────────────────┘
        └──────────────────┘
                                    One-to-Many
```

### Table Definitions / Definicje Tabel

#### 1. Students Table

```sql
CREATE TABLE Students (
    StudentID        INT PRIMARY KEY AUTO_INCREMENT,
    FirstName        VARCHAR(50) NOT NULL,
    LastName         VARCHAR(50) NOT NULL,
    Email            VARCHAR(100) UNIQUE NOT NULL,
    EnrollDate       DATE NOT NULL,
    Major            VARCHAR(50),
    GraduationYear   INT,
    CreatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_students_email ON Students(Email);
CREATE INDEX idx_students_name ON Students(LastName, FirstName);
CREATE INDEX idx_students_major ON Students(Major);
```

#### 2. Courses Table

```sql
CREATE TABLE Courses (
    CourseID         INT PRIMARY KEY AUTO_INCREMENT,
    CourseCode       VARCHAR(20) UNIQUE NOT NULL,
    CourseName       VARCHAR(100) NOT NULL,
    Credits          DECIMAL(3, 1) NOT NULL,      -- e.g., 3.0, 4.5
    Department       VARCHAR(50),
    Difficulty       ENUM('Introductory', 'Intermediate', 'Advanced', 'Graduate'),
    Description      TEXT,
    CreatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_courses_code ON Courses(CourseCode);
CREATE INDEX idx_courses_dept ON Courses(Department);
```

#### 3. Enrollments Table (Stores Grades)

```sql
CREATE TABLE Enrollments (
    EnrollmentID     INT PRIMARY KEY AUTO_INCREMENT,
    StudentID        INT NOT NULL,
    CourseID         INT NOT NULL,
    Semester         ENUM('Fall', 'Spring', 'Summer') NOT NULL,
    Year             INT NOT NULL,
    Grade            VARCHAR(2),                      -- 'A+', 'A', 'A-', 'B+', etc.
    GradePoint       DECIMAL(3, 2),                   -- 4.00, 3.67, 3.33, etc.
    Status           ENUM('Enrolled', 'Completed', 'Withdrawn', 'Incomplete') DEFAULT 'Enrolled',
    EnrolledDate     DATE NOT NULL,
    CompletedDate    DATE,
    CreatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    -- Prevent duplicate enrollment in same course in same semester
    UNIQUE KEY unique_enrollment (StudentID, CourseID, Semester, Year)
);

-- Indexes
CREATE INDEX idx_enrollments_student ON Enrollments(StudentID);
CREATE INDEX idx_enrollments_course ON Enrollments(CourseID);
CREATE INDEX idx_enrollments_grade ON Enrollments(GradePoint);
CREATE INDEX idx_enrollments_semester ON Enrollments(Year, Semester);
```

### Grade Point Scale / Skala Punktów za Oceny

```sql
-- Standard US GPA Scale (4.0 scale)
A+  = 4.00
A   = 4.00
A-  = 3.67
B+  = 3.33
B   = 3.00
B-  = 2.67
C+  = 2.33
C   = 2.00
C-  = 1.67
D+  = 1.33
D   = 1.00
F   = 0.00
```

## Honor Roll Query / Zapytanie o Listę Honorową

### Solution 1: Using Window Function (Modern SQL)

**English:**
The most elegant solution uses window functions (PERCENT_RANK or NTILE) to calculate percentiles.

**Polski:**
Najbardziej eleganckie rozwiązanie używa funkcji okienkowych (PERCENT_RANK lub NTILE) do obliczenia percentyli.

```sql
-- Get top 10% students by GPA (Honor Roll)
WITH StudentGPA AS (
    SELECT
        s.StudentID,
        s.FirstName,
        s.LastName,
        s.Major,
        -- Calculate GPA as weighted average by credits
        SUM(e.GradePoint * c.Credits) / SUM(c.Credits) AS GPA,
        COUNT(e.EnrollmentID) AS TotalCourses,
        SUM(c.Credits) AS TotalCredits,
        -- Calculate percentile rank
        PERCENT_RANK() OVER (ORDER BY SUM(e.GradePoint * c.Credits) / SUM(c.Credits) DESC) AS PercentileRank
    FROM Students s
    INNER JOIN Enrollments e ON s.StudentID = e.StudentID
    INNER JOIN Courses c ON e.CourseID = c.CourseID
    WHERE e.Status = 'Completed'
      AND e.GradePoint IS NOT NULL
    GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major
    HAVING COUNT(e.EnrollmentID) >= 5  -- Minimum 5 completed courses
)
SELECT
    StudentID,
    FirstName,
    LastName,
    Major,
    ROUND(GPA, 2) AS GPA,
    TotalCourses,
    TotalCredits,
    ROUND(PercentileRank * 100, 1) AS Percentile
FROM StudentGPA
WHERE PercentileRank <= 0.10  -- Top 10%
ORDER BY GPA DESC;
```

**Explanation / Wyjaśnienie:**

**English:**
1. **CTE (Common Table Expression)**: Calculate GPA for each student
2. **Weighted Average**: GPA = Σ(GradePoint × Credits) / Σ(Credits)
3. **PERCENT_RANK()**: Calculate percentile rank (0.0 to 1.0)
4. **Filter for Top 10%**: WHERE PercentileRank <= 0.10
5. **Minimum Requirements**: At least 5 completed courses
6. **Sort by GPA**: Highest to lowest

**Polski:**
1. **CTE (Wspólne Wyrażenie Tabelaryczne)**: Oblicz GPA dla każdego studenta
2. **Średnia ważona**: GPA = Σ(GradePoint × Credits) / Σ(Credits)
3. **PERCENT_RANK()**: Oblicz ranking percentylowy (0.0 do 1.0)
4. **Filtr dla górnych 10%**: WHERE PercentileRank <= 0.10
5. **Minimalne wymagania**: Co najmniej 5 ukończonych kursów
6. **Sortuj według GPA**: Od najwyższego do najniższego

### Solution 2: Using LIMIT (Simpler, but less precise)

```sql
-- Calculate GPA and select top 10%
SELECT
    s.StudentID,
    s.FirstName,
    s.LastName,
    s.Major,
    ROUND(SUM(e.GradePoint * c.Credits) / SUM(c.Credits), 2) AS GPA,
    COUNT(e.EnrollmentID) AS TotalCourses,
    SUM(c.Credits) AS TotalCredits
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE e.Status = 'Completed'
  AND e.GradePoint IS NOT NULL
GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major
HAVING COUNT(e.EnrollmentID) >= 5
ORDER BY GPA DESC
LIMIT (SELECT CEIL(COUNT(DISTINCT s2.StudentID) * 0.10)
       FROM Students s2
       INNER JOIN Enrollments e2 ON s2.StudentID = e2.StudentID
       WHERE e2.Status = 'Completed');
```

**Note:** Some databases don't support subqueries in LIMIT, so you may need to calculate the limit value separately.

### Solution 3: Using Variables (MySQL)

```sql
-- Set variable for 10% threshold
SET @total_students = (
    SELECT COUNT(DISTINCT s.StudentID)
    FROM Students s
    INNER JOIN Enrollments e ON s.StudentID = e.StudentID
    WHERE e.Status = 'Completed'
);

SET @top_10_percent = CEIL(@total_students * 0.10);

-- Query for honor roll
SELECT
    s.StudentID,
    s.FirstName,
    s.LastName,
    s.Major,
    ROUND(SUM(e.GradePoint * c.Credits) / SUM(c.Credits), 2) AS GPA,
    COUNT(e.EnrollmentID) AS TotalCourses,
    SUM(c.Credits) AS TotalCredits
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE e.Status = 'Completed'
  AND e.GradePoint IS NOT NULL
GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major
HAVING COUNT(e.EnrollmentID) >= 5
ORDER BY GPA DESC
LIMIT @top_10_percent;
```

## Additional Useful Queries / Dodatkowe Przydatne Zapytania

### Query 1: Student Transcript

```sql
-- Get complete transcript for a student
SELECT
    s.FirstName,
    s.LastName,
    c.CourseCode,
    c.CourseName,
    c.Credits,
    e.Semester,
    e.Year,
    e.Grade,
    e.GradePoint
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE s.StudentID = 1
  AND e.Status = 'Completed'
ORDER BY e.Year DESC, e.Semester, c.CourseCode;
```

### Query 2: GPA by Major

```sql
-- Average GPA by major
SELECT
    s.Major,
    COUNT(DISTINCT s.StudentID) AS StudentCount,
    ROUND(AVG(student_gpa.GPA), 2) AS AverageGPA
FROM Students s
INNER JOIN (
    SELECT
        s2.StudentID,
        SUM(e.GradePoint * c.Credits) / SUM(c.Credits) AS GPA
    FROM Students s2
    INNER JOIN Enrollments e ON s2.StudentID = e.StudentID
    INNER JOIN Courses c ON e.CourseID = c.CourseID
    WHERE e.Status = 'Completed'
    GROUP BY s2.StudentID
) student_gpa ON s.StudentID = student_gpa.StudentID
GROUP BY s.Major
ORDER BY AverageGPA DESC;
```

### Query 3: Dean's List (GPA >= 3.5)

```sql
-- Students on Dean's List (GPA >= 3.5)
SELECT
    s.StudentID,
    s.FirstName,
    s.LastName,
    s.Major,
    ROUND(SUM(e.GradePoint * c.Credits) / SUM(c.Credits), 2) AS GPA
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE e.Status = 'Completed'
  AND e.GradePoint IS NOT NULL
GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major
HAVING GPA >= 3.5
ORDER BY GPA DESC;
```

### Query 4: Grade Distribution for a Course

```sql
-- Grade distribution for a specific course
SELECT
    c.CourseCode,
    c.CourseName,
    e.Grade,
    COUNT(*) AS StudentCount,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS Percentage
FROM Courses c
INNER JOIN Enrollments e ON c.CourseID = e.CourseID
WHERE c.CourseID = 1
  AND e.Status = 'Completed'
GROUP BY c.CourseCode, c.CourseName, e.Grade
ORDER BY e.GradePoint DESC;
```

### Query 5: Students at Risk (GPA < 2.0)

```sql
-- Students with low GPA (academic probation)
SELECT
    s.StudentID,
    s.FirstName,
    s.LastName,
    s.Major,
    ROUND(SUM(e.GradePoint * c.Credits) / SUM(c.Credits), 2) AS GPA,
    'At Risk' AS Status
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE e.Status = 'Completed'
  AND e.GradePoint IS NOT NULL
GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major
HAVING GPA < 2.0
ORDER BY GPA ASC;
```

## Design Considerations / Uwagi Projektowe

### Why Separate Enrollments Table?

**English:**
1. **Flexibility**: Allows students to retake courses
2. **Historical Data**: Tracks semester-by-semester performance
3. **Many-to-Many**: Students take multiple courses; courses have multiple students
4. **Withdrawal Support**: Can track withdrawn courses
5. **Future Courses**: Can enroll before grades are assigned

**Polski:**
1. **Elastyczność**: Pozwala studentom na powtarzanie kursów
2. **Dane historyczne**: Śledzi wyniki semestr po semestrze
3. **Wiele-do-wielu**: Studenci biorą wiele kursów; kursy mają wielu studentów
4. **Obsługa wycofań**: Może śledzić wycofane kursy
5. **Przyszłe kursy**: Może zapisać przed przyznaniem ocen

### GPA Calculation Methods

**1. Simple Average (Not Recommended)**
```sql
AVG(GradePoint)  -- Ignores credit hours
```

**2. Weighted Average by Credits (Recommended)**
```sql
SUM(GradePoint * Credits) / SUM(Credits)  -- Accounts for course weight
```

**3. Cumulative GPA vs Semester GPA**
```sql
-- Cumulative (all time)
SUM(GradePoint * Credits) / SUM(Credits)

-- Specific semester
WHERE Semester = 'Fall' AND Year = 2024
```

### Alternative: Denormalized Design with GPA Column

```sql
-- Add computed column to Students table
ALTER TABLE Students
ADD COLUMN CurrentGPA DECIMAL(3, 2),
ADD COLUMN TotalCredits DECIMAL(5, 1);

-- Update via trigger or scheduled job
CREATE TRIGGER update_gpa_after_grade
AFTER UPDATE ON Enrollments
FOR EACH ROW
BEGIN
    UPDATE Students s
    SET CurrentGPA = (
        SELECT SUM(e.GradePoint * c.Credits) / SUM(c.Credits)
        FROM Enrollments e
        INNER JOIN Courses c ON e.CourseID = c.CourseID
        WHERE e.StudentID = NEW.StudentID
          AND e.Status = 'Completed'
    )
    WHERE s.StudentID = NEW.StudentID;
END;
```

**Pros:** Faster queries
**Cons:** Data duplication, maintenance complexity

## Performance Optimization / Optymalizacja Wydajności

### Indexes

```sql
-- Composite indexes for common queries
CREATE INDEX idx_enrollments_student_status
    ON Enrollments(StudentID, Status);

CREATE INDEX idx_enrollments_grade_status
    ON Enrollments(GradePoint, Status);

-- Covering index for GPA calculation
CREATE INDEX idx_enrollments_gpa_calc
    ON Enrollments(StudentID, CourseID, GradePoint, Status)
    INCLUDE (CourseID);
```

### Materialized View (PostgreSQL)

```sql
-- Pre-compute GPAs
CREATE MATERIALIZED VIEW student_gpa_view AS
SELECT
    s.StudentID,
    s.FirstName,
    s.LastName,
    s.Major,
    SUM(e.GradePoint * c.Credits) / SUM(c.Credits) AS GPA,
    COUNT(e.EnrollmentID) AS TotalCourses,
    SUM(c.Credits) AS TotalCredits
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE e.Status = 'Completed'
GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major;

-- Refresh periodically
REFRESH MATERIALIZED VIEW student_gpa_view;

-- Query honor roll from materialized view
SELECT * FROM student_gpa_view
WHERE GPA >= (SELECT PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY GPA) FROM student_gpa_view)
ORDER BY GPA DESC;
```

## Implementation / Implementacja

See `solution.js` for:
- Sample data for students, courses, and enrollments
- JavaScript implementation of GPA calculation
- Honor roll query simulation
- Various statistical queries
- Edge case handling

## Extensions / Rozszerzenia

**Possible enhancements:**
1. Add `GradeHistory` table for audit trail
2. Add `Advisors` table for student-advisor relationships
3. Add `Prerequisites` table for course dependencies
4. Add `Scholarships` based on GPA thresholds
5. Track transfer credits
6. Support for Pass/Fail courses
7. Latin Honors calculation (Summa Cum Laude, etc.)
