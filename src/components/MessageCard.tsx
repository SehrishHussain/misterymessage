'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDeleteAction: (messageId: string) => void;
  onTogglePublicAction: (id: string, newStatus: boolean) => void;
};

export function MessageCard({ message, onMessageDeleteAction, onTogglePublicAction }: MessageCardProps) {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(message.isPublic);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      toast({ title: response.data.message });
      onMessageDeleteAction(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const response = await axios.patch(`/api/toggle-message/${message._id}`);
      const newStatus = response.data.isPublic;
      setIsPublic(newStatus);
      toast({ title: response.data.message });
      // 👇 notify parent component so dashboard can refresh or update state
      onTogglePublicAction(message._id, newStatus);
    } catch (error) {
      toast({
        title: 'Error toggling visibility',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={isPublic ? 'secondary' : 'outline'}
              onClick={handleToggleVisibility}
            >
              {isPublic ? 'Public' : 'Private'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
