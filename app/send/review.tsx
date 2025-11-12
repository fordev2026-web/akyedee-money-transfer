import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, CreditCard, Building2 } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useTransfer } from '@/context/TransferContext';
import colors from '@/constants/colors';

export default function ReviewScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { sendAmount, receiveAmount, exchangeRate, fee, selectedMethod, selectedRecipient, selectedPaymentMethod } = useTransfer();

  const handleConfirm = () => {
    router.push('/send/success');
  };

  const getPaymentMethodDisplay = () => {
    switch (selectedPaymentMethod) {
      case 'apple_pay':
        return 'Apple Pay';
      case 'debit_card':
        return 'Debit Card';
      case 'instant_bank_transfer':
        return 'Instant Bank Transfer';
      default:
        return 'Not selected';
    }
  };

  const getPaymentMethodIcon = () => {
    switch (selectedPaymentMethod) {
      case 'apple_pay':
        return <Text style={styles.applePayIcon}>􀉚</Text>;
      case 'debit_card':
        return <CreditCard size={20} color={colors.primary} />;
      case 'instant_bank_transfer':
        return <Building2 size={20} color={colors.primary} />;
      default:
        return null;
    }
  };

  const total = sendAmount + fee;

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
          <Text style={styles.title}>Review Transfer</Text>
          <Text style={styles.subtitle}>Check the details before confirming</Text>
        </View>

        <Card style={styles.amountCard}>
          <Text style={styles.amountLabel}>Recipient receives</Text>
          <Text style={styles.amount}>GHS {receiveAmount.toFixed(2)}</Text>
        </Card>

        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transfer method</Text>
            <Text style={styles.detailValue}>
              {selectedMethod === 'mobile_money' ? 'Mobile Money' : 'Bank Transfer'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Recipient number</Text>
            <Text style={styles.detailValue}>
              {selectedRecipient ? selectedRecipient.phone : 'N/A'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment method</Text>
            <View style={styles.paymentMethodValue}>
              {getPaymentMethodIcon()}
              <Text style={styles.detailValue}>
                {getPaymentMethodDisplay()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transfer fee</Text>
            <Text style={styles.detailValue}>
              {user?.country.currency} {fee.toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Exchange rate</Text>
            <Text style={styles.detailValue}>
              1 {user?.country.currency} = {exchangeRate.toFixed(2)} GHS
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>You send</Text>
            <Text style={styles.detailValue}>
              {user?.country.currency} {sendAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total to pay</Text>
            <Text style={styles.totalValue}>
              {user?.country.currency} {total.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Saved points</Text>
            <Text style={styles.pointsValue}>+50 pts</Text>
          </View>
        </Card>

        <View style={styles.notice}>
          <CheckCircle size={16} color={colors.success} />
          <Text style={styles.noticeText}>
            Your transfer will be processed securely
          </Text>
        </View>

        <Button
          title="Confirm & Send"
          onPress={handleConfirm}
          testID="confirm-button"
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
  amountCard: {
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  detailsCard: {
    padding: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600' as const,
  },
  paymentMethodValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applePayIcon: {
    fontSize: 20,
    color: colors.text,
  },

  pointsValue: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600' as const,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600' as const,
  },
  totalValue: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700' as const,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 16,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    marginBottom: 24,
  },
  noticeText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '500' as const,
  },
});
