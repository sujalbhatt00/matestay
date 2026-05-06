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

  const [type, setType] = useState(searchParams.get("type") || "roommate");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "Any");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");
  const [propertyType, setPropertyType] = useState(
    searchParams.get("propertyType") || ""
  );

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("type", type);

    if (location) params.set("location", location);
    if (gender && gender !== "Any") params.set("gender", gender);
    if (budget) params.set("budget", budget);

    if (propertyType && type === "room") {
      params.set("propertyType", propertyType);
    }

    navigate(`/search?${params.toString()}`, { replace: true });
  }, [type, location, gender, budget, propertyType, navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (location) params.append("location", location);

        if (type === "room") {
          if (budget) params.append("maxPrice", budget);
          if (propertyType) {
            params.append("propertyType", propertyType);
          }

          const res = await axios.get(
            `/properties/search?${params.toString()}`
          );

          setResults(res.data);
        } else {
          if (gender && gender !== "Any") {
            params.append("gender", gender);
          }

          if (budget) params.append("maxBudget", budget);

          const res = await axios.get(
            `/user/search-public?${params.toString()}`
          );

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

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium block mb-2">
                Search For
              </label>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={type === "roommate" ? "default" : "outline"}
                  onClick={() => setType("roommate")}
                  className="w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Users className="h-4 w-4" />
                  Roommate
                </Button>

                <Button
                  variant={type === "room" ? "default" : "outline"}
                  onClick={() => setType("room")}
                  className="w-full flex items-center justify-center gap-2 text-sm"
                >
                  <BedDouble className="h-4 w-4" />
                  Room
                </Button>
              </div>
            </div>

            <div className="w-full min-w-0">
              <label className="text-sm font-medium block mb-2">
                Location
              </label>

              <LocationCombobox
                value={location}
                onChange={setLocation}
              />
            </div>

            {type === "roommate" && (
              <div className="w-full min-w-0">
                <label className="text-sm font-medium block mb-2">
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none"
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {type === "room" && (
              <div className="w-full min-w-0">
                <label className="text-sm font-medium block mb-2">
                  Property Type
                </label>

                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none"
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

            <div className="w-full min-w-0">
              <label className="text-sm font-medium block mb-2">
                Max Budget (₹)
              </label>

              <input
                type="number"
                min={0}
                placeholder="e.g. 10000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : type === "room" ? (
          results.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-card border rounded-2xl">
              <BedDouble className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground" />

              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                No Properties Found
              </h3>

              <p className="text-sm sm:text-base text-muted-foreground px-4">
                No properties available in{" "}
                {location || "your selected location"}.
              </p>
            </div>
          )
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((user) => (
              <RoommateCard
                key={user._id}
                roommate={user}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-card border rounded-2xl">
            <Users className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground" />

            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              No Roommates Found
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground px-4">
              No users found in {location || "your selected location"}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;