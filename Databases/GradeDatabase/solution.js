/**
 * Grade Database Design - Honor Roll Query
 *
 * This file demonstrates a student grade database with GPA calculation
 * and honor roll (top 10%) query implementation.
 */

// ============================================================================
// GRADE POINT CONVERSION / KONWERSJA PUNKTÓW ZA OCENY
// ============================================================================

const gradeToGPA = {
  'A+': 4.00,
  'A': 4.00,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.00,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.00,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.00,
  'F': 0.00
};

// ============================================================================
// DATABASE TABLES / TABELE BAZY DANYCH
// ============================================================================

const students = [
  { StudentID: 1, FirstName: 'Alice', LastName: 'Anderson', Email: 'alice@university.edu', Major: 'Computer Science', GraduationYear: 2025 },
  { StudentID: 2, FirstName: 'Bob', LastName: 'Brown', Email: 'bob@university.edu', Major: 'Mathematics', GraduationYear: 2025 },
  { StudentID: 3, FirstName: 'Charlie', LastName: 'Chen', Email: 'charlie@university.edu', Major: 'Computer Science', GraduationYear: 2026 },
  { StudentID: 4, FirstName: 'Diana', LastName: 'Davis', Email: 'diana@university.edu', Major: 'Physics', GraduationYear: 2025 },
  { StudentID: 5, FirstName: 'Eve', LastName: 'Evans', Email: 'eve@university.edu', Major: 'Chemistry', GraduationYear: 2026 },
  { StudentID: 6, FirstName: 'Frank', LastName: 'Foster', Email: 'frank@university.edu', Major: 'Biology', GraduationYear: 2025 },
  { StudentID: 7, FirstName: 'Grace', LastName: 'Garcia', Email: 'grace@university.edu', Major: 'Mathematics', GraduationYear: 2026 },
  { StudentID: 8, FirstName: 'Henry', LastName: 'Harris', Email: 'henry@university.edu', Major: 'Computer Science', GraduationYear: 2025 },
  { StudentID: 9, FirstName: 'Ivy', LastName: 'Irwin', Email: 'ivy@university.edu', Major: 'Physics', GraduationYear: 2026 },
  { StudentID: 10, FirstName: 'Jack', LastName: 'Jones', Email: 'jack@university.edu', Major: 'Chemistry', GraduationYear: 2025 }
];

const courses = [
  { CourseID: 1, CourseCode: 'CS101', CourseName: 'Intro to Programming', Credits: 4, Department: 'Computer Science' },
  { CourseID: 2, CourseCode: 'MATH201', CourseName: 'Calculus II', Credits: 4, Department: 'Mathematics' },
  { CourseID: 3, CourseCode: 'PHYS101', CourseName: 'Physics I', Credits: 4, Department: 'Physics' },
  { CourseID: 4, CourseCode: 'CHEM101', CourseName: 'General Chemistry', Credits: 4, Department: 'Chemistry' },
  { CourseID: 5, CourseCode: 'CS201', CourseName: 'Data Structures', Credits: 4, Department: 'Computer Science' },
  { CourseID: 6, CourseCode: 'MATH301', CourseName: 'Linear Algebra', Credits: 3, Department: 'Mathematics' },
  { CourseID: 7, CourseCode: 'ENG101', CourseName: 'English Composition', Credits: 3, Department: 'English' },
  { CourseID: 8, CourseCode: 'HIST101', CourseName: 'World History', Credits: 3, Department: 'History' }
];

