import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import colors from '@/constants/colors';
import { RECEIVING_COUNTRY } from '@/constants/countries';

export default function SendScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Send Money</Text>
          <Text style={styles.subtitle}>
            From {user?.country.flag} {user?.country.currency} to {RECEIVING_COUNTRY.flag} {RECEIVING_COUNTRY.currency}
          </Text>
        </View>

        <View style={styles.methods}>
          <Text style={styles.methodsTitle}>Choose Transfer Method</Text>
          
          <Card style={styles.methodCard}>
            <View style={styles.methodIcon}>
              <Text style={styles.emoji}>📱</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Mobile Money</Text>
              <Text style={styles.methodDesc}>MTN, Vodafone, AirtelTigo</Text>
            </View>
            <Button
              title="Select"
              onPress={() => router.push('/send/recipient-method?method=mobile_money')}
              variant="outline"
              testID="mobile-money-button"
            />
          </Card>

          <Card style={styles.methodCard}>
            <View style={styles.methodIcon}>
              <Text style={styles.emoji}>🏦</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Bank Transfer</Text>
              <Text style={styles.methodDesc}>All major Ghanaian banks</Text>
            </View>
            <Button
              title="Select"
              onPress={() => router.push('/send/recipient-method?method=bank')}
              variant="outline"
              testID="bank-transfer-button"
            />
          </Card>
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
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  methods: {
    flex: 1,
  },
  methodsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
