/**
 * Утилита для автоматического определения путей к общим ассетам
 * (глобальные и компонентные файлы, которые используются на всех страницах)
 * 
 * Автоматически находит:
 * - Глобальные файлы в src/client/
 * - Компонентные файлы в src/components/ (по соглашению об именовании)
 * 
 * Соглашение: все компоненты в src/components/ с файлом ComponentName.init.js
 * автоматически считаются общими (используются на всех страницах)
 * 
 * Исключения: Layout.js (это обертка, не компонент)
 */

/**
 * Получает список общих компонентов из индексного файла компонентов
 * Без хардкода - все определяется через экспорты в components/index.js
 */
import { COMMON_COMPONENTS } from '../components/index.js';

function getCommonComponents() {
  return COMMON_COMPONENTS;
}

/**
 * Получает projectId из env или из ASSETS_URL
 * @param {object} c - Контекст Hono для доступа к env
 * @returns {string} projectId
 */
function getProjectId(c = null) {
  // Сначала пробуем из env (если передан на VPS через workerd.capnp)
  if (c?.env?.PROJECT_ID) {
    return c.env.PROJECT_ID;
  }
  
  // Пробуем получить из ASSETS_URL
  // Формат: https://cdn.brilzy.com/example-client или https://cdn.brilzy.com
  const assetsUrl = c?.env?.ASSETS_URL || '';
  if (assetsUrl) {
    // Извлекаем projectId из URL (последний сегмент пути, если это не домен)
    // Например: https://cdn.brilzy.com/example-client -> example-client
    const urlObj = new URL(assetsUrl);
    const pathSegments = urlObj.pathname.split('/').filter(s => s);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      // Проверяем, что это не домен (не содержит точку)
      if (!lastSegment.includes('.')) {
        return lastSegment;
      }
    }
  }
  
  // Fallback
  return 'example-client';
}

/**
 * Автоматически определяет пути к общим JS файлам
 * @param {object} c - Контекст Hono (опционально, для определения окружения)
 * @returns {string[]} Массив путей к общим JS файлам
 */
export function getCommonScripts(c = null) {
  const isProd = c?.env?.ENVIRONMENT === 'production';
  const scripts = [];
  
  if (isProd) {
    // Production: структура {projectId}/js/ (без /client/)
    const projectId = getProjectId(c);
    // 1. Глобальный JS
    scripts.push(`${projectId}/js/app.js`);
    
    // 2. Компонентные JS
    const commonComponents = getCommonComponents();
    for (const componentName of commonComponents) {
      scripts.push(`${projectId}/js/${componentName.toLowerCase()}.init.js`);
    }
  } else {
    // Development: исходные файлы из src/
    // 1. Глобальный JS
    scripts.push('src/client/js/app.js');
    
    // 2. Компонентные JS
    const commonComponents = getCommonComponents();
    for (const componentName of commonComponents) {
      scripts.push(`src/components/${componentName}/${componentName}.init.js`);
    }
  }
  
  return scripts;
}

/**
 * Автоматически определяет пути к общим CSS файлам
 * @param {object} c - Контекст Hono (опционально, для определения окружения)
 * @returns {string[]} Массив путей к общим CSS файлам
 */
export function getCommonStyles(c = null) {
  const isProd = c?.env?.ENVIRONMENT === 'production';
  const styles = [];
  
  if (isProd) {
    // Production: структура {projectId}/css/ (без /client/)
    const projectId = getProjectId(c);
    // 1. Глобальные стили
    styles.push(`${projectId}/css/style.css`);
    
    // 2. Компонентные стили
    const commonComponents = getCommonComponents();
    for (const componentName of commonComponents) {
      styles.push(`${projectId}/css/${componentName.toLowerCase()}.css`);
    }
  } else {
    // Development: исходные файлы из src/
    // 1. Глобальные стили
    styles.push('src/client/scss/style.scss');
    
    // 2. Компонентные стили
    const commonComponents = getCommonComponents();
    for (const componentName of commonComponents) {
      styles.push(`src/components/${componentName}/${componentName}.scss`);
    }
  }
  
  return styles;
}
