import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Country } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  selectCountry: (country: Country) => void;
  completeKYC: (kycData: KYCData) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface KYCData {
  idType: string;
  idNumber: string;
  address: string;
  selfieUri: string;
  idPhotoUri: string;
}

export const [AuthProvider, useAuth] = createContextHook((): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const [storedUser, onboardingStatus] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('hasCompletedOnboarding'),
      ]);
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (onboardingStatus === 'true') {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        country: { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
        isVerified: true,
        kycStatus: 'verified',
      };
      
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPendingUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (otp: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('OTP verified:', otp);
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectCountry = useCallback((country: Country) => {
    setPendingUser((prev) => ({ ...prev, country }));
  }, []);

  const completeKYC = useCallback(async (kycData: KYCData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: pendingUser?.email || '',
        firstName: pendingUser?.firstName || '',
        lastName: pendingUser?.lastName || '',
        phone: pendingUser?.phone || '',
        country: pendingUser?.country || { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
        isVerified: true,
        kycStatus: 'verified',
      };
      
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setPendingUser(null);
    } catch (error) {
      console.error('KYC completion failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pendingUser]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  }, []);

  return useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    hasCompletedOnboarding,
    login,
    register,
    verifyOTP,
    selectCountry,
    completeKYC,
    logout,
    completeOnboarding,
  }), [user, isLoading, hasCompletedOnboarding, login, register, verifyOTP, selectCountry, completeKYC, logout, completeOnboarding]);
});
