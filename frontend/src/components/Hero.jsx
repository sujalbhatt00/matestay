import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import heroImage from "../assets/hero-image.jpg"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "@/api/axiosInstance";

const Hero = () => { 
  const [location, setLocation] = useState("");
  const [stats, setStats] = useState({
    totalListings: 0,
    totalUsers: 0,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/properties/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({
          totalListings: 0,
          totalUsers: 0,
        });
      }
    };

    fetchStats();
  }, []);

  // ✅ UPDATED: Navigate to location search page (shows both properties and users)
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (!location.trim()) {
      return; // Don't search if location is empty
    }
    
    // Navigate to location search page with location parameter
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern shared living space"
          className="w-full h-full object-cover opacity-10 dark:opacity-10"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Find Your Perfect Roommate
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Connect with compatible roommates and discover your ideal living
            space. Safe, verified, and hassle-free.
          </p>

          <form 
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-6 max-w-2xl mx-auto border border-border shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <LocationCombobox
                  value={location}
                  onChange={setLocation}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-[#5b5dda] text-white hover:bg-[#4a4ab5]"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>🏠 {stats.totalListings > 0 ? `${stats.totalListings.toLocaleString()}+` : '0'} Listings</span>
            <span>👥 {stats.totalUsers > 0 ? `${stats.totalUsers.toLocaleString()}+` : '0'} Users</span>
            <span>✓ Verified Profiles</span>
            <span>💬 Instant Messaging</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;