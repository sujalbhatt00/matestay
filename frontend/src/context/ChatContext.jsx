import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from '@/api/axiosInstance';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Fetch conversations when user changes
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoadingConversations(false);
      return;
    }

    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const res = await axios.get('/conversations');
        setConversations(res.data || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setConversations([]);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [user?._id]); // Only re-fetch when user ID changes

  // Manage socket connection
  useEffect(() => {
    if (!user?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("addUser", user._id);
    newSocket.on("getUsers", (users) => setOnlineUsers(users));

    const handleGetMessage = (message) => {
      setConversations(prevConvos => {
        const convoIndex = prevConvos.findIndex(c => c._id === message.conversationId);
        if (convoIndex > -1) {
          const updatedConvo = {
            ...prevConvos[convoIndex],
            lastMessage: message.text,
            lastMessageTimestamp: message.createdAt,
          };
          const otherConvos = prevConvos.filter((_, i) => i !== convoIndex);
          return [updatedConvo, ...otherConvos];
        }
        return prevConvos;
      });

      const isChatOpen = window.location.pathname.includes(message.conversationId);
      if (!isChatOpen) {
        setNotifications(prev => {
          if (prev.some(n => n.conversationId === message.conversationId)) return prev;
          return [message, ...prev];
        });
      }
    };

    newSocket.on("getMessage", handleGetMessage);

    return () => {
      newSocket.off("getMessage", handleGetMessage);
      newSocket.disconnect();
    };
  }, [user?._id]);

  const removeNotification = (conversationId) => {
    setNotifications((prev) => prev.filter(n => n.conversationId !== conversationId));
  };

  const value = {
    socket,
    onlineUsers,
    conversations,
    setConversations,
    loadingConversations,
    notifications,
    removeNotification,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};