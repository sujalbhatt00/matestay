import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MultiStepProfile from "../components/MultiStepProfile";
import ViewProfile from "../components/ViewProfile";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { user, refreshUser, loading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
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
    <div className="container mx-auto px-4 py-12 pt-28">
      {isEditing ? (
        <MultiStepProfile initialData={user} onSaved={handleSaveProfile} />
      ) : (
        <ViewProfile user={user} onEdit={handleEditProfile} />
      )}
    </div>
  );
}