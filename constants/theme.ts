import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Glassmorfismo
export const Glass = {
  // Cores de fundo (gradiente simulado com camadas)
  bgDark: '#0F0A1E',
  bgMid: '#1A0F3C',
  // Superfície glass
  surface: 'rgba(255,255,255,0.08)',
  surfaceStrong: 'rgba(255,255,255,0.13)',
  surfaceInput: 'rgba(255,255,255,0.06)',
  // Bordas
  border: 'rgba(255,255,255,0.18)',
  borderStrong: 'rgba(255,255,255,0.28)',
  // Texto
  textPrimary: '#F0EEFF',
  textSecondary: 'rgba(240,238,255,0.55)',
  // Accent
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  // Status
  income: '#34D399',
  expense: '#F87171',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
