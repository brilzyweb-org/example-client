import { escapeHtml } from '../../utils/escapeHtml.js';

/**
 * Компонент страницы "О нас"
 * @param {Array} technologies - Массив технологий из базы данных
 * @param {string} pageTitle - Заголовок страницы из site_settings
 * @param {string} pageContent - Контент страницы из site_settings (markdown)
 */
export function About({ technologies = [], pageTitle, pageContent }) {
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
  const content = pageContent || 'Это современный веб-проект, построенный на стеке Cloudflare Workers. Мы используем передовые технологии для создания быстрых и масштабируемых приложений.';

  return /* html */ `
    <h1>${escapeHtml(title)}</h1>
    <div class="about-content">
      <div class="page-content">${escapeHtml(content)}</div>
      
      <h2>Используемые технологии</h2>
      ${technologies.length > 0 ? techSections : /* html */ '<p>Загрузка технологий...</p>'}
    </div>
  `;
}
