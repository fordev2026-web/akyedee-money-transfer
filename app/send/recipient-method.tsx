import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Phone } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InfoBanner from '@/components/ui/InfoBanner';
import { useAuth } from '@/context/AuthContext';
import { useRates } from '@/context/RateContext';
import { useTransfer } from '@/context/TransferContext';
import colors from '@/constants/colors';
import { MOBILE_MONEY_PROVIDERS, GHANA_BANKS, RECEIVING_COUNTRY } from '@/constants/countries';

export default function RecipientMethodScreen() {
  const router = useRouter();
  const { method } = useLocalSearchParams<{ method: 'mobile_money' | 'bank' }>();
  const { user } = useAuth();
  const { getRate } = useRates();
  const { setSendAmount, setSelectedMethod, setSelectedRecipient } = useTransfer();
  
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [provider, setProvider] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rate = getRate(user?.country.currency || 'USD');
  const receiveAmount = parseFloat(amount) * rate;
  const fee = 0;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!recipientName) newErrors.recipientName = 'Recipient name is required';
    if (!recipientPhone) newErrors.recipientPhone = 'Phone number is required';
    if (recipientPhone && recipientPhone.length !== 10) newErrors.recipientPhone = 'Phone number must be exactly 10 digits';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Enter a valid amount';

    if (method === 'mobile_money') {
      if (!provider) newErrors.provider = 'Select a provider';
    } else {
      if (!bank) newErrors.bank = 'Select a bank';
      if (!accountNumber) newErrors.accountNumber = 'Account number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    setSelectedMethod(method || 'mobile_money');
    setSendAmount(parseFloat(amount), rate);
    
    const recipient = {
      id: Date.now().toString(),
      name: recipientName,
      phone: `+233${recipientPhone}`,
      method: method || 'mobile_money' as 'mobile_money' | 'bank',
      ...(method === 'mobile_money' ? {
        mobileMoneyDetails: {
          provider: provider,
          number: `+233${recipientPhone}`,
        },
      } : {
        bankDetails: {
          accountNumber: accountNumber,
          bankName: bank,
          accountName: recipientName,
        },
      }),
    };
    
    setSelectedRecipient(recipient);
    router.push('/send/payment-method');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
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
            <Text style={styles.title}>
              {method === 'mobile_money' ? 'Mobile Money' : 'Bank Transfer'}
            </Text>
            <Text style={styles.subtitle}>
              Send to {RECEIVING_COUNTRY.flag} Ghana
            </Text>
          </View>

          <InfoBanner
            message={`Sending from ${user?.country.flag} ${user?.country.currency} • Rate: 1 ${user?.country.currency} = ${rate.toFixed(2)} GHS`}
            type="info"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipient Details</Text>

            <Input
              label="Recipient Name"
              value={recipientName}
              onChangeText={(text) => {
                setRecipientName(text);
                setErrors((prev) => ({ ...prev, recipientName: '' }));
              }}
              placeholder="John Doe"
              prefix={<User size={20} color={colors.textSecondary} />}
              error={errors.recipientName}
              testID="recipient-name-input"
            />

            <View style={styles.phoneContainer}>
              <Text style={styles.phoneLabel}>Phone Number</Text>
              <View style={[
                styles.phoneInputWrapper,
                errors.recipientPhone && styles.phoneInputWrapperError,
              ]}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.flagText}>🇬🇭</Text>
                  <Text style={styles.dialCodeText}>+233</Text>
                </View>
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    value={recipientPhone}
                    onChangeText={(text) => {
                      const digitsOnly = text.replace(/\D/g, '');
                      if (digitsOnly.length <= 10) {
                        setRecipientPhone(digitsOnly);
                        setErrors((prev) => ({ ...prev, recipientPhone: '' }));
                      }
                    }}
                    placeholder="2412345678"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="phone-pad"
                    testID="recipient-phone-input"
                    style={styles.phoneTextInput}
                  />
                </View>
              </View>
              {errors.recipientPhone && <Text style={styles.phoneError}>{errors.recipientPhone}</Text>}
            </View>

            {method === 'mobile_money' ? (
              <View>
                <Text style={styles.label}>Mobile Money Provider</Text>
                <View style={styles.providers}>
                  {MOBILE_MONEY_PROVIDERS.map((prov) => (
                    <TouchableOpacity
                      key={prov.id}
                      style={[
                        styles.providerCard,
                        provider === prov.id && styles.providerCardSelected,
                      ]}
                      onPress={() => {
                        setProvider(prov.id);
                        setErrors((prev) => ({ ...prev, provider: '' }));
                      }}
                      activeOpacity={0.7}
                      testID={`provider-${prov.id}`}
                    >
                      <Text style={styles.providerLogo}>{prov.logo}</Text>
                      <Text style={styles.providerName}>{prov.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.provider && <Text style={styles.error}>{errors.provider}</Text>}
              </View>
            ) : (
              <>
                <View>
                  <Text style={styles.label}>Select Bank</Text>
                  <View style={styles.bankList}>
                    {GHANA_BANKS.slice(0, 4).map((bankName) => (
                      <TouchableOpacity
                        key={bankName}
                        style={[
                          styles.bankItem,
                          bank === bankName && styles.bankItemSelected,
                        ]}
                        onPress={() => {
                          setBank(bankName);
                          setErrors((prev) => ({ ...prev, bank: '' }));
                        }}
                        activeOpacity={0.7}
                        testID={`bank-${bankName}`}
                      >
                        <Text style={[
                          styles.bankText,
                          bank === bankName && styles.bankTextSelected,
                        ]}>
                          {bankName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.bank && <Text style={styles.error}>{errors.bank}</Text>}
                </View>

                <Input
                  label="Account Number"
                  value={accountNumber}
                  onChangeText={(text) => {
                    setAccountNumber(text);
                    setErrors((prev) => ({ ...prev, accountNumber: '' }));
                  }}
                  placeholder="0123456789"
                  keyboardType="number-pad"
                  error={errors.accountNumber}
                  testID="account-number-input"
                />
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amount to Send</Text>

            <Input
              label={`Amount in ${user?.country.currency}`}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              placeholder="100.00"
              keyboardType="decimal-pad"
              error={errors.amount}
              testID="amount-input"
              prefix={<Text style={styles.currencyPrefix}>{user?.country.currency}</Text>}
            />

            {parseFloat(amount) > 0 && (
              <Card style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>You send</Text>
                  <Text style={styles.summaryValue}>
                    {user?.country.currency} {parseFloat(amount).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fee</Text>
                  <Text style={styles.summaryValue}>
                    {user?.country.currency} {fee.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelBold}>Recipient gets</Text>
                  <Text style={styles.summaryValueBold}>
                    GHS {receiveAmount.toFixed(2)}
                  </Text>
                </View>
              </Card>
            )}
          </View>

          <Button
            title="Continue to Review"
            onPress={handleContinue}
            disabled={!amount || parseFloat(amount) <= 0}
            testID="continue-button"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
    marginBottom: 20,
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  providers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  providerCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  providerCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0F7FF',
  },
  providerLogo: {
    fontSize: 24,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  bankList: {
    gap: 8,
    marginBottom: 8,
  },
  bankItem: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bankItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0F7FF',
  },
  bankText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  bankTextSelected: {
    color: colors.primary,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#F0F7FF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  summaryLabelBold: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600' as const,
  },
  summaryValueBold: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700' as const,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  phoneContainer: {
    marginBottom: 16,
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    minHeight: 56,
  },
  phoneInputWrapperError: {
    borderColor: colors.error,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 6,
    borderRightWidth: 2,
    borderRightColor: colors.borderLight,
  },
  flagText: {
    fontSize: 24,
  },
  dialCodeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  phoneInputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  phoneTextInput: {
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: 12,
    flex: 1,
  },
  phoneError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
});
