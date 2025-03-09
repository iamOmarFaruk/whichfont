# Which Font? - Chrome Extension

A lightweight and user-friendly Chrome extension that helps you identify fonts used on any webpage with a simple hover interaction. Perfect for designers, developers, and typography enthusiasts.

![Which Font Extension](which-font.png)

## Features

- 🔍 **Instant Font Detection**: Hover over any text to instantly see the font name
- 🎯 **Accurate Detection**: Uses computed styles for precise font identification
- 🚀 **Easy Toggle**: Click extension icon or press ESC to toggle the tool
- 💨 **Zero Configuration**: Works right out of the box
- 🎨 **Clean UI**: Minimal, non-intrusive interface
- ⚡ **Performance Focused**: Lightweight with minimal impact on page load

## Installation

1. Download the extension from Chrome Web Store - https://chromewebstore.google.com/detail/which-font/ahbhidgfakmjlfbbknalkhjalgiidlah
2. Click the extension icon in your browser toolbar to activate
3. Hover over any text to see the font name
4. Press ESC or click the exit button to deactivate

## How It Works

The extension injects a content script that:
1. Creates a tooltip that follows your cursor
2. Detects the font family of elements you hover over
3. Displays the primary font name in a clean, modern tooltip
4. Provides an easy exit button and keyboard shortcut

## Technical Details

- Built with Vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Implements event delegation for performance
- Utilizes computed styles for accurate font detection
- Maintains clean state management

## Development

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Privacy

- No data collection
- No external dependencies
- Works completely offline
- No permissions beyond necessary

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Creator

Developed by Omar Faruk
- Email: omarbg.bd@gmail.com
- LinkedIn: [Omar Faruk](https://www.linkedin.com/in/omar-expert-webdeveloper/)

## License

MIT License - feel free to use and modify for your projects.

---

💡 If you find this extension helpful, please consider giving it a star on GitHub!
