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
import { Send, Loader2, MessageSquare, ArrowLeft, Crown, AlertCircle, Check, Sparkles, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ChatBox = ({ currentChat, hasConversations }) => {
  const { user } = useAuth();
  const { socket, setConversations, onlineUsers } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const scrollRef = useRef();
  const navigate = useNavigate();

  const otherMember = currentChat?.members.find(m => m._id !== user._id);
  const MESSAGE_LIMIT = 10;
  const remainingMessages = Math.max(0, MESSAGE_LIMIT - userMessageCount);
  const isLimitReached = !user?.isPremium && userMessageCount >= MESSAGE_LIMIT;
  const isOnline = onlineUsers?.some(u => u.userId === otherMember?._id);

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
  }, [socket, currentChat, setConversations]);

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradeClick = async (planType) => {
    setProcessingPayment(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setProcessingPayment(false);
        return;
      }
      const { data: orderData } = await axios.post('/payments/create-order', {
        plan: planType,
      });
      if (!orderData.keyId || !orderData.orderId) {
        toast.error('Payment configuration error. Please try again.');
        setProcessingPayment(false);
        return;
      }
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Matestay Premium',
        description: `${planType === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.isPremium) {
              toast.success('🎉 Payment successful! You are now a Premium member!');
              setShowLimitDialog(false);
              const { data: userData } = await axios.get('/user/profile');
              if (userData) {
                localStorage.setItem('matestay_user', JSON.stringify(userData));
                window.location.reload();
              }
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#5b5dda',
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
            toast.info('Payment cancelled');
          }
        }
      };
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      setProcessingPayment(false);
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background p-8 text-center">
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

  // --- WhatsApp-like UI update below ---

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/chat')}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${otherMember._id}`)}
        >
          <Avatar className="h-11 w-11 ring-2 ring-primary/10">
            <AvatarImage src={otherMember?.profilePic || defaultAvatar} alt={otherMember?.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {otherMember?.name?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate hover:underline">
              {otherMember?.name || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {otherMember?.occupation || "No occupation"}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${isOnline ? "text-green-600" : "text-muted-foreground"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
              {otherMember?.location && (
                <span className="text-xs text-muted-foreground">{otherMember.location}</span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={e => {
              e.stopPropagation();
              navigate(`/profile/${otherMember._id}`);
            }}
            title="View Profile"
          >
            <User className="h-5 w-5 text-primary" />
          </Button>
        </div>
        {!user?.isPremium && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted ml-auto">
            <span className={`text-xs font-medium ${isLimitReached ? 'text-red-500' : 'text-muted-foreground'}`}>
              {isLimitReached ? 'Limit reached' : `${remainingMessages}/${MESSAGE_LIMIT} left`}
            </span>
            {isLimitReached && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        )}
      </div>

      {/* Alerts for message limit */}
      {!user?.isPremium && remainingMessages <= 3 && remainingMessages > 0 && (
        <Alert className="m-4 border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm">
            You have {remainingMessages} {remainingMessages === 1 ? 'message' : 'messages'} left in this conversation.{' '}
            <Button
              variant="link"
              className="h-auto p-0 text-yellow-500 hover:text-yellow-600"
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
            You've reached your message limit for this conversation.{' '}
            <Button
              variant="link"
              className="h-auto p-0 text-red-500 hover:text-red-600 font-semibold"
              onClick={() => setShowLimitDialog(true)}
            >
              Upgrade to Premium (₹1/month)
            </Button>
            {' '}to continue chatting.
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-2 md:py-4 space-y-3 custom-scrollbar bg-background">
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
      <form onSubmit={handleSubmit} className="px-2 md:px-4 py-3 border-t bg-card">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder={isLimitReached ? "Upgrade to Premium to continue..." : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending || isLimitReached}
            className="flex-1 bg-background"
            autoComplete="off"
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full">
                <Crown className="h-12 w-12 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-3xl">Upgrade to Premium</DialogTitle>
            <DialogDescription className="text-center text-base">
              You've used all your free messages. Choose a plan to continue chatting!
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 my-4">
            {/* Monthly Plan */}
            <div className="border-2 border-primary/20 rounded-xl p-6 hover:border-primary transition-all">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-2">Monthly</h3>
                <div className="text-4xl font-bold text-primary">₹1</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Unlimited messaging</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Featured profile</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Ad-free experience</span>
                </li>
              </ul>
              <Button
                onClick={() => handleUpgradeClick('monthly')}
                disabled={processingPayment}
                className="w-full"
                variant="outline"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Choose Monthly
                  </>
                )}
              </Button>
            </div>
            {/* Yearly Plan */}
            <div className="border-2 border-primary rounded-xl p-6 bg-primary/5 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  SAVE ₹2
                </span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-2">Yearly</h3>
                <div className="text-4xl font-bold text-primary">₹10</div>
                <p className="text-sm text-muted-foreground">per year</p>
                <p className="text-xs text-green-600 font-semibold mt-1">Save 17%</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Everything in Monthly</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Exclusive yearly badge</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Early access to features</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Priority listing placement</span>
                </li>
              </ul>
              <Button
                onClick={() => handleUpgradeClick('yearly')}
                disabled={processingPayment}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Choose Yearly
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>✓ Secure payment via Razorpay</p>
            <p>✓ Cancel anytime</p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowLimitDialog(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatBox;