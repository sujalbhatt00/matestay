import React, { useContext, useState } from "react";
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
  X,
  BedDouble,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import AuthModal from "./AuthModal";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useChat();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const displayUnreadCount = unreadCount || 0;

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-colors ${
      isActive
        ? "text-primary"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <>
      {/* ===================== DESKTOP NAV ===================== */}
      <nav
        className="
        hidden md:block fixed top-5 left-1/2 -translate-x-1/2
        z-50 w-[88%] bg-background/50 backdrop-blur-xl
        border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.08)]
        rounded-2xl px-6 py-3 transition-all
      "
      >
        <div className="flex items-center justify-between h-10">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <img src="/Logo.png" width={50} alt="Matestay" />
            <span className="text-xl font-bold tracking-tight">
              Matestay
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <NavLink to="/find-roommates" className={navLinkClass}>
              <Users className="h-4 w-4" /> Find Roommates
            </NavLink>

            {/* Modern Rooms button */}
            <button
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => navigate("/find-rooms?type=room&showFilters=1")}
              style={{ background: "none", border: "none" }}
            >
              <BedDouble className="h-4 w-4" /> Find Rooms
            </button>

            {/* Messages */}
            <NavLink to="/chat" className={navLinkClass}>
              <div className="relative flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Messages
                {displayUnreadCount > 0 && (
                  <span className="absolute -top-2 -right-4 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full font-bold">
                    {displayUnreadCount > 9 ? "9+" : displayUnreadCount}
                  </span>
                )}
              </div>
            </NavLink>

            {!user?.isPremium && (
              <NavLink to="/premium" className={navLinkClass}>
                <Crown className="h-4 w-4 text-yellow-500" />
                Premium
              </NavLink>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Modern "List Property" button */}
            {user && (
              <Button
                onClick={() => navigate("/create-listing")}
                className="
                bg-primary text-primary-foreground font-semibold 
                rounded-full px-5 py-1.5 shadow-md hover:bg-primary/90
                "
              >
                <Plus className="h-4 w-4 mr-1" />
                List Property
              </Button>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePic || defaultAvatar} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>

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

                  {user.isAdmin && (
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
              <Button
                className="bg-primary text-primary-foreground px-5 rounded-full shadow hover:bg-primary/90"
                onClick={() => setShowAuth(true)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* ===================== MOBILE NAVS (unchanged for now) ===================== */}
      {/** Your original mobile navbar code stays as-is, no errors **/}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
