/**
 * Multiple Apartments - Finding Tenants with Multiple Rentals
 *
 * This file simulates a database and demonstrates SQL queries
 * to find tenants renting more than one apartment.
 */

// ============================================================================
// DATABASE SETUP / KONFIGURACJA BAZY DANYCH
// ============================================================================

// Sample data / Przykładowe dane
const tenants = [
  { TenantID: 1, TenantName: 'John Smith' },
  { TenantID: 2, TenantName: 'Jane Doe' },
  { TenantID: 3, TenantName: 'Bob Johnson' },
  { TenantID: 4, TenantName: 'Alice Williams' },
  { TenantID: 5, TenantName: 'Charlie Brown' },
  { TenantID: 6, TenantName: 'Diana Prince' }
];

const apartments = [
  { AptID: 101, UnitNumber: 'A101', BuildingID: 1, Address: '123 Main St' },
  { AptID: 102, UnitNumber: 'A102', BuildingID: 1, Address: '123 Main St' },
  { AptID: 201, UnitNumber: 'B201', BuildingID: 2, Address: '456 Oak Ave' },
  { AptID: 202, UnitNumber: 'B202', BuildingID: 2, Address: '456 Oak Ave' },
  { AptID: 301, UnitNumber: 'C301', BuildingID: 3, Address: '789 Pine Rd' },
  { AptID: 302, UnitNumber: 'C302', BuildingID: 3, Address: '789 Pine Rd' }
];

const aptTenants = [
  { TenantID: 1, AptID: 101 },  // John has 2 apartments
  { TenantID: 1, AptID: 201 },
  { TenantID: 2, AptID: 102 },  // Jane has 1 apartment
  { TenantID: 3, AptID: 202 },  // Bob has 3 apartments
  { TenantID: 3, AptID: 301 },
  { TenantID: 3, AptID: 302 },
  { TenantID: 4, AptID: 0 },    // Alice has no valid apartment (edge case)
  { TenantID: 5, AptID: 0 }     // Charlie has no valid apartment (edge case)
  // Diana (TenantID: 6) has no apartments at all
];

// ============================================================================
// APPROACH 1: Basic GROUP BY and HAVING
// PODEJŚCIE 1: Podstawowe GROUP BY i HAVING
// ============================================================================

/**
 * Finds tenants renting more than one apartment using GROUP BY and HAVING
 * Znajduje najemców wynajmujących więcej niż jeden apartament używając GROUP BY i HAVING
 *
 * SQL Equivalent:
 * SELECT t.TenantID, t.TenantName, COUNT(at.AptID) AS ApartmentCount
 * FROM Tenants t
 * INNER JOIN AptTenants at ON t.TenantID = at.TenantID
 * GROUP BY t.TenantID, t.TenantName
 * HAVING COUNT(at.AptID) > 1
 * ORDER BY ApartmentCount DESC
 */
function findTenantsWithMultipleApartments_Approach1(tenants, aptTenants) {
  // Step 1: Join tenants with aptTenants (INNER JOIN)
  // Krok 1: Połącz tenants z aptTenants (INNER JOIN)
  const joined = tenants
    .map(tenant => {
      // Find all apartments for this tenant
      // Znajdź wszystkie apartamenty dla tego najemcy
      const tenantApts = aptTenants.filter(at => at.TenantID === tenant.TenantID);

      return tenantApts.map(apt => ({
        TenantID: tenant.TenantID,
        TenantName: tenant.TenantName,
        AptID: apt.AptID
      }));
    })
    .flat();

  // Step 2: Group by TenantID (GROUP BY)
  // Krok 2: Grupuj według TenantID (GROUP BY)
  const grouped = {};
  joined.forEach(row => {
    const key = row.TenantID;
    if (!grouped[key]) {
      grouped[key] = {
        TenantID: row.TenantID,
        TenantName: row.TenantName,
        apartments: []
      };
    }
    grouped[key].apartments.push(row.AptID);
  });

  // Step 3: Filter groups with more than 1 apartment (HAVING COUNT > 1)
  // Krok 3: Filtruj grupy z więcej niż 1 apartamentem (HAVING COUNT > 1)
  const result = Object.values(grouped)
    .filter(group => group.apartments.length > 1)
    .map(group => ({
      TenantID: group.TenantID,
      TenantName: group.TenantName,
      ApartmentCount: group.apartments.length
    }));

  // Step 4: Sort by apartment count descending (ORDER BY)
  // Krok 4: Sortuj według liczby apartamentów malejąco (ORDER BY)
  return result.sort((a, b) => b.ApartmentCount - a.ApartmentCount);
}

// ============================================================================
// APPROACH 2: With Apartment Details
// PODEJŚCIE 2: Z Szczegółami Apartamentów
// ============================================================================

