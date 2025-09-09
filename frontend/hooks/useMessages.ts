'use client'

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Message } from '../types';

export function useMessages(channelId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    if (!channelId) return;
    
    try {
      setLoading(true);
      const data = await api.getMessages(channelId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (body: string) => {
    if (!channelId || !userId || !body.trim()) return;

    try {
      setSending(true);
      const newMessage = await api.sendMessage(channelId, body.trim(), userId);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [channelId]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    refetch: loadMessages
  };
}
