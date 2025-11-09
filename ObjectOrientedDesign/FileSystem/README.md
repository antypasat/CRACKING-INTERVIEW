# 7.11 FileSystem / System Plików

## Problem
Design an in-memory file system that supports basic file and directory operations including navigation, creation, deletion, reading, and writing. The system should handle hierarchical directory structures and provide a Unix-like interface.

Zaprojektuj system plików w pamięci, który obsługuje podstawowe operacje na plikach i katalogach, w tym nawigację, tworzenie, usuwanie, odczyt i zapis. System powinien obsługiwać hierarchiczne struktury katalogów i udostępniać interfejs podobny do Unix.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
Entry (abstract base)
├── name: string
├── parent: Directory
├── createdAt: Date
├── modifiedAt: Date
├── isDirectory() → boolean
├── isFile() → boolean
├── getPath() → string
├── getSize() → int
└── delete()

File extends Entry
├── content: string
├── isFile() → true
├── getSize() → content.length
├── read() → string
├── write(content)
└── append(content)

Directory extends Entry
├── entries: Map<name, Entry>
├── isDirectory() → true
├── getSize() → recursive sum of all files
├── addEntry(entry)
├── removeEntry(entry)
├── getEntry(name) → Entry
├── hasEntry(name) → boolean
├── list() → Entry[]
├── listDetailed() → object[]
├── getEntryCount() → int
├── getFileCount() → int (recursive)
├── getDirectoryCount() → int (recursive)
└── clear()

FileSystem
├── root: Directory
├── currentDirectory: Directory
├── pwd() → string
├── cd(path) → Directory
├── ls(path) → string[]
├── ll(path) → object[] (detailed listing)
├── mkdir(path) → Directory
├── touch(path) → File
├── writeFile(path, content) → File
├── readFile(path) → string
├── appendFile(path, content) → File
├── rm(path, recursive) → void
├── tree(path) → string (tree display)
├── showTree() → void
├── resolvePath(path) → Entry
├── resolveAbsolutePath(path) → Entry
├── resolveRelativePath(path) → Entry
├── parsePathForCreation(path) → {parent, name}
└── getStats() → object
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Entry Hierarchy
- **Entry** is the abstract base class for both files and directories
- Provides common functionality: name, parent reference, timestamps, path calculation
- Polymorphic methods allow uniform handling of files and directories

```javascript
class Entry {
  getPath() {
    if (!this.parent) return '/';
    const parentPath = this.parent.getPath();
    return parentPath === '/' ? `/${this.name}` : `${parentPath}/${this.name}`;
  }
}
```

### 2. Recursive Size Calculation
Directories calculate size recursively by summing all contained files:

```javascript
getSize() {
  let totalSize = 0;
  for (let entry of this.entries.values()) {
    totalSize += entry.getSize(); // Polymorphic call
  }
  return totalSize;
}
```

### 3. Path Resolution
Supports both absolute and relative paths:

| Path Type | Example | Resolution |
|-----------|---------|------------|
| Absolute | `/home/user/file.txt` | From root |
| Relative | `documents/doc.txt` | From current directory |
| Parent | `..` | Parent directory |
| Current | `.` | Current directory |

```javascript
resolvePath(path) {
  if (path === '.') return this.currentDirectory;
  if (path === '/') return this.root;
  if (path === '..') return this.currentDirectory.parent;
  if (path.startsWith('/')) return this.resolveAbsolutePath(path);
  return this.resolveRelativePath(path);
}
```

### 4. Parent References
- Each Entry maintains reference to parent Directory
- Enables upward navigation (`cd ..`)
- Facilitates full path reconstruction
- Allows deletion from parent

### 5. Map-Based Storage
Directory uses `Map<name, Entry>` for O(1) lookups:
- Fast entry retrieval by name
- Automatic uniqueness enforcement
- Efficient iteration

## Example Usage / Przykład Użycia

