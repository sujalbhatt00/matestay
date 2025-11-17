import React from 'react';
import TimeAgo from 'react-timeago'; 
import { Check, CheckCheck } from 'lucide-react';

// Custom formatter for "just now"
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
        className={`group relative max-w-[75%] sm:max-w-[70%] text-wrap break-words shadow-sm
          ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground rounded-l-xl rounded-t-xl rounded-br-sm' // Your message
              : 'bg-card border text-foreground rounded-r-xl rounded-t-xl rounded-bl-sm' // Other person's message
          } px-4 py-2.5 transition-shadow duration-200`}
      >
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${
          isOwnMessage ? 'opacity-80' : 'text-muted-foreground'
        }`}>
          <p className="text-[10px] font-medium">
            <TimeAgo date={message.createdAt} formatter={customFormatter} />
          </p>
          {isOwnMessage && (
            // Add logic here for read receipts
            <CheckCheck className="h-3 w-3" /> 
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;