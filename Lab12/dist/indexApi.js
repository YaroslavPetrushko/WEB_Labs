import { fetchPosts } from './postsApi.js';
const postsContainer = document.querySelector('#posts');
const statusElement = document.querySelector('#status');
const reloadButton = document.querySelector('#reload-posts');
const searchButton = document.querySelector('#search-posts');
const filterInput = document.querySelector('#filter-input');
// Стан 
let state = { status: 'idle' };
let allPosts = []; // Зберігаємо всі пости (відомості про ігри) для фільтрації
//Фільтрує ігри за назвою
function filterPosts(posts, searchTerm) {
    if (!searchTerm.trim()) {
        return posts;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return posts.filter(post => post.title.toLowerCase().includes(lowerSearch));
}
// Рендерить поточний стан на сторінці
function renderState() {
    if (!statusElement || !postsContainer)
        return;
    statusElement.textContent = '';
    postsContainer.innerHTML = '';
    if (state.status === 'idle') {
        statusElement.textContent = 'Натисніть «Оновити список», щоб повторно завантажити дані.';
        statusElement.className = 'status-idle';
    }
    if (state.status === 'loading') {
        statusElement.textContent = 'Завантаження відомостей…';
        statusElement.className = 'status-loading';
        // Додаємо індикатор завантаження
        const loader = document.createElement('div');
        loader.className = 'loader';
        postsContainer.appendChild(loader);
    }
    if (state.status === 'error') {
        statusElement.textContent = state.message;
        statusElement.className = 'status-error';
    }
    if (state.status === 'success') {
        // Застосовуємо фільтр, якщо є поле для фільтрації
        const filterValue = filterInput?.value || '';
        const filteredPosts = filterPosts(state.data, filterValue);
        if (filteredPosts.length === 0) {
            statusElement.textContent = filterValue
                ? 'Нічого не знайдено за вашим запитом.'
                : 'Немає даних для відображення.';
            statusElement.className = 'status-empty';
            return;
        }
        statusElement.textContent = `Показано ${filteredPosts.length} ігор${state.data.length !== filteredPosts.length ? ` (з ${state.data.length})` : ''}:`;
        statusElement.className = 'status-success';
        // Створюємо картки ігор
        filteredPosts.forEach((post) => {
            const article = document.createElement('article');
            article.className = 'post';
            // Додаємо зображення, якщо є
            if (post.image) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'post-image-container';
                const img = document.createElement('img');
                img.src = post.image;
                img.alt = post.title;
                img.className = 'post-image';
                img.loading = 'lazy';
                imageContainer.appendChild(img);
                article.appendChild(imageContainer);
            }
            const contentDiv = document.createElement('div');
            contentDiv.className = 'post-content';
            const title = document.createElement('h3');
            title.className = 'post-title';
            title.textContent = post.title;
            const body = document.createElement('p');
            body.className = 'post-body';
            // Обмежуємо довжину опису
            const maxLength = 150;
            body.textContent = post.body.length > maxLength
                ? post.body.slice(0, maxLength) + '…'
                : post.body;
            const metaDiv = document.createElement('div');
            metaDiv.className = 'post-meta';
            // Додаємо інформацію про жанр та рік
            if (post.genre || post.year) {
                const genreYear = document.createElement('small');
                genreYear.className = 'post-genre-year';
                genreYear.textContent = [post.genre, post.year].filter(Boolean).join(' • ');
                metaDiv.appendChild(genreYear);
            }
            // Додаємо рейтинг, якщо є
            if (post.rating) {
                const ratingSpan = document.createElement('small');
                ratingSpan.className = 'post-rating';
                const percentage = (post.rating.mean * 100).toFixed(0);
                ratingSpan.textContent = `⭐ ${percentage}% (${post.rating.count.toLocaleString()} оцінок)`;
                metaDiv.appendChild(ratingSpan);
            }
            contentDiv.appendChild(title);
            contentDiv.appendChild(body);
            contentDiv.appendChild(metaDiv);
            article.appendChild(contentDiv);
            postsContainer.appendChild(article);
        });
    }
}
//Завантажує пости (відомості про ігри) з API
async function loadPosts() {
    state = { status: 'loading' };
    renderState();
    try {
        // Використовуємо GameBrain API 
        const posts = await fetchPosts('medieval strategy games', 10);
        // JSONPlaceholder для тестування без API ключа
        //const posts = await fetchPostsPlaceholder(10);
        allPosts = posts;
        state = { status: 'success', data: posts };
    }
    catch (error) {
        state = {
            status: 'error',
            message: 'Не вдалося завантажити відомості про ігри. Спробуйте пізніше.',
        };
        console.error('Помилка завантаження:', error);
    }
    renderState();
}
async function searchPosts() {
    state = { status: 'loading' };
    renderState();
    try {
        // Використовуємо GameBrain API 
        const posts = await fetchPosts(filterInput?.value || '', 10);
        // JSONPlaceholder для тестування без API ключа
        //const posts = await fetchPostsPlaceholder(10);
        allPosts = posts;
        state = { status: 'success', data: posts };
    }
    catch (error) {
        state = {
            status: 'error',
            message: 'Не вдалося завантажити відомості про ігри. Спробуйте пізніше.',
        };
        console.error('Помилка завантаження:', error);
    }
    renderState();
}
//Обробник фільтрації
function handleFilter() {
    if (state.status === 'success') {
        renderState();
    }
}
// Ініціалізація подій
reloadButton?.addEventListener('click', () => {
    void loadPosts();
});
// Додаємо обробник фільтрації, якщо є поле вводу
filterInput?.addEventListener('input', handleFilter);
searchButton?.addEventListener('click', () => {
    void searchPosts();
});
// Автоматично завантажуємо відомості при завантаженні сторінки
void loadPosts();
//# sourceMappingURL=indexApi.js.map