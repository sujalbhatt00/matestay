import React from 'react';
import PropertyCard from './PropertyCard';

const SimilarProperties = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Similar Listings Nearby</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <PropertyCard key={prop._id} property={prop} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
