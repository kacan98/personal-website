'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; message: string; remainingAttempts?: number }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  eager?: boolean;
}

export function AuthProvider({ children, eager = false }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(eager);

  const checkAuthStatus = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      setIsAuthenticated(data.authenticated || false);
    } catch (error) {
      console.error('Auth status check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<{ success: boolean; message: string; remainingAttempts?: number }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      }

      return {
        success: false,
        message: data.message,
        remainingAttempts: data.remainingAttempts
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (eager) {
      checkAuthStatus();
    }
  }, [eager]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
