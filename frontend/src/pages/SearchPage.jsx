import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LocationCombobox from "@/components/ui/LocationCombobox";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import RoommateCard from "@/components/RoommateCard";
import { Loader2, Users, BedDouble } from "lucide-react";
import axios from "@/api/axiosInstance";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Unified filter state
  const [type, setType] = useState(searchParams.get("type") || "roommate");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "Any");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");

  // Results state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("type", type);
    if (location) params.set("location", location);
    if (gender && gender !== "Any") params.set("gender", gender);
    if (budget) params.set("budget", budget);
    if (propertyType && type === "room") params.set("propertyType", propertyType);

    navigate(`/search?${params.toString()}`, { replace: true });
  }, [type, location, gender, budget, propertyType, navigate]);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (type === "room") {
          // Search properties
          const params = new URLSearchParams();
          if (location) params.append("location", location);
          if (budget) params.append("maxPrice", budget);
          if (propertyType) params.append("propertyType", propertyType);
          const res = await axios.get(`/properties/search?${params.toString()}`);
          setResults(res.data);
        } else {
          // Search roommates
          const params = new URLSearchParams();
          if (location) params.append("location", location);
          if (gender && gender !== "Any") params.append("gender", gender);
          if (budget) params.append("maxBudget", budget);
          const res = await axios.get(`/user/search-public?${params.toString()}`);
          setResults(res.data);
        }
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [type, location, gender, budget, propertyType]);

  // Unified filter bar
  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Type Switch */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search For</label>
              <div className="flex gap-2">
                <Button
                  variant={type === "roommate" ? "default" : "outline"}
                  onClick={() => setType("roommate")}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" /> Roommate
                </Button>
                <Button
                  variant={type === "room" ? "default" : "outline"}
                  onClick={() => setType("room")}
                  className="flex items-center gap-2"
                >
                  <BedDouble className="h-4 w-4" /> Room
                </Button>
              </div>
            </div>
            {/* Location */}
            <div className="w-full max-w-xs">
              <label className="text-sm font-medium">Location</label>
              <LocationCombobox value={location} onChange={setLocation} />
            </div>
            {/* Gender (only for roommate) */}
            {type === "roommate" && (
              <div className="w-full max-w-xs">
                <label className="text-sm font-medium">Gender</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
            {/* Property Type (only for room) */}
            {type === "room" && (
              <div className="w-full max-w-xs">
                <label className="text-sm font-medium">Property Type</label>
                <select
                  className="w-full border rounded px-2 py-1 mt-1"
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
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
            {/* Budget */}
            <div className="w-full max-w-xs">
              <label className="text-sm font-medium">Max Budget (₹)</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 10000"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : type === "room" ? (
          results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border rounded-lg">
              <BedDouble className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground">
                No properties available in {location || "your selected location"}.
              </p>
            </div>
          )
        ) : (
          results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.map(user => (
                <RoommateCard key={user._id} roommate={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border rounded-lg">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Roommates Found</h3>
              <p className="text-muted-foreground">
                No users found in {location || "your selected location"}.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;