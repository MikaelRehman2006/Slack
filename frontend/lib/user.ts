// Simple user management for demo purposes
export interface User {
  id: string;
  username: string;
  avatar?: string;
}

// Generate a random user for demo
export function generateRandomUser(): User {
  const adjectives = ['Cool', 'Awesome', 'Smart', 'Creative', 'Funny', 'Clever', 'Bright', 'Happy'];
  const nouns = ['User', 'Coder', 'Builder', 'Creator', 'Developer', 'Designer', 'Writer', 'Thinker'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username: `${adjective}${noun}${number}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${adjective}${noun}`
  };
}

// Get or create user from localStorage
export function getCurrentUser(): User {
  if (typeof window === 'undefined') {
    return generateRandomUser();
  }
  
  const stored = localStorage.getItem('slack_user');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const user = generateRandomUser();
  localStorage.setItem('slack_user', JSON.stringify(user));
  return user;
}

// Update user info
export function updateUser(user: Partial<User>): User {
  const currentUser = getCurrentUser();
  const updatedUser = { ...currentUser, ...user };
  localStorage.setItem('slack_user', JSON.stringify(updatedUser));
  return updatedUser;
}
