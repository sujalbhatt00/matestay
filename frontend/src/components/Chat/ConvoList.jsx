import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ConvoList = ({ conversations, onSelectConversation, currentChatId }) => {
  const { user } = useAuth();
  const { onlineUsers, notifications } = useChat();

  if (!user) return null; // Don't render if user is not available

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-foreground">Messages</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {(!conversations || conversations.length === 0) ? (
          <div className="flex-grow p-4 text-center text-sm text-muted-foreground flex items-center justify-center">
            <p>No conversations yet. Find a roommate or property to start chatting!</p>
          </div>
        ) : (
          conversations.map((convo) => {
            if (!convo || !convo.members) return null;

            const otherMember = convo.members.find((m) => m && m._id !== user._id);
            if (!otherMember) return null;

            const isActive = convo._id === currentChatId;
            const isOnline = onlineUsers.some(ou => ou.userId === otherMember._id);
            const isUnread = notifications.some(n => n.conversationId === convo._id);
            const timestamp = convo.lastMessageTimestamp ? new Date(convo.lastMessageTimestamp) : new Date();

            return (
              <div
                key={convo._id}
                onClick={() => onSelectConversation(convo)}
                className={`flex items-center p-3 cursor-pointer border-b border-border/50 hover:bg-muted/50 transition-colors duration-150 ${isActive ? 'bg-muted' : ''}`}
              >
                <div className="relative mr-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherMember.profilePic || defaultAvatar} alt={otherMember.name} />
                    <AvatarFallback>{otherMember.name ? otherMember.name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-card" />
                  )}
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold truncate text-foreground">{otherMember.name || 'Unknown User'}</h3>
                    <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${isUnread ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                      {convo.lastMessage}
                    </p>
                    {isUnread && (
                      <span className="block h-2.5 w-2.5 rounded-full bg-primary ml-2 flex-shrink-0"></span>
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