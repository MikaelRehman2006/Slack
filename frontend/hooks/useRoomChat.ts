'use client'

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_MESSAGES, SEND_MESSAGE, MESSAGE_ADDED } from '../lib/graphql';
import { Message } from '../types';

export function useRoomChat(roomId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Query messages
  const { data: messagesData, loading: messagesLoading, refetch } = useQuery(GET_MESSAGES, {
    variables: { roomId, limit: 50 },
    skip: !roomId
  });

  // Update messages when data changes
  useEffect(() => {
    if (messagesData?.messages && messagesData.messages.length > 0) {
      setMessages(messagesData.messages);
    } else {
      // Fallback messages for each channel if API fails
      if (roomId === 'channel_3') {
        setMessages([
          {
            id: 'msg_2',
            body: 'Welcome to the test channel! Try typing a message below.',
            userId: 'user_1',
            roomId: 'channel_3',
            createdAt: new Date().toISOString(),
            user: {
              id: 'user_1',
              username: 'TestUser',
              email: 'test@example.com'
            }
          },
          {
            id: 'msg_3',
            body: 'This channel is perfect for testing real-time chat functionality.',
            userId: 'user_1',
            roomId: 'channel_3',
            createdAt: new Date().toISOString(),
            user: {
              id: 'user_1',
              username: 'TestUser',
              email: 'test@example.com'
            }
          }
        ]);
      } else if (roomId === 'channel_1') {
        setMessages([
          {
            id: 'msg_1',
            body: 'Hello everyone! This is the general channel.',
            userId: 'user_1',
            roomId: 'channel_1',
            createdAt: new Date().toISOString(),
            user: {
              id: 'user_1',
              username: 'TestUser',
              email: 'test@example.com'
            }
          }
        ]);
      } else if (roomId === 'channel_2') {
        setMessages([
          {
            id: 'msg_4',
            body: 'Welcome to the random channel! Feel free to chat about anything.',
            userId: 'user_1',
            roomId: 'channel_2',
            createdAt: new Date().toISOString(),
            user: {
              id: 'user_1',
              username: 'TestUser',
              email: 'test@example.com'
            }
          }
        ]);
      } else {
        setMessages([]);
      }
    }
  }, [messagesData, roomId]);

  // Polling for new messages (replaces WebSocket for Vercel)
  useEffect(() => {
    if (!roomId) return;

    const pollMessages = async () => {
      try {
        const { data } = await refetch();
        if (data?.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.log('Polling error (expected on API failure):', error);
      }
    };

    // Poll every 2 seconds for new messages
    const interval = setInterval(pollMessages, 2000);
    
    return () => clearInterval(interval);
  }, [roomId, refetch]);

  // Send message mutation
  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      console.log('Message sent successfully:', data);
      // Add message immediately to local state (fallback if subscription fails)
      if (data?.sendMessage) {
        setMessages(prev => [...prev, data.sendMessage]);
      }
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    }
  });

  // Local message storage for when API fails
  const addLocalMessage = (body: string, userId: string) => {
    const newMessage = {
      id: `local_${Date.now()}`,
      body,
      userId,
      roomId,
      createdAt: new Date().toISOString(),
      user: {
        id: userId,
        username: `User${userId.slice(-4)}`,
        email: `user${userId.slice(-4)}@example.com`
      }
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Subscribe to new messages
  useSubscription(MESSAGE_ADDED, {
    variables: { roomId },
    skip: !roomId,
    onData: ({ data }) => {
      console.log('Subscription received data:', data);
      const newMessage = data.data?.messageAdded;
      if (newMessage) {
        console.log('Adding new message via subscription:', newMessage);
        setMessages(prev => [...prev, newMessage]);
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
    }
  });

  const handleSendMessage = async (body: string) => {
    if (!roomId || !userId || !body.trim()) {
      console.log('Cannot send message - missing data:', { roomId, userId, body: body.trim() });
      return;
    }

    console.log('Sending message:', { roomId, body: body.trim(), userId });
    
    try {
      const result = await sendMessage({
        variables: {
          roomId,
          body: body.trim(),
          userId
        }
      });
      console.log('Send message result:', result);
      
      // Optimistically add message to local state immediately
      if (result.data?.sendMessage) {
        setMessages(prev => [...prev, result.data.sendMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add message locally when API fails
      console.log('Adding message locally due to API failure');
      addLocalMessage(body.trim(), userId);
    }
  };

  return {
    messages,
    loading: messagesLoading,
    sendingMessage,
    sendMessage: handleSendMessage,
    refetch
  };
}
