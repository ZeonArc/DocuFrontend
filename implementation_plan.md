Detailed UI Refinements Implementation Plan
Goal Description
Refine the Hero section's URL bar, text content, and branding to align with the provided design specifications. Specifically, ensure the input box is seamless and transparent, update placeholder and description text colors to black, and correct the capitalization of "DocuGitHub".

User Review Required
IMPORTANT

The changes affect the visual appearance of the Hero section and Header.

URL Bar: Input will become transparent within its container, with stronger black placeholder text. This assumes the parent container styling provides the visual boundary.
Branding: "DOCUGITHUB" (all caps) will be changed to "DocuGitHub" (PascalCase). This applies to both the large Hero title and the Header logo text.
Description: "Your one stop solution to readmes" will be shortened to "readme" and colored black.
Proposed Changes
client/src/components
[MODIFY] 
Hero.tsx
URL Bar Input:
Add bg-transparent class to ensure no background color interferes with the container.
Change placeholder:text-muted-foreground/50 to placeholder:text-black for high contrast.
Ensure border-none and shadow-none are preserved for the seamless look.
Main Title (H1):
Locate the projected text "DOCUGITHUB".
Update content to "DocuGitHub".
Description (p):
Locate the text "Your one stop solution to readmes".
Update content to "readme".
Change text-muted-foreground to text-black.
[MODIFY] 
Header.tsx
Brand Text:
Locate "DOCUGITHUB".
Update content to "DocuGitHub".
### Verification Plan
- [x] **HERO_CONFIG Implementation**: Code compiles and variables are accessible.
- [x] **Offsets**: Verified text and button elements use the config values.
- [x] **Input Color**: Verified `#D4D4D4` is set in config.

### Manual Verification
-   **Visual Inspection**:
    1.  **URL Bar**: Confirm the input box has no visible border or background of its own and blends seamlessly. Check that "URL goes here..." is solid black.
    2.  **Hero Title**: Confirm the large text reads "DocuGitHub".
    3.  **Hero Description**: Confirm the text below the title is simply "readme" and is solid black.
    4.  **Header**: Confirm the small logo text in the header reads "DocuGitHub".