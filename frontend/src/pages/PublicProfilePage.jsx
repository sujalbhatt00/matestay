import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Mail, MapPin, DollarSign, User, Calendar, Phone, MessageSquare, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/user/public-profile/${userId}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Could not load profile.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleStartChat = async () => {
    if (!loggedInUser) {
      toast.error("Please log in to start a chat.");
      return;
    }
    if (loggedInUser._id === userId) {
      toast.info("You cannot start a chat with yourself.");
      return;
    }
    setIsStartingChat(true);
    try {
      const res = await axios.post('/conversations', { receiverId: userId });
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      toast.error("Could not start chat. Please try again later.");
    } finally {
      setIsStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center pt-32">
        <h2 className="text-2xl font-bold">Profile Not Found</h2>
        <p className="text-muted-foreground">This user may not exist or has not completed their profile.</p>
      </div>
    );
  }

  const { name, occupation, location, bio, age, gender, budget, lifestyle = [], profilePic, lookingFor } = profile;

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <div className="bg-card p-6 md:p-10 rounded-lg border border-border shadow-lg max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <img src={profilePic || defaultAvatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 ring-4 ring-primary/10" />
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-lg text-muted-foreground">{occupation || 'No occupation set'}</p>
            {location && <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-1"><MapPin className="w-4 h-4" /> {location}</p>}
          </div>
          {loggedInUser && loggedInUser._id !== userId && (
            <Button onClick={handleStartChat} disabled={isStartingChat}>
              {isStartingChat ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
              {isStartingChat ? 'Starting...' : 'Message'}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-muted-foreground text-sm">{bio || 'No bio available.'}</p>
          </div>
          <div className="bg-background p-4 rounded-lg border space-y-3">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <p className="flex items-center text-sm gap-2"><User className="w-4 h-4 text-primary" /><strong>Gender:</strong> {gender || 'Not set'}</p>
            <p className="flex items-center text-sm gap-2"><Calendar className="w-4 h-4 text-primary" /><strong>Age:</strong> {age || 'Not set'}</p>
            <p className="flex items-center text-sm gap-2"><DollarSign className="w-4 h-4 text-primary" /><strong>Budget:</strong> {budget ? `₹${budget}` : 'Not set'}</p>
            {/* --- THIS IS THE CHANGE: Display "Looking For" --- */}
            <p className="flex items-center text-sm gap-2"><Search className="w-4 h-4 text-primary" /><strong>Looking for:</strong> {lookingFor || 'Any'}</p>
            {/* --- END CHANGE --- */}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Lifestyle</h3>
          {lifestyle.length > 0 ? (
            <div className="flex flex-wrap gap-2">{lifestyle.map(tag => <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>)}</div>
          ) : (
            <p className="text-muted-foreground text-sm">No lifestyle tags selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;