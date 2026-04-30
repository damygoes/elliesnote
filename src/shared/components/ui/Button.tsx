import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { Colors, Radius, Typography } from '@/shared/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant;
  loading?: boolean;
  children: string;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? Colors.light.on_primary
              : Colors.light.primary
          }
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 54,
  },
  primary: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  secondary: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...Typography.button,
  },
  primaryLabel: {
    color: Colors.light.on_primary,
  },
  secondaryLabel: {
    color: Colors.light.primary,
  },
  ghostLabel: {
    color: Colors.light.text_muted,
  },
});
