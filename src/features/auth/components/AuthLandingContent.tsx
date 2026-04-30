import { logger } from '@/services/logger';
import { Colors, Fonts } from '@/shared/constants/theme';
import { isIPad } from '@/shared/utils/isIPad';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
    if (!result.success) {
      logger.error('Google OAuth failed', result.error);
    }
  };

  const handleAppleAuth = async () => {
    const result = await appleOAuth.startOAuth();
    if (!result.success) {
      logger.error('Apple OAuth failed', result.error);
    }
  };

  const openPrivacy = () => {
    Linking.openURL(AUTH_LINKS.PRIVACY_URL);
  };

  const openTerms = () => {
    Linking.openURL(AUTH_LINKS.TERMS_URL);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/icons/icon.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
      <AppTagline />
      <View style={styles.buttonContainer}>
        <Animated.View entering={FadeInDown.delay(120)}>
          <OAuthButton
            provider="google"
            onPress={handleGoogleAuth}
            loading={googleOAuth.isLoading}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220)}>
          <OAuthButton
            provider="apple"
            onPress={handleAppleAuth}
            loading={appleOAuth.isLoading}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320)}>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => router.push(AUTH_LINKS.SIGN_UP)}
          >
            <Text style={styles.emailButtonText}>
              {AUTH_MESSAGES.LANDING.emailButton}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Animated.View
        style={styles.privacyContainer}
        entering={FadeInDown.delay(420)}
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
      <Animated.Text entering={FadeInDown.delay(520)} style={styles.brandLine}>
        {AUTH_MESSAGES.LANDING.brand}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 10,
    position: 'relative',
    backgroundColor: Colors.light.background_primary,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -140,
    width: '100%',
  },
  logo: {
    width: '100%',
    height: 180,
  },
  buttonContainer: {
    gap: 14,
    width: isIPad ? '50%' : '100%',
  },
  emailButton: {
    backgroundColor: Colors.light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 4,
  },
  emailButtonText: {
    color: Colors.light.text_primary,
    fontSize: 17,
    fontWeight: '600',
  },
  privacyContainer: {
    marginTop: 8,
    paddingHorizontal: 18,
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
    marginTop: 4,
    fontSize: 12,
    color: Colors.light.text_muted,
    fontFamily: Fonts?.sans,
  },
});
