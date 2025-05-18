import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import {
  getUserData,
  saveAuthData,
  clearAuthData,
  isAuthenticated,
  AuthUserData,
  AuthData,
} from '../features/users/presentation/utils/authUtils';

// Define the shape of the auth context
interface AuthContextType {
  user: AuthUserData | null;
  isLoggedIn: boolean;
  login: (authData: AuthData) => void;
  logout: () => void;
  loading: boolean;
  setIsAuthError: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  loading: true,
  setIsAuthError: () => {},
});

// Export a hook for easy usage of the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // New state to track if we're in an error state during auth operations
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getUserData());
        setIsAuthError(false);
      } else {
        // Don't redirect to login if already on login or signup page or if in an error state
        const isAuthPage = router.pathname === '/login' || router.pathname === '/signup';
        if (!isAuthPage && !isAuthError) {
          router.replace('/login');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, isAuthError]);

  // Login function
  const login = (authData: AuthData) => {
    saveAuthData(authData);
    setUser(authData.user);
    setIsAuthError(false);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setIsAuthError(false);
    router.push('/login');
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    loading,
    setIsAuthError, // Expose this to allow components to signal auth errors
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
