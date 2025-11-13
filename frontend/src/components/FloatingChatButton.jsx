import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const FloatingChatButton = () => {
  const { user } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: Don't render if user is not logged in OR on chat page
  if (!user || location.pathname.startsWith('/chat')) {
    return null;
  }

  return (
    <Button
      onClick={() => navigate('/chat')}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-40 bg-[#5b5dda] hover:bg-[#4a4ab5]"
      size="icon"
      aria-label="Open Messages"
    >
      <MessageSquare className="h-8 w-8" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default FloatingChatButton;