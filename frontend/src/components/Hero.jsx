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
  const [focused, setFocused] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!location.trim()) return;
    navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern shared living space"
          className="w-full h-full object-cover opacity-10 dark:opacity-10"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* HEADING */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Find Your Perfect Roommate
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Connect with compatible roommates and discover your ideal living
            space. Safe, verified, and hassle-free.
          </p>

          {/* Animated Modern Search Bar */}
          <form 
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
          >
            <div
              className={`
                flex items-center gap-3 rounded-full bg-card border border-border shadow-md
                transition-all duration-300 ease-out px-4 py-3

                ${focused ? "shadow-xl scale-[1.03] border-primary/60" : "shadow-lg"}
              `}
            >
              
              {/* Icon */}
              <Search 
                className={`h-5 w-5 transition-all duration-300 
                ${focused ? "text-primary opacity-100" : "text-muted-foreground opacity-70"}`}
              />

              {/* Location Combobox */}
              <div className="flex-1">
                <LocationCombobox
                  value={location}
                  onChange={setLocation}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>

              {/* Animated Button */}
              <Button
                type="submit"
                className={`rounded-full px-6 h-10 font-medium transition-all duration-300
                  bg-[#5b5dda] hover:bg-[#4a4ab5] text-white
                  ${focused ? "scale-105 shadow-md" : "scale-100"}
                `}
              >
                Search
              </Button>
            </div>
          </form>

          {/* STATS */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span> {stats.totalListings > 0 ? `${stats.totalListings.toLocaleString()}+` : '0'} Listings</span>
            <span> {stats.totalUsers > 0 ? `${stats.totalUsers.toLocaleString()}+` : '0'} Users</span>
            <span> Verified Profiles</span>
            <span> Instant Messaging</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
