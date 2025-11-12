import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Home } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import colors from '@/constants/colors';
import { useTransfer } from '@/context/TransferContext';

export default function SuccessScreen() {
  const router = useRouter();
  const { receiveAmount, reset } = useTransfer();

  const handleGoHome = () => {
    reset();
    router.push('/(tabs)/home');
  };

  const handleViewTransactions = () => {
    reset();
    router.push('/(tabs)/transactions');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CheckCircle size={80} color={colors.success} strokeWidth={2} />
          </View>
        </View>

        <Text style={styles.title}>Transfer Successful!</Text>
        <Text style={styles.subtitle}>
          GHS {receiveAmount.toFixed(2)} is on its way
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Your transfer is being processed and will arrive within minutes.
            The recipient will receive a confirmation message.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="View Transactions"
            onPress={handleViewTransactions}
            variant="outline"
            testID="view-transactions-button"
          />
          
          <Button
            title="Go to Home"
            onPress={handleGoHome}
            icon={<Home size={18} color={colors.background} />}
            testID="go-home-button"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600' as const,
  },
  infoBox: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
