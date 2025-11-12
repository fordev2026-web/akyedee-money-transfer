import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { SENDING_COUNTRIES } from '@/constants/countries';
import colors from '@/constants/colors';
import { Country } from '@/types';

export default function CountrySelectScreen() {
  const router = useRouter();
  const { selectCountry } = useAuth();
  const [selected, setSelected] = useState<Country | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    selectCountry(selected);
    router.push('/(auth)/kyc');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Where are you sending from?</Text>
          <Text style={styles.subtitle}>
            Select your country to see available rates and payment methods
          </Text>
        </View>

        <View style={styles.countries}>
          {SENDING_COUNTRIES.map((country) => (
            <TouchableOpacity
              key={country.code}
              onPress={() => setSelected(country)}
              activeOpacity={0.7}
              testID={`country-${country.code}`}
            >
              <Card style={[
                styles.countryCard,
                selected?.code === country.code && styles.countryCardSelected,
              ]}>
                <View style={styles.countryContent}>
                  <View style={styles.countryInfo}>
                    <Text style={styles.flag}>{country.flag}</Text>
                    <View>
                      <Text style={styles.countryName}>{country.name}</Text>
                      <Text style={styles.currency}>{country.currency}</Text>
                    </View>
                  </View>
                  {selected?.code === country.code && (
                    <View style={styles.checkmark}>
                      <Check size={20} color={colors.background} />
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selected}
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  countries: {
    marginBottom: 32,
  },
  countryCard: {
    marginBottom: 12,
    padding: 20,
  },
  countryCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#F0F7FF',
  },
  countryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flag: {
    fontSize: 32,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  currency: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
