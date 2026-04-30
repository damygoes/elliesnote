import { Colors } from '@/shared/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

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
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={config.textColor} />
      ) : (
        <>
          <Ionicons name={config.icon} size={18} color={config.textColor} />
          <Text style={[styles.text, { color: config.textColor }]}>
            {config.text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
  },
});
