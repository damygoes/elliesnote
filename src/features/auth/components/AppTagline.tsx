import { Colors, Fonts, Typography } from '@/shared/constants/theme';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AUTH_MESSAGES } from '../constants/messages';

export function AppTagline() {
  return (
    <View style={styles.taglineContainer}>
      <Animated.Text entering={FadeInDown} style={styles.tagline}>
        {AUTH_MESSAGES.LANDING.tagline}
      </Animated.Text>

      <Animated.Text entering={FadeInDown.delay(60)} style={styles.subtagline}>
        {AUTH_MESSAGES.LANDING.subtagline}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  taglineContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  tagline: {
    fontSize: Typography.heading.fontSize,
    fontWeight: Typography.heading.fontWeight,
    color: Colors.light.text_primary,
    fontFamily: Fonts.sansBold,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtagline: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    lineHeight: 20,
    color: Colors.light.text_muted,
    maxWidth: 250,
  },
});
