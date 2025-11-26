// News API Configuration
const NEWS_API_KEY = '89d978692d8a49ff8dcc80f877deaa9a';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// App State
let currentArticleIndex = 0;
let articles = [];
let allArticles = []; // Store all fetched articles
let displayedArticles = []; // Currently displayed articles (filtered)
let likes = {};
let dislikes = {};
let comments = {};
let currentPage = 1;
let isLoadingMore = false;
let currentCategory = '';
let searchQuery = '';

// DOM Elements
const scrollContainer = document.getElementById('scroll-container');
const loading = document.getElementById('loading');
const loadingMore = document.getElementById('loading-more');
const currentIndexEl = document.getElementById('current-index');
const totalArticlesEl = document.getElementById('total-articles');
const swipeHint = document.querySelector('.swipe-hint');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const categorySelect = document.getElementById('category-select');

// Load saved interactions from localStorage
function loadInteractions() {
    try {
        likes = JSON.parse(localStorage.getItem('likes') || '{}');
        dislikes = JSON.parse(localStorage.getItem('dislikes') || '{}');
        comments = JSON.parse(localStorage.getItem('comments') || '{}');
    } catch (e) {
        console.error('Error loading interactions:', e);
        likes = {};
        dislikes = {};
        comments = {};
    }
}

// Save interactions to localStorage
function saveInteractions() {
    try {
        localStorage.setItem('likes', JSON.stringify(likes));
        localStorage.setItem('dislikes', JSON.stringify(dislikes));
        localStorage.setItem('comments', JSON.stringify(comments));
    } catch (e) {
        console.error('Error saving interactions:', e);
    }
}

// Fetch news articles
async function fetchNews(page = 1, append = false) {
    try {
        console.log(`Fetching news... page: ${page}, category: ${currentCategory}`);

        // Build API URL
        let apiUrl = `${NEWS_API_URL}?country=us&pageSize=50&page=${page}&apiKey=${NEWS_API_KEY}`;
        if (currentCategory) {
            apiUrl += `&category=${currentCategory}`;
        }

        // Fetch live news from NewsAPI
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('API Response:', data);

        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            const newArticles = data.articles.filter(article => article.title && article.description);

            if (append) {
                allArticles = [...allArticles, ...newArticles];
            } else {
                allArticles = newArticles;
            }

            console.log('Loaded articles:', newArticles.length);
        } else {
            console.log('Using fallback articles');
            if (!append || allArticles.length === 0) {
                allArticles = getSampleArticles();
            }
        }

        applyFilters();

        if (!append) {
            renderArticles();
        } else {
            appendArticles();
        }

        updateScrollIndicator();
        hideLoading();
        hideLoadingMore();

        // Hide swipe hint after 5 seconds
        if (!append) {
            setTimeout(() => {
                if (swipeHint) swipeHint.classList.add('hidden');
            }, 5000);
        }

    } catch (error) {
        console.error('Error fetching news:', error);
        // Use sample data as fallback
        if (!append || allArticles.length === 0) {
            allArticles = getSampleArticles();
            applyFilters();
            renderArticles();
            updateScrollIndicator();
        }
        hideLoading();
        hideLoadingMore();
    }
}

