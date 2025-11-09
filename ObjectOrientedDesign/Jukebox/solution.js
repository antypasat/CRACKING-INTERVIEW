// 7.3 Jukebox - Music player with songs, playlists, and playback control
// 7.3 Jukebox - Odtwarzacz muzyki z utworami, playlistami i kontrolą odtwarzania

// Enum for player state / Enum dla stanu odtwarzacza
const PlayerState = {
  STOPPED: 'Stopped',
  PLAYING: 'Playing',
  PAUSED: 'Paused'
};

// Song class representing a music track / Klasa Song reprezentująca utwór muzyczny
class Song {
  constructor(id, title, artist, album, durationSeconds) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.durationSeconds = durationSeconds;
    this.playCount = 0;
  }

  play() {
    this.playCount++;
  }

  getDuration() {
    const minutes = Math.floor(this.durationSeconds / 60);
    const seconds = this.durationSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  toString() {
    return `"${this.title}" by ${this.artist} (${this.getDuration()})`;
  }
}

// Playlist class / Klasa Playlist
class Playlist {
  constructor(id, name, creator) {
    this.id = id;
    this.name = name;
    this.creator = creator;
    this.songs = [];
    this.createdDate = new Date();
  }

  addSong(song) {
    if (!this.songs.find(s => s.id === song.id)) {
      this.songs.push(song);
      return true;
    }
    return false;
  }

  removeSong(songId) {
    const index = this.songs.findIndex(s => s.id === songId);
    if (index !== -1) {
      this.songs.splice(index, 1);
      return true;
    }
    return false;
  }

  getSong(index) {
    if (index >= 0 && index < this.songs.length) {
      return this.songs[index];
    }
    return null;
  }

  shuffle() {
    // Fisher-Yates shuffle
    for (let i = this.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
    }
  }

  getTotalDuration() {
    return this.songs.reduce((total, song) => total + song.durationSeconds, 0);
  }

  toString() {
    const duration = Math.floor(this.getTotalDuration() / 60);
    return `Playlist "${this.name}" by ${this.creator} (${this.songs.length} songs, ${duration} min)`;
  }
}

// User class / Klasa User
class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.playlists = [];
  }

  createPlaylist(playlistId, name) {
    const playlist = new Playlist(playlistId, name, this.name);
    this.playlists.push(playlist);
    return playlist;
  }

  getPlaylist(playlistId) {
    return this.playlists.find(p => p.id === playlistId);
  }

  toString() {
    return `User: ${this.name} (${this.playlists.length} playlists)`;
  }
}

// Display class for showing current playback info / Klasa Display do wyświetlania informacji o odtwarzaniu
class Display {
  constructor() {
    this.currentSong = null;
    this.currentPlaylist = null;
    this.state = PlayerState.STOPPED;
  }

  update(song, playlist, state) {
    this.currentSong = song;
    this.currentPlaylist = playlist;
    this.state = state;
  }

  show() {
    console.log('\n' + '━'.repeat(70));
    console.log('♪ JUKEBOX DISPLAY');
    console.log('━'.repeat(70));

    if (this.state === PlayerState.STOPPED) {
      console.log('Status: Stopped');
    } else {
      console.log(`Status: ${this.state}`);
      if (this.currentSong) {
        console.log(`Now ${this.state.toLowerCase()}: ${this.currentSong}`);
      }
      if (this.currentPlaylist) {
        console.log(`From: ${this.currentPlaylist.name}`);
      }
    }
    console.log('━'.repeat(70));
  }
}

// MusicPlayer class - handles playback control / Klasa MusicPlayer - obsługuje kontrolę odtwarzania
class MusicPlayer {
  constructor() {
    this.state = PlayerState.STOPPED;
    this.currentSong = null;
    this.currentPlaylist = null;
    this.currentIndex = -1;
    this.repeat = false;
    this.shuffle = false;
  }

  play(song, playlist = null, index = 0) {
    this.currentSong = song;
    this.currentPlaylist = playlist;
    this.currentIndex = index;
    this.state = PlayerState.PLAYING;

    if (song) {
      song.play();
      console.log(`▶ Playing: ${song}`);
    }
  }

  pause() {
    if (this.state === PlayerState.PLAYING) {
      this.state = PlayerState.PAUSED;
      console.log(`⏸ Paused: ${this.currentSong}`);
      return true;
    }
    return false;
  }

  resume() {
    if (this.state === PlayerState.PAUSED) {
      this.state = PlayerState.PLAYING;
      console.log(`▶ Resumed: ${this.currentSong}`);
      return true;
    }
    return false;
  }

  stop() {
    console.log(`⏹ Stopped`);
    this.state = PlayerState.STOPPED;
    this.currentSong = null;
    this.currentPlaylist = null;
    this.currentIndex = -1;
  }

