import { mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import postcss from 'postcss';
import combineMediaQuery from 'postcss-combine-media-query';
import sortMediaQueries from 'postcss-sort-media-queries';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Читаем имя проекта из agency-config.json
function getProjectId() {
  try {
    const configPath = join(__dirname, 'agency-config.json');
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    return config.id || 'example-client';
  } catch (e) {
    return 'example-client'; // fallback
  }
}

const PROJECT_ID = getProjectId();

/**
 * Рекурсивно находит все файлы с указанными расширениями в директории
 * @param {string} dir - Путь к директории
 * @param {string[]} extensions - Массив расширений (например, ['.scss', '.init.js'])
 * @returns {string[]} - Массив путей к файлам
 */
function findFiles(dir, extensions) {
  const files = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Рекурсивно ищем в поддиректориях
        files.push(...findFiles(fullPath, extensions));
      } else if (stat.isFile()) {
        // Проверяем, подходит ли файл по расширению
        const matches = extensions.some(ext => entry.endsWith(ext));
        if (matches) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Игнорируем ошибки доступа к директориям
    console.warn(`Не удалось прочитать директорию ${dir}:`, error.message);
  }

  return files;
}

/**
 * Формирует объект input для Rollup из найденных файлов
 * @returns {object} - Объект с путями для Rollup
 */
/**
 * Создает временный бандл файл для страницы (в .temp папке)
 */
function createBundleFile(pageName, type) {
  const tempDir = resolve(__dirname, '.temp', 'pages', pageName);
  // Создаем папку если не существует (recursive создает все вложенные)
  try {
    mkdirSync(tempDir, { recursive: true });
  } catch (error) {
    // Игнорируем ошибку если папка уже существует
  }

  const bundlePath = join(tempDir, `${pageName}.bundle.${type}`);

  if (type === 'js') {
    // Бандл страницы содержит ТОЛЬКО страничный JS
    const content = `/**
 * Автоматически сгенерированный бандл для страницы ${pageName}
 * Не редактировать вручную - генерируется при сборке
 * Содержит только страничный JS
 */

// Страничный JS
import '../../../src/pages/${pageName}/${pageName}.init.js';
`;
    writeFileSync(bundlePath, content, 'utf8');
  } else if (type === 'scss') {
    // Бандл страницы содержит ТОЛЬКО страничные стили
    const content = `/**
 * Автоматически сгенерированный бандл стилей для страницы ${pageName}
 * Не редактировать вручную - генерируется при сборке
 * Содержит только страничные стили
 */

// Страничные стили
@import '../../../src/pages/${pageName}/${pageName}.scss';
`;
    writeFileSync(bundlePath, content, 'utf8');
  }

  return bundlePath;
}

function buildInput() {
  const input = {};

  // В production: генерируем бандлы автоматически
  // В dev: используем отдельные файлы (для HMR)
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Production: собираем общие файлы + страничные бандлы

    // 1. Общие файлы (для всех страниц)
    input['src/client/scss/style.scss'] = resolve(__dirname, 'src/client/scss/style.scss');
    input['src/client/js/app.js'] = resolve(__dirname, 'src/client/js/app.js');
    input['src/components/Header/Header.scss'] = resolve(__dirname, 'src/components/Header/Header.scss');
    input['src/components/Header/Header.init.js'] = resolve(__dirname, 'src/components/Header/Header.init.js');
    input['src/components/Footer/Footer.scss'] = resolve(__dirname, 'src/components/Footer/Footer.scss');
    input['src/components/Footer/Footer.init.js'] = resolve(__dirname, 'src/components/Footer/Footer.init.js');

    // 2. Страничные бандлы (только страничные файлы)
    const pagesDir = resolve(__dirname, 'src/pages');
    const pages = readdirSync(pagesDir).filter(entry => {
      const fullPath = join(pagesDir, entry);
      return statSync(fullPath).isDirectory();
    });

    for (const pageName of pages) {
      // Создаем временные бандл файлы (только страничные)
      const jsBundle = createBundleFile(pageName, 'js');
      const scssBundle = createBundleFile(pageName, 'scss');

      // Добавляем в input
      const jsPath = `src/pages/${pageName}/${pageName}.bundle.js`;
      const scssPath = `src/pages/${pageName}/${pageName}.bundle.scss`;

      input[jsPath] = jsBundle;
      input[scssPath] = scssBundle;
    }
  } else {
    // Development: отдельные файлы для HMR
    input['src/client/scss/style.scss'] = resolve(__dirname, 'src/client/scss/style.scss');
    input['src/client/js/app.js'] = resolve(__dirname, 'src/client/js/app.js');

    const searchDirs = [
      resolve(__dirname, 'src/components'),
      resolve(__dirname, 'src/pages'),
    ];

    const extensions = ['.scss', '.init.js'];

    for (const dir of searchDirs) {
      const files = findFiles(dir, extensions);

      for (const filePath of files) {
        const projectRoot = resolve(__dirname);
        let relativePath = filePath.replace(projectRoot, '').replace(/^[\\\/]+/, '');
        relativePath = relativePath.replace(/\\/g, '/');
        input[relativePath] = filePath;
      }
    }
  }

  // Отладочный вывод
  if (!isProduction) {
    console.log('Vite input files (dev mode):');
    Object.keys(input).forEach(key => {
      console.log(`  ${key} -> ${input[key]}`);
    });
  }

  return input;
}