// Sample articles fallback
function getSampleArticles() {
    return [
        {
            source: { name: "TechCrunch" },
            title: "AI Revolution Transforms Software Development",
            description: "Artificial intelligence is reshaping how developers write code, with new tools promising to boost productivity by up to 50%. Industry leaders discuss the implications.",
            url: "https://techcrunch.com",
            urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
            publishedAt: new Date().toISOString(),
            author: "Sarah Johnson"
        },
        {
            source: { name: "The Verge" },
            title: "Electric Vehicles Hit New Milestone in Global Sales",
            description: "EV adoption reaches unprecedented levels as manufacturers roll out more affordable models. Analysts predict EVs will dominate the market within a decade.",
            url: "https://theverge.com",
            urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            author: "Michael Chen"
        },
        {
            source: { name: "BBC News" },
            title: "Scientists Discover Breakthrough in Renewable Energy",
            description: "Researchers unveil a new solar panel technology that could triple efficiency rates. The innovation promises to make solar energy more accessible worldwide.",
            url: "https://bbc.com",
            urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            author: "Emma Williams"
        },
        {
            source: { name: "Reuters" },
            title: "Global Markets Rally on Economic Recovery Signs",
            description: "Stock markets worldwide experience significant gains as economic indicators point to robust recovery. Investors show renewed confidence in growth prospects.",
            url: "https://reuters.com",
            urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            author: "David Martinez"
        },
        {
            source: { name: "Wired" },
            title: "Quantum Computing Makes Major Leap Forward",
            description: "Tech giants announce breakthrough in quantum computing stability. The advancement could revolutionize cryptography and drug discovery in coming years.",
            url: "https://wired.com",
            urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            author: "Lisa Anderson"
        },
        {
            source: { name: "The Guardian" },
            title: "Climate Action Summit Yields Historic Agreement",
            description: "World leaders commit to ambitious carbon reduction targets in landmark environmental accord. Environmental groups cautiously optimistic about implementation.",
            url: "https://theguardian.com",
            urlToImage: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 18000000).toISOString(),
            author: "James Thompson"
        },
        {
            source: { name: "Forbes" },
            title: "Startups Reshape Healthcare with AI Diagnostics",
            description: "Innovative companies leverage artificial intelligence to improve disease detection accuracy. Medical professionals embrace technology while maintaining human oversight.",
            url: "https://forbes.com",
            urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 21600000).toISOString(),
            author: "Rachel Kim"
        },
        {
            source: { name: "NPR" },
            title: "Education Technology Transforms Remote Learning",
            description: "New platforms make online education more engaging and effective. Students and teachers adapt to hybrid learning models with promising results.",
            url: "https://npr.org",
            urlToImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 25200000).toISOString(),
            author: "Tom Bradley"
        },
        {
            source: { name: "CNBC" },
            title: "Cryptocurrency Regulation Takes Shape Globally",
            description: "Governments worldwide implement frameworks for digital asset oversight. Industry participants seek clarity while maintaining innovation.",
            url: "https://cnbc.com",
            urlToImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 28800000).toISOString(),
            author: "Jennifer Lopez"
        },
        {
            source: { name: "National Geographic" },
            title: "New Species Discovered in Deep Ocean Expedition",
            description: "Marine biologists uncover dozens of previously unknown creatures in unexplored ocean depths. Findings highlight importance of ocean conservation.",
            url: "https://nationalgeographic.com",
            urlToImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
            publishedAt: new Date(Date.now() - 32400000).toISOString(),
            author: "Dr. Patricia Moore"
        }
    ];
}

// Apply search and filters
function applyFilters() {
    let filtered = [...allArticles];

    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(article => {
            return (
                article.title.toLowerCase().includes(query) ||
                (article.description && article.description.toLowerCase().includes(query)) ||
                article.source.name.toLowerCase().includes(query)
            );
        });
    }

    displayedArticles = filtered;
    console.log('Filtered articles:', displayedArticles.length);
}

// Render articles to DOM
function renderArticles() {
    console.log('Rendering articles...');
    scrollContainer.innerHTML = '';

    displayedArticles.forEach((article, index) => {
        const articleCard = createArticleCard(article, index);
        scrollContainer.appendChild(articleCard);
    });

    totalArticlesEl.textContent = displayedArticles.length;
    console.log('Rendered', displayedArticles.length, 'articles');
}

// Append articles for infinite scroll
function appendArticles() {
    console.log('Appending new articles...');

    const startIndex = displayedArticles.length - (allArticles.length - displayedArticles.length);
    const newArticles = displayedArticles.slice(startIndex);

    newArticles.forEach((article, idx) => {
        const index = startIndex + idx;
        const articleCard = createArticleCard(article, index);
        scrollContainer.appendChild(articleCard);
    });

    totalArticlesEl.textContent = displayedArticles.length;
    console.log('Appended articles, total now:', displayedArticles.length);
}

// Create article card element
function createArticleCard(article, index) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.dataset.index = index;
    const articleId = `article-${index}`;

    const formattedDate = formatDate(article.publishedAt);
    const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';

    const likeCount = likes[articleId] || 0;
    const dislikeCount = dislikes[articleId] || 0;
    const articleComments = comments[articleId] || [];

    // Escape quotes for safe HTML
    const safeUrl = article.url.replace(/'/g, "&apos;");
    const safeTitle = article.title.replace(/'/g, "&apos;");

    card.innerHTML = `
        <div class="article-header">
            <div class="article-thumbnail" data-url="${safeUrl}" style="background-image: url('${imageUrl}')">
                <div class="play-overlay">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="article-info">
                <div class="article-source-badge">${article.source.name}</div>
                <h2 class="article-title" data-url="${safeUrl}">${article.title}</h2>
                <p class="article-description">${article.description || ''}</p>
                <div class="article-meta">
                    <span class="article-author">${article.author || 'Unknown'}</span>
                    <span class="article-date">${formattedDate}</span>
                </div>
            </div>
        </div>

        <div class="engagement-section">
            <button class="like-btn ${likeCount > 0 ? 'active' : ''}" data-article-id="${articleId}" data-index="${index}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H16.4262C17.907 22 19.1662 20.9197 19.3914 19.4562L20.4683 12.4562C20.7479 10.6389 19.3418 9 17.5032 9H14V4C14 2.89543 13.1046 2 12 2C11.4477 2 11 2.44772 11 3V3.56075C11 3.93742 10.786 4.28278 10.447 4.44721L7 6.5V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${likeCount}</span>
            </button>
            <button class="dislike-btn ${dislikeCount > 0 ? 'active' : ''}" data-article-id="${articleId}" data-index="${index}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H7.57377C6.09297 2 4.83382 3.08025 4.60862 4.54377L3.53172 11.5438C3.25213 13.3611 4.65823 15 6.49681 15H10V20C10 21.1046 10.8954 22 12 22C12.5523 22 13 21.5523 13 21V20.4392C13 20.0626 13.214 19.7172 13.553 19.5528L17 17.5V2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${dislikeCount}</span>
            </button>
            <button class="comment-btn" data-article-id="${articleId}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${articleComments.length}</span>
            </button>
            <button class="share-btn" data-url="${safeUrl}" data-title="${safeTitle}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12M16 6L12 2M12 2L8 6M12 2V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <div class="discussion-section" id="discussion-${articleId}" style="display: none;">
            <div class="comments-header">
                <h3>Discussion</h3>
                <button class="close-comments" data-article-id="${articleId}">×</button>
            </div>
            <div class="comments-list" id="comments-${articleId}">
                ${renderComments(articleComments)}
            </div>
            <div class="comment-input-section">
                <input type="text" class="comment-input" id="input-${articleId}" placeholder="Add a comment..." />
                <button class="post-comment-btn" data-article-id="${articleId}">Post</button>
            </div>
        </div>
    `;

    // Add event listeners
    addCardEventListeners(card, articleId, index);

    return card;
}

// Add event listeners to card
function addCardEventListeners(card, articleId, index) {
    // Thumbnail click
    const thumbnail = card.querySelector('.article-thumbnail');
    if (thumbnail) {
        thumbnail.addEventListener('click', () => {
            const url = thumbnail.dataset.url;
            if (url) window.open(url, '_blank');
        });
    }

    // Title click
    const title = card.querySelector('.article-title');
    if (title) {
        title.addEventListener('click', () => {
            const url = title.dataset.url;
            if (url) window.open(url, '_blank');
        });
    }

    // Like button
    const likeBtn = card.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            handleLike(articleId, index);
        });
    }

    // Dislike button
    const dislikeBtn = card.querySelector('.dislike-btn');
    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', () => {
            handleDislike(articleId, index);
        });
    }

    // Comment button
    const commentBtn = card.querySelector('.comment-btn');
    if (commentBtn) {
        commentBtn.addEventListener('click', () => {
            toggleComments(articleId);
        });
    }

    // Share button
    const shareBtn = card.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const url = shareBtn.dataset.url;
            const title = shareBtn.dataset.title;
            shareArticle(url, title);
        });
    }

    // Close comments button
    const closeBtn = card.querySelector('.close-comments');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toggleComments(articleId);
        });
    }

    // Post comment button
    const postBtn = card.querySelector('.post-comment-btn');
    if (postBtn) {
        postBtn.addEventListener('click', () => {
            postComment(articleId);
        });
    }

    // Enter key on comment input
    const input = card.querySelector('.comment-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                postComment(articleId);
            }
        });
    }
}

