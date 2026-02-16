// =============================================================================
// SECTION-SPECIFIC TYPOGRAPHY CONFIGURATION
// =============================================================================
// Each section has its own config object. Edit values here to change
// typography for a specific section without affecting others.
//
// All values are inlined as literals for simplicity.
// =============================================================================

// =============================================================================
// HEADER SECTION CONFIG
// =============================================================================
// Variable: HEADER_TYPOGRAPHY
// Location: Used in client/src/components/Header.tsx
// Controls: Nav bar text, brand text, init text, nav links, mobile menu
// =============================================================================

export const HEADER_TYPOGRAPHY = {
  container: {
    topPosition: 20,
    zIndex: 200,
  },
  nav: {
    collapsedWidth: 150,
    expandedWidthMin: 800,
    expandedWidthMax: 1200,
    collapsedHeight: 50,
    expandedHeight: 60,
    backgroundColor: "#d4d4d4",
    backgroundOpacity: 0.85,
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 9999,
    transitionDuration: 0.5,
  },
  initText: {
    text: "INIT",
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "kanit",
    color: "#000000",
    letterSpacing: "normal",
    dotAnimationSpeed: 500,
    xOffset: 0,
    yOffset: 2,
  },
  logo: {
    height: 38,
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 4,
    leftOffset: 24,
  },
  brandText: {
    text: "DocuGitHub",
    fontSize: 22,
    fontWeight: 400,
    fontFamily: "kanit",
    color: "#000000",
    letterSpacing: "0.05em",
    leftGap: 12,
    xOffset: 0,
    yOffset: 0,
  },
  navLinks: {
    fontSize: 16.5,
    fontWeight: 500,
    fontFamily: "kanit",
    color: "#000000",
    letterSpacing: "0.025em",
    gap: 20,
    rightOffset: 24,
    hoverUnderlineOffset: 4,
    xOffset: 0,
    yOffset: 1,
  },
  mobileMenu: {
    backgroundColor: "#d4d4d4",
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 16,
    shadow: "4px 4px 0px rgba(0,0,0,1)",
    padding: 32,
    maxWidth: 384,
    menuTitleFontSize: 20,
    menuTitleFontWeight: 700,
    menuTitleFontFamily: "canada-type-gibson",
    menuLinkFontSize: 21,
    menuLinkFontWeight: 500,
    menuLinkFontFamily: "kanit",
    menuLinkGap: 16,
  },
} as const;

// =============================================================================
// HERO SECTION CONFIG
// =============================================================================
// Variable: HERO_TYPOGRAPHY
// Location: Used in client/src/components/Hero.tsx
// Controls: Title, description, badge, input box, upload button
// =============================================================================

export const HERO_TYPOGRAPHY = {
  section: {
    backgroundColor: "#f2f2f2",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 32,
    paddingRight: 32,
    fontFamily: "var(--font-body)",
    borderColor: "#000000",
    borderBottomWidth: 0,
  },
  badge: {
    text: "Beta v1.0",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#000000",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: 2,
    marginBottom: 1,
    xOffset: 0,
    yOffset: 0,
  },
  title: {
    text: "DocuGithub",
    fontSizeMobile: 90,
    fontSizeDesktop: 50,
    fontWeight: 900,
    fontFamily: "var(--font-comic)",
    lineHeight: 0.9,
    letterSpacing: "0.60em",
    color: "#000000",
    leftBorder: 0,
    rightBorder: 0,
    lineWidth: 0,
    lineColor: "#000000",
    xOffset: 0,
    yOffset: 0,
  },
  description: {
    text: "Your one stop solution to readmes",
    fontSizeMobile: 24,
    fontSizeDesktop: 30,
    fontFamily: "var(--font-handwritten)",
    fontStyle: "italic" as const,
    color: "#000000",
    marginTop: -1,
    marginBottom: 12,
    xOffset: 0,
    yOffset: 0,
    width: "100%",
    height: "auto",
  },
  inputBox: {
    containerBackgroundColor: "#d4d4d4",
    inputFieldBackgroundColor: "#d4d4d4",
    borderColor: "#000000",
    borderWidth: 3,
    borderRadius: 9999,
    shadow: "0 4px 6px -1px rgba(0,0,0,0.15)",
    paddingLeft: 24,
    paddingRight: 56,
    paddingTop: 12,
    paddingBottom: 12,
    placeholderText: "URL goes here.....",
    placeholderColor: "#666666",
    textColor: "#000000",
    fontSize: 20,
    fontWeight: 300,
    fontFamily: "var(--font-body)",
  },
  uploadButton: {
    size: 85,
    xOffset: -8,
    yOffset: 1,
  },
} as const;

