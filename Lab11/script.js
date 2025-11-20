// 1) Завантаження даних з JSON
let articles = [];

// Завантаження статей з файлу
async function loadArticles() {
  try {
    const response = await fetch('articles.json');
    if (!response.ok) throw new Error('Failed to load articles');
    articles = await response.json();
    
    // Ініціалізація після завантаження
    renderCategoryButtons();
    renderAll(articles);
  } catch (error) {
    console.error('Помилка завантаження статей:', error);
    
    // Fallback: спробувати localStorage
    const stored = localStorage.getItem('articles');
    if (stored) {
      articles = JSON.parse(stored);
      renderCategoryButtons();
      renderAll(articles);
    } else {
      postsContainer.innerHTML = '<p>Помилка завантаження статей. Спробуйте оновити сторінку.</p>';
    }
  }
}

// 2) Елементи DOM

const postsContainer = document.querySelector("#blog-posts");

const counterEl = document.querySelector("#counter");

const toolbar = document.querySelector("#toolbar");

const btnAll = document.querySelector("#btnAll");

const searchInput = document.querySelector("#searchTitle");

const searchBtn = document.querySelector("#searchBtn");

// 3) Рендер поста (з хештегами)
const renderArticle = ({ title, author, date, category, tags, image = [], content }) => `
  <article class="post" data-category="${category}">
    <h2>${title}</h2>
    <p class="meta">
      Author: <b>${author}</b> | Category: <i>${category}</i> |
      ${new Date(date).toLocaleDateString("en-US")}
    </p>
    ${image ? `<img src="${image}" alt="${title}" class="post-image">` : ''}
    <p>${content}</p>
    <div class="tags">
      ${tags.map(t => `<span class="tag">#${t}</span>`).join("")}
    </div>
  </article>

`;

// 4) Рендер списку + лічильник
const renderAll = (list = articles) => {
  if (list.length === 0) {
    postsContainer.innerHTML = '<p class="no-posts">Статей не знайдено</p>';
    counterEl.textContent = 'Number of articles: 0';
    return;
  }
  
  postsContainer.innerHTML = list.map(renderArticle).join("");
  counterEl.textContent = `Number of articles: ${list.length}`;
};

// 5) Унікальні категорії і кнопки
const getCategories = () =>
  Array.from(new Set(articles.map(a => a.category))).sort();

const renderCategoryButtons = () => {
  // Видалимо попередні кнопки категорій
  toolbar.querySelectorAll("[data-filter]").forEach(b => b.remove());

  const cats = getCategories();
  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = cat;
    btn.dataset.filter = cat;
    btn.setAttribute("aria-pressed", "false");
    btnAll.insertAdjacentElement("afterend", btn);
  });
};

// 6) Фільтрація (filter)
const filterByCategory = (category) =>
  articles.filter(a => a.category.toLowerCase() === category.toLowerCase());

// 7) Пошук (find) за назвою
const findByTitle = (query) =>
  articles.find(a => a.title.toLowerCase().includes(query.toLowerCase()));

  // 8) Події: фільтри (делегування)
toolbar.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  // Скидаємо активні стани
  toolbar.querySelectorAll(".btn[aria-pressed]").forEach(b => b.setAttribute("aria-pressed", "false"));

  if (btn.id === "btnAll") {
    btn.setAttribute("aria-pressed", "true");
    renderAll(articles);
    return;
  }

  if (btn.dataset.filter) {
    btn.setAttribute("aria-pressed", "true");
    const list = filterByCategory(btn.dataset.filter);
    renderAll(list);
  }
});

// 9) Події: пошук (find)
const doFind = () => {
  const q = (searchInput.value || "").trim();
  if (!q) return;
  
  const found = findByTitle(q);
  if (found) {
    renderAll(articles);
    const node = [...postsContainer.children].find(
      el => el.querySelector("h2").textContent === found.title
    );
    if (node) {
      node.style.outline = "3px solid #2563eb";
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => (node.style.outline = ""), 1600);
    }
    console.log("Found:", found);
  } else {
    console.log("Nothing found for your query:", q);
    alert("Нічого не знайдено за запитом: " + q);
  }
};

searchBtn.addEventListener("click", doFind);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doFind();
});

// 10) Ініціалізація
loadArticles();



