import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import Hero from '../components/Hero';
import ListingsSection from '../components/ListingsSection';
import RoommateCard from '../components/RoommateCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [featuredRoommates, setFeaturedRoommates] = useState([]);
  const [loadingRoommates, setLoadingRoommates] = useState(true);

  useEffect(() => {
    const fetchFeaturedRoommates = async () => {
      setLoadingRoommates(true);
      try {
        const res = await axios.get('/user/featured'); 
        setFeaturedRoommates(res.data);
      } catch (error) {
        console.error('Failed to fetch featured roommates:', error);
      } finally {
        setLoadingRoommates(false);
      }
    };

    fetchFeaturedRoommates();
  }, []);

  return (
    <div>
      <Hero />
      
      {/* This will now render correctly */}
      <ListingsSection />
      
      {/* Featured Roommates Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Roommates</h2>
          {loadingRoommates ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredRoommates.map(roommate => (
                <RoommateCard key={roommate._id} roommate={roommate} />
              ))}
            </div>
          )}
          {(!loadingRoommates && featuredRoommates.length === 0) && (
            <p className="text-center text-muted-foreground">No featured roommates found at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;