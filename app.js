// News API Configuration
// Using NewsAPI.org - Get your free API key at https://newsapi.org
const NEWS_API_KEY = 'demo'; // Replace with your API key
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// App State
let currentArticleIndex = 0;
let articles = [];

// DOM Elements
const scrollContainer = document.getElementById('scroll-container');
const loading = document.getElementById('loading');
const currentIndexEl = document.getElementById('current-index');
const totalArticlesEl = document.getElementById('total-articles');
const swipeHint = document.querySelector('.swipe-hint');

// Fetch news articles
async function fetchNews() {
    try {
        // For demo purposes, using sample data since API key is required
        // In production, uncomment the API call below

        /*
        const response = await fetch(`${NEWS_API_URL}?country=us&pageSize=20&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();

        if (data.status === 'ok') {
            articles = data.articles.filter(article => article.title && article.description);
        }
        */

        // Sample news data for demo
        articles = [
            {
                source: { name: "TechCrunch" },
                title: "AI Revolution Transforms Software Development",
                description: "Artificial intelligence is reshaping how developers write code, with new tools promising to boost productivity by up to 50%. Industry leaders discuss the implications for the future of software engineering.",
                url: "https://techcrunch.com",
                urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T10:30:00Z",
                author: "Sarah Johnson"
            },
            {
                source: { name: "The Verge" },
                title: "Electric Vehicles Hit New Milestone in Global Sales",
                description: "EV adoption reaches unprecedented levels as manufacturers roll out more affordable models. Analysts predict electric vehicles will dominate the market within the next decade.",
                url: "https://theverge.com",
                urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T09:15:00Z",
                author: "Michael Chen"
            },
            {
                source: { name: "BBC News" },
                title: "Scientists Discover Breakthrough in Renewable Energy",
                description: "Researchers unveil a new solar panel technology that could triple efficiency rates. The innovation promises to make solar energy more accessible and affordable worldwide.",
                url: "https://bbc.com",
                urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T08:00:00Z",
                author: "Emma Williams"
            },
            {
                source: { name: "Reuters" },
                title: "Global Markets Rally on Economic Recovery Signs",
                description: "Stock markets worldwide experience significant gains as economic indicators point to robust recovery. Investors show renewed confidence in growth prospects.",
                url: "https://reuters.com",
                urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T07:45:00Z",
                author: "David Martinez"
            },
            {
                source: { name: "Wired" },
                title: "Quantum Computing Makes Major Leap Forward",
                description: "Tech giants announce breakthrough in quantum computing stability, bringing practical applications closer to reality. The advancement could revolutionize cryptography and drug discovery.",
                url: "https://wired.com",
                urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T06:30:00Z",
                author: "Lisa Anderson"
            },
            {
                source: { name: "The Guardian" },
                title: "Climate Action Summit Yields Historic Agreement",
                description: "World leaders commit to ambitious carbon reduction targets in landmark environmental accord. Environmental groups cautiously optimistic about implementation.",
                url: "https://theguardian.com",
                urlToImage: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T05:15:00Z",
                author: "James Thompson"
            },
            {
                source: { name: "Forbes" },
                title: "Startups Reshape Healthcare with AI Diagnostics",
                description: "Innovative companies leverage artificial intelligence to improve disease detection accuracy. Medical professionals embrace technology while maintaining human oversight.",
                url: "https://forbes.com",
                urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T04:00:00Z",
                author: "Rachel Kim"
            },
            {
                source: { name: "NPR" },
                title: "Education Technology Transforms Remote Learning",
                description: "New platforms make online education more engaging and effective. Students and teachers adapt to hybrid learning models with promising results.",
                url: "https://npr.org",
                urlToImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T03:45:00Z",
                author: "Tom Bradley"
            },
            {
                source: { name: "CNBC" },
                title: "Cryptocurrency Regulation Takes Shape Globally",
                description: "Governments worldwide implement frameworks for digital asset oversight. Industry participants seek clarity while maintaining innovation.",
                url: "https://cnbc.com",
                urlToImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T02:30:00Z",
                author: "Jennifer Lopez"
            },
            {
                source: { name: "National Geographic" },
                title: "New Species Discovered in Deep Ocean Expedition",
                description: "Marine biologists uncover dozens of previously unknown creatures in unexplored ocean depths. Findings highlight importance of ocean conservation.",
                url: "https://nationalgeographic.com",
                urlToImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
                publishedAt: "2024-01-15T01:15:00Z",
                author: "Dr. Patricia Moore"
            }
        ];

        renderArticles();
        updateScrollIndicator();
        hideLoading();

        // Hide swipe hint after 5 seconds
        setTimeout(() => {
            swipeHint.classList.add('hidden');
        }, 5000);

    } catch (error) {
        console.error('Error fetching news:', error);
        hideLoading();
        showError();
    }
}

