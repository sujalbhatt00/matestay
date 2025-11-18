import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MultiStepProfile from "../components/MultiStepProfile";
import ViewProfile from "../components/ViewProfile";
import ReviewSection from "../components/ReviewSection";
import ProfileViewsModal from "../components/ProfileViewsModal";

import { Loader2, AlertTriangle, Eye } from "lucide-react";
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
  const [showViewsModal, setShowViewsModal] = useState(false);

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

  const handleEditProfile = () => setIsEditing(true);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete("/user/delete-account");

      toast.success("Your account has been deleted successfully");

      setTimeout(() => {
        logout();
        navigate("/");
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
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

  if (!user) return null;

  return (
    <>
      <div className="container mx-auto px-4 py-12 pt-28 pb-24 md:pb-12">

        {isEditing ? (
          <MultiStepProfile initialData={user} onSaved={handleSaveProfile} />
        ) : (
          <div className="space-y-8">

            <div className="flex justify-end max-w-3xl mx-auto">
              <Button 
                variant="secondary" 
                onClick={() => setShowViewsModal(true)}
                className="shadow-sm"
              >
                <Eye className="mr-2 h-4 w-4" /> Who Viewed My Profile?
              </Button>
            </div>
            <ViewProfile user={user} onEdit={handleEditProfile} />

            <div className="max-w-3xl mx-auto">
              <ReviewSection userId={user._id} />
            </div>

            <div className="max-w-3xl mx-auto w-full">
              <div
                className="
                  bg-card 
                  border border-border 
                  rounded-2xl 
                  p-6 
                  shadow-sm 
                  space-y-5
                "
              >
                <div className="flex items-start gap-4">

                  <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">Delete Your Account</h3>

                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      You can delete your account anytime. Your profile and data will be
                      permanently removed from Matestay.
                    </p>

                    <div
                      className="
                        bg-muted/50 
                        border border-border 
                        rounded-lg 
                        p-4 
                        mt-4 
                        text-sm
                      "
                    >
                      <p className="font-medium mb-2 text-foreground">
                        What will be deleted?
                      </p>
                      <ul className="space-y-1 pl-4 text-muted-foreground text-[13px]">
                        <li>• Your profile & personal info</li>
                        <li>• All property listings</li>
                        <li>• All conversations & messages</li>
                        <li>• Reviews you wrote & received</li>
                        <li>• Your premium subscription (if active)</li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => setShowDeleteDialog(true)}
                      variant="destructive"
                      className="mt-5 w-full md:w-auto px-6 py-2 rounded-full"
                    >
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Confirm Account Deletion
            </AlertDialogTitle>

            <AlertDialogDescription className="space-y-3 text-sm leading-relaxed">
              <p>
                This action cannot be undone. Your account and all data will be permanently deleted.
              </p>

              <div className="bg-muted/40 border border-border rounded-lg p-3 text-xs">
                <ul className="space-y-1 pl-4 text-muted-foreground">
                  <li>✗ Profile & personal info</li>
                  <li>✗ Listings</li>
                  <li>✗ Messages</li>
                  <li>✗ Reviews</li>
                  <li>✗ Premium access</li>
                </ul>
              </div>

              <p className="text-muted-foreground italic">
                You will be logged out immediately after deletion.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 flex-col sm:flex-row">
            <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Deleting…
                </>
              ) : (
                "Yes, Delete My Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ProfileViewsModal 
        isOpen={showViewsModal} 
        onClose={() => setShowViewsModal(false)} 
      />
    </>
  );
}