// 7.7 Chat Server - Real-time messaging system with private/group chats
// 7.7 Serwer Czatu - System wiadomości w czasie rzeczywistym z czatami prywatnymi/grupowymi

// User status / Status użytkownika
const UserStatus = {
  ONLINE: 'ONLINE',
  AWAY: 'AWAY',
  OFFLINE: 'OFFLINE'
};

// Message status / Status wiadomości
const MessageStatus = {
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ'
};

// User class / Klasa User
class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.status = UserStatus.OFFLINE;
    this.lastSeen = new Date();
  }

  setStatus(status) {
    this.status = status;
    if (status === UserStatus.OFFLINE) {
      this.lastSeen = new Date();
    }
  }

  isOnline() {
    return this.status === UserStatus.ONLINE;
  }
}

// Message class / Klasa Message
class Message {
  constructor(id, senderId, content, timestamp = new Date()) {
    this.id = id;
    this.senderId = senderId;
    this.content = content;
    this.timestamp = timestamp;
    this.status = MessageStatus.SENT;
    this.deliveredTo = new Set(); // Track delivery per recipient
    this.readBy = new Set();
  }

  markDelivered(userId) {
    this.deliveredTo.add(userId);
  }

  markRead(userId) {
    this.readBy.add(userId);
  }

  isDeliveredTo(userId) {
    return this.deliveredTo.has(userId);
  }

  isReadBy(userId) {
    return this.readBy.has(userId);
  }
}

// Conversation base class / Podstawowa klasa konwersacji
class Conversation {
  constructor(id) {
    this.id = id;
    this.messages = [];
    this.participants = new Set(); // Set of user IDs
    this.createdAt = new Date();
  }

  addParticipant(userId) {
    this.participants.add(userId);
  }

  removeParticipant(userId) {
    this.participants.delete(userId);
  }

  hasParticipant(userId) {
    return this.participants.has(userId);
  }

  addMessage(message) {
    this.messages.push(message);
    // Keep messages sorted by timestamp
    this.messages.sort((a, b) => a.timestamp - b.timestamp);
  }

  getMessages(limit = null, offset = 0) {
    const msgs = [...this.messages].reverse(); // Most recent first
    if (limit) {
      return msgs.slice(offset, offset + limit);
    }
    return msgs.slice(offset);
  }

  getMessageCount() {
    return this.messages.length;
  }

  getLastMessage() {
    return this.messages[this.messages.length - 1] || null;
  }
}

// Private chat between two users / Czat prywatny między dwoma użytkownikami
class PrivateChat extends Conversation {
  constructor(id, user1Id, user2Id) {
    super(id);
    this.addParticipant(user1Id);
    this.addParticipant(user2Id);
  }

  getOtherUser(userId) {
    for (let participantId of this.participants) {
      if (participantId !== userId) {
        return participantId;
      }
    }
    return null;
  }
}

// Group chat with multiple users / Czat grupowy z wieloma użytkownikami
class GroupChat extends Conversation {
  constructor(id, name, creatorId) {
    super(id);
    this.name = name;
    this.creatorId = creatorId;
    this.admins = new Set([creatorId]);
    this.addParticipant(creatorId);
  }

  setName(name) {
    this.name = name;
  }

  addAdmin(userId) {
    if (this.hasParticipant(userId)) {
      this.admins.add(userId);
      return true;
    }
    return false;
  }

  isAdmin(userId) {
    return this.admins.has(userId);
  }

  canModify(userId) {
    return this.isAdmin(userId) || userId === this.creatorId;
  }
}

// Chat Server - main system / Główny system
class ChatServer {
  constructor() {
    this.users = new Map(); // userId -> User
    this.conversations = new Map(); // conversationId -> Conversation
    this.userConversations = new Map(); // userId -> Set of conversationIds
    this.offlineMessages = new Map(); // userId -> Message[]
    this.nextMessageId = 1;
    this.nextConversationId = 1;
  }

  // User management / Zarządzanie użytkownikami
  registerUser(username, email) {
    const userId = this.users.size + 1;
    const user = new User(userId, username, email);
    this.users.set(userId, user);
    this.userConversations.set(userId, new Set());
    this.offlineMessages.set(userId, []);
    return user;
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  setUserStatus(userId, status) {
    const user = this.getUser(userId);
    if (user) {
      const wasOffline = !user.isOnline();
      user.setStatus(status);

      // If user came online, deliver offline messages
      if (wasOffline && status === UserStatus.ONLINE) {
        this.deliverOfflineMessages(userId);
      }
    }
  }

  // Private chat management / Zarządzanie czatem prywatnym
  createPrivateChat(user1Id, user2Id) {
    // Check if chat already exists
    const existing = this.findPrivateChat(user1Id, user2Id);
    if (existing) {
      return existing;
    }

    const chatId = this.nextConversationId++;
    const chat = new PrivateChat(chatId, user1Id, user2Id);
    this.conversations.set(chatId, chat);
    this.userConversations.get(user1Id).add(chatId);
    this.userConversations.get(user2Id).add(chatId);
    return chat;
  }

  findPrivateChat(user1Id, user2Id) {
    const user1Chats = this.userConversations.get(user1Id);
    if (!user1Chats) return null;

    for (let chatId of user1Chats) {
      const chat = this.conversations.get(chatId);
      if (chat instanceof PrivateChat &&
          chat.hasParticipant(user1Id) &&
          chat.hasParticipant(user2Id)) {
        return chat;
      }
    }
    return null;
  }

  // Group chat management / Zarządzanie czatem grupowym
  createGroupChat(name, creatorId) {
    const chatId = this.nextConversationId++;
    const chat = new GroupChat(chatId, name, creatorId);
    this.conversations.set(chatId, chat);
    this.userConversations.get(creatorId).add(chatId);
    return chat;
  }

  addUserToGroup(groupId, userId, addedBy) {
    const group = this.conversations.get(groupId);
    if (!group || !(group instanceof GroupChat)) {
      return false;
    }

    // Check permissions
    if (!group.canModify(addedBy)) {
      return false;
    }

    group.addParticipant(userId);
    this.userConversations.get(userId).add(groupId);
    return true;
  }

  removeUserFromGroup(groupId, userId, removedBy) {
    const group = this.conversations.get(groupId);
    if (!group || !(group instanceof GroupChat)) {
      return false;
    }

    // Check permissions
    if (!group.canModify(removedBy) && removedBy !== userId) {
      return false;
    }

    group.removeParticipant(userId);
    this.userConversations.get(userId).delete(groupId);
    return true;
  }

  // Message sending and delivery / Wysyłanie i dostarczanie wiadomości
  sendMessage(conversationId, senderId, content) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation || !conversation.hasParticipant(senderId)) {
      return null;
    }

    const messageId = this.nextMessageId++;
    const message = new Message(messageId, senderId, content);
    conversation.addMessage(message);

    // Deliver to online participants
    for (let participantId of conversation.participants) {
      if (participantId === senderId) continue;

      const user = this.getUser(participantId);
      if (user && user.isOnline()) {
        // Immediate delivery
        message.markDelivered(participantId);
      } else {
        // Queue for offline delivery
        this.offlineMessages.get(participantId).push({
          message,
          conversationId
        });
      }
    }

    return message;
  }

  deliverOfflineMessages(userId) {
    const messages = this.offlineMessages.get(userId);
    if (!messages || messages.length === 0) {
      return [];
    }

    // Mark all messages as delivered
    for (let { message, conversationId } of messages) {
      message.markDelivered(userId);
    }

    const delivered = [...messages];
    this.offlineMessages.set(userId, []); // Clear queue
    return delivered;
  }

  markMessageAsRead(conversationId, messageId, userId) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation || !conversation.hasParticipant(userId)) {
      return false;
    }

    const message = conversation.messages.find(m => m.id === messageId);
    if (message) {
      message.markRead(userId);
      return true;
    }
    return false;
  }

  // Get conversations for user / Pobierz konwersacje użytkownika
  getUserConversations(userId) {
    const conversationIds = this.userConversations.get(userId);
    if (!conversationIds) return [];

    return Array.from(conversationIds)
      .map(id => this.conversations.get(id))
      .filter(conv => conv !== undefined)
      .sort((a, b) => {
        const aLast = a.getLastMessage();
        const bLast = b.getLastMessage();
        if (!aLast) return 1;
        if (!bLast) return -1;
        return bLast.timestamp - aLast.timestamp;
      });
  }

  // Get unread message count / Pobierz liczbę nieprzeczytanych wiadomości
  getUnreadCount(userId, conversationId) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation || !conversation.hasParticipant(userId)) {
      return 0;
    }

    return conversation.messages.filter(m =>
      m.senderId !== userId && !m.isReadBy(userId)
    ).length;
  }

  // Statistics / Statystyki
  getServerStats() {
    const onlineUsers = Array.from(this.users.values())
      .filter(u => u.isOnline()).length;

    const totalMessages = Array.from(this.conversations.values())
      .reduce((sum, conv) => sum + conv.getMessageCount(), 0);

    const privateChats = Array.from(this.conversations.values())
      .filter(c => c instanceof PrivateChat).length;

    const groupChats = Array.from(this.conversations.values())
      .filter(c => c instanceof GroupChat).length;

    return {
      totalUsers: this.users.size,
      onlineUsers,
      totalConversations: this.conversations.size,
      privateChats,
      groupChats,
      totalMessages
    };
  }
}

