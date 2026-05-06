import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import PropertyCard from '@/components/PropertyCard';
import RoommateCard from '@/components/RoommateCard';
import Footer from '@/components/Footer';
import { Loader2, MapPin, Users, Home } from 'lucide-react';

const LocationSearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const type = searchParams.get('type') || 'roommate'; // default to roommate
  const gender = searchParams.get('gender');
  const budget = searchParams.get('budget');
  const propertyType = searchParams.get('propertyType');

  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      if (type === "room") {
        fetchProperties();
      } else {
        fetchUsers();
      }
    }
    // eslint-disable-next-line
  }, [location, type, gender, budget, propertyType]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("location", location);
      if (budget) params.append("maxPrice", budget);
      if (propertyType) params.append("propertyType", propertyType);
      const response = await axios.get(`/properties/search?${params.toString()}`);
      setProperties(response.data);
    } catch (error) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("location", location);
      if (gender && gender !== "Any") params.append("gender", gender);
      if (budget) params.append("maxBudget", budget);
      const response = await axios.get(`/user/search-public?${params.toString()}`);
      setUsers(response.data);
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Search Results for</span>
            </div>
            <h1 className="text-3xl font-bold">{location}</h1>
          </div>

          {/* Only show one section based on type */}
          {type === "room" ? (
            loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card border rounded-lg">
                <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                <p className="text-muted-foreground">
                  No properties available in {location}.
                </p>
              </div>
            )
          ) : (
            loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {users.map(user => (
                  <RoommateCard key={user._id} roommate={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card border rounded-lg">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Roommates Found</h3>
                <p className="text-muted-foreground">
                  No users found in {location}.
                </p>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationSearchPage;