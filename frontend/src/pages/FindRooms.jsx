import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "@/api/axiosInstance";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";

export default function FindRooms() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [location, setLocation] = useState(params.get("location") || "");
  const [budget, setBudget] = useState(params.get("budget") || "");
  const [propertyType, setPropertyType] = useState(params.get("propertyType") || "");
  const [expandedFilters, setExpandedFilters] = useState(true);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    setLoading(true);

    try {
      const q = new URLSearchParams();

      if (location) q.append("location", location);
      if (budget) q.append("budget", budget);
      if (propertyType) q.append("propertyType", propertyType);

      const res = await axios.get(`/properties/search?${q.toString()}`);
      setRooms(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
      setRooms([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();

    if (location) q.append("location", location);
    if (budget) q.append("budget", budget);
    if (propertyType) q.append("propertyType", propertyType);

    navigate(`/find-rooms?${q.toString()}`, { replace: true });
    loadRooms();
  }, [location, budget, propertyType]);

  const clearFilters = () => {
    setLocation("");
    setBudget("");
    setPropertyType("");
  };

  return (
    <div className="pt-28 pb-24 container mx-auto px-4">

      {/* PAGE TITLE */}
      <div className="text-center mb-12 animate-fadeUp">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Find Rooms</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Filter through listed rooms and find the perfect accommodation that suits your needs.
        </p>
      </div>

      {/* FILTER BOX */}
      <div className="
        bg-card border border-border/60 
        p-6 md:p-8 rounded-2xl shadow-lg 
        max-w-4xl mx-auto mb-14
        animate-fadeUp delay-200
      ">

        {/* Main filter row */}
        <div className="flex flex-col md:flex-row items-center gap-4">

          <div className="flex-1 w-full">
            <LocationCombobox value={location} onChange={setLocation} />
          </div>

          <Button
            className="h-11 rounded-xl px-7 font-semibold shadow-primary/20 hover:shadow-md transition-all"
          >
            <Search className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>

        {/* Expand Filters */}
        <button
          type="button"
          onClick={() => setExpandedFilters((v) => !v)}
          className="flex items-center gap-2 text-primary text-sm font-medium mt-4 mx-auto hover:underline"
        >
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </button>

        {/* Extra Filters */}
        {expandedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 animate-fadeDown">

            {/* Budget */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Max Budget (₹)</label>
              <input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="
                  mt-1 px-3 py-2 rounded-xl border bg-background 
                  focus:ring-2 ring-primary/50 transition-all w-full
                "
                placeholder="e.g. 10000"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="
                  mt-1 px-3 py-2 rounded-xl border bg-background 
                  focus:ring-2 ring-primary/50 transition-all w-full
                "
              >
                <option value="">Any</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>
        )}

        {/* CLEAR BUTTON */}
        <div className="flex justify-end mt-5">
          <button
            onClick={clearFilters}
            className="
              px-5 py-2 rounded-xl border bg-muted/40 
              text-muted-foreground hover:bg-primary hover:text-white 
              transition-all shadow-sm
            "
          >
            Clear
          </button>
        </div>
      </div>

      {/* ROOM RESULTS */}
      {loading ? (
        <div className="text-center py-24 animate-fadeUp">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <p className="mt-3 text-muted-foreground">Fetching rooms...</p>
        </div>
      ) : rooms.length > 0 ? (
        <div className="
          grid gap-7 
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
          animate-fadeUp delay-300
        ">
          {rooms.map((room) => (
            <PropertyCard key={room._id} property={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 animate-fadeUp">
          <Home className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="text-2xl font-semibold mt-4">No Rooms Found</h3>
          <p className="text-muted-foreground mt-1">
            Try changing your filters or searching a different location.
          </p>
        </div>
      )}

      <Footer />

      {/* Animations */}
      <style>{`
        .animate-fadeUp {
          animation: fadeUp 0.7s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeDown {
          animation: fadeDown 0.4s ease forwards;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
