import { getChannels, getMessages, getUsers, addMessage, addChannel, getUserById } from './shared-storage';

export const simpleResolvers = {
  Query: {
    messages: async (_: any, { roomId, limit = 50 }: any) => {
      const roomMessages = getMessages(roomId)
        .slice(-limit);
      return roomMessages;
    },

    rooms: async () => {
      return getChannels();
    },

    users: async () => {
      return getUsers();
    }
  },

  Mutation: {
    sendMessage: async (_: any, { roomId, body, userId }: any) => {
      const user = getUserById(userId) || {
        id: userId,
        username: `User${userId.slice(-4)}`,
        email: `user${userId.slice(-4)}@example.com`,
        createdAt: new Date().toISOString()
      };

      const message = {
        id: `msg_${Date.now()}`,
        body,
        userId,
        roomId,
        createdAt: new Date().toISOString(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };
      
      addMessage(message);
      
      console.log(`Message saved: ${message.id} in room ${roomId}`);
      console.log(`Total messages in storage: ${getMessages().length}`);
      
      return message;
    },

    createRoom: async (_: any, { name, description }: any) => {
      const room = {
        id: `channel_${Date.now()}`,
        name,
        description: description || '',
        createdAt: new Date().toISOString()
      };
      
      addChannel(room);
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
