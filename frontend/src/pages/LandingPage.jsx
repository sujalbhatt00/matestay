import React, { useState, useEffect } from "react";
import axios from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Loader2, Mail, Phone, MapPin, Users, Check, ArrowRight, ShieldCheck } from "lucide-react";
import heroImage from "../assets/hero-image.jpg";
import CategoryModal from "@/components/CategoryModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          axios.get("/properties/stats").catch(() => ({ data: { totalListings: 0 } })),
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
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePremiumClick = () => {
    if (!user) {
      navigate("/");
      setTimeout(() => setShowCategoryModal(true), 100);
    } else {
      navigate("/premium");
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Finding the Perfect Roommate",
      excerpt: "Finding a roommate is easy, but finding the right one takes effort. Here are our top tips for compatibility.",
      category: "Guide",
      author: "Sujal Bhatt",
      date: "Oct 15, 2025",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
    },
    {
      id: 2,
      title: "Safety First: How to Spot Rental Scams",
      excerpt: "Learn the red flags of rental scams and how to protect yourself when searching for properties online.",
      category: "Safety",
      author: "Shashank Kumar",
      date: "Oct 10, 2025",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
    },
    {
      id: 3,
      title: "Budgeting for Shared Living: A Complete Guide",
      excerpt: "How to split bills, manage groceries, and handle shared expenses without awkward conversations.",
      category: "Finance",
      author: "Team MateStay",
      date: "Sep 28, 2025",
      image: "https://flatmates-res.cloudinary.com/t_blog/blog/iqo4df6zjqs5c2byibzm.jpg"
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-35"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/90 -z-10" />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Find Your Perfect flat and flatmate 
          </h1>

          <p className="text-xl md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with verified users and find your ideal living situation. Safe, simple, and straightforward.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={() => setShowCategoryModal(true)}
              size="lg"
              className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 text-base font-semibold hover:bg-gray-900 dark:hover:bg-gray-100"
            >
              Get Started
            </Button>

            <Button
              onClick={() => scrollToSection("featured")}
              variant="outline"
              size="lg"
              className="rounded-lg px-8 h-12 text-base font-semibold border-2"
            >
              Explore
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{userCount || "0"}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{totalListings || "0"}</div>
              <div className="text-sm text-muted-foreground">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-20 bg-background border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Why MateStay?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { 
                title: "Verified Users", 
                desc: "Every profile is verified for safety and authenticity",
                icon: ShieldCheck
              },
              { 
                title: "Simple Process", 
                desc: "Find perfect matches in minutes, not days",
                icon: Check
              },
              { 
                title: "Real Reviews", 
                desc: "Authentic feedback from real people in the community",
                icon: Users
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center hover:bg-accent/50 p-6 rounded-xl transition-colors">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-gray-50 dark:bg-neutral-900 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About Matestay</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Matestay is a trusted platform for finding flats and flatmates. We understand that finding the right person to live with can be challenging, which is why we've built a secure, verified community.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our mission is simple: to make shared living affordable, safe, and social. We verify every profile, check every property, and ensure compatibility through advanced matching algorithms.
              </p>
              <div className="space-y-4">
                {[
                  "Verified profiles and listings",
                  "Smart compatibility matching",
                  "24/7 customer support",
                  "Secure messaging system"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="bg-background/50 border border-border rounded-xl p-6">
                    <p className="text-foreground text-lg italic">
                      "Matestay helped me find not just a roommate, but a great friend. The verification process made me feel safe and secure."
                    </p>
                    <p className="text-muted-foreground mt-3 text-sm">—(pratik kumar)A verified user</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 border border-border rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-primary mt-1">{userCount || "Growing"}</p>
                    </div>
                    <div className="bg-background/50 border border-border rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground">Listings</p>
                      <p className="text-2xl font-bold text-primary mt-1">{totalListings || "Growing"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-center">Featured Members</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto text-lg">
            Discover verified members from our community looking for flatmates and shared living spaces
          </p>

          {loadingRoommates ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:hidden mb-14">
                {featuredRoommates.slice(0, 6).map((r) => (
                  <div key={r._id} className="cursor-pointer">
                    <RoommateCard roommate={r} />
                  </div>
                ))}
              </div>

              <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-6 mb-14">
                {featuredRoommates.slice(0, 10).map((r) => (
                  <div key={r._id} className="cursor-pointer">
                    <RoommateCard roommate={r} />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="text-center">
            <Button
              onClick={() => navigate("/find-roommates")}
              size="lg"
              className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 font-semibold hover:bg-gray-900 dark:hover:bg-gray-100"
            >
              See All Members <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section id="premium" className="py-20 bg-gray-50 dark:bg-neutral-900 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-center">How It Works</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto text-lg">
            Finding your perfect match is just 4 easy steps away
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                desc: "Sign up and create a detailed profile about yourself"
              },
              {
                step: "2",
                title: "Set Your Preferences",
                desc: "Tell us what you're looking for in a roommate or room"
              },
              {
                step: "3",
                title: "Browse & Connect",
                desc: "Explore verified profiles and send messages to matches"
              },
              {
                step: "4",
                title: "Move In",
                desc: "Visit, verify, and move into your new home"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setShowCategoryModal(true)}
              size="lg"
              className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 font-semibold hover:bg-gray-900 dark:hover:bg-gray-100"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-center">Premium Membership</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto text-lg">
            Unlock exclusive features and find your perfect match faster
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-14">
            {[
              { title: "More Visibility", desc: "Prioritized in search results" },
              { title: "Unlimited Messaging", desc: "Connect with anyone" },
              { title: "Unlimited Listings", desc: "List multiple properties" },
              { title: "Verification Badge", desc: "Stand out as verified" },
              { title: "24/7 Support", desc: "Priority customer support" }
            ].map((item, idx) => (
              <Card key={idx} className="border-border hover:border-foreground/50 transition-colors">
                <CardContent className="pt-6 text-center">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handlePremiumClick}
              size="lg"
              className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 font-semibold hover:bg-gray-900 dark:hover:bg-gray-100"
            >
              Go Premium
            </Button>
          </div>
        </div>
      </section>

      <section id="blog" className="py-20 bg-background border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-center">Shared Living Tips & Guides</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto text-lg">
            Learn from our community about finding flatmates, managing shared spaces, and building lasting friendships
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="border-border hover:border-foreground/30 overflow-hidden transition-colors group cursor-pointer">
                <div className="aspect-video w-full overflow-hidden bg-gray-200 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="text-xs text-muted-foreground mb-3">{post.category}</div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-foreground transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-gray-50 dark:bg-neutral-900 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-center">Get In Touch</h2>
          <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto text-lg">
            Have questions or need help? Our team is always ready to assist you
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email", content: "matestaypvt@gmail.com" },
                { icon: Phone, title: "Phone", content: "+91 8979312715" },
                { icon: MapPin, title: "Location", content: "Dehradun, Uttarakhand, India" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <Icon className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input id="firstName" placeholder="John" required className="h-10 rounded-lg border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required className="h-10 rounded-lg border-border" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required className="h-10 rounded-lg border-border" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    className="min-h-24 resize-none rounded-lg border-border"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black dark:bg-white text-white dark:text-black h-10 font-semibold rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start your search for the perfect home and roommate today
          </p>
          <Button
            onClick={() => setShowCategoryModal(true)}
            size="lg"
            className="bg-black dark:bg-white text-white dark:text-black rounded-lg px-8 h-12 font-semibold hover:bg-gray-900 dark:hover:bg-gray-100"
          >
            Get Started
          </Button>
        </div>
      </section>

      {showCategoryModal && <CategoryModal onClose={() => setShowCategoryModal(false)} />}
    </div>
  );
};

export default LandingPage;
