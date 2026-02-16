// =============================================================================
// TYPOGRAPHY CONFIGURATION - Single Source of Truth
// =============================================================================
// Edit values here to change typography across ALL sections.
// Section-specific overrides live in ./sections.ts
// =============================================================================

// -----------------------------------------------------------------------------
// TypeScript Types
// -----------------------------------------------------------------------------

export interface ResponsiveSize {
  mobile: string;
  desktop: string;
}

export interface TextStyleConfig {
  fontFamily?: string;
  fontSize?: ResponsiveSize | string;
  fontWeight?: number;
  color?: string;
  lineHeight?: number | string;
  letterSpacing?: string;
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: string;
  opacity?: number;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  gap?: string;
}

export interface ContainerStyleConfig {
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
}

export interface SectionTypographyConfig {
  heading?: TextStyleConfig;
  subheading?: TextStyleConfig;
  accent?: TextStyleConfig;
  body?: TextStyleConfig;
  caption?: TextStyleConfig;
  container?: ContainerStyleConfig;
  [key: string]: TextStyleConfig | ContainerStyleConfig | undefined;
}

// -----------------------------------------------------------------------------
// Font Families (reference CSS variables from globals.css)
// -----------------------------------------------------------------------------

export const FONTS = {
  comic: "var(--font-comic)",
  header: "var(--font-header)",
  body: "var(--font-body)",
  accent: "var(--font-accent)",
  handwritten: "var(--font-handwritten)",
} as const;

// -----------------------------------------------------------------------------
// Font Sizes - Responsive (mobile / desktop)
// -----------------------------------------------------------------------------

export const FONT_SIZES = {
  // Display / Hero sizes
  heroTitle: { mobile: "90px", desktop: "100px" },

  // Heading sizes
  h1: { mobile: "40px", desktop: "69px" },
  h2: { mobile: "44px", desktop: "76px" },
  h3: { mobile: "28px", desktop: "36px" },

  // Body sizes
  bodyLg: { mobile: "18px", desktop: "21px" },
  bodyMd: { mobile: "16px", desktop: "18px" },
  bodySm: { mobile: "14px", desktop: "16px" },

  // Caption / small sizes
  caption: { mobile: "12px", desktop: "14px" },
  badge: { mobile: "12px", desktop: "12px" },

  // Navigation
  navLink: { mobile: "16px", desktop: "16.5px" },
  brandText: { mobile: "20px", desktop: "22px" },

  // Description / subtitle
  subtitle: { mobile: "24px", desktop: "30px" },

  // CTA
  cta: { mobile: "20px", desktop: "24px" },

  // Credits
  creditSmall: { mobile: "14px", desktop: "16px" },
  creditLarge: { mobile: "18px", desktop: "20px" },
} as const;

// -----------------------------------------------------------------------------
// Font Weights
// -----------------------------------------------------------------------------

export const FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

// -----------------------------------------------------------------------------
// Line Heights
// -----------------------------------------------------------------------------

export const LINE_HEIGHTS = {
  none: 1,
  tight: 0.9,
  snug: 1.1,
  normal: 1.5,
  relaxed: 1.625,
  loose: 1.75,
} as const;

// -----------------------------------------------------------------------------
// Letter Spacing
// -----------------------------------------------------------------------------

export const LETTER_SPACINGS = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
  heroTitle: "0.60em",
} as const;

// -----------------------------------------------------------------------------
// Colors
// -----------------------------------------------------------------------------

export const COLORS = {
  black: "#000000",
  darkGray: "#303030",
  gray: "#666666",
  lightGray: "#999999",
  white: "#ffffff",
  background: "#f2f2f2",
  backgroundAlt: "#e0e0e0",
  backgroundLight: "#f0f0f0",
  backgroundMid: "#e8e8e8",
  inputBg: "#d4d4d4",
  red: "#ef4444",
} as const;

// -----------------------------------------------------------------------------
// Spacing Scale (used for margins, paddings, gaps)
// -----------------------------------------------------------------------------

export const SPACING = {
  none: "0px",
  "2xs": "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "80px",
  "5xl": "128px",
} as const;

// -----------------------------------------------------------------------------
// Borders
// -----------------------------------------------------------------------------

export const BORDERS = {
  width: "2px",
  color: "#000000",
  style: "solid",
  radius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
  },
} as const;

// -----------------------------------------------------------------------------
// Combined Base Config (convenience export)
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_CONFIG = {
  fonts: FONTS,
  sizes: FONT_SIZES,
  weights: FONT_WEIGHTS,
  lineHeights: LINE_HEIGHTS,
  letterSpacings: LETTER_SPACINGS,
  colors: COLORS,
  spacing: SPACING,
  borders: BORDERS,
} as const;
