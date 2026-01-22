import { escapeHtml } from '../../utils/escapeHtml.js';

/**
 * Компонент главной страницы
 * @param {Array} posts - Массив постов из базы данных
 * @param {string} pageTitle - Заголовок страницы из site_settings
 * @param {string} pageContent - Контент страницы из site_settings (markdown)
 * @param {Function} img - Функция для оптимизации изображений
 */
export function Home({ posts = [], pageTitle, pageContent, img }) {
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
  const content = pageContent || 'Это главная страница проекта на Hono + Vite + Wrangler.';

  return /* html */ `
    <h1>${escapeHtml(title)}</h1>
    <div class="page-content">${escapeHtml(content)}</div>
    <div class="posts-container">
      <h2>Посты из базы данных:</h2>
      ${postsList}
    </div>
  `;
}
