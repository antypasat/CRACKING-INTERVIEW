/**
 * Personal Financial Manager - Financial Management Platform
 * 个人财务管理器 - 财务管理平台
 *
 * Features:
 * - Account aggregation simulation
 * - Transaction categorization with ML
 * - Budget tracking and alerts
 * - Spending analytics
 * - Goal tracking
 * - Security and encryption
 */

const crypto = require('crypto');

// ============================================================================
// 1. Encryption and Security / 加密和安全
// ============================================================================

class EncryptionService {
  constructor(masterKey = 'master-key-should-be-from-kms') {
    this.masterKey = masterKey;
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(plaintext) {
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(64);
    const key = crypto.pbkdf2Sync(this.masterKey, salt, 100000, 32, 'sha256');

    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    // Return encrypted data with metadata
    return {
      ciphertext: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      salt: salt.toString('base64'),
      authTag: authTag.toString('base64')
    };
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData) {
    const key = crypto.pbkdf2Sync(
      this.masterKey,
      Buffer.from(encryptedData.salt, 'base64'),
      100000,
      32,
      'sha256'
    );

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(encryptedData.iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.ciphertext, 'base64')),
      decipher.final()
    ]);

    return decrypted.toString('utf8');
  }

  /**
   * Hash password with bcrypt-like simulation
   */
  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Verify password
   */
  verifyPassword(password, hashedPassword) {
    const [salt, originalHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  }
}

// ============================================================================
// 2. User Management / 用户管理
// ============================================================================

class User {
  constructor(userId, email, passwordHash, firstName, lastName) {
    this.userId = userId;
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = Date.now();
    this.lastLogin = null;
    this.mfaEnabled = false;
    this.status = 'ACTIVE';
  }
}

class UserService {
  constructor(encryptionService) {
    this.users = new Map(); // userId -> User
    this.emailIndex = new Map(); // email -> userId
    this.encryptionService = encryptionService;
    this.nextUserId = 1;
  }

  /**
   * Register a new user
   */
  register(email, password, firstName, lastName) {
    if (this.emailIndex.has(email)) {
      throw new Error('Email already exists');
    }

    const passwordHash = this.encryptionService.hashPassword(password);
    const userId = this.nextUserId++;
    const user = new User(userId, email, passwordHash, firstName, lastName);

    this.users.set(userId, user);
    this.emailIndex.set(email, userId);

    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName
    };
  }

  /**
   * Login
   */
  login(email, password) {
    const userId = this.emailIndex.get(email);
    if (!userId) {
      throw new Error('Invalid credentials');
    }

    const user = this.users.get(userId);
    if (!this.encryptionService.verifyPassword(password, user.passwordHash)) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    user.lastLogin = Date.now();

    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      token: this._generateToken(user.userId)
    };
  }

  _generateToken(userId) {
    // Simplified JWT-like token
    const payload = { userId, timestamp: Date.now() };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}

// ============================================================================
// 3. Financial Account Management / 金融账户管理
// ============================================================================

class FinancialAccount {
  constructor(accountId, userId, institutionName, accountType, accountName, balance) {
    this.accountId = accountId;
    this.userId = userId;
    this.institutionName = institutionName;
    this.accountType = accountType; // CHECKING, SAVINGS, CREDIT_CARD, etc.
    this.accountName = accountName;
    this.currentBalance = balance;
    this.currency = 'USD';
    this.isActive = true;
    this.lastSynced = null;
    this.syncStatus = 'DISCONNECTED';
    this.createdAt = Date.now();
  }
}

class AccountAggregationService {
  constructor(encryptionService) {
    this.accounts = new Map(); // accountId -> FinancialAccount
    this.userAccounts = new Map(); // userId -> [accountIds]
    this.credentials = new Map(); // userId -> institutionId -> encrypted credentials
    this.encryptionService = encryptionService;
    this.nextAccountId = 1001;
  }

