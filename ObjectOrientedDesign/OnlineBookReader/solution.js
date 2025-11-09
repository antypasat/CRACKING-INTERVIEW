// 7.5 Online Book Reader - Book library system with user management
// 7.5 Czytnik Książek Online - System biblioteki książek z zarządzaniem użytkownikami

// Book class / Klasa Book
class Book {
  constructor(id, title, author, content) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.content = content; // Could be array of pages or string
    this.totalPages = content.length;
  }

  getPage(pageNumber) {
    if (pageNumber < 0 || pageNumber >= this.totalPages) {
      return null;
    }
    return this.content[pageNumber];
  }

  getInfo() {
    return `"${this.title}" by ${this.author} (${this.totalPages} pages)`;
  }
}

// User class / Klasa User
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.membershipDate = new Date();
  }
}

// Library - manages all books / Biblioteka - zarządza wszystkimi książkami
class Library {
  constructor() {
    this.books = new Map(); // id -> Book
  }

  addBook(book) {
    this.books.set(book.id, book);
  }

  removeBook(bookId) {
    return this.books.delete(bookId);
  }

  getBook(bookId) {
    return this.books.get(bookId);
  }

  searchByTitle(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    for (let book of this.books.values()) {
      if (book.title.toLowerCase().includes(lowerQuery)) {
        results.push(book);
      }
    }
    return results;
  }

  searchByAuthor(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    for (let book of this.books.values()) {
      if (book.author.toLowerCase().includes(lowerQuery)) {
        results.push(book);
      }
    }
    return results;
  }

  getAllBooks() {
    return Array.from(this.books.values());
  }
}

// UserManager - manages all users / Menedżer Użytkowników
class UserManager {
  constructor() {
    this.users = new Map(); // id -> User
  }

  addUser(user) {
    this.users.set(user.id, user);
  }

  removeUser(userId) {
    return this.users.delete(userId);
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  findByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
}

// ReadingSession - tracks user's reading progress / Sesja czytania - śledzi postęp użytkownika
class ReadingSession {
  constructor(user, book) {
    this.user = user;
    this.book = book;
    this.currentPage = 0;
    this.bookmarks = new Set(); // Set of page numbers
    this.startTime = new Date();
    this.lastReadTime = new Date();
  }

  getCurrentPage() {
    return this.currentPage;
  }

  goToPage(pageNumber) {
    if (pageNumber >= 0 && pageNumber < this.book.totalPages) {
      this.currentPage = pageNumber;
      this.lastReadTime = new Date();
      return true;
    }
    return false;
  }

  nextPage() {
    if (this.currentPage < this.book.totalPages - 1) {
      this.currentPage++;
      this.lastReadTime = new Date();
      return true;
    }
    return false;
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.lastReadTime = new Date();
      return true;
    }
    return false;
  }

  addBookmark(pageNumber = this.currentPage) {
    if (pageNumber >= 0 && pageNumber < this.book.totalPages) {
      this.bookmarks.add(pageNumber);
      return true;
    }
    return false;
  }

  removeBookmark(pageNumber) {
    return this.bookmarks.delete(pageNumber);
  }

  getBookmarks() {
    return Array.from(this.bookmarks).sort((a, b) => a - b);
  }

  hasBookmark(pageNumber) {
    return this.bookmarks.has(pageNumber);
  }

  getProgress() {
    return ((this.currentPage + 1) / this.book.totalPages * 100).toFixed(1);
  }

  getReadingTime() {
    return Math.floor((this.lastReadTime - this.startTime) / 1000 / 60); // minutes
  }
}

// OnlineBookReader - main system / Główny system
class OnlineBookReader {
  constructor() {
    this.library = new Library();
    this.userManager = new UserManager();
    this.activeSessions = new Map(); // userId -> ReadingSession
    this.sessionHistory = new Map(); // userId -> Map(bookId -> ReadingSession)
  }

  // User management / Zarządzanie użytkownikami
  registerUser(id, name, email) {
    const user = new User(id, name, email);
    this.userManager.addUser(user);
    this.sessionHistory.set(id, new Map());
    return user;
  }

  // Library management / Zarządzanie biblioteką
  addBookToLibrary(id, title, author, content) {
    const book = new Book(id, title, author, content);
    this.library.addBook(book);
    return book;
  }

  // Session management / Zarządzanie sesjami
  openBook(userId, bookId) {
    const user = this.userManager.getUser(userId);
    const book = this.library.getBook(bookId);

    if (!user || !book) {
      return null;
    }

    // Check if user has read this book before
    const userHistory = this.sessionHistory.get(userId);
    let session;

    if (userHistory.has(bookId)) {
      // Resume previous session
      session = userHistory.get(bookId);
      session.lastReadTime = new Date();
    } else {
      // Create new session
      session = new ReadingSession(user, book);
      userHistory.set(bookId, session);
    }

    this.activeSessions.set(userId, session);
    return session;
  }

  closeBook(userId) {
    const session = this.activeSessions.get(userId);
    this.activeSessions.delete(userId);
    return session;
  }

  getActiveSession(userId) {
    return this.activeSessions.get(userId);
  }

  // Display current page / Wyświetl bieżącą stronę
  displayCurrentPage(userId) {
    const session = this.activeSessions.get(userId);
    if (!session) {
      return 'No active reading session';
    }

    const content = session.book.getPage(session.currentPage);
    const isBookmarked = session.hasBookmark(session.currentPage);
    const bookmark = isBookmarked ? ' [BOOKMARKED]' : '';

    return `
Page ${session.currentPage + 1} / ${session.book.totalPages}${bookmark}
${'-'.repeat(60)}
${content}
${'-'.repeat(60)}
Progress: ${session.getProgress()}%
    `.trim();
  }

