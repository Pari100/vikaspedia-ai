# 🎙️ Multi-Language TTS Reader with Sync Highlighting

Hey there! Welcome to the **Internal File Reader** project. This is a neat little tool built for an internship task that reads text out loud while highlighting words in real-time. It’s designed to be super simple, accessible, and works entirely in your browser.

## 🌟 What makes this cool?

*   **Real-time Sync**: As the voice speaks, the exact word turns yellow. No more losing your place in a long paragraph!
*   **Indian Language Support**: It's not just for English. You can test it with Hindi, Gujarati, Marathi, Tamil, and Telugu (depending on what voices your browser has installed).
*   **Built with Material UI**: We used Google's MUI library to keep the design clean, professional, and mobile-friendly.
*   **Total Control**: You can play, pause, or stop the speech. There's also a slider to make the voice talk faster or slower.
*   **Zero Backend**: Everything happens on the frontend using the native Web Speech API. No database or server-side logic required!

## 🚀 How to get it running

If you want to play with the code locally, just follow these steps:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the dev server**:
    ```bash
    npm run dev
    ```

3.  **Open your browser**: Head over to `http://localhost:5173/` and start reading!

## 🛠️ How it works (The Dev Secret Sauce)

*   **SpeechSynthesisUtterance**: This is the heart of the app. We use the `onboundary` event to catch exactly when the browser moves from one word to the next.
*   **Custom React Hook**: I built a `useTTS` hook to handle the messy logic of managing voices, rates, and indices so the UI components stay clean.
*   **Responsive Grid**: Using MUI's `Grid` system ensures that the control panel stays accessible whether you're on a massive monitor or a small phone.

## 📱 Browser & Mobile Support

This app works great on modern versions of:
*   ✅ Google Chrome (Best experience)
*   ✅ Microsoft Edge
*   ✅ Safari (macOS & iOS)
*   ✅ Firefox (Note: Some voices might sound different)

**Pro Tip:** If you don't hear a specific language, check your system settings to see if you need to download that language pack!

## 📝 Known Limitations
- Some mobile browsers limit auto-playing audio until the user interacts with the page (Standard security feature).
- Highlighting accuracy can vary slightly depending on the specific voice engine used by the browser.

---
Built with ❤️ for the Vikaspedia Internship Task.
