import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple GraphQL endpoint for testing
app.get('/graphql', (req, res) => {
  res.json({ message: 'GraphQL endpoint is working' });
});

// Test channel creation
app.post('/api/channels', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Channel name is required' });
  }
  
  const channel = {
    id: `channel_${Date.now()}`,
    name,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  res.json(channel);
});

// Get channels
app.get('/api/channels', (req, res) => {
  const channels = [
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
  
  res.json(channels);
});

// Test message creation
app.post('/api/channels/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  const { body, userId } = req.body;
  
  if (!body || !userId) {
    return res.status(400).json({ error: 'Message body and userId are required' });
  }
  
  const message = {
    id: `msg_${Date.now()}`,
    body,
    userId,
    channelId,
    createdAt: new Date().toISOString(),
    user: {
      id: userId,
      username: `User${userId.slice(-4)}`,
      email: `user${userId.slice(-4)}@example.com`
    }
  };
  
  res.json(message);
});

// Get messages for a channel
app.get('/api/channels/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  
  const messages = [
    {
      id: 'msg_1',
      body: 'Hello everyone!',
      userId: 'user_1',
      channelId,
      createdAt: new Date().toISOString(),
      user: {
        id: 'user_1',
        username: 'TestUser',
        email: 'test@example.com'
      }
    }
  ];
  
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Channels: http://localhost:${PORT}/api/channels`);
});
