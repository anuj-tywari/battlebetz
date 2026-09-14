import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types/roles';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGate({ 
  permission, 
  children, 
  fallback 
}: PermissionGateProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          You don't have permission to access this feature
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2E2E3A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#EAEAEA',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});