import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const pub = createClient({
  url: redisUrl
});

const sub = createClient({
  url: redisUrl
});

pub.on('error', (err) => console.error('Redis Publisher Error:', err));
sub.on('error', (err) => console.error('Redis Subscriber Error:', err));

export const redisClient = {
  async connect() {
    await Promise.all([pub.connect(), sub.connect()]);
    console.log('Connected to Redis');
  },

  async publishMessage(roomId: string, message: any) {
    await pub.publish(`room:${roomId}`, JSON.stringify(message));
  },

  async subscribeToRoom(roomId: string, callback: (message: any) => void) {
    await sub.subscribe(`room:${roomId}`, (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      } catch (error) {
        console.error('Error parsing Redis message:', error);
      }
    });
  },

  // Create async iterator for GraphQL subscriptions
  createAsyncIterator(roomId: string) {
    const queue: any[] = [];
    let isSubscribed = false;

    const subscribe = async () => {
      if (!isSubscribed) {
        await sub.subscribe(`room:${roomId}`, (message) => {
          try {
            const parsedMessage = JSON.parse(message);
            queue.push(parsedMessage);
          } catch (error) {
            console.error('Error parsing Redis message:', error);
          }
        });
        isSubscribed = true;
      }
    };

    return {
      async *[Symbol.asyncIterator]() {
        await subscribe();
        while (true) {
          if (queue.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
            continue;
          }
          yield queue.shift();
        }
      }
    };
  }
};