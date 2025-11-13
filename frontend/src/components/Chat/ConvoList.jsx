import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import axios from '@/api/axiosInstance';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ConvoList = ({ conversations, onSelectConversation, currentChatId }) => {
  const { user } = useAuth();
  const { onlineUsers, notifications } = useChat();
  const [unreadCounts, setUnreadCounts] = useState({});

  // ✅ NEW: Fetch unread counts for each conversation
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const response = await axios.get('/messages/unread/by-conversation');
        const counts = {};
        response.data.forEach(item => {
          counts[item.conversationId] = item.unreadCount;
        });
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Failed to fetch unread counts:", error);
      }
    };

    if (user) {
      fetchUnreadCounts();
    }
  }, [user, conversations]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b space-y-3">
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(!conversations || conversations.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Find a roommate or property to start chatting!
              </p>
            </div>
          </div>
        ) : (
          conversations.map((convo) => {
            if (!convo || !convo.members) return null;
            const otherMember = convo.members.find((m) => m && m._id !== user._id);
            if (!otherMember) return null;

            const isActive = convo._id === currentChatId;
            const isOnline = onlineUsers.some(ou => ou.userId === otherMember._id);
            
            // ✅ UPDATED: Use persistent unread count
            const unreadCount = unreadCounts[convo._id] || 0;
            const isUnread = unreadCount > 0;
            
            const timestamp = convo.lastMessageTimestamp ? new Date(convo.lastMessageTimestamp) : new Date();

            return (
              <div
                key={convo._id}
                onClick={() => onSelectConversation(convo)}
                className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12 ring-2 ring-background">
                    <AvatarImage src={otherMember.profilePic || defaultAvatar} alt={otherMember.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {otherMember.name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-semibold truncate ${
                      isUnread ? 'text-foreground' : 'text-foreground/90'
                    }`}>
                      {otherMember.name || 'Unknown User'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${
                      isUnread 
                        ? 'font-semibold text-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      {convo.lastMessage}
                    </p>
                    {isUnread && (
                      <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConvoList;