import React, { useState, useEffect, useCallback } from 'react';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useParams, useNavigate } from 'react-router-dom';
import ConvoList from '../components/Chat/ConvoList';
import ChatBox from '../components/Chat/ChatBox';
import { Loader2 } from 'lucide-react';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { removeNotification } = useChat();
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get('/conversations');
      const fetchedConversations = res.data || [];
      setConversations(fetchedConversations);
      
      if (conversationId) {
        const activeChat = fetchedConversations.find(c => c._id === conversationId);
        if (activeChat) {
          setCurrentChat(activeChat);
          removeNotification(conversationId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user, conversationId, removeNotification]);

  useEffect(() => {
    if (!authLoading) {
      fetchConversations();
    }
  }, [authLoading, fetchConversations]);

  // --- THIS IS THE CRITICAL FIX ---
  // This function now correctly handles real-time message updates.
  const handleNewMessage = useCallback((message) => {
    setConversations(prevConvos => {
      const convoIndex = prevConvos.findIndex(c => c._id === message.conversationId);
      
      // If the conversation exists, update it and move it to the top.
      if (convoIndex > -1) {
        const updatedConvo = { 
          ...prevConvos[convoIndex], 
          lastMessage: message.text, 
          lastMessageTimestamp: message.createdAt || new Date().toISOString() 
        };
        const otherConvos = prevConvos.filter(c => c._id !== message.conversationId);
        return [updatedConvo, ...otherConvos];
      } else {
        // If it's a new conversation, refetch the entire list to get all details.
        // This is a safe fallback to ensure the UI is always correct.
        fetchConversations();
        return prevConvos;
      }
    });
  }, [fetchConversations]);

  const handleSelectConversation = (conversation) => {
    setCurrentChat(conversation);
    removeNotification(conversation._id);
    navigate(`/chat/${conversation._id}`);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r ${conversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ConvoList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            currentChatId={currentChat?._id}
          />
        )}
      </div>
      <div className={`w-full md:w-2/3 lg:w-3/4 ${conversationId ? 'flex' : 'hidden md:flex'} flex-col`}>
        <ChatBox
          key={currentChat?._id}
          currentChat={currentChat}
          onNewMessage={handleNewMessage}
          hasConversations={conversations.length > 0}
        />
      </div>
    </div>
  );
};

export default ChatPage;