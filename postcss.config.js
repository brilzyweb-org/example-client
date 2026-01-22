/**
 * PostCSS конфигурация для оптимизации CSS
 * Vite автоматически подхватывает этот файл
 */

export default {
  plugins: {
    // Автопрефиксы для браузеров (добавляет -webkit-, -moz- и т.д.)
    autoprefixer: {},
    
    // Минификация CSS (только в production)
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
        }],
      },
    } : {}),
  },
};
