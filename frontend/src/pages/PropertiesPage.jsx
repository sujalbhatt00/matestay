import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";

import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { locations } from "@/lib/indianLocations";

const availableAmenities = [
  "Wifi",
  "Kitchen",
  "Parking",
  "AC",
  "Washer",
  "Dryer",
  "TV",
  "Heating",
];

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [bedrooms, setBedrooms] = useState(1);

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const fetchProperties = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      if (location) {
        params.append("location", location);
      }

      if (propertyType) {
        params.append("propertyType", propertyType);
      }

      if (minRent) {
        params.append("minPrice", minRent);
      }

      if (maxRent) {
        params.append("maxPrice", maxRent);
      }

      if (bedrooms > 1) {
        params.append("bedrooms", bedrooms);
      }

      if (selectedAmenities.length > 0) {
        params.append(
          "amenities",
          selectedAmenities.join(",")
        );
      }

      const response = await axios.get(
        `/properties/search?${params.toString()}`
      );

      setProperties(response.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);

      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    fetchProperties();
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="flex-grow bg-background pt-20 sm:pt-24">
        <section className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-md py-4 sm:py-6">
          <div className="container mx-auto px-4 sm:px-6">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 items-end"
            >
              <div className="sm:col-span-2 xl:col-span-2 min-w-0">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Location
                </Label>

                <Select
                  value={location}
                  onValueChange={setLocation}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Any Location" />
                  </SelectTrigger>

                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem
                        key={loc.value}
                        value={loc.value}
                      >
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-0">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Type
                </Label>

                <Select
                  value={propertyType}
                  onValueChange={setPropertyType}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Apartment">
                      Apartment
                    </SelectItem>

                    <SelectItem value="House">
                      House
                    </SelectItem>

                    <SelectItem value="Room">
                      Room
                    </SelectItem>

                    <SelectItem value="Studio">
                      Studio
                    </SelectItem>

                    <SelectItem value="PG">
                      PG
                    </SelectItem>

                    <SelectItem value="Hostel">
                      Hostel
                    </SelectItem>

                    <SelectItem value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-0">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Min Beds
                </Label>

                <Select
                  value={bedrooms.toString()}
                  onValueChange={(v) =>
                    setBedrooms(Number(v))
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Beds" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">
                      1+ Beds
                    </SelectItem>

                    <SelectItem value="2">
                      2+ Beds
                    </SelectItem>

                    <SelectItem value="3">
                      3+ Beds
                    </SelectItem>

                    <SelectItem value="4">
                      4+ Beds
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-0">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Min Rent (₹)
                </Label>

                <Input
                  type="number"
                  placeholder="Min"
                  value={minRent}
                  onChange={(e) =>
                    setMinRent(e.target.value)
                  }
                  min="0"
                  className="h-11"
                />
              </div>

              <div className="min-w-0">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Max Rent (₹)
                </Label>

                <Input
                  type="number"
                  placeholder="Max"
                  value={maxRent}
                  onChange={(e) =>
                    setMaxRent(e.target.value)
                  }
                  min="0"
                  className="h-11"
                />
              </div>

              <div className="min-w-0">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Amenities
                </Label>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-11"
                    >
                      {selectedAmenities.length === 0
                        ? "Amenities"
                        : `${selectedAmenities.length} selected`}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56"
                    align="end"
                  >
                    <DropdownMenuLabel>
                      Select Amenities
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {availableAmenities.map((amenity) => (
                      <DropdownMenuCheckboxItem
                        key={amenity}
                        checked={selectedAmenities.includes(
                          amenity
                        )}
                        onCheckedChange={() =>
                          handleAmenityChange(amenity)
                        }
                      >
                        {amenity}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#5b5dda] hover:bg-[#4a4ab5] text-white xl:col-start-7"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  No Properties Found
                </h2>

                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                  Available Properties ({properties.length})
                </h2>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {properties.map((prop) => (
                    <PropertyCard
                      key={prop._id}
                      property={prop}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;