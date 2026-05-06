import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";

import Hero from "../components/Hero";
import RoommateCard from "@/components/RoommateCard";

import { Loader2 } from "lucide-react";

const Home = () => {
  const [featuredRoommates, setFeaturedRoommates] = useState([]);
  const [loadingRoommates, setLoadingRoommates] = useState(true);

  useEffect(() => {
    const fetchFeaturedRoommates = async () => {
      setLoadingRoommates(true);
      try {
        const res = await axios.get("/user/featured");
        setFeaturedRoommates(res.data);
      } catch (error) {
        console.error("Failed to fetch featured roommates:", error);
      } finally {
        setLoadingRoommates(false);
      }
    };

    fetchFeaturedRoommates();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Hero />

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white to-[#f0f1ff] dark:from-[#0e0e11] dark:to-[#16161b]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 sm:mb-12 text-[#5b5dda] dark:text-[#7e7fff]">
            Why MateStay?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 shadow-sm sm:shadow-md border dark:border-neutral-800 text-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Verified Users</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Every user is identity-checked.</p>
            </div>

            <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 shadow-sm sm:shadow-md border dark:border-neutral-800 text-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Safe & Secure</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Trusted User Community.</p>
            </div>

            <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 shadow-sm sm:shadow-md border dark:border-neutral-800 text-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Find Your Match</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Find people like you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-[#fafaff] dark:bg-[#0d0d10] border-y dark:border-neutral-800 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-6">
            Featured Users
          </h2>

          <p className="text-center text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
            Connect with verified people.
          </p>

          {loadingRoommates ? (
            <div className="flex justify-center py-10 sm:py-14">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                {featuredRoommates.map((r) => (
                  <RoommateCard key={r._id} roommate={r} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-[#5b5dda] dark:bg-[#4c4edf] text-white text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4">
          Find your perfect flat and flatmate
        </h2>
        <p className="text-sm sm:text-base md:text-lg opacity-90 mb-6 sm:mb-8">
          Thousands already found their match.
        </p>

        <a
          href="/find-rooms"
          className="inline-block bg-white text-[#5b5dda] dark:bg-neutral-900 dark:text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow hover:bg-gray-100 transition-colors"
        >
          Browse Rooms
        </a>
      </section>

    </div>
  );
};

export default Home;
