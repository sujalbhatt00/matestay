import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MultiStepProfile from "../components/MultiStepProfile";
import ViewProfile from "../components/ViewProfile";
import ReviewSection from "../components/ReviewSection"; // ✅ NEW: Import ReviewSection
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "@/api/axiosInstance";
import { toast } from "sonner";

export default function Profile() {
  const { user, refreshUser, loading, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/");
      return;
    }

    if (!user.profileSetupComplete) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [user, loading, navigate]);

  const handleSaveProfile = async () => {
    await refreshUser();
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      console.log("🗑️ Attempting to delete account...");
      const response = await axios.delete('/user/delete-account');
      
      console.log("✅ Account deleted:", response.data);
      
      toast.success("Your account has been deleted successfully", {
        duration: 3000,
      });
      
      setTimeout(() => {
        logout();
        navigate("/");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Failed to delete account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 pt-28 pb-24 md:pb-12">
        {isEditing ? (
          <MultiStepProfile initialData={user} onSaved={handleSaveProfile} />
        ) : (
          <div className="space-y-8">
            <ViewProfile user={user} onEdit={handleEditProfile} />
            
            {}
            <div className="max-w-3xl mx-auto">
              <ReviewSection userId={user._id} />
            </div>
            
            {/* Delete Account Section */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-destructive mb-2">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. This action is permanent and will delete all your data including messages, listings, and profile information.
                    </p>
                    <div className="bg-background/50 border border-destructive/20 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-destructive mb-2">⚠️ This will permanently delete:</p>
                      <ul className="text-sm space-y-1 pl-4">
                        <li>• Your profile and personal information</li>
                        <li>• All your property listings</li>
                        <li>• All conversations and messages</li>
                        <li>• Your premium subscription (if any)</li>
                        <li>• All reviews you've written and received</li>
                      </ul>
                    </div>
                    <Button
                      onClick={() => setShowDeleteDialog(true)}
                      variant="destructive"
                      className="w-full md:w-auto"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Delete My Account Permanently
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-destructive flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-base font-semibold">
                This action cannot be undone. This will permanently delete your account.
              </p>
              
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="font-semibold text-destructive mb-2 text-sm">
                  The following will be permanently deleted:
                </p>
                <ul className="text-xs space-y-1.5 pl-4">
                  <li>✗ Your profile and personal information</li>
                  <li>✗ All your property listings</li>
                  <li>✗ All conversations and messages</li>
                  <li>✗ Your premium subscription (no refund)</li>
                  <li>✗ All reviews you've written and received</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground italic">
                Type "DELETE" in the confirmation to proceed with deletion.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Yes, Delete My Account
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}