```javascript
// Create file system
const fs = new FileSystem();

// Create directories
fs.mkdir('home');
fs.mkdir('home/user');
fs.mkdir('home/user/documents');

// Navigate
fs.cd('/home/user');
console.log(fs.pwd()); // → /home/user

// Create and write file
fs.touch('readme.txt');
fs.writeFile('readme.txt', 'Hello, World!');

// Read file
const content = fs.readFile('readme.txt'); // → "Hello, World!"

// List contents
const files = fs.ls(); // → ['readme.txt', 'documents']
const details = fs.ll(); // → Detailed listing with sizes

// Append to file
fs.appendFile('readme.txt', '\nNew line');

// Get size
const dir = fs.resolvePath('/home');
console.log(dir.getSize()); // → Total bytes in /home

// Display tree
fs.showTree();
// 📁 user
// ├── 📄 readme.txt
// └── 📁 documents

// Delete file
fs.rm('readme.txt');

// Delete directory (recursive)
fs.rm('documents', true);

// Statistics
const stats = fs.getStats();
// → { totalFiles, totalDirectories, totalSize, currentPath }
```

## Features Implemented / Zaimplementowane Funkcje

### 1. Navigation Commands
- **pwd:** Print working directory
- **cd:** Change directory (absolute/relative paths)
- **ls:** List directory contents
- **ll:** Detailed listing with size and type

