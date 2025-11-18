import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import { Users, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutUs = () => {
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/user/count');
        setUserCount(data.count);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setUserCount("100+"); // Fallback if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 pt-24 min-h-screen">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Redefining Shared Living
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Matestay isn't just about finding a room; it's about finding your people. 
          We verify every profile and property to ensure safety, trust, and compatibility.
        </p>
      </div>

      {/* Stats / Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Card 1: Verified */}
        <Card className="text-center hover:border-primary/50 transition-colors bg-card border-border">
          <CardContent className="pt-6">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-2">100% Verified</h3>
            <p className="text-muted-foreground">Safe & secure community</p>
          </CardContent>
        </Card>

        {/* Card 2: Dynamic User Count */}
        <Card className="text-center hover:border-primary/50 transition-colors bg-card border-border">
          <CardContent className="pt-6">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-2 flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>{userCount} Users</span>
              )}
            </h3>
            <p className="text-muted-foreground">Joined our family</p>
          </CardContent>
        </Card>

        {/* Card 3: Made with Love */}
        <Card className="text-center hover:border-primary/50 transition-colors bg-card border-border">
          <CardContent className="pt-6">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-2">Made with Love</h3>
            <p className="text-muted-foreground">In Dehradun, India</p>
          </CardContent>
        </Card>
      </div>

      {/* Founders Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Meet the Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Shashank */}
          <div className="flex flex-col items-center text-center p-8 bg-secondary/20 border border-border rounded-2xl hover:shadow-lg transition-all">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
              {/* You can replace this URL with your actual photo URL */}
              <AvatarImage src="https://github.com/shashank028R.png" /> 
              <AvatarFallback className="text-2xl bg-primary text-white">SK</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold">Shashank Kumar</h3>
            <p className="text-primary font-medium mb-3">Co-Founder</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Passionate about building scalable tech solutions and solving real-world problems through code.
            </p>
          </div>

          {/* Sujal */}
          <div className="flex flex-col items-center text-center p-8 bg-secondary/20 border border-border rounded-2xl hover:shadow-lg transition-all">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
              {/* You can replace this URL with Sujal's actual photo URL */}
              <AvatarImage src="https://github.com/sujalbhatt00.png" />
              <AvatarFallback className="text-2xl bg-primary text-white">SB</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold">Sujal Bhatt</h3>
            <p className="text-primary font-medium mb-3">Co-Founder</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Driven by innovation and creating seamless user experiences for the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;