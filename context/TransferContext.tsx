import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { Recipient, PaymentMethod } from '@/types';

type PaymentMethodType = 'apple_pay' | 'debit_card' | 'instant_bank_transfer';

interface TransferState {
  sendAmount: number;
  receiveAmount: number;
  selectedRecipient: Recipient | null;
  selectedMethod: 'mobile_money' | 'bank' | null;
  selectedPaymentMethod: PaymentMethodType | null;
  exchangeRate: number;
  fee: number;
  setSendAmount: (amount: number, rate: number) => void;
  setReceiveAmount: (amount: number, rate: number) => void;
  setSelectedRecipient: (recipient: Recipient) => void;
  setSelectedMethod: (method: 'mobile_money' | 'bank') => void;
  setSelectedPaymentMethod: (method: PaymentMethodType) => void;
  calculateTotal: () => number;
  reset: () => void;
  submitTransfer: (paymentMethod: PaymentMethod) => Promise<void>;
}

export const [TransferProvider, useTransfer] = createContextHook((): TransferState => {
  const [sendAmount, setSendAmountState] = useState<number>(0);
  const [receiveAmount, setReceiveAmountState] = useState<number>(0);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'mobile_money' | 'bank' | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [fee, setFee] = useState<number>(0);

  const calculateFee = (amount: number): number => {
    return 0;
  };

  const setSendAmount = useCallback((amount: number, rate: number) => {
    setSendAmountState(amount);
    setReceiveAmountState(amount * rate);
    setExchangeRate(rate);
    setFee(calculateFee(amount));
  }, []);

  const setReceiveAmount = useCallback((amount: number, rate: number) => {
    setReceiveAmountState(amount);
    setSendAmountState(amount / rate);
    setExchangeRate(rate);
    setFee(calculateFee(amount / rate));
  }, []);

  const calculateTotal = useCallback((): number => {
    return sendAmount + fee;
  }, [sendAmount, fee]);

  const submitTransfer = useCallback(async (paymentMethod: PaymentMethod) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Transfer submitted:', {
        sendAmount,
        receiveAmount,
        recipient: selectedRecipient,
        paymentMethod,
        fee,
      });
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  }, [sendAmount, receiveAmount, selectedRecipient, fee]);

  const reset = useCallback(() => {
    setSendAmountState(0);
    setReceiveAmountState(0);
    setSelectedRecipient(null);
    setSelectedMethod(null);
    setSelectedPaymentMethod(null);
    setExchangeRate(1);
    setFee(0);
  }, []);

  return useMemo(() => ({
    sendAmount,
    receiveAmount,
    selectedRecipient,
    selectedMethod,
    selectedPaymentMethod,
    exchangeRate,
    fee,
    setSendAmount,
    setReceiveAmount,
    setSelectedRecipient,
    setSelectedMethod,
    setSelectedPaymentMethod,
    calculateTotal,
    reset,
    submitTransfer,
  }), [sendAmount, receiveAmount, selectedRecipient, selectedMethod, selectedPaymentMethod, exchangeRate, fee, setSendAmount, setReceiveAmount, calculateTotal, reset, submitTransfer]);
});
