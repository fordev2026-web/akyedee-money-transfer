export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: Country;
  isVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

export interface Recipient {
  id: string;
  name: string;
  phone: string;
  method: 'mobile_money' | 'bank';
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  mobileMoneyDetails?: {
    provider: string;
    number: string;
  };
}

export interface Transaction {
  id: string;
  recipientName: string;
  recipientPhone: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  method: 'mobile_money' | 'bank';
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}
