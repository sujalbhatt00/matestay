import React, { useContext, useState } from "react";
import {
  Moon,
  Sun,
  MessageSquare,
  Users,
  PlusCircle,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Crown,
  Home,
  X,
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
    `flex items-center gap-2 text-sm font-medium ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden md:block fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] bg-background/50 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl px-6 py-3">
        <div className="flex items-center justify-between">

          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <img src="/Logo.png" width={60} alt="Matestay" />
            <span className="text-2xl font-bold">Matestay</span>
          </div>

          <div className="flex items-center gap-10">
            <NavLink to="/find-roommates" className={navLinkClass}>
              <Users className="h-4 w-4" /> Find Roommates
            </NavLink>

            <NavLink to="/chat" className={navLinkClass}>
              <div className="relative flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> Messages
                {displayUnreadCount > 0 && (
                  <span className="absolute -top-2 -right-4 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full font-bold">
                    {displayUnreadCount > 9 ? "9+" : displayUnreadCount}
                  </span>
                )}
              </div>
            </NavLink>

            {!user?.isPremium && (
              <NavLink to="/premium" className={navLinkClass}>
                <Crown className="h-4 w-4 text-yellow-500" /> Premium
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="bg-primary text-white rounded-full px-4 shadow hover:bg-primary/90"
                  onClick={() => navigate("/create-listing")}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Post
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-full">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={user.profilePic || defaultAvatar} />
                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>

                      {user.isPremium && (
                        <span className="bg-yellow-500/20 text-yellow-700 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
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
              </div>
            ) : (
              <Button className="bg-primary text-white px-6 rounded-full shadow" onClick={() => setShowAuth(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE TOP NAV */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <div onClick={() => handleNavClick("/")} className="flex items-center gap-2 cursor-pointer">
            <img src="/Logo.png" width={38} alt="logo" />
            <span className="font-semibold text-lg">Matestay</span>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t">
        <div className="flex items-center justify-around h-16">

          <button
            onClick={() => handleNavClick("/")}
            className={`flex flex-col items-center gap-1 ${
              window.location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[11px]">Home</span>
          </button>

          <button
            onClick={() => handleNavClick("/find-roommates")}
            className={`flex flex-col items-center gap-1 ${
              window.location.pathname === "/find-roommates"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-[11px]">Roommates</span>
          </button>

          {/* ⭐ NEW POST BUTTON FIXED DESIGN */}
          <button
            onClick={() => (user ? handleNavClick("/create-listing") : setShowAuth(true))}
            className="flex flex-col items-center -mt-4"
          >
            <div
              className="
                bg-primary text-white rounded-full shadow-lg border border-primary/30
                h-12 w-12 flex items-center justify-center
                active:scale-95 transition
              "
            >
              <PlusCircle className="h-6 w-6" />
            </div>
            <span className="text-[10px] mt-1 text-muted-foreground">Post</span>
          </button>

          <button
            onClick={() => handleNavClick("/chat")}
            className={`flex flex-col items-center gap-1 relative ${
              window.location.pathname.startsWith("/chat") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[11px]">Chat</span>

            {displayUnreadCount > 0 && (
              <span className="absolute -top-1 right-2 bg-red-500 text-white h-4 w-4 text-[9px] rounded-full flex items-center justify-center">
                {displayUnreadCount > 9 ? "9+" : displayUnreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => (user ? setIsMenuOpen(true) : setShowAuth(true))}
            className="flex flex-col items-center gap-1"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.profilePic || defaultAvatar} />
              <AvatarFallback className="text-xs">{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-[11px]">Profile</span>
          </button>

        </div>
      </nav>

      {/* MOBILE PROFILE MENU */}
      {isMenuOpen && user && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl">

          <div className="flex justify-between items-center px-4 py-4 border-b">
            <h3 className="text-xl font-bold">Account</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-4 space-y-6 overflow-y-auto">

            <div className="flex items-center gap-4 bg-secondary/30 rounded-xl p-4 border">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profilePic || defaultAvatar} />
                <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>

                {user.isPremium && (
                  <div className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded-full mt-2 w-fit">
                    <Crown className="h-3 w-3" /> Premium User
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" onClick={() => handleNavClick("/profile")}>
                <UserIcon className="h-5 w-5 mr-3" /> My Profile
              </Button>

              <Button variant="ghost" className="justify-start" onClick={() => handleNavClick("/my-listings")}>
                <LayoutDashboard className="h-5 w-5 mr-3" /> My Listings
              </Button>

              {!user.isPremium && (
                <Button variant="ghost" className="justify-start text-yellow-600" onClick={() => handleNavClick("/premium")}>
                  <Crown className="h-5 w-5 mr-3" /> Upgrade to Premium
                </Button>
              )}

              {user.isAdmin && (
                <Button variant="ghost" className="justify-start" onClick={() => handleNavClick("/admin")}>
                  <ShieldCheck className="h-5 w-5 mr-3" /> Admin Panel
                </Button>
              )}
            </div>

            <Button variant="destructive" className="w-full h-12" onClick={logout}>
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>

          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
