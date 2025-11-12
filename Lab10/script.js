// 1) Дані
const articles = [
  {
    id: 1,
    title: "Favorite Sci-Fi Films and Why They Inspire Me",
    category: "Films",
    author: "Yaroslav",
    date: "2025-09-05",
    content: `
      I’ve always been fascinated by how science fiction explores the unknown — not just outer space, 
      but human imagination itself. Movies like <em>Blade Runner 2049</em> and <em>Interstellar</em> 
      show how technology and emotion can intertwine in breathtaking ways. 
      These films don’t just entertain — they make you question what defines humanity, 
      identity, and progress.
    `,
    tags: ["SciFi", "Cinema", "Inspiration"],
    image: "images/BladeRunner2049.jpg"
  },
  {
    id: 2,
    title: "Persona 4 Golden: A Journey of Self and Shadows",
    category: "Games",
    author: "Yaroslav",
    date: "2025-08-28",
    content: `
      Persona 4 Golden isn’t just a game — it’s an experience. 
      A mix of small-town mystery, psychological symbolism, and character-driven storytelling. 
      Every choice feels meaningful, every shadow encounter represents more than just combat — 
      it’s about self-acceptance. The soundtrack, vibrant art, and themes of truth make it timeless.
    `,
    tags: ["Videogames", "Persona", "JRPG"],
    image: "images/P4G_Cover.jpg"
  },
  {
    id: 3,
    title: "Fiber Optics (PON): The Real Lifeline During Blackouts",
    category: "IT",
    author: "Yaroslav",
    date: "2025-09-22",
    content: `
      Power outages can disrupt everything — except, surprisingly, your internet connection, 
      if you’re using fiber optics (PON). Unlike copper or coaxial systems, 
      PON requires minimal power on the provider’s end and can stay online with just a small UPS. 
      For remote workers and students, it’s not just convenience — it’s survival tech.
    `,
    tags: ["Life", "Networking", "TechTips"],
    image: "images/pon.jpg"
  },
  {
    id: 4,
    title: "New Academic Year — New Challenges",
    category: "Education",
    author: "Yaroslav",
    date: "2025-09-02",
    content: `
      A new semester means new goals, new routines, and of course — new deadlines. 
      Balancing studies, side projects, and personal life is never easy, 
      but every challenge builds discipline and creativity. 
      Sometimes, the hardest part isn’t the work itself, but keeping your motivation alive.
    `,
    tags: ["Life", "Education", "Motivation"],
    image: "images/Academic_Year.jpg"
  },
  {
    id: 5,
    title: "AI-Powered Creativity: The Future of Music and Art",
    category: "IT",
    author: "Yaroslav",
    date: "2025-09-12",
    content: `
      The intersection of technology and creativity has never been more exciting. 
      AI tools are now capable of composing music, generating visuals, 
      and even helping indie creators prototype ideas faster than ever. 
      But at the end of the day, technology should amplify human creativity — not replace it.
    `,
    tags: ["AI", "Music", "Innovation"],
    image: "images/AI_powered.jpg"
  },
  {
    id: 6,
    title: "Why Dark Mode Isn’t Just a Trend",
    category: "IT",
    author: "Yaroslav",
    date: "2025-08-18",
    content: `
      Beyond aesthetics, dark mode reduces eye strain, improves focus, 
      and even saves energy on OLED displays. 
      But what fascinates me most is how it became a part of digital identity — 
      developers, artists, and gamers all seem to feel more “at home” in darker UIs.
    `,
    tags: ["Design", "UX", "Life"],
    image: "images/dark_mode.jpg"
  },
  {
    id: 7,
    title: "Soundtracks That Define Moments",
    category: "Music",
    author: "Yaroslav",
    date: "2025-08-10",
    content: `
      From ambient game scores to emotional orchestral film themes — 
      music has the power to anchor a memory. 
      A single melody can remind you of an entire journey. 
      That’s why I love collecting and cataloging soundtracks: 
      they are pieces of emotion frozen in time.
    `,
    tags: ["Music", "Soundtrack", "Emotion"],
    image: "images/OST_cover.jpg"
  }
];

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

    <p>${content}</p>

    <div class="tags">

      ${tags.map(t => `<span class="tag">#${t}</span>`).join("")}

    </div>

   <img src="${image}" alt="${title}" class="post-image">

  </article>

`;

// 4) Рендер списку + лічильник
const renderAll = (list = articles) => {

  postsContainer.innerHTML = list.map(renderArticle).join("");

  counterEl.textContent = `Number of articles: ${list.length}`;

};

// 5) Унікальні категорії і кнопки
const getCategories = () =>

  Array.from(new Set(articles.map(a => a.category))).sort();


const renderCategoryButtons = () => {

  // видалимо попередні, якщо вже були

  toolbar.querySelectorAll("[data-filter]").forEach(b => b.remove());


  const cats = getCategories();

  const afterAllBtn = btnAll.nextElementSibling ? btnAll : btnAll;

  cats.forEach(cat => {

    const btn = document.createElement("button");

    btn.className = "btn";

    btn.textContent = cat;

    btn.dataset.filter = cat;

    btn.setAttribute("aria-pressed", "false");

    // вставимо після кнопки "Усі"

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


  // скидаємо активні стани

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

    // Показуємо всі, підсвічуємо знайдений

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

  }

};

searchBtn.addEventListener("click", doFind);

searchInput.addEventListener("keydown", (e) => {

  if (e.key === "Enter") doFind();

});

// 10) Ініціалізація
renderCategoryButtons();

renderAll(articles);



