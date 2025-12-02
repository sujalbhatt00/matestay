import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bath,
  BedDouble,
  CalendarDays,
  IndianRupee
} from "lucide-react";
import { Link } from "react-router-dom";

const placeholderImage =
  "https://via.placeholder.com/400x300.png?text=No+Image";

const PropertyCard = ({ property }) => {
  if (!property) return null;

  const {
    _id,
    title,
    location,
    rent,
    bedrooms,
    bathrooms,
    photos,
    propertyType,
    availableFrom
  } = property;

  const displayImage = photos?.[0] || placeholderImage;

  return (
    <Card className="group flex flex-col h-full overflow-hidden rounded-xl border border-border hover:shadow-lg transition duration-300">
      <div className="relative w-full aspect-[4/3] bg-muted">
        <img
          src={displayImage}
          alt={title}
          className="object-cover w-full h-full"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 text-[10px] px-2 py-0.5 sm:text-xs"
        >
          {propertyType}
        </Badge>
      </div>

      <CardContent className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base sm:text-lg leading-tight mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> {location}
        </p>

        <div className="flex justify-between items-center mb-2">
          <p className="flex items-center gap-1 text-sm sm:text-base font-medium">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span>{rent.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </p>

          <div className="flex gap-2 sm:gap-3 text-[11px] sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3 w-3 sm:h-4 sm:w-4" /> {bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3 sm:h-4 sm:w-4" /> {bathrooms}
            </span>
          </div>
        </div>

        <p className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground mt-auto">
          <CalendarDays className="h-3 w-3" />
          Available from: {new Date(availableFrom).toLocaleDateString()}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 sm:p-4">
        <Button
          asChild
          className="w-full bg-[#5b5dda] text-white hover:bg-[#4a4ab5] h-9 sm:h-10 text-sm"
        >
          <Link to={`/properties/${_id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
