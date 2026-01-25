import { escapeHtml } from '../../utils/escapeHtml.js';
import { renderMarkdown } from '../../utils/markdown.js';

/**
 * Компонент главной страницы
 * @param {Array} posts - Массив постов из базы данных
 * @param {string} pageTitle - Заголовок страницы из site_settings
 * @param {string} pageContent - Контент страницы из site_settings (markdown)
 * @param {Function} img - Функция для оптимизации изображений
 * @param {object} c - Контекст Hono для доступа к env
 */
export function Home({ posts = [], pageTitle, pageContent, img, c }) {
  const postsList = posts.length > 0
    ? posts.map(post => {
        const imageHtml = post.image_url && img
          ? /* html */ `<div class="post-image">
              <img src="${img(post.image_url, { width: 800, quality: 85 })}" 
                   alt="${escapeHtml(post.title)}" 
                   loading="lazy">
            </div>`
          : '';
        
        return /* html */ `
          <article class="post">
            ${imageHtml}
            <h2>${escapeHtml(post.title)}</h2>
            <p class="post-content">${escapeHtml(post.content)}</p>
            ${post.created_at ? /* html */ `<time class="post-date">${new Date(post.created_at).toLocaleDateString('ru-RU')}</time>` : ''}
          </article>
        `;
      }).join('')
    : /* html */ '<p>Постов пока нет.</p>';

  // Используем данные из site_settings или дефолтные значения
  const title = pageTitle || 'Добро пожаловать!';
  
  // Дефолтный текст (всегда показываем)
  const defaultText = /* html */ `<p>Это главная страница проекта на Hono + Vite + Wrangler.</p>`;
  
  // Дефолтные изображения (всегда показываем)
  const defaultImages = /* html */ `
    <img src="${img('https://media.brilzy.com/example-client/images/5df0b1cf536dc90011e9f14d.png', {}, c)}" alt="Image 1" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/DALL·E 2025-02-16 21.22.06 - A detailed digital illustration of a web browser interface, showcasing its core components as labeled elements. The illustration includes___- The brow.webp', {}, c)}" alt="DALL·E Browser" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/IMG_2074.jpg', {}, c)}" alt="IMG 2074" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/ajatar.jpeg', {}, c)}" alt="Ajatar" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/javascript.png', {}, c)}" alt="JavaScript" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/photo_2024-12-30_14-08-01.jpg', {}, c)}" alt="Photo 1" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/photo_2024-12-30_14-08-43.jpg', {}, c)}" alt="Photo 2" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/photo_2024-12-30_14-08-53.jpg', {}, c)}" alt="Photo 3" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/photo_2025-01-05_16-39-46.jpg', {}, c)}" alt="Photo 4" class="markdown-image">
    <img src="${img('https://media.brilzy.com/example-client/images/photo_2025-01-05_16-39-57.jpg', {}, c)}" alt="Photo 5" class="markdown-image">
  `;
  
  // Контент из БД (если есть, рендерим его)
  const dbContent = (pageContent && pageContent.trim()) 
    ? renderMarkdown(pageContent, img, c)
    : '';
  
  // Объединяем ВСЕ: дефолтный текст + контент из БД + дефолтные изображения
  const pageContentHtml = `${defaultText}${dbContent}${defaultImages}`;

  return /* html */ `
    <h1>${escapeHtml(title)}</h1>
    <div class="page-content">${pageContentHtml}</div>
    <div class="posts-container">
      <h2>Посты из базы данных:</h2>
      ${postsList}
    </div>
  `;
}
