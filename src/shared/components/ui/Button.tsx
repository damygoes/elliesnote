import { Colors, Radius, Typography } from '@/shared/constants/theme';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
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
      ) : typeof children === 'string' ? (
        <Text style={[styles.label, styles[`${variant}Label`]]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Radius.full,
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
  danger: {
    backgroundColor: Colors.light.error,
    borderColor: Colors.light.error,
  },
  dangerLabel: {
    color: Colors.light.white,
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
