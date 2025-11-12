import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from '@/api/axiosInstance';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // --- STATE IS NOW CENTRALIZED HERE ---
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Fetch conversations once when the user logs in
  const fetchConversations = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Manage socket connection and listeners
  useEffect(() => {
    if (user && user._id) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.emit("addUser", user._id);
      newSocket.on("getUsers", (users) => setOnlineUsers(users));

      // --- SOCKET LOGIC IS NOW CENTRALIZED AND STABLE ---
      const handleGetMessage = (message) => {
        // 1. Update the conversation list
        setConversations(prevConvos => {
          const convoIndex = prevConvos.findIndex(c => c._id === message.conversationId);
          if (convoIndex > -1) {
            const updatedConvo = {
              ...prevConvos[convoIndex],
              lastMessage: message.text,
              lastMessageTimestamp: message.createdAt,
            };
            const otherConvos = prevConvos.filter(c => c._id !== message.conversationId);
            return [updatedConvo, ...otherConvos];
          }
          // If it's a brand new conversation, refetch everything to be safe
          fetchConversations();
          return prevConvos;
        });

        // 2. Add a notification if the chat is not open
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
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user, fetchConversations]); // fetchConversations is stable now

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