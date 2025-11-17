import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "@/api/axiosInstance";
import RoommateCard from "@/components/RoommateCard";
import { Loader2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LocationCombobox } from "@/components/ui/LocationCombobox";

const FindRoommatesPage = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const searchParams = new URLSearchParams(locationObj.search);

  // Filters
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [genderFilter, setGenderFilter] = useState(searchParams.get("gender") || "Any");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");

  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update URL instantly on filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (genderFilter !== "Any") params.set("gender", genderFilter);
    if (budget) params.set("budget", budget);

    navigate(`/find-roommates?${params.toString()}`, { replace: true });
  }, [location, genderFilter, budget, navigate]);

  // Fetch roommates
  useEffect(() => {
    const fetchRoommates = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (location) params.append("location", location);
        if (genderFilter !== "Any") params.append("gender", genderFilter);
        if (budget) params.append("budget", budget);
        
const res = await axios.get(`/user/search-public?${params.toString()}`);
        setRoommates(res.data);
      } catch (err) {
        setError("Could not load roommates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, [location, genderFilter, budget]);

  return (
    <div className="container mx-auto px-4 py-16 pt-28 min-h-screen">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Find Your Roommate</h1>
        <p className="text-lg text-muted-foreground mt-1">Filter profiles and match easily.</p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-5 justify-center mb-12">
        
        {/* Location */}
        <div className="w-full max-w-xs">
          <Label className="text-sm font-medium">Location</Label>
          <LocationCombobox
            value={location}
            onChange={setLocation}
            placeholder="Search city..."
            className="mt-1"
          />
        </div>

        {/* Gender */}
        <div className="w-full max-w-xs">
          <Label className="text-sm font-medium">Gender</Label>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div className="w-full max-w-xs">
          <Label className="text-sm font-medium">Max Budget (₹)</Label>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 10000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1"
          />
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <>
          {roommates.length > 0 ? (
            <div className="grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4 
              xl:grid-cols-5 
              gap-6"
            >
              {roommates.map((user) => (
                <RoommateCard key={user._id} roommate={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border rounded-lg p-10">
              <h3 className="text-xl font-semibold">No Roommates Found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default FindRoommatesPage;
