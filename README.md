# Example Client - Hono + Vite + Wrangler

Проект на стеке Hono (SSR) + Vite (ассеты) + Wrangler (workerd) для Cloudflare Workers.

## 🏗️ Архитектура

- **VPS (Hetzner)**: workerd + Hono для SSR (рендеринг HTML)
- **Cloudflare Pages**: статические ассеты (CSS/JS)
- **GitHub Actions**: автоматический деплой при пуше

## 📁 Структура проекта

```
example-client/
├── src/                    # Исходники
│   ├── index.js           # Hono сервер (SSR)
│   ├── components/        # Компоненты (Header, Footer, Layout)
│   ├── pages/             # Страницы (Home, About)
│   ├── client/            # Глобальные стили и JS
│   └── utils/             # Утилиты
├── dist/                   # Собранные файлы (не коммитится)
│   ├── client/            # Для Cloudflare Pages
│   │   ├── css/           # Скомпилированные стили
│   │   └── js/            # Скомпилированные скрипты
│   └── server/            
│       └── worker.js      # Один файл для VPS (workerd)
└── .github/workflows/      # GitHub Actions
```

## 🚀 Команды

```bash
# Локальная разработка
npm run dev              # Vite (5173) + Wrangler (8787)

# Сборка
npm run build            # Оба билда (client + server)
npm run build:client     # Только ассеты для Pages
npm run build:server     # Только worker.js для VPS

# Деплой
npm run deploy:all       # Собрать и отправить статику в CDN + worker на VPS
```

## 📋 План настройки двух сред

### 1️⃣ Cloudflare Pages (статичные ассеты)

**Шаг 1: Создать проект**
- Зайти в [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
- Создать новый проект: `example-client`
- Запомнить URL проекта (например: `https://example-client.pages.dev`)

**Шаг 2: Настроить GitHub Secrets**
В настройках репозитория → Secrets and variables → Actions:
- `CLOUDFLARE_API_TOKEN` — API токен Cloudflare
- `CLOUDFLARE_ACCOUNT_ID` — Account ID (справа внизу в Dashboard)

**Шаг 3: Получить API токен**
- Cloudflare Dashboard → My Profile → API Tokens
- Создать токен с правами:
  - `Account.Cloudflare Pages:Edit`
  - `Zone.Zone:Read` (если нужен)

**Результат**: При пуше в `main` автоматически деплоится `dist/client/` в Cloudflare Pages

---

### 2️⃣ Hetzner VPS (workerd + Hono)

**Шаг 1: Установить workerd на VPS**
```bash
# На VPS
# Скачать бинарник workerd с GitHub
# Или собрать из исходников (см. https://github.com/cloudflare/workerd)
```

**Шаг 2: Создать конфиг workerd**
Создать файл `workerd.capnp` на VPS (например, в `/app/projects/example-client/`):

```capnp
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "main", worker = .mainWorker),
  ],

  sockets = [
    ( name = "http",
      address = "*:80",
      http = (),
      service = "main"
    ),
  ]
);

const mainWorker :Workerd.Worker = (
  serviceWorkerScript = embed "worker.js",
  compatibilityDate = "2024-01-01",
  
  bindings = [
    # URL к Cloudflare Pages (статике)
    (name = "ASSETS_URL", text = "https://example-client.pages.dev"),
    
    # Окружение
    (name = "ENVIRONMENT", text = "production"),
    
    # URL для R2 (если используется)
    (name = "R2_PUBLIC_URL", text = "https://cdn.example-client.com"),
  ],
);
```

**Шаг 3: Настроить systemd сервис**
Создать `/etc/systemd/system/workerd.service`:

```ini
[Unit]
Description=workerd runtime
After=network-online.target
Requires=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/workerd serve /app/projects/example-client/workerd.capnp
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Запустить:
```bash
sudo systemctl daemon-reload
sudo systemctl enable workerd
sudo systemctl start workerd
```

**Шаг 4: Настроить GitHub Secrets**
В настройках репозитория → Secrets and variables → Actions:
- `VPS_HOST` — IP или домен VPS (например: `123.45.67.89`)
- `VPS_USERNAME` — пользователь SSH (например: `root` или `deploy`)
- `VPS_SSH_KEY` — приватный SSH ключ для доступа к VPS
- `VPS_WORKER_PATH` — путь к папке с worker.js (например: `/app/projects/example-client`)

**Шаг 5: Обновить workflow**
В `.github/workflows/deploy.yml` (строка 51) заменить путь на реальный:
```yaml
${{ secrets.VPS_WORKER_PATH }}/worker.js
```

**Результат**: При пуше в `main` автоматически деплоится `worker.js` на VPS, workerd подхватит изменения (hot reload)

---

## 🔧 Переменные окружения

### Development (локально)
В `wrangler.toml`:
```toml
[vars]
ENVIRONMENT = "development"
ASSETS_URL = "http://localhost:5173"
```

### Production (VPS)
В `workerd.capnp`:
```capnp
bindings = [
  (name = "ASSETS_URL", text = "https://example-client.pages.dev"),
  (name = "ENVIRONMENT", text = "production"),
]
```

---

## 📝 Чеклист перед деплоем

- [ ] Создан проект в Cloudflare Pages
- [ ] Настроены GitHub Secrets для Cloudflare
- [ ] Установлен workerd на VPS
- [ ] Создан `workerd.capnp` на VPS
- [ ] Настроен systemd сервис для workerd
- [ ] Настроены GitHub Secrets для VPS
- [ ] Обновлен путь `VPS_WORKER_PATH` в workflow
- [ ] Указан правильный `ASSETS_URL` в `workerd.capnp` (URL Cloudflare Pages)
- [ ] Протестирован локальный билд (`npm run build`)

---

## 🐛 Troubleshooting

### Workerd не подхватывает изменения
- Проверь права на файл `worker.js`
- Проверь логи: `sudo journalctl -u workerd -f`

### Ассеты не загружаются
- Проверь `ASSETS_URL` в `workerd.capnp` (должен быть URL Cloudflare Pages)
- Проверь, что файлы задеплоились в Pages

### Ошибки деплоя
- Проверь GitHub Secrets
- Проверь SSH ключ и доступ к VPS
- Проверь логи в GitHub Actions

---

## 📚 Полезные ссылки

- [Workerd GitHub](https://github.com/cloudflare/workerd)
- [Hono Documentation](https://hono.dev)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Vite Documentation](https://vitejs.dev)
