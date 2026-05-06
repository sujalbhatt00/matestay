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

  useEffect(() => {
    const params = new URLSearchParams(locationObj.search);

    if (params.get("showFilters") === "1") {
      setExpandedFilters(true);

      if (params.get("type")) {
        setType(params.get("type"));
      }
    }
  }, [locationObj.search]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/properties/stats");
        setStats(response.data);
      } catch {
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

    const params = new URLSearchParams();

    params.append("location", location);
    params.append("type", type);

    if (type === "roommate") {
      if (gender && gender !== "Any") {
        params.append("gender", gender);
      }

      if (budget) {
        params.append("budget", budget);
      }
    }

    if (type === "room") {
      if (budget) {
        params.append("budget", budget);
      }

      if (propertyType) {
        params.append("propertyType", propertyType);
      }
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-14 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Hero Background"
          className="h-full w-full object-cover opacity-40"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/90 -z-10" />

      <div className="container relative z-[2] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="animate-fadeIn text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 sm:mb-6 max-w-5xl mx-auto">
          Find your perfect flat and flatmate
        </h1>

        <p className="animate-fadeIn delay-100 text-sm sm:text-base md:text-lg text-muted-foreground mb-7 sm:mb-10 max-w-2xl mx-auto px-2">
          Safe, verified and instant matches.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto animate-fadeIn delay-200"
        >
          <div
            className={`bg-card border border-border rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 transition-all duration-300 ${
              focused ? "scale-[1.01] shadow-primary/20" : ""
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full lg:w-36 px-3 py-2.5 rounded-xl bg-muted/40 border text-sm font-medium h-11"
              >
                <option value="roommate">Roommates</option>
                <option value="room">Rooms</option>
              </select>

              <div className="flex-1 w-full">
                <LocationCombobox
                  value={location}
                  onChange={setLocation}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full lg:w-auto rounded-xl lg:rounded-full px-6 sm:px-8 text-sm font-semibold"
                style={{ backgroundColor: "#5b5dda" }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setExpandedFilters((v) => !v)}
              className="flex items-center justify-center gap-2 text-primary text-sm font-medium mx-auto mt-4"
            >
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </button>

            {expandedFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 animate-fadeDown">
                {type === "roommate" && (
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Gender
                    </label>

                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-11 border rounded-xl px-3 text-sm bg-background"
                    >
                      <option value="Any">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Max Budget (₹)
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full h-11 border rounded-xl px-3 text-sm bg-background"
                  />
                </div>

                {type === "room" && (
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Property Type
                    </label>

                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full h-11 border rounded-xl px-3 text-sm bg-background"
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

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mt-8 sm:mt-10 text-xs sm:text-sm text-muted-foreground animate-fadeIn delay-300 px-4">
          <span>{stats.totalListings}+ Listings</span>
          <span className="hidden sm:inline">|</span>

          <span>{stats.totalUsers}+ Users</span>
          <span className="hidden sm:inline">|</span>

          <span>Verified</span>
          <span className="hidden sm:inline">|</span>

          <span>Messaging</span>
        </div>
      </div>

      <style>
        {`
          .animate-fadeIn {
            opacity: 0;
            animation: fadeIn 1s ease forwards;
          }

          .delay-100 {
            animation-delay: .1s;
          }

          .delay-200 {
            animation-delay: .2s;
          }

          .delay-300 {
            animation-delay: .3s;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeDown {
            animation: fadeDown .3s ease-out forwards;
          }

          @keyframes fadeDown {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;