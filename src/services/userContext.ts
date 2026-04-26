// Placeholder until auth is implemented
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

export const userContext = {
  getCurrentUserId: (): string => {
    return DEFAULT_USER_ID;
  },
};
