import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, IndianRupee, BedDouble, Bath } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  if (!property) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/properties/${property._id}`);
  };

  return (
    <Card 
      className="overflow-hidden border border-border bg-white dark:bg-neutral-900 hover:border-foreground/30 transition-all duration-200 hover:shadow-md cursor-pointer group flex flex-col h-full"
      onClick={handleClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-300 dark:bg-gray-700 flex-shrink-0">
        <img
          src={property.photos?.[0] || property.images?.[0] || "https://via.placeholder.com/400x300"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300";
          }}
        />

        {property.isFeatured && (
          <Badge variant="secondary" className="absolute top-2 left-2 text-xs">Featured</Badge>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 bg-white/95 dark:bg-black/50 hover:bg-white p-1.5 rounded-full transition-all"
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        <div className="absolute bottom-2 right-2 bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs font-bold">
          ₹{(property.rent || property.rentPerMonth)?.toLocaleString() || '0'}/mo
        </div>
      </div>

      <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
        <div>
          <h3 className="text-base font-bold line-clamp-2 group-hover:text-foreground transition-colors">
            {property.title}
          </h3>
          {property.location && (
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground line-clamp-1">{property.location}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
              <BedDouble className="h-4 w-4 text-foreground flex-shrink-0" />
              <div>
                <div className="font-bold">{property.bedrooms}</div>
                <div className="text-muted-foreground text-[10px]">Beds</div>
              </div>
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
              <Bath className="h-4 w-4 text-foreground flex-shrink-0" />
              <div>
                <div className="font-bold">{property.bathrooms}</div>
                <div className="text-muted-foreground text-[10px]">Baths</div>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="w-full h-8 rounded-lg text-xs font-semibold mt-auto"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
