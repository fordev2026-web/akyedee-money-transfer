import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, User, CheckCircle } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/ui/Button';
import InfoBanner from '@/components/ui/InfoBanner';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import colors from '@/constants/colors';

type DocumentType = 'passport' | 'drivers_license' | 'national_id';

interface IDRequirements {
  [key: string]: DocumentType[];
}

const ID_TYPES_BY_COUNTRY: IDRequirements = {
  US: ['passport', 'drivers_license', 'national_id'],
  CA: ['passport', 'drivers_license', 'national_id'],
  GB: ['passport', 'drivers_license', 'national_id'],
  GH: ['passport', 'drivers_license', 'national_id'],
};

const ID_TYPE_LABELS: Record<DocumentType, string> = {
  passport: 'Passport',
  drivers_license: "Driver's License",
  national_id: 'National ID Card',
};

export default function KYCScreen() {
  const router = useRouter();
  const { completeKYC, isLoading } = useAuth();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState<'selfie' | 'id' | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    idType: 'passport' as DocumentType,
    selfieUri: '',
    idPhotoUri: '',
    dateOfBirth: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.selfieUri) newErrors.selfie = 'Selfie is required';
    if (!formData.idPhotoUri) newErrors.idPhoto = 'ID photo is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address) newErrors.address = 'Address is required';

    const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/;
    if (formData.dateOfBirth && !dateRegex.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please use MM-DD-YYYY format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestPermissions = async () => {
    if (!cameraPermission) return false;
    
    if (!cameraPermission.granted) {
      const result = await requestCameraPermission();
      return result.granted;
    }
    return true;
  };

  const handleTakePhoto = async (type: 'selfie' | 'id') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera access is needed to take photos');
      return;
    }
    setShowCamera(type);
  };

  const capturePhoto = async () => {
    if (!cameraRef) return;

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (showCamera === 'selfie') {
        setFormData(prev => ({ ...prev, selfieUri: photo.uri }));
        setErrors(prev => ({ ...prev, selfie: '' }));
      } else if (showCamera === 'id') {
        setFormData(prev => ({ ...prev, idPhotoUri: photo.uri }));
        setErrors(prev => ({ ...prev, idPhoto: '' }));
      }

      setShowCamera(null);
    } catch (error) {
      console.error('Failed to capture photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handlePickImage = async (type: 'selfie' | 'id') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: type === 'selfie' ? [1, 1] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'selfie') {
          setFormData(prev => ({ ...prev, selfieUri: result.assets[0].uri }));
          setErrors(prev => ({ ...prev, selfie: '' }));
        } else {
          setFormData(prev => ({ ...prev, idPhotoUri: result.assets[0].uri }));
          setErrors(prev => ({ ...prev, idPhoto: '' }));
        }
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const showPhotoOptions = (type: 'selfie' | 'id') => {
    Alert.alert(
      type === 'selfie' ? 'Take Selfie' : 'Upload ID',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => handleTakePhoto(type),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => handlePickImage(type),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const formatDateOfBirth = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    
    let formatted = '';
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
    }
    if (cleaned.length >= 3) {
      formatted += '-' + cleaned.substring(2, 4);
    }
    if (cleaned.length >= 5) {
      formatted += '-' + cleaned.substring(4, 8);
    }
    
    return formatted;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDateOfBirth(text);
    setFormData(prev => ({ ...prev, dateOfBirth: formatted }));
    setErrors(prev => ({ ...prev, dateOfBirth: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await completeKYC(formData);
      router.push('/(auth)/success');
    } catch (error) {
      setErrors({ general: 'Verification failed. Please try again.' });
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={setCameraRef}
          style={styles.camera}
          facing={showCamera === 'selfie' ? 'front' : 'back'}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCamera(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cameraInstructions}>
              <Text style={styles.instructionText}>
                {showCamera === 'selfie' 
                  ? 'Position your face in the frame' 
                  : 'Position your ID document clearly'}
              </Text>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={capturePhoto}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Verify Your Identity</Text>
            <Text style={styles.subtitle}>
              We need to verify your identity to comply with regulations
            </Text>
          </View>

          <InfoBanner
            message="Your information is encrypted and secure. We use it only for verification purposes."
            type="info"
          />

          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selfie Verification</Text>
              <Text style={styles.sectionDesc}>
                Take a clear photo of your face
              </Text>
              
              <TouchableOpacity
                style={[styles.photoBox, formData.selfieUri && styles.photoBoxActive]}
                onPress={() => showPhotoOptions('selfie')}
                testID="selfie-button"
              >
                {formData.selfieUri ? (
                  <View style={styles.photoPreview}>
                    <Image source={{ uri: formData.selfieUri }} style={styles.photoImage} />
                    <View style={styles.photoCheck}>
                      <CheckCircle size={24} color={colors.success} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <User size={40} color={colors.textSecondary} />
                    <Text style={styles.photoPlaceholderText}>Take Selfie</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.selfie && (
                <Text style={styles.fieldError}>{errors.selfie}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Government ID</Text>
              <Text style={styles.sectionDesc}>
                Upload a photo of your {ID_TYPE_LABELS[formData.idType]}
              </Text>
              
              <TouchableOpacity
                style={[styles.photoBox, formData.idPhotoUri && styles.photoBoxActive]}
                onPress={() => showPhotoOptions('id')}
                testID="id-photo-button"
              >
                {formData.idPhotoUri ? (
                  <View style={styles.photoPreview}>
                    <Image source={{ uri: formData.idPhotoUri }} style={styles.photoImage} />
                    <View style={styles.photoCheck}>
                      <CheckCircle size={24} color={colors.success} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <FileText size={40} color={colors.textSecondary} />
                    <Text style={styles.photoPlaceholderText}>Upload ID</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.idPhoto && (
                <Text style={styles.fieldError}>{errors.idPhoto}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <Text style={styles.sectionDesc}>
                Provide your date of birth and address
              </Text>
              
              <Input
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChangeText={handleDateChange}
                placeholder="MM-DD-YYYY"
                keyboardType="number-pad"
                error={errors.dateOfBirth}
                testID="date-of-birth-input"
                containerStyle={styles.inputContainer}
                maxLength={10}
              />

              <Input
                label="Address"
                value={formData.address}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, address: text }));
                  setErrors(prev => ({ ...prev, address: '' }));
                }}
                placeholder="Enter your full address"
                error={errors.address}
                testID="address-input"
                containerStyle={styles.inputContainer}
              />
            </View>

            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <Button
              title="Complete Verification"
              onPress={handleSubmit}
              loading={isLoading}
              testID="submit-button"
            />
          </View>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    flex: 1,
    marginTop: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sectionDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  photoBox: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  photoBoxActive: {
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  photoPlaceholderText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  photoPreview: {
    flex: 1,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 0,
  },
  fieldError: {
    fontSize: 14,
    color: colors.error,
    marginTop: -8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  cameraInstructions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  cameraControls: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
});
