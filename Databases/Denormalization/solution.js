/**
 * Denormalization - Comparing Normalized vs Denormalized Schemas
 *
 * This file demonstrates the trade-offs between normalized and denormalized
 * database designs with performance comparisons.
 */

// ============================================================================
// NORMALIZED SCHEMA / ZNORMALIZOWANY SCHEMAT
// ============================================================================

console.log('='.repeat(80));
console.log('DENORMALIZATION - NORMALIZED VS DENORMALIZED COMPARISON');
console.log('DENORMALIZACJA - PORÓWNANIE ZNORMALIZOWANEGO I ZDENORMALIZOWANEGO');
console.log('='.repeat(80));
console.log();

// Normalized tables / Znormalizowane tabele
const customers_normalized = [
  { CustomerID: 1, Name: 'John Doe', Email: 'john@example.com', City: 'New York' },
  { CustomerID: 2, Name: 'Jane Smith', Email: 'jane@example.com', City: 'Los Angeles' },
  { CustomerID: 3, Name: 'Bob Johnson', Email: 'bob@example.com', City: 'Chicago' }
];

const orders_normalized = [
  { OrderID: 101, CustomerID: 1, OrderDate: '2024-01-15', TotalAmount: 150.00 },
  { OrderID: 102, CustomerID: 1, OrderDate: '2024-02-20', TotalAmount: 200.00 },
  { OrderID: 103, CustomerID: 2, OrderDate: '2024-01-25', TotalAmount: 75.50 },
  { OrderID: 104, CustomerID: 1, OrderDate: '2024-03-10', TotalAmount: 300.00 },
  { OrderID: 105, CustomerID: 3, OrderDate: '2024-02-15', TotalAmount: 120.00 }
];

// ============================================================================
// DENORMALIZED SCHEMA / ZDENORMALIZOWANY SCHEMAT
// ============================================================================

const orders_denormalized = [
  { OrderID: 101, CustomerID: 1, CustomerName: 'John Doe', CustomerEmail: 'john@example.com', CustomerCity: 'New York', OrderDate: '2024-01-15', TotalAmount: 150.00 },
  { OrderID: 102, CustomerID: 1, CustomerName: 'John Doe', CustomerEmail: 'john@example.com', CustomerCity: 'New York', OrderDate: '2024-02-20', TotalAmount: 200.00 },
  { OrderID: 103, CustomerID: 2, CustomerName: 'Jane Smith', CustomerEmail: 'jane@example.com', CustomerCity: 'Los Angeles', OrderDate: '2024-01-25', TotalAmount: 75.50 },
  { OrderID: 104, CustomerID: 1, CustomerName: 'John Doe', CustomerEmail: 'john@example.com', CustomerCity: 'New York', OrderDate: '2024-03-10', TotalAmount: 300.00 },
  { OrderID: 105, CustomerID: 3, CustomerName: 'Bob Johnson', CustomerEmail: 'bob@example.com', CustomerCity: 'Chicago', OrderDate: '2024-02-15', TotalAmount: 120.00 }
];

// ============================================================================
// QUERY FUNCTIONS / FUNKCJE ZAPYTAŃ
// ============================================================================

/**
 * NORMALIZED: Get orders with customer info (requires JOIN)
 * ZNORMALIZOWANE: Pobierz zamówienia z informacjami o kliencie (wymaga JOIN)
 */
function getOrdersNormalized(orders, customers) {
  return orders.map(order => {
    const customer = customers.find(c => c.CustomerID === order.CustomerID);
    return {
      OrderID: order.OrderID,
      OrderDate: order.OrderDate,
      TotalAmount: order.TotalAmount,
      CustomerName: customer.Name,
      CustomerEmail: customer.Email,
      CustomerCity: customer.City
    };
  });
}

/**
 * DENORMALIZED: Get orders with customer info (direct read)
 * ZDENORMALIZOWANE: Pobierz zamówienia z informacjami o kliencie (bezpośredni odczyt)
 */
