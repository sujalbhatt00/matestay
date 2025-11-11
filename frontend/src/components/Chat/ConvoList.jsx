import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TimeAgo from 'react-timeago';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ConvoList = ({ conversations, onSelectConversation, currentChatId }) => {
  const { user } = useAuth();

  if (!conversations || conversations.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No conversations yet.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {conversations.map((convo) => {
          // --- FIX: Find the other member, not yourself ---
          const otherMember = convo.members.find(
            (member) => member._id !== user._id
          );

          // --- FIX: If there's no other member, it's a self-chat, so don't render it ---
          if (!otherMember) {
            return null;
          }

          const isSelected = convo._id === currentChatId;

          return (
            <div
              key={convo._id}
              onClick={() => onSelectConversation(convo)}
              className={`flex items-center p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                isSelected ? 'bg-muted' : ''
              }`}
            >
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={otherMember.profilePic || defaultAvatar} alt={otherMember.name} />
                <AvatarFallback>{otherMember.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">{otherMember.name}</h3>
                  {convo.lastMessageTimestamp && (
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      <TimeAgo date={convo.lastMessageTimestamp} minPeriod={60} />
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {convo.lastMessage}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConvoList;