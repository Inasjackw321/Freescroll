# FreeScroll - TikTok for News

A beautiful TikTok-style vertical scrolling news reader with a stunning liquid glass UI that makes consuming news articles as engaging as scrolling through social media.

## Features

### Design & UI
- 🌊 **Liquid Glass Design**: Stunning glassmorphism UI with frosted glass effects
- 📱 **9:16 TikTok Ratio**: Perfect vertical phone aspect ratio (450px x 800px)
- 🎨 **Gradient Background**: Beautiful blue/purple gradient backdrop
- ✨ **Smooth Animations**: Buttery smooth transitions and hover effects
- 💎 **Backdrop Blur**: Advanced blur and saturation filters throughout

### Content & Navigation
- 📱 **TikTok-Style Scrolling**: Full-screen vertical scrolling with snap-to-section
- ♾️ **True Infinite Scroll**: Loads 50 articles initially, endless scrolling
- 🔍 **Real-time Search**: Search articles by title, description, or source
- 📂 **Category Filter**: Browse news by category (tech, business, sports, etc.)
- 📰 **Live News**: Fetches latest news articles from NewsAPI
- 🖼️ **Article Thumbnails**: Eye-catching image previews alongside article info

### Interaction
- 👍 **Like/Dislike System**: Glass-styled engagement buttons with counters
- 💬 **Anonymous Discussion**: Clean comment system without usernames
- 🔗 **Clickable Articles**: Tap thumbnails or titles to read full stories
- 📤 **Share Functionality**: Native share API support
- ⌨️ **Keyboard Navigation**: Arrow keys + Space bar to navigate
- 👆 **Touch Gestures**: Swipe up/down on mobile devices
- 💾 **Persistent Data**: All interactions saved in localStorage

## Demo

Visit the live demo: [FreeScroll on GitHub Pages](https://inasjackw321.github.io/Freescroll/)

## Getting Started

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/Inasjackw321/Freescroll.git
   cd Freescroll
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

3. Visit `http://localhost:8000`

### Using with Real News API

The app comes with NewsAPI integration. To use your own API key:

1. Get a free API key from [NewsAPI.org](https://newsapi.org/register)
2. Open `app.js` and replace the API key on line 2:
   ```javascript
   const NEWS_API_KEY = 'your_api_key_here';
   ```
3. The app will automatically fetch live news. If the API fails, it falls back to sample articles

## How to Use

- **Search**: Type in the glass search bar at the top to filter articles in real-time
- **Filter by Category**: Use the dropdown menu to browse specific news categories
- **Navigate**:
  - Desktop: Arrow keys (↑/↓) or **Space bar** to scroll between articles
  - Mouse: Scroll wheel for smooth vertical scrolling
  - Mobile: Swipe up/down to navigate
- **Infinite Scroll**: Just keep scrolling! 50 articles load initially, more load automatically
- **Read Article**: Click on the thumbnail or title to open the full article in a new tab
- **Engage**:
  - **Like/Dislike**: Tap the glass-styled thumbs up/down buttons
  - **Comment**: Click comment button to open anonymous discussion
  - **Share**: Use the share button (native share or clipboard)
- **9:16 Format**: On desktop, the app displays in a perfect vertical phone ratio
- All interactions are saved locally and persist across sessions!

## Customization

### Change News Category

Edit `app.js` to change the news category:
```javascript
const response = await fetch(`${NEWS_API_URL}?country=us&category=technology&pageSize=20&apiKey=${NEWS_API_KEY}`);
```

Available categories: `business`, `entertainment`, `general`, `health`, `science`, `sports`, `technology`

### Modify Styling

Edit `styles.css` to customize:
- Colors and gradients
- Typography
- Layout and spacing
- Animations

## Technologies Used

- HTML5
- CSS3 (Scroll Snap, Flexbox, Gradients)
- Vanilla JavaScript (ES6+)
- NewsAPI.org

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## GitHub Pages Deployment

This site is automatically deployed to GitHub Pages. To deploy your own version:

1. Fork this repository
2. Go to Settings > Pages
3. Select the branch (e.g., `main` or `claude/tiktok-news-scroller-...`)
4. Save and wait for deployment

## License

MIT License - feel free to use this project for your own purposes!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Acknowledgments

- Design inspired by TikTok's engaging vertical scroll interface
- News data provided by [NewsAPI.org](https://newsapi.org)
- Stock images from [Unsplash](https://unsplash.com)
