import { useSubscriptionStore } from '../store';

export function usePremium() {
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const isLoading = useSubscriptionStore((s) => s.isLoading);
  return { isPremium, isLoading };
}