// =============================================================================
// WHAT MAKES US DIFFERENT SECTION CONFIG
// =============================================================================
// Variable: WHAT_MAKES_US_DIFFERENT_TYPOGRAPHY
// Location: Used in client/src/components/WhatMakesUsDifferent.tsx
// Controls: Section heading, accent text, body paragraphs, container
// =============================================================================

export const WHAT_MAKES_US_DIFFERENT_TYPOGRAPHY = {
  video: {
    offsetY: 0,
    scale: 1.2,
  },
  heading: {
    fontFamily: "var(--font-header)",
    fontSizeMobile: "40px",
    fontSizeDesktop: "69px",
    fontWeight: 700,
    color: "#303030",
    lineHeight: 0.9,
    marginBottom: "32px",
    xOffset: 0,
    yOffset: -25,
  },
  accent: {
    fontFamily: "var(--font-accent)",
    fontSizeMobile: "44px",
    fontSizeDesktop: "76px",
    fontWeight: 500,
    color: "#303030",
    fontStyle: "normal" as const,
    xOffset: 0,
    yOffset: 10,
  },
  body: {
    fontFamily: "var(--font-body)",
    fontSizeMobile: "18px",
    fontSizeDesktop: "21px",
    fontWeight: 500,
    color: "#303030",
    lineHeight: 1.625,
    opacity: 0.9,
    gap: "24px",
    xOffset: 0,
    yOffset: 5,
    width: "100%",
    height: "auto",
    // New Border Properties
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#e0e0e0",
    paddingLeft: 0,
    paddingRight: 40,
  },
  container: {
    paddingAll: "32px",
    backgroundColor: "#e0e0e0",
    borderColor: "#000000",
    borderWidth: "2px",
  },
} as const;

// =============================================================================
// FEATURES SECTION CONFIG
// =============================================================================
// Variable: FEATURES_TYPOGRAPHY
// Location: Used in client/src/components/Features.tsx
// Controls: 3 feature sub-sections (Stats, Code Intelligence, Asset Generation)
// =============================================================================

