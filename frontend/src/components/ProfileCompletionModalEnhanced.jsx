import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Zap, Target, Eye, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isProfileComplete, getMissingFieldsMessage } from "@/utils/profileCompletion";

const ProfileCompletionModal = ({ user, onClose, onEditProfile }) => {
  const { isComplete, missingFields, completionPercentage } = isProfileComplete(user);
  const [dismissed, setDismissed] = useState(false);

  const benefits = [
    { icon: Target, text: "Better roommate matching", color: "text-blue-600" },
    { icon: Eye, text: "Higher visibility to others", color: "text-purple-600" },
    { icon: MessageSquare, text: "More message requests", color: "text-green-600" },
    { icon: Star, text: "Premium features access", color: "text-yellow-600" },
    { icon: CheckCircle2, text: "Complete profile badge", color: "text-red-600" },
  ];

  if (isComplete || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card dark:bg-card rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-border animate-in scale-in duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground p-8 flex items-start justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor, transparent 50%)',
          }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-6 w-6" />
              <h2 className="text-3xl font-bold">Complete Your Profile</h2>
            </div>
            <p className="text-primary-foreground/80 text-sm">Unlock the full potential of Matestay</p>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors relative z-10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Completion Progress - Enhanced */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-foreground">Profile Completion</span>
                <p className="text-xs text-muted-foreground">You're almost there!</p>
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20" />
                <span className="text-3xl font-bold text-primary">{completionPercentage}%</span>
              </div>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Missing Fields - Enhanced */}
          {missingFields.length > 0 && (
            <div className="bg-gradient-to-r from-accent/20 to-primary/10 border border-accent/50 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Missing {missingFields.length} field{missingFields.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add: <span className="font-semibold text-foreground">{getMissingFieldsMessage(missingFields)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits - Grid Layout */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Why Complete Your Profile?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <Icon className={`h-5 w-5 flex-shrink-0 ${benefit.color}`} />
                    <span className="text-sm text-muted-foreground">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How Matching Works */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-2">
              <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-foreground">Smart Matching Algorithm</p>
                <p className="text-xs text-muted-foreground mt-1">
                  We analyze 8 compatibility factors: location, budget, age, gender, occupation, smoking preference, sleep schedule, and cleanliness level. Complete your profile for the most accurate matches!
                </p>
              </div>
            </div>
          </div>

          {/* Actions - Enhanced */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={() => setDismissed(true)}
              variant="outline"
              className="flex-1 h-11 rounded-lg font-medium"
            >
              Skip for Now
            </Button>
            <Button
              onClick={() => {
                onEditProfile();
                setDismissed(true);
              }}
              className="flex-1 h-11 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Complete Profile Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