function getOrdersDenormalized(orders) {
  return orders.map(order => ({
    OrderID: order.OrderID,
    OrderDate: order.OrderDate,
    TotalAmount: order.TotalAmount,
    CustomerName: order.CustomerName,
    CustomerEmail: order.CustomerEmail,
    CustomerCity: order.CustomerCity
  }));
}

// ============================================================================
// UPDATE OPERATIONS / OPERACJE AKTUALIZACJI
// ============================================================================

/**
 * NORMALIZED: Update customer email (simple, one place)
 * ZNORMALIZOWANE: Aktualizuj email klienta (proste, jedno miejsce)
 */
function updateCustomerEmailNormalized(customers, customerID, newEmail) {
  const customer = customers.find(c => c.CustomerID === customerID);
  if (customer) {
    customer.Email = newEmail;
    return { rowsAffected: 1, complexity: 'Simple - 1 table update' };
  }
  return { rowsAffected: 0, complexity: 'Simple - 1 table update' };
}

/**
 * DENORMALIZED: Update customer email (complex, multiple places)
 * ZDENORMALIZOWANE: Aktualizuj email klienta (złożone, wiele miejsc)
 */
function updateCustomerEmailDenormalized(orders, customerID, newEmail) {
  let rowsAffected = 0;
  orders.forEach(order => {
    if (order.CustomerID === customerID) {
      order.CustomerEmail = newEmail;
      rowsAffected++;
    }
  });
  return { rowsAffected, complexity: 'Complex - Update all order records' };
}

// ============================================================================
// DATA ANOMALY EXAMPLES / PRZYKŁADY ANOMALII DANYCH
// ============================================================================

/**
 * Demonstrate UPDATE ANOMALY / Demonstracja ANOMALII AKTUALIZACJI
 */
function demonstrateUpdateAnomaly() {
  console.log('DATA ANOMALY DEMONSTRATION - Update Anomaly');
  console.log('DEMONSTRACJA ANOMALII DANYCH - Anomalia Aktualizacji');
  console.log('-'.repeat(80));

  // Clone data for demonstration
  const orders_denorm_clone = JSON.parse(JSON.stringify(orders_denormalized));

  console.log('Before Update - John Doe email:');
  const johnOrders = orders_denorm_clone.filter(o => o.CustomerID === 1);
  console.table(johnOrders.map(o => ({ OrderID: o.OrderID, CustomerEmail: o.CustomerEmail })));

  // Update only SOME records (simulating missed updates)
  orders_denorm_clone[0].CustomerEmail = 'john.new@example.com';
  orders_denorm_clone[1].CustomerEmail = 'john.new@example.com';
  // Oops! Forgot to update orders_denorm_clone[3]!

  console.log('\\nAfter Partial Update - INCONSISTENT DATA:');
  const johnOrdersAfter = orders_denorm_clone.filter(o => o.CustomerID === 1);
  console.table(johnOrdersAfter.map(o => ({ OrderID: o.OrderID, CustomerEmail: o.CustomerEmail })));

  console.log('\\n⚠️  PROBLEM: Same customer has different emails in different orders!');
  console.log('⚠️  PROBLEM: Ten sam klient ma różne emaile w różnych zamówieniach!\\n');
}

/**
 * Demonstrate STORAGE OVERHEAD / Demonstracja NADMIARU PAMIĘCI
 */
function demonstrateStorageOverhead() {
  console.log('STORAGE OVERHEAD COMPARISON');
  console.log('PORÓWNANIE NADMIARU PAMIĘCI');
  console.log('-'.repeat(80));

  // Calculate storage (simplified - just count characters)
  const normalizedSize = JSON.stringify(customers_normalized).length +
                         JSON.stringify(orders_normalized).length;

  const denormalizedSize = JSON.stringify(orders_denormalized).length;

  const overhead = denormalizedSize - normalizedSize;
  const overheadPercent = ((overhead / normalizedSize) * 100).toFixed(2);

  console.log({
    'Normalized Schema Size': `${normalizedSize} characters`,
    'Denormalized Schema Size': `${denormalizedSize} characters`,
    'Storage Overhead': `${overhead} characters (${overheadPercent}% increase)`,
    'Redundant Data': 'Customer info duplicated in every order'
  });
  console.log();
}

