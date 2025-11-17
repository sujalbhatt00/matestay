import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { toast } from 'sonner';
import ChatMessage from './ChatMessage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageSquare, ArrowLeft, Crown, AlertCircle, Check, Sparkles, Paperclip, Smile, MoreVertical, Eraser, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ChatBox = ({ currentChat, hasConversations }) => {
  const { user } = useAuth();
  const { socket, setConversations, onlineUsers } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [showClearChatDialog, setShowClearChatDialog] = useState(false);
  const [showDeleteChatDialog, setShowDeleteChatDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const scrollRef = useRef();
  const navigate = useNavigate();

  const otherMember = currentChat?.members.find(m => m._id !== user._id);
  const isOtherUserOnline = onlineUsers?.some(u => u.userId === otherMember?._id);
  
  const MESSAGE_LIMIT = 15;
  const remainingMessages = Math.max(0, MESSAGE_LIMIT - userMessageCount);
  const isLimitReached = !user?.isPremium && userMessageCount >= MESSAGE_LIMIT;

  useEffect(() => {
    if (currentChat) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        try {
          const res = await axios.get(`/messages/${currentChat._id}`);
          setMessages(res.data.messages || []);
          setUserMessageCount(res.data.userMessageCount || 0); 
        } catch (error) {
          console.error('Failed to fetch messages:', error);
          toast.error('Could not load messages');
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [currentChat?._id]);

  useEffect(() => {
    if (!socket) return;
    const handleGetMessage = (message) => {
      if (message.conversationId === currentChat?._id) {
        setMessages((prev) => [...prev, message]);
        setConversations((prevConvos) => {
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
    socket.on("getMessage", handleGetMessage);
    socket.on("receiveMessage", handleGetMessage);
    return () => {
      socket.off("getMessage", handleGetMessage);
      socket.off("receiveMessage", handleGetMessage);
    };
  }, [socket, currentChat, setConversations, user._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (isLimitReached) {
      setShowLimitDialog(true);
      return;
    }
    setIsSending(true);
    try {
      const messageData = {
        conversationId: currentChat._id,
        text: newMessage,
      };
      const res = await axios.post('/messages', messageData);
      if (res.data.limitReached) {
        toast.error('Message limit reached. Upgrade to premium for unlimited messaging.');
        setShowLimitDialog(true);
        setUserMessageCount(MESSAGE_LIMIT);
        return;
      }
      const savedMessage = res.data;
      setMessages((prev) => [...prev, savedMessage]);
      setUserMessageCount((prev) => prev + 1); 
      setNewMessage("");
      if (socket) {
        socket.emit("sendMessage", {
          ...savedMessage,
          receiverId: otherMember._id,
          senderId: user._id,
        });
      }
      setConversations((prevConvos) => {
        const convoIndex = prevConvos.findIndex(c => c._id === currentChat._id);
        if (convoIndex > -1) {
          const updatedConvo = {
            ...prevConvos[convoIndex],
            lastMessage: savedMessage.text,
            lastMessageTimestamp: savedMessage.createdAt,
          };
          const otherConvos = prevConvos.filter((_, i) => i !== convoIndex);
          return [updatedConvo, ...otherConvos];
        }
        return prevConvos;
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      if (error.response?.data?.limitReached) {
        toast.error('Message limit reached. Upgrade to premium for unlimited messaging.');
        setShowLimitDialog(true);
        setUserMessageCount(MESSAGE_LIMIT);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const loadRazorpayScript = () => { /* ... (your existing logic) ... */ };
  const handleUpgradeClick = async (planType) => { /* ... (your existing logic) ... */ };

  const handleClearChat = async () => {
    setShowClearChatDialog(false);
    try {
      await axios.delete(`/messages/${currentChat._id}/clear`);
      setMessages([]);
      toast.success("Chat cleared!");
      setConversations(prev => [...prev]); // Trigger parent refetch
    } catch (err) {
      console.error("Failed to clear chat:", err);
      toast.error("Failed to clear chat.");
    }
  };

  const handleDeleteChat = async () => {
    setShowDeleteChatDialog(false);
    try {
      await axios.delete(`/conversations/${currentChat._id}`);
      setConversations(prev => prev.filter(c => c._id !== currentChat._id));
      navigate('/chat');
      toast.success("Chat deleted!");
    } catch (err) {
      console.error("Failed to delete chat:", err);
      toast.error("Failed to delete chat.");
    }
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background p-8 text-center hidden md:flex">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-foreground">
          {hasConversations ? 'Select a conversation' : 'No conversations yet'}
        </h3>
        <p className="text-muted-foreground max-w-md mb-6">
          {hasConversations 
            ? 'Choose a conversation from the list to start messaging'
            : 'Find a roommate or property to start chatting!'
          }
        </p>
        {!hasConversations && (
          <div className="flex gap-3">
            <Button onClick={() => navigate('/find-roommates')} variant="outline">
              Find Roommates
            </Button>
            <Button onClick={() => navigate('/properties/search')}>
              Browse Properties
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b bg-card shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/chat')}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar 
          className="h-10 w-10 ring-2 ring-background cursor-pointer"
          onClick={() => navigate(`/profile/${otherMember._id}`)}
        >
          <AvatarImage src={otherMember?.profilePic || defaultAvatar} alt={otherMember?.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {otherMember?.name?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 
            className="font-semibold text-foreground truncate cursor-pointer hover:underline"
            onClick={() => navigate(`/profile/${otherMember._id}`)}
          >
            {otherMember?.name || 'Unknown User'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isOtherUserOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!user?.isPremium && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
              <span className={`text-xs font-medium ${isLimitReached ? 'text-red-500' : 'text-muted-foreground'}`}>
                {isLimitReached ? 'Limit reached' : `${remainingMessages} messages left today`}
              </span>
              {isLimitReached && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowClearChatDialog(true)} className="text-yellow-600 focus:text-yellow-600">
                <Eraser className="mr-2 h-4 w-4" /> Clear Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteChatDialog(true)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!user?.isPremium && remainingMessages <= 3 && remainingMessages > 0 && (
        <Alert className="m-4 border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm">
            You have {remainingMessages} {remainingMessages === 1 ? 'message' : 'messages'} left today.
            <Button
              variant="link"
              className="h-auto p-0 ml-1 text-yellow-500 hover:text-yellow-600"
              onClick={() => setShowLimitDialog(true)}
            >
              Upgrade to Premium
            </Button>
            {' '}for unlimited messaging.
          </AlertDescription>
        </Alert>
      )}
      {isLimitReached && (
        <Alert className="m-4 border-red-500/50 bg-red-500/10">
          <Crown className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-sm">
            You've reached your free message limit for today.
            <Button
              variant="link"
              className="h-auto p-0 ml-1 text-red-500 hover:text-red-600 font-semibold"
              onClick={() => setShowLimitDialog(true)}
            >
              Upgrade to Premium (₹1/month)
            </Button>
            {' '}to continue chatting.
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-muted/30">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage 
                key={msg._id} 
                message={msg} 
                isOwnMessage={msg.senderId === user._id} 
              />
            ))}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-card">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder={isLimitReached ? "Your free messages for today are over..." : "Type a message..."}
            value={newMessage}
            // --- THIS IS THE FIX for typing ---
            onChange={(e) => setNewMessage(e.target.value)}
            // --- END FIX ---
            disabled={isSending || isLimitReached}
            className="flex-1 bg-background"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSending || !newMessage.trim() || isLimitReached}
            className="bg-[#5b5dda] hover:bg-[#4a4ab5] flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {/* Premium Upgrade Payment Dialog */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        {/* ... (Your existing payment dialog JSX) ... */}
      </Dialog>

      {/* Clear Chat Confirmation Dialog */}
      <Dialog open={showClearChatDialog} onOpenChange={setShowClearChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear this chat?</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all messages in this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" className="bg-yellow-600 hover:bg-yellow-700" onClick={handleClearChat}>
              Clear Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Chat Confirmation Dialog */}
      <Dialog open={showDeleteChatDialog} onOpenChange={setShowDeleteChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this chat?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this entire conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteChat}>
              Delete Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatBox;