/**
 * Open Requests - Counting Open Requests per Building
 *
 * This file simulates a database and demonstrates SQL queries
 * to count open requests for all buildings.
 */

// ============================================================================
// DATABASE SETUP / KONFIGURACJA BAZY DANYCH
// ============================================================================

// Sample data / Przykładowe dane
const buildings = [
  { BuildingID: 1, ComplexID: 1, BuildingName: 'North Tower', Address: '123 Main St' },
  { BuildingID: 2, ComplexID: 1, BuildingName: 'South Tower', Address: '456 Main St' },
  { BuildingID: 3, ComplexID: 2, BuildingName: 'East Wing', Address: '789 Oak Ave' },
  { BuildingID: 4, ComplexID: 2, BuildingName: 'West Wing', Address: '101 Oak Ave' },
  { BuildingID: 5, ComplexID: 3, BuildingName: 'Standalone Building', Address: '202 Pine Rd' }
];

const apartments = [
  { AptID: 101, UnitNumber: 'A101', BuildingID: 1, Address: '123 Main St #A101' },
  { AptID: 102, UnitNumber: 'A102', BuildingID: 1, Address: '123 Main St #A102' },
  { AptID: 201, UnitNumber: 'B201', BuildingID: 2, Address: '456 Main St #B201' },
  { AptID: 202, UnitNumber: 'B202', BuildingID: 2, Address: '456 Main St #B202' },
  { AptID: 301, UnitNumber: 'C301', BuildingID: 3, Address: '789 Oak Ave #C301' },
  { AptID: 302, UnitNumber: 'C302', BuildingID: 3, Address: '789 Oak Ave #C302' }
  // Note: Building 4 has no apartments
  // Building 5 has no apartments
];

const requests = [
  // Building 1 (North Tower) - 3 open, 1 closed
  { RequestID: 1, Status: 'Open', AptID: 101, Description: 'Leaking faucet' },
  { RequestID: 2, Status: 'Open', AptID: 101, Description: 'Broken window' },
  { RequestID: 3, Status: 'Open', AptID: 102, Description: 'AC not working' },
  { RequestID: 4, Status: 'Closed', AptID: 102, Description: 'Fixed light bulb' },

  // Building 2 (South Tower) - 2 open, 2 in progress
  { RequestID: 5, Status: 'Open', AptID: 201, Description: 'Water heater issue' },
  { RequestID: 6, Status: 'In Progress', AptID: 201, Description: 'Paint job' },
  { RequestID: 7, Status: 'Open', AptID: 202, Description: 'Door lock broken' },
  { RequestID: 8, Status: 'In Progress', AptID: 202, Description: 'Carpet cleaning' },

  // Building 3 (East Wing) - 0 open, 1 closed
  { RequestID: 9, Status: 'Closed', AptID: 301, Description: 'Completed repair' },

  // Building 4 and 5 - no apartments, so no requests
];

// ============================================================================
// APPROACH 1: LEFT JOIN with COUNT
// PODEJŚCIE 1: LEFT JOIN z COUNT
// ============================================================================

/**
 * Counts open requests per building using LEFT JOIN
 * Liczy otwarte zgłoszenia na budynek używając LEFT JOIN
 *
 * SQL Equivalent:
 * SELECT b.BuildingID, b.BuildingName, COUNT(r.RequestID) AS OpenRequestCount
 * FROM Buildings b
 * LEFT JOIN Apartments a ON b.BuildingID = a.BuildingID
 * LEFT JOIN Requests r ON a.AptID = r.AptID AND r.Status = 'Open'
 * GROUP BY b.BuildingID, b.BuildingName
 * ORDER BY OpenRequestCount DESC
 */
