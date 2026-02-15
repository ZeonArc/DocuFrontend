# DocuGitHub Landing Page — Implementation Plan

## Context

Build a pixel-perfect, animation-heavy landing page for **DocuGitHub** — a developer tool that generates documentation from GitHub repos. The project is greenfield (assets only, no code). The design follows a **"Two-Tone Comic"** aesthetic: a living graphic novel with high-contrast black ink lines on alternating Pastel White (`#f2f2f2`) and Soft Grey (`#e0e0e0`) backgrounds.

The user wants **maximum sub-agent orchestration** and **maximum MCP tool usage** throughout.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP + ScrollTrigger + SplitText (Club plugin)
- **Fonts:** Adobe Typekit (`https://use.typekit.net/kag3qbi.css`)
- **Deployment:** Vercel
- **No backend / No auth / No CTA signup**

---

## Design Tokens

```
Colors:
  --bg-white: #f2f2f2     (Pastel White)
  --bg-grey: #e0e0e0      (Soft Grey)
  --ink: #000000           (Black ink lines)
  --white: #ffffff

Fonts:
  --font-brand: "nitti-mostro-comic-shadow"   (Branding - 900 weight)
  --font-header: "canada-type-gibson"          (Impact Headers - 700 weight)
  --font-accent: "lumios-marker"               (Accent Headers - 400 weight)
  --font-body: "kanit"                         (Body/UI - 300/500 weight)
  --font-handwritten: "segoe-print"            (Handwritten notes - 400 weight)
```

---

## Page Sections & Spec

### 1. Navbar (Sticky)
- Solid white bar, thick black bottom border
- **Left:** Retro "URL bar" graphic with `docugithub.com` + lock icon
- **Right:** Text links (`URLs`, `How does it work?`, `Testimonials`, `Meet the class`) in Kanit Medium
- No buttons, just clean text navigation

### 2. Hero Section
- **Background:** Pastel White
- **Layout:** 50/50 split
- **Left:** "Docugithub" in 100px Nitti Mostro Comic, "Your one stop solution to readmes" in Segoe Print, pill-shaped URL search bar with upload arrow button (hero-upload-button.png) triggering file upload dialog
- **Right:** Herosection.png mascot character

### 3. Zig-Zag Feature Sections (Scroll-Triggered)
Alternating backgrounds, alternating text/video layout:

| Section                      | BG    | Layout           | Heading                                                   | Video                                 |
| ---------------------------- | ----- | ---------------- | --------------------------------------------------------- | ------------------------------------- |
| A: "Different?"              | Grey  | Text L / Video R | "What makes us" (Gibson) + "Different?" (Lumios)          | what-makes-us-different.mp4           |
| B: "75% Efficiency"          | White | Video L / Text R | "75%" massive Gibson                                      | 75%.mp4                               |
| C: "Contextual Intelligence" | Grey  | Text L / Video R | "Contextual Code" (Gibson) + "Intelligence" (Lumios)      | contextual-code-intelligence.mp4      |
| D: "Asset Generation"        | White | Video L / Text R | "Asset Generation" (Gibson) + "with Google Flow" (Lumios) | asset-generation-with-google-flow.mp4 |

**Video behavior:** Play once on scroll into view. Lock after — no replay on re-scroll.

### 4. Testimonials
- **Background:** Grey
- "What people" (Gibson) + "Say about us ??" (Lumios)
- testimonials.mp4 — **loops continuously** (kinetic cloud of org names)

### 5. Footer ("The Hangout Spot")
- **Background:** Pastel White → solid black bar at bottom
- **Center:** "Buy us a coffee" button (footer-buy-us-a-coffee.png)
- **Below:** Social icons row (Discord, GitHub, Instagram, LinkedIn, Twitter)
- **Characters:** Two mascots standing ON TOP of the black bar, overlapping white section
  - Left: footer-darkphoenix.mp4 (plays on hover, debounced)
  - Right: footer-zeonarc.png (swaps to video on hover, debounced)
  - Lock logic: ignores hover jitter, finishes full animation loop before reset
- **Copyright:** "Made with <3 by D4rk-Pho3nix & ZeonArc" in the black strip

---

## Animation Strategy (Heavy GSAP)

### Page Load Timeline
1. Navbar slides down from top (0.4s)
2. Hero title chars stagger in via SplitText (0.6s, char-by-char)
3. Subtitle fades in with handwritten effect (0.3s)
4. Search bar scales up from center (0.3s)
5. Mascot slides in from right with slight bounce (0.5s)

### Scroll Animations (ScrollTrigger)
- Each zig-zag section: text slides in from its side, video fades + scales from opposite side
- Section headings: SplitText word-by-word reveal
- Parallax: Subtle on mascot images (0.1x speed difference)
- Videos: IntersectionObserver + GSAP for play-on-view with lock state

### Footer Animations
- "Buy us a coffee" bounces subtly on scroll-in
- Social icons stagger fade-in
- Characters rise up from below the black bar
- Hover animations with debounce lock

### Accessibility
- `prefers-reduced-motion` media query disables all GSAP animations
- Fallback: all content visible immediately, videos autoplay muted

---

## File Structure

```
docugithub-frontend/
├── public/
│   ├── videos/
│   │   ├── 75-percent.mp4
│   │   ├── what-makes-us-different.mp4
│   │   ├── contextual-code-intelligence.mp4
│   │   ├── asset-generation-with-google-flow.mp4
│   │   ├── testimonials.mp4
│   │   └── footer-darkphoenix.mp4
│   └── images/
│       ├── herosection.png
│       ├── hero-upload-button.png
│       ├── logo.png
│       ├── footer-buy-us-a-coffee.png
│       ├── footer-zeonarc.png
│       ├── footer-discord-icon.png
│       ├── footer-github-icon.png
│       ├── footer-instagram-icon.png
│       ├── footer-linkedin-icon.png
│       └── footer-twitter-icon.png
├── src/
│   └── app/
│       ├── layout.tsx          (Adobe Typekit link, global styles)
│       ├── page.tsx            (Main page composing all sections)
│       ├── globals.css         (Tailwind + font-family vars + custom styles)
│       └── components/
│           ├── Navbar.tsx
│           ├── HeroSection.tsx
│           ├── FeatureSection.tsx    (Reusable zig-zag component)
│           ├── Testimonials.tsx
│           ├── Footer.tsx
│           ├── VideoPlayer.tsx       (Play-on-scroll with lock logic)
│           ├── AnimatedHeading.tsx   (SplitText wrapper)
│           └── HoverVideo.tsx        (Hover-to-play with debounce lock)
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Implementation Phases & Sub-Agent Assignments

### Phase 0: Research (research-subagent)
**MCP tools:** context7, tavily-remote-mcp

- Fetch latest Next.js 14+ App Router docs via context7
- Fetch GSAP ScrollTrigger + SplitText integration patterns
- Fetch Tailwind CSS v4 configuration patterns
- Research GSAP + Next.js SSR compatibility (useGSAP hook)
- Output: Best practices summary for implementation

### Phase 1: Scaffolding (frontend-animation-specialist)
**MCP tools:** filesystem, github

1. Initialize Next.js 14+ project with App Router + Tailwind CSS
2. Install dependencies: `gsap` (with ScrollTrigger, SplitText plugins)
3. Configure Tailwind with custom design tokens (colors, fonts)
4. Set up Adobe Typekit in `layout.tsx`
5. Copy all assets from `Website Assets/` to `public/videos/` and `public/images/`
6. Initialize git repo
7. Create GitHub repository via github MCP

### Phase 2: Component Architecture (frontend-animation-specialist)
**MCP tools:** filesystem, serena

Build components section by section, top to bottom:

**Step 2a: Navbar**
- Sticky white bar with thick black bottom border
- Retro URL bar graphic (CSS-drawn or image)
- Nav links in Kanit Medium
- GSAP: slide-down on page load

**Step 2b: Hero Section**
- 50/50 grid layout
- Title in Nitti Mostro Comic 100px
- Subtitle in Segoe Print
- Pill-shaped search bar with upload button (triggers `<input type="file">`)
- Mascot image with Next.js `<Image>`
- GSAP: SplitText on title, staggered entrance timeline

**Step 2c: Zig-Zag Feature Sections**
- Reusable `FeatureSection` component accepting: heading parts, video src, layout direction, background color
- `VideoPlayer` component: IntersectionObserver triggers play, lock state prevents replay
- GSAP ScrollTrigger: slide-in from sides, heading SplitText reveal
- 4 instances with alternating config

**Step 2d: Testimonials**
- Heading with mixed fonts
- Looping testimonials.mp4 video
- Organization names as text overlay or within video

**Step 2e: Footer**
- White-to-black gradient layout
- "Buy us a coffee" centered button image
- Social icons row with stagger animation
- `HoverVideo` component for character animations with debounce lock
- Characters positioned overlapping the black/white boundary
- Copyright text in black strip

### Phase 3: Animation Polish (frontend-animation-specialist)
**MCP tools:** chrome-devtools, playwright

- Master GSAP timeline orchestration for page load
- ScrollTrigger calibration for each section
- `prefers-reduced-motion` fallback
- 60fps performance optimization
- Cross-browser testing via playwright MCP

### Phase 4: Security Audit (security-specialist)
**MCP tools:** serena, github

- File upload input sanitization (hero upload button)
- CSP headers for Adobe Typekit
- Image/video asset optimization check
- Dependency vulnerability scan

### Phase 5: Deployment (deployment-specialist)
**MCP tools:** vercel, github

- Configure `next.config.ts` for static export or Vercel optimization
- Deploy to Vercel via vercel MCP
- Verify deployment with playwright visual tests
- Performance audit (Lighthouse)

### Phase 6: Closing (closing-subagent)
**MCP tools:** github

- Final git commit and push
- Create PR if on feature branch
- Clean up `.claude-temp/`
- Update TASKS.md with all items checked

---

## MCP Tool Usage Map

| Phase            | MCP Tools                         |
| ---------------- | --------------------------------- |
| Research         | context7, tavily-remote-mcp       |
| Scaffolding      | filesystem, github                |
| Components       | filesystem, serena                |
| Animation Polish | chrome-devtools, playwright       |
| Security         | serena, github                    |
| Deployment       | vercel, github, playwright        |
| Closing          | github                            |
| Throughout       | memory (store patterns/decisions) |

---

## Verification Plan

1. **Visual:** Compare each section against `docugithub-high-fidelity.png` using chrome-devtools screenshots
2. **Animations:** Verify all GSAP timelines fire correctly via playwright scroll simulation
3. **Video logic:** Test play-on-scroll lock behavior (scroll down → plays, scroll up → scroll down → stays locked)
4. **Hover logic:** Test footer character hover debounce (rapid hover on/off should not restart animation)
5. **Upload:** Verify file dialog opens on upload button click
6. **Responsive:** Desktop renders pixel-perfect; mobile gracefully degrades
7. **Accessibility:** Test with `prefers-reduced-motion: reduce` — all content visible, no animations
8. **Performance:** Lighthouse score > 90 on performance (video lazy loading, image optimization)
9. **Deployment:** Live Vercel URL loads correctly with all assets
