import { escapeHtml } from './escapeHtml.js';

/**
 * Простой markdown парсер для рендеринга контента с поддержкой изображений
 * @param {string} markdown - Markdown текст
 * @param {Function} imgOptimizer - Функция для оптимизации изображений (url, options, c) => optimizedUrl
 * @param {object} c - Контекст Hono для доступа к env
 * @returns {string} - HTML разметка
 */
export function renderMarkdown(markdown, imgOptimizer = null, c = null) {
  if (!markdown) return '';

  let html = markdown;

  // Временные плейсхолдеры для изображений и ссылок (чтобы не экранировать их содержимое)
  const placeholders = [];
  let placeholderIndex = 0;

  // Обработка обычных HTML тегов <img> - ДО экранирования
  html = html.replace(/<img\s+([^>]*?)>/gi, (match, attributes) => {
    // Парсим атрибуты из тега <img>
    const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
    const altMatch = attributes.match(/alt=["']([^"']*)["']/i);
    
    if (!srcMatch) return match; // Если нет src, оставляем как есть
    
    const src = srcMatch[1];
    const alt = altMatch ? altMatch[1] : '';
    
    const placeholder = `__IMAGE_PLACEHOLDER_${placeholderIndex}__`;
    placeholderIndex++;
    
    // Если есть оптимизатор изображений, используем его
    if (imgOptimizer && typeof imgOptimizer === 'function') {
      const optimizedUrl = imgOptimizer(src, { width: 1200, quality: 85 }, c);
      placeholders.push(`<img src="${escapeHtml(optimizedUrl)}" alt="${escapeHtml(alt || '')}" loading="lazy" class="markdown-image">`);
    } else {
      placeholders.push(`<img src="${escapeHtml(src)}" alt="${escapeHtml(alt || '')}" loading="lazy" class="markdown-image">`);
    }
    
    return placeholder;
  });

  // Обработка изображений: ![alt](url) или ![alt](url "title") - ДО экранирования
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)(?:\s+"[^"]*")?\)/g, (match, alt, url) => {
    // Нормализуем URL (убираем пробелы)
    let trimmedUrl = url.trim();
    
    const placeholder = `__IMAGE_PLACEHOLDER_${placeholderIndex}__`;
    placeholderIndex++;
    
    // Если есть оптимизатор изображений, используем его
    if (imgOptimizer && typeof imgOptimizer === 'function') {
      const optimizedUrl = imgOptimizer(trimmedUrl, { width: 1200, quality: 85 }, c);
      // Простое отображение - используем URL как есть
      placeholders.push(`<img src="${escapeHtml(optimizedUrl)}" alt="${escapeHtml(alt || '')}" loading="lazy" class="markdown-image">`);
    } else {
      // Без оптимизатора - используем URL напрямую
      placeholders.push(`<img src="${escapeHtml(trimmedUrl)}" alt="${escapeHtml(alt || '')}" loading="lazy" class="markdown-image">`);
    }
    
    return placeholder;
  });

  // Обработка ссылок: [text](url) - ДО экранирования
  html = html.replace(/\[([^\]]+)\]\(([^)]+)(?:\s+"[^"]*")?\)/g, (match, text, url) => {
    const trimmedUrl = url.trim();
    const placeholder = `__LINK_PLACEHOLDER_${placeholderIndex}__`;
    placeholderIndex++;
    placeholders.push(`<a href="${escapeHtml(trimmedUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`);
    return placeholder;
  });

  // Экранируем HTML теги для безопасности
  html = escapeHtml(html);

  // Восстанавливаем плейсхолдеры
  let placeholderCounter = 0;
  html = html.replace(/__(IMAGE|LINK)_PLACEHOLDER_\d+__/g, () => {
    return placeholders[placeholderCounter++] || '';
  });

  // Заголовки: # H1, ## H2, ### H3, и т.д.
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Жирный текст: **text** или __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Курсив: *text* или _text_
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Разбиваем на строки для обработки
  const lines = html.split('\n');
  const processedLines = [];
  let inList = false;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Пропускаем пустые строки
    if (!line) {
      if (inList) {
        processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      processedLines.push('');
      continue;
    }

    // Проверяем нумерованный список
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (!inList || listType !== 'ol') {
        if (inList && listType === 'ul') {
          processedLines.push('</ul>');
        }
        processedLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      processedLines.push(`<li>${numberedMatch[1]}</li>`);
      continue;
    }

    // Проверяем маркированный список
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        if (inList && listType === 'ol') {
          processedLines.push('</ol>');
        }
        processedLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      processedLines.push(`<li>${bulletMatch[1]}</li>`);
      continue;
    }

    // Закрываем список если он был открыт
    if (inList) {
      processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
      inList = false;
      listType = null;
    }

    // Остальные строки добавляем как есть (уже обработаны заголовки, изображения, ссылки)
    processedLines.push(line);
  }

  // Закрываем список если он остался открытым
  if (inList) {
    processedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
  }

  html = processedLines.join('\n');

  // Параграфы (блоки текста между пустыми строками или тегами)
  const blocks = html.split(/\n\s*\n/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    
    // Если уже обернуто в теги заголовков, списков или изображений, не оборачиваем в <p>
    if (/^<(h[1-6]|ul|ol|li|img|p)/.test(block)) {
      return block;
    }
    
    // Если блок содержит только переносы строк, пропускаем
    if (!block.replace(/\n/g, '').trim()) {
      return '';
    }
    
    return `<p>${block.replace(/\n/g, ' ')}</p>`;
  }).filter(b => b).join('\n');

  return html;
}
