import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';

interface InfoBannerProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  testID?: string;
}

export default function InfoBanner({ message, type = 'info', testID }: InfoBannerProps) {
  const bannerColors = {
    info: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
    success: { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
    warning: { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
    error: { bg: '#FFEBEE', border: '#F44336', text: '#C62828' },
  };

  const currentColors = bannerColors[type];

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: currentColors.bg, borderColor: currentColors.border }
      ]} 
      testID={testID}
    >
      <Info size={16} color={currentColors.text} />
      <Text style={[styles.message, { color: currentColors.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginVertical: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
