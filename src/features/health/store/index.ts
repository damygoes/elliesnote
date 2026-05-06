import { create } from 'zustand';

type HealthPermissionStore = {
  hasPermission: boolean | null;
  setHasPermission: (value: boolean | null) => void;
};

export const useHealthPermissionStore = create<HealthPermissionStore>(
  (set) => ({
    hasPermission: null,
    setHasPermission: (hasPermission) => set({ hasPermission }),
  }),
);
