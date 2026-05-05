import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isProfileComplete, getMissingFieldsMessage } from "@/utils/profileCompletion";

const ProfileCompletionModal = ({ user, onClose, onEditProfile }) => {
  const { isComplete, missingFields, completionPercentage } = isProfileComplete(user);
  const [dismissed, setDismissed] = useState(false);

  if (isComplete || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card dark:bg-card rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-border">
        {/* Compact Header */}
        <div className="bg-primary/5 dark:bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Complete Your Profile</h2>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-foreground/10 dark:hover:bg-foreground/20 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-muted-foreground">Profile Complete</span>
              <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Missing Fields */}
          {missingFields.length > 0 && (
            <div className="bg-muted/50 dark:bg-muted/30 border border-border rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Missing: {getMissingFieldsMessage(missingFields)}
              </p>
            </div>
          )}

          {/* Why It Matters */}
          <div className="bg-secondary/40 dark:bg-secondary/20 border border-border rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Why Complete?
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-5 list-disc">
              <li>Better roommate matching</li>
              <li>Higher visibility in searches</li>
              <li>More message requests</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setDismissed(true)}
              variant="ghost"
              className="flex-1 h-9 text-sm rounded-lg"
            >
              Skip
            </Button>
            <Button
              onClick={() => {
                onEditProfile();
                setDismissed(true);
              }}
              className="flex-1 h-9 text-sm rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Complete Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
