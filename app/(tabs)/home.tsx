import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, TrendingUp, Clock } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import RateCard from '@/components/ui/RateCard';
import { useAuth } from '@/context/AuthContext';
import { useRates } from '@/context/RateContext';
import colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { rates, isLoading } = useRates();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{user?.firstName || 'User'}</Text>
          </View>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>{user?.country.flag || '🇺🇸'}</Text>
          </View>
        </View>

        <Card style={styles.quickSendCard}>
          <Text style={styles.cardTitle}>Send Money to Ghana 🇬🇭</Text>
          <Text style={styles.cardSubtitle}>
            Fast, secure transfers with the best rates
          </Text>
          <Button
            title="Send Money"
            onPress={() => router.push('/(tabs)/send')}
            icon={<Send size={18} color={colors.background} />}
            testID="quick-send-button"
          />
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={colors.text} />
            <Text style={styles.sectionTitle}>Exchange Rates</Text>
          </View>
          
          {isLoading ? (
            <Text style={styles.loadingText}>Loading rates...</Text>
          ) : (
            <View>
              {rates.map((rate) => (
                <RateCard 
                  key={`${rate.from}-${rate.to}`} 
                  rate={rate}
                  testID={`rate-card-${rate.from}`}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.features}>
          <TouchableOpacity style={styles.featureCard} activeOpacity={0.7}>
            <View style={styles.featureIcon}>
              <Clock size={24} color={colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Fast Transfers</Text>
            <Text style={styles.featureDesc}>Money arrives in minutes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} activeOpacity={0.7}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🔒</Text>
            </View>
            <Text style={styles.featureTitle}>100% Secure</Text>
            <Text style={styles.featureDesc}>Bank-level encryption</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  name: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 24,
  },
  quickSendCard: {
    backgroundColor: '#F0F7FF',
    marginBottom: 32,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  features: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
