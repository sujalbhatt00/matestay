import React, { useState, useContext } from "react";
import { Users, Home, BedDouble, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

const CategoryModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [selected, setSelected] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleListProperty = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      navigate("/create-listing");
    }
  };

  const categories = [
    {
      id: "roommate",
      title: "Find a Flatmate",
      description: "Looking for people to share with",
      icon: Users,
      action: () => navigate("/find-roommates"),
    },
    {
      id: "room",
      title: "Find a Flat/Room",
      description: "Searching for a room to rent",
      icon: BedDouble,
      action: () => navigate("/find-rooms?type=room&showFilters=1"),
    },
    {
      id: "property",
      title: "List a Property",
      description: "Post your room or property",
      icon: Home,
      action: handleListProperty,
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="relative bg-foreground text-background px-5 sm:px-6 md:px-8 py-7 sm:py-10 md:py-12">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
              What are you looking for?
            </h2>

            <p className="text-sm sm:text-base text-background/80">
              Choose an option to get started
            </p>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 sm:p-6 md:p-8">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelected(category.id);

                    setTimeout(() => {
                      category.action();
                      onClose();
                    }, 200);
                  }}
                  className={`relative w-full text-left p-5 sm:p-6 rounded-xl transition-all duration-300 ${
                    selected === category.id
                      ? "bg-foreground text-background shadow-lg sm:scale-105"
                      : "bg-gray-100 dark:bg-neutral-800 border border-border hover:border-foreground/40 hover:shadow-md"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex p-3 rounded-lg ${
                      selected === category.id
                        ? "bg-background/20"
                        : "bg-gray-200 dark:bg-neutral-700"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${
                        selected === category.id
                          ? "text-background"
                          : ""
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold mb-2">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm mb-4 leading-relaxed ${
                      selected === category.id
                        ? "text-background/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {category.description}
                  </p>

                  {/* CTA */}
                  <div
                    className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all ${
                      selected === category.id
                        ? "text-background opacity-100"
                        : "opacity-70"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </>
  );
};

export default CategoryModal;