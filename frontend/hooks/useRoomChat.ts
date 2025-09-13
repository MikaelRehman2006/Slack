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
    } else if (roomId === 'channel_3') {
      // Fallback messages for test-channel if API fails
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
    }
  }, [messagesData, roomId]);

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
    } catch (error) {
      console.error('Failed to send message:', error);
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