export const FEATURES_TYPOGRAPHY = {
  // --- Video offset & scale per sub-section ---
  videos: {
    stats: {
      offsetY: 0,
      scale: 1.2,
    },
    codeIntelligence: {
      offsetY: 0,
      scale: 1.2,
    },
    assetGeneration: {
      offsetY: 0,
      scale: 1.2,
    },
  },

  // --- Sub-section 1: Stats (Cat / 75%) ---
  stats: {
    prefixText: {
      fontFamily: "var(--font-body)",
      fontSizeMobile: "18px",
      fontSizeDesktop: "21px",
      fontWeight: 500,
      color: "#303030",
      marginBottom: "16px",
      textAlign: "right",
      xOffset: -5,
      yOffset: 0,
    },
    statNumber: {
      fontFamily: "var(--font-header)",
      fontSizeMobile: "40px",
      fontSizeDesktop: "69px",
      fontWeight: 700,
      color: "#303030",
      marginBottom: "18px",
      textAlign: "right",
      xOffset: -2,
      yOffset: -15,
    },
    description: {
      fontFamily: "var(--font-body)",
      fontSizeMobile: "18px",
      fontSizeDesktop: "21px",
      fontWeight: 500,
      color: "#303030",
      marginBottom: "20px",
      textAlign: "right",
      xOffset: -5,
      yOffset: -25,
    },
    bodyText: {
      fontFamily: "var(--font-body)",
      fontSizeMobile: "18px",
      fontSizeDesktop: "21px",
      fontWeight: 500,
      color: "#1b1b1bff",
      lineHeight: 1.625,
      gap: "24px",
      opacity: 0.9,
      textAlign: "left",
      xOffset: 0,
      yOffset: 0,
      width: "100%",
      height: "auto",
      // New Border Properties
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: "#e0e0e0",
      paddingLeft: 12,
      paddingRight: 2,
    },
    container: {
      backgroundColor: "#e0e0e0",
    },
  },

  // --- Sub-section 2: Contextual Code Intelligence ---
  codeIntelligence: {
    heading: {
      fontFamily: "var(--font-header)",
      fontSizeMobile: "40px",
      fontSizeDesktop: "69px",
      fontWeight: 700,
      color: "#303030",
      marginBottom: "8px",
      xOffset: 0,
      yOffset: 15,
    },
    accent: {
      fontFamily: "var(--font-accent)",
      fontSizeMobile: "44px",
      fontSizeDesktop: "76px",
      fontStyle: "normal" as const,
      color: "#303030",
      marginBottom: "32px",
      xOffset: 0,
      yOffset: 5,
    },
    body: {
      fontFamily: "var(--font-body)",
      fontSizeMobile: "18px",
      fontSizeDesktop: "21px",
      fontWeight: 500,
      lineHeight: 1.625,
      gap: "24px",
      opacity: 0.9,
      color: "#303030",
      marginBottom: "24px",
      xOffset: -15,
      yOffset: 10,
      width: "100%",
      height: "auto",
      // New Border Properties
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: "#e0e0e0",
      paddingLeft: 16,
      paddingRight: 60,
    },
    mutedBody: {
      fontFamily: "var(--font-body)",
      fontSizeMobile: "18px",
      fontSizeDesktop: "21px",
      fontWeight: 500,
      lineHeight: 1.625,
      gap: "24px",
      opacity: 0.9,
      color: "#303030",
      xOffset: 0,
      yOffset: 0,
      width: "100%",
      height: "auto",
      // New Border Properties
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: "#e0e0e0",
      paddingLeft: 16,
      paddingRight: 16,
    },
    container: {
      backgroundColor: "#e0e0e0",
    },
  },

  // --- Sub-section 3: Asset Generation ---
  assetGeneration: {
    heading: {
      fontFamily: "var(--font-header)",
      fontSizeMobile: "40px",
      fontSizeDesktop: "69px",
      fontWeight: 700,
      color: "#303030",
      marginBottom: "8px",
      textAlign: "right",
      xOffset: -3-20,
      yOffset: 0,
    },
    accent: {
      fontFamily: "var(--font-accent)",
      fontSizeMobile: "44px",
      fontSizeDesktop: "76px",
      fontStyle: "normal" as const,
      color: "#303030",
      marginBottom: "32px",
      textAlign: "right",
      xOffset: -4-20,
      yOffset: -15,
    },
    body: {
      fontFamily: "var(--font-body)",
      fontSizeMobile: "18px",
      fontSizeDesktop: "21px",
      fontWeight: 500,
      lineHeight: 1.625,
      color: "#303030",
      marginBottom: "24px",
      textAlign: "left",
      xOffset: 12-20,
      yOffset: -5,
      width: "100%",
      height: "auto",
      // New Border Properties
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: "#e0e0e0",
      paddingLeft: 25,
      paddingRight: 16,
    },
    mutedBody: {
      fontFamily: "var(--font-body)",
      fontSizeMobile: "18px",
      fontSizeDesktop: "21px",
      fontWeight: 500,
      lineHeight: 1.625,
      color: "#303030",
      textAlign: "left",
      xOffset: 12-20,
      yOffset: -5,
      width: "100%",
      height: "auto",
      // New Border Properties
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: "#e0e0e0",
      paddingLeft: 25,
      paddingRight: 16,
    },
    container: {
      backgroundColor: "#e0e0e0",
    },
  },
} as const;

