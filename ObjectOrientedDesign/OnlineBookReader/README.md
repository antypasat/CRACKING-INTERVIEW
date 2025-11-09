# 7.5 Online Book Reader / Czytnik Książek Online

## Problem
Design the data structures for an online book reader system.

Zaprojektuj struktury danych dla systemu czytnika książek online.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
Book
├── id: number
├── title: string
├── author: string
├── content: string[] (pages)
├── totalPages: number
├── getPage(pageNumber)
└── getInfo()

User
├── id: number
├── name: string
├── email: string
└── membershipDate: Date

Library
├── books: Map<id, Book>
├── addBook(book)
├── removeBook(bookId)
├── getBook(bookId)
├── searchByTitle(query)
├── searchByAuthor(query)
└── getAllBooks()

UserManager
├── users: Map<id, User>
├── addUser(user)
├── removeUser(userId)
├── getUser(userId)
└── findByEmail(email)

ReadingSession
├── user: User
├── book: Book
├── currentPage: number
├── bookmarks: Set<number>
├── startTime: Date
├── lastReadTime: Date
├── getCurrentPage()
├── goToPage(pageNumber)
├── nextPage()
├── previousPage()
├── addBookmark(pageNumber?)
├── removeBookmark(pageNumber)
├── getBookmarks()
├── hasBookmark(pageNumber)
├── getProgress()
└── getReadingTime()

OnlineBookReader (Main System)
├── library: Library
├── userManager: UserManager
├── activeSessions: Map<userId, ReadingSession>
├── sessionHistory: Map<userId, Map<bookId, ReadingSession>>
├── registerUser(id, name, email)
├── addBookToLibrary(id, title, author, content)
├── openBook(userId, bookId)
├── closeBook(userId)
├── getActiveSession(userId)
├── displayCurrentPage(userId)
└── getUserReadingHistory(userId)
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Separation of Concerns
- **Library:** Manages book catalog (add, remove, search)
- **UserManager:** Manages user accounts
- **ReadingSession:** Tracks individual reading progress
- **OnlineBookReader:** Orchestrates all components

### 2. Session Management
```javascript
// Sessions persist across close/reopen
activeSessions: Map<userId, ReadingSession>      // Currently reading
sessionHistory: Map<userId, Map<bookId, Session>> // All reading history

// When user opens a book:
if (userHistory.has(bookId)) {
  // Resume previous session with saved progress
  session = userHistory.get(bookId);
} else {
  // Create new session
  session = new ReadingSession(user, book);
}
```

### 3. Bookmark System
- Uses `Set<number>` for O(1) add/remove/check
- Bookmarks persist with session
- Can bookmark any page, not just current
- Sorted list retrieval for display

### 4. Progress Tracking
```javascript
getProgress() {
  return (currentPage + 1) / totalPages * 100;
}

getReadingTime() {
  return (lastReadTime - startTime) / 1000 / 60; // minutes
}
```

### 5. Content Storage
- Books store content as array of pages (strings)
- Allows O(1) page access
- Easy pagination
- Could be extended to load pages on-demand for large books

## Features Implemented / Zaimplementowane Funkcje

### User Management
- User registration with email
- User lookup by ID or email
- Membership tracking

### Library Management
- Add/remove books
- Search by title (case-insensitive)
- Search by author (case-insensitive)
- Get book by ID

### Reading Sessions
- **Navigation:** Next page, previous page, go to page
- **Bookmarks:** Add, remove, list, check existence
- **Progress:** Current page, percentage complete
- **Time tracking:** Reading duration
- **Persistence:** Save/restore session on close/reopen

### Multi-User Support
- Multiple users can read different books simultaneously
- Each user maintains independent sessions
- Session history per user per book

## Example Usage / Przykład Użycia

```javascript
// Initialize system
const reader = new OnlineBookReader();

// Add books
const book = reader.addBookToLibrary(1, 'Harry Potter', 'J.K. Rowling', pages);

// Register user
const user = reader.registerUser(1, 'Alice', 'alice@example.com');

// Open book and read
const session = reader.openBook(user.id, book.id);
console.log(reader.displayCurrentPage(user.id));

// Navigate
session.nextPage();
session.addBookmark();
session.goToPage(50);

// Close and resume later
reader.closeBook(user.id);
// ... later ...
reader.openBook(user.id, book.id); // Resumes at page 50 with bookmarks

// View history
const history = reader.getUserReadingHistory(user.id);
```

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Encapsulation:**
   - Session state hidden behind methods
   - Internal Maps protect data integrity

2. **Single Responsibility:**
   - Book: stores content
   - Library: manages catalog
   - Session: tracks reading progress
   - Reader: orchestrates system

3. **Composition:**
   - OnlineBookReader composed of Library, UserManager, Sessions
   - Session composed of User and Book

4. **Data Hiding:**
   - Private-like use of Maps
   - Controlled access through methods

5. **State Management:**
   - Sessions maintain state
   - History preserves past sessions

## Advanced Features to Add / Zaawansowane Funkcje do Dodania

1. **Notes and Highlights:**
   ```javascript
   class Annotation {
     constructor(pageNumber, startPos, endPos, text, color) { }
   }
   ```

2. **Reading Lists/Collections:**
   ```javascript
   class ReadingList {
     constructor(name, books) { }
     addBook(book) { }
     removeBook(book) { }
   }
   ```

3. **Recommendations:**
   ```javascript
   getRecommendations(userId) {
     // Based on reading history, genre preferences
   }
   ```

4. **Multi-device Sync:**
   - Cloud session storage
   - Real-time sync across devices

5. **Social Features:**
   - Share bookmarks/notes
   - Reading groups
   - Book reviews

6. **Advanced Search:**
   - Full-text search within books
   - Filter by genre, year, rating
   - "Similar books" feature

7. **Offline Reading:**
   - Download books for offline access
   - Sync when back online

## Scalability Considerations / Rozważania Skalowalności

1. **Large Books:**
   - Lazy loading of pages
   - Cache recently accessed pages

2. **Many Users:**
   - Database instead of in-memory Maps
   - Session storage in Redis/similar

3. **Large Library:**
   - Search indexing (Elasticsearch)
   - Pagination for search results

4. **Concurrent Reading:**
   - Already supported with Map-based sessions
   - Add locking for write operations if needed

## Complexity / Złożoność

- **Open book:** O(1) - Map lookup
- **Navigate pages:** O(1) - Array index access
- **Add/remove bookmark:** O(1) - Set operations
- **Search library:** O(n) - Linear scan (could add indexing)
- **Get reading history:** O(k) where k = books read by user
