import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import PropertyCard from './PropertyCard';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const ListingsSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch featured properties, limiting to 4 for the homepage
        const res = await axios.get('/properties/featured?limit=4');
        setProperties(res.data);
      } catch (err) {
        console.error('Failed to fetch featured properties:', err);
        setError('Could not load properties at the moment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
            {properties.length === 0 && (
              <p className="text-center text-muted-foreground">No featured properties available right now.</p>
            )}
            <div className="text-center mt-12">
              <Button onClick={() => navigate('/properties')}>
                View All Properties
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ListingsSection;