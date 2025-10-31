import { Search, Home, Users } from "lucide-react";
import InteractiveBackground from "../components/InteractiveBackground";
import Navbar from "../components/Navbar";
import Features from "../components/ui/Features";
import Steps from "../components/ui/Steps";
import Ready from "../components/ui/Ready";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Background */}
      <InteractiveBackground />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="mt-32 flex flex-col items-center px-4 text-center space-y-16">
        <div className="backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-10 md:p-16 max-w-6xl w-full bg-black/20">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-[0_0_15px_#03c2eb] leading-tight">
            Find Your Perfect
            <span className="block text-[#03c2eb] mt-3">Roommate</span>
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-[#a6dfea] max-w-2xl mx-auto">
            Connect with verified roommates and discover your ideal shared living space.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="flex items-center gap-3 px-10 py-4 text-lg rounded-xl bg-[#03c2eb] hover:bg-[#089fbd] text-black font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
            <Search className="w-6 h-6" /> Find Flatmates
          </button>

          <button className="flex items-center gap-3 px-10 py-4 text-lg rounded-xl border border-[#03c2eb]/40 backdrop-blur-sm hover:bg-[#0d2c36]/40 transition-all hover:scale-105 active:scale-95">
            <Home className="w-6 h-6" /> List Your Space
          </button>
        </div>

        {/* Floating Stats Section */}
        <div className="grid md:grid-cols-3 gap-10 pt-10 max-w-4xl w-full">
          {[
            { icon: Users, title: "10K+ Users", desc: "Active flatmate seekers" },
            { icon: Home, title: "5K+ Listings", desc: "Available properties" },
            { icon: Search, title: "Smart Match", desc: "AI-powered compatibility" },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:shadow-[0_0_20px_#03c2eb] transition-all hover:-translate-y-2 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#03c2eb]/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-[#03c2eb]" />
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <Features />
        <Steps />
        <Ready />
      </section>

      <footer className="mt-16 py-6 text-center text-[#72a8b7] border-t border-white/10 bg-black/10 backdrop-blur-sm">
        © 2024 Flatmate. All rights reserved.
      </footer>
    </div>
  );
}
