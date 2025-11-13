import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import PropertyCard from '@/components/PropertyCard';
import { Loader2, Home, Search } from 'lucide-react';
import { LocationCombobox } from '@/components/ui/LocationCombobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PropertiesSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      
      if (location) params.append('location', location);
      if (propertyType) params.append('propertyType', propertyType);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (bedrooms) params.append('bedrooms', bedrooms);

      const res = await axios.get(`/properties/search?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError('Could not load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType) params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setLocation('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSearchParams({});
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 pb-16 flex-grow bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-2">
              <Home className="h-8 w-8" />
              Search Properties
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {location ? `Properties in ${location}` : 'Find your perfect place'}
            </p>
          </div>

          {/* Search Filters */}
          <form onSubmit={handleSearch} className="bg-card border rounded-xl p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="mb-2 block">Location</Label>
                <LocationCombobox
                  value={location}
                  onChange={setLocation}
                />
              </div>

              {/* Property Type */}
              <div>
                <Label htmlFor="propertyType" className="mb-2 block">Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Type</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Room">Room</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div>
                <Label htmlFor="minPrice" className="mb-2 block">Min Rent (₹)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              {/* Max Price */}
              <div>
                <Label htmlFor="maxPrice" className="mb-2 block">Max Rent (₹)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Bedrooms */}
              <div>
                <Label htmlFor="bedrooms" className="mb-2 block">Bedrooms</Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1 bg-[#5b5dda] hover:bg-[#4a4ab5]">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{properties.length}</span> {properties.length === 1 ? 'property' : 'properties'}
              </div>

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card border rounded-xl p-8">
                  <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search filters or location
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesSearchPage;