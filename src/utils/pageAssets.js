/**
 * Утилита для автоматического определения путей к скриптам и стилям страницы
 * Использует соглашения об именовании: если компонент Home.js, то ищет Home.init.js и Home.scss
 * Поддерживает dev и production режимы
 */

/**
 * Определяет пути к скриптам и стилям на основе пути компонента
 * @param {string} componentPath - Путь к компоненту (например, './pages/Home/Home.js')
 * @param {object} c - Контекст Hono (опционально, для определения окружения)
 * @returns {object} Объект с путями к скрипту и стилю
 */
export function getPageAssets(componentPath, c = null) {
  // Определяем режим работы
  const isProd = c?.env?.ENVIRONMENT === 'production';
  const assetBase = c?.env?.ASSETS_URL || 'http://localhost:5173';

  // Убираем расширение .js и префикс ./
  const basePath = componentPath
    .replace(/\.js$/, '')
    .replace(/^\.\//, '');

  // Извлекаем имя страницы из пути (например: pages/Home/Home -> Home)
  const pageName = basePath.split('/').pop();
  
  // В dev режиме: используем исходные файлы из src/
  // В production: используем страничные бандлы из css/ и js/
  if (isProd) {
    // Production: структура client/css/ и client/js/
    const pageScript = `client/js/${pageName.toLowerCase()}.bundle.js`; // Бандл со всеми JS
    const pageStyle = `client/css/${pageName.toLowerCase()}.bundle.css`; // Бандл со всеми CSS
    return {
      pageScript,
      pageStyle
    };
  } else {
    // Development: отдельные файлы для HMR
    const pageScript = `src/${basePath}.init.js`;
    const pageStyle = `src/${basePath}.scss`; // Vite компилирует SCSS на лету
    return {
      pageScript,
      pageStyle
    };
  }
}
