# FreeScroll - TikTok for News

A TikTok-style vertical scrolling news reader that makes consuming news articles as engaging as scrolling through social media.

## Features

- 📱 **TikTok-Style Scrolling**: Full-screen vertical scrolling with snap-to-section
- 📰 **Real-time News**: Fetches latest news articles from NewsAPI
- 🖼️ **Article Thumbnails**: Eye-catching image previews alongside article info
- 👍 **Like/Dislike System**: Interactive engagement buttons with counters
- 💬 **Discussion Section**: Full-featured commenting system for each article
- 🔗 **Clickable Articles**: Tap thumbnails or titles to read full stories
- 📤 **Share Functionality**: Native share API support
- 💾 **Persistent Data**: All interactions saved in localStorage
- 🎨 **Modern Dark Theme**: Beautiful UI with smooth animations
- 📱 **Mobile Responsive**: Optimized for both desktop and mobile
- ⌨️ **Keyboard Navigation**: Use arrow keys to navigate articles
- 👆 **Touch Gestures**: Swipe up/down on mobile devices

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

- **Desktop**: Use arrow keys (↑/↓) or scroll with mouse wheel
- **Mobile**: Swipe up/down to navigate between articles
- **Read Article**: Click on the thumbnail or title to open the full article
- **Like/Dislike**: Tap the thumbs up/down buttons to react to articles
- **Comment**: Click the comment button to open the discussion section
- **Share**: Use the share button to share articles via native share or clipboard

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
