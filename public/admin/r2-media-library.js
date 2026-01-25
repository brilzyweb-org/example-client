// Кастомный Media Library для Decap CMS с интеграцией R2
// Использует /api/media/upload endpoint для загрузки изображений в R2

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
      
      if (result.success && result.url) {
        return {
          url: result.url,
          path: result.path,
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
    // Опционально: можно добавить endpoint для удаления файлов из R2
    console.log('Delete not implemented for R2 media library');
    return Promise.resolve();
  };

  R2MediaLibrary.prototype.list = function() {
    // Опционально: можно добавить endpoint для получения списка файлов из R2
    return Promise.resolve([]);
  };

  // Регистрируем кастомный media library в Decap CMS
  // Ждем загрузки Decap CMS, если он еще не загружен
  function registerMediaLibrary() {
    if (typeof window !== 'undefined' && window.CMS && window.CMS.registerMediaLibrary) {
      window.CMS.registerMediaLibrary(R2MediaLibrary, {
        name: 'r2',
      });
      console.log('R2 Media Library зарегистрирован');
    } else {
      // Если CMS еще не загружен, ждем
      setTimeout(registerMediaLibrary, 100);
    }
  }

  // Пробуем зарегистрировать сразу
  registerMediaLibrary();

  // Также слушаем событие загрузки CMS
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', registerMediaLibrary);
    // Если скрипт загрузился после DOMContentLoaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      registerMediaLibrary();
    }
  }
})();
