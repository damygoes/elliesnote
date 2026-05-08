import { create } from 'zustand';

type SubscriptionStore = {
  isPremium: boolean;
  isLoading: boolean;
  setIsPremium: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  isPremium: false,
  isLoading: true,
  setIsPremium: (isPremium) => set({ isPremium }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
