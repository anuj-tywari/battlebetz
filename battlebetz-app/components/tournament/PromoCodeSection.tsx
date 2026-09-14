import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';
import { Tag, Users, Check } from 'lucide-react-native';

interface PromoCodeSectionProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedPromoCode: string | null;
  isPromoterCode: boolean;
  onApplyPromoCode: () => void;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
  promoCode,
  setPromoCode,
  appliedPromoCode,
  isPromoterCode,
  onApplyPromoCode
}) => {
  return (
    <View style={styles.promoCodeSection}>
      <View style={styles.promoCodeContainer}>
        <View style={styles.promoCodeInput}>
          {isPromoterCode ? (
            <Users size={20} color="#10B981" />
          ) : (
            <Tag size={20} color="#A259FF" />
          )}
          <TextInput
            style={styles.promoCodeTextInput}
            placeholder="Enter promo code"
            placeholderTextColor="#6c757d"
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
        </View>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={onApplyPromoCode}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {appliedPromoCode && (
        <View style={[
          styles.promoAppliedContainer,
          isPromoterCode && styles.promoterPromoContainer
        ]}>
          <Check size={16} color={isPromoterCode ? '#10B981' : '#A259FF'} />
          <Text style={[
            styles.promoAppliedText,
            isPromoterCode && styles.promoterPromoText
          ]}>
            {isPromoterCode 
              ? 'Promoter code applied! $10 off your entry'
              : 'Promo code applied! $10 off your entry'
            }
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  promoCodeSection: {
    marginBottom: 24,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  promoCodeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  promoCodeTextInput: {
    flex: 1,
    color: '#EAEAEA',
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'Poppins-Regular',
  },
  applyButton: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  promoAppliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(162, 89, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  promoterPromoContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  promoAppliedText: {
    flex: 1,
    color: '#A259FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  promoterPromoText: {
    color: '#10B981',
  },
});

export default PromoCodeSection;