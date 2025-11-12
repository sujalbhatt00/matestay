import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import RoommateCard from '@/components/RoommateCard';
import { Loader2 } from 'lucide-react';

const FindRoommatesPage = () => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllRoommates = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/user/all');
        setRoommates(res.data);
      } catch (err) {
        console.error('Failed to fetch roommates:', err);
        setError('Could not load roommates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllRoommates();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 pt-28 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Find Your Next Roommate</h1>
        <p className="text-lg text-muted-foreground mt-2">Browse profiles of users looking for a place.</p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {roommates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {roommates.map(roommate => (
                <RoommateCard key={roommate._id} roommate={roommate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No other users found. Check back later!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindRoommatesPage;