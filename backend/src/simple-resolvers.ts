// Simple in-memory data store
let channels = [
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
  }
];

let messages = [
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
  }
];

let users = [
  {
    id: 'user_1',
    username: 'TestUser',
    email: 'test@example.com',
    createdAt: new Date().toISOString()
  }
];

export const simpleResolvers = {
  Query: {
    messages: async (_: any, { roomId, limit = 50 }: any) => {
      const roomMessages = messages
        .filter(msg => msg.roomId === roomId)
        .slice(-limit);
      return roomMessages;
    },

    rooms: async () => {
      return channels;
    },

    users: async () => {
      return users;
    }
  },

  Mutation: {
    sendMessage: async (_: any, { roomId, body, userId }: any) => {
      const message = {
        id: `msg_${Date.now()}`,
        body,
        userId,
        roomId,
        createdAt: new Date().toISOString(),
        user: {
          id: userId,
          username: `User${userId.slice(-4)}`,
          email: `user${userId.slice(-4)}@example.com`
        }
      };
      
      messages.push(message);
      
      // Note: Redis publishing disabled for local development
      // In production, this would publish to Redis for real-time updates
      
      return message;
    },

    createRoom: async (_: any, { name, description }: any) => {
      const room = {
        id: `channel_${Date.now()}`,
        name,
        description: description || '',
        createdAt: new Date().toISOString()
      };
      
      channels.push(room);
      return room;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: async function* (_: any, { roomId }: any) {
        // Simple polling for demo - in production this would use Redis
        while (true) {
          yield { messageAdded: { id: 'demo', body: 'Demo message', roomId } };
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      },
      resolve: (payload: any) => payload
    }
  }
};
