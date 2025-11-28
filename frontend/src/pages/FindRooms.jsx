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
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="pt-28 pb-20 container mx-auto px-3 sm:px-4">

      {/* PAGE TITLE */}
      <div className="text-center mb-8 animate-fadeUp">
        <h1 className="text-3xl sm:text-4xl font-bold">Find Rooms</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Search rooms based on your preferred location and budget.
        </p>
      </div>

      {/* COMPACT FILTERS */}
      <div className="
        bg-card border border-border/40 px-4 py-4 
        rounded-xl shadow-sm max-w-3xl mx-auto 
        animate-fadeUp
      ">
        <div className="flex items-center gap-3">

          {/* Location */}
          <div className="flex-1">
            <LocationCombobox value={location} onChange={setLocation} />
          </div>

          <Button className="h-10 px-4 rounded-lg shadow-sm text-sm">
            <Search className="h-4 w-4 mr-2" />
            Apply
          </Button>

          <Button 
            variant="outline"
            className="h-10 px-3 rounded-lg text-sm flex gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Extra Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 animate-fadeDown">

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Max Budget (₹)
              </label>
              <input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="
                  mt-1 px-2 py-2 rounded-lg border text-sm bg-background 
                  w-full focus:ring-2 ring-primary/40
                "
                placeholder="10000"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="
                  mt-1 px-2 py-2 rounded-lg border text-sm bg-background 
                  w-full focus:ring-2 ring-primary/40
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

        <div className="flex justify-end mt-3">
          <button
            onClick={clearFilters}
            className="
              px-4 py-2 text-sm rounded-lg border bg-muted/40 
              text-muted-foreground hover:bg-primary hover:text-white 
              transition
            "
          >
            Clear
          </button>
        </div>
      </div>

      {/* ROOM LIST */}
      {loading ? (
        <div className="text-center py-20 animate-fadeUp">
          <Loader2 className="h-10 w-10 animate-spin mx-auto" />
          <p className="mt-2 text-muted-foreground text-sm">Loading rooms...</p>
        </div>
      ) : rooms.length > 0 ? (
        <div
          className="
            grid gap-4 sm:gap-5 
            grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
            animate-fadeUp delay-200
          "
        >
          {rooms.map((room) => (
            <div key={room._id} className="scale-[0.92] hover:scale-[0.97] transition">
              <PropertyCard property={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-fadeUp">
          <Home className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold mt-3">No Rooms Found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting filters or searching another location.
          </p>
        </div>
      )}

   

      {/* ANIMATIONS */}
      <style>{`
        .animate-fadeUp {
          animation: fadeUp 0.5s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeDown {
          animation: fadeDown 0.35s ease forwards;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
