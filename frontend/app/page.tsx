'use client'

import { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import { apolloClient } from '../lib/apollo-client';
import { GET_ROOMS, CREATE_ROOM } from '../lib/graphql';
import { useRoomChat } from '../hooks/useRoomChat';
import { Sidebar } from '../components/Sidebar';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { Room } from '../types';

// Default user ID for demo purposes
const DEFAULT_USER_ID = '550e8400-e29b-41d4-a716-446655440010';

function ChatApp() {
  const [currentRoomId, setCurrentRoomId] = useState<string>('');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  // Query rooms
  const { data: roomsData, loading: roomsLoading } = useQuery(GET_ROOMS);
  const [createRoom] = useMutation(CREATE_ROOM, {
    refetchQueries: [GET_ROOMS]
  });

  // Room chat hook
  const { messages, loading: messagesLoading, sendMessage, sendingMessage } = useRoomChat(
    currentRoomId,
    DEFAULT_USER_ID
  );

  const rooms = roomsData?.rooms || [];

  // Set first room as current when rooms load
  useEffect(() => {
    if (rooms.length > 0 && !currentRoomId) {
      setCurrentRoomId(rooms[0].id);
    }
  }, [rooms, currentRoomId]);

  const handleRoomSelect = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      await createRoom({
        variables: {
          name: newRoomName.trim(),
          description: `Channel for ${newRoomName.trim()}`
        }
      });
      setNewRoomName('');
      setShowAddRoom(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const currentRoom = rooms.find((room: Room) => room.id === currentRoomId);

  if (roomsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slack-600"></div>
          <p className="text-gray-600">Loading Slack Clone...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        rooms={rooms}
        currentRoomId={currentRoomId}
        onRoomSelect={handleRoomSelect}
        onAddRoom={() => setShowAddRoom(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="text-gray-400 mr-2">#</span>
                {currentRoom?.name || 'Select a channel'}
              </h2>
              {currentRoom?.description && (
                <p className="text-sm text-gray-500 mt-1">{currentRoom.description}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} isLoading={messagesLoading} />

        {/* Message Input */}
        <MessageInput
          onSendMessage={sendMessage}
          disabled={sendingMessage || !currentRoomId}
          placeholder={currentRoom ? `Message #${currentRoom.name}...` : 'Select a channel to start chatting'}
        />
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Channel</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. general"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slack-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddRoom(false);
                    setNewRoomName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoom}
                  disabled={!newRoomName.trim()}
                  className="px-4 py-2 bg-slack-600 text-white rounded-md hover:bg-slack-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <ChatApp />
    </ApolloProvider>
  );
}
