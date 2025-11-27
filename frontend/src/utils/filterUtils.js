import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("roommate");
  const [gender, setGender] = useState("Any");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [focused, setFocused] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (location) queryParams.append("location", location);
    if (type) queryParams.append("type", type);
    if (gender && gender !== "Any") queryParams.append("gender", gender);
    if (budget) queryParams.append("budget", budget);
    if (propertyType) queryParams.append("propertyType", propertyType);

    navigate(`/search?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    setLocation("");
    setType("roommate");
    setGender("Any");
    setBudget("");
    setPropertyType("");
  };

  return (
    <div className="hero">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="roommate">Roommate</option>
          <option value="property">Property</option>
        </select>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="text"
          placeholder="Property Type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={clearFilters}>Clear Filters</button>
      </form>
    </div>
  );
};

export default Hero;