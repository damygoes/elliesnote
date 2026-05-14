import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePremium } from '@/features/subscription/hooks/usePremium';
import { SheetHeader } from '@/shared/components/SheetHeader';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { useHealthPermission } from '../hooks/useHealthPermission';

function AppleHealthCard() {
  const { hasPermission, request, disconnect } = useHealthPermission();
  const { isPremium } = usePremium();

  const isConnected = hasPermission === true;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Apple Health</Text>
          {isConnected && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Connected</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDescription}>
          Syncs sleep, resting heart rate, heart rate variability, and step
          count to generate personalised energy insights.
        </Text>
      </View>

      {isConnected ? (
        <View style={styles.connectedActions}>
          <Text style={styles.revokeHint}>
            To fully remove access, go to iOS Settings → Health → Data Access &
            Devices → Elliesnote.
          </Text>
          <Pressable style={styles.disconnectButton} onPress={disconnect}>
            <Text style={styles.disconnectText}>Disconnect</Text>
          </Pressable>
        </View>
      ) : !isPremium ? (
        <Pressable
          style={styles.lockedButton}
          onPress={() => router.push('/premium')}
        >
          <Text style={styles.lockedText}>🔒 Premium feature — Upgrade</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[
            styles.connectButton,
            Platform.OS !== 'ios' && styles.disabledButton,
          ]}
          onPress={request}
          disabled={Platform.OS !== 'ios'}
        >
          <Text style={styles.connectText}>
            {Platform.OS !== 'ios' ? 'iOS only' : 'Connect Apple Health'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export const IntegrationsSheetScreen = () => (
  <SafeAreaView style={styles.container} edges={['bottom']}>
    <SheetHeader title="Integrations" />
    <View style={styles.content}>
      <AppleHealthCard />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  cardHeader: {
    gap: Spacing.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    ...Typography.label,
    fontWeight: '600',
    color: Colors.light.text_primary,
  },
  badge: {
    backgroundColor: Colors.light.primary_soft,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...Typography.small,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  cardDescription: {
    ...Typography.body,
    color: Colors.light.text_secondary,
    lineHeight: 22,
  },
  connectedActions: {
    gap: Spacing.md,
  },
  revokeHint: {
    ...Typography.small,
    color: Colors.light.text_muted,
    lineHeight: 18,
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  lockedButton: {
    backgroundColor: Colors.light.primary_soft,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.light.primary_disabled,
  },
  connectText: {
    ...Typography.body,
    color: Colors.light.on_primary,
    fontWeight: '600',
  },
  lockedText: {
    ...Typography.body,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  disconnectButton: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  disconnectText: {
    ...Typography.body,
    color: Colors.light.text_secondary,
  },
});
