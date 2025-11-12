import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useParams, useNavigate } from 'react-router-dom';
import ConvoList from '../components/Chat/ConvoList';
import ChatBox from '../components/Chat/ChatBox';
import { Loader2 } from 'lucide-react';

const ChatPage = () => {
  const { loading: authLoading } = useAuth();
  // --- ALL STATE NOW COMES FROM THE CONTEXT ---
  const { conversations, loadingConversations, removeNotification } = useChat();
  const [currentChat, setCurrentChat] = useState(null);
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Effect to set the current chat based on URL
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const activeChat = conversations.find(c => c._id === conversationId);
      if (activeChat) {
        setCurrentChat(activeChat);
        removeNotification(conversationId);
      }
    } else {
      setCurrentChat(null);
    }
  }, [conversationId, conversations, removeNotification]);

  const handleSelectConversation = (conversation) => {
    navigate(`/chat/${conversation._id}`);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r ${conversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
        {loadingConversations ? (
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
          hasConversations={conversations.length > 0}
        />
      </div>
    </div>
  );
};

export default ChatPage;