// Render comments
function renderComments(articleComments) {
    if (articleComments.length === 0) {
        return '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    }

    return articleComments.map(comment => `
        <div class="comment">
            <div class="comment-content">
                <div class="comment-text">${escapeHtml(comment.text)}</div>
                <div class="comment-time">${formatDate(comment.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

// Handle like
function handleLike(articleId, index) {
    likes[articleId] = (likes[articleId] || 0) + 1;
    saveInteractions();
    updateEngagement(articleId, index);
}

// Handle dislike
function handleDislike(articleId, index) {
    dislikes[articleId] = (dislikes[articleId] || 0) + 1;
    saveInteractions();
    updateEngagement(articleId, index);
}

// Toggle comments
function toggleComments(articleId) {
    const discussionSection = document.getElementById(`discussion-${articleId}`);
    if (discussionSection) {
        if (discussionSection.style.display === 'none') {
            discussionSection.style.display = 'block';
            discussionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            discussionSection.style.display = 'none';
        }
    }
}

// Post comment
function postComment(articleId) {
    const input = document.getElementById(`input-${articleId}`);
    if (!input) return;

    const commentText = input.value.trim();

    if (commentText) {
        if (!comments[articleId]) {
            comments[articleId] = [];
        }

        comments[articleId].push({
            username: 'User' + Math.floor(Math.random() * 1000),
            text: commentText,
            timestamp: new Date().toISOString()
        });

        saveInteractions();

        // Update comments display
        const commentsList = document.getElementById(`comments-${articleId}`);
        if (commentsList) {
            commentsList.innerHTML = renderComments(comments[articleId]);
        }

        // Update comment count
        const index = parseInt(articleId.split('-')[1]);
        updateEngagement(articleId, index);

        input.value = '';
    }
}

// Update engagement buttons
function updateEngagement(articleId, index) {
    const card = document.querySelector(`[data-index="${index}"]`);
    if (!card) return;

    const likeBtn = card.querySelector('.like-btn span');
    const dislikeBtn = card.querySelector('.dislike-btn span');
    const commentBtn = card.querySelector('.comment-btn span');

    if (likeBtn) likeBtn.textContent = likes[articleId] || 0;
    if (dislikeBtn) dislikeBtn.textContent = dislikes[articleId] || 0;
    if (commentBtn) commentBtn.textContent = (comments[articleId] || []).length;
}

// Share article
function shareArticle(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(() => {});
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            console.log('Could not copy to clipboard');
        });
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
    if (loading) {
        loading.classList.add('hidden');
    }
}

// Show loading more indicator
function showLoadingMore() {
    if (loadingMore) {
        loadingMore.style.display = 'block';
    }
}

// Hide loading more indicator
function hideLoadingMore() {
    if (loadingMore) {
        loadingMore.style.display = 'none';
    }
}

// Handle infinite scroll
function handleInfiniteScroll() {
    if (isLoadingMore) return;

    const scrollPosition = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;

    // Load more when within 2 screens of the bottom
    if (scrollHeight - scrollPosition - clientHeight < clientHeight * 2) {
        console.log('Near bottom - loading more articles');
        isLoadingMore = true;
        showLoadingMore();
        currentPage++;

        fetchNews(currentPage, true).then(() => {
            isLoadingMore = false;
        });
    }
}

// Handle search input
function handleSearch() {
    searchQuery = searchInput.value.trim();

    if (searchQuery) {
        clearSearchBtn.style.display = 'flex';
    } else {
        clearSearchBtn.style.display = 'none';
    }

    applyFilters();
    renderArticles();
    updateScrollIndicator();
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    applyFilters();
    renderArticles();
    updateScrollIndicator();
}

// Handle category change
function handleCategoryChange() {
    currentCategory = categorySelect.value;
    currentPage = 1;
    allArticles = [];
    console.log('Category changed to:', currentCategory || 'All News');
    fetchNews(1, false);
}

// Scroll event listener
if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
        updateScrollIndicator();
        handleInfiniteScroll();
    });
}

// Search input listener
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

// Clear search button listener
if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', clearSearch);
}

// Category select listener
if (categorySelect) {
    categorySelect.addEventListener('change', handleCategoryChange);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Don't interfere if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
    }

    if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        const nextIndex = Math.min(currentArticleIndex + 1, displayedArticles.length - 1);
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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initializing...');
    loadInteractions();
    fetchNews();
});

// Also run immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Still loading, wait for DOMContentLoaded
} else {
    // DOM is ready
    console.log('DOM already loaded, initializing...');
    loadInteractions();
    fetchNews();
}
