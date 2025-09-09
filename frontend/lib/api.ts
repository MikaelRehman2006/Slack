const API_BASE = 'http://localhost:3001';

export const api = {
  // Channels
  async getChannels() {
    const response = await fetch(`${API_BASE}/api/channels`);
    if (!response.ok) throw new Error('Failed to fetch channels');
    return response.json();
  },

  async createChannel(name: string, description?: string) {
    const response = await fetch(`${API_BASE}/api/channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error('Failed to create channel');
    return response.json();
  },

  // Messages
  async getMessages(channelId: string) {
    const response = await fetch(`${API_BASE}/api/channels/${channelId}/messages`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  async sendMessage(channelId: string, body: string, userId: string) {
    const response = await fetch(`${API_BASE}/api/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body, userId }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
};
