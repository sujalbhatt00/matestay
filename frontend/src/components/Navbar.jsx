import React, { useState } from "react";
import { Home, Menu, X } from "lucide-react"; // Using lucide-react for icons

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container mx-auto max-w-7xl">
        <div
          className="
            bg-white/5 backdrop-blur-md border border-white/10 shadow-lg
            rounded-2xl px-6 py-4 flex items-center justify-between
            transition-all duration-300 hover:scale-[1.01]
          "
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Home className="w-6 h-6 text-[#03c2eb]" />
            </div>
            <span className="text-2xl font-bold text-white">
              Mate<span className="text-[#03c2eb]">stay</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-slate-300 hover:text-[#03c2eb] transition-colors duration-200"
            >
              Find Flatmates
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-[#03c2eb] transition-colors duration-200"
            >
              List Space
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-[#03c2eb] transition-colors duration-200"
            >
              How It Works
            </a>
            <button
              className="
                bg-[#03c2eb] hover:bg-[#0c7795] text-white font-semibold py-2 px-5 rounded-lg
                transition-all duration-300 shadow-lg cursor-pointer
              "
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-[#03c2eb] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="
              md:hidden mt-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg
              rounded-2xl p-6 space-y-4
            "
          >
            <a
              href="#"
              className="block text-slate-300 hover:text-[#03c2eb] transition-colors duration-200 py-2"
            >
              Find Flatmates
            </a>
            <a
              href="#"
              className="block text-slate-300 hover:text-[#03c2eb] transition-colors duration-200 py-2"
            >
              List Space
            </a>
            <a
              href="#"
              className="block text-slate-300 hover:text-[#03c2eb] transition-colors duration-200 py-2"
            >
              How It Works
            </a>
            <button
              className="
                w-full bg-[#03c2eb] hover:bg-[#0c7795] text-white font-semibold py-2 px-5 rounded-lg
                transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
              "
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
