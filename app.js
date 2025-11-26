// News API Configuration
// Using NewsAPI.org - Get your free API key at https://newsapi.org
const NEWS_API_KEY = '89d978692d8a49ff8dcc80f877deaa9a';
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
        // Fetch live news from NewsAPI
        const response = await fetch(`${NEWS_API_URL}?country=us&pageSize=20&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();

        if (data.status === 'ok') {
            articles = data.articles.filter(article => article.title && article.description);
        }

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
