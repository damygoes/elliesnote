import { useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { isPremiumEntitled } from '../services/purchasesService';
import { useSubscriptionStore } from '../store';

export function useInitSubscription(): void {
  const { user } = useUser();
  const setIsPremium = useSubscriptionStore((s) => s.setIsPremium);
  const setIsLoading = useSubscriptionStore((s) => s.setIsLoading);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const init = async () => {
      setIsLoading(true);
      try {
        const { customerInfo } = await Purchases.logIn(user.id);
        if (active) setIsPremium(isPremiumEntitled(customerInfo));
      } catch {
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          if (active) setIsPremium(isPremiumEntitled(customerInfo));
        } catch {}
      } finally {
        if (active) setIsLoading(false);
      }
    };

    init();

    const handler = (info: CustomerInfo) => {
      if (active) setIsPremium(isPremiumEntitled(info));
    };
    Purchases.addCustomerInfoUpdateListener(handler);

    return () => {
      active = false;
      Purchases.removeCustomerInfoUpdateListener(handler);
    };
  }, [user, user?.id, setIsPremium, setIsLoading]);
}
