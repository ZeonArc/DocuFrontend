# Handoff to Research-Subagent

## Mission
Research best practices for video optimization, GSAP accessibility, and WCAG compliance for the DocuGitHub landing page video components.

## Tasks
- [ ] Query context7 MCP for GSAP + prefers-reduced-motion integration patterns
- [ ] Query context7 MCP for React video lazy loading best practices (IntersectionObserver)
- [ ] Research via tavily-remote-mcp: "video lazy loading IntersectionObserver React 2025"
- [ ] Research via tavily-remote-mcp: "WCAG 2.1 AA video accessibility requirements autoplay muted"
- [ ] Synthesize findings into comprehensive guide

## Technical Context
- **Stack:** Next.js 16, React 19, TypeScript, GSAP 3.14, Tailwind CSS 4
- **Current Implementation:**
  - WhatMakesUsDifferent.tsx has 1 video with GSAP scroll animations
  - Features.tsx has 3 videos with GSAP scroll triggers
  - All videos autoplay, loop, muted
- **Target:**
  - Add `prefers-reduced-motion` support
  - Implement lazy loading with IntersectionObserver
  - Ensure WCAG 2.1 AA compliance
  - Create reusable hooks (useReducedMotion, useVideoLazyLoad)

## Research Focus Areas

### 1. GSAP + Reduced Motion
- How to conditionally disable GSAP animations when `prefers-reduced-motion: reduce`
- Best patterns for React hooks with GSAP context cleanup
- Performance considerations

### 2. Video Lazy Loading
- IntersectionObserver API best practices for video elements
- Optimal threshold and rootMargin values
- React hook patterns for lazy loading
- Performance impact measurements

### 3. WCAG 2.1 AA Video Accessibility
- Requirements for autoplay muted videos
- ARIA label best practices for decorative videos
- Keyboard navigation requirements (if any)
- Contrast and motion sickness considerations

### 4. React/Next.js Patterns
- Client-side only hooks ("use client" directive)
- useEffect cleanup patterns
- TypeScript types for video refs and IntersectionObserver

## Acceptance Criteria
- [ ] All 4 research queries completed successfully
- [ ] Findings synthesized into actionable patterns
- [ ] Code examples provided where applicable
- [ ] Output saved to: `.claude-temp/video-optimization-research.md`

## Output Format
Create a markdown file with these sections:
1. **Executive Summary** (key findings in 3-5 bullet points)
2. **GSAP + Reduced Motion Patterns** (code examples)
3. **Video Lazy Loading Implementation** (code examples)
4. **WCAG 2.1 AA Compliance Checklist**
5. **Recommended Hooks Architecture**
6. **Performance Best Practices**
7. **References** (links to documentation)

## MCP Tools to Use
- `context7/query-docs` for library-specific documentation
- `tavily-remote-mcp/tavily_search` for web research
- `filesystem/write_file` to save research document

## On Completion
1. Save research to `.claude-temp/video-optimization-research.md`
2. Update TASKS.md Phase 1 tasks to ✅
3. Create completion file: `.claude-temp/research-complete.md` with summary
