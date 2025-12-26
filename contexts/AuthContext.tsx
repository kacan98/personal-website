'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

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
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      const data = await response.json();
      setIsAuthenticated(data.authenticated || false);
    } catch (error) {
      console.error('Auth status check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (password: string): Promise<{ success: boolean; message: string; remainingAttempts?: number }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message,
          remainingAttempts: data.remainingAttempts
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });

      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still set to false even if request fails
      setIsAuthenticated(false);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value: AuthContextType = useMemo(() => ({
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  }), [isAuthenticated, isLoading, login, logout, checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}