export interface Message {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  timestamp: Date;
  username?: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface NewMessageEvent {
  type: 'new_message';
  message: Message;
}

export interface RedisMessage {
  channelId: string;
  message: Message;
}
