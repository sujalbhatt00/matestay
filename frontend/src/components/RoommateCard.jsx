import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2, User } from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const RoommateCard = ({ roommate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Check if the card is for the logged-in user
  const isOwnProfile = user && user._id === roommate._id;

  const handleStartChat = async () => {
    if (!user) {
      toast.error("Please log in to start a chat.");
      return;
    }

    if (isOwnProfile) {
      toast.info("You cannot start a chat with yourself.");
      return;
    }

    setIsStartingChat(true);
    try {
      const res = await axios.post('/conversations', {
        receiverId: roommate._id,
      });

      // Defensive: fallback if no id
      if (res.data && res.data._id) {
        navigate(`/chat/${res.data._id}`);
      } else {
        toast.error("Could not start chat. Please try again later.");
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
      toast.error("Could not start chat. Please try again later.");
    } finally {
      setIsStartingChat(false);
    }
  };

  if (!roommate) {
    return null;
  }

  return (
    <Card
      className="w-full max-w-sm overflow-hidden transition-transform transform hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/profile/${roommate._id}`)}
    >
      <CardContent className="p-4 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
          <AvatarImage src={roommate.profilePic || defaultAvatar} alt={roommate.name} />
          <AvatarFallback>{roommate.name ? roommate.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>

        {/* Display name and "You" badge */}
        <div className="flex justify-center items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-foreground">{roommate.name}</h3>
          {isOwnProfile && <Badge variant="secondary">You</Badge>}
        </div>

        <p className="text-sm text-muted-foreground mb-4">{roommate.occupation || 'Student'}</p>

        <div className="flex justify-center space-x-2">
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={e => {
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
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/profile/${roommate._id}`);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
              <Button
                size="sm"
                onClick={e => {
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
                {isStartingChat ? 'Starting...' : 'Message'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoommateCard;