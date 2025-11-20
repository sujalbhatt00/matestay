import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import heroImage from "../assets/hero-image.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "@/api/axiosInstance";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("roommate");
  const [gender, setGender] = useState("Any");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [focused, setFocused] = useState(false);

  const [stats, setStats] = useState({
    totalListings: 0,
    totalUsers: 0,
  });

  const navigate = useNavigate();
  const locationObj = useLocation();

  // Auto-expand filters if showFilters=1 in URL and set type if present
  useEffect(() => {
    const params = new URLSearchParams(locationObj.search);
    if (params.get("showFilters") === "1") {
      setExpandedFilters(true);
      if (params.get("type")) setType(params.get("type"));
    }
  }, [locationObj.search]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/properties/stats");
        setStats(response.data);
      } catch {
        setStats({ totalListings: 0, totalUsers: 0 });
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    const params = new URLSearchParams();
    params.append("location", location);
    params.append("type", type);

    if (type === "roommate") {
      if (gender && gender !== "Any") params.append("gender", gender);
      if (budget) params.append("budget", budget);
    }
    if (type === "room") {
      if (budget) params.append("budget", budget);
      if (propertyType) params.append("propertyType", propertyType);
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-20 animate-softFade"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/80 z-[1]" />

      <div className="relative z-[2] container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-slideUp">

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight drop-shadow-md">
            Find Your Perfect Roommate & Room
          </h1>

          <p className="text-lg text-muted-foreground mb-10">
            Safe, verified and instant matches.
          </p>

          {/* ================================
              UPDATED MODERN SEARCH BOX
            ================================= */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto animate-fadeUp">
            <div
              className={`
                bg-card border border-border rounded-2xl shadow-xl px-5 py-6
                flex flex-col gap-4 transition-all
                ${focused ? "scale-[1.02] shadow-primary/20" : ""}
              `}
            >

              {/* Main row */}
              <div className="flex flex-col md:flex-row items-center gap-4">

                {/* Type */}
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full md:w-40 px-3 py-2 rounded-xl bg-muted/40 text-sm font-medium"
                >
                  <option value="roommate">Roommates</option>
                  <option value="room">Rooms</option>
                </select>

                {/* Location */}
                <div className="flex-1 w-full">
                  <LocationCombobox
                    value={location}
                    onChange={setLocation}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </div>

                {/* SEARCH BUTTON */}
                <Button
                  type="submit"
                  className="h-11 rounded-full px-8 text-white font-semibold"
                  style={{
                    backgroundColor: "#5b5dda",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a4ab5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5b5dda")}
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </div>
                </Button>
              </div>

              {/* Expand Filters Button */}
              <button
                type="button"
                onClick={() => setExpandedFilters((v) => !v)}
                className="flex items-center gap-2 text-primary text-sm font-medium mx-auto"
              >
                <SlidersHorizontal className="h-4 w-4" />
                More Filters
              </button>

              {/* Expanded Filters */}
              {expandedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeDown">

                  {type === "roommate" && (
                    <div>
                      <label className="text-xs font-medium">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 px-3 py-2 rounded-xl border w-full"
                      >
                        <option value="Any">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium">Max Budget (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="mt-1 px-3 py-2 rounded-xl border w-full"
                      placeholder="e.g. 10000"
                    />
                  </div>

                  {type === "room" && (
                    <div>
                      <label className="text-xs font-medium">Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="mt-1 px-3 py-2 rounded-xl border w-full"
                      >
                        <option value="">Any</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="PG">PG</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-10 text-sm text-muted-foreground animate-fadeUp delay-200">
            <span>{stats.totalListings}+ Listings</span>
            <span>{stats.totalUsers}+ Users</span>
            <span>Verified Profiles</span>
            <span>Instant Messaging</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-slideUp {
            animation: slideUp 0.7s ease-out forwards;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeUp {
            animation: fadeUp 1s ease-out forwards;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeDown {
            animation: fadeDown 0.4s ease-out forwards;
          }
          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-softFade {
            animation: softFade 2s ease forwards;
          }
          @keyframes softFade {
            from { opacity: 0; }
            to { opacity: 0.20; }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;