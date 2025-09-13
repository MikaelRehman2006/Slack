// Global shared storage that persists across Vercel function executions
// This is a simple solution for demo purposes - in production you'd use a database

export interface Message {
  id: string;
  body: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Room {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// Global variables that persist across function executions
declare global {
  var __sharedChannels: Room[] | undefined;
  var __sharedMessages: Message[] | undefined;
  var __sharedUsers: User[] | undefined;
}

// Initialize data if not already present
function initializeData() {
  if (!global.__sharedChannels) {
    global.__sharedChannels = [
      {
        id: 'channel_1',
        name: 'general',
        description: 'General discussion',
        createdAt: new Date().toISOString()
      },
      {
        id: 'channel_2',
        name: 'random',
        description: 'Random chat',
        createdAt: new Date().toISOString()
      },
      {
        id: 'channel_3',
        name: 'test-channel',
        description: 'Test channel for live chat functionality',
        createdAt: new Date().toISOString()
      }
    ];
  }

  if (!global.__sharedMessages) {
    global.__sharedMessages = [
      {
        id: 'msg_1',
        body: 'Hello everyone!',
        userId: 'user_1',
        roomId: 'channel_1',
        createdAt: new Date().toISOString(),
        user: {
          id: 'user_1',
          username: 'TestUser',
          email: 'test@example.com'
        }
      },
      {
        id: 'msg_2',
        body: 'Welcome to the test channel! Try typing a message below.',
        userId: 'user_1',
        roomId: 'channel_3',
        createdAt: new Date().toISOString(),
        user: {
          id: 'user_1',
          username: 'TestUser',
          email: 'test@example.com'
        }
      },
      {
        id: 'msg_3',
        body: 'This channel is perfect for testing real-time chat functionality.',
        userId: 'user_1',
        roomId: 'channel_3',
        createdAt: new Date().toISOString(),
        user: {
          id: 'user_1',
          username: 'TestUser',
          email: 'test@example.com'
        }
      }
    ];
  }

  if (!global.__sharedUsers) {
    global.__sharedUsers = [
      {
        id: 'user_1',
        username: 'TestUser',
        email: 'test@example.com',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_2',
        username: 'CoolCoder123',
        email: 'coolcoder@example.com',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_3',
        username: 'AwesomeBuilder456',
        email: 'awesomebuilder@example.com',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

// Export functions to access shared data
export function getChannels(): Room[] {
  initializeData();
  return global.__sharedChannels!;
}

export function getMessages(roomId?: string): Message[] {
  initializeData();
  const messages = global.__sharedMessages!;
  return roomId ? messages.filter(msg => msg.roomId === roomId) : messages;
}

export function getUsers(): User[] {
  initializeData();
  return global.__sharedUsers!;
}

export function addMessage(message: Message): void {
  initializeData();
  global.__sharedMessages!.push(message);
}

export function addChannel(channel: Room): void {
  initializeData();
  global.__sharedChannels!.push(channel);
}

export function getUserById(userId: string): User | undefined {
  initializeData();
  return global.__sharedUsers!.find(user => user.id === userId);
}
