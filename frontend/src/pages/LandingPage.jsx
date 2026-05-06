import React, { useState, useEffect, useContext } from "react";
import axios from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Users,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import heroImage from "../assets/hero-image.jpg";
import CategoryModal from "@/components/CategoryModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RoommateCard from "@/components/RoommateCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [featuredRoommates, setFeaturedRoommates] = useState([]);
  const [loadingRoommates, setLoadingRoommates] = useState(true);

  const [userCount, setUserCount] = useState(null);
  const [totalListings, setTotalListings] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingRoommates(true);

      try {
        const [roommatesRes, statsRes, listingsRes] = await Promise.all([
          axios.get("/user/featured"),
          axios.get("/user/count"),
          axios
            .get("/properties/stats")
            .catch(() => ({ data: { totalListings: 0 } })),
        ]);

        setFeaturedRoommates(roommatesRes.data);
        setUserCount(statsRes.data.count);
        setTotalListings(listingsRes.data.totalListings);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoadingRoommates(false);
      }
    };

    fetchData();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      toast.success("Message sent! We'll get back to you shortly.");

      e.target.reset();
    }, 1500);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const handlePremiumClick = () => {
    if (!user) {
      navigate("/");

      setTimeout(() => {
        setShowCategoryModal(true);
      }, 100);
    } else {
      navigate("/premium");
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Finding the Perfect Roommate",
      excerpt:
        "Finding a roommate is easy, but finding the right one takes effort.",
      category: "Guide",
      author: "Sujal Bhatt",
      date: "Oct 15, 2025",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    },
    {
      id: 2,
      title: "Safety First: How to Spot Rental Scams",
      excerpt:
        "Learn the red flags of rental scams and protect yourself online.",
      category: "Safety",
      author: "Shashank Kumar",
      date: "Oct 10, 2025",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    },
    {
      id: 3,
      title: "Budgeting for Shared Living",
      excerpt:
        "Split bills, manage groceries and shared expenses properly.",
      category: "Finance",
      author: "Team MateStay",
      date: "Sep 28, 2025",
      image:
        "https://flatmates-res.cloudinary.com/t_blog/blog/iqo4df6zjqs5c2byibzm.jpg",
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <section
        id="hero"
        className="relative min-h-screen sm:min-h-[92vh] flex items-center justify-center pt-24 sm:pt-20 pb-12 overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-35"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/90 -z-10" />

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-6xl relative z-10">
          <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-5 sm:mb-6">
            Find Your Perfect flat and flatmate
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            Connect with verified users and find your ideal living situation.
            Safe, simple, and straightforward.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
            <Button
              onClick={() => setShowCategoryModal(true)}
              size="lg"
              className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 text-base font-semibold"
            >
              Get Started
            </Button>

            <Button
              onClick={() => scrollToSection("featured")}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-lg px-8 h-12 text-base font-semibold border-2"
            >
              Explore
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold">
                {userCount || "0"}
              </div>

              <div className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                Users
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold">
                {totalListings || "0"}
              </div>

              <div className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                Listings
              </div>
            </div>

            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold">100%</div>

              <div className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why-us"
        className="py-14 sm:py-20 bg-background border-y border-border"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-16">
            Why MateStay?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Verified Users",
                desc: "Every profile is verified for safety and authenticity",
                icon: ShieldCheck,
              },
              {
                title: "Simple Process",
                desc: "Find perfect matches in minutes",
                icon: Check,
              },
              {
                title: "Real Reviews",
                desc: "Authentic feedback from the community",
                icon: Users,
              },
            ].map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="text-center hover:bg-accent/50 rounded-2xl p-5 sm:p-6 transition-colors"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="featured"
        className="py-14 sm:py-20 bg-background"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3">
            Featured Members
          </h2>

          <p className="text-center text-muted-foreground mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-lg">
            Discover verified members from our community
          </p>

          {loadingRoommates ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:hidden gap-3 mb-12">
                {featuredRoommates.slice(0, 6).map((r) => (
                  <RoommateCard
                    key={r._id}
                    roommate={r}
                  />
                ))}
              </div>

              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-14">
                {featuredRoommates.slice(0, 10).map((r) => (
                  <RoommateCard
                    key={r._id}
                    roommate={r}
                  />
                ))}
              </div>
            </>
          )}

          <div className="text-center">
            <Button
              onClick={() => navigate("/find-roommates")}
              size="lg"
              className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 font-semibold"
            >
              See All Members

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section
        id="premium"
        className="py-14 sm:py-20 bg-gray-50 dark:bg-neutral-900 border-y border-border"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3">
            Premium Membership
          </h2>

          <p className="text-center text-muted-foreground mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-lg">
            Unlock premium features and grow faster
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12 sm:mb-14">
            {[
              {
                title: "More Visibility",
                desc: "Prioritized in search results",
              },
              {
                title: "Unlimited Messaging",
                desc: "Connect with anyone",
              },
              {
                title: "Unlimited Listings",
                desc: "List multiple properties",
              },
              {
                title: "Verification Badge",
                desc: "Stand out as verified",
              },
              {
                title: "24/7 Support",
                desc: "Priority support",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-border hover:border-foreground/40 transition-colors"
              >
                <CardContent className="pt-6 text-center">
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handlePremiumClick}
              size="lg"
              className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 font-semibold"
            >
              Go Premium
            </Button>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-14 sm:py-20 bg-background border-y border-border"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3">
            Get In Touch
          </h2>

          <p className="text-center text-muted-foreground mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-lg">
            Have questions or need help? Contact us anytime.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: "matestaypvt@gmail.com",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: "+91 8979312715",
                },
                {
                  icon: MapPin,
                  title: "Location",
                  content: "Dehradun, Uttarakhand",
                },
              ].map((item, idx) => {
                const Icon = item.icon;

                return (
                  <div
                    key={idx}
                    className="flex gap-4"
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 mt-1 text-foreground" />

                    <div>
                      <h3 className="font-semibold mb-1">
                        {item.title}
                      </h3>

                      <p className="text-muted-foreground text-sm sm:text-base">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleContactSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name
                  </Label>

                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    className="h-11 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name
                  </Label>

                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="h-11 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Message
                </Label>

                <Textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  required
                  className="min-h-28 resize-none rounded-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black dark:bg-white text-white dark:text-black h-11 rounded-lg font-semibold"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready?
          </h2>

          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Start your search for the perfect home and roommate today
          </p>

          <Button
            onClick={() => setShowCategoryModal(true)}
            size="lg"
            className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 font-semibold"
          >
            Get Started
          </Button>
        </div>
      </section>

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;