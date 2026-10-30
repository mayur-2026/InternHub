/**
 * InternHub Design System — Centralized Theme Tokens
 * Strict adherence to the approved design specification.
 */

export const THEME = {
  colors: {
    // Primary Brand
    primary: '#7950F2',
    primaryHover: '#6741D9',
    primarySoft: '#F3F0FF',

    // Surfaces & Canvas
    pageBackground: '#F8FAFF',
    surface: '#FFFFFF',
    subtleSurface: '#F5F7FC',
    border: '#EDF0F6',

    // Typography & Contrast
    textMain: '#25324B',
    textSecondary: '#64748B',
    textMuted: '#8993A7',

    // Semantic Status Systems (Accent, Soft Bg, and Accessible Text)
    success: {
      accent: '#20C997',
      background: '#E6FCF5',
      text: '#087F5B',
    },
    warning: {
      accent: '#FFB347',
      background: '#FFF4E6',
      text: '#9A4D00',
    },
    info: {
      accent: '#4DABF7',
      background: '#E7F5FF',
      text: '#1864AB',
    },
    project: {
      accent: '#F06595',
      background: '#FFF0F6',
      text: '#C2255C',
    },
    error: {
      accent: '#DC2626',
      background: '#FEF2F2',
      text: '#991B1B',
    },

    track: '#EEF1F7',
    illustrationBg: '#EDE9FF',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    roles: {
      appName: 'text-[18px] font-bold leading-[26px]',
      pageHeading: 'text-[22px] md:text-[24px] font-bold leading-[30px] md:leading-[32px]',
      sectionHeading: 'text-[18px] font-semibold leading-[26px]',
      cardHeading: 'text-[15px] font-semibold leading-[22px]',
      body: 'text-[14px] font-normal leading-[22px]',
      navigation: 'text-[14px] font-medium leading-[20px]',
      button: 'text-[14px] font-semibold leading-[20px]',
      input: 'text-[16px] md:text-[14px] font-normal leading-[20px]',
      formLabel: 'text-[13px] font-medium leading-[20px]',
      supporting: 'text-[12px] font-normal leading-[18px]',
      badge: 'text-[12px] font-semibold leading-[16px]',
      kpiValue: 'text-[26px] font-bold leading-[32px]',
    },
  },

  dimensions: {
    sidebarWidth: '240px',
    headerHeight: '64px',
    avatarHeader: '32px',
    avatarProfile: '80px',
    metricIconSize: '36px',
    metricIconRadius: '10px',
    cardRadius: '12px',
    buttonRadius: '8px',
    inputRadius: '8px',
    badgeRadius: '9999px',
    progressBarHeight: '6px',
  },

  shadows: {
    card: '0 2px 12px rgba(30, 41, 59, 0.04)',
  },

  gradients: {
    hero: 'linear-gradient(135deg, #F3F0FF 0%, #E4DEFF 100%)',
  },
} as const

export type SemanticVariant = 'primary' | 'success' | 'warning' | 'info' | 'project' | 'error'