const enrollments = [
  // Alice - Excellent student (GPA ~3.9)
  { EnrollmentID: 1, StudentID: 1, CourseID: 1, Semester: 'Fall', Year: 2023, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 2, StudentID: 1, CourseID: 2, Semester: 'Fall', Year: 2023, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 3, StudentID: 1, CourseID: 3, Semester: 'Spring', Year: 2024, Grade: 'A-', Status: 'Completed' },
  { EnrollmentID: 4, StudentID: 1, CourseID: 5, Semester: 'Spring', Year: 2024, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 5, StudentID: 1, CourseID: 7, Semester: 'Fall', Year: 2024, Grade: 'A', Status: 'Completed' },

  // Bob - Good student (GPA ~3.5)
  { EnrollmentID: 6, StudentID: 2, CourseID: 2, Semester: 'Fall', Year: 2023, Grade: 'A-', Status: 'Completed' },
  { EnrollmentID: 7, StudentID: 2, CourseID: 6, Semester: 'Fall', Year: 2023, Grade: 'B+', Status: 'Completed' },
  { EnrollmentID: 8, StudentID: 2, CourseID: 3, Semester: 'Spring', Year: 2024, Grade: 'A-', Status: 'Completed' },
  { EnrollmentID: 9, StudentID: 2, CourseID: 7, Semester: 'Spring', Year: 2024, Grade: 'B+', Status: 'Completed' },
  { EnrollmentID: 10, StudentID: 2, CourseID: 8, Semester: 'Fall', Year: 2024, Grade: 'A', Status: 'Completed' },

  // Charlie - Very good student (GPA ~3.8)
  { EnrollmentID: 11, StudentID: 3, CourseID: 1, Semester: 'Fall', Year: 2023, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 12, StudentID: 3, CourseID: 5, Semester: 'Spring', Year: 2024, Grade: 'A-', Status: 'Completed' },
  { EnrollmentID: 13, StudentID: 3, CourseID: 2, Semester: 'Spring', Year: 2024, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 14, StudentID: 3, CourseID: 7, Semester: 'Fall', Year: 2024, Grade: 'A-', Status: 'Completed' },
  { EnrollmentID: 15, StudentID: 3, CourseID: 8, Semester: 'Fall', Year: 2024, Grade: 'A', Status: 'Completed' },

  // Diana - Average student (GPA ~3.0)
  { EnrollmentID: 16, StudentID: 4, CourseID: 3, Semester: 'Fall', Year: 2023, Grade: 'B', Status: 'Completed' },
  { EnrollmentID: 17, StudentID: 4, CourseID: 4, Semester: 'Fall', Year: 2023, Grade: 'B+', Status: 'Completed' },
  { EnrollmentID: 18, StudentID: 4, CourseID: 7, Semester: 'Spring', Year: 2024, Grade: 'B', Status: 'Completed' },
  { EnrollmentID: 19, StudentID: 4, CourseID: 8, Semester: 'Spring', Year: 2024, Grade: 'B-', Status: 'Completed' },
  { EnrollmentID: 20, StudentID: 4, CourseID: 2, Semester: 'Fall', Year: 2024, Grade: 'B+', Status: 'Completed' },

  // Eve - Below average (GPA ~2.5)
  { EnrollmentID: 21, StudentID: 5, CourseID: 4, Semester: 'Fall', Year: 2023, Grade: 'C+', Status: 'Completed' },
  { EnrollmentID: 22, StudentID: 5, CourseID: 7, Semester: 'Fall', Year: 2023, Grade: 'B', Status: 'Completed' },
  { EnrollmentID: 23, StudentID: 5, CourseID: 8, Semester: 'Spring', Year: 2024, Grade: 'C+', Status: 'Completed' },
  { EnrollmentID: 24, StudentID: 5, CourseID: 3, Semester: 'Spring', Year: 2024, Grade: 'B-', Status: 'Completed' },
  { EnrollmentID: 25, StudentID: 5, CourseID: 1, Semester: 'Fall', Year: 2024, Grade: 'C', Status: 'Completed' },

  // Frank - Struggling student (GPA ~2.0)
  { EnrollmentID: 26, StudentID: 6, CourseID: 1, Semester: 'Fall', Year: 2023, Grade: 'C', Status: 'Completed' },
  { EnrollmentID: 27, StudentID: 6, CourseID: 7, Semester: 'Fall', Year: 2023, Grade: 'C+', Status: 'Completed' },
  { EnrollmentID: 28, StudentID: 6, CourseID: 3, Semester: 'Spring', Year: 2024, Grade: 'D+', Status: 'Completed' },
  { EnrollmentID: 29, StudentID: 6, CourseID: 8, Semester: 'Spring', Year: 2024, Grade: 'C', Status: 'Completed' },
  { EnrollmentID: 30, StudentID: 6, CourseID: 4, Semester: 'Fall', Year: 2024, Grade: 'C-', Status: 'Completed' },

  // Grace - Excellent student (GPA ~3.95)
  { EnrollmentID: 31, StudentID: 7, CourseID: 2, Semester: 'Fall', Year: 2023, Grade: 'A+', Status: 'Completed' },
  { EnrollmentID: 32, StudentID: 7, CourseID: 6, Semester: 'Fall', Year: 2023, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 33, StudentID: 7, CourseID: 3, Semester: 'Spring', Year: 2024, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 34, StudentID: 7, CourseID: 7, Semester: 'Spring', Year: 2024, Grade: 'A', Status: 'Completed' },
  { EnrollmentID: 35, StudentID: 7, CourseID: 1, Semester: 'Fall', Year: 2024, Grade: 'A', Status: 'Completed' },

  // Henry - Good student (GPA ~3.3)
  { EnrollmentID: 36, StudentID: 8, CourseID: 1, Semester: 'Fall', Year: 2023, Grade: 'B+', Status: 'Completed' },
  { EnrollmentID: 37, StudentID: 8, CourseID: 5, Semester: 'Spring', Year: 2024, Grade: 'B+', Status: 'Completed' },
  { EnrollmentID: 38, StudentID: 8, CourseID: 7, Semester: 'Spring', Year: 2024, Grade: 'A-', Status: 'Completed' },
  { EnrollmentID: 39, StudentID: 8, CourseID: 2, Semester: 'Fall', Year: 2024, Grade: 'B', Status: 'Completed' },
  { EnrollmentID: 40, StudentID: 8, CourseID: 8, Semester: 'Fall', Year: 2024, Grade: 'B+', Status: 'Completed' },

  // Ivy - Average student (GPA ~2.8)
  { EnrollmentID: 41, StudentID: 9, CourseID: 3, Semester: 'Fall', Year: 2023, Grade: 'B-', Status: 'Completed' },
  { EnrollmentID: 42, StudentID: 9, CourseID: 7, Semester: 'Fall', Year: 2023, Grade: 'B', Status: 'Completed' },
  { EnrollmentID: 43, StudentID: 9, CourseID: 8, Semester: 'Spring', Year: 2024, Grade: 'C+', Status: 'Completed' },
  { EnrollmentID: 44, StudentID: 9, CourseID: 2, Semester: 'Spring', Year: 2024, Grade: 'B-', Status: 'Completed' },
  { EnrollmentID: 45, StudentID: 9, CourseID: 4, Semester: 'Fall', Year: 2024, Grade: 'B', Status: 'Completed' },

  // Jack - Average student (GPA ~3.1)
  { EnrollmentID: 46, StudentID: 10, CourseID: 4, Semester: 'Fall', Year: 2023, Grade: 'B', Status: 'Completed' },
  { EnrollmentID: 47, StudentID: 10, CourseID: 7, Semester: 'Fall', Year: 2023, Grade: 'B+', Status: 'Completed' },
  { EnrollmentID: 48, StudentID: 10, CourseID: 8, Semester: 'Spring', Year: 2024, Grade: 'B', Status: 'Completed' },
  { EnrollmentID: 49, StudentID: 10, CourseID: 3, Semester: 'Spring', Year: 2024, Grade: 'B+', Status: 'Completed' },
  { EnrollmentID: 50, StudentID: 10, CourseID: 1, Semester: 'Fall', Year: 2024, Grade: 'B-', Status: 'Completed' }
];

