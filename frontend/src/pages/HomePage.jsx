import InteractiveBackground from "../components/InteractiveBackground";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="h-screen relative">
      <InteractiveBackground />
      <Navbar />
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold">Welcome to Home Page</h1>
      </div>
    </div>
  );
}
