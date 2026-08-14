'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, AdminLoginResponse } from './api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AdminLoginResponse['user'] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminLoginResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Verify token by getting admin info
      api.getAdminInfo()
        .then((data: any) => {
          setUser(data);
        })
        .catch((error) => {
          // Token is invalid or expired, clear it
          console.error('Auth verification failed:', error);
          localStorage.removeItem('admin_token');
          setUser(null);
          // Only redirect if we're not already on login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            router.push('/login');
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    
    // Verify user is admin
    if (response.user.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }

    localStorage.setItem('admin_token', response.access_token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
