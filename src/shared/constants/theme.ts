import { Platform } from 'react-native';

// --------------------------------------------------
// PALETTE (raw colors — never used directly in UI)
// --------------------------------------------------

const palette = {
  // sage greens — calm, natural, not clinical
  sage_primary: '#5C7A62',
  sage_soft: '#EBF2EC',

  // warm neutrals — easier on light-sensitive eyes than cool grays
  warm_100: '#F9F7F4',
  warm_200: '#EDE9E3',
  warm_300: '#D6CFC6',
  warm_400: '#C4BCB5',
  warm_500: '#8C8279',
  warm_700: '#4A433D',
  warm_900: '#1C1714',

  // base
  white: '#FFFFFF',
  black: '#000000',

  // feedback — warm red, less harsh than a saturated error red
  red_error: '#B05A4A',
};

// --------------------------------------------------
// SEMANTIC COLORS (used in components)
// --------------------------------------------------

export const Colors = {
  light: {
    // surfaces
    background_primary: palette.warm_100,
    surface: palette.white,

    // text
    text_primary: palette.warm_900,
    text_secondary: palette.warm_500,

    // borders
    border: palette.warm_300,

    // text
    text_muted: palette.warm_700,

    // actions
    primary: palette.sage_primary,
    primary_soft: palette.sage_soft,
    primary_disabled: palette.warm_400,
    on_primary: palette.white,

    // feedback
    error: palette.red_error,

    // navigation (Expo compatibility)
    tint: palette.sage_primary,
    icon: palette.warm_500,
    tabIconDefault: palette.warm_500,
    tabIconSelected: palette.sage_primary,
  },

  dark: {
    // surfaces
    background_primary: '#1A1714',
    surface: '#221E1B',

    // text
    text_primary: '#E8E0D8',
    text_secondary: '#9E948A',
    text_muted: '#C0B8B0',

    // borders
    border: '#2E2823',

    // actions
    primary: '#7FAF87',
    primary_soft: '#1E2E21',
    primary_disabled: '#3A3530',
    on_primary: palette.white,

    // feedback
    error: '#CF7B6B',

    // navigation (Expo compatibility)
    tint: '#7FAF87',
    icon: '#9E948A',
    tabIconDefault: '#9E948A',
    tabIconSelected: '#7FAF87',
  },
};

// --------------------------------------------------
// SPACING SCALE
// --------------------------------------------------

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// --------------------------------------------------
// RADIUS SCALE
// --------------------------------------------------

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

// --------------------------------------------------
// TYPOGRAPHY
// --------------------------------------------------

export const Typography = {
  label: {
    fontSize: 17,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  buttonLarge: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
} as const;

// --------------------------------------------------
// FONTS (platform-aware)
// --------------------------------------------------

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// --------------------------------------------------
// THEME HELPER (optional but useful)
// --------------------------------------------------

export type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode) => ({
  colors: Colors[mode],
  spacing: Spacing,
  radius: Radius,
  typography: Typography,
});
