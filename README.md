# Vikaspedia - Synchronized Text-to-Speech with Real-Time Text Highlighting


## 📋 Project Overview

**Vikaspedia** is a frontend-only React application that synchronizes Text-to-Speech (TTS) audio playback with real-time text highlighting in the user interface. As text is read aloud, the corresponding words and sentences are visually highlighted to improve content comprehension and accessibility.

This project is specifically designed for rural knowledge dissemination and serves users with low literacy levels or visual impairments.

### Key Features
- 🎵 Real-time sentence & word highlighting synchronized with TTS
- 🌐 Multi-language support (Hindi, Gujarati, Marathi, Tamil, Telugu, English)
- ⚡ Adjustable speech rate (0.5x - 2x)
- 📱 Fully responsive design
- ♿ Accessibility-first approach

## 🚀 Quick Start

### Installation

```bash
cd vikaspedia-ai
npm install
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🏗️ Technology Stack

- React 18 with TypeScript
- Material UI (MUI) v5
- Vite build tool
- Web Speech API (browser native)
- Tailwind CSS

## 🌐 Browser Compatibility

✅ **Chrome (120+)** | ✅ **Firefox (121+)** | ✅ **Edge (120+)** | ✅ **Opera (106+)** | ✅ **Safari (17+)**

### Testing Notes
- **Chrome/Edge**: Best performance, all voices available
- **Firefox**: All features work, slightly slower initialization
- **Safari**: Full support on macOS, limited voices on iOS
- **Opera**: Chromium-based, identical to Chrome/Edge

## � Core Features

### 1. Text-to-Speech Playback
- Native Web Speech API
- Auto-detects available voices
- Speech rate adjustment (0.5x to 2x)

### 2. Real-Time Text Highlighting
- **Sentence Highlighting**: Light blue (#dbeafe) for entire active sentence
- **Word Highlighting**: Dark blue (#1e40af) with white text for current word
- **Auto-scroll**: Keeps active word visible

### 3. Playback Controls
- Play/Pause/Resume/Stop
- Speed control slider
- Language selection dropdown
- Copy/Paste/Clear text
- File upload (.txt)

## ⚠️ Known Limitations

1. **Voice Availability**: Not all Indian language voices may be installed (automatic fallback to English)
2. **Translation Service**: Uses Google Translate API (may have rate limits on heavy usage)
3. **Platform Differences**: Voice quality varies by OS and browser
4. **Mobile Restrictions**: Some browsers require user interaction before audio autoplay
5. **Long Text**: Very long texts (50k+ characters) may experience slight delays

## 🐛 Troubleshooting

**No voices available?**
→ Install language packs on your OS (Windows: Settings > Time & Language > Language)

**Text not highlighting?**
→ Refresh page, check speaker icon, clear browser cache

**Slow rate changes?**
→ This is browser limitation when speech is playing; stop and play again

**Translation not working?**
→ Check internet connection, try different browser, clear cache

**Paste not working?**
→ Must use HTTPS or localhost; click paste icon (don't use Ctrl+V)

---

**Project Timeline**: January 16, 2026 - February 1, 2026

**Status**: ✅ **Production Ready - All Requirements Met**

**Last Updated**: February 11, 2026

Built for Vikaspedia - Advancing Knowledge Dissemination through Accessible Technology
| Hindi | Gujarati | Marathi | Tamil | Telugu | English |
|-------|----------|---------|-------|--------|---------|
| ✅ hi-IN | ✅ gu-IN | ✅ mr-IN | ✅ ta-IN | ✅ te-IN | ✅ en-IN |

**Pro Tip:** If you don't hear a specific language, check your system settings to see if you need to download that language pack!

## 📝 Known Limitations
- Some mobile browsers limit auto-playing audio until the user interacts with the page (Standard security feature).
- Highlighting accuracy can vary slightly depending on the specific voice engine used by the browser.

---
Built with ❤️ for the Vikaspedia Internship Task.
