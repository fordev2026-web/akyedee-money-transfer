import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import colors from '@/constants/colors';
import { Transaction } from '@/types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    recipientName: 'Kwame Mensah',
    recipientPhone: '+233 24 123 4567',
    sendAmount: 100,
    sendCurrency: 'USD',
    receiveAmount: 1625,
    receiveCurrency: 'GHS',
    exchangeRate: 16.25,
    fee: 2.99,
    status: 'completed',
    method: 'mobile_money',
    createdAt: new Date('2025-01-10T10:30:00'),
    completedAt: new Date('2025-01-10T10:35:00'),
  },
  {
    id: '2',
    recipientName: 'Ama Asante',
    recipientPhone: '+233 50 987 6543',
    sendAmount: 250,
    sendCurrency: 'USD',
    receiveAmount: 4062.5,
    receiveCurrency: 'GHS',
    exchangeRate: 16.25,
    fee: 4.99,
    status: 'processing',
    method: 'bank',
    createdAt: new Date('2025-01-11T14:20:00'),
  },
  {
    id: '3',
    recipientName: 'Kofi Owusu',
    recipientPhone: '+233 20 555 1234',
    sendAmount: 50,
    sendCurrency: 'USD',
    receiveAmount: 812.5,
    receiveCurrency: 'GHS',
    exchangeRate: 16.25,
    fee: 2.99,
    status: 'failed',
    method: 'mobile_money',
    createdAt: new Date('2025-01-09T08:15:00'),
  },
];

export default function TransactionsScreen() {
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={colors.success} />;
      case 'processing':
      case 'pending':
        return <Clock size={20} color={colors.warning} />;
      case 'failed':
        return <XCircle size={20} color={colors.error} />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'processing':
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>All your transfers to Ghana</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockTransactions.map((transaction) => (
          <TouchableOpacity 
            key={transaction.id}
            activeOpacity={0.7}
            testID={`transaction-${transaction.id}`}
          >
            <Card style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.recipient}>
                  <Text style={styles.recipientName}>{transaction.recipientName}</Text>
                  <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
                </View>
                {getStatusIcon(transaction.status)}
              </View>

              <View style={styles.transactionDetails}>
                <View style={styles.amount}>
                  <Text style={styles.sendAmount}>
                    -{transaction.sendAmount.toFixed(2)} {transaction.sendCurrency}
                  </Text>
                  <ArrowRight size={16} color={colors.textTertiary} />
                  <Text style={styles.receiveAmount}>
                    +{transaction.receiveAmount.toFixed(2)} {transaction.receiveCurrency}
                  </Text>
                </View>

                <View style={styles.transactionFooter}>
                  <Text 
                    style={[styles.status, { color: getStatusColor(transaction.status) }]}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Text>
                  <Text style={styles.method}>
                    {transaction.method === 'mobile_money' ? 'Mobile Money' : 'Bank Transfer'}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionCard: {
    marginBottom: 12,
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recipient: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  transactionDetails: {
    gap: 12,
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  receiveAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.success,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  method: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
