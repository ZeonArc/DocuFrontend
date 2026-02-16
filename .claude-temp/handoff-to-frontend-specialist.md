# Handoff to Frontend Specialist

## Mission
Create a centralized typography configuration system that gives granular control over all text styling across all sections.

## User Requirements
The user needs to control the following for EVERY section:
- Font size
- Font weight
- Color
- Line spacing (line-height)
- Space between lines (gap/margin between elements)
- Top spacing (margin-top/padding-top)
- Bottom spacing (margin-bottom/padding-bottom)
- **Everything** - all typography-related properties

## Current State
Based on the Explore agent's findings:

**CSS Variables Location:** `client/src/app/globals.css` (lines 39-55)
```
--font-comic: 'nitti-mostro-comic-shadow', sans-serif
--font-header: 'canada-type-gibson', sans-serif
--font-body: 'kanit', sans-serif
--font-accent: 'lumios-marker', sans-serif
--font-handwritten: 'segoe-print', sans-serif
```

**Sections to Update:**
1. **Hero** (`components/Hero.tsx`) - Already has `HERO_CONFIG` object
2. **Features** (`components/Features.tsx`) - 3 subsections
3. **WhatMakesUsDifferent** (`components/WhatMakesUsDifferent.tsx`) - Recently updated
4. **Testimonials** (`components/Testimonials.tsx`)
5. **Header** (`components/Header.tsx`) - Already has `HEADER_CONFIG` object
6. **Footer** (`components/Footer.tsx`)

## Tasks

### 1. Create Centralized Typography Config
**Create:** `client/src/config/typography.ts`

This file should export:
```typescript
export const TYPOGRAPHY_CONFIG = {
  // Font families (reference CSS variables)
  fonts: {
    header: 'var(--font-header)',
    body: 'var(--font-body)',
    accent: 'var(--font-accent)',
    comic: 'var(--font-comic)',
    handwritten: 'var(--font-handwritten)',
  },

  // Font sizes with mobile/desktop variants
  sizes: {
    hero: {
      mobile: '90px',
      desktop: '100px',
    },
    h1: {
      mobile: '40px',
      desktop: '69px',
    },
    h2: {
      mobile: '44px',
      desktop: '76px',
    },
    body: {
      mobile: '18px',
      desktop: '21px',
    },
    // ... add all size variants
  },

  // Font weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
    black: 900,
  },

  // Line heights
  lineHeights: {
    tight: 0.9,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Colors
  colors: {
    primary: '#000000',
    secondary: '#303030',
    muted: '#666666',
    white: '#ffffff',
  },

  // Spacing scale
  spacing: {
    xs: '12px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '64px',
  },
}
```

### 2. Create Section-Specific Config
**Create:** `client/src/config/sections.ts`

Export typed configuration objects for each section:
```typescript
export const SECTION_CONFIGS = {
  whatMakesUsDifferent: {
    heading: {
      fontFamily: TYPOGRAPHY_CONFIG.fonts.header,
      fontSize: TYPOGRAPHY_CONFIG.sizes.h1,
      fontWeight: TYPOGRAPHY_CONFIG.weights.bold,
      color: '#303030',
      lineHeight: TYPOGRAPHY_CONFIG.lineHeights.tight,
      marginBottom: TYPOGRAPHY_CONFIG.spacing.lg,
    },
    accent: {
      fontFamily: TYPOGRAPHY_CONFIG.fonts.accent,
      fontSize: TYPOGRAPHY_CONFIG.sizes.h2,
      fontWeight: TYPOGRAPHY_CONFIG.weights.regular,
      color: '#303030',
      fontStyle: 'italic',
    },
    body: {
      fontFamily: TYPOGRAPHY_CONFIG.fonts.body,
      fontSize: TYPOGRAPHY_CONFIG.sizes.body,
      fontWeight: TYPOGRAPHY_CONFIG.weights.medium,
      color: '#303030',
      lineHeight: TYPOGRAPHY_CONFIG.lineHeights.relaxed,
      opacity: 0.9,
      gap: TYPOGRAPHY_CONFIG.spacing.md,
    },
    container: {
      paddingTop: TYPOGRAPHY_CONFIG.spacing.lg,
      paddingBottom: TYPOGRAPHY_CONFIG.spacing.lg,
      backgroundColor: '#e0e0e0',
    }
  },

  features: {
    // Similar structure for Features section
  },

  hero: {
    // Similar structure for Hero section
  },

  testimonials: {
    // Similar structure for Testimonials section
  },

  // ... all other sections
}
```

### 3. Create Typography Utility Functions
**Add to:** `client/src/config/typography.ts`

```typescript
// Helper function to get responsive fontSize
export const getResponsiveSize = (sizeKey: keyof typeof TYPOGRAPHY_CONFIG.sizes) => ({
  mobile: TYPOGRAPHY_CONFIG.sizes[sizeKey].mobile,
  desktop: TYPOGRAPHY_CONFIG.sizes[sizeKey].desktop,
})

// Helper to build style objects
export const buildTextStyle = (config: any) => ({
  fontFamily: config.fontFamily,
  fontSize: config.fontSize,
  fontWeight: config.fontWeight,
  color: config.color,
  lineHeight: config.lineHeight,
  // ... other properties
})
```

### 4. Update Components to Use Config

**Priority order:**
1. Start with `WhatMakesUsDifferent.tsx` (user's immediate focus)
2. Then `Features.tsx`
3. Then `Hero.tsx` (already has CONFIG, refactor to use new system)
4. Then `Testimonials.tsx`
5. Then `Header.tsx` (already has CONFIG, refactor)
6. Then `Footer.tsx`

**Example for WhatMakesUsDifferent.tsx:**
```typescript
import { SECTION_CONFIGS } from '@/config/sections';

// In the component:
const config = SECTION_CONFIGS.whatMakesUsDifferent;

<h2
  className="text-[40px] md:text-[69px] font-black mb-8"
  style={{
    fontFamily: config.heading.fontFamily,
    fontWeight: config.heading.fontWeight,
    color: config.heading.color,
    fontSize: config.heading.fontSize.mobile, // or use Tailwind responsive
  }}
>
```

### 5. Add TypeScript Types
**Create:** `client/src/types/typography.ts`

```typescript
export interface TextStyleConfig {
  fontFamily?: string;
  fontSize?: {
    mobile: string;
    desktop: string;
  } | string;
  fontWeight?: number;
  color?: string;
  lineHeight?: number | string;
  letterSpacing?: string;
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  gap?: string;
  opacity?: number;
}

export interface SectionConfig {
  heading?: TextStyleConfig;
  subheading?: TextStyleConfig;
  accent?: TextStyleConfig;
  body?: TextStyleConfig;
  container?: {
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    backgroundColor?: string;
    borderColor?: string;
  };
}
```

## Technical Context

**Stack:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- GSAP animations (preserve all existing animations!)

**Font Loading:**
- Adobe Typekit: `https://use.typekit.net/kag3qbi.css`
- Loaded in: `client/src/app/layout.tsx` (line 18)

**Design Patterns:**
- Hero and Header already use CONFIG objects - follow this pattern
- All sections use consistent spacing: 12px, 16px, 24px, 32px, 64px
- All sections have 2px solid black borders
- Typography hierarchy: H1 (40-69px), H2 (44-76px), Body (18-21px)

## Acceptance Criteria

- [ ] `typography.ts` config file created with all base typography settings
- [ ] `sections.ts` config file created with section-specific overrides
- [ ] TypeScript types defined in `typography.ts` (or separate types file)
- [ ] All 6 components updated to use the new config system
- [ ] No hardcoded typography values in components (all reference config)
- [ ] Existing GSAP animations preserved and working
- [ ] All responsive breakpoints working (mobile/desktop)
- [ ] User can edit all typography from ONE central location (the config files)
- [ ] Code is type-safe (no `any` types)
- [ ] Test the dev server (`npm run dev`) - no errors

## Special Notes

**DO NOT BREAK:**
- GSAP animations (ScrollTrigger, text reveals, canvas animations)
- Responsive layouts
- Canvas image sequence in WhatMakesUsDifferent
- Hover effects and interactions
- Counter animations in Features

**Preserve:**
- All animation timings
- All current visual appearance (this is refactoring, not redesign)
- Border styles
- Background colors

**User's Specific Request:**
The user said "Include other things as well" and wants to control "everything" - so make the config as comprehensive as possible. Include:
- Font properties
- Spacing (margin, padding, gap)
- Colors
- Line heights
- Letter spacing
- Any other text-related CSS properties

## On Completion

1. Verify all sections render correctly with `npm run dev`
2. Check that editing config files changes all sections
3. Create a summary file: `.claude-temp/typography-refactor-complete.md` listing:
   - Location of new config files
   - Variable names for each section
   - Example of how to edit a section's typography
   - Before/after code comparison
4. Update TASKS.md with ✅

## Questions for User (if needed)

If you encounter ambiguity, use AskUserQuestion for:
- Should spacing be in px, rem, or mixed?
- Should we use Tailwind classes or inline styles for the config?
- Any specific naming conventions for config keys?
