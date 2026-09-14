import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type BackButtonProps = {
  color?: string;
  size?: number;
};

export default function BackButton({ color = '#EAEAEA', size = 24 }: BackButtonProps) {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => router.back()}
    >
      <ArrowLeft size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});