  next() {
    if (!this.currentPlaylist) {
      console.log('⏭ No playlist loaded');
      return null;
    }

    let nextIndex = this.currentIndex + 1;

    if (nextIndex >= this.currentPlaylist.songs.length) {
      if (this.repeat) {
        nextIndex = 0;
      } else {
        console.log('⏭ End of playlist');
        this.stop();
        return null;
      }
    }

    const nextSong = this.currentPlaylist.getSong(nextIndex);
    if (nextSong) {
      console.log('⏭ Next track');
      this.play(nextSong, this.currentPlaylist, nextIndex);
    }
    return nextSong;
  }

  previous() {
    if (!this.currentPlaylist) {
      console.log('⏮ No playlist loaded');
      return null;
    }

    let prevIndex = this.currentIndex - 1;

    if (prevIndex < 0) {
      if (this.repeat) {
        prevIndex = this.currentPlaylist.songs.length - 1;
      } else {
        console.log('⏮ Start of playlist');
        return null;
      }
    }

    const prevSong = this.currentPlaylist.getSong(prevIndex);
    if (prevSong) {
      console.log('⏮ Previous track');
      this.play(prevSong, this.currentPlaylist, prevIndex);
    }
    return prevSong;
  }

  setRepeat(enabled) {
    this.repeat = enabled;
    console.log(`🔁 Repeat: ${enabled ? 'ON' : 'OFF'}`);
  }

  setShuffle(enabled) {
    this.shuffle = enabled;
    console.log(`🔀 Shuffle: ${enabled ? 'ON' : 'OFF'}`);
    if (enabled && this.currentPlaylist) {
      this.currentPlaylist.shuffle();
    }
  }

  getState() {
    return {
      state: this.state,
      currentSong: this.currentSong,
      currentPlaylist: this.currentPlaylist,
      currentIndex: this.currentIndex,
      repeat: this.repeat,
      shuffle: this.shuffle
    };
  }
}

// Jukebox - main class that manages everything
// Jukebox - główna klasa zarządzająca wszystkim
class Jukebox {
  constructor() {
    this.songLibrary = new Map(); // id -> Song
    this.playlists = new Map(); // id -> Playlist
    this.users = new Map(); // id -> User
    this.player = new MusicPlayer();
    this.display = new Display();
    this.currentUser = null;
  }

  // Library management / Zarządzanie biblioteką
  addSong(song) {
    this.songLibrary.set(song.id, song);
  }

  getSong(songId) {
    return this.songLibrary.get(songId);
  }

  searchSongs(query) {
    query = query.toLowerCase();
    const results = [];
    for (let song of this.songLibrary.values()) {
      if (song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query)) {
        results.push(song);
      }
    }
    return results;
  }

  // User management / Zarządzanie użytkownikami
  addUser(user) {
    this.users.set(user.id, user);
  }

  setCurrentUser(userId) {
    this.currentUser = this.users.get(userId);
  }

  // Playlist management / Zarządzanie playlistami
  createPlaylist(playlistId, name, userId) {
    const user = this.users.get(userId);
    if (user) {
      const playlist = user.createPlaylist(playlistId, name);
      this.playlists.set(playlistId, playlist);
      return playlist;
    }
    return null;
  }

  getPlaylist(playlistId) {
    return this.playlists.get(playlistId);
  }

  // Playback control / Kontrola odtwarzania
  playSong(songId) {
    const song = this.getSong(songId);
    if (song) {
      this.player.play(song);
      this.updateDisplay();
    }
  }

  playPlaylist(playlistId) {
    const playlist = this.getPlaylist(playlistId);
    if (playlist && playlist.songs.length > 0) {
      console.log(`\n📀 Loading playlist: ${playlist.name}`);
      this.player.play(playlist.songs[0], playlist, 0);
      this.updateDisplay();
    }
  }

  pause() {
    this.player.pause();
    this.updateDisplay();
  }

  resume() {
    this.player.resume();
    this.updateDisplay();
  }

  stop() {
    this.player.stop();
    this.updateDisplay();
  }

  next() {
    this.player.next();
    this.updateDisplay();
  }

  previous() {
    this.player.previous();
    this.updateDisplay();
  }

  setRepeat(enabled) {
    this.player.setRepeat(enabled);
  }

  setShuffle(enabled) {
    this.player.setShuffle(enabled);
  }

  updateDisplay() {
    const state = this.player.getState();
    this.display.update(state.currentSong, state.currentPlaylist, state.state);
  }

  showDisplay() {
    this.display.show();
  }

  // Get popular songs / Pobierz popularne utwory
  getPopularSongs(limit = 10) {
    return Array.from(this.songLibrary.values())
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit);
  }
}

// Tests
console.log('='.repeat(70));
console.log('7.3 JUKEBOX - MUSIC PLAYER SYSTEM');
console.log('='.repeat(70));

console.log('\nTest 1: Creating Song Library');
console.log('-'.repeat(70));
const jukebox = new Jukebox();

