import React, { useContext, useState } from "react";
import {
  Moon, Sun, MessageSquare, Users, PlusCircle,
  ShieldCheck, User as UserIcon, LogOut, LayoutDashboard,
  Crown, Home, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import AuthModal from "./AuthModal";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { notifications, unreadCount } = useChat(); // ✅ Get persistent unreadCount
  const navigate = useNavigate();

  // ✅ Use persistent unread count from ChatContext
  const displayUnreadCount = unreadCount || 0;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-1 text-sm font-medium transition-colors relative ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-4 w-[95%] md:w-[90%] left-1/2 -translate-x-1/2 z-50 bg-background/70 backdrop-blur-sm border rounded-2xl shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img src="/Logo.png" width={70} alt="Matestay" />
              <span className="text-xl font-bold">Matestay</span>
            </div>

            <div className="flex items-center gap-6">
              <NavLink to="/find-roommates" className={getNavLinkClass}>
                <Users className="h-4 w-4" /> Find Roommates
              </NavLink>

              <NavLink to="/chat" className={getNavLinkClass}>
                <MessageSquare className="h-4 w-4" /> Messages
                {displayUnreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md animate-pulse">
                    {displayUnreadCount > 9 ? "9+" : displayUnreadCount}
                  </span>
                )}
              </NavLink>

              {user && !user.isPremium && (
                <NavLink to="/premium" className={getNavLinkClass}>
                  <Crown className="h-4 w-4 text-yellow-500" /> Premium
                </NavLink>
              )}

              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {user ? (
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    onClick={() => navigate("/create-listing")}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Post Listing
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                          <AvatarImage src={user.profilePic || defaultAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {user.isPremium && (
                            <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full mt-1 w-fit">
                              <Crown className="h-3 w-3" /> Premium
                            </span>
                          )}
                        </div>
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

                      <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button className="bg-[#5b5dda] text-white hover:bg-[#4a4ab5] transition-colors" onClick={() => setShowAuth(true)}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/Logo.png" width={50} alt="Matestay" />
            <span className="text-lg font-bold">Matestay</span>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`
            }
          >
            <Home className="h-5 w-5" />
            <span className="text-[11px] font-medium">Home</span>
          </NavLink>

          {/* Roommates */}
          <NavLink
            to="/find-roommates"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`
            }
          >
            <Users className="h-5 w-5" />
            <span className="text-[11px] font-medium">Roommates</span>
          </NavLink>

          {/* Post Listing */}
          {user ? (
            <button
              onClick={() => navigate("/create-listing")}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-primary -mt-2"
            >
              <div className="bg-primary text-white rounded-full p-2 shadow-lg">
                <PlusCircle className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-medium">Post</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground -mt-2"
            >
              <div className="bg-muted rounded-full p-2 shadow-lg">
                <PlusCircle className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-medium">Post</span>
            </button>
          )}

          {/* Messages */}
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`
            }
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[11px] font-medium">Messages</span>

            {displayUnreadCount > 0 && (
              <span className="absolute top-1 right-2 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold shadow-md animate-pulse">
                {displayUnreadCount > 9 ? "9+" : displayUnreadCount}
              </span>
            )}
          </NavLink>

          {/* Profile */}
          {user ? (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground transition-colors"
            >
              <Avatar className="h-6 w-6 ring-1 ring-border">
                <AvatarImage src={user.profilePic || defaultAvatar} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] font-medium">Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span className="text-[11px] font-medium">Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Modal */}
      {isMenuOpen && user && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl mb-6 border">
                <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                  <AvatarImage src={user.profilePic || defaultAvatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  {user.isPremium && (
                    <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full mt-1">
                      <Crown className="h-3 w-3" /> Premium
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-base"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  <UserIcon className="h-5 w-5 mr-3" /> My Profile
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-base"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/my-listings");
                  }}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" /> My Listings
                </Button>

                {!user.isPremium && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-base text-yellow-600 hover:text-yellow-600 hover:bg-yellow-500/10"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/premium");
                    }}
                  >
                    <Crown className="h-5 w-5 mr-3" /> Upgrade to Premium
                  </Button>
                )}

                {user.isAdmin && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-base"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/admin");
                    }}
                  >
                    <ShieldCheck className="h-5 w-5 mr-3" /> Admin Panel
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 border-t">
              <Button
                variant="destructive"
                className="w-full h-12"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;