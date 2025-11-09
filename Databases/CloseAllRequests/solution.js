/**
 * Close All Requests - UPDATE Query for Building Renovation
 *
 * This file simulates UPDATE operations to close all requests
 * for apartments in a specific building.
 */

// ============================================================================
// DATABASE SETUP / KONFIGURACJA BAZY DANYCH
// ============================================================================

// Deep clone helper / Pomocnik do głębokiego klonowania
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Sample data / Przykładowe dane
const buildings = [
  { BuildingID: 10, ComplexID: 1, BuildingName: 'Tower A', Address: '100 Main St' },
  { BuildingID: 11, ComplexID: 1, BuildingName: 'Tower B (Renovation)', Address: '110 Main St' },
  { BuildingID: 12, ComplexID: 2, BuildingName: 'Tower C', Address: '120 Oak Ave' }
];

const apartments = [
  { AptID: 1001, UnitNumber: 'A101', BuildingID: 10, Address: '100 Main St #A101' },
  { AptID: 1002, UnitNumber: 'A102', BuildingID: 10, Address: '100 Main St #A102' },

  // Building 11 - The one undergoing renovation
  // Budynek 11 - Ten w remoncie
  { AptID: 1101, UnitNumber: 'B101', BuildingID: 11, Address: '110 Main St #B101' },
  { AptID: 1102, UnitNumber: 'B102', BuildingID: 11, Address: '110 Main St #B102' },
  { AptID: 1103, UnitNumber: 'B103', BuildingID: 11, Address: '110 Main St #B103' },

  { AptID: 1201, UnitNumber: 'C101', BuildingID: 12, Address: '120 Oak Ave #C101' }
];

const requestsOriginal = [
  // Building 10 - should NOT be affected
  { RequestID: 1, Status: 'Open', AptID: 1001, Description: 'Leaking faucet' },
  { RequestID: 2, Status: 'In Progress', AptID: 1002, Description: 'AC repair' },

  // Building 11 - should ALL be closed
  { RequestID: 3, Status: 'Open', AptID: 1101, Description: 'Window broken' },
  { RequestID: 4, Status: 'Open', AptID: 1101, Description: 'Door squeaks' },
  { RequestID: 5, Status: 'In Progress', AptID: 1102, Description: 'Paint job' },
  { RequestID: 6, Status: 'Closed', AptID: 1102, Description: 'Fixed outlet' },
  { RequestID: 7, Status: 'Open', AptID: 1103, Description: 'Heating issue' },

  // Building 12 - should NOT be affected
  { RequestID: 8, Status: 'Open', AptID: 1201, Description: 'Light bulb' }
];

// ============================================================================
// APPROACH 1: UPDATE with JOIN (simulated)
// PODEJŚCIE 1: UPDATE z JOIN (symulowane)
// ============================================================================

/**
 * Closes all requests for apartments in a specific building using JOIN approach
 * Zamyka wszystkie zgłoszenia dla apartamentów w określonym budynku używając JOIN
 *
 * SQL Equivalent (SQL Server):
 * UPDATE r
 * SET r.Status = 'Closed'
 * FROM Requests r
 * INNER JOIN Apartments a ON r.AptID = a.AptID
 * WHERE a.BuildingID = 11
 */
function closeAllRequests_JoinApproach(requests, apartments, buildingID) {
  // Clone the data to avoid mutating original
  // Klonuj dane, aby uniknąć mutacji oryginału
  const updatedRequests = deepClone(requests);
  let rowsAffected = 0;

  // Find all AptIDs in the building (JOIN simulation)
  // Znajdź wszystkie AptID w budynku (symulacja JOIN)
  const aptIDsInBuilding = apartments
    .filter(apt => apt.BuildingID === buildingID)
    .map(apt => apt.AptID);

  // Update requests for those apartments
  // Zaktualizuj zgłoszenia dla tych apartamentów
  updatedRequests.forEach(request => {
    if (aptIDsInBuilding.includes(request.AptID)) {
      request.Status = 'Closed';
      rowsAffected++;
    }
  });

  return { updatedRequests, rowsAffected };
}

// ============================================================================
// APPROACH 2: UPDATE with Subquery (simulated)
// PODEJŚCIE 2: UPDATE z Podzapytaniem (symulowane)
// ============================================================================

/**
 * Closes all requests using subquery approach
 * Zamyka wszystkie zgłoszenia używając podejścia z podzapytaniem
 *
 * SQL Equivalent:
 * UPDATE Requests
 * SET Status = 'Closed'
 * WHERE AptID IN (
 *   SELECT AptID FROM Apartments WHERE BuildingID = 11
 * )
 */
function closeAllRequests_SubqueryApproach(requests, apartments, buildingID) {
  const updatedRequests = deepClone(requests);
  let rowsAffected = 0;

  // Subquery: Find all AptIDs in the building
  // Podzapytanie: Znajdź wszystkie AptID w budynku
  const aptIDsInBuilding = new Set(
    apartments
      .filter(apt => apt.BuildingID === buildingID)
      .map(apt => apt.AptID)
  );

  // Update requests where AptID is in the subquery result
  // Zaktualizuj zgłoszenia, gdzie AptID jest w wyniku podzapytania
  updatedRequests.forEach(request => {
    if (aptIDsInBuilding.has(request.AptID)) {
      request.Status = 'Closed';
      rowsAffected++;
    }
  });

  return { updatedRequests, rowsAffected };
}

// ============================================================================
// APPROACH 3: UPDATE Only Non-Closed Requests
// PODEJŚCIE 3: UPDATE Tylko Niezamkniętych Zgłoszeń
// ============================================================================

/**
 * Closes only non-closed requests (more efficient)
 * Zamyka tylko niezamknięte zgłoszenia (bardziej wydajne)
 *
 * SQL Equivalent:
 * UPDATE Requests
 * SET Status = 'Closed'
 * WHERE AptID IN (SELECT AptID FROM Apartments WHERE BuildingID = 11)
 *   AND Status != 'Closed'
 */
function closeAllRequests_OnlyNonClosed(requests, apartments, buildingID) {
  const updatedRequests = deepClone(requests);
  let rowsAffected = 0;

  const aptIDsInBuilding = new Set(
    apartments
      .filter(apt => apt.BuildingID === buildingID)
      .map(apt => apt.AptID)
  );

  updatedRequests.forEach(request => {
    // Only update if not already closed
    // Aktualizuj tylko jeśli nie jest już zamknięte
    if (aptIDsInBuilding.has(request.AptID) && request.Status !== 'Closed') {
      request.Status = 'Closed';
      rowsAffected++;
    }
  });

  return { updatedRequests, rowsAffected };
}

// ============================================================================
// APPROACH 4: UPDATE with Additional Metadata
// PODEJŚCIE 4: UPDATE z Dodatkowymi Metadanymi
// ============================================================================

/**
 * Closes requests and adds closure metadata
 * Zamyka zgłoszenia i dodaje metadane zamknięcia
 *
 * SQL Equivalent:
 * UPDATE Requests
 * SET Status = 'Closed',
 *     ClosedDate = GETDATE(),
 *     ClosedReason = 'Building renovation'
 * WHERE AptID IN (SELECT AptID FROM Apartments WHERE BuildingID = 11)
 *   AND Status != 'Closed'
 */
function closeAllRequests_WithMetadata(requests, apartments, buildingID, reason = 'Building renovation') {
  const updatedRequests = deepClone(requests);
  let rowsAffected = 0;
  const closedDate = new Date();

  const aptIDsInBuilding = new Set(
    apartments
      .filter(apt => apt.BuildingID === buildingID)
      .map(apt => apt.AptID)
  );

  updatedRequests.forEach(request => {
    if (aptIDsInBuilding.has(request.AptID) && request.Status !== 'Closed') {
      request.Status = 'Closed';
      request.ClosedDate = closedDate;
      request.ClosedReason = reason;
      rowsAffected++;
    }
  });

  return { updatedRequests, rowsAffected };
}

// ============================================================================
// SAFETY CHECKS / SPRAWDZENIA BEZPIECZEŃSTWA
// ============================================================================

/**
 * Preview which requests will be affected before updating
 * Podgląd zgłoszeń, które zostaną dotknięte przed aktualizacją
 */
function previewAffectedRequests(requests, apartments, buildingID) {
  const aptIDsInBuilding = new Set(
    apartments
      .filter(apt => apt.BuildingID === buildingID)
      .map(apt => apt.AptID)
  );

  return requests
    .filter(request => aptIDsInBuilding.has(request.AptID))
    .map(request => ({
      RequestID: request.RequestID,
      CurrentStatus: request.Status,
      AptID: request.AptID,
      Description: request.Description
    }));
}

/**
 * Count how many requests will be affected
 * Policz ile zgłoszeń zostanie dotkniętych
 */
function countAffectedRequests(requests, apartments, buildingID, onlyNonClosed = false) {
  const aptIDsInBuilding = new Set(
    apartments
      .filter(apt => apt.BuildingID === buildingID)
      .map(apt => apt.AptID)
  );

  let count = 0;
  requests.forEach(request => {
    if (aptIDsInBuilding.has(request.AptID)) {
      if (!onlyNonClosed || request.Status !== 'Closed') {
        count++;
      }
    }
  });

  return count;
}

/**
 * Verify that update was successful
 * Sprawdź, czy aktualizacja powiodła się
 */
function verifyUpdate(requests, apartments, buildingID) {
  const aptIDsInBuilding = new Set(
    apartments
      .filter(apt => apt.BuildingID === buildingID)
      .map(apt => apt.AptID)
  );

  const stats = {
    totalInBuilding: 0,
    closed: 0,
    notClosed: 0
  };

  requests.forEach(request => {
    if (aptIDsInBuilding.has(request.AptID)) {
      stats.totalInBuilding++;
      if (request.Status === 'Closed') {
        stats.closed++;
      } else {
        stats.notClosed++;
      }
    }
  });

  return stats;
}

// ============================================================================
// HELPER: Rollback simulation
// POMOCNIK: Symulacja cofnięcia
// ============================================================================

function createBackup(requests) {
  return deepClone(requests);
}

function rollback(backup) {
  return deepClone(backup);
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(80));
console.log('CLOSE ALL REQUESTS - TEST RESULTS');
console.log('ZAMKNIJ WSZYSTKIE ZGŁOSZENIA - WYNIKI TESTÓW');
console.log('='.repeat(80));
console.log();

const TARGET_BUILDING = 11;

// Test 1: Preview affected requests
console.log('TEST 1: Preview Affected Requests (Safety Check)');
console.log('TEST 1: Podgląd dotkniętych zgłoszeń (Sprawdzenie bezpieczeństwa)');
console.log('-'.repeat(80));
const affectedRequests = previewAffectedRequests(requestsOriginal, apartments, TARGET_BUILDING);
console.log(`Building ID: ${TARGET_BUILDING}`);
console.log(`Requests to be affected: ${affectedRequests.length}`);
console.table(affectedRequests);
console.log();

// Test 2: Count affected requests
console.log('TEST 2: Count Affected Requests');
console.log('TEST 2: Policz dotknięte zgłoszenia');
console.log('-'.repeat(80));
const totalCount = countAffectedRequests(requestsOriginal, apartments, TARGET_BUILDING, false);
const nonClosedCount = countAffectedRequests(requestsOriginal, apartments, TARGET_BUILDING, true);
console.log(`Total requests in building ${TARGET_BUILDING}: ${totalCount}`);
console.log(`Non-closed requests in building ${TARGET_BUILDING}: ${nonClosedCount}`);
console.log(`Already closed: ${totalCount - nonClosedCount}`);
console.log();

// Test 3: JOIN approach
console.log('TEST 3: UPDATE with JOIN Approach');
console.log('TEST 3: UPDATE z podejściem JOIN');
console.log('-'.repeat(80));
const backup1 = createBackup(requestsOriginal);
const result1 = closeAllRequests_JoinApproach(backup1, apartments, TARGET_BUILDING);
console.log(`Rows affected: ${result1.rowsAffected}`);
console.log(`Wiersze dotknięte: ${result1.rowsAffected}`);
const verify1 = verifyUpdate(result1.updatedRequests, apartments, TARGET_BUILDING);
console.log('Verification:', verify1);
console.log(`✓ All ${verify1.totalInBuilding} requests closed: ${verify1.notClosed === 0 ? 'YES' : 'NO'}`);
console.log();

// Test 4: Subquery approach
console.log('TEST 4: UPDATE with Subquery Approach');
console.log('TEST 4: UPDATE z podejściem podzapytania');
console.log('-'.repeat(80));
const backup2 = createBackup(requestsOriginal);
const result2 = closeAllRequests_SubqueryApproach(backup2, apartments, TARGET_BUILDING);
console.log(`Rows affected: ${result2.rowsAffected}`);
const verify2 = verifyUpdate(result2.updatedRequests, apartments, TARGET_BUILDING);
console.log('Verification:', verify2);
console.log();

// Test 5: Only non-closed approach
console.log('TEST 5: UPDATE Only Non-Closed Requests (Optimized)');
console.log('TEST 5: UPDATE tylko niezamkniętych zgłoszeń (Zoptymalizowane)');
console.log('-'.repeat(80));
const backup3 = createBackup(requestsOriginal);
const result3 = closeAllRequests_OnlyNonClosed(backup3, apartments, TARGET_BUILDING);
console.log(`Rows affected: ${result3.rowsAffected}`);
console.log(`Expected: ${nonClosedCount}`);
console.log(`✓ Matches expected: ${result3.rowsAffected === nonClosedCount ? 'YES' : 'NO'}`);
const verify3 = verifyUpdate(result3.updatedRequests, apartments, TARGET_BUILDING);
console.log('Verification:', verify3);
console.log();

// Test 6: With metadata
console.log('TEST 6: UPDATE with Additional Metadata');
console.log('TEST 6: UPDATE z dodatkowymi metadanymi');
console.log('-'.repeat(80));
const backup4 = createBackup(requestsOriginal);
const result4 = closeAllRequests_WithMetadata(backup4, apartments, TARGET_BUILDING, 'Major renovation');
console.log(`Rows affected: ${result4.rowsAffected}`);
const closedWithMetadata = result4.updatedRequests.filter(r =>
  r.Status === 'Closed' && r.ClosedReason === 'Major renovation'
);
console.log(`Requests with closure metadata: ${closedWithMetadata.length}`);
console.log('\nSample updated request:');
console.log(closedWithMetadata[0]);
console.log();

// Test 7: Verify other buildings NOT affected
console.log('TEST 7: Verify Other Buildings NOT Affected');
console.log('TEST 7: Sprawdź, czy inne budynki NIE zostały dotknięte');
console.log('-'.repeat(80));
const building10Requests = result1.updatedRequests.filter(r =>
  apartments.some(a => a.AptID === r.AptID && a.BuildingID === 10)
);
const building10Open = building10Requests.filter(r => r.Status !== 'Closed');
console.log(`Building 10 - Open requests: ${building10Open.length}`);
console.log(`✓ Building 10 unaffected: ${building10Open.length > 0 ? 'YES' : 'NO'}`);

const building12Requests = result1.updatedRequests.filter(r =>
  apartments.some(a => a.AptID === r.AptID && a.BuildingID === 12)
);
const building12Open = building12Requests.filter(r => r.Status !== 'Closed');
console.log(`Building 12 - Open requests: ${building12Open.length}`);
console.log(`✓ Building 12 unaffected: ${building12Open.length > 0 ? 'YES' : 'NO'}`);
console.log();

// Test 8: Edge case - Building with no apartments
console.log('TEST 8: Edge Case - Building with No Apartments');
console.log('TEST 8: Przypadek brzegowy - Budynek bez apartamentów');
console.log('-'.repeat(80));
const emptyBuildingID = 99;
const backup5 = createBackup(requestsOriginal);
const result5 = closeAllRequests_JoinApproach(backup5, apartments, emptyBuildingID);
console.log(`Rows affected: ${result5.rowsAffected}`);
console.log(`Expected: 0`);
console.log(`✓ Safe (no rows affected): ${result5.rowsAffected === 0 ? 'YES' : 'NO'}`);
console.log();

