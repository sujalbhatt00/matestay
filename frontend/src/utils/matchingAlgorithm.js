/**
 * Smart matching algorithm to calculate compatibility between users
 * @param {Object} currentUser - The logged-in user
 * @param {Object} potentialRoommate - The profile being viewed
 * @returns {number} Matching percentage (0-100)
 */
export const calculateMatchingPercentage = (currentUser, potentialRoommate) => {
  if (!currentUser || !potentialRoommate) return 0;

  let score = 0;
  let maxScore = 0;

  // 1. Location Match (20 points)
  maxScore += 20;
  if (currentUser.location && potentialRoommate.location) {
    if (currentUser.location.toLowerCase() === potentialRoommate.location.toLowerCase()) {
      score += 20;
    }
  }

  // 2. Budget Match (15 points)
  maxScore += 15;
  if (currentUser.budget && potentialRoommate.budget) {
    const userBudget = parseInt(currentUser.budget);
    const roommateBudget = parseInt(potentialRoommate.budget);
    const difference = Math.abs(userBudget - roommateBudget);
    const tolerance = Math.max(userBudget, roommateBudget) * 0.3; // 30% tolerance

    if (difference <= tolerance) {
      score += 15;
    } else if (difference <= tolerance * 1.5) {
      score += 10;
    }
  }

  // 3. Gender Match (15 points) - Basic gender compatibility
  maxScore += 15;
  if (currentUser.gender && potentialRoommate.gender) {
    // If both have same gender, they match (15 pts)
    // If different but both are flexible, give partial credit (8 pts)
    if (currentUser.gender === potentialRoommate.gender) {
      score += 15;
    } else {
      score += 8; // Different genders but still somewhat compatible
    }
  } else if (currentUser.gender || potentialRoommate.gender) {
    score += 8; // One has gender specified
  }

  // 4. Age Range Match (15 points)
  maxScore += 15;
  if (currentUser.age && potentialRoommate.age) {
    const ageDifference = Math.abs(currentUser.age - potentialRoommate.age);
    if (ageDifference <= 5) {
      score += 15;
    } else if (ageDifference <= 10) {
      score += 10;
    } else if (ageDifference <= 15) {
      score += 5;
    }
  }

  // 5. Occupation/Professional Status Match (10 points)
  maxScore += 10;
  if (currentUser.occupation && potentialRoommate.occupation) {
    const userStatus = currentUser.occupation.toLowerCase().includes("student")
      ? "student"
      : "working";
    const roommateStatus = potentialRoommate.occupation.toLowerCase().includes("student")
      ? "student"
      : "working";

    if (userStatus === roommateStatus) {
      score += 10;
    } else {
      score += 5; // Half points for mixed professional status
    }
  }

  // 6. Smoking Preference Match (10 points)
  maxScore += 10;
  if (currentUser.smokingPreference && potentialRoommate.smokingPreference) {
    if (currentUser.smokingPreference === potentialRoommate.smokingPreference) {
      score += 10;
    }
  }

  // 7. Sleep Schedule Compatibility (5 points)
  maxScore += 5;
  if (currentUser.sleepSchedule && potentialRoommate.sleepSchedule) {
    if (currentUser.sleepSchedule === potentialRoommate.sleepSchedule) {
      score += 5;
    }
  }

  // 8. Cleanliness & Lifestyle Match (5 points)
  maxScore += 5;
  if (currentUser.cleanlinessLevel && potentialRoommate.cleanlinessLevel) {
    const userLevel = ["Very Messy", "Messy", "Average", "Clean", "Very Clean"].indexOf(
      currentUser.cleanlinessLevel
    );
    const roommateLevel = ["Very Messy", "Messy", "Average", "Clean", "Very Clean"].indexOf(
      potentialRoommate.cleanlinessLevel
    );

    if (userLevel !== -1 && roommateLevel !== -1) {
      const difference = Math.abs(userLevel - roommateLevel);
      if (difference === 0) {
        score += 5;
      } else if (difference === 1) {
        score += 3;
      }
    }
  }

  // Calculate final percentage
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return Math.min(100, percentage); // Ensure it doesn't exceed 100
};

/**
 * Get matching insight text
 * @param {number} percentage - Matching percentage
 * @returns {string} Insight text
 */
export const getMatchingInsight = (percentage) => {
  if (percentage >= 90) return "Perfect Match!";
  if (percentage >= 75) return "Great Match";
  if (percentage >= 60) return "Good Match";
  if (percentage >= 45) return "Moderate Match";
  if (percentage >= 30) return "Fair Match";
  return "Low Match";
};

/**
 * Get matching insight color
 * @param {number} percentage - Matching percentage
 * @returns {string} Tailwind color classes
 */
export const getMatchingColor = (percentage) => {
  if (percentage >= 90) return "text-green-600 bg-green-50 border-green-200";
  if (percentage >= 75) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
  if (percentage >= 45) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (percentage >= 30) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-red-600 bg-red-50 border-red-200";
};
