'use client'

import { Room } from '../types';
import { Hash, Plus, Users } from 'lucide-react';

interface SidebarProps {
  rooms: Room[];
  currentRoomId?: string;
  onRoomSelect: (roomId: string) => void;
  onAddRoom: () => void;
  currentUser?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export function Sidebar({ rooms, currentRoomId, onRoomSelect, onAddRoom, currentUser }: SidebarProps) {
  return (
    <div className="w-64 bg-slack-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slack-800">
        <h1 className="text-xl font-bold flex items-center">
          <span className="w-8 h-8 bg-white rounded flex items-center justify-center mr-3">
            <span className="text-slack-900 font-bold text-sm">S</span>
          </span>
          Slack Clone
        </h1>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Channels
            </h2>
            <button
              onClick={onAddRoom}
              className="text-gray-400 hover:text-white transition-colors"
              title="Add channel"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className={`w-full flex items-center space-x-2 px-2 py-2 rounded text-left hover:bg-slack-800 transition-colors ${
                  currentRoomId === room.id ? 'bg-slack-800 text-white' : 'text-gray-300'
                }`}
              >
                <Hash size={16} className="flex-shrink-0" />
                <span className="truncate">{room.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Users section placeholder */}
        <div className="p-2 border-t border-slack-800 mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Online Users
            </h2>
          </div>
          <div className="text-xs text-gray-400">
            Anyone can join and chat!
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slack-800">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm text-gray-300">
            {currentUser ? `${currentUser.username} (Online)` : 'Online'}
          </span>
        </div>
      </div>
    </div>
  );
}