// Render articles to DOM
function renderArticles() {
    scrollContainer.innerHTML = '';

    articles.forEach((article, index) => {
        const articleCard = createArticleCard(article, index);
        scrollContainer.appendChild(articleCard);
    });

    totalArticlesEl.textContent = articles.length;
}

// Create article card element
function createArticleCard(article, index) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.dataset.index = index;

    const formattedDate = formatDate(article.publishedAt);
    const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop';

    card.innerHTML = `
        <div class="article-background" style="background-image: url('${imageUrl}')"></div>
        <div class="article-content">
            <div class="article-source">${article.source.name}</div>
            <h1 class="article-title">${article.title}</h1>
            <p class="article-description">${article.description || ''}</p>
            <div class="article-meta">
                <span class="article-author">${article.author || 'Unknown'}</span>
                <span class="article-date">${formattedDate}</span>
            </div>
            <a href="${article.url}" target="_blank" class="read-more-btn">Read Full Story</a>
        </div>
    `;

    return card;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 1) {
        return 'Just now';
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
}

// Update scroll indicator
function updateScrollIndicator() {
    const cards = document.querySelectorAll('.article-card');
    const scrollPosition = scrollContainer.scrollTop;
    const windowHeight = window.innerHeight;

    cards.forEach((card, index) => {
        const cardTop = card.offsetTop;
        const cardBottom = cardTop + card.offsetHeight;
        const middle = scrollPosition + (windowHeight / 2);

        if (middle >= cardTop && middle < cardBottom) {
            currentArticleIndex = index;
            currentIndexEl.textContent = index + 1;
        }
    });
}

// Hide loading indicator
function hideLoading() {
    loading.classList.add('hidden');
}

// Show error message
function showError() {
    scrollContainer.innerHTML = `
        <div class="article-card">
            <div class="article-content" style="justify-content: center; align-items: center; text-align: center;">
                <h1 class="article-title">Oops! Something went wrong</h1>
                <p class="article-description">Unable to load news articles. Please check your internet connection and try again.</p>
                <button onclick="location.reload()" class="read-more-btn">Retry</button>
            </div>
        </div>
    `;
}

// Scroll event listener
scrollContainer.addEventListener('scroll', () => {
    updateScrollIndicator();

    // Load more articles when near bottom
    const scrollPosition = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    if (scrollHeight - scrollPosition - clientHeight < 200) {
        // Could fetch more articles here
        console.log('Near bottom - could load more articles');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        const nextIndex = Math.min(currentArticleIndex + 1, articles.length - 1);
        scrollToArticle(nextIndex);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(currentArticleIndex - 1, 0);
        scrollToArticle(prevIndex);
    }
});

// Scroll to specific article
function scrollToArticle(index) {
    const cards = document.querySelectorAll('.article-card');
    if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth' });
    }
}

// Touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

scrollContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

scrollContainer.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        swipeHint.classList.add('hidden');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});

// To use real news API, replace the API key and uncomment the fetch call in fetchNews()
// Get your free API key at: https://newsapi.org/register
