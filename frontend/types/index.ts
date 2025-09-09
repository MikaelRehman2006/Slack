export interface Message {
  id: string;
  body: string;
  userId: string;
  roomId: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}
