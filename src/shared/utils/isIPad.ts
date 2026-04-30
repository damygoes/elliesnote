import { Platform } from 'react-native';

export const isIPad = Platform.OS === 'ios' && Platform.isPad;
