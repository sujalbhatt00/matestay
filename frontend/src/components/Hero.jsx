import React, { useState, useEffect } from "react";
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

  // Auto-expand filters if showFilters=1
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
    <section className="relative pt-32 pb-24 overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/90 -z-10" />

      <div className="relative z-[2] container mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* OLD TITLE (you wanted old theme) */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fadeIn">
          Find Your Perfect Roommate & Room
        </h1>

        <p className="text-lg text-muted-foreground mb-10 animate-fadeIn delay-100">
          Safe, verified and instant matches.
        </p>

        {/* SEARCH BOX WITH FILTERS (OLD UI but new styling) */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto animate-fadeIn delay-200">
          <div
            className={`bg-card border border-border rounded-2xl shadow-xl 
            px-6 py-6 flex flex-col gap-5 transition-all 
            ${focused ? "scale-[1.02] shadow-primary/20" : ""}`}
          >

            {/* Top Row */}
            <div className="flex flex-col md:flex-row items-center gap-4">

              {/* Type selector */}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full md:w-40 px-3 py-2 rounded-xl bg-muted/40 text-sm font-medium border"
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

              {/* Search button */}
              <Button
                type="submit"
                className="h-11 rounded-full px-8 text-white font-semibold"
                style={{ backgroundColor: "#5b5dda" }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Expand Filters */}
            <button
              type="button"
              onClick={() => setExpandedFilters((v) => !v)}
              className="flex items-center gap-2 text-primary text-sm font-medium mx-auto"
            >
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </button>

            {/* Filters section */}
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
        <div className="flex flex-wrap justify-center gap-4 mt-10 text-sm text-muted-foreground animate-fadeIn delay-300">
          <span>{stats.totalListings}+ Listings</span>
          <span>{stats.totalUsers}+ Users</span>
          <span>Verified Profiles</span>
          <span>Instant Messaging</span>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-fadeIn {
            opacity: 0;
            animation: fadeIn 1s ease forwards;
          }
          .delay-100 { animation-delay: .1s; }
          .delay-200 { animation-delay: .2s; }
          .delay-300 { animation-delay: .3s; }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeDown {
            animation: fadeDown .3s ease-out forwards;
          }
          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </section>
  );
};

export default Hero;