// ============================================================================
// PERFORMANCE SIMULATION / SYMULACJA WYDAJNOŚCI
// ============================================================================

/**
 * Simulate query performance / Symuluj wydajność zapytania
 */
function performanceComparison() {
  console.log('QUERY PERFORMANCE COMPARISON (Simulated)');
  console.log('PORÓWNANIE WYDAJNOŚCI ZAPYTAŃ (Symulowane)');
  console.log('-'.repeat(80));

  const iterations = 10000;

  // Normalized
  const startNormalized = performance.now();
  for (let i = 0; i < iterations; i++) {
    getOrdersNormalized(orders_normalized, customers_normalized);
  }
  const endNormalized = performance.now();
  const timeNormalized = (endNormalized - startNormalized).toFixed(2);

  // Denormalized
  const startDenormalized = performance.now();
  for (let i = 0; i < iterations; i++) {
    getOrdersDenormalized(orders_denormalized);
  }
  const endDenormalized = performance.now();
  const timeDenormalized = (endDenormalized - startDenormalized).toFixed(2);

  const speedup = (timeNormalized / timeDenormalized).toFixed(2);

  console.log({
    'Normalized (with JOIN)': `${timeNormalized}ms for ${iterations} queries`,
    'Denormalized (direct)': `${timeDenormalized}ms for ${iterations} queries`,
    'Speedup': `${speedup}x faster`,
    'Conclusion': 'Denormalized is faster for reads'
  });
  console.log('\\n✓ Denormalized queries are faster (no JOIN needed)');
  console.log('✓ Zapytania zdenormalizowane są szybsze (nie potrzeba JOIN)\\n');
}

// ============================================================================
// PRACTICAL EXAMPLE: AGGREGATION TABLE
// ============================================================================

/**
 * Example: Pre-computed customer statistics (denormalization strategy)
 * Przykład: Wstępnie obliczone statystyki klientów (strategia denormalizacji)
 */
function createAggregationTable(customers, orders) {
  console.log('DENORMALIZATION STRATEGY: Aggregation Table');
  console.log('STRATEGIA DENORMALIZACJI: Tabela Agregująca');
  console.log('-'.repeat(80));

  const customerStats = customers.map(customer => {
    const customerOrders = orders.filter(o => o.CustomerID === customer.CustomerID);

    return {
      CustomerID: customer.CustomerID,
      CustomerName: customer.Name,
      TotalOrders: customerOrders.length,
      TotalSpent: customerOrders.reduce((sum, o) => sum + o.TotalAmount, 0).toFixed(2),
      AvgOrderValue: (customerOrders.reduce((sum, o) => sum + o.TotalAmount, 0) / customerOrders.length).toFixed(2),
      LastOrderDate: customerOrders.length > 0 ?
        customerOrders.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate))[0].OrderDate : null
    };
  });

  console.table(customerStats);
  console.log('\\n✓ Pre-computed aggregates improve reporting performance');
  console.log('✓ Wstępnie obliczone agregaty poprawiają wydajność raportowania');
  console.log('⚠️  Must be updated when orders change (triggers or scheduled jobs)');
  console.log('⚠️  Musi być aktualizowane, gdy zamówienia się zmieniają (wyzwalacze lub zaplanowane zadania)\\n');
}

// ============================================================================
// WHEN TO DENORMALIZE - DECISION TREE
// ============================================================================

