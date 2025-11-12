import React, { useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import RoommateCard from '@/components/RoommateCard';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FindRoommatesPage = () => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- THIS IS THE CHANGE: State for the gender filter ---
  const [genderFilter, setGenderFilter] = useState('Any');

  useEffect(() => {
    const fetchAllRoommates = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- THIS IS THE CHANGE: Add gender to the API request if selected ---
        const params = new URLSearchParams();
        if (genderFilter && genderFilter !== 'Any') {
          params.append('gender', genderFilter);
        }
        const res = await axios.get(`/user/all?${params.toString()}`);
        setRoommates(res.data);
      } catch (err) {
        console.error('Failed to fetch roommates:', err);
        setError('Could not load roommates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllRoommates();
  }, [genderFilter]); // <-- Re-run the effect when the filter changes

  return (
    <div className="container mx-auto px-4 py-12 pt-28 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Find Your Next Roommate</h1>
        <p className="text-lg text-muted-foreground mt-2">Browse profiles of users looking for a place.</p>
      </div>

      {/* --- THIS IS THE CHANGE: Filter UI --- */}
      <div className="flex justify-center mb-12">
        <div className="w-full max-w-xs">
          <Label htmlFor="gender-filter" className="text-sm font-medium">Looking for</Label>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger id="gender-filter" className="w-full mt-1">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any Gender</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* --- END CHANGE --- */}


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
            <div className="text-center py-20 bg-card border rounded-lg p-8">
              <h3 className="text-xl font-semibold">No Roommates Found</h3>
              <p className="text-muted-foreground mt-2">
                No users match the current filter. Try selecting a different option.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindRoommatesPage;