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
    <div className="flex flex-col">

      <Hero />

      <ListingsSection />

      <section className="py-14 bg-secondary/40 border-t">
        <div className="container mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Roommates
          </h2>

          {loadingRoommates ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : featuredRoommates.length > 0 ? (
            <div className="grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4 
              xl:grid-cols-5 
              gap-6"
            >
              {featuredRoommates.map(roommate => (
                <RoommateCard key={roommate._id} roommate={roommate} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              No featured roommates available right now.
            </p>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
