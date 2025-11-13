import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import { Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AllPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      // Fetch all properties without any filters
      const response = await axios.get('/properties/search');
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Properties</h1>
            <p className="text-muted-foreground">Browse all available properties</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : properties.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-card border rounded-lg">
              <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground">
                There are no properties available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllPropertiesPage;