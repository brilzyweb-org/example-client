/**
 * Хелпер для оптимизации изображений.
 * Локальные картинки отдает как есть, внешние — через weserv.
 * @param {string} imageUrl - URL изображения
 * @param {object} options - Опции оптимизации (width, height, quality, format)
 * @param {object} c - Контекст Hono для доступа к env
 * @returns {string} - Оптимизированный URL
 */
export function getOptimizedImage(imageUrl, options = {}, c) {
  if (!imageUrl) return '';
  
  // Если картинка локальная (начинается с /) и мы в режиме разработки
  const isLocalDev = c?.env?.ASSETS_URL?.includes('localhost');
  if (imageUrl.startsWith('/') && isLocalDev) {
    return `${c.env.ASSETS_URL}${imageUrl}`;
  }

  // Если картинка уже абсолютный URL и локальная
  if (imageUrl.startsWith('http://localhost') || imageUrl.startsWith('http://127.0.0.1')) {
    return imageUrl;
  }

  const { width, height, quality = 80, format = 'webp' } = options;
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  params.append('q', quality);
  params.append('output', format);

  // Формируем полный URL для внешнего оптимизатора
  const absoluteUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${c?.env?.R2_PUBLIC_URL || 'https://cdn.example.com'}/${imageUrl.replace(/^\//, '')}`;

  return `https://images.weserv.nl/?${params.toString()}&url=${encodeURIComponent(absoluteUrl)}`;
}
