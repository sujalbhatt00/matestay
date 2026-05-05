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
      <div className="pt-20 sm:pt-24 flex-grow bg-background">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">All Properties</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Browse all available properties</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
            </div>
          ) : properties.length > 0 ? (
            <>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">
                Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-card border rounded-lg">
              <Home className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
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