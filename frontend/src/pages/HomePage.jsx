import { Search, Home, Users } from "lucide-react";
import InteractiveBackground from "../components/InteractiveBackground";
import Navbar from "../components/Navbar";
import Features from "../components/ui/Features";
import Steps from "../components/ui/Steps";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <InteractiveBackground />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="mt-[8rem] flex flex-col items-center justify-center text-center text-white px-4 space-y-12">
        <div className="bg-black/5 backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl px-12 py-12 max-w-6xl w-full flex flex-col space-y-8">
          <h1 className="text-5xl md:text-8xl font-bold drop-shadow-[0_0_12px_#03c2eb]">
            Find Your Perfect
            <span className="block text-[#03c2eb] mt-2">Roommate</span>
          </h1>
          <p className="text-lg md:text-2xl text-[#8cccd9] max-w-3xl mx-auto">
            Connect with compatible roommates and discover your ideal shared living space
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="flex items-center gap-2 text-lg px-8 py-3 rounded-xl cursor-pointer bg-[#03c2eb] hover:bg-[#0c7795] text-black font-semibold shadow-lg transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50">
            <Search className="w-6 h-6" />
            Find Flatmates
          </button>
          <button className="flex items-center gap-2 text-lg px-8 py-3 backdrop-blur-sm cursor-pointer rounded-xl bg-transparent hover:bg-blue-900/20 text-white font-semibold shadow-lg transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50">
            <Home className="w-6 h-6" />
            List Your Space
          </button>
        </div>

        {/* Floating Glass Cards */}
        <div className="grid md:grid-cols-3 gap-15 pt-16 max-w-6xl w-[65%]">
          <div className="p-6 hover:shadow-[0_0_10px_rgba(0,140,204,0.5)] rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-2 bg-black/5 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl">10K+ Users</h3>
            <p className="text-white/70">Active flatmate seekers</p>
          </div>

          <div className="p-6 hover:shadow-[0_0_10px_rgba(0,140,204,0.5)] rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-2 md:translate-y-8 bg-black/5 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl">5K+ Listings</h3>
            <p className="text-white/70">Available properties</p>
          </div>

          <div className="p-6 hover:shadow-[0_0_10px_rgba(0,140,204,0.5)] rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-2 bg-black/5 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl">Smart Match</h3>
            <p className="text-white/70">AI-powered compatibility</p>
          </div>
        </div>

        {/* Features Section */}
        <Features />

        {/* Steps Section */}

        <Steps />

      </div>
    </div>
  );
}
