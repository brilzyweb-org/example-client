import { escapeHtml } from '../../utils/escapeHtml.js';
import { renderMarkdown } from '../../utils/markdown.js';

/**
 * Компонент страницы "О нас"
 * @param {Array} technologies - Массив технологий из базы данных
 * @param {string} pageTitle - Заголовок страницы из site_settings
 * @param {string} pageContent - Контент страницы из site_settings (markdown)
 * @param {Function} img - Функция для оптимизации изображений
 * @param {object} c - Контекст Hono для доступа к env
 */
export function About({ technologies = [], pageTitle, pageContent, img, c }) {
  // Группировка технологий по категориям
  const groupedTech = technologies.reduce((acc, tech) => {
    const category = tech.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {});

  const techSections = Object.entries(groupedTech).map(([category, items]) => /* html */ `
    <div class="tech-category">
      <h3>${escapeHtml(category)}</h3>
      <div class="tech-grid">
        ${items.map(tech => /* html */ `
          <div class="tech-card">
            <div class="tech-icon">${tech.icon || '📦'}</div>
            <h4>${escapeHtml(tech.name)}</h4>
            <p>${escapeHtml(tech.description)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Используем данные из site_settings или дефолтные значения
  const title = pageTitle || 'О нас';
  
  // Если есть контент из базы, рендерим его, иначе показываем изображения
  const pageContentHtml = (pageContent && pageContent.trim()) 
    ? renderMarkdown(pageContent, img, c)
    : /* html */ `
      <p>Это современный веб-проект, построенный на стеке Cloudflare Workers. Мы используем передовые технологии для создания быстрых и масштабируемых приложений.</p>
      <img src="${img('https://media.brilzy.com/example-client/images/photo_2025-02-13_20-11-57.jpg', {}, c)}" alt="Photo 6" class="markdown-image">
      <img src="${img('https://media.brilzy.com/example-client/images/photo_2025-02-13_20-12-09.jpg', {}, c)}" alt="Photo 7" class="markdown-image">
      <img src="${img('https://media.brilzy.com/example-client/images/photo_2025-02-13_20-12-18.jpg', {}, c)}" alt="Photo 8" class="markdown-image">
      <img src="${img('https://media.brilzy.com/example-client/images/photo_2025-02-13_20-12-23.jpg', {}, c)}" alt="Photo 9" class="markdown-image">
      <img src="${img('https://media.brilzy.com/example-client/images/photo_2025-02-13_20-12-26.jpg', {}, c)}" alt="Photo 10" class="markdown-image">
    `;

  return /* html */ `
    <h1>${escapeHtml(title)}</h1>
    <div class="about-content">
      <div class="page-content">${pageContentHtml}</div>
      
      <h2>Используемые технологии</h2>
      ${technologies.length > 0 ? techSections : /* html */ '<p>Загрузка технологий...</p>'}
    </div>
  `;
}
