/**
 * SQL Joins - Demonstrating All Join Types
 *
 * This file demonstrates different types of SQL joins with practical examples.
 */

// ============================================================================
// DATABASE SETUP / KONFIGURACJA BAZY DANYCH
// ============================================================================

const employees = [
  { EmployeeID: 1, EmployeeName: 'Alice', DepartmentID: 10, ManagerID: null, Salary: 90000 },
  { EmployeeID: 2, EmployeeName: 'Bob', DepartmentID: 10, ManagerID: 1, Salary: 70000 },
  { EmployeeID: 3, EmployeeName: 'Charlie', DepartmentID: 20, ManagerID: 1, Salary: 65000 },
  { EmployeeID: 4, EmployeeName: 'Diana', DepartmentID: null, ManagerID: null, Salary: 60000 }, // No department
  { EmployeeID: 5, EmployeeName: 'Eve', DepartmentID: 30, ManagerID: 3, Salary: 55000 }
];

const departments = [
  { DepartmentID: 10, DepartmentName: 'Engineering', Budget: 500000 },
  { DepartmentID: 20, DepartmentName: 'Marketing', Budget: 300000 },
  { DepartmentID: 40, DepartmentName: 'HR', Budget: 200000 } // No employees
];

const projects = [
  { ProjectID: 101, ProjectName: 'Website Redesign', EmployeeID: 1 },
  { ProjectID: 102, ProjectName: 'Mobile App', EmployeeID: 2 },
  { ProjectID: 103, ProjectName: 'Marketing Campaign', EmployeeID: 3 },
  { ProjectID: 104, ProjectName: 'Unassigned Project', EmployeeID: null }
];

// ============================================================================
// 1. INNER JOIN
// ============================================================================

function innerJoin(employees, departments) {
  console.log('1. INNER JOIN - Only matching rows from both tables');
  console.log('   Returns: Employees WHO HAVE a department');
  console.log('-'.repeat(80));

  const result = employees
    .filter(e => e.DepartmentID !== null)
    .map(e => {
      const dept = departments.find(d => d.DepartmentID === e.DepartmentID);
      if (dept) {
        return {
          EmployeeName: e.EmployeeName,
          DepartmentName: dept.DepartmentName,
          Salary: e.Salary
        };
      }
      return null;
    })
    .filter(r => r !== null);

  console.table(result);
  console.log(`Returned ${result.length} rows (employees with departments)`);
  console.log('Note: Diana (no department) and HR dept (no employees) are excluded\n');

  return result;
}

// ============================================================================
// 2. LEFT JOIN
// ============================================================================

function leftJoin(employees, departments) {
  console.log('2. LEFT JOIN - All from left table, matching from right');
  console.log('   Returns: ALL employees, with department info when available');
  console.log('-'.repeat(80));

  const result = employees.map(e => {
    const dept = departments.find(d => d.DepartmentID === e.DepartmentID);
    return {
      EmployeeName: e.EmployeeName,
      DepartmentName: dept ? dept.DepartmentName : null,
      Salary: e.Salary
    };
  });

  console.table(result);
  console.log(`Returned ${result.length} rows (all employees)`);
  console.log('Note: Diana has NULL department (preserved from left table)\n');

  return result;
}

// ============================================================================
// 3. RIGHT JOIN
// ============================================================================

function rightJoin(employees, departments) {
  console.log('3. RIGHT JOIN - All from right table, matching from left');
  console.log('   Returns: ALL departments, with employees when available');
  console.log('-'.repeat(80));

  const result = departments.map(d => {
    const emps = employees.filter(e => e.DepartmentID === d.DepartmentID);

    if (emps.length === 0) {
      return {
        DepartmentName: d.DepartmentName,
        EmployeeName: null,
        Budget: d.Budget
      };
    }

    return emps.map(e => ({
      DepartmentName: d.DepartmentName,
      EmployeeName: e.EmployeeName,
      Budget: d.Budget
    }));
  }).flat();

  console.table(result);
  console.log(`Returned ${result.length} rows (all departments)`);
  console.log('Note: HR department has NULL employee (preserved from right table)\n');

  return result;
}

