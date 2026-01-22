/**
 * Экранирование HTML для защиты от XSS атак
 * Использует только Web APIs (без Node.js модулей)
 * 
 * @param {string|number|null|undefined} text - Текст для экранирования
 * @returns {string} Экранированный текст
 * 
 * @example
 * escapeHtml('<script>alert("XSS")</script>')
 * // Возвращает: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function escapeHtml(text) {
  if (!text) return '';
  const str = String(text);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
