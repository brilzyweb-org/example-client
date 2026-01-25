// Кастомный Media Library для Decap CMS с интеграцией R2
// 
// ВАЖНО: Этот media library перехватывает ВСЕ операции с изображениями
// и перенаправляет их на Cloudflare R2 bucket, а НЕ в Git репозиторий.
//
// Архитектура:
// - Текстовый контент (JSON) -> Git (Gitea) -> SQLite на VPS
// - Изображения -> R2 bucket -> относительные пути в JSON
//
// При загрузке изображения:
// 1. Файл загружается в R2: agency-media-bucket/{projectId}/images/{filename}
// 2. В JSON сохраняется только относительный путь: {projectId}/images/{filename}
// 3. Файл НЕ сохраняется в Git репозиторий
//
// Использует /api/media/upload, /api/media/delete, /api/media/list endpoints

(function() {
  'use strict';

  function R2MediaLibrary({ config, options }) {
    this.config = config || {};
    this.options = options || {};
  }

  R2MediaLibrary.prototype.init = function({ config, options }) {
    this.config = config || {};
    this.options = options || {};
  };

  R2MediaLibrary.prototype.upload = async function(file, progressCallback) {
    try {
      // Получаем API key из конфигурации или используем дефолтный
      const apiKey = this.config.apiKey || 'FINLAND_SUPER_SECRET_2026';
      
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);

      // Отправляем запрос на наш endpoint
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.path) {
        // ВАЖНО: Возвращаем относительный путь R2, а НЕ полный URL
        // Пример: "example-client/images/1234567890-abc123.jpg"
        // 
        // Decap CMS сохранит этот путь в JSON (content.json в Git)
        // Но сам файл НЕ будет сохранен в Git - он уже в R2!
        // 
        // При рендеринге страницы imageOptimizer.js преобразует этот путь
        // в полный URL: https://media.brilzy.com/example-client/images/...
        return {
          url: result.path,  // Относительный путь R2 для сохранения в JSON
          path: result.path, // Дублируем для совместимости
          fileName: result.fileName,
        };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('R2 upload error:', error);
      throw error;
    }
  };

  R2MediaLibrary.prototype.delete = async function(file) {
    try {
      // Получаем API key из конфигурации или используем дефолтный
      const apiKey = this.config.apiKey || 'FINLAND_SUPER_SECRET_2026';
      
      // file может быть объектом с url, path или строкой
      const filePath = file?.path || file?.url || file;
      
      if (!filePath) {
        throw new Error('No file path provided');
      }

      // Отправляем запрос на удаление файла из R2
      const response = await fetch('/api/media/delete', {
        method: 'DELETE',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: filePath }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      const result = await response.json();
      
      if (result.success) {
        return result;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('R2 delete error:', error);
      throw error;
    }
  };

  R2MediaLibrary.prototype.list = async function() {
    try {
      // Получаем API key из конфигурации или используем дефолтный
      const apiKey = this.config.apiKey || 'FINLAND_SUPER_SECRET_2026';
      
      // Отправляем запрос на получение списка файлов из R2
      const response = await fetch('/api/media/list', {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'List failed');
      }

      const result = await response.json();
      
      if (result.success && Array.isArray(result.files)) {
        return result.files;
      } else {
        return [];
      }
    } catch (error) {
      console.error('R2 list error:', error);
      return [];
    }
  };

  R2MediaLibrary.prototype.show = function() {
    // Метод для отображения media library в UI
    // Показывает галерею существующих файлов из R2 и позволяет загружать новые
    return new Promise((resolve) => {
      // Создаем модальное окно для галереи
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        padding: 20px;
        overflow-y: auto;
      `;

      const container = document.createElement('div');
      container.style.cssText = `
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        padding: 20px;
        position: relative;
      `;

      const header = document.createElement('div');
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
      `;

      const title = document.createElement('h2');
      title.textContent = 'Медиа библиотека R2';
      title.style.cssText = 'margin: 0; font-size: 24px;';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        background: #f44336;
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
      `;
      closeBtn.onclick = () => {
        document.body.removeChild(modal);
        resolve(null);
      };

      header.appendChild(title);
      header.appendChild(closeBtn);

      const uploadBtn = document.createElement('button');
      uploadBtn.textContent = '+ Загрузить новое изображение';
      uploadBtn.style.cssText = `
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 20px;
      `;

      const gallery = document.createElement('div');
      gallery.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        margin-top: 20px;
      `;

      const loading = document.createElement('div');
      loading.textContent = 'Загрузка файлов из R2...';
      loading.style.cssText = 'text-align: center; padding: 40px; color: #666;';
      gallery.appendChild(loading);

      // Загружаем список файлов из R2
      this.list().then(files => {
        gallery.innerHTML = '';
        
        if (files.length === 0) {
          const empty = document.createElement('div');
          empty.textContent = 'Нет загруженных изображений';
          empty.style.cssText = 'text-align: center; padding: 40px; color: #999;';
          gallery.appendChild(empty);
        } else {
          files.forEach(file => {
            const item = document.createElement('div');
            item.style.cssText = `
              border: 2px solid #e0e0e0;
              border-radius: 4px;
              overflow: hidden;
              cursor: pointer;
              transition: border-color 0.2s;
            `;
            item.onmouseover = () => item.style.borderColor = '#4CAF50';
            item.onmouseout = () => item.style.borderColor = '#e0e0e0';

            const img = document.createElement('img');
            img.src = file.publicUrl || `https://media.brilzy.com/${file.path}`;
            img.style.cssText = `
              width: 100%;
              height: 150px;
              object-fit: cover;
              display: block;
            `;
            img.onerror = () => {
              img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect fill="%23ddd" width="150" height="150"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999">No image</text></svg>';
            };

            const name = document.createElement('div');
            name.textContent = file.fileName || file.path.split('/').pop();
            name.style.cssText = `
              padding: 8px;
              font-size: 12px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              background: #f5f5f5;
            `;

            item.appendChild(img);
            item.appendChild(name);
            item.onclick = () => {
              document.body.removeChild(modal);
              resolve({
                url: file.path,  // Относительный путь для сохранения в БД
                path: file.path,
                fileName: file.fileName,
              });
            };
            gallery.appendChild(item);
          });
        }
      }).catch(error => {
        gallery.innerHTML = '';
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Ошибка загрузки файлов: ' + error.message;
        errorMsg.style.cssText = 'text-align: center; padding: 40px; color: #f44336;';
        gallery.appendChild(errorMsg);
      });

      // Обработчик загрузки нового файла
      uploadBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              const result = await this.upload(file);
              document.body.removeChild(modal);
              resolve(result);
            } catch (error) {
              console.error('Upload error:', error);
              alert('Ошибка загрузки: ' + error.message);
            }
          }
        };
        input.click();
      };

      container.appendChild(header);
      container.appendChild(uploadBtn);
      container.appendChild(gallery);
      modal.appendChild(container);
      document.body.appendChild(modal);
    });
  };

  // Регистрируем кастомный media library в Decap CMS
  function registerMediaLibrary() {
    if (typeof window !== 'undefined' && window.CMS && window.CMS.registerMediaLibrary) {
      try {
        window.CMS.registerMediaLibrary(R2MediaLibrary, {
          name: 'r2',
        });
        console.log('✅ R2 Media Library зарегистрирован');
        return true;
      } catch (error) {
        console.error('❌ Ошибка регистрации R2 Media Library:', error);
        return false;
      }
    }
    return false;
  }

  // Регистрируем после полной загрузки страницы
  if (typeof window !== 'undefined') {
    // Пробуем зарегистрировать сразу (если CMS уже загружен)
    if (!registerMediaLibrary()) {
      // Если не получилось, ждем события инициализации CMS
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(registerMediaLibrary, 500);
      });

      // Также слушаем событие инициализации Decap CMS
      document.addEventListener('cms:init', () => {
        registerMediaLibrary();
      });

      // Fallback: проверяем каждые 200ms до 5 секунд
      let attempts = 0;
      const maxAttempts = 25;
      const checkInterval = setInterval(() => {
        attempts++;
        if (registerMediaLibrary() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
        }
      }, 200);
    }
  }
})();
