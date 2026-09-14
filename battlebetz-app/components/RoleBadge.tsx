import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, Users } from 'lucide-react-native';
import { UserRole } from '@/types/roles';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'small' | 'large';
}

export default function RoleBadge({ role, size = 'small' }: RoleBadgeProps) {
  // Only show badge for admin and promoter roles
  if (role === 'consumer') return null;

  const isSmall = size === 'small';

  return (
    <View style={[
      styles.badge,
      role === 'admin' ? styles.adminBadge : styles.promoterBadge,
      isSmall ? styles.badgeSmall : styles.badgeLarge
    ]}>
      {role === 'admin' ? (
        <Shield size={isSmall ? 12 : 16} color="white" />
      ) : (
        <Users size={isSmall ? 12 : 16} color="white" />
      )}
      <Text style={[
        styles.text,
        isSmall ? styles.textSmall : styles.textLarge
      ]}>
        {role.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeLarge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  adminBadge: {
    backgroundColor: '#EF4444', // Red for admin
  },
  promoterBadge: {
    backgroundColor: '#10B981', // Green for promoter
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  textSmall: {
    fontSize: 10,
  },
  textLarge: {
    fontSize: 12,
  },
});