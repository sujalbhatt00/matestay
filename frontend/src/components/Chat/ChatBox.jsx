import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft } from 'lucide-react';
import ChatMessage from './ChatMessage';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ChatBox = ({ currentChat, onNewMessage, hasConversations }) => {
  const { user } = useAuth();
  const { socket } = useChat();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const scrollRef = useRef();
  const navigate = useNavigate();

  // --- FIX: Safely find the other member ---
  const otherMember = currentChat?.members.find(m => m._id !== user._id);

  // Fetch conversation messages
  useEffect(() => {
    if (!currentChat?._id) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${currentChat._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [currentChat]);

  // Real-time Incoming Messages Listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.conversationId === currentChat?._id) {
        setMessages((prev) => [...prev, message]);
        onNewMessage(message); // Notify parent
      }
    };

    socket.on("getMessage", handleNewMessage);
    return () => socket.off("getMessage", handleNewMessage);
  }, [socket, currentChat, onNewMessage]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherMember) {
      // --- FIX: Prevent sending if there's no other member ---
      if (!otherMember) console.warn("Cannot send message: No other participant in this chat.");
      return;
    }

    const message = {
      senderId: user._id,
      receiverId: otherMember._id,
      conversationId: currentChat._id,
      text: newMessage,
    };

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      const savedMessage = await res.json();
      
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, savedMessage]);
      onNewMessage(savedMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Empty State UI
  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h3 className="text-xl font-semibold text-muted-foreground">
          {hasConversations ? "Select a conversation" : "No conversations yet"}
        </h3>
        <p className="text-muted-foreground">
          {hasConversations ? "Choose someone from the list to see your messages." : "Find a roommate or property to start chatting!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => navigate('/chat')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={otherMember?.profilePic || defaultAvatar} alt={otherMember?.name} />
          <AvatarFallback>{otherMember?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">{otherMember?.name}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {isLoadingMessages ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} ref={scrollRef}>
              <ChatMessage message={msg} isOwnMessage={msg.senderId === user._id} />
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;