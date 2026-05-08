import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import type { CustomerInfo } from 'react-native-purchases';

const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '';

export function initPurchases(): void {
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: IOS_API_KEY });
}

export function isPremiumEntitled(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active['ElliesNote Premium'] !== undefined;
}
