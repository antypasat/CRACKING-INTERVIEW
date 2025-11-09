// 7.11 FileSystem - In-memory file system implementation
// 7.11 System Plików - Implementacja systemu plików w pamięci

// Base Entry class for files and directories / Bazowa klasa Entry dla plików i katalogów
class Entry {
  constructor(name, parent = null) {
    this.name = name;
    this.parent = parent;
    this.createdAt = new Date();
    this.modifiedAt = new Date();
  }

  isDirectory() {
    return false;
  }

  isFile() {
    return false;
  }

  getPath() {
    if (!this.parent) {
      return '/';
    }
    const parentPath = this.parent.getPath();
    return parentPath === '/' ? `/${this.name}` : `${parentPath}/${this.name}`;
  }

  getSize() {
    return 0;
  }

  delete() {
    if (this.parent) {
      this.parent.removeEntry(this);
    }
  }
}

// File class / Klasa File
class File extends Entry {
  constructor(name, parent = null) {
    super(name, parent);
    this.content = '';
  }

  isFile() {
    return true;
  }

  getSize() {
    return this.content.length;
  }

  read() {
    return this.content;
  }

  write(content) {
    this.content = content;
    this.modifiedAt = new Date();
  }

  append(content) {
    this.content += content;
    this.modifiedAt = new Date();
  }
}

// Directory class / Klasa Directory
class Directory extends Entry {
  constructor(name, parent = null) {
    super(name, parent);
    this.entries = new Map(); // name -> Entry
  }

  isDirectory() {
    return true;
  }

  // Get size recursively (all files in this directory and subdirectories)
  // Oblicz rozmiar rekurencyjnie (wszystkie pliki w tym katalogu i podkatalogach)
  getSize() {
    let totalSize = 0;
    for (let entry of this.entries.values()) {
      totalSize += entry.getSize();
    }
    return totalSize;
  }

  // Add entry (file or directory)
  addEntry(entry) {
    if (this.entries.has(entry.name)) {
      throw new Error(`Entry '${entry.name}' already exists in ${this.getPath()}`);
    }
    entry.parent = this;
    this.entries.set(entry.name, entry);
    this.modifiedAt = new Date();
  }

  // Remove entry
  removeEntry(entry) {
    this.entries.delete(entry.name);
    this.modifiedAt = new Date();
  }

  // Get entry by name
  getEntry(name) {
    return this.entries.get(name);
  }

  // Check if entry exists
  hasEntry(name) {
    return this.entries.has(name);
  }

  // List all entries
  list() {
    return Array.from(this.entries.values());
  }

  // List with details
  listDetailed() {
    const entries = this.list();
    return entries.map(entry => ({
      name: entry.name,
      type: entry.isDirectory() ? 'DIR' : 'FILE',
      size: entry.getSize(),
      modified: entry.modifiedAt
    }));
  }

  // Get entry count (files + directories)
  getEntryCount() {
    return this.entries.size;
  }

  // Get file count recursively
  getFileCount() {
    let count = 0;
    for (let entry of this.entries.values()) {
      if (entry.isFile()) {
        count++;
      } else if (entry.isDirectory()) {
        count += entry.getFileCount();
      }
    }
    return count;
  }

  // Get directory count recursively
  getDirectoryCount() {
    let count = 0;
    for (let entry of this.entries.values()) {
      if (entry.isDirectory()) {
        count++;
        count += entry.getDirectoryCount();
      }
    }
    return count;
  }

  // Delete all entries
  clear() {
    this.entries.clear();
    this.modifiedAt = new Date();
  }
}

// FileSystem class - Main interface / Klasa FileSystem - Główny interfejs
class FileSystem {
  constructor() {
    this.root = new Directory('root', null);
    this.currentDirectory = this.root;
  }

  // Get current working directory path
  pwd() {
    return this.currentDirectory.getPath();
  }

  // Change directory
  cd(path) {
    const target = this.resolvePath(path);
    if (!target) {
      throw new Error(`Path not found: ${path}`);
    }
    if (!target.isDirectory()) {
      throw new Error(`Not a directory: ${path}`);
    }
    this.currentDirectory = target;
    return this.currentDirectory;
  }

  // List directory contents
  ls(path = '.') {
    const target = this.resolvePath(path);
    if (!target) {
      throw new Error(`Path not found: ${path}`);
    }
    if (!target.isDirectory()) {
      return [target.name]; // If file, just return its name
    }
    return target.list().map(e => e.name);
  }

  // List with details
  ll(path = '.') {
    const target = this.resolvePath(path);
    if (!target) {
      throw new Error(`Path not found: ${path}`);
    }
    if (!target.isDirectory()) {
      return [{
        name: target.name,
        type: target.isFile() ? 'FILE' : 'DIR',
        size: target.getSize(),
        modified: target.modifiedAt
      }];
    }
    return target.listDetailed();
  }

  // Create directory
  mkdir(path) {
    const { parent, name } = this.parsePathForCreation(path);
    if (!parent) {
      throw new Error(`Parent directory not found for: ${path}`);
    }
    if (!parent.isDirectory()) {
      throw new Error(`Parent is not a directory: ${path}`);
    }
    if (parent.hasEntry(name)) {
      throw new Error(`Entry already exists: ${path}`);
    }
    const newDir = new Directory(name);
    parent.addEntry(newDir);
    return newDir;
  }

  // Create file (touch)
  touch(path) {
    const { parent, name } = this.parsePathForCreation(path);
    if (!parent) {
      throw new Error(`Parent directory not found for: ${path}`);
    }
    if (!parent.isDirectory()) {
      throw new Error(`Parent is not a directory: ${path}`);
    }

    // If file exists, just update modified time
    if (parent.hasEntry(name)) {
      const existing = parent.getEntry(name);
      if (existing.isFile()) {
        existing.modifiedAt = new Date();
        return existing;
      } else {
        throw new Error(`Cannot touch directory: ${path}`);
      }
    }

    const newFile = new File(name);
    parent.addEntry(newFile);
    return newFile;
  }

  // Write to file
  writeFile(path, content) {
    const target = this.resolvePath(path);
    if (!target) {
      // Create file if it doesn't exist
      const file = this.touch(path);
      file.write(content);
      return file;
    }
    if (!target.isFile()) {
      throw new Error(`Not a file: ${path}`);
    }
    target.write(content);
    return target;
  }

  // Read file
  readFile(path) {
    const target = this.resolvePath(path);
    if (!target) {
      throw new Error(`File not found: ${path}`);
    }
    if (!target.isFile()) {
      throw new Error(`Not a file: ${path}`);
    }
    return target.read();
  }

  // Append to file
  appendFile(path, content) {
    const target = this.resolvePath(path);
    if (!target) {
      // Create file if it doesn't exist
      const file = this.touch(path);
      file.write(content);
      return file;
    }
    if (!target.isFile()) {
      throw new Error(`Not a file: ${path}`);
    }
    target.append(content);
    return target;
  }

  // Remove file or directory
  rm(path, recursive = false) {
    const target = this.resolvePath(path);
    if (!target) {
      throw new Error(`Path not found: ${path}`);
    }
    if (target === this.root) {
      throw new Error(`Cannot delete root directory`);
    }
    if (target.isDirectory() && !recursive) {
      if (target.getEntryCount() > 0) {
        throw new Error(`Directory not empty (use recursive option): ${path}`);
      }
    }
    target.delete();

    // If we deleted current directory, go to parent
    if (target === this.currentDirectory) {
      this.currentDirectory = target.parent || this.root;
    }
  }

  // Helper method to build tree from entry
  _buildTree(entry, prefix = '', isLast = true) {
    const lines = [];
    const connector = isLast ? '└── ' : '├── ';
    const icon = entry.isDirectory() ? '📁 ' : '📄 ';
    lines.push(prefix + connector + icon + entry.name);

    if (entry.isDirectory()) {
      const entries = entry.list();
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      entries.forEach((child, index) => {
        const isLastEntry = index === entries.length - 1;
        lines.push(...this._buildTree(child, newPrefix, isLastEntry));
      });
    }

    return lines;
  }

