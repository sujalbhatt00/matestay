import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useParams, useNavigate } from "react-router-dom";
import ConvoList from "../components/Chat/ConvoList";
import ChatBox from "../components/Chat/ChatBox";
import { Loader2 } from "lucide-react";

const ChatPage = () => {
  const { loading: authLoading } = useAuth();
  const { conversations, loadingConversations, removeNotification } = useChat();

  const [currentChat, setCurrentChat] = useState(null);
  const [notificationCleared, setNotificationCleared] = useState(false);

  const { conversationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!conversationId || conversations.length === 0) {
      setCurrentChat(null);
      return;
    }

    const activeChat = conversations.find((c) => c._id === conversationId);

    if (activeChat) {
      setCurrentChat(activeChat);

      if (!notificationCleared) {
        removeNotification(conversationId);
        setNotificationCleared(true);
      }

    } else {
      navigate("/chat", { replace: true });
    }
  }, [conversationId, conversations]);

  if (authLoading || loadingConversations) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">

      {/* FIX NAVBAR OVERLAP — perfect spacing for mobile + desktop */}
      <div className="pt-[95px] md:pt-[120px]"></div>

      <div className="flex w-full flex-1">

        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-1/3 lg:w-1/4 border-r bg-card flex-col">
          <ConvoList
            conversations={conversations}
            onSelectConversation={(c) => navigate(`/chat/${c._id}`)}
            currentChatId={currentChat?._id}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className={`md:hidden w-full ${conversationId ? "hidden" : "flex"}`}>
          <ConvoList
            conversations={conversations}
            onSelectConversation={(c) => navigate(`/chat/${c._id}`)}
            currentChatId={currentChat?._id}
          />
        </div>

        {/* Chat Window */}
        <div
          className={`flex flex-col w-full md:w-2/3 lg:w-3/4 bg-background ${
            conversationId ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatBox
            key={currentChat?._id || "no-chat"}
            currentChat={currentChat}
            hasConversations={conversations.length > 0}
            loading={!currentChat && !!conversationId}
          />
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
