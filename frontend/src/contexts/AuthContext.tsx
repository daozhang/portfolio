import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  role: 'artist' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate user session
    const token = localStorage.getItem('authToken');
    if (token) {
      // TODO: Validate token with backend and set user
      // For now, we'll simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual login API call
      // For now, simulate login
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'artist'
      };
      setUser(mockUser);
      localStorage.setItem('authToken', 'mock-token');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};