/**
 * Автоматически генерирует index.js для компонентов
 * Находит все компоненты с .init.js файлами и создает индексный файл
 */
function generateComponentsIndex() {
  const componentsDir = resolve(__dirname, 'src/components');
  const commonComponents = [];
  
  try {
    const entries = readdirSync(componentsDir);
    for (const entry of entries) {
      const fullPath = join(componentsDir, entry);
      if (statSync(fullPath).isDirectory() && entry !== 'Layout') {
        // Проверяем наличие .init.js файла
        const initFile = join(fullPath, `${entry}.init.js`);
        try {
          if (statSync(initFile).isFile()) {
            // Компонент имеет .init.js - значит он общий
            commonComponents.push(entry);
          }
        } catch {
          // Файл не существует - пропускаем
        }
      }
    }
    
    // Сортируем для консистентности
    commonComponents.sort();
    
    // Автоматически обновляем index.js с найденными компонентами
    const imports = commonComponents.map(name => 
      `import { ${name} } from './${name}/${name}.js';`
    ).join('\n');
    
    const exports = commonComponents.map(name => 
      `export { ${name} } from './${name}/${name}.js';`
    ).join('\n');
    
    const indexContent = `/**
 * Индексный файл компонентов
 * АВТОМАТИЧЕСКИ ГЕНЕРИРУЕТСЯ Vite плагином - не редактировать вручную
 * 
 * Список компонентов определяется автоматически по наличию .init.js файла
 * Все компоненты в src/components/ с .init.js считаются общими
 * 
 * При добавлении нового компонента просто создайте папку с .init.js файлом
 * Vite автоматически добавит его в этот список
 */

${imports}

// Автоматически определенные общие компоненты
export const COMMON_COMPONENTS = ${JSON.stringify(commonComponents, null, 2)};

// Экспортируем компоненты
${exports}
`;
    
    const indexPath = resolve(__dirname, 'src/components/index.js');
    writeFileSync(indexPath, indexContent, 'utf8');
  } catch (error) {
    console.warn('⚠️ Не удалось автоматически определить компоненты:', error.message);
  }
}

