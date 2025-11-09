# 7.7 Chat Server / Serwer Czatu

## Problem
Explain how you would design a chat server. In particular, provide details about the various backend components, classes, and methods. What would be the hardest problems to solve?

Wyjaśnij jak zaprojektowałbyś serwer czatu. W szczególności podaj szczegóły różnych komponentów backendu, klas i metod. Jakie byłyby najtrudniejsze problemy do rozwiązania?

## OOP Design / Projekt OOP

### Core Classes / Podstawowe Klasy

```
UserStatus (Enum)
├── ONLINE
├── AWAY
└── OFFLINE

MessageStatus (Enum)
├── SENT
├── DELIVERED
└── READ

User
├── id: number
├── username: string
├── email: string
├── status: UserStatus
├── lastSeen: Date
├── setStatus(status)
└── isOnline() → boolean

Message
├── id: number
├── senderId: number
├── content: string
├── timestamp: Date
├── status: MessageStatus
├── deliveredTo: Set<userId>
├── readBy: Set<userId>
├── markDelivered(userId)
├── markRead(userId)
├── isDeliveredTo(userId) → boolean
└── isReadBy(userId) → boolean

Conversation (Abstract Base)
├── id: number
├── messages: Message[]
├── participants: Set<userId>
├── createdAt: Date
├── addParticipant(userId)
├── removeParticipant(userId)
├── hasParticipant(userId) → boolean
├── addMessage(message)
├── getMessages(limit?, offset?) → Message[]
├── getMessageCount() → number
└── getLastMessage() → Message

PrivateChat extends Conversation
├── (2 participants exactly)
└── getOtherUser(userId) → userId

GroupChat extends Conversation
├── name: string
├── creatorId: number
├── admins: Set<userId>
├── setName(name)
├── addAdmin(userId)
├── isAdmin(userId) → boolean
└── canModify(userId) → boolean

ChatServer (Main System)
├── users: Map<id, User>
├── conversations: Map<id, Conversation>
├── userConversations: Map<userId, Set<conversationId>>
├── offlineMessages: Map<userId, Message[]>
├── registerUser(username, email) → User
├── setUserStatus(userId, status)
├── createPrivateChat(user1Id, user2Id) → PrivateChat
├── createGroupChat(name, creatorId) → GroupChat
├── addUserToGroup(groupId, userId, addedBy) → boolean
├── sendMessage(conversationId, senderId, content) → Message
├── deliverOfflineMessages(userId) → Message[]
├── markMessageAsRead(conversationId, messageId, userId)
├── getUserConversations(userId) → Conversation[]
├── getUnreadCount(userId, conversationId) → number
└── getServerStats() → object
```

## Key Design Decisions / Kluczowe Decyzje Projektowe

### 1. Conversation Hierarchy

```javascript
Conversation (base class)
├── PrivateChat (exactly 2 participants)
└── GroupChat (2+ participants, has admins, name)
```

**Benefits:**
- Shared message handling logic
- Different permission models
- Easy to extend (e.g., Channels, Broadcast)

### 2. Message Delivery Tracking

```javascript
class Message {
  deliveredTo: Set<userId>  // Per-recipient delivery
  readBy: Set<userId>        // Per-recipient read status

  markDelivered(userId) {
    this.deliveredTo.add(userId);
  }
}
```

**Why Sets?**
- O(1) add/check
- No duplicates
- Works for both 1:1 and group chats

### 3. Offline Message Queue

```javascript
offlineMessages: Map<userId, Message[]>

// When sending:
if (user.isOnline()) {
  deliverImmediately();
} else {
  queueForOfflineDelivery();
}

// When user comes online:
deliverAllQueuedMessages();
```

### 4. User-Conversation Index

```javascript
userConversations: Map<userId, Set<conversationId>>

// Quick lookup: "What conversations is user X in?"
// O(1) instead of scanning all conversations
```

### 5. Message Ordering

```javascript
addMessage(message) {
  this.messages.push(message);
  // Keep sorted by timestamp
  this.messages.sort((a, b) => a.timestamp - b.timestamp);
}
```

## Features Implemented / Zaimplementowane Funkcje

### User Management
- Registration with unique ID
- Online/Away/Offline status
- Last seen tracking

### Private Chats
- 1:1 messaging
- Automatic chat creation if doesn't exist
- Finding existing chat between two users

### Group Chats
- Named groups
- Admin permissions
- Add/remove participants
- Creator and admin roles

### Message Delivery
- **Immediate:** For online users
- **Queued:** For offline users
- **Bulk delivery:** When user comes online
- Per-recipient tracking (important for groups)

### Message Status
- **Sent:** Message created
- **Delivered:** Received by recipient's device
- **Read:** Opened by recipient

### Read Receipts
- Track who read each message
- Works for both private and group chats
- Unread count per conversation

### Conversation List
- All conversations for a user
- Sorted by most recent message
- Private and group chats mixed

## Architecture / Architektura

### Simple Implementation (Current)
```
ChatServer (single instance)
├── In-memory storage (Maps)
├── Synchronous message delivery
└── Works for small scale (<1000 users)
```

### Production Architecture (Scalable)

```
┌─────────────┐
│   Clients   │ (Web, Mobile, Desktop)
└──────┬──────┘
       │ WebSocket / HTTP
       ▼
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│  API   │ │  API   │ (Multiple instances)
│ Server │ │ Server │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         ▼
┌──────────────────┐
│  Message Queue   │ (Kafka, RabbitMQ)
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Message │ │Presence│ (Microservices)
│Service │ │Service │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         ▼
┌──────────────────┐
│    Database      │ (PostgreSQL, Cassandra)
│   - Users        │
│   - Messages     │
│   - Conversations│
└──────────────────┘
         │
         ▼
┌──────────────────┐
│   Cache Layer    │ (Redis)
│   - Online users │
│   - Recent msgs  │
│   - Unread counts│
└──────────────────┘
```

## Hardest Problems / Najtrudniejsze Problemy

### 1. SCALABILITY
**Problem:** Millions of concurrent users, billions of messages

**Solutions:**
```javascript
// Sharding users across servers
userId % numServers → Server assignment

// Consistent hashing for conversations
conversationId → Server ring position

// Message queues for async processing
Producer → Kafka → Consumer workers

// Read replicas for message history
Write to master, read from replicas
```

**Technologies:**
- **Load Balancing:** Nginx, HAProxy
- **Message Queues:** Kafka, RabbitMQ, SQS
- **Databases:** Cassandra (writes), PostgreSQL (reads)
- **Cache:** Redis, Memcached

### 2. MESSAGE ORDERING
**Problem:** Distributed servers, clock skew, network delays

**Example:**
```
Alice sends: "What time?" at 10:00:01.500
Bob sends:   "Let's meet"  at 10:00:01.499

Due to network delays, Bob's message might arrive first!
```

**Solutions:**

**A) Lamport Timestamps:**
```javascript
class Message {
  logicalClock: number;  // Incremented per message
  senderId: string;
}

// Order by:
// 1. Logical clock
// 2. Sender ID (tiebreaker)
```

**B) Vector Clocks:**
```javascript
// Each user maintains counter for all participants
vectorClock: Map<userId, number>

// Message includes entire vector
// Allows detecting concurrent messages
```

**C) Sequence Numbers per Conversation:**
```javascript
class Conversation {
  nextSequence: number = 1;

  addMessage(message) {
    message.sequence = this.nextSequence++;
    // Clients sort by sequence, not timestamp
  }
}
```

**D) Hybrid Clock (HLC):**
- Combines physical time + logical counter
- Used by systems like CockroachDB

### 3. OFFLINE MESSAGES
**Problem:** Storing and delivering messages to offline users

**Challenges:**
- User offline for days → thousands of messages
- Multiple devices → which one delivered?
- Efficient retrieval without loading all messages

**Solutions:**

**A) Message Queue per User:**
```javascript
// Redis list
LPUSH user:123:offline message_id
LRANGE user:123:offline 0 99  // Get first 100

// When delivered:
LTRIM user:123:offline 100 -1  // Remove delivered
```

**B) Database with Index:**
```sql
CREATE TABLE offline_messages (
  user_id INT,
  message_id INT,
  conversation_id INT,
  timestamp TIMESTAMP,
  INDEX (user_id, timestamp)
);

-- Get offline messages
SELECT * FROM offline_messages
WHERE user_id = 123
ORDER BY timestamp
LIMIT 100;
```

**C) Push Notifications:**
```javascript
// Wake up mobile app when offline message arrives
sendPushNotification(userId, {
  title: "New message from Alice",
  body: "Hey, are you there?",
  badge: unreadCount
});
```

### 4. REAL-TIME DELIVERY
**Problem:** Push messages to clients immediately

**Solutions:**

