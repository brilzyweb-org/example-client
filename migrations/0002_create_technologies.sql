-- Создание таблицы technologies для страницы "О нас"
CREATE TABLE IF NOT EXISTS technologies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Вставка данных о технологиях
INSERT INTO technologies (name, description, category, icon) VALUES
  ('Hono', 'Быстрый веб-фреймворк для Cloudflare Workers', 'Framework', '⚡'),
  ('Vite', 'Современный сборщик ассетов с горячей перезагрузкой', 'Build Tool', '🚀'),
  ('Wrangler', 'Инструмент для разработки и деплоя Cloudflare Workers', 'Tool', '☁️'),
  ('D1', 'SQLite база данных от Cloudflare с глобальной репликацией', 'Database', '💾'),
  ('Sass', 'Мощный препроцессор CSS с переменными и миксинами', 'Styling', '🎨'),
  ('Cloudflare Workers', 'Edge computing платформа для запуска кода на границе сети', 'Platform', '🌐');
