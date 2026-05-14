import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Purchases, {
  PACKAGE_TYPE,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';

import { logger } from '@/services/logger';
import { Button } from '@/shared/components/ui/Button';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { usePurchase } from '../hooks/usePurchase';

const FEATURES = [
  'Personalised energy insights',
  '14-day and 30-day trend charts',
  'Apple Health sync (sleep, HRV, steps)',
  'Browse your full calendar history, month by month',
  '30-day missed-day tracking on your calendar',
];

function hasFreeTrialOffer(pkg: PurchasesPackage): boolean {
  return (pkg.product.introPrice?.price ?? -1) === 0;
}

function buildLegalText(pkg: PurchasesPackage | null): string {
  if (!pkg)
    return 'Subscription auto-renews. Cancel anytime in App Store settings.';

  const { priceString, introPrice } = pkg.product;
  const isMonthly = pkg.packageType === PACKAGE_TYPE.MONTHLY;
  const periodLabel = isMonthly ? 'month' : 'year';

  if (introPrice && introPrice.price === 0) {
    const days =
      introPrice.periodUnit === 'DAY'
        ? introPrice.periodNumberOfUnits
        : introPrice.periodNumberOfUnits * 7;
    return `Try free for ${days} days, then ${priceString}/${periodLabel}. Auto-renews. Cancel anytime in App Store settings.`;
  }

  return `${priceString}/${periodLabel}. Auto-renews. Cancel anytime in App Store settings.`;
}

export const PaywallScreen = () => {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage | null>(null);
  const [isLoadingOffering, setIsLoadingOffering] = useState(true);
  const { isPurchasing, purchase, restore } = usePurchase();

  useEffect(() => {
    Purchases.getOfferings()
      .then((offerings) => {
        const current = offerings.current;
        if (current) {
          setOffering(current);
          // Default to annual if available, otherwise monthly
          const defaultPkg =
            current.annual ??
            current.monthly ??
            current.availablePackages[0] ??
            null;
          setSelectedPkg(defaultPkg);
        }
      })
      .catch((error: Error) => {
        logger.error(
          'Failed to load offerings',
          JSON.stringify({ error: error.message }),
        );
      })
      .finally(() => setIsLoadingOffering(false));
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!selectedPkg) return;
    try {
      const success = await purchase(selectedPkg);
      if (success) router.back();
    } catch {
      Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
    }
  }, [selectedPkg, purchase]);

  const handleRestore = useCallback(async () => {
    try {
      const restored = await restore();
      if (restored) {
        Alert.alert('Restored', 'Your premium access has been restored.');
        router.back();
      } else {
        Alert.alert(
          'Nothing to restore',
          'No active subscription found for this Apple ID.',
        );
      }
    } catch {
      Alert.alert('Restore failed', 'Please try again.');
    }
  }, [restore]);

  const hasTrial = selectedPkg ? hasFreeTrialOffer(selectedPkg) : false;
  const ctaLabel = isPurchasing
    ? 'Processing…'
    : hasTrial
      ? 'Start 7-Day Free Trial'
      : 'Subscribe';

  const monthlyPkg = offering?.monthly ?? null;
  const annualPkg = offering?.annual ?? null;
  const packages = [annualPkg, monthlyPkg].filter(
    Boolean,
  ) as PurchasesPackage[];

  return (
    <View style={styles.root}>
      <Pressable
        style={styles.close}
        onPress={() => router.back()}
        hitSlop={12}
      >
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headline}>Unlock Elliesnote Premium</Text>
        <Text style={styles.subtext}>
          Understand your energy patterns with data-driven insights.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.check}>✓</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {isLoadingOffering ? (
          <ActivityIndicator
            size="small"
            color={Colors.light.primary}
            style={styles.spinner}
          />
        ) : packages.length === 0 ? (
          <Text style={styles.loadError}>
            Unable to load pricing. Check your connection.
          </Text>
        ) : (
          <View style={styles.packages}>
            {packages.map((pkg) => {
              const isAnnual = pkg.packageType === PACKAGE_TYPE.ANNUAL;
              const isSelected = selectedPkg?.identifier === pkg.identifier;
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[styles.pkgCard, isSelected && styles.pkgCardSelected]}
                  onPress={() => setSelectedPkg(pkg)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.pkgCardInner}>
                    <View style={styles.pkgLeft}>
                      <Text
                        style={[
                          styles.pkgTitle,
                          isSelected && styles.pkgTitleSelected,
                        ]}
                      >
                        {isAnnual ? 'Annual' : 'Monthly'}
                      </Text>
                      {isAnnual && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>Best value</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.pkgPrice,
                        isSelected && styles.pkgPriceSelected,
                      ]}
                    >
                      {pkg.product.priceString}
                      <Text style={styles.pkgPeriod}>
                        {isAnnual ? '/yr' : '/mo'}
                      </Text>
                    </Text>
                  </View>
                  {isAnnual && hasFreeTrialOffer(pkg) && (
                    <Text style={styles.trialNote}>
                      Includes 7-day free trial
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Button
          variant="primary"
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPkg}
          loading={isPurchasing}
        >
          {ctaLabel}
        </Button>

        <Button
          variant="ghost"
          onPress={handleRestore}
          disabled={isPurchasing}
          style={styles.restoreBtn}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </Button>

        <Text style={styles.legal}>{buildLegalText(selectedPkg)}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  close: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.xl,
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: Colors.light.text_secondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 64,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xxl,
  },
  headline: {
    ...Typography.subtitle,
    color: Colors.light.text_primary,
    textAlign: 'center',
  },
  subtext: {
    ...Typography.body,
    color: Colors.light.text_secondary,
    textAlign: 'center',
    marginTop: -Spacing.lg,
  },
  features: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  check: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
    lineHeight: 22,
  },
  featureText: {
    ...Typography.body,
    color: Colors.light.text_primary,
    flex: 1,
    lineHeight: 22,
  },
  packages: {
    gap: Spacing.md,
  },
  pkgCard: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  pkgCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary_soft,
  },
  pkgCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pkgLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pkgTitle: {
    ...Typography.label,
    fontWeight: '600',
    color: Colors.light.text_secondary,
  },
  pkgTitleSelected: {
    color: Colors.light.primary,
  },
  badge: {
    backgroundColor: Colors.light.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...Typography.small,
    color: Colors.light.on_primary,
    fontWeight: '600',
  },
  pkgPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text_secondary,
  },
  pkgPriceSelected: {
    color: Colors.light.primary,
  },
  pkgPeriod: {
    fontSize: 13,
    fontWeight: '400',
  },
  trialNote: {
    ...Typography.small,
    color: Colors.light.primary,
  },
  spinner: {
    marginVertical: Spacing.xxl,
  },
  loadError: {
    ...Typography.body,
    color: Colors.light.error,
    textAlign: 'center',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: -Spacing.md,
  },
  restoreText: {
    ...Typography.caption,
    color: Colors.light.text_secondary,
  },
  legal: {
    ...Typography.small,
    color: Colors.light.text_muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -Spacing.md,
  },
});
