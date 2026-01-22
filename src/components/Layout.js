import { getCommonScripts, getCommonStyles } from '../utils/commonAssets.js';
import { Footer } from './Footer/Footer.js';
import { Header } from './Header/Header.js';

/**
 * Layout компонент для Cloudflare Workers
 * Подключает стили и скрипты напрямую из Vite dev server (порт 5173)
 * @param {object} props - Пропсы компонента
 * @param {string} props.children - HTML содержимое страницы
 * @param {string} props.title - Заголовок страницы
 * @param {object} props.c - Контекст Hono для доступа к env
 * @param {string} props.pageScript - Путь к страничному JS (опционально)
 * @param {string} props.pageStyle - Путь к страничному SCSS (опционально)
 */
export function Layout({ children, title = 'Example Client', siteTitle, siteDescription, c, pageScript, pageStyle }) {
  // ASSETS_URL из wrangler.toml (http://localhost:5173 в dev режиме)
  const assetBase = c?.env?.ASSETS_URL || 'http://localhost:5173';
  const isDev = assetBase.includes('localhost');
  
  // Получаем текущий путь из URL запроса
  const url = new URL(c.req.url);
  const currentPath = url.pathname || '/';
  
  const header = Header({ currentPath });
  const footer = Footer();
  
  // Версионирование через query параметр (в dev не нужна, в prod - версия из env или timestamp)
  // Формат: app.js?v=1234567890
  const version = isDev ? '' : `?v=${c?.env?.ASSETS_VERSION || Date.now()}`;
  
  // В production используем страничные бандлы (один CSS + один JS)
  // В dev используем отдельные файлы для HMR
  if (isDev) {
    // Development: отдельные файлы для HMR
    const scripts = [
      `<script type="module" src="${assetBase}/src/client/js/app.js${version}"></script>`,
      `<script type="module" src="${assetBase}/src/components/Header/Header.init.js${version}"></script>`,
      `<script type="module" src="${assetBase}/src/components/Footer/Footer.init.js${version}"></script>`,
    ];
    
    if (pageScript) {
      scripts.push(`<script type="module" src="${assetBase}/${pageScript}${version}"></script>`);
    }
    
    return /* html */ `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${siteDescription ? `<meta name="description" content="${siteDescription.replace(/"/g, '&quot;')}">` : ''}
        <!-- Vite HMR клиент для hot reload -->
        <script type="module" src="${assetBase}/@vite/client"></script>
        <!-- Основные стили -->
        <link rel="stylesheet" href="${assetBase}/src/client/scss/style.scss${version}">
        <!-- Компонентные стили -->
        <link rel="stylesheet" href="${assetBase}/src/components/Header/Header.scss${version}">
        <link rel="stylesheet" href="${assetBase}/src/components/Footer/Footer.scss${version}">
        ${pageStyle ? `<!-- Страничные стили -->\n      <link rel="stylesheet" href="${assetBase}/${pageStyle}${version}">` : ''}
      </head>
      <body>
        ${header}
        <div class="container">
          ${children}
        </div>
        ${footer}
        <!-- JavaScript -->
        ${scripts.join('\n      ')}
      </body>
      </html>
    `;
  } else {
    // Production: общие файлы + страничные бандлы (пути определяются автоматически)
    const commonStyles = getCommonStyles(c);
    const commonScripts = getCommonScripts(c);
    
    const styleLinks = commonStyles.map(style => 
      `      <link rel="stylesheet" href="${assetBase}/${style}${version}">`
    ).join('\n');
    
    const scriptTags = commonScripts.map(script => 
      `      <script type="module" src="${assetBase}/${script}${version}"></script>`
    ).join('\n');
    
    return /* html */ `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${siteDescription ? `<meta name="description" content="${siteDescription.replace(/"/g, '&quot;')}">` : ''}
        <!-- Общие стили (для всех страниц) -->
${styleLinks}
        ${pageStyle ? `<!-- Страничные стили -->\n      <link rel="stylesheet" href="${assetBase}/${pageStyle}${version}">` : ''}
      </head>
      <body>
        ${header}
        <div class="container">
          ${children}
        </div>
        ${footer}
        <!-- Общие скрипты (для всех страниц) -->
${scriptTags}
        ${pageScript ? `<!-- Страничный скрипт -->\n      <script type="module" src="${assetBase}/${pageScript}${version}"></script>` : ''}
      </body>
      </html>
    `;
  }
}
