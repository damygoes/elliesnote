import { forwardRef, useState, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';

interface FormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  onIconPress?: () => void;
  iconAccessibilityLabel?: string;
  disabled?: boolean;
}

export const FormField = forwardRef<TextInput, FormFieldProps>(
  function FormField(
    {
      label,
      error,
      icon,
      iconPosition = 'start',
      onIconPress,
      iconAccessibilityLabel,
      disabled,
      style,
      ...rest
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false);

    const borderColor = error
      ? Colors.light.error
      : focused
        ? Colors.light.primary
        : Colors.light.border;

    const iconNode = icon ? (
      onIconPress ? (
        <TouchableOpacity
          onPress={onIconPress}
          accessibilityLabel={iconAccessibilityLabel}
          hitSlop={8}
        >
          {icon}
        </TouchableOpacity>
      ) : (
        icon
      )
    ) : null;

    return (
      <View style={styles.wrapper}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.row, { borderColor }]}>
          {iconPosition === 'start' && iconNode ? (
            <View style={styles.iconStart}>{iconNode}</View>
          ) : null}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              iconPosition === 'start' && icon
                ? styles.inputWithStartIcon
                : null,
              iconPosition === 'end' && icon ? styles.inputWithEndIcon : null,
              style,
            ]}
            editable={!disabled}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            {...rest}
          />
          {iconPosition === 'end' && iconNode ? (
            <View style={styles.iconEnd}>{iconNode}</View>
          ) : null}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.light.text_primary,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
    minHeight: 54,
  },
  input: {
    flex: 1,
    ...Typography.label,
    color: Colors.light.text_primary,
    paddingVertical: Spacing.md,
  },
  inputWithStartIcon: {
    paddingLeft: Spacing.sm,
  },
  inputWithEndIcon: {
    paddingRight: Spacing.sm,
  },
  iconStart: {
    marginRight: Spacing.xs,
  },
  iconEnd: {
    marginLeft: Spacing.xs,
  },
  error: {
    ...Typography.small,
    color: Colors.light.error,
  },
});