  // Get user's reading history / Pobierz historię czytania użytkownika
  getUserReadingHistory(userId) {
    const history = this.sessionHistory.get(userId);
    if (!history) return [];

    return Array.from(history.values()).map(session => ({
      book: session.book.getInfo(),
      currentPage: session.currentPage + 1,
      totalPages: session.book.totalPages,
      progress: session.getProgress(),
      bookmarks: session.getBookmarks().length,
      readingTime: session.getReadingTime()
    }));
  }
}

// Tests / Testy
console.log('='.repeat(70));
console.log('7.5 ONLINE BOOK READER');
console.log('='.repeat(70));
console.log();

// Initialize system
const reader = new OnlineBookReader();

// Add books to library
console.log('Test 1: Adding Books to Library');
console.log('-'.repeat(70));
const book1Pages = [
  'Chapter 1: The Beginning\n\nIt was a dark and stormy night...',
  'The rain pounded against the windows as Sarah sat alone...',
  'She picked up the mysterious letter that had arrived...',
  'Inside was a map leading to an ancient treasure...',
  'Chapter 2: The Journey\n\nThe next morning, Sarah set out...'
];

const book2Pages = [
  'Introduction to Algorithms\n\nThis book covers fundamental concepts...',
  'Chapter 1: Arrays and Lists\n\nArrays are contiguous memory blocks...',
  'Chapter 2: Trees and Graphs\n\nTrees are hierarchical structures...'
];

const book1 = reader.addBookToLibrary(1, 'The Mystery Letter', 'Jane Doe', book1Pages);
const book2 = reader.addBookToLibrary(2, 'Data Structures Guide', 'John Smith', book2Pages);

console.log(`Added: ${book1.getInfo()}`);
console.log(`Added: ${book2.getInfo()}`);
console.log();

// Register users
console.log('Test 2: User Registration');
console.log('-'.repeat(70));
const user1 = reader.registerUser(1, 'Alice Johnson', 'alice@example.com');
const user2 = reader.registerUser(2, 'Bob Williams', 'bob@example.com');

console.log(`Registered: ${user1.name} (${user1.email})`);
console.log(`Registered: ${user2.name} (${user2.email})`);
console.log();

// Test reading session
console.log('Test 3: Reading Session - Basic Navigation');
console.log('-'.repeat(70));
const session1 = reader.openBook(user1.id, book1.id);
console.log(`${user1.name} opened: ${book1.getInfo()}`);
console.log();

console.log('Current page:');
console.log(reader.displayCurrentPage(user1.id));
console.log();

session1.nextPage();
console.log('After next page:');
console.log(reader.displayCurrentPage(user1.id));
console.log();

// Test bookmarks
console.log('Test 4: Bookmark Management');
console.log('-'.repeat(70));
session1.addBookmark(); // Bookmark current page (page 1)
session1.goToPage(3);
session1.addBookmark(); // Bookmark page 3

console.log(`Bookmarks: ${session1.getBookmarks().join(', ')}`);
console.log();

console.log('Current page with bookmark:');
console.log(reader.displayCurrentPage(user1.id));
console.log();

// Test session persistence
console.log('Test 5: Session Persistence (Close and Resume)');
console.log('-'.repeat(70));
reader.closeBook(user1.id);
console.log('Book closed. Current page was: 3');
console.log();

// Open same book again
const resumedSession = reader.openBook(user1.id, book1.id);
console.log('Book reopened. Session resumed:');
console.log(`Current page: ${resumedSession.currentPage}`);
console.log(`Bookmarks preserved: ${resumedSession.getBookmarks().join(', ')}`);
console.log();

// Test multiple users
console.log('Test 6: Multiple Users Reading Different Books');
console.log('-'.repeat(70));
const session2 = reader.openBook(user2.id, book2.id);
console.log(`${user2.name} opened: ${book2.getInfo()}`);
console.log();

session2.nextPage();
session2.addBookmark();
console.log(`${user2.name}'s current page:`);
console.log(reader.displayCurrentPage(user2.id));
console.log();

console.log(`${user1.name}'s current page (different book):`);
console.log(reader.displayCurrentPage(user1.id));
console.log();

// Test search
console.log('Test 7: Library Search');
console.log('-'.repeat(70));
const searchResults = reader.library.searchByTitle('mystery');
console.log('Search for "mystery":');
searchResults.forEach(book => console.log(`  - ${book.getInfo()}`));
console.log();

const authorResults = reader.library.searchByAuthor('smith');
console.log('Search by author "smith":');
authorResults.forEach(book => console.log(`  - ${book.getInfo()}`));
console.log();

// Test reading history
console.log('Test 8: User Reading History');
console.log('-'.repeat(70));
const history = reader.getUserReadingHistory(user1.id);
console.log(`${user1.name}'s reading history:`);
history.forEach((record, index) => {
  console.log(`\n${index + 1}. ${record.book}`);
  console.log(`   Progress: ${record.currentPage}/${record.totalPages} (${record.progress}%)`);
  console.log(`   Bookmarks: ${record.bookmarks}`);
  console.log(`   Reading time: ${record.readingTime} minutes`);
});
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Encapsulation: Session state, bookmarks, progress tracking');
console.log('- Single Responsibility: Separate classes for Book, User, Session, Library');
console.log('- Composition: OnlineBookReader composed of Library and UserManager');
console.log('- Data hiding: Internal maps for managing sessions and history');
console.log('- State management: Session persistence across close/reopen');
console.log('='.repeat(70));