export default defineConfig(({ mode }) => {
  // Режим 'server' - собираем все в один bundle.js для VPS
  if (mode === 'server') {
    return {
      root: '.',
      publicDir: false, // Не копируем файлы из public/ (config.yml не нужен)
      build: {
        outDir: `${PROJECT_ID}/server`, // Используем имя проекта вместо dist/server
        emptyOutDir: true,
        // Собираем все в один файл bundle.js
        rollupOptions: {
          input: resolve(__dirname, 'src/index.js'),
          // Сохраняем именованные экспорты (важно для Durable Objects)
          preserveEntrySignatures: 'exports-only',
          output: {
            format: 'es',
            entryFileNames: 'bundle.js',
            // Все зависимости инлайнятся в один файл
            inlineDynamicImports: true,
          },
        },
      },
      plugins: [
        // Плагин для обработки ?raw импортов (.yml, .html)
        {
          name: 'raw-loader',
          load(id) {
            if (id.includes('?raw')) {
              const filePath = id.split('?')[0];
              const resolvedPath = filePath.startsWith('/') || filePath.match(/^[A-Z]:/) 
                ? filePath 
                : resolve(__dirname, filePath);
              try {
                const content = readFileSync(resolvedPath, 'utf-8');
                return `export default ${JSON.stringify(content)};`;
              } catch (error) {
                this.error(`Failed to load raw file: ${resolvedPath} - ${error.message}`, { id });
              }
            }
            return null;
          },
        },
        {
          name: 'rename-to-bundle',
          closeBundle() {
            console.log(`✓ Bundle собран в ${PROJECT_ID}/server/bundle.js`);
          },
        },
      ],
    };
  }
  
  // Режим 'client' (по умолчанию) - билдим ассеты для Cloudflare Pages
  return {
    root: '.',
    publicDir: false, // Не копируем public/ (admin/ не нужен в production)
    build: {
      outDir: `${PROJECT_ID}/client`, // Используем имя проекта + /client вместо dist/client
      emptyOutDir: true,
      rollupOptions: {
      input: buildInput(),
      output: {
        // Плоская структура: css/ и js/ в корне dist
        entryFileNames: (chunkInfo) => {
          // Используем facadeModuleId для определения исходного файла
          let moduleId = chunkInfo.facadeModuleId || '';
          
          // Если нет facadeModuleId, используем name и парсим его
          if (!moduleId && chunkInfo.name) {
            moduleId = chunkInfo.name;
          }
          
          // Нормализуем путь
          moduleId = moduleId.replace(/\\/g, '/');
          
          // Функция для извлечения чистого имени файла из пути
          const getCleanFileName = (path) => {
            // Извлекаем имя файла из пути
            let fileName = path.split('/').pop() || 'file';
            // Убираем расширение
            fileName = fileName.replace(/\.(scss|css|js)$/, '');
            // Убираем суффиксы типа "2", "3" в конце имени (но не в середине)
            fileName = fileName.replace(/(\w+)(\d+)$/, '$1');
            return fileName.toLowerCase();
          };
          
          // Определяем тип файла по расширению или пути
          const isCss = moduleId.endsWith('.scss') || 
                       moduleId.endsWith('.css') || 
                       moduleId.includes('/scss/') ||
                       moduleId.includes('style') ||
                       (chunkInfo.isEntry && moduleId.includes('.scss'));
          
          if (isCss) {
            const fileName = getCleanFileName(moduleId);
            return `css/${fileName}.css`;
          } else {
            const fileName = getCleanFileName(moduleId);
            return `js/${fileName}.js`;
          }
        },
        // Имена чанков (для зависимостей)
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || 'chunk';
          if (name.endsWith('.css')) {
            const fileName = name.split('/').pop();
            return `css/${fileName}`;
          }
          const fileName = name.split('/').pop() || 'chunk';
          return `js/${fileName}`;
        },
        // Группируем зависимости в отдельные чанки только если они большие
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          // Статические файлы (картинки, шрифты и т.д.)
          if (assetInfo.name) {
            const ext = assetInfo.name.split('.').pop()?.toLowerCase();
            // Изображения и шрифты в assets/
            if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
              const fileName = assetInfo.name.split('/').pop();
              return `assets/${fileName}`;
            }
            // CSS файлы
            if (ext === 'css') {
              const fileName = assetInfo.name.split('/').pop();
              return `css/${fileName}`;
            }
          }
          // Остальное в assets/
          const fileName = assetInfo.name?.split('/').pop() || 'asset';
          return `assets/${fileName}`;
        },
      },
    },
  },
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js', // Используем отдельный конфиг PostCSS
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [],
        loadPaths: [
          resolve(__dirname, '.'),
          resolve(__dirname, 'src/client/scss')
        ],
        additionalData: (content, loaderContext) => {
          // Используем относительный путь от корня проекта
          return `
            @use "sass:math";
            @use "includes/index.scss" as *;
            ${content}
          `;
        },
        sourceMap: true,
        quietDeps: true,
        api: 'modern-compiler'
      },
    },
  },
  // Плагины для оптимизации CSS в production
  plugins: [
    // Автоматическое определение общих компонентов
    {
      name: 'auto-detect-common-components',
      enforce: 'pre',
      buildStart() {
        generateComponentsIndex();
      },
      // Отслеживаем изменения в папке components
      apply: 'serve',
      configureServer(server) {
        server.watcher.on('add', (path) => {
          if (path.includes('src/components/') && path.endsWith('.init.js')) {
            generateComponentsIndex();
          }
        });
        server.watcher.on('unlink', (path) => {
          if (path.includes('src/components/') && path.endsWith('.init.js')) {
            generateComponentsIndex();
          }
        });
        server.watcher.on('change', (path) => {
          if (path.includes('src/components/') && path.endsWith('.init.js')) {
            generateComponentsIndex();
          }
        });
      },
    },
    // Переименование файлов: убираем суффиксы "2", "3" и т.д.
    ...(process.env.NODE_ENV === 'production' ? [{
      name: 'rename-files-remove-suffixes',
      enforce: 'post',
      closeBundle() {
        const distDir = resolve(__dirname, PROJECT_ID, 'client');
        
        // Функция для рекурсивного поиска файлов
        function findFiles(dir, extensions) {
          const files = [];
          try {
            const entries = readdirSync(dir);
            for (const entry of entries) {
              const fullPath = join(dir, entry);
              const stat = statSync(fullPath);
              if (stat.isDirectory()) {
                files.push(...findFiles(fullPath, extensions));
              } else if (extensions.some(ext => entry.endsWith(ext))) {
                files.push(fullPath);
              }
            }
          } catch (error) {
            // Игнорируем ошибки
          }
          return files;
        }
        
        // Находим все CSS и JS файлы
        const files = findFiles(distDir, ['.css', '.js']);
        
        // Переименовываем файлы, убирая суффиксы
        for (const filePath of files) {
          const dir = resolve(filePath, '..'); // Используем path для определения директории
          const fileName = filePath.split(/[\\/]/).pop();
          
          // Убираем суффиксы типа "2", "3" перед расширением (например: style2.css -> style.css)
          const newFileName = fileName.replace(/(\w+)(\d+)\.(css|js)$/, '$1.$3');
          
          if (newFileName !== fileName) {
            const newPath = join(dir, newFileName);
            try {
              // Проверяем, существует ли уже файл с правильным именем
              let targetExists = false;
              try {
                statSync(newPath);
                targetExists = true;
              } catch {
                // Файла с правильным именем нет
              }
              
              if (targetExists) {
                // Файл уже существует - удаляем дубликат с суффиксом
                try {
                  unlinkSync(filePath);
                  console.log(`✓ Удален дубликат: ${fileName} -> ${newFileName}`);
                } catch (err) {
                  console.warn(`Не удалось удалить ${filePath}:`, err.message);
                }
              } else {
                // Файла с правильным именем нет - переименовываем
                const content = readFileSync(filePath);
                writeFileSync(newPath, content);
                // Удаляем старый файл
                try {
                  unlinkSync(filePath);
                  console.log(`✓ Переименован: ${fileName} -> ${newFileName}`);
                } catch (err) {
                  console.warn(`Не удалось удалить старый файл ${filePath}:`, err.message);
                }
              }
            } catch (error) {
              // Игнорируем ошибки переименования
              console.warn(`Не удалось переименовать ${filePath}:`, error.message);
            }
          }
        }
      },
    }] : []),
    // Группировка и сортировка media queries после сборки
    ...(process.env.NODE_ENV === 'production' ? [{
      name: 'postcss-optimize-media-queries',
      enforce: 'post',
      closeBundle: {
        order: 'post',
        handler() {
          const distDir = resolve(__dirname, PROJECT_ID, 'client');
          const cssFiles = [];

          // Рекурсивно находим все CSS файлы
          function findCssFiles(dir) {
            try {
              const entries = readdirSync(dir);
              for (const entry of entries) {
                const fullPath = join(dir, entry);
                const stat = statSync(fullPath);
                if (stat.isDirectory()) {
                  findCssFiles(fullPath);
                } else if (entry.endsWith('.css')) {
                  cssFiles.push(fullPath);
                }
              }
            } catch (error) {
              // Игнорируем ошибки
            }
          }

          findCssFiles(distDir);

          // Оптимизируем каждый CSS файл
          for (const cssFile of cssFiles) {
            try {
              const css = readFileSync(cssFile, 'utf8');

              // postcss.process синхронный, но возвращает Result объект
              const result = postcss()
                .use(combineMediaQuery())
                .use(sortMediaQueries({ sort: 'desktop-first' }))
                .process(css, { from: cssFile, to: cssFile });

              writeFileSync(cssFile, result.css, 'utf8');
            } catch (error) {
              console.warn(`Ошибка при оптимизации ${cssFile}:`, error.message);
            }
          }
        },
      },
    }] : []),
  ],
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: false,
    },
    // В dev режиме Vite должен обслуживать файлы из src/
    fs: {
      // Разрешаем обслуживать файлы из корня проекта
      allow: ['..'],
    },
  },
  };
}); 