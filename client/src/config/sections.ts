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
    yOffset: 0.25,
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
    fontWeight: 500,
    fontFamily: "kanit",
    color: "#000000",
    letterSpacing: "0.025em",
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
  cursors: {
    logo: "context-menu",
    navLinkDefault: "",
    navLinkUVPs: "",
    navLinkHowItWorks: "help",
    navLinkTestimonials: "handwriting",
    navLinkMeetTheDevs: "person",
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
    width: 512,
    height: 0,
    xOffset: 0,
    yOffset: 0,
    innerXOffset: -10,
    innerYOffset: -2,
  },
  uploadButton: {
    size: 85,
    xOffset: -10,
    yOffset: 1,
  },
  loadingAnimation: {
    xOffset: 10,
    yOffset: 5,
    fontSize: 10,
    segmentWidth: 10,
    segmentHeight: 12,
    segmentCount: 7,
    fontFamily: "var(--font-pixel)",
  },
  cursors: {
    mascotFace: "pan",
    uploadButton: "pin",
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
  cursors: {
    section: "",
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
      backgroundColor: "#f2f2f2",
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
      backgroundColor: "#f2f2f2",
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
    color: "#303030",
    marginBottom: "32px",
    xOffset: 0,
    yOffset: 0,
  },
  accent: {
    fontFamily: "var(--font-accent)",
    fontSizeMobile: "44px",
    fontSizeDesktop: "76px",
    fontStyle: "italic" as const,
    color: "#303030",
    xOffset: 0,
    yOffset: 0,
  },
  cloudContainer: {
    gapX: "32px",
    gapY: "16px",
    opacity: 0.8,
    maxWidth: "72rem",
  },
  // ── Scatter offsets ───────────────────────────────────────────────────────
  // Controls how far words spread during the mid-animation state.
  // Reduce xRange/yRange if words are being clipped at the edges.
  scatter: {
    xRange: 500,   // px — max horizontal throw from center
    yRange: 350,   // px — max vertical throw from center
    scaleMin: 2.0, // minimum starting scale
    scaleMax: 4.0, // maximum starting scale
  },
  // ── Word cloud internal offsets ───────────────────────────────────────────
  // Extra padding INSIDE the word cloud block itself (between text and its own edges).
  // For the LEFT/RIGHT space between the word cloud and the section edges,
  // adjust container.paddingLeft and container.paddingRight below instead.
  offset: {
    top: "24px",   // internal top padding of the word cloud block
    right: "0px",  // internal right padding (NOTE: use container.paddingRight for side spacing)
    bottom: "24px",// internal bottom padding of the word cloud block
    left: "0px",   // internal left padding (NOTE: use container.paddingLeft for side spacing)
  },
  // ── Animation speed ───────────────────────────────────────────────────────
  // Controls the timing and pacing of the animation sequence.
  animation: {
    scrollMultiplier: 200, // % of viewport height the section scrolls while pinned (e.g. 200 = +=200%)
    scrub: 0.8,            // GSAP scrub lag in seconds — lower = snappier response to scroll
    anchorStagger: 0.04,   // seconds between each anchor word landing
    floodAmount: 0.4,      // fraction of scroll window the flood phase spans (0–1)
    snapDuration: 0.20,    // seconds each word takes to snap into place
  },
  // ── Section container padding ────────────────────────────────────────────
  // Controls space between the section boundary and its contents.
  // ✔ paddingLeft / paddingRight — the LEFT and RIGHT grey space you see in the red markers.
  //   Decrease these to make the word cloud appear wider (closer to the screen edges).
  //   Increase to push the word cloud inward (more breathing room on the sides).
  // ✔ paddingTop — space above the heading.
  // ✔ paddingBottom — space below the word cloud (before the footer).
  container: {
    paddingTop: "0px",
    paddingRight: "0px",  // ← decrease this to shrink left gap
    paddingBottom: "0px",
    paddingLeft: "0px",   // ← decrease this to shrink right gap
    backgroundColor: "#e0e0e0",
    borderColor: "#000000",
    borderWidth: "2px",
  },
  cursors: {
    section: "",
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
  buyMeACoffeeButton: {
    height: "250px",
    width: "auto",
    xOffset: 0,
    yOffset: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 0,
    marginBottom: -50,
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
  mascotLeft: {
    width: "20%",
    height: "auto",
    xOffset: -13,
    yOffset: 4,
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
    backgroundColor: "#f2f2f2",
    minHeight: "400px",
  },
  cursors: {
    ctaButton: "",
    socialLinks: "",
  },
} as const;

// =============================================================================
// CURSOR CONFIG
// =============================================================================
// Variable: CURSOR_CONFIG
// Location: Used in client/src/components/custom-cursor.tsx
// Controls: Hotspot offsets (x, y) for every cursor + middle-click scroll speed
//
// Hotspot = the pixel within the cursor image that acts as the click/pointer point.
// x = pixels from left edge of cursor image
// y = pixels from top edge of cursor image
// scrollSpeed = multiplier for middle-click drag scroll (1 = 1:1, 2 = 2x faster, etc.)
// =============================================================================

export const CURSOR_CONFIG = {
  scrollSpeed: 2,
  // Uniform size (px) applied to all standard cursors
  size: 50,
  // Separate size (px) for the testimonial / handwriting cursor
  testimonialCursorSize: 5,
  hotspots: {
    default:     { x: 4,  y: 2  },  // Pointer.cur  — arrow tip
    pointer:     { x: 8,  y: 0  },  // Link.cur      — fingertip
    text:        { x: 3,  y: 9  },  // Text.cur      — I-beam center
    move:        { x: 11, y: 11 },  // Move.cur      — 4-way center
    grab:        { x: 11, y: 11 },  // Move.cur      — palm center (idle)
    grabbing:    { x: 11, y: 11 },  // Grabbing.cur  — palm center (active)
    notAllowed:  { x: 11, y: 11 },  // Unavailable.cur — visual center
    help:        { x: 4,  y: 2  },  // Help.cur      — arrow tip
    crosshair:   { x: 11, y: 11 },  // Cross.cur     — precise center
    zoomIn:      { x: 8,  y: 8  },  // Zoom-in.cur   — lens center
    zoomOut:     { x: 8,  y: 8  },  // Zoom-out.cur  — lens center
    ewResize:    { x: 11, y: 3  },  // Horz.cur      — horizontal center
    nsResize:    { x: 3,  y: 11 },  // Vert.cur      — vertical center
    nwseResize:  { x: 11, y: 11 },  // Dgn1.cur      — diagonal center
    neswResize:  { x: 11, y: 11 },  // Dgn2.cur      — diagonal center
    wait:        { x: 11, y: 11 },  // Busy.ani      — visual center
    progress:    { x: 4,  y: 2  },  // Work.ani      — arrow tip
    contextMenu: { x: 4,  y: 2  },  // Alternate.cur — arrow tip
    handwriting: { x: 5,  y: 29 },  // Handwriting   — pen nib (Testimonials nav link)
    pan:         { x: 11, y: 11 },  // Pan.cur       — center
    person:      { x: 11, y: 4  },  // Person.cur    — head top
    pin:         { x: 5,  y: 0  },  // Pin.cur       — pin tip
  },
} as const;

// =============================================================================
// CONVENIENCE: All section configs in one object
// =============================================================================
// Use this if you prefer accessing configs through a single namespace:
//   SECTION_CONFIGS.hero.title.fontFamily
// =============================================================================

// =============================================================================
// PREFERENCES PAGE CONFIG
// =============================================================================
// Variable: PREFERENCES_CONFIG
// Location: Used in client/src/app/preferences/page.tsx
// Controls: GitHub embed box offset on the Repository Connection slide
// =============================================================================

export const PREFERENCES_CONFIG = {
  githubEmbed: {
    xOffset: 0,
    yOffset: -15,
  },
} as const;

export const SECTION_CONFIGS = {
  header: HEADER_TYPOGRAPHY,
  hero: HERO_TYPOGRAPHY,
  whatMakesUsDifferent: WHAT_MAKES_US_DIFFERENT_TYPOGRAPHY,
  features: FEATURES_TYPOGRAPHY,
  testimonials: TESTIMONIALS_TYPOGRAPHY,
  footer: FOOTER_TYPOGRAPHY,
} as const;