// Tests / Testy
console.log('='.repeat(70));
console.log('7.7 CHAT SERVER');
console.log('='.repeat(70));
console.log();

const server = new ChatServer();

console.log('Test 1: User Registration');
console.log('-'.repeat(70));
const alice = server.registerUser('Alice', 'alice@example.com');
const bob = server.registerUser('Bob', 'bob@example.com');
const charlie = server.registerUser('Charlie', 'charlie@example.com');
const diana = server.registerUser('Diana', 'diana@example.com');

console.log(`Registered: ${alice.username} (ID: ${alice.id})`);
console.log(`Registered: ${bob.username} (ID: ${bob.id})`);
console.log(`Registered: ${charlie.username} (ID: ${charlie.id})`);
console.log(`Registered: ${diana.username} (ID: ${diana.id})`);
console.log();

console.log('Test 2: Private Chat and Messaging');
console.log('-'.repeat(70));
server.setUserStatus(alice.id, UserStatus.ONLINE);
server.setUserStatus(bob.id, UserStatus.ONLINE);

const privateChat = server.createPrivateChat(alice.id, bob.id);
console.log(`Created private chat between ${alice.username} and ${bob.username} (ID: ${privateChat.id})`);
console.log();

const msg1 = server.sendMessage(privateChat.id, alice.id, 'Hi Bob!');
const msg2 = server.sendMessage(privateChat.id, bob.id, 'Hey Alice! How are you?');
const msg3 = server.sendMessage(privateChat.id, alice.id, "I'm good, thanks!");

console.log('Messages sent:');
console.log(`  ${alice.username}: "${msg1.content}"`);
console.log(`  ${bob.username}: "${msg2.content}"`);
console.log(`  ${alice.username}: "${msg3.content}"`);
console.log();

console.log('Message delivery status:');
console.log(`  Message 1 delivered to Bob: ${msg1.isDeliveredTo(bob.id)}`);
console.log(`  Message 2 delivered to Alice: ${msg2.isDeliveredTo(alice.id)}`);
console.log();

console.log('Test 3: Offline Messages');
console.log('-'.repeat(70));
server.setUserStatus(charlie.id, UserStatus.OFFLINE);

const charlieChat = server.createPrivateChat(alice.id, charlie.id);
const offlineMsg = server.sendMessage(charlieChat.id, alice.id, 'Hey Charlie, are you there?');

console.log(`${alice.username} sent message to offline ${charlie.username}`);
console.log(`Message delivered to Charlie: ${offlineMsg.isDeliveredTo(charlie.id)}`);
console.log(`Message queued for offline delivery`);
console.log();

console.log(`${charlie.username} comes online...`);
server.setUserStatus(charlie.id, UserStatus.ONLINE);
console.log(`Message now delivered to Charlie: ${offlineMsg.isDeliveredTo(charlie.id)}`);
console.log();

console.log('Test 4: Group Chat');
console.log('-'.repeat(70));
const groupChat = server.createGroupChat('Project Team', alice.id);
console.log(`Created group chat: "${groupChat.name}" (ID: ${groupChat.id})`);
console.log(`Creator: ${alice.username}`);
console.log();

server.addUserToGroup(groupChat.id, bob.id, alice.id);
server.addUserToGroup(groupChat.id, charlie.id, alice.id);
server.addUserToGroup(groupChat.id, diana.id, alice.id);

console.log('Participants added:');
console.log(`  - ${bob.username}`);
console.log(`  - ${charlie.username}`);
console.log(`  - ${diana.username}`);
console.log(`Total participants: ${groupChat.participants.size}`);
console.log();

console.log('Sending group messages...');
server.setUserStatus(diana.id, UserStatus.ONLINE);

const groupMsg1 = server.sendMessage(groupChat.id, alice.id, 'Welcome to the team chat!');
const groupMsg2 = server.sendMessage(groupChat.id, bob.id, 'Thanks for adding me!');
const groupMsg3 = server.sendMessage(groupChat.id, diana.id, 'Excited to be here!');

console.log(`  ${alice.username}: "${groupMsg1.content}"`);
console.log(`  ${bob.username}: "${groupMsg2.content}"`);
console.log(`  ${diana.username}: "${groupMsg3.content}"`);
console.log();

console.log('Test 5: Message Read Receipts');
console.log('-'.repeat(70));
server.markMessageAsRead(privateChat.id, msg1.id, bob.id);
server.markMessageAsRead(privateChat.id, msg2.id, alice.id);

console.log(`Message 1 read by Bob: ${msg1.isReadBy(bob.id)}`);
console.log(`Message 2 read by Alice: ${msg2.isReadBy(alice.id)}`);
console.log(`Message 3 read by Bob: ${msg3.isReadBy(bob.id)}`);
console.log();

console.log('Test 6: Unread Message Count');
console.log('-'.repeat(70));
const unreadPrivate = server.getUnreadCount(bob.id, privateChat.id);
const unreadGroup = server.getUnreadCount(charlie.id, groupChat.id);

console.log(`${bob.username}'s unread in private chat with ${alice.username}: ${unreadPrivate}`);
console.log(`${charlie.username}'s unread in group chat: ${unreadGroup}`);
console.log();

console.log('Test 7: User Conversations List');
console.log('-'.repeat(70));
const aliceConversations = server.getUserConversations(alice.id);

console.log(`${alice.username}'s conversations (${aliceConversations.length}):`);
aliceConversations.forEach(conv => {
  const lastMsg = conv.getLastMessage();
  const lastMsgPreview = lastMsg ? `"${lastMsg.content.substring(0, 30)}..."` : 'No messages';

  if (conv instanceof PrivateChat) {
    const otherUserId = conv.getOtherUser(alice.id);
    const otherUser = server.getUser(otherUserId);
    console.log(`  - Private with ${otherUser.username}: ${lastMsgPreview}`);
  } else if (conv instanceof GroupChat) {
    console.log(`  - Group "${conv.name}" (${conv.participants.size} members): ${lastMsgPreview}`);
  }
});
console.log();

console.log('Test 8: Server Statistics');
console.log('-'.repeat(70));
const stats = server.getServerStats();

console.log('Server Statistics:');
console.log(`  Total Users: ${stats.totalUsers}`);
console.log(`  Online Users: ${stats.onlineUsers}`);
console.log(`  Total Conversations: ${stats.totalConversations}`);
console.log(`  - Private Chats: ${stats.privateChats}`);
console.log(`  - Group Chats: ${stats.groupChats}`);
console.log(`  Total Messages: ${stats.totalMessages}`);
console.log();

console.log('='.repeat(70));
console.log('OOP Design Principles Demonstrated:');
console.log('- Inheritance: PrivateChat and GroupChat extend Conversation');
console.log('- Encapsulation: Message delivery, status tracking, offline queues');
console.log('- Single Responsibility: User, Message, Conversation, Server');
console.log('- Composition: Server composed of Users, Conversations, Messages');
console.log('- Scalability considerations: Message ordering, offline handling');
console.log('='.repeat(70));
console.log();

console.log('='.repeat(70));
console.log('HARDEST PROBLEMS IN CHAT SYSTEMS:');
console.log('='.repeat(70));
console.log();

console.log('1. SCALABILITY:');
console.log('   - Millions of concurrent users');
console.log('   - Solution: Sharding users across servers, load balancing');
console.log('   - Message queues (Kafka, RabbitMQ) for async processing');
console.log('   - Microservices architecture (separate auth, messaging, presence)');
console.log();

console.log('2. MESSAGE ORDERING:');
console.log('   - Ensuring correct order across distributed servers');
console.log('   - Clock synchronization issues (network delays)');
console.log('   - Solution: Vector clocks, Lamport timestamps');
console.log('   - Each message gets sequence number per conversation');
console.log('   - Clients reorder based on sequence, not arrival time');
console.log();

console.log('3. OFFLINE MESSAGES:');
console.log('   - Storing messages for offline users');
console.log('   - Efficient retrieval when user comes online');
console.log('   - Solution: Message queue per user (Redis, database)');
console.log('   - Pagination for large backlogs');
console.log('   - Push notifications to wake up mobile apps');
console.log();

console.log('4. REAL-TIME DELIVERY:');
console.log('   - WebSockets for persistent connections');
console.log('   - Server push vs client polling');
console.log('   - Connection management at scale');
console.log();

console.log('5. CONSISTENCY:');
console.log('   - Multi-device sync (phone, laptop, web)');
console.log('   - Read receipts across devices');
console.log('   - Eventually consistent systems');
console.log();

console.log('6. GROUP CHAT AT SCALE:');
console.log('   - Large groups (1000+ members)');
console.log('   - Message fanout optimization');
console.log('   - Presence updates (who\'s online)');
console.log('='.repeat(70));
