import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Define the shape of the user object
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tech_lead' | 'team_member';
  password?: string; // Added for mock login validation
}

// Define the shape of the auth context
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

// Mock users for demonstration
const mockUsers: AuthUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password123', // In a real app, this would be hashed
  },
  {
    id: '2',
    name: 'Tech Lead',
    email: 'lead@example.com',
    role: 'tech_lead',
    password: 'password123',
  },
  {
    id: '3',
    name: 'Team Member',
    email: 'member@example.com',
    role: 'team_member',
    password: 'password123',
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in (from localStorage in this example)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would validate the token with the backend
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call to validate credentials
      const user = mockUsers.find((u) => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create a new user object without the password
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Store user in localStorage (in a real app, you'd store a token)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      // Redirect to the home page with the role parameter
      router.push({
        pathname: '/',
        query: { role: user.role },
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
