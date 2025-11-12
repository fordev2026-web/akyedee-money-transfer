import { Country } from '@/types';

export const SENDING_COUNTRIES: Country[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    flag: '🇨🇦',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
  },
];

export const RECEIVING_COUNTRY: Country = {
  code: 'GH',
  name: 'Ghana',
  currency: 'GHS',
  flag: '🇬🇭',
};

export const MOBILE_MONEY_PROVIDERS = [
  { id: 'mtn', name: 'MTN Mobile Money', logo: '📱' },
  { id: 'vodafone', name: 'Vodafone Cash', logo: '📱' },
  { id: 'airteltigo', name: 'AirtelTigo Money', logo: '📱' },
];

export const GHANA_BANKS = [
  'GCB Bank',
  'Ecobank Ghana',
  'Absa Bank Ghana',
  'Fidelity Bank Ghana',
  'Standard Chartered Bank',
  'Zenith Bank Ghana',
  'CalBank',
  'Access Bank Ghana',
];
