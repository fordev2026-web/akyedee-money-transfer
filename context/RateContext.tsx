import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExchangeRate } from '@/types';
import { SENDING_COUNTRIES, RECEIVING_COUNTRY } from '@/constants/countries';

interface RateState {
  rates: ExchangeRate[];
  isLoading: boolean;
  getRate: (fromCurrency: string) => number;
  refreshRates: () => Promise<void>;
}

export const [RateProvider, useRates] = createContextHook((): RateState => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getMockRate = (currency: string): number => {
    const rateMap: Record<string, number> = {
      USD: 16.25,
      CAD: 11.85,
      GBP: 20.15,
    };
    return rateMap[currency] || 1;
  };

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockRates: ExchangeRate[] = SENDING_COUNTRIES.map((country) => ({
        from: country.currency,
        to: RECEIVING_COUNTRY.currency,
        rate: getMockRate(country.currency),
        lastUpdated: new Date(),
      }));
      
      setRates(mockRates);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const getRate = useCallback((fromCurrency: string): number => {
    const rate = rates.find((r) => r.from === fromCurrency);
    return rate?.rate || 1;
  }, [rates]);

  const refreshRates = useCallback(async () => {
    await fetchRates();
  }, [fetchRates]);

  return useMemo(() => ({
    rates,
    isLoading,
    getRate,
    refreshRates,
  }), [rates, isLoading, getRate, refreshRates]);
});