// =============================================================================
// TESTIMONIALS SECTION CONFIG
// =============================================================================
// Variable: TESTIMONIALS_TYPOGRAPHY
// Location: Used in client/src/components/Testimonials.tsx
// Controls: Section heading, accent text, company cloud items, container
// =============================================================================

export const TESTIMONIALS_TYPOGRAPHY = {
  heading: {
    fontFamily: "var(--font-header)",
    fontSizeMobile: "40px",
    fontSizeDesktop: "69px",
    fontWeight: 700,
    color: "#000000",
    marginBottom: "32px",
    xOffset: 0,
    yOffset: 0,
  },
  accent: {
    fontFamily: "var(--font-accent)",
    fontSizeMobile: "44px",
    fontSizeDesktop: "76px",
    fontStyle: "italic" as const,
    color: "#000000",
    xOffset: 0,
    yOffset: 0,
  },
  cloudContainer: {
    gapX: "32px",
    gapY: "16px",
    opacity: 0.8,
    maxWidth: "72rem",
  },
  container: {
    paddingAll: "32px",
    backgroundColor: "#e8e8e8",
    borderColor: "#000000",
    borderWidth: "2px",
  },
} as const;

// =============================================================================
// FOOTER SECTION CONFIG
// =============================================================================
// Variable: FOOTER_TYPOGRAPHY
// Location: Used in client/src/components/Footer.tsx
// Controls: CTA button, social links, credits text
// =============================================================================

export const FOOTER_TYPOGRAPHY = {
  ctaButton: {
    fontFamily: "var(--font-header)",
    fontSize: "24px",
    fontWeight: 900,
    color: "#ffffff",
    backgroundColor: "#000000",
    hoverBackgroundColor: "#1f2937",
    borderRadius: "9999px",
    paddingX: "40px",
    paddingY: "32px",
    shadow: "6px 6px 0px rgba(0,0,0,0.5)",
    xOffset: 0,
    yOffset: 0,
  },
  chatBubble: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 700,
    color: "#000000",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: "2px",
    borderRadius: "12px",
    padding: "12px",
    shadow: "4px 4px 0px rgba(0,0,0,1)",
    xOffset: 0,
    yOffset: 0,
    width: "auto",
    height: "auto",
  },
  creditsSmall: {
    fontFamily: "var(--font-body)",
    fontSizeMobile: "14px",
    fontSizeDesktop: "16px",
    fontWeight: 700,
    color: "#1f2937",
    xOffset: 0,
    yOffset: 0,
  },
  creditsLarge: {
    fontFamily: "var(--font-header)",
    fontSizeMobile: "18px",
    fontSizeDesktop: "20px",
    fontWeight: 900,
    color: "#000000",
    letterSpacing: "-0.025em",
    marginTop: "4px",
    xOffset: 0,
    yOffset: 0,
  },
  socialLinks: {
    iconSize: "24px",
    padding: "12px",
    borderColor: "#000000",
    borderWidth: "2px",
    borderRadius: "9999px",
    shadow: "2px 2px 0px rgba(0,0,0,1)",
    gap: "16px",
    marginBottom: "80px",
  },
  container: {
    paddingY: "64px",
    paddingX: "16px",
    backgroundColor: "#ffffff",
    minHeight: "400px",
  },
} as const;

// =============================================================================
// CONVENIENCE: All section configs in one object
// =============================================================================
// Use this if you prefer accessing configs through a single namespace:
//   SECTION_CONFIGS.hero.title.fontFamily
// =============================================================================

export const SECTION_CONFIGS = {
  header: HEADER_TYPOGRAPHY,
  hero: HERO_TYPOGRAPHY,
  whatMakesUsDifferent: WHAT_MAKES_US_DIFFERENT_TYPOGRAPHY,
  features: FEATURES_TYPOGRAPHY,
  testimonials: TESTIMONIALS_TYPOGRAPHY,
  footer: FOOTER_TYPOGRAPHY,
} as const;
