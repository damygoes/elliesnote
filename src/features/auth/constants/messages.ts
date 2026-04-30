import { APP_INFO } from '@/shared/constants/appInfo';

export const AUTH_MESSAGES = {
  SIGN_UP: {
    title: 'Create your account',
    subtitle: 'Start tracking your energy with two quick check-ins a day.',
    button: 'Continue',
    footer: 'Already have an account?',
    footerLink: 'Sign in',
  },
  SIGN_IN: {
    title: 'Welcome back',
    subtitle: `Sign in to continue tracking your energy in ${APP_INFO.NAME}.`,
    button: 'Continue',
    footer: `New to ${APP_INFO.NAME}?`,
    footerLink: 'Create an account',
  },
  VERIFICATION: {
    title: 'Verify your email',
    subtitle: 'Enter the 6-digit code we sent to your inbox.',
    button: 'Verify and continue',
    helper: "Didn't receive a code? Check spam or try again in a minute.",
  },
  LANDING: {
    tagline: 'ElliesNote',
    subtagline: 'Gentle check-ins. Clear insights. Empowered well-being.',
    emailButton: 'Continue with email and password',
    privacy:
      'By continuing, you agree to our {terms} and acknowledge our {privacy}.',
    brand: `Welcome to ${APP_INFO.NAME}`,
  },
} as const;
