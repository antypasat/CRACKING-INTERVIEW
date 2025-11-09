/**
 * Entity-Relationship Diagram - Companies, People, and Professionals
 *
 * This file demonstrates the implementation of the database schema
 * with sample data and queries.
 */

// ============================================================================
// DATABASE TABLES / TABELE BAZY DANYCH
// ============================================================================

const people = [
  { PersonID: 1, FirstName: 'Alice', LastName: 'Johnson', Email: 'alice@email.com', Phone: '555-0101', DateOfBirth: '1990-05-15' },
  { PersonID: 2, FirstName: 'Bob', LastName: 'Smith', Email: 'bob@email.com', Phone: '555-0102', DateOfBirth: '1985-08-22' },
  { PersonID: 3, FirstName: 'Charlie', LastName: 'Brown', Email: 'charlie@email.com', Phone: '555-0103', DateOfBirth: '1992-03-10' },
  { PersonID: 4, FirstName: 'Diana', LastName: 'Davis', Email: 'diana@email.com', Phone: '555-0104', DateOfBirth: '1988-11-30' },
  { PersonID: 5, FirstName: 'Eve', LastName: 'Wilson', Email: 'eve@email.com', Phone: '555-0105', DateOfBirth: '1995-07-18' }
  // Note: Not all people are professionals
];

const companies = [
  { CompanyID: 1, CompanyName: 'Tech Corp', Industry: 'Technology', Location: 'San Francisco', FoundedDate: '2010-01-15', EmployeeCount: 500 },
  { CompanyID: 2, CompanyName: 'Marketing Inc', Industry: 'Marketing', Location: 'New York', FoundedDate: '2015-06-20', EmployeeCount: 150 },
  { CompanyID: 3, CompanyName: 'Finance Co', Industry: 'Finance', Location: 'Chicago', FoundedDate: '2005-03-10', EmployeeCount: 300 }
];

const professionals = [
  { ProfessionalID: 1, PersonID: 1, Title: 'Senior Software Engineer', Specialty: 'Backend Development', YearsExperience: 8 },
  { ProfessionalID: 2, PersonID: 2, Title: 'Marketing Manager', Specialty: 'Digital Marketing', YearsExperience: 12 },
  { ProfessionalID: 3, PersonID: 3, Title: 'Financial Analyst', Specialty: 'Risk Analysis', YearsExperience: 5 },
  { ProfessionalID: 4, PersonID: 4, Title: 'Product Manager', Specialty: 'SaaS Products', YearsExperience: 10 }
  // Note: PersonID 5 (Eve) is not a professional
];

const employment = [
  // Alice's employment history
  { EmploymentID: 1, ProfessionalID: 1, CompanyID: 1, Position: 'Senior Engineer', Department: 'Engineering', StartDate: '2020-01-15', EndDate: null, Salary: 120000, EmploymentType: 'Full-time' },

  // Bob's employment history (worked at 2 companies)
  { EmploymentID: 2, ProfessionalID: 2, CompanyID: 2, Position: 'Marketing Manager', Department: 'Marketing', StartDate: '2018-03-01', EndDate: '2022-12-31', Salary: 95000, EmploymentType: 'Full-time' },
  { EmploymentID: 3, ProfessionalID: 2, CompanyID: 1, Position: 'Marketing Director', Department: 'Marketing', StartDate: '2023-01-10', EndDate: null, Salary: 130000, EmploymentType: 'Full-time' },

  // Charlie's employment
  { EmploymentID: 4, ProfessionalID: 3, CompanyID: 3, Position: 'Financial Analyst', Department: 'Finance', StartDate: '2019-06-01', EndDate: null, Salary: 85000, EmploymentType: 'Full-time' },

  // Diana's employment (consultant working for 2 companies simultaneously)
  { EmploymentID: 5, ProfessionalID: 4, CompanyID: 1, Position: 'Product Consultant', Department: 'Product', StartDate: '2021-01-01', EndDate: null, Salary: 150000, EmploymentType: 'Contract' },
  { EmploymentID: 6, ProfessionalID: 4, CompanyID: 3, Position: 'Strategy Consultant', Department: 'Strategy', StartDate: '2022-06-01', EndDate: null, Salary: 80000, EmploymentType: 'Part-time' }
];

// ============================================================================
// QUERY FUNCTIONS / FUNKCJE ZAPYTAŃ
// ============================================================================

/**
 * Query 1: Get all professionals working for a specific company
 * Zapytanie 1: Pobierz wszystkich profesjonalistów pracujących dla konkretnej firmy
 */
function getCurrentEmployeesByCompany(companyID) {
  console.log(`Query 1: Current Employees of Company ${companyID}`);
  console.log(`Zapytanie 1: Obecni pracownicy firmy ${companyID}`);
  console.log('-'.repeat(80));

  const company = companies.find(c => c.CompanyID === companyID);
  console.log(`Company: ${company.CompanyName}\\n`);

  const results = employment
    .filter(e => e.CompanyID === companyID && e.EndDate === null)
    .map(e => {
      const prof = professionals.find(pr => pr.ProfessionalID === e.ProfessionalID);
      const person = people.find(p => p.PersonID === prof.PersonID);

      return {
        Name: `${person.FirstName} ${person.LastName}`,
        Title: prof.Title,
        Position: e.Position,
        Department: e.Department,
        StartDate: e.StartDate,
        EmploymentType: e.EmploymentType
      };
    });

  console.table(results);
  console.log();
  return results;
}

/**
 * Query 2: Get employment history for a person
 * Zapytanie 2: Pobierz historię zatrudnienia dla osoby
 */
function getEmploymentHistory(personID) {
  console.log(`Query 2: Employment History for Person ${personID}`);
  console.log(`Zapytanie 2: Historia zatrudnienia dla osoby ${personID}`);
  console.log('-'.repeat(80));

  const person = people.find(p => p.PersonID === personID);
  console.log(`Person: ${person.FirstName} ${person.LastName}\\n`);

  const prof = professionals.find(pr => pr.PersonID === personID);

  if (!prof) {
    console.log('❌ This person is not a professional / Ta osoba nie jest profesjonalistą\\n');
    return [];
  }

  const results = employment
    .filter(e => e.ProfessionalID === prof.ProfessionalID)
    .map(e => {
      const company = companies.find(c => c.CompanyID === e.CompanyID);

      return {
        Company: company.CompanyName,
        Position: e.Position,
        Department: e.Department,
        StartDate: e.StartDate,
        EndDate: e.EndDate || 'Current',
        Status: e.EndDate === null ? 'Current' : 'Former',
        Duration: calculateDuration(e.StartDate, e.EndDate)
      };
    })
    .sort((a, b) => new Date(b.StartDate) - new Date(a.StartDate));

  console.table(results);
  console.log();
  return results;
}

/**
 * Query 3: Find people who are NOT professionals
 * Zapytanie 3: Znajdź ludzi, którzy NIE są profesjonalistami
 */
function getNonProfessionals() {
  console.log('Query 3: People Who Are NOT Professionals');
  console.log('Zapytanie 3: Ludzie, którzy NIE są profesjonalistami');
  console.log('-'.repeat(80));

  const professionalPersonIDs = new Set(professionals.map(pr => pr.PersonID));

  const results = people
    .filter(p => !professionalPersonIDs.has(p.PersonID))
    .map(p => ({
      PersonID: p.PersonID,
      Name: `${p.FirstName} ${p.LastName}`,
      Email: p.Email,
      Status: 'Non-Professional'
    }));

  console.table(results);
  console.log(`Found ${results.length} non-professional(s)\\n`);
  return results;
}

/**
 * Query 4: Get companies with their employee count
 * Zapytanie 4: Pobierz firmy z liczbą pracowników
 */
function getCompaniesWithEmployeeCount() {
  console.log('Query 4: Companies with Current Employee Count');
  console.log('Zapytanie 4: Firmy z obecną liczbą pracowników');
  console.log('-'.repeat(80));

  const results = companies.map(company => {
    const currentEmployees = employment.filter(
      e => e.CompanyID === company.CompanyID && e.EndDate === null
    );

    return {
      CompanyName: company.CompanyName,
      Industry: company.Industry,
      Location: company.Location,
      CurrentEmployees: currentEmployees.length,
      ReportedEmployeeCount: company.EmployeeCount
    };
  });

  console.table(results);
  console.log();
  return results;
}

/**
 * Query 5: Find professionals who have worked for multiple companies
 * Zapytanie 5: Znajdź profesjonalistów, którzy pracowali dla wielu firm
 */
function getProfessionalsWithMultipleCompanies() {
  console.log('Query 5: Professionals Who Have Worked for Multiple Companies');
  console.log('Zapytanie 5: Profesjonaliści, którzy pracowali dla wielu firm');
  console.log('-'.repeat(80));

  const profCompanyMap = {};

  employment.forEach(e => {
    if (!profCompanyMap[e.ProfessionalID]) {
      profCompanyMap[e.ProfessionalID] = new Set();
    }
    profCompanyMap[e.ProfessionalID].add(e.CompanyID);
  });

  const results = Object.entries(profCompanyMap)
    .filter(([_, companySet]) => companySet.size > 1)
    .map(([professionalID, companySet]) => {
      const prof = professionals.find(pr => pr.ProfessionalID === parseInt(professionalID));
      const person = people.find(p => p.PersonID === prof.PersonID);

      const companyNames = Array.from(companySet).map(companyID => {
        const company = companies.find(c => c.CompanyID === companyID);
        return company.CompanyName;
      });

      return {
        Name: `${person.FirstName} ${person.LastName}`,
        Title: prof.Title,
        CompanyCount: companySet.size,
        Companies: companyNames.join(', ')
      };
    });

  console.table(results);
  console.log();
  return results;
}

/**
 * Query 6: Find consultants (professionals working for multiple companies simultaneously)
 * Zapytanie 6: Znajdź konsultantów (profesjonaliści pracujący dla wielu firm jednocześnie)
 */
function getCurrentConsultants() {
  console.log('Query 6: Current Consultants (Working for Multiple Companies)');
  console.log('Zapytanie 6: Obecni konsultanci (Pracujący dla wielu firm)');
  console.log('-'.repeat(80));

  const currentEmployments = employment.filter(e => e.EndDate === null);

  const profCurrentCompanyMap = {};
  currentEmployments.forEach(e => {
    if (!profCurrentCompanyMap[e.ProfessionalID]) {
      profCurrentCompanyMap[e.ProfessionalID] = [];
    }
    profCurrentCompanyMap[e.ProfessionalID].push(e.CompanyID);
  });

  const results = Object.entries(profCurrentCompanyMap)
    .filter(([_, companyIDs]) => companyIDs.length > 1)
    .map(([professionalID, companyIDs]) => {
      const prof = professionals.find(pr => pr.ProfessionalID === parseInt(professionalID));
      const person = people.find(p => p.PersonID === prof.PersonID);

      const companyNames = companyIDs.map(companyID => {
        const company = companies.find(c => c.CompanyID === companyID);
        return company.CompanyName;
      });

      return {
        Name: `${person.FirstName} ${person.LastName}`,
        Title: prof.Title,
        CurrentCompanies: companyNames.join(', '),
        CompanyCount: companyIDs.length
      };
    });

  console.table(results);
  console.log();
  return results;
}

