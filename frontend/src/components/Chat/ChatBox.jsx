import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, ArrowLeft, Crown, Loader2, MoreVertical, Info } from 'lucide-react';
import ChatMessage from './ChatMessage';
import axios from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ChatBox = ({ currentChat, hasConversations }) => {
  const { user } = useAuth();
  const { socket, setConversations } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef();
  const navigate = useNavigate();

  const otherMember = currentChat?.members.find(m => m._id !== user._id);
  const MESSAGE_LIMIT = 10;
  const remainingMessages = Math.max(0, MESSAGE_LIMIT - userMessageCount);

  useEffect(() => {
    if (!currentChat?._id) {
      setMessages([]);
      setUserMessageCount(0);
      return;
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await axios.get(`/messages/${currentChat._id}`);
        setMessages(res.data.messages || []);
        setUserMessageCount(res.data.userMessageCount || 0);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load messages");
        setMessages([]);
        setUserMessageCount(0);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [currentChat?._id]);

  useEffect(() => {
    if (!socket || !currentChat) return;

    const handleIncomingMessage = (message) => {
      if (message.conversationId === currentChat._id) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });

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
      }
    };

    socket.on("getMessage", handleIncomingMessage);
    socket.on("receiveMessage", handleIncomingMessage);

    return () => {
      socket.off("getMessage", handleIncomingMessage);
      socket.off("receiveMessage", handleIncomingMessage);
    };
  }, [socket, currentChat, setConversations]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const messageText = newMessage.trim();
    
    if (!messageText || !otherMember || !currentChat) return;

    if (!user.isPremium && userMessageCount >= MESSAGE_LIMIT) {
      setShowLimitDialog(true);
      return;
    }

    if (isSending) return;

    setIsSending(true);

    try {
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        conversationId: currentChat._id,
        senderId: user._id,
        text: messageText,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");
      setUserMessageCount(prev => prev + 1);

      const response = await axios.post('/messages', {
        conversationId: currentChat._id,
        text: messageText,
      });

      setMessages(prev => 
        prev.map(msg => 
          msg._id === tempMessage._id ? response.data : msg
        )
      );

      if (socket && socket.connected) {
        const socketMessage = {
          ...response.data,
          senderId: user._id,
          receiverId: otherMember._id,
          conversationId: currentChat._id,
        };
        
        socket.emit("sendMessage", socketMessage);
      }

      setConversations(prevConvos => {
        const convoIndex = prevConvos.findIndex(c => c._id === currentChat._id);
        if (convoIndex > -1) {
          const updatedConvo = {
            ...prevConvos[convoIndex],
            lastMessage: messageText,
            lastMessageTimestamp: response.data.createdAt,
          };
          const otherConvos = prevConvos.filter((_, i) => i !== convoIndex);
          return [updatedConvo, ...otherConvos];
        }
        return prevConvos;
      });

    } catch (error) {
      console.error("Failed to send message:", error);
      
      setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
      setUserMessageCount(prev => Math.max(0, prev - 1));
      
      if (error.response?.data?.limitReached) {
        setShowLimitDialog(true);
      } else {
        toast.error(error.response?.data?.message || "Failed to send message");
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md space-y-4">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground">
            {hasConversations ? "Select a conversation" : "Welcome to Messages"}
          </h3>
          <p className="text-muted-foreground">
            {hasConversations 
              ? "Choose a conversation from the list to start chatting" 
              : "Find a roommate or property to begin a conversation!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full bg-background">
        {/* ✅ MODERN HEADER */}
        <div className="flex items-center gap-3 p-4 border-b bg-card/50 backdrop-blur-sm shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden -ml-2"
            onClick={() => navigate('/chat')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
            onClick={() => navigate(`/profile/${otherMember._id}`)}
          >
            <Avatar className="h-11 w-11 ring-2 ring-primary/10">
              <AvatarImage src={otherMember?.profilePic || defaultAvatar} alt={otherMember?.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {otherMember?.name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {otherMember?.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {otherMember?.occupation || 'User'}
              </p>
            </div>
          </div>
          
          {!user.isPremium && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
              <Info className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
              <span className={`text-xs font-semibold whitespace-nowrap ${
                remainingMessages <= 3 
                  ? 'text-red-600 dark:text-red-500' 
                  : 'text-yellow-600 dark:text-yellow-500'
              }`}>
                {remainingMessages} left
              </span>
            </div>
          )}
        </div>
        
        {/* ✅ MODERN MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-muted/20 to-background p-4 space-y-2">
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm text-muted-foreground">Start the conversation with {otherMember?.name}!</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg._id || `msg-${index}`} ref={index === messages.length - 1 ? scrollRef : null}>
                <ChatMessage message={msg} isOwnMessage={msg.senderId === user._id} />
              </div>
            ))
          )}
        </div>
        
        {/* ✅ MODERN INPUT AREA */}
        <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={isSending ? "Sending..." : "Type your message..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
                className="pr-10 py-6 rounded-2xl border-2 focus-visible:ring-2 focus-visible:ring-primary/50 bg-background"
                autoComplete="off"
              />
            </div>
            <Button 
              type="submit" 
              size="icon"
              disabled={!newMessage.trim() || isSending}
              className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          
          {/* Message limit warning */}
          {!user.isPremium && remainingMessages <= 3 && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              ⚠️ Only {remainingMessages} messages left. 
              <button 
                onClick={() => navigate('/premium')} 
                className="text-primary hover:underline ml-1 font-medium"
              >
                Upgrade to Premium
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Premium Upgrade Dialog */}
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Message Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-center">
              <p className="text-base">
                You've reached your free limit of <span className="font-bold">{MESSAGE_LIMIT} messages</span> per conversation.
              </p>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 space-y-3">
                <p className="font-bold text-yellow-800 dark:text-yellow-400 text-lg flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5" />
                  Upgrade to Premium - Only ₹1/month!
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600"></div>
                    <span>✨ Unlimited messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600"></div>
                    <span>🎯 Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600"></div>
                    <span>⭐ Featured profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600"></div>
                    <span>🚫 Ad-free experience</span>
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Maybe Later</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/premium')} 
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatBox;