'use client'

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Room } from '../types';

export function useChannels() {
  const [channels, setChannels] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getChannels();
      setChannels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const createChannel = async (name: string, description?: string) => {
    try {
      const newChannel = await api.createChannel(name, description);
      setChannels(prev => [...prev, newChannel]);
      return newChannel;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create channel');
      throw err;
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  return {
    channels,
    loading,
    error,
    createChannel,
    refetch: loadChannels
  };
}