function countOpenRequestsPerBuilding_Approach1(buildings, apartments, requests) {
  // Perform LEFT JOIN: Buildings -> Apartments -> Requests
  // Wykonaj LEFT JOIN: Buildings -> Apartments -> Requests
  const results = buildings.map(building => {
    // Find all apartments in this building
    // Znajdź wszystkie apartamenty w tym budynku
    const buildingApartments = apartments.filter(apt => apt.BuildingID === building.BuildingID);

    // Count open requests for all apartments in this building
    // Policz otwarte zgłoszenia dla wszystkich apartamentów w tym budynku
    let openRequestCount = 0;

    buildingApartments.forEach(apt => {
      const openRequests = requests.filter(
        req => req.AptID === apt.AptID && req.Status === 'Open'
      );
      openRequestCount += openRequests.length;
    });

    return {
      BuildingID: building.BuildingID,
      BuildingName: building.BuildingName,
      Address: building.Address,
      OpenRequestCount: openRequestCount
    };
  });

  // Sort by open request count (descending), then by building name
  // Sortuj według liczby otwartych zgłoszeń (malejąco), potem według nazwy budynku
  return results.sort((a, b) => {
    if (b.OpenRequestCount !== a.OpenRequestCount) {
      return b.OpenRequestCount - a.OpenRequestCount;
    }
    return a.BuildingName.localeCompare(b.BuildingName);
  });
}

// ============================================================================
// APPROACH 2: Using Subquery
// PODEJŚCIE 2: Używając Podzapytania
// ============================================================================

/**
 * Counts open requests using subquery pattern
 * Liczy otwarte zgłoszenia używając wzorca podzapytania
 *
 * SQL Equivalent:
 * SELECT b.BuildingID, b.BuildingName,
 *        COALESCE(open_counts.OpenRequestCount, 0) AS OpenRequestCount
 * FROM Buildings b
 * LEFT JOIN (
 *   SELECT a.BuildingID, COUNT(r.RequestID) AS OpenRequestCount
 *   FROM Apartments a
 *   INNER JOIN Requests r ON a.AptID = r.AptID
 *   WHERE r.Status = 'Open'
 *   GROUP BY a.BuildingID
 * ) open_counts ON b.BuildingID = open_counts.BuildingID
 */
function countOpenRequestsPerBuilding_Approach2(buildings, apartments, requests) {
  // Subquery: Calculate open request counts per building
  // Podzapytanie: Oblicz liczby otwartych zgłoszeń na budynek
  const openRequestCounts = {};

  apartments.forEach(apt => {
    const openRequests = requests.filter(
      req => req.AptID === apt.AptID && req.Status === 'Open'
    );

    if (openRequests.length > 0) {
      if (!openRequestCounts[apt.BuildingID]) {
        openRequestCounts[apt.BuildingID] = 0;
      }
      openRequestCounts[apt.BuildingID] += openRequests.length;
    }
  });

  // LEFT JOIN with subquery results
  // LEFT JOIN z wynikami podzapytania
  return buildings
    .map(building => ({
      BuildingID: building.BuildingID,
      BuildingName: building.BuildingName,
      Address: building.Address,
      OpenRequestCount: openRequestCounts[building.BuildingID] || 0
    }))
    .sort((a, b) => {
      if (b.OpenRequestCount !== a.OpenRequestCount) {
        return b.OpenRequestCount - a.OpenRequestCount;
      }
      return a.BuildingName.localeCompare(b.BuildingName);
    });
}

// ============================================================================
// APPROACH 3: Using CASE-like conditional counting
// PODEJŚCIE 3: Używając warunkowego liczenia podobnego do CASE
// ============================================================================

/**
 * Counts requests with conditional logic (simulating CASE WHEN)
 * Liczy zgłoszenia z logiką warunkową (symulując CASE WHEN)
 *
 * SQL Equivalent:
 * SELECT b.BuildingID, b.BuildingName,
 *        COUNT(CASE WHEN r.Status = 'Open' THEN 1 END) AS OpenRequestCount
 * FROM Buildings b
 * LEFT JOIN Apartments a ON b.BuildingID = a.BuildingID
 * LEFT JOIN Requests r ON a.AptID = r.AptID
 * GROUP BY b.BuildingID, b.BuildingName
 */
function countOpenRequestsPerBuilding_Approach3(buildings, apartments, requests) {
  return buildings
    .map(building => {
      const buildingApartments = apartments.filter(apt => apt.BuildingID === building.BuildingID);

      // Count using conditional logic (like CASE WHEN)
      // Liczenie używając logiki warunkowej (jak CASE WHEN)
      const openRequestCount = buildingApartments.reduce((count, apt) => {
        const aptRequests = requests.filter(req => req.AptID === apt.AptID);
        const openCount = aptRequests.filter(req => req.Status === 'Open').length;
        return count + openCount;
      }, 0);

      return {
        BuildingID: building.BuildingID,
        BuildingName: building.BuildingName,
        Address: building.Address,
        OpenRequestCount: openRequestCount
      };
    })
    .sort((a, b) => {
      if (b.OpenRequestCount !== a.OpenRequestCount) {
        return b.OpenRequestCount - a.OpenRequestCount;
      }
      return a.BuildingName.localeCompare(b.BuildingName);
    });
}

// ============================================================================
// EXTENDED: Count All Request Types
// ROZSZERZONE: Policz Wszystkie Typy Zgłoszeń
// ============================================================================

/**
 * Counts all request types (Open, Closed, In Progress) per building
 * Liczy wszystkie typy zgłoszeń (Open, Closed, In Progress) na budynek
 */
function countAllRequestTypes(buildings, apartments, requests) {
  return buildings
    .map(building => {
      const buildingApartments = apartments.filter(apt => apt.BuildingID === building.BuildingID);

      const counts = {
        Open: 0,
        Closed: 0,
        'In Progress': 0,
        Total: 0
      };

      buildingApartments.forEach(apt => {
        const aptRequests = requests.filter(req => req.AptID === apt.AptID);
        aptRequests.forEach(req => {
          if (counts[req.Status] !== undefined) {
            counts[req.Status]++;
          }
          counts.Total++;
        });
      });

      return {
        BuildingID: building.BuildingID,
        BuildingName: building.BuildingName,
        OpenCount: counts.Open,
        ClosedCount: counts.Closed,
        InProgressCount: counts['In Progress'],
        TotalRequests: counts.Total
      };
    })
    .sort((a, b) => b.OpenCount - a.OpenCount);
}

// ============================================================================
// HELPER: Find buildings with no open requests
// POMOCNIK: Znajdź budynki bez otwartych zgłoszeń
// ============================================================================

function findBuildingsWithNoOpenRequests(buildings, apartments, requests) {
  const allResults = countOpenRequestsPerBuilding_Approach1(buildings, apartments, requests);
  return allResults.filter(result => result.OpenRequestCount === 0);
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(80));
console.log('OPEN REQUESTS - TEST RESULTS');
console.log('OTWARTE ZGŁOSZENIA - WYNIKI TESTÓW');
console.log('='.repeat(80));
console.log();

// Test 1: Basic LEFT JOIN approach
console.log('TEST 1: LEFT JOIN Approach - All Buildings with Open Request Counts');
console.log('TEST 1: Podejście LEFT JOIN - Wszystkie budynki z liczbami otwartych zgłoszeń');
console.log('-'.repeat(80));
const result1 = countOpenRequestsPerBuilding_Approach1(buildings, apartments, requests);
console.table(result1);
console.log(`Total buildings: ${result1.length}`);
console.log(`Łączna liczba budynków: ${result1.length}`);
console.log();

// Test 2: Subquery approach
console.log('TEST 2: Subquery Approach');
console.log('TEST 2: Podejście z podzapytaniem');
console.log('-'.repeat(80));
const result2 = countOpenRequestsPerBuilding_Approach2(buildings, apartments, requests);
console.table(result2);
console.log();

// Test 3: Conditional counting approach
console.log('TEST 3: Conditional Counting (CASE-like)');
console.log('TEST 3: Liczenie warunkowe (podobne do CASE)');
console.log('-'.repeat(80));
const result3 = countOpenRequestsPerBuilding_Approach3(buildings, apartments, requests);
console.table(result3);
console.log();

// Test 4: Count all request types
console.log('TEST 4: All Request Types per Building');
console.log('TEST 4: Wszystkie typy zgłoszeń na budynek');
console.log('-'.repeat(80));
const result4 = countAllRequestTypes(buildings, apartments, requests);
console.table(result4);
console.log();

// Test 5: Buildings with no open requests
console.log('TEST 5: Buildings with No Open Requests');
console.log('TEST 5: Budynki bez otwartych zgłoszeń');
console.log('-'.repeat(80));
const noOpenRequests = findBuildingsWithNoOpenRequests(buildings, apartments, requests);
console.table(noOpenRequests);
console.log(`Found ${noOpenRequests.length} building(s) with no open requests`);
console.log(`Znaleziono ${noOpenRequests.length} budynek(ów) bez otwartych zgłoszeń`);
console.log();

// Test 6: Verify all approaches give same results
console.log('TEST 6: Verify All Approaches Give Same Results');
console.log('TEST 6: Sprawdź, czy wszystkie podejścia dają te same wyniki');
console.log('-'.repeat(80));
const approach1JSON = JSON.stringify(result1);
const approach2JSON = JSON.stringify(result2);
const approach3JSON = JSON.stringify(result3);

console.log(`Approach 1 === Approach 2: ${approach1JSON === approach2JSON ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Approach 1 === Approach 3: ${approach1JSON === approach3JSON ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Approach 2 === Approach 3: ${approach2JSON === approach3JSON ? '✓ PASS' : '✗ FAIL'}`);
console.log();

// Test 7: Edge case - Building with apartments but no requests
console.log('TEST 7: Edge Case - Building with Apartments but No Requests');
console.log('TEST 7: Przypadek brzegowy - Budynek z apartamentami ale bez zgłoszeń');
console.log('-'.repeat(80));
const buildingWithApartmentsNoRequests = result1.find(
  r => apartments.some(a => a.BuildingID === r.BuildingID) &&
       r.OpenRequestCount === 0 &&
       r.BuildingID !== 4 && r.BuildingID !== 5
);
if (buildingWithApartmentsNoRequests) {
  console.log(buildingWithApartmentsNoRequests);
  console.log('✓ Correctly shows 0 open requests');
  console.log('✓ Poprawnie pokazuje 0 otwartych zgłoszeń');
} else {
  console.log('No such buildings in test data');
}
console.log();

// Test 8: Edge case - Building with no apartments
console.log('TEST 8: Edge Case - Building with No Apartments');
console.log('TEST 8: Przypadek brzegowy - Budynek bez apartamentów');
console.log('-'.repeat(80));
const buildingWithNoApartments = result1.filter(
  r => !apartments.some(a => a.BuildingID === r.BuildingID)
);
console.table(buildingWithNoApartments);
console.log(`Found ${buildingWithNoApartments.length} building(s) with no apartments`);
console.log(`Znaleziono ${buildingWithNoApartments.length} budynek(ów) bez apartamentów`);
console.log('✓ These should all show 0 open requests');
console.log('✓ Wszystkie powinny pokazywać 0 otwartych zgłoszeń');
console.log();

// Test 9: Statistics summary
console.log('TEST 9: Summary Statistics');
console.log('TEST 9: Statystyki podsumowania');
console.log('-'.repeat(80));
const totalOpenRequests = result1.reduce((sum, r) => sum + r.OpenRequestCount, 0);
const buildingsWithOpenRequests = result1.filter(r => r.OpenRequestCount > 0).length;
const avgOpenRequestsPerBuilding = totalOpenRequests / result1.length;
const maxOpenRequests = Math.max(...result1.map(r => r.OpenRequestCount));

console.log({
  TotalBuildings: result1.length,
  BuildingsWithOpenRequests: buildingsWithOpenRequests,
  TotalOpenRequests: totalOpenRequests,
  AverageOpenRequestsPerBuilding: avgOpenRequestsPerBuilding.toFixed(2),
  MaxOpenRequestsInOneBuilding: maxOpenRequests
});
console.log();

console.log('='.repeat(80));
console.log('SQL QUERY EXAMPLES / PRZYKŁADY ZAPYTAŃ SQL');
console.log('='.repeat(80));
console.log();

console.log(`
-- Approach 1: Basic LEFT JOIN
-- Podejście 1: Podstawowe LEFT JOIN

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

-- Approach 2: Subquery
-- Podejście 2: Podzapytanie

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

-- Approach 3: CASE WHEN
-- Podejście 3: CASE WHEN

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

-- Extended: All Request Types
-- Rozszerzone: Wszystkie typy zgłoszeń

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
`);
