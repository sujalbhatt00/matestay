import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2, MapPin, Briefcase, Zap, Info } from 'lucide-react';
import { toast } from "sonner";
import { calculateMatchingPercentage, getMatchingInsight } from '@/utils/matchingAlgorithm';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const RoommateCard = ({ roommate }) => {
  const { user } = useAuth();
  const { addConversation } = useChat();
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [showMatchingTooltip, setShowMatchingTooltip] = useState(false);

  if (!roommate) return null;

  const isOwnProfile = user && user._id === roommate._id;
  
  // Calculate matching percentage
  const matchingPercentage = !isOwnProfile && user ? calculateMatchingPercentage(user, roommate) : 0;
  const matchingInsight = getMatchingInsight(matchingPercentage);

  const matchValueClass =
    matchingPercentage >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : matchingPercentage >= 50
      ? "text-blue-600 dark:text-blue-400"
      : "text-amber-600 dark:text-amber-400";

  const insightBadgeClass =
    matchingPercentage >= 75
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      : matchingPercentage >= 50
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";

  // Debug log with detailed info
  useEffect(() => {
    console.log('🔍 RoommateCard Debug:', {
      roommateId: roommate?._id,
      roommateName: roommate?.name,
      userId: user?._id,
      isOwnProfile,
      matchingPercentage,
      roommateFields: {
        location: roommate?.location,
        budget: roommate?.budget,
        gender: roommate?.gender,
        age: roommate?.age,
      },
      userFields: {
        location: user?.location,
        budget: user?.budget,
        gender: user?.gender,
        age: user?.age,
      }
    });
  }, [roommate, user]);

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

  return (
    <div
      className="w-full rounded-lg border border-border bg-white dark:bg-neutral-900 hover:border-foreground/30 transition-all duration-200 hover:shadow-md cursor-pointer group flex flex-col h-full relative"
      onClick={() => navigate(`/profile/${roommate._id}`)}
    >
      <div className="relative h-36 sm:h-44 bg-gray-300 dark:bg-gray-700 flex-shrink-0 rounded-t-lg overflow-visible">
        <img
          src={roommate.profilePic || defaultAvatar}
          alt={roommate.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
        
        {/* Matching Badge - Top Right Corner - Improved Design */}
        {!isOwnProfile && (
          <div className="absolute top-3 right-3 z-40">
            <div
              onMouseEnter={() => setShowMatchingTooltip(true)}
              onMouseLeave={() => setShowMatchingTooltip(false)}
              onClick={(e) => {
                e.stopPropagation();
                setShowMatchingTooltip((prev) => !prev);
              }}
              className="relative rounded-2xl border-2 bg-gradient-to-br from-background to-background/95 backdrop-blur-md px-3 py-2.5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-help hover:border-primary/60"
              style={{
                borderColor: matchingPercentage >= 75 ? '#10b981' : matchingPercentage >= 50 ? '#3b82f6' : '#f59e0b'
              }}
            >
              <div className="flex items-center gap-2.5">
                {/* Circular Progress Indicator */}
                <div className="relative w-8 h-8 flex-shrink-0">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/20" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeDasharray={`${matchingPercentage * 1.0067} 100.53`}
                      className={`transition-all duration-500 ${matchValueClass}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-[10px] font-bold ${matchValueClass}`}>{matchingPercentage || 0}</span>
                  </div>
                </div>
                <div className="leading-tight min-w-fit">
                  <p className="text-[9px] uppercase tracking-widest font-semibold text-muted-foreground/80">Match</p>
                  <p className={`text-sm font-bold ${matchValueClass}`}>{matchingPercentage || 0}%</p>
                </div>
              </div>
            </div>
            
            {/* Tooltip */}
            {showMatchingTooltip && (
              <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl border-2 bg-popover text-popover-foreground text-xs p-5 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm"
                style={{
                  borderColor: matchingPercentage >= 75 ? '#10b981' : matchingPercentage >= 50 ? '#3b82f6' : '#f59e0b'
                }}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-bold flex items-center gap-2.5 text-sm">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                        backgroundColor: matchingPercentage >= 75 ? '#10b98120' : matchingPercentage >= 50 ? '#3b82f620' : '#f59e0b20'
                      }}>
                        <Zap className="h-4 w-4" style={{
                          color: matchingPercentage >= 75 ? '#10b981' : matchingPercentage >= 50 ? '#3b82f6' : '#f59e0b'
                        }} />
                      </div>
                      Compatibility Score
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${insightBadgeClass}`}>
                      {matchingInsight}
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted/50 rounded-lg h-1.5 overflow-hidden border border-border/50">
                    <div 
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${matchingPercentage}%`,
                        backgroundColor: matchingPercentage >= 75 ? '#10b981' : matchingPercentage >= 50 ? '#3b82f6' : '#f59e0b'
                      }}
                    ></div>
                  </div>
                  
                  <div className="rounded-xl border border-border/50 bg-muted/40 p-3.5 space-y-2">
                    <p className="text-muted-foreground text-xs font-bold mb-3 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{
                        backgroundColor: matchingPercentage >= 75 ? '#10b981' : matchingPercentage >= 50 ? '#3b82f6' : '#f59e0b'
                      }}></span>
                      8 Matching Factors
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Location match (20 pts)</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Budget compatibility (15 pts)</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Gender match (15 pts)</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Age range (15 pts)</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Occupation status (10 pts)</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Smoking preference (10 pts)</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Sleep schedule (5 pts)</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0"></div>
                        <span>Cleanliness level (5 pts)</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground italic text-xs bg-muted/50 rounded-lg p-2.5 border border-border/30">
                    💡 Complete your profile for more accurate compatibility scores.
                  </p>
                </div>
                {/* Arrow */}
                <div className="absolute top-0 right-8 transform -translate-y-1 w-3 h-3 bg-popover border-t-2 border-r-2 rotate-45" style={{
                  borderColor: matchingPercentage >= 75 ? '#10b981' : matchingPercentage >= 50 ? '#3b82f6' : '#f59e0b'
                }}></div>
              </div>
            )}
          </div>
        )}
        
        {roommate.isPremium && (
          <div className="absolute top-3 left-3 z-30">
            <Badge variant="secondary" className="text-xs">Premium</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3 sm:p-4 space-y-2 flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold line-clamp-1">{roommate.name}</h3>
            {roommate.age && <p className="text-[11px] text-muted-foreground">{roommate.age} years</p>}
          </div>
          {isOwnProfile && <Badge variant="outline" className="text-[10px] flex-shrink-0">You</Badge>}
        </div>

        {roommate.occupation && (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground line-clamp-1">{roommate.occupation}</p>
          </div>
        )}

        {roommate.location && (
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <p className="text-muted-foreground line-clamp-1">{roommate.location}</p>
          </div>
        )}

        {roommate.bio && (
          <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2">"{roommate.bio}"</p>
        )}

        <div className="flex gap-2 pt-2 mt-auto">
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile`);
              }}
              className="w-full h-8 rounded-lg text-xs"
            >
              Edit Profile
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
                className="flex-1 h-8 rounded-lg text-[10px]"
              >
                View
              </Button>

              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartChat();
                }}
                disabled={isStartingChat}
                className="flex-1 h-8 rounded-lg text-[10px] bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100"
              >
                {isStartingChat ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <MessageSquare className="h-3 w-3" />
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default RoommateCard;