  /**
   * Simulate connecting to a bank (like Plaid Link flow)
   */
  connectAccount(userId, institutionName, accountType, accountName, initialBalance, credentials) {
    // Encrypt and store credentials
    const encryptedCreds = this.encryptionService.encrypt(JSON.stringify(credentials));
    if (!this.credentials.has(userId)) {
      this.credentials.set(userId, new Map());
    }
    this.credentials.get(userId).set(institutionName, encryptedCreds);

    // Create account
    const accountId = this.nextAccountId++;
    const account = new FinancialAccount(
      accountId,
      userId,
      institutionName,
      accountType,
      accountName,
      initialBalance
    );

    this.accounts.set(accountId, account);

    if (!this.userAccounts.has(userId)) {
      this.userAccounts.set(userId, []);
    }
    this.userAccounts.get(userId).push(accountId);

    // Initial sync
    this.syncAccount(accountId);

    return account;
  }

  /**
   * Sync account (fetch latest transactions and balance)
   */
  syncAccount(accountId) {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    account.syncStatus = 'SYNCING';

    // Simulate API call to bank/Plaid
    setTimeout(() => {
      // Update balance (simulated)
      const randomChange = (Math.random() - 0.5) * 100;
      account.currentBalance += randomChange;

      account.lastSynced = Date.now();
      account.syncStatus = 'SYNCED';
    }, 1000);

    return { status: 'SYNCING' };
  }

  /**
   * Get all accounts for a user
   */
  getUserAccounts(userId) {
    const accountIds = this.userAccounts.get(userId) || [];
    return accountIds.map(id => this.accounts.get(id));
  }

  /**
   * Disconnect account
   */
  disconnectAccount(accountId) {
    const account = this.accounts.get(accountId);
    if (account) {
      account.isActive = false;
      account.syncStatus = 'DISCONNECTED';
    }
  }
}

// ============================================================================
// 4. Transaction Management / 交易管理
// ============================================================================

class Transaction {
  constructor(transactionId, userId, accountId, amount, date, description, merchantName) {
    this.transactionId = transactionId;
    this.userId = userId;
    this.accountId = accountId;
    this.amount = amount; // Negative for expenses, positive for income
    this.date = date;
    this.description = description;
    this.merchantName = merchantName;
    this.categoryId = null;
    this.categoryConfidence = 0;
    this.isPending = false;
    this.transactionType = amount < 0 ? 'DEBIT' : 'CREDIT';
    this.notes = '';
    this.tags = [];
    this.isHidden = false;
    this.createdAt = Date.now();
  }
}

class TransactionService {
  constructor() {
    this.transactions = new Map(); // transactionId -> Transaction
    this.userTransactions = new Map(); // userId -> [transactionIds]
    this.nextTransactionId = 5001;
  }

  /**
   * Import a transaction
   */
  importTransaction(userId, accountId, amount, date, description, merchantName) {
    const transactionId = this.nextTransactionId++;
    const transaction = new Transaction(
      transactionId,
      userId,
      accountId,
      amount,
      date,
      description,
      merchantName
    );

    this.transactions.set(transactionId, transaction);

    if (!this.userTransactions.has(userId)) {
      this.userTransactions.set(userId, []);
    }
    this.userTransactions.get(userId).push(transactionId);

    return transaction;
  }

  /**
   * Get transactions with filtering
   */
  getTransactions(userId, filters = {}) {
    const userTxnIds = this.userTransactions.get(userId) || [];
    let transactions = userTxnIds.map(id => this.transactions.get(id));

    // Apply filters
    if (filters.accountId) {
      transactions = transactions.filter(t => t.accountId === filters.accountId);
    }

    if (filters.categoryId) {
      transactions = transactions.filter(t => t.categoryId === filters.categoryId);
    }

    if (filters.startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      transactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchLower) ||
        t.merchantName.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    return transactions.slice(offset, offset + limit);
  }

  /**
   * Update transaction
   */
  updateTransaction(transactionId, updates) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (updates.categoryId !== undefined) {
      transaction.categoryId = updates.categoryId;
    }
    if (updates.notes !== undefined) {
      transaction.notes = updates.notes;
    }
    if (updates.tags !== undefined) {
      transaction.tags = updates.tags;
    }

