// src/components/Navbar.jsx
import React, { useState } from "react";
import { Home, Menu, X } from "lucide-react"; // Using lucide-react for icons

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container mx-auto max-w-7xl"> {/* Adjusted max-w */}
        <div className="
          bg-white/5 backdrop-blur-md border border-white/10 shadow-lg
          rounded-2xl px-6 py-4 flex items-center justify-between
          transition-all duration-300
          hover:shadow-blue-500/30 hover:border-blue-500/20
        ">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center glow-sm-blue">
              <Home className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              Mate<span className="text-blue-400">stay</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
              Find Flatmates
            </a>
            <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
              List Space
            </a>
            <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
              How It Works
            </a>
            <button className="
              bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg
              transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
            ">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-blue-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="
            md:hidden mt-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg
            rounded-2xl p-6 space-y-4 animate-fade-in
          ">
            <a href="#" className="block text-slate-300 hover:text-blue-400 transition-colors duration-200 py-2">
              Find Flatmates
            </a>
            <a href="#" className="block text-slate-300 hover:text-blue-400 transition-colors duration-200 py-2">
              List Space
            </a>
            <a href="#" className="block text-slate-300 hover:text-blue-400 transition-colors duration-200 py-2">
              How It Works
            </a>
            <button className="
              w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg
              transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
            ">
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;