// Test 9: Compare all approaches
console.log('TEST 9: Verify All Approaches Give Same Final State');
console.log('TEST 9: Sprawdź, czy wszystkie podejścia dają ten sam stan końcowy');
console.log('-'.repeat(80));
const verify1JSON = JSON.stringify(verify1);
const verify2JSON = JSON.stringify(verify2);
const verify3JSON = JSON.stringify(verify3);
console.log(`Approach 1 === Approach 2: ${verify1JSON === verify2JSON ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Approach 1 === Approach 3: ${verify1JSON === verify3JSON ? '✓ PASS' : '✗ FAIL'}`);
console.log();

// Test 10: Transaction simulation with rollback
console.log('TEST 10: Transaction with Rollback Simulation');
console.log('TEST 10: Transakcja z symulacją cofnięcia');
console.log('-'.repeat(80));
console.log('BEGIN TRANSACTION');
const transactionBackup = createBackup(requestsOriginal);
const transactionResult = closeAllRequests_JoinApproach(transactionBackup, apartments, TARGET_BUILDING);
console.log(`Updated ${transactionResult.rowsAffected} requests`);

// Simulate checking the result and deciding to rollback
// Symuluj sprawdzenie wyniku i decyzję o cofnięciu
console.log('Checking results... (simulating verification)');
console.log('ROLLBACK - Restoring original data');
const restoredData = rollback(requestsOriginal);
const restoredMatch = JSON.stringify(restoredData) === JSON.stringify(requestsOriginal);
console.log(`✓ Data successfully restored: ${restoredMatch ? 'YES' : 'NO'}`);
console.log();

console.log('='.repeat(80));
console.log('SQL QUERY EXAMPLES / PRZYKŁADY ZAPYTAŃ SQL');
console.log('='.repeat(80));
console.log();

console.log(`
-- Approach 1: UPDATE with JOIN (SQL Server syntax)
-- Podejście 1: UPDATE z JOIN (składnia SQL Server)

UPDATE r
SET r.Status = 'Closed'
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11;

-- Approach 1 (PostgreSQL syntax)
-- Podejście 1 (składnia PostgreSQL)

UPDATE Requests r
SET Status = 'Closed'
FROM Apartments a
WHERE r.AptID = a.AptID
  AND a.BuildingID = 11;

-- Approach 2: UPDATE with Subquery (Universal)
-- Podejście 2: UPDATE z podzapytaniem (Uniwersalne)

UPDATE Requests
SET Status = 'Closed'
WHERE AptID IN (
    SELECT AptID
    FROM Apartments
    WHERE BuildingID = 11
);

-- Approach 3: Only Non-Closed (Optimized)
-- Podejście 3: Tylko niezamknięte (Zoptymalizowane)

UPDATE Requests
SET Status = 'Closed'
WHERE AptID IN (
    SELECT AptID
    FROM Apartments
    WHERE BuildingID = 11
)
AND Status != 'Closed';

-- Approach 4: With Metadata
-- Podejście 4: Z metadanymi

UPDATE Requests
SET Status = 'Closed',
    ClosedDate = GETDATE(),
    ClosedReason = 'Building renovation'
WHERE AptID IN (
    SELECT AptID
    FROM Apartments
    WHERE BuildingID = 11
)
AND Status != 'Closed';

-- SAFETY: Preview before updating
-- BEZPIECZEŃSTWO: Podgląd przed aktualizacją

SELECT r.RequestID, r.Status, r.Description, a.UnitNumber, a.BuildingID
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11;

-- SAFETY: Count affected rows
-- BEZPIECZEŃSTWO: Policz dotknięte wiersze

SELECT COUNT(*) AS TotalAffected
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11;

-- SAFETY: Verify after update
-- BEZPIECZEŃSTWO: Sprawdź po aktualizacji

SELECT COUNT(*) AS StillOpen
FROM Requests r
INNER JOIN Apartments a ON r.AptID = a.AptID
WHERE a.BuildingID = 11 AND r.Status != 'Closed';
-- Should return 0 / Powinno zwrócić 0
`);