**A) WebSockets:**
```javascript
// Persistent bidirectional connection
const ws = new WebSocket('wss://chat.example.com');

// Server can push anytime
ws.send(JSON.stringify({ type: 'new_message', data: message }));
```

**B) Server-Sent Events (SSE):**
```javascript
// One-way server → client
const eventSource = new EventSource('/events');
eventSource.onmessage = (e) => {
  const message = JSON.parse(e.data);
};
```

**C) Long Polling (Fallback):**
```javascript
// Client requests, server holds until message
async function poll() {
  const messages = await fetch('/poll?since=' + lastMessageId);
  handleMessages(messages);
  poll(); // Repeat
}
```

### 5. GROUP CHAT AT SCALE
**Problem:** Large groups (1000+ members), message fanout

**Challenge:**
```javascript
// Naive: Copy message to 1000 inboxes
for (let userId of group.participants) {
  deliverMessage(userId, message);
}
// → 1000 writes per message!
```

**Solutions:**

**A) Shared Storage:**
```javascript
// Single message stored once
// Users read from shared conversation
// Only track "last read" per user

conversations/123/messages/456
users/789/last_read = 456
```

**B) Fanout on Read:**
```javascript
// Write once to group conversation
// Fanout only when user opens app

getUserMessages(userId) {
  // Find all groups user is in
  // Get new messages from each
  // Combine and sort
}
```

**C) Hybrid Approach:**
```javascript
// Small groups (<100): Fanout on write
// Large groups (>100): Fanout on read
// Critical messages: Both (with dedup)
```

### 6. CONSISTENCY
**Problem:** Multi-device sync, read receipts

**Example:**
```
User reads message on phone
Phone sends read receipt
Server updates database
Laptop should show as "read"
```

**Solutions:**

**A) Event Broadcasting:**
```javascript
// When phone marks as read:
broadcast({
  type: 'message_read',
  userId: 123,
  messageId: 456,
  conversationId: 789
});

// All user's devices receive and update UI
```

**B) Eventual Consistency:**
```javascript
// Devices sync periodically
// Accept temporary inconsistency
// Trade-off: Consistency vs Latency
```

## Performance Optimizations / Optymalizacje Wydajności

### 1. Caching
```javascript
// Redis cache
- Online users: O(1) lookup
- Recent messages per conversation: Avoid DB
- Unread counts: Increment/decrement, not count
```

### 2. Pagination
```javascript
getMessages(limit = 50, offset = 0) {
  // Don't load entire history
  // Load newest 50, then load more on scroll
}
```

### 3. Database Indexes
```sql
CREATE INDEX idx_conv_messages ON messages(conversation_id, timestamp);
CREATE INDEX idx_user_convs ON user_conversations(user_id);
CREATE INDEX idx_offline ON offline_messages(user_id, delivered);
```

### 4. Batch Operations
```javascript
// Instead of N queries:
for (let userId of participants) {
  getUserStatus(userId);
}

// Single query:
getUserStatuses(participantIds);
```

## Security Considerations / Bezpieczeństwo

1. **Authentication:** JWT tokens, OAuth
2. **Authorization:** Check user in conversation before sending
3. **Encryption:** TLS for transport, E2E for content
4. **Rate Limiting:** Prevent spam
5. **Input Validation:** Sanitize message content

## Extensions / Rozszerzenia

1. **Media Messages:** Images, videos, files
2. **Reactions:** Emoji reactions to messages
3. **Message Editing/Deletion**
4. **Typing Indicators**
5. **Voice/Video Calls:** WebRTC
6. **Message Search:** Elasticsearch
7. **Mentions:** @username notifications
8. **Threads:** Replies to specific messages

## Complexity / Złożoność

### Time Complexity
- **Send message:** O(P) where P = participants (group chat)
- **Get messages:** O(log M + K) where M = total messages, K = messages retrieved
- **Mark as read:** O(1)
- **Get unread count:** O(M) in worst case, O(1) with caching

### Space Complexity
- **Messages:** O(N × M) where N = users, M = avg messages per user
- **Conversations:** O(C) where C = total conversations
- **Offline queue:** O(U × O) where U = offline users, O = avg offline messages

## Real-World Examples / Przykłady z Rzeczywistości

- **WhatsApp:** Signal Protocol (E2E encryption), Erlang backend
- **Slack:** WebSockets, Electron client, REST API
- **Discord:** Elixir backend, WebSockets, voice channels
- **Telegram:** MTProto protocol, cloud-based, multiple data centers
