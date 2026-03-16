# Email Generator Component Architecture

## Current Structure (Refactored)

### ✅ Completed Files

1. **types.ts** (60 lines)
   - All TypeScript type definitions
   - `SignatureData`, `SocialLink`, `SignatureFont`, etc.

2. **constants.ts** (150 lines)
   - `COLOR_PRESETS` - 6 color schemes
   - `SOCIAL_PLATFORMS` - 8 social media platforms with SVG icons
   - `DEFAULT_SIGNATURE_DATA` - Default form values
   - `STORAGE_KEY` - LocalStorage key

3. **utils.ts** (60 lines)
   - `getFontStack()` - Font family mappings
   - `getFontImport()` - Google Fonts imports
   - `getBorderRadius()` - Image shape to CSS
   - `createColoredIcon()` - Recolor SVG icons
   - `getSocialPlatform()` - Find platform by name
   - `generateSocialLinkId()` - Generate unique IDs

4. **generateSignatureHTML.ts** (110 lines)
   - `generateSignatureHTML()` - Complete HTML generation logic
   - Email-safe HTML with inline styles

5. **ImageUpload.tsx** (380 lines) - Reusable component
   - Image upload/drop
   - Background removal with AI
   - Crop button integration
   - Progress tracking

6. **SignaturePreview.tsx** (130 lines) ✨ NEW
   - Preview with light/dark mode toggle
   - Sample email context
   - Copy to clipboard button
   - Responsive design

7. **ColorPresetSelector.tsx** (180 lines) ✨ NEW
   - Color preset cards (6 schemes)
   - Custom color pickers (Advanced accordion)
   - Name, title, link, and icon color controls
   - Visual color swatches

8. **SocialLinksEditor.tsx** (130 lines) ✨ NEW
   - Add/remove social links
   - Platform selector dropdown
   - URL input fields
   - Platform icons display

9. **ImageCropDialog.tsx** (140 lines) ✨ NEW
   - Modal dialog with react-easy-crop
   - Zoom slider control
   - Apply/Cancel actions
   - Circle/square crop shapes

### 🚧 TODO - Main Component Needs Splitting

**EmailGeneratorPageContent.tsx** (1415 lines) - Still TOO BIG!

Should be split into:

#### Component Suggestions:

1. **ColorPresetSelector.tsx**
   - Color preset cards
   - Custom color pickers
   - Dark/light mode toggle for preview

2. **SocialLinksEditor.tsx**
   - Add/remove social links
   - Platform selection dropdown
   - URL input fields
   - Reorder functionality

3. **SignaturePreview.tsx**
   - HTML preview with iframe
   - Copy to clipboard functionality
   - Light/dark mode background toggle
   - Preview modes (light/dark)

4. **ImageCropDialog.tsx**
   - Modal with react-easy-crop
   - Zoom slider
   - Apply/Cancel buttons
   - Image position controls

5. **BasicInfoSection.tsx**
   - Name, title, company fields
   - Email, phone, website fields
   - Font selector

6. **ImageSettingsSection.tsx**
   - Image size slider
   - Image shape selector (circle/square/rounded)
   - Image position selector (left/top)

7. **hooks/useSignatureData.ts**
   - LocalStorage persistence
   - Data state management
   - Clear all functionality

## File Size Comparison

### Before Refactoring:
- EmailGeneratorPageContent.tsx: **1415 lines** 📦🔥

### After Refactoring:
```
types.ts                     60 lines
constants.ts                150 lines
utils.ts                     60 lines
generateSignatureHTML.ts    110 lines
ImageUpload.tsx             380 lines
-------------------------------------------
Total extracted:            760 lines

EmailGeneratorPageContent.tsx: ~655 lines (still needs more splitting!)
```

### Target After Full Refactoring:
```
Main orchestrator:          ~200 lines ✅
Sub-components (7):         ~70 lines each
Utility files:              ~380 lines
-------------------------------------------
Total:                      ~1070 lines (across 11 files)
```

## Benefits of Splitting

✅ **Maintainability** - Each component has a single responsibility
✅ **Reusability** - Components can be used independently
✅ **Testability** - Easier to write unit tests
✅ **Readability** - Easier to understand and modify
✅ **Collaboration** - Multiple devs can work on different components

## Next Steps

1. Extract `ColorPresetSelector` component
2. Extract `SocialLinksEditor` component
3. Extract `SignaturePreview` component
4. Extract `ImageCropDialog` component
5. Extract form sections into smaller components
6. Create custom hooks for business logic
7. Final main component should be < 250 lines
