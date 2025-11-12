import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, RefreshCw } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import { ExchangeRate } from '@/types';

interface RateCardProps {
  rate: ExchangeRate;
  onPress?: () => void;
  testID?: string;
}

export default function RateCard({ rate, onPress, testID }: RateCardProps) {
  const formattedDate = new Date(rate.lastUpdated).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={!onPress} testID={testID}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.currencies}>
            <Text style={styles.currencyFrom}>{rate.from}</Text>
            <TrendingUp size={16} color={colors.success} />
            <Text style={styles.currencyTo}>{rate.to}</Text>
          </View>
          <RefreshCw size={16} color={colors.textTertiary} />
        </View>
        
        <View style={styles.rateContainer}>
          <Text style={styles.rateLabel}>1 {rate.from} =</Text>
          <Text style={styles.rateValue}>{rate.rate.toFixed(2)} {rate.to}</Text>
        </View>
        
        <Text style={styles.lastUpdated}>Updated {formattedDate}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currencies: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyFrom: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  currencyTo: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  rateContainer: {
    marginVertical: 8,
  },
  rateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  lastUpdated: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 4,
  },
});
