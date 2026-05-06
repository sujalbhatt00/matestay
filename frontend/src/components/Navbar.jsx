import React, { useContext, useState, useEffect } from "react";
import {
  Moon,
  Sun,
  MessageSquare,
  Users,
  Plus,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Crown,
  Home,
  BedDouble,
  BookOpen,
  Heart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import AuthModal from "./AuthModal";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuth, setShowAuth] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const isHomePage = location.pathname === "/";

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleMessagesClick = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      navigate("/chat");
    }
  };

  const handlePremiumClick = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      navigate("/premium");
    }
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-colors ${
      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-5 left-1/2 -translate-x-1/2
        z-50 w-[88%] bg-background/60 backdrop-blur-xl border border-border
        shadow-sm rounded-lg px-6 py-3">

        <div className="flex items-center justify-between h-10">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/Logo.png" width={40} alt="Matestay" />
            <span className="text-lg font-bold">Matestay</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Always show Roommates and Rooms links */}
            <NavLink to="/find-roommates" className={navLinkClass}>
              <Users className="h-4 w-4" />Flatmates
            </NavLink>
            <button
              onClick={() => navigate("/find-rooms?type=room&showFilters=1")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <BedDouble className="h-4 w-4" />Flats
            </button>
            
            {/* Show landing page sections if on home page */}
            {isHomePage && (
              <>
                <button
                  onClick={() => scrollToSection("why-us")}
                  className="flex items-center gap-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  Why Us
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="flex items-center gap-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  About
                </button>
              </>
            )}

            <button
              onClick={handleMessagesClick}
              className="flex items-center gap-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <div className="relative flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-4 h-5 w-5 flex items-center justify-center
                    bg-red-500 text-white text-[10px] rounded-full font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </button>

            {!user?.isPremium && (
              <button
                onClick={handlePremiumClick}
                className="flex items-center gap-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
              >
                <Crown className="h-4 w-4" /> Premium
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}
              className="rounded-full hover:bg-accent h-9 w-9">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user && (
              <Button
                onClick={() => navigate("/create-listing")}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-100 h-9"
              >
                <Plus className="h-4 w-4 mr-1" />
                add flat
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full h-9 w-9">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePic || defaultAvatar} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.isPremium && (
                      <span className="bg-yellow-500/20 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 mt-1">
                        <Crown className="h-3 w-3" /> Premium
                      </span>
                    )}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/my-listings")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" /> My Listings
                  </DropdownMenuItem>

                  {user?.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <ShieldCheck className="h-4 w-4 mr-2" /> Admin Panel
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>

              </DropdownMenu>
            ) : (
              <Button className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-100 h-9"
                onClick={() => setShowAuth(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 py-2 md:hidden">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer min-w-0">
          <img src="/Logo.png" width={28} alt="logo" />
          <span className="text-base font-bold truncate">MateStay</span>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full active:scale-95 transition-transform">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="mx-2 mb-2 rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-[0_-12px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between px-2 py-2">

            <button onClick={() => navigate("/")} className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[52px]">
              <Home className="h-5 w-5" />
              Home
            </button>

            <button onClick={() => navigate("/find-rooms")} className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[52px]">
              <BedDouble className="h-5 w-5" />
              Flats
            </button>

            <button
              onClick={() => {
                if (user) navigate("/create-listing");
                else setShowAuth(true);
              }}
              className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[52px]"
            >
              <Plus className="h-5 w-5" />
              Post
            </button>

            <button onClick={() => navigate("/find-roommates")} className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[52px]">
              <Users className="h-5 w-5" />
              Flatmates
            </button>

            {/* Mobile Chat button opens login modal if not logged in */}
            <button
              onClick={() => {
                if (!user) setShowAuth(true);
                else navigate("/chat");
              }}
              className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors relative min-w-[52px]"
            >
              <MessageSquare className="h-5 w-5" />
              Chat
              {unreadCount > 0 && (
                <span className="absolute top-0 right-1 h-4 w-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={() => {
                if (!user) setShowAuth(true);
                else setShowMobileProfile(true);
              }}
              className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[52px]"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.profilePic || defaultAvatar} />
              </Avatar>
              You
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Profile Sidebar */}
      {showMobileProfile && user && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center md:hidden"
          onClick={() => setShowMobileProfile(false)}
        >
          <div
            className="bg-background w-full p-6 rounded-b-2xl shadow-xl animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePic || defaultAvatar} />
              </Avatar>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col text-sm gap-4">
              <button onClick={() => { navigate("/profile"); setShowMobileProfile(false); }}>
                Profile
              </button>

              <button onClick={() => { navigate("/my-listings"); setShowMobileProfile(false); }}>
                My Listings
              </button>

              {user?.isAdmin && (
                <button onClick={() => { navigate("/admin"); setShowMobileProfile(false); }}>
                  Admin Panel
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  setShowMobileProfile(false);
                }}
                className="text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;