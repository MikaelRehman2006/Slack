'use client'

import { Message } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = username.length % colors.length;
    return colors[index];
  };

  return (
    <div className="flex items-start space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
      <div className={`w-10 h-10 rounded-full ${getAvatarColor(message.user?.username || 'U')} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
        {getInitials(message.user?.username || 'Unknown')}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-gray-900 text-sm">
            {message.user?.username || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.body}
        </div>
      </div>
    </div>
  );
}
