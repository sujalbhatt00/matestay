import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2, User } from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const RoommateCard = ({ roommate }) => {
  const { user } = useAuth();
  const { addConversation } = useChat();
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);

  if (!roommate) return null;

  const isOwnProfile = user && user._id === roommate._id;

  const handleStartChat = async () => {
    if (!user) return toast.error("Please log in to start chat.");
    if (isOwnProfile) return toast.info("You cannot chat with yourself.");

    setIsStartingChat(true);

    try {
      const res = await axios.post('/conversations', {
        receiverId: roommate._id,
      });

      addConversation(res.data);
      navigate(`/chat/${res.data._id}`);

    } catch (err) {
      console.error(err);
      toast.error("Could not start chat.");
    } finally {
      setIsStartingChat(false);
    }
  };

  // 🔵 MOBILE circular card
  const MobileCard = () => (
    <div
      className="flex flex-col items-center cursor-pointer md:hidden"
      onClick={() => navigate(`/profile/${roommate._id}`)}
    >
      <Avatar className="h-20 w-20 mb-1 border-2 border-primary/40">
        <AvatarImage src={roommate.profilePic || defaultAvatar} />
        <AvatarFallback>{roommate.name[0]}</AvatarFallback>
      </Avatar>

      <p className="text-[11px] font-medium text-center truncate w-20">
        {roommate.name}
      </p>
    </div>
  );

  // 🔵 DESKTOP full card
  const DesktopCard = () => (
    <Card
      className="hidden md:block w-full max-w-sm overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/profile/${roommate._id}`)}
    >
      <CardContent className="p-4 text-center">

        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
          <AvatarImage src={roommate.profilePic || defaultAvatar} />
          <AvatarFallback>{roommate.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex justify-center items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold">{roommate.name}</h3>
          {isOwnProfile && <Badge variant="secondary">You</Badge>}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {roommate.occupation || "Student"}
        </p>

        <div className="flex justify-center space-x-2">
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile`);
              }}
              className="w-full"
            >
              <User className="mr-2 h-4 w-4" />
              View Your Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${roommate._id}`);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>

              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartChat();
                }}
                disabled={isStartingChat}
              >
                {isStartingChat ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="mr-2 h-4 w-4" />
                )}
                {isStartingChat ? "Starting..." : "Message"}
              </Button>
            </>
          )}
        </div>

      </CardContent>
    </Card>
  );

  return (
    <>
      <MobileCard />
      <DesktopCard />
    </>
  );
};

export default RoommateCard;