// ============================================================================
// 4. FULL OUTER JOIN
// ============================================================================

function fullOuterJoin(employees, departments) {
  console.log('4. FULL OUTER JOIN - All from both tables');
  console.log('   Returns: ALL employees AND all departments');
  console.log('-'.repeat(80));

  const matchedPairs = new Set();
  const result = [];

  // Add all matches
  employees.forEach(e => {
    const dept = departments.find(d => d.DepartmentID === e.DepartmentID);
    result.push({
      EmployeeName: e.EmployeeName,
      DepartmentName: dept ? dept.DepartmentName : null,
      Salary: e.Salary,
      Budget: dept ? dept.Budget : null
    });
    if (dept) matchedPairs.add(dept.DepartmentID);
  });

  // Add unmatched departments
  departments.forEach(d => {
    if (!matchedPairs.has(d.DepartmentID)) {
      result.push({
        EmployeeName: null,
        DepartmentName: d.DepartmentName,
        Salary: null,
        Budget: d.Budget
      });
    }
  });

  console.table(result);
  console.log(`Returned ${result.length} rows (all data from both tables)`);
  console.log('Note: Includes Diana (no dept) AND HR dept (no employees)\n');

  return result;
}

// ============================================================================
// 5. CROSS JOIN
// ============================================================================

function crossJoin(colors, sizes) {
  console.log('5. CROSS JOIN - Cartesian product (all combinations)');
  console.log('   Returns: Every color combined with every size');
  console.log('-'.repeat(80));

  const result = [];
  colors.forEach(color => {
    sizes.forEach(size => {
      result.push({
        Color: color,
        Size: size,
        SKU: `${color}-${size}`
      });
    });
  });

  console.table(result);
  console.log(`Returned ${result.length} rows (${colors.length} × ${sizes.length})`);
  console.log('WARNING: Can produce huge result sets!\n');

  return result;
}

// ============================================================================
// 6. SELF JOIN
// ============================================================================

function selfJoin(employees) {
  console.log('6. SELF JOIN - Table joined with itself');
  console.log('   Returns: Employees and their managers (hierarchical)');
  console.log('-'.repeat(80));

  const result = employees.map(e => {
    const manager = employees.find(m => m.EmployeeID === e.ManagerID);
    return {
      Employee: e.EmployeeName,
      Manager: manager ? manager.EmployeeName : null,
      EmployeeSalary: e.Salary,
      ManagerSalary: manager ? manager.Salary : null
    };
  });

  console.table(result);
  console.log(`Returned ${result.length} rows`);
  console.log('Note: Alice has no manager (CEO), others report to someone\n');

  return result;
}

// ============================================================================
// PRACTICAL EXAMPLES / PRAKTYCZNE PRZYKŁADY
// ============================================================================

function findOrphanedEmployees(employees, departments) {
  console.log('PRACTICAL: Find Employees Without Department (Orphaned Records)');
  console.log('-'.repeat(80));

  const result = employees
    .filter(e => {
      const dept = departments.find(d => d.DepartmentID === e.DepartmentID);
      return !dept;
    })
    .map(e => ({
      EmployeeName: e.EmployeeName,
      DepartmentID: e.DepartmentID,
      Status: 'No Department Assigned'
    }));

  console.table(result);
  console.log(`Found ${result.length} employee(s) without department\n`);

  return result;
}

function findEmptyDepartments(employees, departments) {
  console.log('PRACTICAL: Find Departments Without Employees');
  console.log('-'.repeat(80));

  const result = departments
    .filter(d => {
      const hasEmployees = employees.some(e => e.DepartmentID === d.DepartmentID);
      return !hasEmployees;
    })
    .map(d => ({
      DepartmentName: d.DepartmentName,
      Budget: d.Budget,
      Status: 'No Employees'
    }));

  console.table(result);
  console.log(`Found ${result.length} department(s) without employees\n`);

  return result;
}

function multipleJoins(employees, departments, projects) {
  console.log('PRACTICAL: Multiple Joins - Employees, Departments, and Projects');
  console.log('-'.repeat(80));

  const result = projects.map(p => {
    const emp = employees.find(e => e.EmployeeID === p.EmployeeID);
    const dept = emp ? departments.find(d => d.DepartmentID === emp.DepartmentID) : null;

    return {
      ProjectName: p.ProjectName,
      AssignedTo: emp ? emp.EmployeeName : 'Unassigned',
      Department: dept ? dept.DepartmentName : 'N/A'
    };
  });

  console.table(result);
  console.log(`Returned ${result.length} projects with assignments\n`);

  return result;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(80));
console.log('SQL JOINS - COMPREHENSIVE DEMONSTRATION');
console.log('JOINS SQL - KOMPLEKSOWA DEMONSTRACJA');
console.log('='.repeat(80));
console.log();

// Test all join types
innerJoin(employees, departments);
leftJoin(employees, departments);
rightJoin(employees, departments);
fullOuterJoin(employees, departments);

// Cross join with sample data
const colors = ['Red', 'Blue', 'Green'];
const sizes = ['S', 'M', 'L'];
crossJoin(colors, sizes);

// Self join
selfJoin(employees);

// Practical examples
findOrphanedEmployees(employees, departments);
findEmptyDepartments(employees, departments);
multipleJoins(employees, departments, projects);

// ============================================================================
// COMPARISON SUMMARY / PODSUMOWANIE PORÓWNAWCZE
// ============================================================================

console.log('='.repeat(80));
console.log('JOIN TYPES COMPARISON / PORÓWNANIE TYPÓW JOINS');
console.log('='.repeat(80));
console.log();

const comparison = [
  {
    JoinType: 'INNER',
    LeftTable: 'Only matched',
    RightTable: 'Only matched',
    UseCase: 'Related data only'
  },
  {
    JoinType: 'LEFT',
    LeftTable: 'All rows',
    RightTable: 'Only matched',
    UseCase: 'All from left + matches'
  },
  {
    JoinType: 'RIGHT',
    LeftTable: 'Only matched',
    RightTable: 'All rows',
    UseCase: 'All from right + matches'
  },
  {
    JoinType: 'FULL OUTER',
    LeftTable: 'All rows',
    RightTable: 'All rows',
    UseCase: 'All data from both'
  },
  {
    JoinType: 'CROSS',
    LeftTable: 'All × All',
    RightTable: 'All × All',
    UseCase: 'All combinations'
  },
  {
    JoinType: 'SELF',
    LeftTable: 'All (same table)',
    RightTable: 'All (same table)',
    UseCase: 'Hierarchical data'
  }
];

console.table(comparison);
console.log();

console.log('='.repeat(80));
console.log('SQL SYNTAX EXAMPLES / PRZYKŁADY SKŁADNI SQL');
console.log('='.repeat(80));
console.log();

console.log(`
-- INNER JOIN
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- LEFT JOIN
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- RIGHT JOIN
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
RIGHT JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- FULL OUTER JOIN
SELECT e.EmployeeName, d.DepartmentName
FROM Employees e
FULL OUTER JOIN Departments d ON e.DepartmentID = d.DepartmentID;

-- CROSS JOIN
SELECT c.Color, s.Size
FROM Colors c
CROSS JOIN Sizes s;

-- SELF JOIN
SELECT e1.EmployeeName AS Employee, e2.EmployeeName AS Manager
FROM Employees e1
LEFT JOIN Employees e2 ON e1.ManagerID = e2.EmployeeID;

-- Multiple JOINS
SELECT p.ProjectName, e.EmployeeName, d.DepartmentName
FROM Projects p
LEFT JOIN Employees e ON p.EmployeeID = e.EmployeeID
LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
`);