### 2. File Operations
- **touch:** Create file or update timestamp
- **writeFile:** Write content to file (create if doesn't exist)
- **readFile:** Read file content
- **appendFile:** Append content to file

### 3. Directory Operations
- **mkdir:** Create directory
- **rm:** Remove file or directory
- **rm -r:** Recursive directory deletion
- **tree:** Display directory tree structure

### 4. Path Support
- **Absolute paths:** `/home/user/file.txt`
- **Relative paths:** `documents/doc.txt`
- **Parent navigation:** `..`
- **Current directory:** `.`

### 5. Metadata & Statistics
- **Creation timestamp:** Tracked for all entries
- **Modification timestamp:** Updated on changes
- **Size calculation:** Files (content length), Directories (recursive sum)
- **Counts:** File count, directory count (recursive)

### 6. Tree Visualization
Displays hierarchical structure:
```
📁 root
├── 📁 home
│   ├── 📁 user1
│   │   ├── 📄 readme.txt
│   │   └── 📁 documents
│   │       ├── 📄 doc1.txt
│   │       └── 📄 doc2.txt
│   └── 📁 user2
└── 📁 var
```

## OOP Principles Applied / Zastosowane Zasady OOP

### 1. Inheritance
- **File** and **Directory** extend **Entry**
- Share common functionality: name, parent, timestamps, path
- Specialize behavior: File stores content, Directory stores entries

### 2. Polymorphism
- **getSize():** Files return content length, Directories return recursive sum
- **isFile() / isDirectory():** Type checking without instanceof
- Uniform handling in FileSystem methods

### 3. Encapsulation
- Entry state (name, parent, dates) hidden behind methods
- Directory entries stored in private Map
- File content managed internally

### 4. Abstraction
- **Entry** provides abstract interface
- **FileSystem** hides complex path resolution logic
- Clean public API for all operations

### 5. Composition
- FileSystem composed of Entry hierarchy
- Directory composed of multiple Entries
- Tree structure through parent-child relationships

### 6. Single Responsibility
- **Entry:** Base entity with common properties
- **File:** Content storage and manipulation
- **Directory:** Entry collection management
- **FileSystem:** Navigation and high-level operations

## Edge Cases Handled / Obsługa Przypadków Brzegowych

### 1. Path Validation
- Non-existent paths → Error
- Invalid parent paths → Error
- Root directory protection → Cannot delete root

### 2. Type Checking
- Writing to directory → Error
- Reading from directory → Error
- cd to file → Error

### 3. Duplicate Prevention
- Creating existing entry → Error
- Automatic uniqueness in Map

### 4. Directory Deletion
- Non-empty directory without recursive flag → Error
- Recursive flag deletes all contents
- Current directory deleted → Move to parent

### 5. File Creation
- touch on existing file → Update timestamp only
- writeFile to non-existent → Create file
- Parent directory must exist

### 6. Empty Content
- Files can have empty content
- Empty directories allowed
- Zero-size entries handled correctly

## Complexity / Złożoność

### Time Complexity
- **cd(path):** O(d) where d = depth of path
- **ls():** O(1) for immediate children
- **mkdir/touch:** O(d) for path resolution + O(1) insertion
- **readFile/writeFile:** O(d) for path resolution + O(1) operation
- **rm(path):** O(d) for path resolution
- **rm(path, recursive):** O(n) where n = total entries in subtree
- **getSize() recursive:** O(n) where n = files in subtree
- **tree():** O(n) where n = all entries in subtree

### Space Complexity
- **Total space:** O(n) where n = total entries
- **Path storage:** O(d) for each entry (parent references)
- **File content:** O(c) where c = content length
- **Overall:** O(n + c)

## Extensions / Rozszerzenia

### Easy to extend for:

#### Access Control
- **Permissions:** Read, write, execute for owner/group/others
- **Ownership:** User and group ownership
- **chmod:** Change permissions
- **chown:** Change ownership

#### Advanced Features
- **Symbolic links:** Link to other files/directories
- **Hard links:** Multiple references to same file
- **File locking:** Prevent concurrent modifications
- **Quotas:** Limit disk usage per user/directory

#### Search & Filtering
- **find:** Search by name, type, size, date
- **grep:** Search file contents
- **locate:** Fast path lookup with indexing

#### Metadata
- **Extended attributes:** Custom metadata
- **MIME types:** File type detection
- **Checksums:** File integrity verification
- **Versioning:** Track file changes over time

#### Performance
- **Caching:** Recently accessed entries
- **Indexing:** Fast path lookups
- **Compression:** Compress file contents
- **Lazy loading:** Load directory contents on demand

#### Real-world Features
- **Mount points:** Virtual file systems
- **Journaling:** Transaction log for recovery
- **Snapshots:** Point-in-time copies
- **Replication:** Distribute across servers

## Testing Coverage / Pokrycie Testowe

1. ✅ Basic directory creation and listing
2. ✅ Navigation (cd) with absolute/relative paths
3. ✅ File creation and content management
4. ✅ Multiple files and nested directories
5. ✅ Detailed listing with metadata
6. ✅ Recursive size calculation
7. ✅ Tree structure visualization
8. ✅ File deletion
9. ✅ Directory deletion (recursive and non-recursive)
10. ✅ Absolute and relative path resolution
11. ✅ File system statistics
12. ✅ Error handling (invalid paths, type mismatches, duplicates)

## Real-World Applications / Aplikacje w Świecie Rzeczywistym

This design pattern applies to:

- **Operating Systems:** Linux/Unix file systems (ext4, XFS, NTFS)
- **Version Control:** Git's tree structure for commits
- **Cloud Storage:** Dropbox, Google Drive hierarchies
- **Virtual File Systems:** Docker container file systems
- **In-Memory FS:** tmpfs, ramfs for temporary storage
- **Embedded Systems:** Flash file systems (JFFS2, YAFFS)
- **Database Systems:** Hierarchical data organization
- **IDEs:** Project explorer, file navigation

## Implementation Notes / Uwagi Implementacyjne

### 1. Memory Management
- In-memory implementation - all data lost on exit
- For persistence: serialize/deserialize to JSON or database

### 2. Thread Safety
- Current implementation is single-threaded
- For concurrent access: add locks/semaphores
- Consider read-write locks for optimization

### 3. Path Normalization
- Handles `.` and `..` in paths
- Filters empty path segments
- Normalizes multiple slashes

### 4. Performance Considerations
- Map-based storage for O(1) lookups
- Lazy computation where possible
- Recursive operations cached where beneficial

### 5. Error Messages
- Descriptive error messages for debugging
- Clear indication of what went wrong
- Path context in error messages
