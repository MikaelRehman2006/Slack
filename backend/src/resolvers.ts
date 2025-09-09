import { Message, Room, User, sequelize } from './models';
import { redisClient } from './redis';

export const resolvers = {
  Query: {
    messages: async (_: any, { roomId, limit = 50, before }: any) => {
      const whereClause: any = { roomId };
      
      if (before) {
        whereClause.createdAt = {
          [sequelize.Sequelize.Op.lt]: new Date(before)
        };
      }

      const messages = await Message.findAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'avatar']
        }],
        order: [['createdAt', 'DESC']],
        limit: limit
      });

      return messages.reverse(); // Return in chronological order
    },

    rooms: async () => {
      return await Room.findAll({
        order: [['createdAt', 'ASC']]
      });
    },

    users: async () => {
      return await User.findAll({
        order: [['createdAt', 'ASC']]
      });
    }
  },

  Mutation: {
    sendMessage: async (_: any, { roomId, body, userId }: any) => {
      // Create message
      const message = await Message.create({
        roomId,
        userId,
        body
      });

      // Fetch with user data
      const messageWithUser = await Message.findByPk(message.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'avatar']
        }]
      });

      // Publish to Redis
      await redisClient.publishMessage(roomId, messageWithUser);

      return messageWithUser;
    },

    createRoom: async (_: any, { name, description }: any) => {
      return await Room.create({
        name,
        description
      });
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: async (_: any, { roomId }: any) => {
        return redisClient.createAsyncIterator(roomId);
      },
      resolve: (payload: any) => payload
    }
  }
};
