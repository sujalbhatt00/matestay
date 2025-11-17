import React, { useState } from "react";
import axios from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react"; // <-- Removed Eye and EyeOff
import { toast } from "sonner";

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // --- Removed visibility state variables ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put("/user/update-password", {
        oldPassword,
        newPassword,
      });
      toast.success(response.data.message || "Password changed successfully!");
      onClose();
    } catch (err) {
      console.error("Change Password Error:", err);
      const errorMsg = err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Change Password</h3>
          <button 
            className="text-muted-foreground hover:text-foreground transition-colors" 
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div>
            <Label htmlFor="oldPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                id="oldPassword"
                name="oldPassword" 
                type="password" // <-- Set type to password
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                required 
                className="pl-10" // <-- Removed pr-10
              />
              {/* --- Removed Eye Button --- */}
            </div>
          </div>
          
          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                id="newPassword"
                name="newPassword" 
                type="password" // <-- Set type to password
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="pl-10" // <-- Removed pr-10
              />
              {/* --- Removed Eye Button --- */}
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                id="confirmPassword"
                name="confirmPassword" 
                type="password" // <-- Set type to password
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="pl-10" // <-- Removed pr-10
              />
              {/* --- Removed Eye Button --- */}
            </div>
          </div>
          
          {error && <p className="text-destructive text-sm text-center">{error}</p>}

          <Button type="submit" className="w-full bg-[#5b5dda] hover:bg-[#4a4ab5]" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;