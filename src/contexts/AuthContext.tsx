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
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  loading: true,
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

  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getUserData());
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = (authData: AuthData) => {
    saveAuthData(authData);
    setUser(authData.user);
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    setUser(null);
    router.push('/login');
  };

  // Context value
  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
