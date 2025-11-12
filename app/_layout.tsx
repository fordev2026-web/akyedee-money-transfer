import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { RateProvider } from '@/context/RateContext';
import { TransferProvider } from '@/context/TransferContext';
import { trpc, trpcClient } from '@/lib/trpc';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RateProvider>
            <TransferProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="(auth)/register" />
                <Stack.Screen name="(auth)/verify-otp" />
                <Stack.Screen name="(auth)/country-select" />
                <Stack.Screen name="(auth)/kyc" />
                <Stack.Screen name="(auth)/success" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </TransferProvider>
          </RateProvider>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
