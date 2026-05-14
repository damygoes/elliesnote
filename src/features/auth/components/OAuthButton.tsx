import { Button } from '@/shared/components/ui/Button';
import { Colors, Typography } from '@/shared/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text } from 'react-native';

type OAuthProviderType = 'google' | 'apple';

interface OAuthButtonProps {
  provider: OAuthProviderType;
  onPress: () => void;
  loading?: boolean;
}

const PROVIDER_CONFIG = {
  google: {
    icon: 'logo-google' as const,
    text: 'Continue with Google',
    backgroundColor: Colors.light.primary,
    textColor: Colors.light.on_primary,
    borderColor: Colors.light.primary,
  },
  apple: {
    icon: 'logo-apple' as const,
    text: 'Continue with Apple',
    backgroundColor: '#000000',
    textColor: Colors.light.surface,
    borderColor: '#000000',
  },
} as const;

export function OAuthButton({
  provider,
  onPress,
  loading = false,
}: OAuthButtonProps) {
  const config = PROVIDER_CONFIG[provider];

  return (
    <Button
      style={[
        styles.base,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
      onPress={onPress}
      loading={loading}
      disabled={loading}
    >
      <Ionicons name={config.icon} size={18} color={config.textColor} />
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.text}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight,
  },
});
