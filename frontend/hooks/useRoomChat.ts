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
    skip: !roomId,
    onCompleted: (data) => {
      setMessages(data?.messages || []);
    }
  });

  // Send message mutation
  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      // Message will be added via subscription
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
      const newMessage = data.data?.messageAdded;
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
      }
    }
  });

  const handleSendMessage = async (body: string) => {
    if (!roomId || !userId || !body.trim()) return;

    try {
      await sendMessage({
        variables: {
          roomId,
          body: body.trim(),
          userId
        }
      });
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
