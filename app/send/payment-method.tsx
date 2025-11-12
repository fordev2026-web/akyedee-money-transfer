import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Building2, CheckCircle } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useTransfer } from '@/context/TransferContext';
import colors from '@/constants/colors';

type PaymentMethodType = 'apple_pay' | 'debit_card' | 'instant_bank_transfer';

interface PaymentOption {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  available: boolean;
}

export default function PaymentMethodScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedPaymentMethod } = useTransfer();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'apple_pay',
      title: 'Apple Pay',
      subtitle: 'Pay securely with Apple Pay',
      icon: <Text style={styles.applePayIcon}>􀉚</Text>,
      available: Platform.OS === 'ios',
    },
    {
      id: 'debit_card',
      title: 'Debit Card',
      subtitle: 'Visa, Mastercard, Amex',
      icon: <CreditCard size={28} color={colors.primary} />,
      available: true,
    },
    {
      id: 'instant_bank_transfer',
      title: 'Instant Bank Transfer',
      subtitle: 'Transfer directly from your bank',
      icon: <Building2 size={28} color={colors.primary} />,
      available: true,
    },
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      setSelectedPaymentMethod(selectedMethod);
      router.push('/send/review');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Pay with</Text>
          <Text style={styles.subtitle}>
            Choose how you want to pay for this transfer
          </Text>
        </View>

        <View style={styles.methodsContainer}>
          {paymentOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.methodCard,
                selectedMethod === option.id && styles.methodCardSelected,
                !option.available && styles.methodCardDisabled,
              ]}
              onPress={() => option.available && setSelectedMethod(option.id)}
              disabled={!option.available}
              activeOpacity={0.7}
              testID={`payment-method-${option.id}`}
            >
              <View style={styles.methodIconContainer}>
                {option.icon}
              </View>
              <View style={styles.methodInfo}>
                <Text style={[
                  styles.methodTitle,
                  !option.available && styles.methodTitleDisabled,
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.methodSubtitle,
                  !option.available && styles.methodSubtitleDisabled,
                ]}>
                  {option.subtitle}
                </Text>
                {!option.available && (
                  <Text style={styles.unavailableText}>Not available on {Platform.OS}</Text>
                )}
              </View>
              {selectedMethod === option.id && (
                <CheckCircle size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔒 Secure Payment</Text>
          <Text style={styles.infoText}>
            Your payment information is encrypted and secure. We never store your full card details.
          </Text>
        </Card>

        <Button
          title="Continue to Review"
          onPress={handleContinue}
          disabled={!selectedMethod}
          testID="continue-button"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 16,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0F7FF',
  },
  methodCardDisabled: {
    opacity: 0.5,
  },
  methodIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applePayIcon: {
    fontSize: 32,
    color: colors.text,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  methodTitleDisabled: {
    color: colors.textSecondary,
  },
  methodSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  methodSubtitleDisabled: {
    color: colors.textTertiary,
  },
  unavailableText: {
    fontSize: 11,
    color: colors.error,
    marginTop: 4,
    fontStyle: 'italic' as const,
  },
  infoCard: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