    return transaction;
  }

  /**
   * Get spending summary
   */
  getSpendingSummary(userId, startDate, endDate) {
    const transactions = this.getTransactions(userId, { startDate, endDate, limit: 100000 });

    const summary = {
      totalSpending: 0,
      totalIncome: 0,
      netCashFlow: 0,
      byCategory: {},
      byMerchant: {},
      transactionCount: transactions.length
    };

    for (const txn of transactions) {
      if (txn.amount < 0) {
        summary.totalSpending += Math.abs(txn.amount);
      } else {
        summary.totalIncome += txn.amount;
      }

      // By category
      if (txn.categoryId) {
        if (!summary.byCategory[txn.categoryId]) {
          summary.byCategory[txn.categoryId] = { amount: 0, count: 0 };
        }
        summary.byCategory[txn.categoryId].amount += Math.abs(txn.amount);
        summary.byCategory[txn.categoryId].count++;
      }

      // By merchant
      if (txn.merchantName) {
        if (!summary.byMerchant[txn.merchantName]) {
          summary.byMerchant[txn.merchantName] = { amount: 0, count: 0 };
        }
        summary.byMerchant[txn.merchantName].amount += Math.abs(txn.amount);
        summary.byMerchant[txn.merchantName].count++;
      }
    }

    summary.netCashFlow = summary.totalIncome - summary.totalSpending;

    return summary;
  }
}

// ============================================================================
// 5. Transaction Categorization (ML Simulation) / 交易分类（机器学习模拟）
// ============================================================================

class CategorizationService {
  constructor() {
    // Predefined categories
    this.categories = new Map([
      [1, { categoryId: 1, name: 'Food & Dining', parent: null }],
      [2, { categoryId: 2, name: 'Groceries', parent: 1 }],
      [3, { categoryId: 3, name: 'Restaurants', parent: 1 }],
      [4, { categoryId: 4, name: 'Transportation', parent: null }],
      [5, { categoryId: 5, name: 'Gas', parent: 4 }],
      [6, { categoryId: 6, name: 'Shopping', parent: null }],
      [7, { categoryId: 7, name: 'Bills & Utilities', parent: null }],
      [8, { categoryId: 8, name: 'Entertainment', parent: null }],
      [9, { categoryId: 9, name: 'Healthcare', parent: null }],
      [10, { categoryId: 10, name: 'Income', parent: null }]
    ]);

    // Simple rule-based categorization (simulating ML model)
    this.merchantRules = {
      'WHOLE FOODS': { categoryId: 2, confidence: 0.95 },
      'SAFEWAY': { categoryId: 2, confidence: 0.95 },
      'TRADER JOES': { categoryId: 2, confidence: 0.95 },
      'MCDONALDS': { categoryId: 3, confidence: 0.90 },
      'STARBUCKS': { categoryId: 3, confidence: 0.85 },
      'CHIPOTLE': { categoryId: 3, confidence: 0.90 },
      'SHELL': { categoryId: 5, confidence: 0.95 },
      'CHEVRON': { categoryId: 5, confidence: 0.95 },
      'AMAZON': { categoryId: 6, confidence: 0.70 },
      'TARGET': { categoryId: 6, confidence: 0.75 },
      'NETFLIX': { categoryId: 8, confidence: 0.95 },
      'SPOTIFY': { categoryId: 8, confidence: 0.95 },
      'SALARY': { categoryId: 10, confidence: 0.99 },
      'PAYROLL': { categoryId: 10, confidence: 0.99 }
    };
  }

  /**
   * Categorize a transaction (simulating ML model)
   */
  categorize(transaction) {
    // Check merchant rules
    const merchantUpper = transaction.merchantName.toUpperCase();

    for (const [merchant, rule] of Object.entries(this.merchantRules)) {
      if (merchantUpper.includes(merchant)) {
        transaction.categoryId = rule.categoryId;
        transaction.categoryConfidence = rule.confidence;
        return transaction;
      }
    }

    // Check description patterns
    const descriptionUpper = transaction.description.toUpperCase();

    if (descriptionUpper.includes('GROCERY') || descriptionUpper.includes('SUPERMARKET')) {
      transaction.categoryId = 2;
      transaction.categoryConfidence = 0.80;
    } else if (descriptionUpper.includes('GAS') || descriptionUpper.includes('FUEL')) {
      transaction.categoryId = 5;
      transaction.categoryConfidence = 0.75;
    } else if (descriptionUpper.includes('RESTAURANT') || descriptionUpper.includes('CAFE')) {
      transaction.categoryId = 3;
      transaction.categoryConfidence = 0.70;
    } else if (transaction.amount > 0) {
      // Positive amount is likely income
      transaction.categoryId = 10;
      transaction.categoryConfidence = 0.60;
    } else {
      // Default to Shopping for unknown
      transaction.categoryId = 6;
      transaction.categoryConfidence = 0.50;
    }

    return transaction;
  }

  /**
   * Get category by ID
   */
  getCategory(categoryId) {
    return this.categories.get(categoryId);
  }

  /**
   * Get all categories
   */
  getAllCategories() {
    return Array.from(this.categories.values());
  }
}

// ============================================================================
// 6. Budget Management / 预算管理
// ============================================================================

class Budget {
  constructor(budgetId, userId, categoryId, budgetAmount, periodType = 'MONTHLY') {
    this.budgetId = budgetId;
    this.userId = userId;
    this.categoryId = categoryId;
    this.budgetAmount = budgetAmount;
    this.periodType = periodType; // WEEKLY, MONTHLY, YEARLY
    this.isActive = true;
    this.alertThreshold = 0.90; // Alert at 90%
    this.rolloverEnabled = false;
    this.createdAt = Date.now();
  }
}

class BudgetService {
  constructor(transactionService, categorizationService) {
    this.budgets = new Map(); // budgetId -> Budget
    this.userBudgets = new Map(); // userId -> [budgetIds]
    this.transactionService = transactionService;
    this.categorizationService = categorizationService;
    this.nextBudgetId = 101;
  }

  /**
   * Create a budget
   */
  createBudget(userId, categoryId, budgetAmount, periodType = 'MONTHLY') {
    const budgetId = this.nextBudgetId++;
    const budget = new Budget(budgetId, userId, categoryId, budgetAmount, periodType);

    this.budgets.set(budgetId, budget);

    if (!this.userBudgets.has(userId)) {
      this.userBudgets.set(userId, []);
    }
    this.userBudgets.get(userId).push(budgetId);

    return budget;
  }

  /**
   * Get all budgets for a user with spending
   */
  getUserBudgets(userId) {
    const budgetIds = this.userBudgets.get(userId) || [];
    const budgets = budgetIds.map(id => this.budgets.get(id));

    const { startDate, endDate } = this._getCurrentPeriod('MONTHLY');

    const result = budgets.map(budget => {
      const spent = this._getSpentAmount(userId, budget.categoryId, startDate, endDate);
      const remaining = budget.budgetAmount - spent;
      const percentageUsed = (spent / budget.budgetAmount) * 100;

      let status = 'OK';
      if (percentageUsed >= 100) {
        status = 'EXCEEDED';
      } else if (percentageUsed >= budget.alertThreshold * 100) {
        status = 'WARNING';
      }

      const category = this.categorizationService.getCategory(budget.categoryId);

      return {
        budgetId: budget.budgetId,
        category: category,
        budgetAmount: budget.budgetAmount,
        spentAmount: spent,
        remainingAmount: remaining,
        percentageUsed: percentageUsed.toFixed(1),
        periodType: budget.periodType,
        currentPeriod: { startDate, endDate },
        status
      };
    });

    return result;
  }

  /**
   * Check budget alerts
   */
  checkBudgetAlerts(userId) {
    const budgets = this.getUserBudgets(userId);
    const alerts = [];

    for (const budget of budgets) {
      if (budget.status === 'EXCEEDED') {
        alerts.push({
          type: 'BUDGET_EXCEEDED',
          message: `You've exceeded your ${budget.category.name} budget by $${Math.abs(budget.remainingAmount).toFixed(2)}`,
          budgetId: budget.budgetId
        });
      } else if (budget.status === 'WARNING') {
        alerts.push({
          type: 'BUDGET_WARNING',
          message: `You've used ${budget.percentageUsed}% of your ${budget.category.name} budget`,
          budgetId: budget.budgetId
        });
      }
    }

    return alerts;
  }

  _getSpentAmount(userId, categoryId, startDate, endDate) {
    const transactions = this.transactionService.getTransactions(userId, {
      categoryId,
      startDate,
      endDate,
      limit: 100000
    });

    return transactions
      .filter(t => t.amount < 0) // Only expenses
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  _getCurrentPeriod(periodType) {
    const now = new Date();
    let startDate, endDate;

    if (periodType === 'MONTHLY') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (periodType === 'WEEKLY') {
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else {
      // YEARLY
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }
}

// ============================================================================
// 7. Complete Personal Financial Manager / 完整个人财务管理器
// ============================================================================

class PersonalFinancialManager {
  constructor() {
    this.encryptionService = new EncryptionService();
    this.userService = new UserService(this.encryptionService);
    this.accountService = new AccountAggregationService(this.encryptionService);
    this.transactionService = new TransactionService();
    this.categorizationService = new CategorizationService();
    this.budgetService = new BudgetService(this.transactionService, this.categorizationService);
  }

  /**
   * User registration
   */
  registerUser(email, password, firstName, lastName) {
    return this.userService.register(email, password, firstName, lastName);
  }

  /**
   * User login
   */
  loginUser(email, password) {
    return this.userService.login(email, password);
  }

  /**
   * Connect a bank account
   */
  connectBankAccount(userId, institutionName, accountType, accountName, initialBalance, credentials) {
    return this.accountService.connectAccount(
      userId,
      institutionName,
      accountType,
      accountName,
      initialBalance,
      credentials
    );
  }

  /**
   * Import and categorize a transaction
   */
  importTransaction(userId, accountId, amount, date, description, merchantName) {
    const transaction = this.transactionService.importTransaction(
      userId,
      accountId,
      amount,
      date,
      description,
      merchantName
    );

    // Auto-categorize
    this.categorizationService.categorize(transaction);

    return transaction;
  }

  /**
   * Get transactions
   */
  getTransactions(userId, filters) {
    return this.transactionService.getTransactions(userId, filters);
  }

  /**
   * Get spending summary
   */
  getSpendingSummary(userId, startDate, endDate) {
    return this.transactionService.getSpendingSummary(userId, startDate, endDate);
  }

  /**
   * Create a budget
   */
  createBudget(userId, categoryId, budgetAmount, periodType) {
    return this.budgetService.createBudget(userId, categoryId, budgetAmount, periodType);
  }

  /**
   * Get budgets with spending
   */
  getBudgets(userId) {
    return this.budgetService.getUserBudgets(userId);
  }

  /**
   * Get budget alerts
   */
  getBudgetAlerts(userId) {
    return this.budgetService.checkBudgetAlerts(userId);
  }
}

// ============================================================================
// 8. Example Usage and Tests / 示例用法和测试
// ============================================================================

function demonstrateFinancialManager() {
  console.log('='.repeat(70));
  console.log('Personal Financial Manager Demonstration');
  console.log('个人财务管理器演示');
  console.log('='.repeat(70));

  const pfm = new PersonalFinancialManager();

  // 1. Register user
  console.log('\n1. Registering user...');
  const user = pfm.registerUser('john@example.com', 'SecurePass123!', 'John', 'Doe');
  console.log('✓ User registered:', user);

  // 2. Login
  console.log('\n2. Logging in...');
  const loginResult = pfm.loginUser('john@example.com', 'SecurePass123!');
  console.log('✓ Login successful:', { userId: loginResult.userId, email: loginResult.email });

  const userId = loginResult.userId;

  // 3. Connect bank accounts
  console.log('\n3. Connecting bank accounts...');
  const checkingAccount = pfm.connectBankAccount(
    userId,
    'Chase',
    'CHECKING',
    'Chase Total Checking',
    5000.00,
    { username: 'john_chase', password: 'bankpass123' }
  );
  console.log('✓ Connected checking account:', {
    accountId: checkingAccount.accountId,
    institutionName: checkingAccount.institutionName,
    balance: checkingAccount.currentBalance
  });

  const creditCard = pfm.connectBankAccount(
    userId,
    'Chase',
    'CREDIT_CARD',
    'Chase Sapphire',
    -1234.56,
    { username: 'john_chase', password: 'bankpass123' }
  );
  console.log('✓ Connected credit card:', {
    accountId: creditCard.accountId,
    balance: creditCard.currentBalance
  });

  // 4. Import transactions
  console.log('\n4. Importing transactions...');
  const transactions = [
    { amount: -45.67, date: '2024-01-10', description: 'WHOLE FOODS MARKET', merchant: 'Whole Foods' },
    { amount: -8.99, date: '2024-01-11', description: 'NETFLIX.COM', merchant: 'Netflix' },
    { amount: -52.30, date: '2024-01-12', description: 'SHELL OIL', merchant: 'Shell' },
    { amount: -125.00, date: '2024-01-13', description: 'AMAZON.COM', merchant: 'Amazon' },
    { amount: -23.45, date: '2024-01-14', description: 'STARBUCKS', merchant: 'Starbucks' },
    { amount: -89.50, date: '2024-01-15', description: 'SAFEWAY', merchant: 'Safeway' },
    { amount: 3500.00, date: '2024-01-01', description: 'PAYROLL DEPOSIT', merchant: 'Employer' },
  ];

  for (const txn of transactions) {
    pfm.importTransaction(
      userId,
      checkingAccount.accountId,
      txn.amount,
      txn.date,
      txn.description,
      txn.merchant
    );
  }
  console.log(`✓ Imported ${transactions.length} transactions`);

  // 5. View transactions
  console.log('\n5. Recent transactions:');
  const recentTxns = pfm.getTransactions(userId, { limit: 10 });
  console.table(
    recentTxns.map(t => ({
      Date: t.date,
      Merchant: t.merchantName,
      Amount: `$${t.amount.toFixed(2)}`,
      Category: pfm.categorizationService.getCategory(t.categoryId)?.name || 'Unknown',
      Confidence: `${(t.categoryConfidence * 100).toFixed(0)}%`
    }))
  );

  // 6. Spending summary
  console.log('\n6. Spending summary for January 2024:');
  const summary = pfm.getSpendingSummary(userId, '2024-01-01', '2024-01-31');
  console.log(`  Total Income: $${summary.totalIncome.toFixed(2)}`);
  console.log(`  Total Spending: $${summary.totalSpending.toFixed(2)}`);
  console.log(`  Net Cash Flow: $${summary.netCashFlow.toFixed(2)}`);
  console.log(`  Transactions: ${summary.transactionCount}`);

  console.log('\n  Spending by category:');
  for (const [categoryId, data] of Object.entries(summary.byCategory)) {
    const category = pfm.categorizationService.getCategory(parseInt(categoryId));
    console.log(`    ${category.name}: $${data.amount.toFixed(2)} (${data.count} txns)`);
  }

  // 7. Create budgets
  console.log('\n7. Creating budgets...');
  pfm.createBudget(userId, 1, 400.00, 'MONTHLY'); // Food & Dining
  pfm.createBudget(userId, 4, 200.00, 'MONTHLY'); // Transportation
  pfm.createBudget(userId, 6, 150.00, 'MONTHLY'); // Shopping
  pfm.createBudget(userId, 8, 50.00, 'MONTHLY');  // Entertainment
  console.log('✓ Created 4 budgets');

  // 8. View budget status
  console.log('\n8. Budget status:');
  const budgets = pfm.getBudgets(userId);
  console.table(
    budgets.map(b => ({
      Category: b.category.name,
      Budget: `$${b.budgetAmount.toFixed(2)}`,
      Spent: `$${b.spentAmount.toFixed(2)}`,
      Remaining: `$${b.remainingAmount.toFixed(2)}`,
      Used: `${b.percentageUsed}%`,
      Status: b.status
    }))
  );

  // 9. Check budget alerts
  console.log('\n9. Budget alerts:');
  const alerts = pfm.getBudgetAlerts(userId);
  if (alerts.length === 0) {
    console.log('  No alerts - all budgets are on track!');
  } else {
    for (const alert of alerts) {
      console.log(`  [${alert.type}] ${alert.message}`);
    }
  }

  // 10. Security demonstration
  console.log('\n10. Security demonstration:');
  const sensitiveData = 'Bank Account: 1234567890';
  console.log('  Original data:', sensitiveData);

  const encrypted = pfm.encryptionService.encrypt(sensitiveData);
  console.log('  Encrypted:', encrypted.ciphertext.substring(0, 40) + '...');

  const decrypted = pfm.encryptionService.decrypt(encrypted);
  console.log('  Decrypted:', decrypted);
  console.log('  ✓ Encryption/Decryption successful!');

  console.log('\n' + '='.repeat(70));
  console.log('Demonstration complete!');
  console.log('='.repeat(70));
}

// Run demonstration
if (require.main === module) {
  demonstrateFinancialManager();
}

// Export for use in other modules
module.exports = {
  EncryptionService,
  UserService,
  AccountAggregationService,
  TransactionService,
  CategorizationService,
  BudgetService,
  PersonalFinancialManager
};