// ============================================================================
// HELPER FUNCTIONS / FUNKCJE POMOCNICZE
// ============================================================================

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const years = Math.floor((end - start) / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor(((end - start) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

  return `${years}y ${months}m`;
}

// ============================================================================
// DATA OPERATIONS / OPERACJE NA DANYCH
// ============================================================================

/**
 * Operation: Hire a new professional
 * Operacja: Zatrudnij nowego profesjonalistę
 */
function hireNewProfessional(personID, companyID, position, department, salary) {
  console.log('Operation: Hire New Professional');
  console.log('Operacja: Zatrudnij nowego profesjonalistę');
  console.log('-'.repeat(80));

  const person = people.find(p => p.PersonID === personID);
  const company = companies.find(c => c.CompanyID === companyID);

  if (!person || !company) {
    console.log('❌ Person or Company not found');
    return false;
  }

  // Check if person is a professional
  let prof = professionals.find(pr => pr.PersonID === personID);

  if (!prof) {
    // Create professional record
    const newProfID = Math.max(...professionals.map(p => p.ProfessionalID)) + 1;
    prof = {
      ProfessionalID: newProfID,
      PersonID: personID,
      Title: position,
      Specialty: department,
      YearsExperience: 0
    };
    professionals.push(prof);
    console.log(`✓ Created new professional record for ${person.FirstName} ${person.LastName}`);
  }

  // Create employment record
  const newEmpID = Math.max(...employment.map(e => e.EmploymentID)) + 1;
  const newEmployment = {
    EmploymentID: newEmpID,
    ProfessionalID: prof.ProfessionalID,
    CompanyID: companyID,
    Position: position,
    Department: department,
    StartDate: new Date().toISOString().split('T')[0],
    EndDate: null,
    Salary: salary,
    EmploymentType: 'Full-time'
  };

  employment.push(newEmployment);

  console.log(`✓ ${person.FirstName} ${person.LastName} hired at ${company.CompanyName} as ${position}`);
  console.log();
  return true;
}

/**
 * Operation: Terminate employment
 * Operacja: Zakończ zatrudnienie
 */
function terminateEmployment(employmentID, endDate) {
  const emp = employment.find(e => e.EmploymentID === employmentID);

  if (!emp) {
    console.log('❌ Employment record not found');
    return false;
  }

  emp.EndDate = endDate || new Date().toISOString().split('T')[0];

  const prof = professionals.find(pr => pr.ProfessionalID === emp.ProfessionalID);
  const person = people.find(p => p.PersonID === prof.PersonID);
  const company = companies.find(c => c.CompanyID === emp.CompanyID);

  console.log(`✓ Employment terminated for ${person.FirstName} ${person.LastName} at ${company.CompanyName}`);
  console.log();
  return true;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(80));
console.log('ENTITY-RELATIONSHIP DIAGRAM - DEMONSTRATION');
console.log('DIAGRAM ZWIĄZKÓW ENCJI - DEMONSTRACJA');
console.log('='.repeat(80));
console.log();

// Display database state
console.log('DATABASE STATE / STAN BAZY DANYCH');
console.log('-'.repeat(80));
console.log(`Total People: ${people.length}`);
console.log(`Total Professionals: ${professionals.length}`);
console.log(`Total Companies: ${companies.length}`);
console.log(`Total Employment Records: ${employment.length}`);
console.log();

// Run queries
getCurrentEmployeesByCompany(1);
getEmploymentHistory(2);
getNonProfessionals();
getCompaniesWithEmployeeCount();
getProfessionalsWithMultipleCompanies();
getCurrentConsultants();

// Demonstrate operations
console.log('='.repeat(80));
console.log('DATA OPERATIONS DEMONSTRATION');
console.log('DEMONSTRACJA OPERACJI NA DANYCH');
console.log('='.repeat(80));
console.log();

hireNewProfessional(5, 2, 'Junior Developer', 'Engineering', 70000);
getEmploymentHistory(5);

console.log('='.repeat(80));
console.log('RELATIONSHIP SUMMARY / PODSUMOWANIE RELACJI');
console.log('='.repeat(80));
console.log();

const summary = {
  'Total People': people.length,
  'Professionals': professionals.length,
  'Non-Professionals': people.length - professionals.length,
  'Active Employments': employment.filter(e => e.EndDate === null).length,
  'Past Employments': employment.filter(e => e.EndDate !== null).length,
  'People with Multiple Jobs': getProfessionalsWithMultipleCompanies().length,
  'Current Consultants': getCurrentConsultants().length
};

console.table([summary]);
console.log();

console.log('='.repeat(80));
console.log('SQL SCHEMA REFERENCE / REFERENCJA SCHEMATU SQL');
console.log('='.repeat(80));
console.log();

console.log(`
-- Complete SQL Schema / Kompletny schemat SQL

CREATE TABLE People (
    PersonID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    DateOfBirth DATE
);

CREATE TABLE Companies (
    CompanyID INT PRIMARY KEY AUTO_INCREMENT,
    CompanyName VARCHAR(100) NOT NULL,
    Industry VARCHAR(50),
    Location VARCHAR(255),
    FoundedDate DATE,
    EmployeeCount INT
);

CREATE TABLE Professionals (
    ProfessionalID INT PRIMARY KEY AUTO_INCREMENT,
    PersonID INT NOT NULL UNIQUE,
    Title VARCHAR(100),
    Specialty VARCHAR(100),
    YearsExperience INT,
    FOREIGN KEY (PersonID) REFERENCES People(PersonID)
);

CREATE TABLE Employment (
    EmploymentID INT PRIMARY KEY AUTO_INCREMENT,
    ProfessionalID INT NOT NULL,
    CompanyID INT NOT NULL,
    Position VARCHAR(100) NOT NULL,
    Department VARCHAR(100),
    StartDate DATE NOT NULL,
    EndDate DATE,
    Salary DECIMAL(10, 2),
    EmploymentType ENUM('Full-time', 'Part-time', 'Contract', 'Intern'),
    FOREIGN KEY (ProfessionalID) REFERENCES Professionals(ProfessionalID),
    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID)
);
`);