// Add GradePoint to enrollments
enrollments.forEach(e => {
  e.GradePoint = gradeToGPA[e.Grade];
});

// ============================================================================
// GPA CALCULATION / OBLICZANIE GPA
// ============================================================================

/**
 * Calculate GPA for a student (weighted by credits)
 * Oblicz GPA dla studenta (ważone według punktów)
 */
function calculateGPA(studentID) {
  const studentEnrollments = enrollments.filter(
    e => e.StudentID === studentID && e.Status === 'Completed' && e.GradePoint !== undefined
  );

  if (studentEnrollments.length === 0) return null;

  let totalPoints = 0;
  let totalCredits = 0;

  studentEnrollments.forEach(enrollment => {
    const course = courses.find(c => c.CourseID === enrollment.CourseID);
    totalPoints += enrollment.GradePoint * course.Credits;
    totalCredits += course.Credits;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

/**
 * Get all student GPAs
 * Pobierz wszystkie GPA studentów
 */
function getAllStudentGPAs() {
  return students
    .map(student => {
      const gpa = calculateGPA(student.StudentID);

      if (gpa === null) return null;

      const completedEnrollments = enrollments.filter(
        e => e.StudentID === student.StudentID && e.Status === 'Completed'
      );

      const totalCredits = completedEnrollments.reduce((sum, e) => {
        const course = courses.find(c => c.CourseID === e.CourseID);
        return sum + course.Credits;
      }, 0);

      return {
        StudentID: student.StudentID,
        FirstName: student.FirstName,
        LastName: student.LastName,
        Major: student.Major,
        GPA: parseFloat(gpa.toFixed(2)),
        TotalCourses: completedEnrollments.length,
        TotalCredits: totalCredits
      };
    })
    .filter(s => s !== null && s.TotalCourses >= 5);  // Min 5 courses
}

// ============================================================================
// HONOR ROLL QUERY (TOP 10%)
// ZAPYTANIE O LISTĘ HONOROWĄ (GÓRNE 10%)
// ============================================================================

/**
 * Get honor roll students (top 10% by GPA)
 * Pobierz studentów z listy honorowej (górne 10% według GPA)
 */
function getHonorRoll() {
  const allStudents = getAllStudentGPAs();

  // Sort by GPA descending
  allStudents.sort((a, b) => b.GPA - a.GPA);

  // Calculate top 10%
  const top10PercentCount = Math.ceil(allStudents.length * 0.10);

  // Get top 10%
  const honorRoll = allStudents.slice(0, top10PercentCount);

  // Add rank and percentile
  honorRoll.forEach((student, index) => {
    student.Rank = index + 1;
    student.Percentile = parseFloat(((index / allStudents.length) * 100).toFixed(1));
  });

  return honorRoll;
}

/**
 * Get Dean's List (GPA >= 3.5)
 * Pobierz listę dziekana (GPA >= 3.5)
 */
function getDeansList() {
  const allStudents = getAllStudentGPAs();

  return allStudents
    .filter(s => s.GPA >= 3.5)
    .sort((a, b) => b.GPA - a.GPA)
    .map((student, index) => ({
      ...student,
      Rank: index + 1,
      Status: 'Dean\'s List'
    }));
}

/**
 * Get students at risk (GPA < 2.0)
 * Pobierz studentów zagrożonych (GPA < 2.0)
 */
function getStudentsAtRisk() {
  const allStudents = getAllStudentGPAs();

  return allStudents
    .filter(s => s.GPA < 2.0)
    .sort((a, b) => a.GPA - b.GPA)
    .map(student => ({
      ...student,
      Status: 'Academic Probation'
    }));
}

// ============================================================================
// STATISTICS / STATYSTYKI
// ============================================================================

/**
 * Get GPA statistics
 * Pobierz statystyki GPA
 */
function getGPAStatistics() {
  const allGPAs = getAllStudentGPAs();
  const gpas = allGPAs.map(s => s.GPA);

  const mean = gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length;
  const sorted = [...gpas].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const variance = gpas.reduce((sum, gpa) => sum + Math.pow(gpa - mean, 2), 0) / gpas.length;
  const stdDev = Math.sqrt(variance);

  return {
    TotalStudents: allGPAs.length,
    MeanGPA: parseFloat(mean.toFixed(2)),
    MedianGPA: parseFloat(median.toFixed(2)),
    MinGPA: Math.min(...gpas),
    MaxGPA: Math.max(...gpas),
    StdDeviation: parseFloat(stdDev.toFixed(2))
  };
}

/**
 * Get GPA distribution
 * Pobierz rozkład GPA
 */
function getGPADistribution() {
  const allGPAs = getAllStudentGPAs();

  const ranges = [
    { label: '4.0 (A)', min: 4.0, max: 4.0 },
    { label: '3.5-3.99 (A-/B+)', min: 3.5, max: 3.99 },
    { label: '3.0-3.49 (B)', min: 3.0, max: 3.49 },
    { label: '2.5-2.99 (B-/C+)', min: 2.5, max: 2.99 },
    { label: '2.0-2.49 (C)', min: 2.0, max: 2.49 },
    { label: '<2.0 (D/F)', min: 0.0, max: 1.99 }
  ];

  return ranges.map(range => {
    const count = allGPAs.filter(s => s.GPA >= range.min && s.GPA <= range.max).length;
    return {
      Range: range.label,
      Count: count,
      Percentage: parseFloat(((count / allGPAs.length) * 100).toFixed(1))
    };
  });
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(80));
console.log('GRADE DATABASE - HONOR ROLL QUERY');
console.log('BAZA DANYCH OCEN - ZAPYTANIE O LISTĘ HONOROWĄ');
console.log('='.repeat(80));
console.log();

// Show GPA statistics
console.log('GPA STATISTICS / STATYSTYKI GPA');
console.log('-'.repeat(80));
console.table([getGPAStatistics()]);
console.log();

// Show GPA distribution
console.log('GPA DISTRIBUTION / ROZKŁAD GPA');
console.log('-'.repeat(80));
console.table(getGPADistribution());
console.log();

// Honor Roll (Top 10%)
console.log('HONOR ROLL - TOP 10% STUDENTS');
console.log('LISTA HONOROWA - GÓRNE 10% STUDENTÓW');
console.log('-'.repeat(80));
const honorRoll = getHonorRoll();
console.table(honorRoll);
console.log(`Total students on Honor Roll: ${honorRoll.length}`);
console.log(`Łączna liczba studentów na liście honorowej: ${honorRoll.length}`);
console.log();

// Dean's List (GPA >= 3.5)
console.log('DEAN\'S LIST - GPA >= 3.5');
console.log('LISTA DZIEKANA - GPA >= 3.5');
console.log('-'.repeat(80));
const deansList = getDeansList();
console.table(deansList);
console.log(`Total students on Dean's List: ${deansList.length}`);
console.log();

// Students at risk
console.log('STUDENTS AT RISK - GPA < 2.0');
console.log('STUDENCI ZAGROŻENI - GPA < 2.0');
console.log('-'.repeat(80));
const atRisk = getStudentsAtRisk();
console.table(atRisk);
console.log(`Total students at risk: ${atRisk.length}`);
console.log();

// Individual student transcript
console.log('STUDENT TRANSCRIPT EXAMPLE - Alice Anderson');
console.log('PRZYKŁAD TRANSKRYPTU STUDENTA - Alice Anderson');
console.log('-'.repeat(80));
const aliceEnrollments = enrollments
  .filter(e => e.StudentID === 1 && e.Status === 'Completed')
  .map(e => {
    const course = courses.find(c => c.CourseID === e.CourseID);
    return {
      CourseCode: course.CourseCode,
      CourseName: course.CourseName,
      Credits: course.Credits,
      Semester: `${e.Semester} ${e.Year}`,
      Grade: e.Grade,
      GradePoint: e.GradePoint
    };
  });
console.table(aliceEnrollments);
console.log(`Alice's GPA: ${calculateGPA(1).toFixed(2)}`);
console.log();

console.log('='.repeat(80));
console.log('SQL QUERY EXAMPLES / PRZYKŁADY ZAPYTAŃ SQL');
console.log('='.repeat(80));
console.log();

console.log(`
-- Honor Roll Query (Top 10%) using Window Function
-- Zapytanie o listę honorową (górne 10%) używając funkcji okienkowej

WITH StudentGPA AS (
    SELECT
        s.StudentID,
        s.FirstName,
        s.LastName,
        s.Major,
        SUM(e.GradePoint * c.Credits) / SUM(c.Credits) AS GPA,
        COUNT(e.EnrollmentID) AS TotalCourses,
        SUM(c.Credits) AS TotalCredits,
        PERCENT_RANK() OVER (ORDER BY SUM(e.GradePoint * c.Credits) / SUM(c.Credits) DESC) AS PercentileRank
    FROM Students s
    INNER JOIN Enrollments e ON s.StudentID = e.StudentID
    INNER JOIN Courses c ON e.CourseID = c.CourseID
    WHERE e.Status = 'Completed' AND e.GradePoint IS NOT NULL
    GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major
    HAVING COUNT(e.EnrollmentID) >= 5
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
WHERE PercentileRank <= 0.10
ORDER BY GPA DESC;

-- Dean's List (GPA >= 3.5)
-- Lista dziekana (GPA >= 3.5)

SELECT
    s.StudentID,
    s.FirstName,
    s.LastName,
    s.Major,
    ROUND(SUM(e.GradePoint * c.Credits) / SUM(c.Credits), 2) AS GPA
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE e.Status = 'Completed' AND e.GradePoint IS NOT NULL
GROUP BY s.StudentID, s.FirstName, s.LastName, s.Major
HAVING GPA >= 3.5
ORDER BY GPA DESC;
`);
