import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "@/api/axiosInstance";
import RoommateCard from "@/components/RoommateCard";
import ProfileCompletionBanner from "@/components/ProfileCompletionBanner";
import ProfileCompletionModal from "@/components/ProfileCompletionModal";
import { Loader2, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfileCompletionModal } from "@/hooks/useProfileCompletionModal";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocationCombobox } from "@/components/ui/LocationCombobox";

const FindRoommatesPage = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(locationObj.search);

  // Filters
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [genderFilter, setGenderFilter] = useState(searchParams.get("gender") || "Any");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");
  const [minAge, setMinAge] = useState(searchParams.get("minAge") || "");
  const [maxAge, setMaxAge] = useState(searchParams.get("maxAge") || "");
  const [smoking, setSmoking] = useState(searchParams.get("smoking") || "Any");
  const [sleepSchedule, setSleepSchedule] = useState(searchParams.get("sleepSchedule") || "Any");
  const [cleanlinessLevel, setCleanlinessLevel] = useState(searchParams.get("cleanlinessLevel") || "Any");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile completion modal hook
  const { showModal: showCompletionModal, closeModal: closeCompletionModal } = useProfileCompletionModal();

  // Update URL instantly on filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (genderFilter !== "Any") params.set("gender", genderFilter);
    if (budget) params.set("budget", budget);
    if (minAge) params.set("minAge", minAge);
    if (maxAge) params.set("maxAge", maxAge);
    if (smoking !== "Any") params.set("smoking", smoking);
    if (sleepSchedule !== "Any") params.set("sleepSchedule", sleepSchedule);
    if (cleanlinessLevel !== "Any") params.set("cleanlinessLevel", cleanlinessLevel);

    navigate(`/find-roommates?${params.toString()}`, { replace: true });
  }, [location, genderFilter, budget, minAge, maxAge, smoking, sleepSchedule, cleanlinessLevel, navigate]);

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
        if (minAge) params.append("minAge", minAge);
        if (maxAge) params.append("maxAge", maxAge);
        if (smoking !== "Any") params.append("smoking", smoking);
        if (sleepSchedule !== "Any") params.append("sleepSchedule", sleepSchedule);
        if (cleanlinessLevel !== "Any") params.append("cleanlinessLevel", cleanlinessLevel);

        const res = await axios.get(`/user/search-public?${params.toString()}`);
        setRoommates(res.data);
      } catch (err) {
        setError("Could not load roommates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, [location, genderFilter, budget, minAge, maxAge, smoking, sleepSchedule, cleanlinessLevel]);

  return (
    <div className="container mx-auto px-4 py-16 pt-28 min-h-screen">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Find Your Flatmmate</h1>
        <p className="text-lg text-muted-foreground mt-1">Filter profiles and match easily.</p>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto mb-12 space-y-4">
        {/* Basic Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
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

          {/* Advanced Filters Toggle */}
          <div className="flex items-end">
            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="outline"
              className="h-10 px-4 flex items-center gap-2"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showAdvancedFilters ? "rotate-180" : ""
                }`}
              />
              More Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-accent/50 border border-border rounded-lg p-6 space-y-4 animate-in fade-in">
            <h3 className="font-semibold text-foreground mb-4">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Age Range */}
              <div>
                <Label className="text-sm font-medium">Min Age</Label>
                <Input
                  type="number"
                  min={18}
                  max={65}
                  placeholder="e.g. 20"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Max Age</Label>
                <Input
                  type="number"
                  min={18}
                  max={65}
                  placeholder="e.g. 30"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Smoking Preference */}
              <div>
                <Label className="text-sm font-medium">Smoking</Label>
                <Select value={smoking} onValueChange={setSmoking}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                    <SelectItem value="Smoker">Smoker</SelectItem>
                    <SelectItem value="Occasional">Occasional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sleep Schedule */}
              <div>
                <Label className="text-sm font-medium">Sleep Schedule</Label>
                <Select value={sleepSchedule} onValueChange={setSleepSchedule}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Early Bird">Early Bird</SelectItem>
                    <SelectItem value="Night Owl">Night Owl</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cleanliness Level */}
              <div>
                <Label className="text-sm font-medium">Cleanliness Level</Label>
                <Select value={cleanlinessLevel} onValueChange={setCleanlinessLevel}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Very Messy">Very Messy</SelectItem>
                    <SelectItem value="Messy">Messy</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Clean">Clean</SelectItem>
                    <SelectItem value="Very Clean">Very Clean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Completion Banner */}
      {user && (
        <div className="max-w-6xl mx-auto mb-8">
          <ProfileCompletionBanner
            user={user}
            onEditProfile={() => navigate("/profile")}
          />
        </div>
      )}

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
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:hidden gap-3">
                {roommates.map((user) => (
                  <RoommateCard key={user._id} roommate={user} />
                ))}
              </div>

              {/* ⭐ DESKTOP GRID */}
              <div
                className="
                  hidden
                  md:grid 
                  md:grid-cols-3 
                  lg:grid-cols-4 
                  xl:grid-cols-5 
                  gap-6
                "
              >
                {roommates.map((user) => (
                  <RoommateCard key={user._id} roommate={user} />
                ))}
              </div>
            </>
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

      {/* Profile Completion Modal */}
      {user && showCompletionModal && (
        <ProfileCompletionModal
          user={user}
          onClose={closeCompletionModal}
          onEditProfile={() => navigate("/profile")}
        />
      )}
    </div>
  );
};

export default FindRoommatesPage;
