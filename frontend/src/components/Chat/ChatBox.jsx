import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { toast } from 'sonner';
import ChatMessage from './ChatMessage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageSquare, ArrowLeft, Crown, Check, Sparkles, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ChatBox = ({ currentChat, hasConversations, loading }) => {

  const { user } = useAuth();
  const { socket, setConversations, onlineUsers } = useChat();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const scrollRef = useRef();
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const otherMember = currentChat?.members.find(m => m._id !== user._id);
  const MESSAGE_LIMIT = 10;
  const isLimitReached = !user?.isPremium && userMessageCount >= MESSAGE_LIMIT;

  const isOnline = onlineUsers?.some(u => u.userId === otherMember?._id);

  // Reset when conversation changes
  useEffect(() => {
    if (!conversationId) return;
    setMessages([]);
    setNewMessage("");
    setUserMessageCount(0);
    setInitialLoadDone(false);
    setIsLoadingMessages(true);
  }, [conversationId]);

  // Load messages
  useEffect(() => {
    if (!currentChat?._id) return;

    const loadMsgs = async () => {
      try {
        const res = await axios.get(`/messages/${currentChat._id}`);
        setMessages(res.data.messages || []);
        setUserMessageCount(res.data.userMessageCount || 0);
      } catch {
        toast.error("Could not load messages");
      } finally {
        setIsLoadingMessages(false);

        // Mark initial load complete after slight delay for smoother UI
        setTimeout(() => setInitialLoadDone(true), 150);
      }
    };

    loadMsgs();
  }, [currentChat?._id]);

  // Receive messages live
  useEffect(() => {
    if (!socket) return;

    const handleGet = (msg) => {
      if (msg.conversationId === currentChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("getMessage", handleGet);
    socket.on("receiveMessage", handleGet);

    return () => {
      socket.off("getMessage", handleGet);
      socket.off("receiveMessage", handleGet);
    };
  }, [socket, currentChat]);

  // Smooth scroll (after initial load)
  useEffect(() => {
    if (!initialLoadDone) return;

    scrollRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (isLimitReached) {
      setShowLimitDialog(true);
      return;
    }

    setIsSending(true);

    try {
      const res = await axios.post("/messages", {
        conversationId: currentChat._id,
        text: newMessage,
      });

      const saved = res.data;

      setMessages(prev => [...prev, saved]);
      setUserMessageCount(prev => prev + 1);
      setNewMessage("");

      if (socket) {
        socket.emit("sendMessage", {
          ...saved,
          receiverId: otherMember._id,
          senderId: user._id
        });
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MessageSquare className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-xl font-semibold">Select a conversation</h3>
        <p className="text-muted-foreground">Choose a chat to begin</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-md border-b px-4 py-3 shadow-sm flex items-center gap-3">

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => navigate("/chat")}
        >
          <ArrowLeft />
        </Button>

        <div className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${otherMember._id}`)}
        >
          <Avatar className="h-11 w-11">
            <AvatarImage src={otherMember?.profilePic || defaultAvatar} />
            <AvatarFallback>{otherMember?.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-semibold text-lg">{otherMember?.name}</span>
            <span className={`text-xs ${isOnline ? "text-green-500" : "text-muted-foreground"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gradient-to-b from-background via-card/20 to-background">

        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
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

      {/* INPUT */}
      <form onSubmit={handleSubmit} className="p-3 bg-card/90 border-t backdrop-blur-md">
        <div className="flex items-center gap-2">

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isLimitReached ? "Upgrade to continue…" : "Type a message…"}
            disabled={isSending || isLimitReached}
            className="flex-1 rounded-full px-4 py-2 shadow-sm"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || isSending || isLimitReached}
            className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90"
          >
            {isSending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>

        </div>
      </form>

      {/* PREMIUM DIALOG — unchanged */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Upgrade to Premium</DialogTitle>
            <DialogDescription className="text-center">
              You reached your free messaging limit.
            </DialogDescription>
          </DialogHeader>

          {/* ... your premium UI unchanged ... */}

          <DialogFooter>
            <Button variant="ghost" className="w-full" onClick={() => setShowLimitDialog(false)}>
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ChatBox;
