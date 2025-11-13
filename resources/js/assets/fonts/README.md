# Font Files Directory

This directory contains custom fonts for the application.

---

## 📦 Plus Jakarta Sans (Welcome Page Font)

**Status:** ⚠️ NEEDS DOWNLOAD

A modern, professional font with friendly rounded characteristics - perfect for landing pages!

### Required Files
Place these files in this directory:

1. **PlusJakartaSans-Regular.ttf** (Weight: 400)
2. **PlusJakartaSans-Medium.ttf** (Weight: 500)
3. **PlusJakartaSans-SemiBold.ttf** (Weight: 600)
4. **PlusJakartaSans-Bold.ttf** (Weight: 700)
5. **PlusJakartaSans-ExtraBold.ttf** (Weight: 800)

### Download Instructions

**Google Fonts (Recommended):**
1. Visit: https://fonts.google.com/specimen/Plus+Jakarta+Sans
2. Click "Download family" button (top right)
3. Extract the ZIP file
4. Navigate to `static/` folder in the extracted files
5. Copy the required .ttf files to this directory

**GitHub:**
- Repository: https://github.com/tokotype/PlusJakartaSans
- Download the static TTF files directly

### Usage
- Applied to: Welcome page (`resources/js/pages/Welcome.tsx`)
- Tailwind class: `font-jakarta`
- Configured in: `tailwind.config.js` and `resources/css/app.css`

---

## ✅ Albert Sans (Default App Font)

**Status:** ✅ INSTALLED

The default font for the rest of the application.

### Files Already Present
- AlbertSans-Regular.ttf (Weight: 400) ✅
- AlbertSans-SemiBold.ttf (Weight: 600) ✅
- AlbertSans-Bold.ttf (Weight: 700) ✅

### Usage
- Applied to: Entire application (default)
- Tailwind class: `font-sans`
- Google Fonts: https://fonts.google.com/specimen/Albert+Sans

---

## 🔄 After Adding Fonts

Rebuild your assets:
```bash
npm run dev
```

## File Structure

```
resources/js/assets/fonts/
├── AlbertSans-*.ttf (✅ Installed)
├── PlusJakartaSans-*.ttf (⚠️ Need to download)
└── README.md
```
