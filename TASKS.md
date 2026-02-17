# Implementation Tasks: Remove TechMarquee & Optimize Video Components

## Progress Overview
**Current Phase:** Research & Planning
**Overall Progress:** 9% (1/11 phases complete)

---

## Phase 1: Research & Best Practices
**Assigned to:** research-subagent
**Status:** ✅ Complete (2026-02-16)

- [x] Query context7 for GSAP + prefers-reduced-motion patterns (used Tavily - Context7 unavailable)
- [x] Query context7 for React video lazy loading best practices (used Tavily - Context7 unavailable)
- [x] Research via tavily: "video lazy loading IntersectionObserver React 2025"
- [x] Research via tavily: "WCAG 2.1 AA video accessibility requirements"
- [x] Generate research document: `.claude-temp/video-optimization-research.md`

**Research Summary:**
- 25+ sources reviewed (GSAP docs, WCAG guidelines, React experts)
- Complete hook implementations provided (useReducedMotion, useVideoLazyLoad)
- WCAG 2.1 AA compliance checklist created
- Performance optimization patterns documented
- TypeScript types and React 19 patterns included
- See: `.claude-temp/research-complete.md` for full summary

---

## Phase 2: TDD Setup
**Assigned to:** frontend-specialist
**Status:** Pending

- [ ] Install testing dependencies (@testing-library/react, jest, @testing-library/jest-dom, etc.)
- [ ] Create test file: `client/src/components/__tests__/WhatMakesUsDifferent.test.tsx`
- [ ] Create test file: `client/src/components/__tests__/Features.test.tsx`
- [ ] Run tests (should fail - RED phase)
- [ ] Verify npm test command works

---

## Phase 3: TechMarquee Removal
**Assigned to:** frontend-specialist
**Status:** Pending

- [ ] Verify TechMarquee has no references (use serena MCP)
- [ ] Delete `client/src/components/TechMarquee.tsx`
- [ ] Verify build succeeds with `npm run build`

---

## Phase 4: Create Reusable Hooks & Components
**Assigned to:** frontend-specialist
**Status:** Pending

- [ ] Create `client/src/hooks/useReducedMotion.ts`
- [ ] Create `client/src/hooks/useVideoLazyLoad.ts`
- [ ] Create `client/src/components/OptimizedVideo.tsx`
- [ ] Verify TypeScript compilation (no `any` types)

---

## Phase 5: Optimize WhatMakesUsDifferent.tsx
**Assigned to:** frontend-specialist
**Status:** Pending

- [ ] Add useReducedMotion hook import
- [ ] Add OptimizedVideo component import
- [ ] Conditionally apply GSAP based on reducedMotion state
- [ ] Replace video element with OptimizedVideo component
- [ ] Add proper TypeScript types for refs
- [ ] Verify component renders correctly

---

## Phase 6: Optimize Features.tsx
**Assigned to:** frontend-specialist
**Status:** Pending

- [ ] Add useReducedMotion hook import
- [ ] Add OptimizedVideo component import
- [ ] Conditionally apply all GSAP animations
- [ ] Replace all 3 video elements with OptimizedVideo
- [ ] Add proper TypeScript types for refs
- [ ] Verify all features render correctly

---

## Phase 7: Run Tests (GREEN Phase)
**Assigned to:** frontend-specialist
**Status:** Pending

- [ ] Run `npm test`
- [ ] Verify all tests pass
- [ ] Fix any failing tests
- [ ] Achieve 100% test coverage for video components

---

## Phase 8: Security Audit
**Assigned to:** security-specialist
**Status:** Pending

- [ ] Verify video source paths (no XSS vulnerabilities)
- [ ] Check CSP headers compatibility
- [ ] Scan dependencies for vulnerabilities
- [ ] Review GSAP usage for memory leaks
- [ ] Verify proper cleanup in useEffect hooks
- [ ] Generate security audit report

---

## Phase 9: Performance Profiling
**Assigned to:** deployment-specialist
**Status:** Pending

- [ ] Start dev server
- [ ] Use chrome-devtools MCP to profile page
- [ ] Verify LCP < 2.5s
- [ ] Verify FID < 100ms
- [ ] Verify CLS < 0.1
- [ ] Confirm video lazy loading works
- [ ] Verify GSAP animations at 60fps

---

## Phase 10: E2E Testing
**Assigned to:** deployment-specialist
**Status:** Pending

- [ ] Test video playback with playwright
- [ ] Test scroll trigger animations
- [ ] Test reduced motion preference
- [ ] Verify all videos load correctly
- [ ] Generate E2E test report

---

## Phase 11: Lighthouse Audit
**Assigned to:** deployment-specialist
**Status:** Pending

- [ ] Run production build
- [ ] Execute Lighthouse audit
- [ ] Verify Performance score > 90
- [ ] Verify Accessibility score = 100
- [ ] Verify Best Practices score = 100
- [ ] Verify SEO score > 90

---

## Final Verification Checklist

### Functionality
- [ ] TechMarquee completely removed, no broken references
- [ ] All 4 videos load and play correctly
- [ ] Videos lazy load (don't load until near viewport)
- [ ] GSAP scroll animations trigger correctly
- [ ] Stat counter animation works

### Accessibility
- [ ] `prefers-reduced-motion` disables all GSAP animations
- [ ] Videos still play with reduced motion enabled
- [ ] All videos have ARIA labels
- [ ] Keyboard navigation works
- [ ] WCAG 2.1 AA compliance verified

### Performance
- [ ] Videos lazy load with IntersectionObserver
- [ ] Initial page load < 2.5s LCP
- [ ] GSAP animations at 60fps
- [ ] No memory leaks in GSAP cleanup
- [ ] Lighthouse performance score > 90

### Testing
- [ ] All unit tests pass
- [ ] E2E tests pass (playwright)
- [ ] Security audit clean (no vulnerabilities)

### TypeScript
- [ ] No `any` types
- [ ] Proper ref types
- [ ] Interface definitions for all props/config
- [ ] `npm run build` succeeds with no errors

### Code Quality
- [ ] Functions < 50 lines
- [ ] Self-documenting code (no comments needed)
- [ ] Immutable data patterns
- [ ] Pure functions where possible
- [ ] Reusable hooks extracted

---

## Notes
- Using TDD approach (RED → GREEN → REFACTOR)
- All code changes must have tests FIRST
- Security audit at each stage completion
- Performance verification before final deployment
