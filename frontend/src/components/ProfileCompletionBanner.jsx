import React from "react";
import { AlertCircle, Edit3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isProfileComplete, getMissingFieldsMessage } from "@/utils/profileCompletion";

const ProfileCompletionBanner = ({ user, onEditProfile }) => {
  if (!user) return null;

  const { isComplete, missingFields, completionPercentage } = isProfileComplete(user);

  if (isComplete) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-accent/30 to-muted border border-border rounded-lg p-5 mb-8 space-y-3">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">
            Improve Your Matching Accuracy
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your profile is {completionPercentage}% complete. Add {getMissingFieldsMessage(missingFields)} to get better matches!
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Complete profiles receive more accurate compatibility scores and higher visibility.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-bold text-primary">{completionPercentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={onEditProfile}
        className="w-full h-9 bg-primary hover:opacity-90 text-primary-foreground font-medium rounded-lg flex items-center justify-center gap-2 text-sm"
      >
        <Edit3 className="h-4 w-4" />
        Edit Profile Now
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProfileCompletionBanner;
