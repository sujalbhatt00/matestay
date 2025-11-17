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
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get('/messages/unread/by-conversation');
        const unreadNotifications = response.data.flatMap(item => 
          item.lastUnreadMessage ? [{
            _id: item.lastUnreadMessage._id,
            conversationId: item.conversationId,
            text: item.lastUnreadMessage.text,
            senderId: item.lastUnreadMessage.senderId,
            createdAt: item.lastUnreadMessage.createdAt,
            count: item.unreadCount,
          }] : []
        );
        setNotifications(unreadNotifications);
        const countResponse = await axios.get('/messages/unread/count');
        setUnreadCount(countResponse.data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };
    fetchUnreadMessages();
  }, [user?._id]);
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
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setOnlineUsers([]);
      return;
    }
    const newSocket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || "http://localhost:5000", {
      transports: ['websocket', 'polling'],
    });
    newSocket.on("connect", () => {
      newSocket.emit("addUser", user._id);
    });
    newSocket.on("getUsers", (users) => setOnlineUsers(users));
    newSocket.on("getMessage", (message) => handleIncomingMessage(message));
    newSocket.on("receiveMessage", (message) => handleIncomingMessage(message));
    newSocket.on("disconnect", () => console.log("❌ Socket disconnected"));
    newSocket.on("connect_error", (error) => console.error("❌ Socket connection error:", error));
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  const handleIncomingMessage = (message) => {
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
        if (prev.some(n => n._id === message._id)) return prev;
        return [message, ...prev];
      });
      setUnreadCount(prev => prev + 1);
    }
  };

  const removeNotification = (conversationId) => {
    setNotifications((prev) => {
      const removedCount = prev.filter(n => n.conversationId === conversationId).length;
      setUnreadCount(count => Math.max(0, count - removedCount));
      return prev.filter(n => n.conversationId !== conversationId);
    });
  };

  const addConversation = (newConvo) => {
    setConversations(prevConvos => {
      if (prevConvos.some(c => c._id === newConvo._id)) {
        return prevConvos;
      }
      return [newConvo, ...prevConvos];
    });
  };

  const value = {
    socket,
    onlineUsers,
    conversations,
    setConversations,
    loadingConversations,
    notifications,
    unreadCount,
    removeNotification,
    addConversation, 
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};