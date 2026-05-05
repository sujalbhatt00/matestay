import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isProfileComplete } from '@/utils/profileCompletion';

/**
 * Custom hook to manage profile completion modal
 * Shows modal once per session if user profile is incomplete
 * @returns {Object} { showModal: boolean, closeModal: function, isComplete: boolean }
 */
export const useProfileCompletionModal = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isComplete, setIsComplete] = useState(true);

  useEffect(() => {
    if (!user) {
      setShowModal(false);
      return;
    }

    // Check if modal has already been shown this session
    const modalShown = sessionStorage.getItem('matestay_completion_modal_shown');
    const profileCheck = isProfileComplete(user);
    
    setIsComplete(profileCheck.isComplete);

    if (!modalShown && !profileCheck.isComplete) {
      // Delay showing modal so page fully loads
      const timer = setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem('matestay_completion_modal_shown', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    closeModal,
    isComplete,
  };
};
