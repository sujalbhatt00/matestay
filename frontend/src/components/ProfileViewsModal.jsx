import React, { useEffect, useState } from 'react';
import axios from '@/api/axiosInstance';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Lock, Crown } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ProfileViewsModal = ({ isOpen, onClose }) => {
  const [views, setViews] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchViews();
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const fetchViews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/user/views');
      setViews(res.data || []);
      setIsPremium(true);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setIsPremium(false);
        setViewCount(error.response.data?.count || 0);
      } else {
        console.error("Failed to fetch profile views:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // FIX: Only render modal content if open
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Who Viewed Your Profile
          </DialogTitle>
          <DialogDescription>
            See the people who have visited your profile recently.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isPremium ? (
            views.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No one has viewed your profile yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {views.map((view) => {
                  const viewer = view?.viewerId || {};

                  return (
                    <div
                      key={view?._id || Math.random()}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar
                        className="h-10 w-10 cursor-pointer"
                        onClick={() => {
                          if (viewer?._id) {
                            onClose();
                            navigate(`/profile/${viewer._id}`);
                          }
                        }}
                      >
                        <AvatarImage src={viewer?.profilePic || defaultAvatar} />
                        <AvatarFallback>{viewer?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-sm truncate cursor-pointer hover:underline"
                          onClick={() => {
                            if (viewer?._id) {
                              onClose();
                              navigate(`/profile/${viewer._id}`);
                            }
                          }}
                        >
                          {viewer?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {viewer?.occupation || "User"}
                        </p>
                      </div>

                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {view?.viewedAt
                          ? formatDistanceToNow(new Date(view.viewedAt), { addSuffix: true })
                          : "Some time ago"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-4 space-y-6">
              <div className="relative p-6 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20">
                <p className="text-lg font-semibold text-foreground">
                  {viewCount > 0 ? `${viewCount} people viewed your profile` : "See who viewed you"}
                </p>

                <div
                  className="mt-4 space-y-3 opacity-50 blur-sm select-none pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                    <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                    <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                    <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px]">
                  <Lock className="h-12 w-12 text-yellow-500 drop-shadow-md" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Upgrade to Premium to see exactly who is interested in you.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  onClick={() => {
                    onClose();
                    navigate('/premium');
                  }}
                >
                  <Crown className="mr-2 h-4 w-4" /> Unlock Viewers
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileViewsModal;