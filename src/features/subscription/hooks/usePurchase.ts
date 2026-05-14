import { useState } from 'react';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { isPremiumEntitled } from '../services/purchasesService';
import { useSubscriptionStore } from '../store';

export function usePurchase() {
  const setIsPremium = useSubscriptionStore((s) => s.setIsPremium);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchase = async (pkg: PurchasesPackage): Promise<boolean> => {
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const nowPremium = isPremiumEntitled(customerInfo);
      setIsPremium(nowPremium);
      return nowPremium;
    } catch (err: unknown) {
      if ((err as { userCancelled?: boolean })?.userCancelled === true)
        return false;
      throw err;
    } finally {
      setIsPurchasing(false);
    }
  };

  const restore = async (): Promise<boolean> => {
    setIsPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const nowPremium = isPremiumEntitled(customerInfo);
      setIsPremium(nowPremium);
      return nowPremium;
    } finally {
      setIsPurchasing(false);
    }
  };

  return { isPurchasing, purchase, restore };
}
