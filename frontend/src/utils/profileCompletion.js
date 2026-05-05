/**
 * Check if a user profile is complete
 * @param {Object} user - User object
 * @returns {Object} { isComplete: boolean, missingFields: string[] }
 */
export const isProfileComplete = (user) => {
  if (!user) return { isComplete: false, missingFields: ['All'] };

  const requiredFields = [
    'name',
    'email',
    'age',
    'gender',
    'location',
    'occupation',
    'budget',
    'profilePic',
  ];

  const missingFields = [];

  for (const field of requiredFields) {
    if (!user[field] || user[field] === '' || user[field] === 'Any') {
      missingFields.push(field);
    }
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    completionPercentage: Math.round(
      ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
    ),
  };
};

/**
 * Get formatted missing fields message
 * @param {string[]} missingFields - Array of missing field names
 * @returns {string} Formatted message
 */
export const getMissingFieldsMessage = (missingFields) => {
  const fieldNames = {
    name: 'Name',
    email: 'Email',
    age: 'Age',
    gender: 'Gender',
    location: 'Location',
    occupation: 'Occupation',
    budget: 'Budget',
    profilePic: 'Profile Picture',
  };

  const formatted = missingFields
    .slice(0, 3)
    .map((field) => fieldNames[field] || field)
    .join(', ');

  const remaining = missingFields.length > 3 ? ` and ${missingFields.length - 3} more` : '';

  return formatted + remaining;
};
