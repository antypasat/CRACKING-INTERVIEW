# 7.3 Jukebox / Szafa Grająca

## Problem
Design a musical jukebox using object-oriented principles. The jukebox should support functionality like selecting songs, creating playlists, playing, pausing, skipping, and shuffling music.

Zaprojektuj szafę grającą wykorzystując zasady programowania obiektowego. Szafa powinna obsługiwać funkcjonalności takie jak wybieranie utworów, tworzenie playlist, odtwarzanie, pauzowanie, przewijanie i mieszanie muzyki.

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
Song
├── id: int
├── title: string
├── artist: string
├── album: string
├── durationSeconds: int
├── playCount: int
├── play()
├── getDuration() → string
└── toString()

Playlist
├── id: int
├── name: string
├── creator: string
├── songs: Song[]
├── addSong(song) → boolean
├── removeSong(songId) → boolean
├── getSong(index) → Song
├── shuffle()
└── getTotalDuration() → int

User
├── id: int
├── name: string
├── playlists: Playlist[]
├── createPlaylist(id, name) → Playlist
└── getPlaylist(id) → Playlist

MusicPlayer
├── state: PlayerState (STOPPED/PLAYING/PAUSED)
├── currentSong: Song
├── currentPlaylist: Playlist
├── currentIndex: int
├── repeat: boolean
├── shuffle: boolean
├── play(song, playlist, index)
├── pause() → boolean
├── resume() → boolean
├── stop()
├── next() → Song
├── previous() → Song
├── setRepeat(enabled)
└── setShuffle(enabled)

Display
├── currentSong: Song
├── currentPlaylist: Playlist
├── state: PlayerState
├── update(song, playlist, state)
└── show()

Jukebox (main controller)
├── songLibrary: Map<id, Song>
├── playlists: Map<id, Playlist>
├── users: Map<id, User>
├── player: MusicPlayer
├── display: Display
├── currentUser: User
├── addSong(song)
├── getSong(id) → Song
├── searchSongs(query) → Song[]
├── addUser(user)
├── createPlaylist(id, name, userId) → Playlist
├── playSong(songId)
├── playPlaylist(playlistId)
├── pause() / resume() / stop()
├── next() / previous()
└── getPopularSongs(limit) → Song[]
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Separation of Concerns
- **Song:** Represents music metadata
- **Playlist:** Collection of songs with ordering
- **MusicPlayer:** Controls playback state and logic
- **Display:** UI representation (decoupled from player)
- **Jukebox:** Main controller coordinating all components

### 2. Player State Management
```javascript
PlayerState = {
  STOPPED: 'Stopped',   // No song loaded
  PLAYING: 'Playing',   // Currently playing
  PAUSED: 'Paused'      // Paused (can resume)
}
```

### 3. Playlist Navigation
```javascript
next():
  - Increment currentIndex
  - If end reached:
    - If repeat ON → wrap to start
    - If repeat OFF → stop playback
  - Play next song

previous():
  - Decrement currentIndex
  - If start reached:
    - If repeat ON → wrap to end
    - If repeat OFF → stay at start
  - Play previous song
```

### 4. Shuffle Implementation
- Fisher-Yates algorithm for random shuffling
- Shuffles playlist order when enabled
- Maintains shuffled order during playback

### 5. Library Management
- Uses Map for O(1) lookups by ID
- Search supports title, artist, album queries
- Tracks play count for popularity

## Example Usage / Przykład Użycia

```javascript
// Create jukebox
const jukebox = new Jukebox();

// Add songs to library
const song1 = new Song(1, 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 354);
jukebox.addSong(song1);

// Create user and playlist
const user = new User(1, 'Alice');
jukebox.addUser(user);
const playlist = jukebox.createPlaylist(1, 'Rock Classics', 1);
playlist.addSong(song1);

// Play playlist
jukebox.playPlaylist(1);  // Start playing

// Playback controls
jukebox.pause();          // Pause
jukebox.resume();         // Resume
jukebox.next();           // Next song
jukebox.previous();       // Previous song

// Features
jukebox.setRepeat(true);  // Enable repeat
jukebox.setShuffle(true); // Enable shuffle

// Search
const results = jukebox.searchSongs('Queen');
```

## Features Implemented / Zaimplementowane Funkcje

