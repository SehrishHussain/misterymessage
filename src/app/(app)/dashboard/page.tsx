'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { MessagesResponse } from '@/types/ApiResponse';

import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);
  const [publicMessages, setPublicMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  // ✅ Fetch whether user is accepting messages
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  // ✅ Fetch private + public messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
       const response = await axios.get<MessagesResponse>('/api/get-messages');
setPrivateMessages(response.data.privateMessages || []);
setPublicMessages(response.data.publicMessages || []);

        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  // ✅ Delete handler (used by both lists)
  const handleDeleteMessage = (messageId: string) => {
    setPrivateMessages((prev) => prev.filter((m) => m._id !== messageId));
    setPublicMessages((prev) => prev.filter((m) => m._id !== messageId));
  };

  // ✅ Handle switch to accept messages
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({ title: response.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  // ✅ Handle toggle between private/public in MessageCard
  const handleTogglePublic = (id: string, isPublic: boolean) => {
    if (isPublic) {
      // Move from private → public
      const msg = privateMessages.find((m) => m._id === id);
      if (msg) {
        setPrivateMessages((prev) => prev.filter((m) => m._id !== id));
        setPublicMessages((prev) => [msg, ...prev]);
      }
    } else {
      // Move from public → private
      const msg = publicMessages.find((m) => m._id === id);
      if (msg) {
        setPublicMessages((prev) => prev.filter((m) => m._id !== id));
        setPrivateMessages((prev) => [msg, ...prev]);
      }
    }
  };

  if (!session || !session.user) return <div></div>;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      {/* Copy Link */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Private Messages */}
      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-2">🔒 Private Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {privateMessages.length > 0 ? (
            privateMessages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
                onTogglePublic={handleTogglePublic}
              />
            ))
          ) : (
            <p>No private messages.</p>
          )}
        </div>

        {/* Public Messages */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">🌍 Public Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publicMessages.length > 0 ? (
            publicMessages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
                onTogglePublic={handleTogglePublic}
              />
            ))
          ) : (
            <p>No public messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
