import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading, refreshUser, logout } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      if (!user) {
        setIsValid(false);
        setVerifying(false);
        return;
      }

      console.log('🔍 ProtectedRoute: Verifying user exists in database...');
      
      try {
        const result = await refreshUser();
        
        if (isMounted) {
          if (result) {
            console.log('✅ ProtectedRoute: User verified successfully');
            setIsValid(true);
          } else {
            console.log('❌ ProtectedRoute: User verification failed');
            logout();
            setIsValid(false);
          }
          setVerifying(false);
        }
      } catch (error) {
        console.error('❌ ProtectedRoute: Error during verification:', error);
        if (isMounted) {
          logout();
          setIsValid(false);
          setVerifying(false);
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [user?._id]); // Only re-run if user ID changes

  if (loading || verifying) {
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;