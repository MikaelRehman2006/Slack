import { Pool } from 'pg';
import { Message, Channel, User } from './types';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'slack_db',
  user: 'slack_user',
  password: 'slack_password',
});

export const db = {
  async init() {
    const client = await pool.connect();
    try {
      // Create tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS channels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          content TEXT NOT NULL,
          user_id UUID NOT NULL REFERENCES users(id),
          channel_id UUID NOT NULL REFERENCES channels(id),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default data
      await client.query(`
        INSERT INTO channels (id, name, description) 
        VALUES 
          ('550e8400-e29b-41d4-a716-446655440000', 'general', 'General discussion'),
          ('550e8400-e29b-41d4-a716-446655440001', 'random', 'Random chat')
        ON CONFLICT (id) DO NOTHING
      `);

      await client.query(`
        INSERT INTO users (id, username, email) 
        VALUES 
          ('550e8400-e29b-41d4-a716-446655440010', 'admin', 'admin@example.com')
        ON CONFLICT (id) DO NOTHING
      `);

    } finally {
      client.release();
    }
  },

  async getMessages(channelId: string, limit = 50): Promise<Message[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT m.*, u.username
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.channel_id = $1
        ORDER BY m.timestamp DESC
        LIMIT $2
      `, [channelId, limit]);
      
      return result.rows.map(row => ({
        id: row.id,
        content: row.content,
        userId: row.user_id,
        channelId: row.channel_id,
        timestamp: row.timestamp,
        username: row.username
      }));
    } finally {
      client.release();
    }
  },

  async createMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO messages (content, user_id, channel_id)
        VALUES ($1, $2, $3)
        RETURNING id, timestamp
      `, [message.content, message.userId, message.channelId]);

      const { id, timestamp } = result.rows[0];
      
      // Get username
      const userResult = await client.query(`
        SELECT username FROM users WHERE id = $1
      `, [message.userId]);

      return {
        ...message,
        id,
        timestamp,
        username: userResult.rows[0]?.username
      };
    } finally {
      client.release();
    }
  },

  async getChannels(): Promise<Channel[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM channels ORDER BY created_at ASC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at
      }));
    } finally {
      client.release();
    }
  },

  async getUsers(): Promise<User[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM users ORDER BY created_at ASC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        username: row.username,
        email: row.email,
        createdAt: row.created_at
      }));
    } finally {
      client.release();
    }
  }
};
