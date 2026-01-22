-- Создание таблицы site_settings для синхронизации контента из Gitea
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