// Add songs
const songs = [
  new Song(1, 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 354),
  new Song(2, 'Stairway to Heaven', 'Led Zeppelin', 'Led Zeppelin IV', 482),
  new Song(3, 'Hotel California', 'Eagles', 'Hotel California', 391),
  new Song(4, 'Imagine', 'John Lennon', 'Imagine', 183),
  new Song(5, 'Smells Like Teen Spirit', 'Nirvana', 'Nevermind', 301),
  new Song(6, 'Billie Jean', 'Michael Jackson', 'Thriller', 294),
  new Song(7, 'Sweet Child O\' Mine', 'Guns N\' Roses', 'Appetite for Destruction', 356),
  new Song(8, 'Yesterday', 'The Beatles', 'Help!', 123)
];

songs.forEach(song => jukebox.addSong(song));
console.log(`Added ${songs.length} songs to library`);
songs.forEach(song => console.log(`  ${song}`));

console.log('\nTest 2: User Management and Playlist Creation');
console.log('-'.repeat(70));
const user1 = new User(1, 'Alice');
const user2 = new User(2, 'Bob');
jukebox.addUser(user1);
jukebox.addUser(user2);
jukebox.setCurrentUser(1);

const rockPlaylist = jukebox.createPlaylist(1, 'Classic Rock', 1);
rockPlaylist.addSong(songs[0]); // Bohemian Rhapsody
rockPlaylist.addSong(songs[1]); // Stairway to Heaven
rockPlaylist.addSong(songs[2]); // Hotel California
rockPlaylist.addSong(songs[6]); // Sweet Child O' Mine

console.log(rockPlaylist.toString());
console.log('Songs in playlist:');
rockPlaylist.songs.forEach((song, idx) => console.log(`  ${idx + 1}. ${song}`));

const chillPlaylist = jukebox.createPlaylist(2, 'Chill Vibes', 2);
chillPlaylist.addSong(songs[3]); // Imagine
chillPlaylist.addSong(songs[7]); // Yesterday

console.log(`\n${chillPlaylist.toString()}`);

console.log('\nTest 3: Basic Playback - Single Song');
console.log('-'.repeat(70));
jukebox.playSong(1); // Bohemian Rhapsody
jukebox.showDisplay();

console.log('\nTest 4: Pause and Resume');
console.log('-'.repeat(70));
jukebox.pause();
jukebox.showDisplay();
console.log();
jukebox.resume();
jukebox.showDisplay();

console.log('\nTest 5: Playing a Playlist');
console.log('-'.repeat(70));
jukebox.playPlaylist(1);
jukebox.showDisplay();

console.log('\nTest 6: Next and Previous');
console.log('-'.repeat(70));
jukebox.next();
jukebox.showDisplay();
console.log();
jukebox.next();
jukebox.showDisplay();
console.log();
jukebox.previous();
jukebox.showDisplay();

console.log('\nTest 7: Repeat Mode');
console.log('-'.repeat(70));
jukebox.setRepeat(true);
// Skip to last song
jukebox.playPlaylist(1);
for (let i = 0; i < rockPlaylist.songs.length - 1; i++) {
  jukebox.next();
}
jukebox.showDisplay();
console.log('\nTrying next (should wrap to beginning with repeat):');
jukebox.next();
jukebox.showDisplay();

console.log('\nTest 8: Shuffle Mode');
console.log('-'.repeat(70));
const testPlaylist = jukebox.createPlaylist(3, 'Shuffle Test', 1);
songs.forEach(song => testPlaylist.addSong(song));
console.log('Original order:');
testPlaylist.songs.forEach((song, idx) => console.log(`  ${idx + 1}. ${song.title}`));

jukebox.setShuffle(true);
jukebox.playPlaylist(3);
console.log('\nShuffled order:');
testPlaylist.songs.forEach((song, idx) => console.log(`  ${idx + 1}. ${song.title}`));

console.log('\nTest 9: Search Songs');
console.log('-'.repeat(70));
const searchResults = jukebox.searchSongs('Beatles');
console.log(`Search results for "Beatles": ${searchResults.length} found`);
searchResults.forEach(song => console.log(`  ${song}`));

const searchResults2 = jukebox.searchSongs('imagine');
console.log(`\nSearch results for "imagine": ${searchResults2.length} found`);
searchResults2.forEach(song => console.log(`  ${song}`));

console.log('\nTest 10: Popular Songs (by play count)');
console.log('-'.repeat(70));
// Songs have been played during tests
const popular = jukebox.getPopularSongs(5);
console.log('Top 5 most played songs:');
popular.forEach((song, idx) => {
  console.log(`  ${idx + 1}. ${song.title} - ${song.playCount} plays`);
});

console.log('\n' + '='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Encapsulation: Player state and controls encapsulated in MusicPlayer');
console.log('- Abstraction: Jukebox provides high-level interface to music system');
console.log('- Single Responsibility: Song, Playlist, User, Player separated');
console.log('- Composition: Jukebox composed of Player, Display, Library');
console.log('- State Management: PlayerState enum for clear state tracking');
console.log('='.repeat(70));
