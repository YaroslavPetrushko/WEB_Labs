import { Article } from './types.js';

// Отримуємо посилання на DOM-елементи
const addBtn = document.getElementById('addPost') as HTMLButtonElement;
const clearBtn = document.getElementById('clearPosts') as HTMLButtonElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const categoryInput = document.getElementById('category') as HTMLInputElement;
const authorInput = document.getElementById('author') as HTMLInputElement;
const contentInput = document.getElementById('content') as HTMLTextAreaElement;
const tagsInput = document.getElementById('tags') as HTMLInputElement;
const imageInput = document.getElementById('image') as HTMLInputElement;
const previewContainer = document.getElementById('preview') as HTMLDivElement;
const articlesListContainer = document.getElementById('articlesList') as HTMLDivElement;
const counterElem = document.getElementById('counter') as HTMLParagraphElement;

// Змінна для зберігання статей
let articles: Article[] = [];

// Завантаження статей з JSON
async function loadArticles(): Promise<void> {
  try {
    const response = await fetch('articles.json');
    if (response.ok) {
      articles = await response.json();
      displayArticlesList();
    }
  } catch (error) {
    console.error('Помилка завантаження статей:', error);
    articles = [];
  }
}

// Функція для оновлення лічильника постів
function updateCounter(): void {
  const count = articles.length;
  counterElem.textContent = `Усього постів: ${count}`;
}

// Функція для очищення всіх постів
function clearPosts(): void {
  clearForm();
  articlesListContainer.innerHTML = '';
  counterElem.textContent = 'Усього постів: 0';
}

// Збереження статей у JSON
async function saveArticles(): Promise<void> {
  //try {
    // Місце для реалізації серверного збереження
  //   const response = await fetch('save-articles.php', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(articles)
  //   });
    
  //   if (response.ok) {
  //     alert('✅ Статтю успішно додано!');
  //     clearForm();
  //     displayArticlesList();
  //   } else {
  //     throw new Error('Помилка збереження');
  //   }
  // } catch (error) {
  //   console.error('Помилка збереження:', error);
    // Fallback: зберігаємо в localStorage
    localStorage.setItem('articles', JSON.stringify(articles));
    alert('✅ Статтю додано (локально). Увага: для повноцінної роботи потрібен серверний скрипт.');
    clearForm();
    displayArticlesList();
 // }
}

// Відображення списку статей
function displayArticlesList(): void {
  if (articles.length === 0) {
    articlesListContainer.innerHTML = '<p class="no-articles">Ще немає жодної статті</p>';
    updateCounter();
    return;
  }

  articlesListContainer.innerHTML = articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(article => `
      <div class="article-preview">
        ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-thumb">` : ''}
        <div class="article-info">
          <h4>${article.title}</h4>
          <p class="meta-info">
            <span>${article.author}</span> | 
            <span>${article.category}</span> | 
            <span>${new Date(article.date).toLocaleDateString('uk-UA')}</span>
          </p>
          <div class="tags-list">
            ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  updateCounter();
}

// Попередній перегляд статті
function showPreview(): void {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const author = authorInput.value.trim();
  const category = categoryInput.value.trim();
  const tags = tagsInput.value.trim().split(',').map(t => t.trim()).filter(t => t);
  const imagePath = imageInput.value.trim();

  if (!title || !content) {
    previewContainer.innerHTML = '<p class="preview-empty">Заповніть заголовок та зміст для перегляду</p>';
    return;
  }

  previewContainer.innerHTML = `
    <div class="preview-article">
      <h3>${title}</h3>
      <p class="preview-meta">
        Автор: <b>${author || 'Не вказано'}</b> | 
        Категорія: <i>${category || 'Без категорії'}</i> |
        ${new Date().toLocaleDateString('uk-UA')}
      </p>
      ${imagePath ? `<img src="${imagePath}" alt="${title}" class="preview-image">` : ''}
      <p class="preview-content">${content}</p>
      <div class="preview-tags">
        ${tags.map(t => `<span class="tag">#${t}</span>`).join('')}
      </div>
    </div>
  `;
}

// Очищення форми
function clearForm(): void {
  titleInput.value = '';
  categoryInput.value = '';
  authorInput.value = '';
  contentInput.value = '';
  tagsInput.value = '';
  imageInput.value = '';
  previewContainer.innerHTML = '<p class="preview-empty">Тут з\'явиться попередній перегляд</p>';
}

// Обробник додавання нової статті
addBtn.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault();

  // Валідація полів
  if (!titleInput.value.trim() || !contentInput.value.trim()) {
    alert('⚠️ Будь ласка, заповніть принаймні заголовок та зміст статті!');
    return;
  }

  // Створюємо нову статтю
  const newArticle: Article = {
    id: Date.now(),
    title: titleInput.value.trim(),
    category: categoryInput.value.trim() || 'General',
    author: authorInput.value.trim() || 'Yaroslav',
    date: new Date().toISOString().split('T')[0], // формат YYYY-MM-DD
    content: contentInput.value.trim(),
    tags: tagsInput.value.trim().split(',').map(t => t.trim()).filter(t => t),
    image: imageInput.value.trim() || undefined
  };

  // Додаємо статтю до масиву
  articles.push(newArticle);

  // Зберігаємо
  saveArticles();
  // Оновлюємо лічильник
  updateCounter();
});

// Обробник події для очищення постів
clearBtn.addEventListener('click', () => {
  if (articlesListContainer.children.length > 0) {
    const confirmed = confirm('Ви впевнені, що хочете видалити всі пости?');
    if (confirmed) {
      clearPosts();
    }
  }
});

// Обробник для попереднього перегляду при введенні
titleInput.addEventListener('input', showPreview);
contentInput.addEventListener('input', showPreview);
authorInput.addEventListener('input', showPreview);
categoryInput.addEventListener('input', showPreview);
tagsInput.addEventListener('input', showPreview);
imageInput.addEventListener('input', showPreview);

// Ініціалізація при завантаженні сторінки
loadArticles();
updateCounter();