  // Display directory tree
  tree(path = '.') {
    const target = this.resolvePath(path);
    if (!target) {
      throw new Error(`Path not found: ${path}`);
    }

    const lines = [];
    const icon = target.isDirectory() ? '📁 ' : '📄 ';
    lines.push(icon + target.name);

    if (target.isDirectory()) {
      const entries = target.list();
      entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        lines.push(...this._buildTree(entry, '', isLast));
      });
    }

    return lines.join('\n');
  }

  // Display tree from current directory
  showTree() {
    console.log(this.tree('.'));
  }

  // Resolve path to Entry (handles absolute and relative paths)
  resolvePath(path) {
    if (!path || path === '.') {
      return this.currentDirectory;
    }
    if (path === '/') {
      return this.root;
    }
    if (path === '..') {
      return this.currentDirectory.parent || this.currentDirectory;
    }

    // Absolute path
    if (path.startsWith('/')) {
      return this.resolveAbsolutePath(path);
    }

    // Relative path
    return this.resolveRelativePath(path);
  }

  // Resolve absolute path
  resolveAbsolutePath(path) {
    const parts = path.split('/').filter(p => p.length > 0);
    let current = this.root;

    for (let part of parts) {
      if (part === '.') {
        continue;
      }
      if (part === '..') {
        current = current.parent || current;
        continue;
      }
      if (!current.isDirectory()) {
        return null;
      }
      const next = current.getEntry(part);
      if (!next) {
        return null;
      }
      current = next;
    }

    return current;
  }

  // Resolve relative path
  resolveRelativePath(path) {
    const parts = path.split('/').filter(p => p.length > 0);
    let current = this.currentDirectory;

    for (let part of parts) {
      if (part === '.') {
        continue;
      }
      if (part === '..') {
        current = current.parent || current;
        continue;
      }
      if (!current.isDirectory()) {
        return null;
      }
      const next = current.getEntry(part);
      if (!next) {
        return null;
      }
      current = next;
    }

    return current;
  }

  // Parse path for creation (returns parent directory and entry name)
  parsePathForCreation(path) {
    if (path === '/') {
      throw new Error('Cannot create root directory');
    }

    const parts = path.split('/').filter(p => p.length > 0);
    const name = parts.pop();

    let parent;
    if (path.startsWith('/')) {
      // Absolute path
      parent = parts.length > 0 ? this.resolveAbsolutePath('/' + parts.join('/')) : this.root;
    } else {
      // Relative path
      parent = parts.length > 0 ? this.resolveRelativePath(parts.join('/')) : this.currentDirectory;
    }

    return { parent, name };
  }

  // Get file system statistics
  getStats() {
    return {
      totalFiles: this.root.getFileCount(),
      totalDirectories: this.root.getDirectoryCount(),
      totalSize: this.root.getSize(),
      currentPath: this.pwd()
    };
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.11 FILESYSTEM - IN-MEMORY FILE SYSTEM');
console.log('='.repeat(70));
console.log();

console.log('Test 1: Basic Directory Operations');
console.log('-'.repeat(70));
const fs = new FileSystem();
console.log(`Current directory: ${fs.pwd()}`);

fs.mkdir('home');
fs.mkdir('var');
fs.mkdir('etc');
console.log('Created directories: home, var, etc');
console.log(`Contents of /: ${fs.ls().join(', ')}`);
console.log();

console.log('Test 2: Navigation (cd)');
console.log('-'.repeat(70));
fs.cd('home');
console.log(`Changed to: ${fs.pwd()}`);

fs.mkdir('user1');
fs.mkdir('user2');
console.log(`Contents of ${fs.pwd()}: ${fs.ls().join(', ')}`);

fs.cd('user1');
console.log(`Changed to: ${fs.pwd()}`);

fs.cd('..');
console.log(`Back to: ${fs.pwd()}`);

fs.cd('/');
console.log(`Back to root: ${fs.pwd()}`);
console.log();

console.log('Test 3: File Creation and Content');
console.log('-'.repeat(70));
fs.cd('/home/user1');
console.log(`Current: ${fs.pwd()}`);

fs.touch('readme.txt');
fs.writeFile('readme.txt', 'Hello, World!\nThis is a test file.');
console.log('Created and wrote to readme.txt');
console.log(`Content: "${fs.readFile('readme.txt')}"`);

fs.appendFile('readme.txt', '\nAppended line.');
console.log(`After append: "${fs.readFile('readme.txt')}"`);
console.log(`File size: ${fs.resolvePath('readme.txt').getSize()} bytes`);
console.log();

console.log('Test 4: Multiple Files and Directories');
console.log('-'.repeat(70));
fs.cd('/home/user1');
fs.mkdir('documents');
fs.mkdir('downloads');
fs.mkdir('pictures');

fs.cd('documents');
fs.writeFile('doc1.txt', 'Document 1 content');
fs.writeFile('doc2.txt', 'Document 2 content with more text');
fs.writeFile('notes.txt', 'Important notes');

fs.cd('..');
console.log(`Contents of ${fs.pwd()}: ${fs.ls().join(', ')}`);
console.log();

console.log('Test 5: Detailed Listing (ll)');
console.log('-'.repeat(70));
fs.cd('/home/user1');
const details = fs.ll();
console.log('Detailed listing:');
details.forEach(entry => {
  const type = entry.type.padEnd(4);
  const size = entry.size.toString().padStart(6);
  const name = entry.name;
  console.log(`  ${type} ${size} bytes  ${name}`);
});
console.log();

console.log('Test 6: Recursive Size Calculation');
console.log('-'.repeat(70));
fs.cd('/home');
const homeDir = fs.currentDirectory;
console.log(`Total size of /home: ${homeDir.getSize()} bytes`);
console.log(`Files in /home: ${homeDir.getFileCount()}`);
console.log(`Directories in /home: ${homeDir.getDirectoryCount()}`);
console.log();

console.log('Test 7: Tree Structure Display');
console.log('-'.repeat(70));
fs.cd('/');
console.log('File system tree:');
fs.showTree();
console.log();

console.log('Test 8: File Deletion');
console.log('-'.repeat(70));
fs.cd('/home/user1/documents');
console.log(`Before deletion: ${fs.ls().join(', ')}`);

fs.rm('doc1.txt');
console.log(`After deleting doc1.txt: ${fs.ls().join(', ')}`);
console.log();

console.log('Test 9: Directory Deletion (Recursive)');
console.log('-'.repeat(70));
fs.cd('/home/user1');
console.log(`Before deletion: ${fs.ls().join(', ')}`);

try {
  fs.rm('documents'); // Should fail - directory not empty
} catch (e) {
  console.log(`Expected error: ${e.message}`);
}

fs.rm('documents', true); // Recursive delete
console.log(`After recursive delete: ${fs.ls().join(', ')}`);
console.log();

console.log('Test 10: Absolute and Relative Paths');
console.log('-'.repeat(70));
fs.cd('/home/user2');
fs.writeFile('/home/user1/downloads/file1.txt', 'File in user1 downloads');
fs.writeFile('../user1/downloads/file2.txt', 'Another file');

fs.cd('/home/user1/downloads');
console.log(`Files in ${fs.pwd()}: ${fs.ls().join(', ')}`);

const content1 = fs.readFile('/home/user1/downloads/file1.txt');
const content2 = fs.readFile('file2.txt'); // Relative path
console.log(`file1.txt: "${content1}"`);
console.log(`file2.txt: "${content2}"`);
console.log();

console.log('Test 11: File System Statistics');
console.log('-'.repeat(70));
fs.cd('/');
const stats = fs.getStats();
console.log('File System Statistics:');
console.log(`  Total files: ${stats.totalFiles}`);
console.log(`  Total directories: ${stats.totalDirectories}`);
console.log(`  Total size: ${stats.totalSize} bytes`);
console.log(`  Current path: ${stats.currentPath}`);
console.log();

console.log('Test 12: Error Handling');
console.log('-'.repeat(70));
try {
  fs.cd('/nonexistent');
} catch (e) {
  console.log(`✓ Error caught: ${e.message}`);
}

try {
  fs.readFile('/home/missing.txt');
} catch (e) {
  console.log(`✓ Error caught: ${e.message}`);
}

try {
  fs.mkdir('/home/user1'); // Already exists
} catch (e) {
  console.log(`✓ Error caught: ${e.message}`);
}

try {
  fs.writeFile('/etc', 'content'); // etc is a directory
} catch (e) {
  console.log(`✓ Error caught: ${e.message}`);
}
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Inheritance: File and Directory extend Entry');
console.log('- Encapsulation: Internal state managed within classes');
console.log('- Polymorphism: getSize() behaves differently for files/directories');
console.log('- Abstraction: FileSystem provides clean interface for operations');
console.log('- Recursion: Tree traversal, size calculation, deletion');
console.log('='.repeat(70));
