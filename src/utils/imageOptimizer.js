/**
 * Хелпер для оптимизации изображений.
 * В dev режиме возвращает URL как есть для простого отображения.
 * @param {string} imageUrl - URL изображения
 * @param {object} options - Опции оптимизации (width, height, quality, format)
 * @param {object} c - Контекст Hono для доступа к env
 * @returns {string} - URL изображения
 */
export function getOptimizedImage(imageUrl, options = {}, c) {
  if (!imageUrl) return '';
  
  // Нормализуем URL (убираем пробелы)
  imageUrl = imageUrl.trim();
  
  // Проверяем режим разработки
  const isLocalDev = c?.env?.ASSETS_URL?.includes('localhost');
  
  // Если картинка локальная (начинается с /) и мы в режиме разработки
  if (imageUrl.startsWith('/') && isLocalDev) {
    return `${c.env.ASSETS_URL}${imageUrl}`;
  }

  // Если картинка уже абсолютный URL и локальная
  if (imageUrl.startsWith('http://localhost') || imageUrl.startsWith('http://127.0.0.1')) {
    return imageUrl;
  }

  // Формируем полный URL
  let absoluteUrl;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Уже полный URL - проверяем, нужно ли кодировать
    try {
      const urlObj = new URL(imageUrl);
      // Если путь содержит незакодированные пробелы или специальные символы, кодируем
      if (urlObj.pathname.includes(' ') || /[^\x00-\x7F]/.test(urlObj.pathname)) {
        const pathParts = urlObj.pathname.split('/');
        const encodedPath = pathParts.map(part => {
          // Если часть уже закодирована (содержит %), не кодируем повторно
          if (part.includes('%')) return part;
          return encodeURIComponent(part);
        }).join('/');
        urlObj.pathname = encodedPath;
        absoluteUrl = urlObj.toString();
      } else {
        // URL уже правильно закодирован или не требует кодирования
        absoluteUrl = imageUrl;
      }
    } catch (e) {
      // Если не удалось распарсить URL, используем как есть
      absoluteUrl = imageUrl;
    }
  } else {
    // Относительный путь - добавляем базовый URL из R2
    const baseUrl = c?.env?.R2_PUBLIC_URL || 'https://media.brilzy.com';
    const cleanPath = imageUrl.replace(/^\//, '');
    // Кодируем только если путь содержит незакодированные символы
    const encodedPath = cleanPath.split('/').map(part => {
      if (part.includes('%')) return part; // Уже закодировано
      return encodeURIComponent(part);
    }).join('/');
    absoluteUrl = `${baseUrl}/${encodedPath}`;
  }

  // В локальной разработке просто возвращаем URL как есть - элементарное отображение
  if (isLocalDev) {
    return absoluteUrl;
  }

  // Если изображение уже из R2 (media.brilzy.com), возвращаем напрямую без прокси
  // Это избегает проблем с CORS и загрузкой через weserv.nl
  const r2BaseUrl = c?.env?.R2_PUBLIC_URL || 'https://media.brilzy.com';
  if (absoluteUrl.startsWith(r2BaseUrl)) {
    return absoluteUrl;
  }

  // Для внешних изображений используем weserv.nl для оптимизации
  const { width, height, quality = 80, format = 'webp' } = options;
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  params.append('q', quality);
  params.append('output', format);

  return `https://images.weserv.nl/?${params.toString()}&url=${encodeURIComponent(absoluteUrl)}`;
}
