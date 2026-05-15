import { logger } from '@/services/logger';
import { Button } from '@/shared/components/ui/Button';
import { Colors, Fonts, Spacing } from '@/shared/constants/theme';
import { isIPad } from '@/shared/utils/isIPad';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AUTH_LINKS } from '../constants/links';
import { AUTH_MESSAGES } from '../constants/messages';
import { useAppleOAuthFlow } from '../hooks/useAppleOAuthFlow';
import { useOAuthFlow } from '../hooks/useOAuthFlow';
import { AppTagline } from './AppTagline';
import { OAuthButton } from './OAuthButton';

export function AuthLandingContent() {
  const googleOAuth = useOAuthFlow('oauth_google');
  const appleOAuth = useAppleOAuthFlow();

  const handleGoogleAuth = async () => {
    const result = await googleOAuth.startOAuth();
    if (!result.success) logger.error('Google OAuth failed', result.error);
  };

  const handleAppleAuth = async () => {
    const result = await appleOAuth.startOAuth();
    if (!result.success) logger.error('Apple OAuth failed', result.error);
  };

  const openPrivacy = () => Linking.openURL(AUTH_LINKS.PRIVACY_URL);
  const openTerms = () => Linking.openURL(AUTH_LINKS.TERMS_URL);

  return (
    <View style={styles.container}>
      {/* Hero — logo + tagline, vertically centered in the upper portion */}
      <View style={styles.hero}>
        <Image
          source={require('@/assets/icons/icon.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <AppTagline />
      </View>

      {/* Actions — stacked below the hero */}
      <View style={styles.actions}>
        <View style={styles.oauthGroup}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <OAuthButton
              provider="google"
              onPress={handleGoogleAuth}
              loading={googleOAuth.isLoading}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)}>
            <OAuthButton
              provider="apple"
              onPress={handleAppleAuth}
              loading={appleOAuth.isLoading}
            />
          </Animated.View>
        </View>

        <Animated.View style={styles.divider} entering={FadeInDown.delay(280)}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(340)}>
          <Button
            variant="secondary"
            onPress={() => router.push(AUTH_LINKS.SIGN_UP)}
          >
            {AUTH_MESSAGES.LANDING.emailButton}
          </Button>
        </Animated.View>

        <Animated.View
          style={styles.privacyContainer}
          entering={FadeInDown.delay(440)}
        >
          <Text style={styles.privacyText}>
            By continuing, you agree to our{' '}
            <Text style={styles.privacyLink} onPress={openTerms}>
              Terms
            </Text>{' '}
            and acknowledge our{' '}
            <Text style={styles.privacyLink} onPress={openPrivacy}>
              Privacy Statement
            </Text>
            .
          </Text>
        </Animated.View>
      </View>

      <Animated.Text entering={FadeInDown.delay(520)} style={styles.brandLine}>
        {AUTH_MESSAGES.LANDING.brand}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.lg,
    flexDirection: 'column',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.light.background_primary,
  },
  hero: {
    flex: isIPad ? 0.5 : 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.lg,
  },
  logo: {
    width: isIPad ? 300 : 240,
    height: isIPad ? 300 : 240,
    marginBottom: -24,
  },
  actions: {
    width: isIPad ? '60%' : '100%',
    alignSelf: 'center',
    gap: Spacing.lg,
  },
  oauthGroup: {
    gap: Spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.light.text_muted,
    fontFamily: Fonts.sans,
  },
  privacyContainer: {
    paddingHorizontal: Spacing.sm,
  },
  privacyText: {
    fontSize: 12,
    color: Colors.light.text_muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyLink: {
    color: Colors.light.primary,
    textDecorationLine: 'underline',
  },
  brandLine: {
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontSize: 12,
    color: Colors.light.text_muted,
    fontFamily: Fonts.sans,
  },
});
