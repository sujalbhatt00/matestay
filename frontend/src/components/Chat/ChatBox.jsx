import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
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

  const otherMember = currentChat?.members.find(m => m._id !== user._id);

  useEffect(() => {
    if (!currentChat?._id) {
      setMessages([]); // Clear messages if no chat is selected
      return;
    }
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await axios.get(`/messages/${currentChat._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      if (currentChat && message.conversationId === currentChat._id) {
        setMessages((prev) => [...prev, message]);
        if (typeof onNewMessage === 'function') {
          onNewMessage(message);
        }
      }
    };
    socket.on("getMessage", handleNewMessage);
    return () => {
      socket.off("getMessage", handleNewMessage);
    };
  }, [socket, currentChat, onNewMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherMember) return;
    const messagePayload = {
      conversationId: currentChat._id,
      text: newMessage,
    };
    const socketMessage = {
      senderId: user._id,
      receiverId: otherMember._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    try {
      const { data: savedMessage } = await axios.post('/messages', messagePayload);
      socket.emit("sendMessage", socketMessage);
      setMessages((prev) => [...prev, savedMessage]);
      if (typeof onNewMessage === 'function') {
        onNewMessage(savedMessage);
      }
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-background">
        <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold text-foreground">
          {hasConversations ? "Select a conversation" : "Welcome to your messages"}
        </h3>
        <p className="text-muted-foreground mt-2 max-w-xs">
          {hasConversations ? "Choose someone from the list to start chatting." : "Find a roommate or property to begin a conversation!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center p-3 border-b sticky top-0 bg-background z-10">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => navigate('/chat')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={otherMember?.profilePic || defaultAvatar} alt={otherMember?.name} />
          <AvatarFallback>{otherMember?.name ? otherMember.name.charAt(0) : '?'}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-foreground">{otherMember?.name}</h3>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || Math.random()} ref={scrollRef}>
              <ChatMessage message={msg} isOwnMessage={msg.senderId === user._id} />
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-muted border-muted-foreground/20 focus-visible:ring-primary"
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