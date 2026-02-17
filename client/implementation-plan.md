# Custom Cursor Implementation Plan

## Goal Description
Implement a custom cursor system using the provided Bibata Modern Ice cursors. The main pointer will use [Pointer.cur](file:///d:/Dark%20Phoenix/Visual%20Code/docufront/DocuFrontend/client/Bibata-Modern-Ice-Regular-Windows/Pointer.cur). Other standard cursors (text, help, etc.) will be mapped to their respective custom files. Additionally, verify and implement a black background with white text for selection highlighting.

## User Review Required
> [!IMPORTANT]
> I will be moving the `Bibata-Modern-Ice-Regular-Windows` directory to the `public` folder to ensure the cursor files are accessible by the browser.

## Proposed Changes

### `client` (Root)
#### [MOVE] `Bibata-Modern-Ice-Regular-Windows` -> `public/Bibata-Modern-Ice-Regular-Windows`

### [src/app/globals.css](file:///d:/Dark%20Phoenix/Visual%20Code/docufront/DocuFrontend/client/src/app/globals.css)
#### [MODIFY] [globals.css](file:///d:/Dark%20Phoenix/Visual%20Code/docufront/DocuFrontend/client/src/app/globals.css)
- Add global `*` selector (or update `body`) to set `cursor: url('/Bibata-Modern-Ice-Regular-Windows/Pointer.cur'), auto;`.
- Add specific cursor mappings:
    - `button`, `a`, `.pointer`: `url('/Bibata-Modern-Ice-Regular-Windows/Link.cur'), pointer`
    - `input[type="text"]`, `textarea`, `.text`: `url('/Bibata-Modern-Ice-Regular-Windows/Text.cur'), text`
    - `.move`: `url('/Bibata-Modern-Ice-Regular-Windows/Move.cur'), move`
    - `.help`: `url('/Bibata-Modern-Ice-Regular-Windows/Help.cur'), help`
    - `.wait`: `url('/Bibata-Modern-Ice-Regular-Windows/Busy.ani'), wait`
    - And other relevant mappings based on available files.
- Add `::selection` styles:
    - `background-color: black;`
    - `color: white;`

## Verification Plan

### Automated Tests
- None. Visual changes are best verified manually.

### Manual Verification
- Open the application in the browser.
- Verify the default cursor is the custom "Pointer".
- Hover over links and buttons to verify the cursor changes to the custom "Link" cursor.
- Hover over text inputs to verify the custom "Text" cursor.
- Select text on the page to verify the black background and white text.

