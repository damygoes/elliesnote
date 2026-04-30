import { Colors, Fonts } from '@/shared/constants/theme';
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
    paddingHorizontal: 30,
    marginBottom: 32,
  },
  tagline: {
    fontSize: 30,
    fontFamily: Fonts?.sans,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 34,
    color: Colors.light.text_primary,
  },
  subtagline: {
    fontSize: 14,
    fontFamily: Fonts?.sans,
    textAlign: 'center',
    lineHeight: 20,
    color: Colors.light.text_muted,
    maxWidth: 320,
  },
});