### Core Playback
1. **Play:** Start playing a song or playlist
2. **Pause/Resume:** Pause and resume playback
3. **Stop:** Stop playback completely
4. **Next/Previous:** Navigate through playlist

### Playlist Management
1. **Create Playlist:** Users create named playlists
2. **Add/Remove Songs:** Modify playlist contents
3. **Shuffle:** Randomize playlist order
4. **Duration Calculation:** Total playlist length

### Library Features
1. **Song Library:** Central repository of all songs
2. **Search:** Find songs by title, artist, or album
3. **Play Count:** Track song popularity
4. **Popular Songs:** Get most played songs

### User Features
1. **Multiple Users:** Support different user accounts
2. **Personal Playlists:** Each user has own playlists
3. **Current User:** Track active user

### Playback Modes
1. **Repeat Mode:** Loop playlist continuously
2. **Shuffle Mode:** Random song order
3. **Normal Mode:** Sequential playback

## Player Control Flow / Przepływ Kontroli Odtwarzacza

### Play Song
```
User selects song
  ↓
Jukebox.playSong(songId)
  ↓
Get song from library
  ↓
MusicPlayer.play(song)
  ↓
Update state to PLAYING
  ↓
Increment song.playCount
  ↓
Update Display
```

### Next Song
```
User presses next
  ↓
MusicPlayer.next()
  ↓
Check if playlist loaded
  ↓
Increment currentIndex
  ↓
Check if end reached
  ├─ Yes + Repeat ON → index = 0
  ├─ Yes + Repeat OFF → stop()
  └─ No → play next song
```

## OOP Principles Applied / Zastosowane Zasady OOP

1. **Encapsulation:**
   - Player state hidden behind methods
   - Library management encapsulated in Jukebox

2. **Abstraction:**
   - Display abstraction for UI layer
   - Player provides simple interface for complex playback logic

3. **Single Responsibility:**
   - Song: Metadata only
   - Playlist: Song collection
   - Player: Playback control
   - Display: UI representation
   - Jukebox: System coordination

4. **Composition:**
   - Jukebox composed of Player + Display + Library
   - Playlist composed of Songs
   - User has Playlists

5. **State Pattern:**
   - PlayerState enum for clear state transitions
   - Different behavior based on state (PLAYING/PAUSED/STOPPED)

## Extensions / Rozszerzenia

Easy to extend for:
- **Queue System:** Add songs to play queue
- **Smart Playlists:** Auto-generated based on criteria
- **Recommendations:** Suggest songs based on listening history
- **Equalizer:** Audio settings control
- **Volume Control:** Adjust playback volume
- **Lyrics Display:** Show song lyrics
- **Album Art:** Display cover images
- **Social Features:** Share playlists, collaborative playlists
- **Radio Mode:** Play similar songs continuously
- **Favorites:** Quick access to favorite songs
- **Recently Played:** Track listening history
- **Cross-fade:** Smooth transitions between songs

## Complexity / Złożoność

### Time Complexity
- **Play song:** O(1) - Map lookup
- **Search songs:** O(n) where n = total songs
- **Add to playlist:** O(1) amortized
- **Shuffle playlist:** O(m) where m = songs in playlist
- **Next/Previous:** O(1)
- **Get popular songs:** O(n log n) - sorting by play count

### Space Complexity
- **Song library:** O(n) where n = total songs
- **Playlists:** O(p × m) where p = playlists, m = avg songs per playlist
- **Users:** O(u) where u = total users
- **Player state:** O(1)

## Testing Coverage / Pokrycie Testowe

1. ✅ Song library creation and management
2. ✅ User management and playlist creation
3. ✅ Basic playback - single song
4. ✅ Pause and resume functionality
5. ✅ Playing complete playlist
6. ✅ Next and previous navigation
7. ✅ Repeat mode (wrap around)
8. ✅ Shuffle mode (randomization)
9. ✅ Search functionality
10. ✅ Popular songs tracking

## Real-World Applications / Aplikacje w Świecie Rzeczywistym

This design pattern is similar to:
- **Spotify:** Playlist management, playback control
- **Apple Music:** Library organization, user playlists
- **YouTube Music:** Search, recommendations
- **SoundCloud:** User-generated playlists
- **Physical Jukeboxes:** Song selection, queue management
