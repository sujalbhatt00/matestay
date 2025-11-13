d\src\pages\LocationSearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import PropertyCard from '@/components/PropertyCard';
import RoommateCard from '@/components/RoommateCard';
import Footer from '@/components/Footer';
import { Loader2, MapPin, Users, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LocationSearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (location) {
      fetchProperties();
      fetchUsers();
    }
  }, [location]);

  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      const response = await axios.get(`/properties/search?location=${encodeURIComponent(location)}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`/user/search?location=${encodeURIComponent(location)}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Search Results for</span>
            </div>
            <h1 className="text-3xl font-bold">{location}</h1>
          </div>

          {/* Tabs for Properties and Roommates */}
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Properties ({properties.length})
              </TabsTrigger>
              <TabsTrigger value="roommates" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Roommates ({users.length})
              </TabsTrigger>
            </TabsList>

            {/* Properties Tab */}
            <TabsContent value="properties">
              {loadingProperties ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {properties.map(property => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card border rounded-lg">
                  <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                  <p className="text-muted-foreground">
                    No properties available in {location} at the moment.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Roommates Tab */}
            <TabsContent value="roommates">
              {loadingUsers ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {users.map(user => (
                    <RoommateCard key={user._id} roommate={user} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card border rounded-lg">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Roommates Found</h3>
                  <p className="text-muted-foreground">
                    No users looking for roommates in {location} at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationSearchPage;