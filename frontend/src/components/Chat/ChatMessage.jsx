import React from 'react';
import TimeAgo from 'react-timeago'; 
import { Check, CheckCheck } from 'lucide-react';

const customFormatter = (value, unit, suffix) => {
  if (unit === 'second') {
    return 'just now';
  }
  return `${value} ${unit}${value > 1 ? 's' : ''} ${suffix}`;
};

const ChatMessage = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200`}>
      <div 
        className={`group relative max-w-[75%] sm:max-w-[70%] ${
          isOwnMessage 
            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-3xl rounded-tr-sm shadow-md hover:shadow-lg' 
            : 'bg-card border border-border text-foreground rounded-3xl rounded-tl-sm shadow-sm hover:shadow-md'
        } px-4 py-2.5 transition-all duration-200`}
      >
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${
          isOwnMessage ? 'opacity-80' : 'opacity-60'
        }`}>
          <p className="text-[10px] font-medium">
            <TimeAgo date={message.createdAt} formatter={customFormatter} />
          </p>
          {isOwnMessage && (
            <CheckCheck className="h-3 w-3" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;