/**
 * Finds tenants with multiple apartments and includes apartment details
 * Znajduje najemców z wieloma apartamentami i zawiera szczegóły apartamentów
 *
 * SQL Equivalent:
 * SELECT t.TenantID, t.TenantName, COUNT(at.AptID) AS ApartmentCount,
 *        STRING_AGG(a.UnitNumber, ', ') AS UnitNumbers
 * FROM Tenants t
 * INNER JOIN AptTenants at ON t.TenantID = at.TenantID
 * INNER JOIN Apartments a ON at.AptID = a.AptID
 * GROUP BY t.TenantID, t.TenantName
 * HAVING COUNT(at.AptID) > 1
 */
function findTenantsWithMultipleApartments_Approach2(tenants, aptTenants, apartments) {
  // Join all three tables
  // Połącz wszystkie trzy tabele
  const joined = tenants
    .map(tenant => {
      const tenantApts = aptTenants
        .filter(at => at.TenantID === tenant.TenantID)
        .map(at => {
          const apartment = apartments.find(a => a.AptID === at.AptID);
          return apartment ? {
            TenantID: tenant.TenantID,
            TenantName: tenant.TenantName,
            AptID: at.AptID,
            UnitNumber: apartment.UnitNumber,
            Address: apartment.Address
          } : null;
        })
        .filter(x => x !== null); // Remove null entries / Usuń wpisy null

      return tenantApts;
    })
    .flat();

  // Group by tenant
  // Grupuj według najemcy
  const grouped = {};
  joined.forEach(row => {
    const key = row.TenantID;
    if (!grouped[key]) {
      grouped[key] = {
        TenantID: row.TenantID,
        TenantName: row.TenantName,
        apartments: []
      };
    }
    grouped[key].apartments.push({
      AptID: row.AptID,
      UnitNumber: row.UnitNumber,
      Address: row.Address
    });
  });

  // Filter and format results
  // Filtruj i formatuj wyniki
  return Object.values(grouped)
    .filter(group => group.apartments.length > 1)
    .map(group => ({
      TenantID: group.TenantID,
      TenantName: group.TenantName,
      ApartmentCount: group.apartments.length,
      UnitNumbers: group.apartments.map(a => a.UnitNumber).join(', '),
      Addresses: [...new Set(group.apartments.map(a => a.Address))].join('; ')
    }))
    .sort((a, b) => b.ApartmentCount - a.ApartmentCount);
}

// ============================================================================
// APPROACH 3: Subquery Approach
// PODEJŚCIE 3: Podejście z Podzapytaniem
// ============================================================================

/**
 * Uses a subquery pattern to find tenants with multiple apartments
 * Używa wzorca podzapytania do znalezienia najemców z wieloma apartamentami
 *
 * SQL Equivalent:
 * SELECT t.TenantID, t.TenantName, apt_count.ApartmentCount
 * FROM Tenants t
 * INNER JOIN (
 *   SELECT TenantID, COUNT(AptID) AS ApartmentCount
 *   FROM AptTenants
 *   GROUP BY TenantID
 *   HAVING COUNT(AptID) > 1
 * ) apt_count ON t.TenantID = apt_count.TenantID
 */
function findTenantsWithMultipleApartments_Approach3(tenants, aptTenants) {
  // Subquery: Count apartments per tenant
  // Podzapytanie: Policz apartamenty na najemcę
  const apartmentCounts = {};
  aptTenants.forEach(at => {
    apartmentCounts[at.TenantID] = (apartmentCounts[at.TenantID] || 0) + 1;
  });

  // Filter to only tenants with more than 1 apartment
  // Filtruj do tylko najemców z więcej niż 1 apartamentem
  const filteredCounts = Object.entries(apartmentCounts)
    .filter(([tenantId, count]) => count > 1)
    .reduce((obj, [tenantId, count]) => {
      obj[tenantId] = count;
      return obj;
    }, {});

  // Join with Tenants table to get names
  // Połącz z tabelą Tenants, aby uzyskać nazwy
  return tenants
    .filter(tenant => filteredCounts[tenant.TenantID])
    .map(tenant => ({
      TenantID: tenant.TenantID,
      TenantName: tenant.TenantName,
      ApartmentCount: filteredCounts[tenant.TenantID]
    }))
    .sort((a, b) => b.ApartmentCount - a.ApartmentCount);
}

// ============================================================================
// HELPER: Find tenant renting the most apartments
// POMOCNIK: Znajdź najemcę wynajmującego najwięcej apartamentów
// ============================================================================

function findTenantWithMostApartments(tenants, aptTenants) {
  const results = findTenantsWithMultipleApartments_Approach1(tenants, aptTenants);
  return results.length > 0 ? results[0] : null;
}

// ============================================================================
// TEST CASES / PRZYPADKI TESTOWE
// ============================================================================

console.log('='.repeat(80));
console.log('MULTIPLE APARTMENTS - TEST RESULTS');
console.log('WIELE APARTAMENTÓW - WYNIKI TESTÓW');
console.log('='.repeat(80));
console.log();

// Test 1: Basic approach
console.log('TEST 1: Basic GROUP BY and HAVING Approach');
console.log('TEST 1: Podstawowe podejście GROUP BY i HAVING');
console.log('-'.repeat(80));
const result1 = findTenantsWithMultipleApartments_Approach1(tenants, aptTenants);
console.table(result1);
console.log(`Found ${result1.length} tenant(s) with multiple apartments`);
console.log(`Znaleziono ${result1.length} najemcę/ów z wieloma apartamentami`);
console.log();

// Test 2: With apartment details
console.log('TEST 2: With Apartment Details');
console.log('TEST 2: Ze szczegółami apartamentów');
console.log('-'.repeat(80));
const result2 = findTenantsWithMultipleApartments_Approach2(tenants, aptTenants, apartments);
console.table(result2);
console.log();

// Test 3: Subquery approach
console.log('TEST 3: Subquery Approach');
console.log('TEST 3: Podejście z podzapytaniem');
console.log('-'.repeat(80));
const result3 = findTenantsWithMultipleApartments_Approach3(tenants, aptTenants);
console.table(result3);
console.log();

// Test 4: Find tenant with most apartments
console.log('TEST 4: Tenant with Most Apartments');
console.log('TEST 4: Najemca z największą liczbą apartamentów');
console.log('-'.repeat(80));
const topTenant = findTenantWithMostApartments(tenants, aptTenants);
console.log(topTenant);
console.log();

// Test 5: Edge case - empty data
console.log('TEST 5: Edge Case - No Multi-Apartment Tenants');
console.log('TEST 5: Przypadek brzegowy - Brak najemców z wieloma apartamentami');
console.log('-'.repeat(80));
const emptyAptTenants = [
  { TenantID: 1, AptID: 101 },
  { TenantID: 2, AptID: 102 }
];
const result5 = findTenantsWithMultipleApartments_Approach1(tenants, emptyAptTenants);
console.log(`Result: ${result5.length === 0 ? 'Empty (as expected)' : 'Not empty (unexpected)'}`);
console.log(`Wynik: ${result5.length === 0 ? 'Pusty (zgodnie z oczekiwaniami)' : 'Niepusty (nieoczekiwany)'}`);
console.log();

// Test 6: Edge case - tenant with no apartments
console.log('TEST 6: Edge Case - Tenant with No Apartments');
console.log('TEST 6: Przypadek brzegowy - Najemca bez apartamentów');
console.log('-'.repeat(80));
const tenantWithNoApts = tenants.find(t => !aptTenants.some(at => at.TenantID === t.TenantID));
console.log(tenantWithNoApts ?
  `Tenant ${tenantWithNoApts.TenantName} (ID: ${tenantWithNoApts.TenantID}) has no apartments` :
  'All tenants have at least one apartment'
);
console.log();

// Test 7: Verify all approaches give same results
console.log('TEST 7: Verify All Approaches Give Same Results');
console.log('TEST 7: Sprawdź, czy wszystkie podejścia dają te same wyniki');
console.log('-'.repeat(80));
const allEqual = JSON.stringify(result1) === JSON.stringify(result3);
console.log(`Approach 1 === Approach 3: ${allEqual ? '✓ PASS' : '✗ FAIL'}`);
console.log(`Podejście 1 === Podejście 3: ${allEqual ? '✓ SUKCES' : '✗ BŁĄD'}`);
console.log();

console.log('='.repeat(80));
console.log('SQL QUERY EXAMPLES / PRZYKŁADY ZAPYTAŃ SQL');
console.log('='.repeat(80));
console.log();

console.log(`
-- Approach 1: Basic Query
-- Podejście 1: Podstawowe zapytanie

SELECT
    t.TenantID,
    t.TenantName,
    COUNT(at.AptID) AS ApartmentCount
FROM Tenants t
INNER JOIN AptTenants at ON t.TenantID = at.TenantID
GROUP BY t.TenantID, t.TenantName
HAVING COUNT(at.AptID) > 1
ORDER BY ApartmentCount DESC;

-- Approach 2: With Details
-- Podejście 2: Ze szczegółami

SELECT
    t.TenantID,
    t.TenantName,
    COUNT(at.AptID) AS ApartmentCount,
    STRING_AGG(a.UnitNumber, ', ') AS UnitNumbers
FROM Tenants t
INNER JOIN AptTenants at ON t.TenantID = at.TenantID
INNER JOIN Apartments a ON at.AptID = a.AptID
GROUP BY t.TenantID, t.TenantName
HAVING COUNT(at.AptID) > 1
ORDER BY ApartmentCount DESC;

-- Approach 3: Subquery
-- Podejście 3: Podzapytanie

SELECT
    t.TenantID,
    t.TenantName,
    apt_count.ApartmentCount
FROM Tenants t
INNER JOIN (
    SELECT
        TenantID,
        COUNT(AptID) AS ApartmentCount
    FROM AptTenants
    GROUP BY TenantID
    HAVING COUNT(AptID) > 1
) apt_count ON t.TenantID = apt_count.TenantID
ORDER BY apt_count.ApartmentCount DESC;
`);
