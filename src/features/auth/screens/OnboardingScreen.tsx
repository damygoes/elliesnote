import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { notificationService } from '@/features/notifications/services/notificationService';
import { Button } from '@/shared/components/ui/Button';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { AUTH_LINKS } from '../constants/links';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Slide data
// ---------------------------------------------------------------------------

type Slide = {
  key: string;
  title: string;
  body: string;
  isLast?: boolean;
};

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    title: 'Welcome to ElliesNote',
    body: 'A calm space to track your daily energy and symptoms — helping you understand your patterns over time.',
  },
  {
    key: 'how_it_works',
    title: 'Your daily check-in',
    body: "Once in the morning and once in the evening, you'll answer a few gentle questions about how you're feeling. It takes less than 30 seconds.",
  },
  {
    key: 'disclaimer',
    title: 'A note on your health',
    body: 'ElliesNote is a personal tracking tool, not a medical device. It does not provide diagnoses, treatment plans, or replace the advice of your doctor or healthcare provider.',
  },
  {
    key: 'notifications',
    title: 'Stay consistent with reminders',
    body: 'Allow notifications so ElliesNote can send you gentle reminders at the times that work best for you. You can change this at any time in Settings.',
    isLast: true,
  },
];

// ---------------------------------------------------------------------------
// Dot indicator
// ---------------------------------------------------------------------------

const Dots = ({ total, active }: { total: number; active: number }) => (
  <View style={styles.dots}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
    ))}
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function OnboardingScreen() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  function goNext() {
    const next = activeIndex + 1;
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setActiveIndex(next);
  }

  async function handleEnableNotifications() {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermissions();

      if (granted) {
        const pushToken = await notificationService.getExpoPushToken();
        const authToken = await getToken();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (pushToken) {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/me/push-token`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              expoPushToken: pushToken,
              platform: Platform.OS,
              timezone,
            }),
          });
        }

        await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/me/notification-settings`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ enabled: true }),
          },
        );
      }
    } finally {
      await completeOnboarding();
    }
  }

  async function handleSkipNotifications() {
    await completeOnboarding();
  }

  async function completeOnboarding() {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/me/onboarding-complete`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error('Failed');
      await user?.reload();
      router.replace(AUTH_LINKS.HOME);
    } catch {
      setIsLoading(false);
    }
  }

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideBody}>{item.body}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <Dots total={SLIDES.length} active={activeIndex} />

        {isLastSlide ? (
          <>
            <Button
              variant="primary"
              onPress={handleEnableNotifications}
              loading={isLoading}
            >
              Enable Reminders
            </Button>
            <Button
              variant="ghost"
              onPress={handleSkipNotifications}
              disabled={isLoading}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </Button>
          </>
        ) : (
          <Button variant="primary" onPress={goNext}>
            Next
          </Button>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 2,
    justifyContent: 'center',
  },
  slideContent: {
    gap: Spacing.lg,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text_primary,
    textAlign: 'center',
    lineHeight: 36,
  },
  slideBody: {
    ...Typography.body,
    color: Colors.light.text_muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl + (Platform.OS === 'ios' ? 16 : 0),
    gap: Spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.border,
  },
  dotActive: {
    backgroundColor: Colors.light.primary,
    width: 20,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipText: {
    ...Typography.body,
    color: Colors.light.text_secondary,
  },
});
