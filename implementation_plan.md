Implementation Plan: Revamp Features & Marquee
Goal Description
Marquee: Implement a seamless infinite scrolling marquee with tech logos (grayscale to color on hover).
Video Integration: Replace static images/animations in "What Makes Us Different" and "Features" sections with specific video assets. Ensure alternating layouts, white backgrounds for videos, no borders between content and video, and "fit" aspect ratio.
User Preferences & Requirements
Marquee: Logo content, Grayscale â†’ Color (Hover), Pause on Hover, Medium Speed.
Videos:
Alternating sides (White side).
No borders separating video from content.
Embedded as object-fit: contain.
Mappings:
WhatMakesUsDifferent
 â†’ 
what-makes-us-different.mp4
Features
 (75%) â†’ 75%.mp4
Features
 (Contextual Code) â†’ 
contextual-code-intelligence.mp4
Features
 (Asset Generation) â†’ 
asset-generation-with-google-flow.mp4
Proposed Changes
1. Asset Management
[NEW] Public Assets
Create directory: client/public/videos/
Move/Copy the following files from Website Assets/ to client/public/videos/:
what-makes-us-different.mp4
75%.mp4
contextual-code-intelligence.mp4
asset-generation-with-google-flow.mp4
2. [Component] TechMarquee.tsx
[MODIFY] 
TechMarquee.tsx
Implementation: GSAP infinite loop (xPercent).
Content: Tech Icons (React, Next, Tailwind, etc.).
Style: Flex row, gap-16+, grayscale by default.
Hover: Remove grayscale, pause animation.
3. [Component] WhatMakesUsDifferent.tsx
[MODIFY] 
WhatMakesUsDifferent.tsx
Layout:
Left: Text Content (Grey background #e0e0e0).
Right: Video (White background bg-white).
Changes:
Remove canvas animation logic.
Remove border-r-2 from the Left container to remove the separator.
Set Right container background to white.
Insert <video src="/videos/what-makes-us-different.mp4" ... /> in the Right container.
Video Style: w-full h-full object-contain.
4. [Component] Features.tsx
[MODIFY] 
Features.tsx
Section 1 (75%):
Left: Video (75%.mp4) on White background.
Right: Text on Grey background.
Action: Replace generic Image with <video>. Remove border-r-2 from Left container.
Section 2 (Contextual Code Intelligence):
Left: Text on Grey background.
Right: Video (
contextual-code-intelligence.mp4
) on White background.
Action: Replace Wizard Image with <video>. Remove border-r-2 from Left container.
Section 3 (Asset Generation):
Left: Video (
asset-generation-with-google-flow.mp4
) on White background.
Right: Text on Grey background.
Action: Replace Lab Image with <video>. Remove border-r-2 from Left container.
General:
Ensure all video containers have bg-white.
Ensure all videos have object-contain.
Remove explicit borders between the flex columns.
Verification Plan
Marquee: Check infinite scroll, hover pause, color change.
Videos:
Verify all 4 videos play automatically (autoplay, muted, loop).
Verify "Fit" ratio (no cropping).
Verify no vertical borders between text and video.
Verify alternating layout (Right -> Left -> Right -> Left video placement relative to scroll/page order).