function shouldDenormalize(scenario) {
  console.log('DECISION HELPER: Should I Denormalize?');
  console.log('POMOCNIK DECYZJI: Czy powinienem denormalizować?');
  console.log('-'.repeat(80));

  const scenarios = [
    {
      name: 'Read-Heavy Application (e-commerce product catalog)',
      readWriteRatio: '90/10',
      dataVolatility: 'Low',
      consistencyCritical: false,
      recommendation: '✓ YES - Good candidate for denormalization'
    },
    {
      name: 'Write-Heavy Application (real-time trading)',
      readWriteRatio: '20/80',
      dataVolatility: 'High',
      consistencyCritical: true,
      recommendation: '✗ NO - Keep normalized'
    },
    {
      name: 'Analytics Dashboard (historical data)',
      readWriteRatio: '95/5',
      dataVolatility: 'Low (historical)',
      consistencyCritical: false,
      recommendation: '✓ YES - Perfect for denormalization'
    },
    {
      name: 'Financial Transactions',
      readWriteRatio: '50/50',
      dataVolatility: 'Medium',
      consistencyCritical: true,
      recommendation: '✗ NO - Data integrity is critical'
    }
  ];

  console.table(scenarios);
  console.log();
}

// ============================================================================
// BEST PRACTICES / NAJLEPSZE PRAKTYKI
// ============================================================================

function displayBestPractices() {
  console.log('BEST PRACTICES FOR DENORMALIZATION');
  console.log('NAJLEPSZE PRAKTYKI DENORMALIZACJI');
  console.log('-'.repeat(80));

  const practices = [
    '1. ✓ Start with normalization, denormalize only when proven necessary',
    '2. ✓ Measure performance with EXPLAIN before denormalizing',
    '3. ✓ Document all denormalized fields and update logic',
    '4. ✓ Use database triggers or application logic to maintain consistency',
    '5. ✓ Consider alternatives: caching, indexing, read replicas',
    '6. ✓ Denormalize read-only or historical data',
    '7. ✓ Monitor data consistency regularly',
    '8. ✗ Don\'t denormalize frequently updated data',
    '9. ✗ Don\'t denormalize if storage cost is a concern',
    '10. ✗ Don\'t denormalize without proper maintenance plan'
  ];

  practices.forEach(practice => console.log(practice));
  console.log();
}

// ============================================================================
// RUN ALL DEMONSTRATIONS / URUCHOM WSZYSTKIE DEMONSTRACJE
// ============================================================================

// 1. Performance comparison
performanceComparison();

// 2. Storage overhead
demonstrateStorageOverhead();

// 3. Data anomalies
demonstrateUpdateAnomaly();

// 4. Aggregation table example
createAggregationTable(customers_normalized, orders_normalized);

// 5. Decision helper
shouldDenormalize();

// 6. Best practices
displayBestPractices();

// ============================================================================
// SUMMARY TABLE / TABELA PODSUMOWANIA
// ============================================================================

console.log('='.repeat(80));
console.log('NORMALIZATION VS DENORMALIZATION - SUMMARY');
console.log('NORMALIZACJA VS DENORMALIZACJA - PODSUMOWANIE');
console.log('='.repeat(80));
console.log();

const summary = [
  {
    Aspect: 'Read Performance',
    Normalized: 'Slower (JOINs)',
    Denormalized: 'Faster (direct)',
    Winner: 'Denormalized'
  },
  {
    Aspect: 'Write Performance',
    Normalized: 'Faster (single update)',
    Denormalized: 'Slower (multiple updates)',
    Winner: 'Normalized'
  },
  {
    Aspect: 'Storage',
    Normalized: 'Less (no redundancy)',
    Denormalized: 'More (redundant data)',
    Winner: 'Normalized'
  },
  {
    Aspect: 'Data Integrity',
    Normalized: 'High (enforced)',
    Denormalized: 'Risk (manual sync)',
    Winner: 'Normalized'
  },
  {
    Aspect: 'Query Complexity',
    Normalized: 'Complex (JOINs)',
    Denormalized: 'Simple (direct)',
    Winner: 'Denormalized'
  },
  {
    Aspect: 'Maintenance',
    Normalized: 'Easier',
    Denormalized: 'Harder',
    Winner: 'Normalized'
  }
];

console.table(summary);

console.log('\\nKEY TAKEAWAY / KLUCZOWY WNIOSEK:');
console.log('Denormalization is a trade-off: Better read performance for more complexity.');
console.log('Denormalizacja to kompromis: Lepsza wydajność odczytu za cenę większej złożoności.');
console.log();

console.log('='.repeat(80));
