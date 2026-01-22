import { getOptimizedImage } from '@agency/core';
import { Hono } from 'hono';
import adminConfigYml from './admin/config.yml.js';
import adminIndexHtml from './admin/index.html.js';
import { Layout } from './components/Layout.js';
import { About } from './pages/About/About.js';
import { Home } from './pages/Home/Home.js';
import { getPageAssets } from './utils/pageAssets.js';

// ============================================================================
// 1. DATABASE DURABLE OBJECT (Сверхбыстрый кэш)
// ============================================================================
export class Database {
  constructor(state, env) {
    this.storage = state.storage;
    this.env = env; // Сохраняем env для доступа к ADMIN_API_KEY
    this.settingsCache = null;
    this.cacheExpiry = 0;
  }

  async getSettings() {
    const now = Date.now();
    if (this.settingsCache && now < this.cacheExpiry) return this.settingsCache;

    try {
      const cursor = this.storage.sql.exec('SELECT key, value FROM site_settings');
      const results = Array.from(cursor);
      const settings = {};
      results.forEach(r => settings[r.key] = r.value);

      ['pages.home', 'pages.about'].forEach(key => {
        if (settings[key]) {
          try { settings[key] = JSON.parse(settings[key]); } catch(e) {}
        }
      });

      this.settingsCache = settings;
      this.cacheExpiry = now + (5 * 60 * 1000); 
      return settings;
    } catch (e) {
      return {};
    }
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/settings') return Response.json(await this.getSettings());
    
    if (url.pathname === '/invalidate') {
      const key = request.headers.get('X-API-Key');
      // Безопасность: проверка ключа внутри изолята базы
      if (!key || key !== this.env.ADMIN_API_KEY) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      this.settingsCache = null;
      return Response.json({ success: true });
    }

    try {
      const { sql, params = [] } = await request.json();
      const cursor = this.storage.sql.exec(sql, ...params);
      return Response.json({ results: Array.from(cursor) });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  }
}

// ============================================================================
// 2. УНИВЕРСАЛЬНЫЙ АДАПТЕР (Работает с D1 и Durable Objects)
// ============================================================================
function createD1Adapter(dbBinding, adminKey) {
  // Проверяем тип: D1 database или Durable Object namespace
  const isD1 = dbBinding && typeof dbBinding.prepare === 'function';
  const isDO = dbBinding && typeof dbBinding.idFromName === 'function';

  // Режим D1 (локальная разработка через wrangler dev)
  if (isD1) {
    // Простой кэш для settings (в памяти, без инвалидации через DO)
    let settingsCache = null;
    let cacheExpiry = 0;
    let tablesInitialized = false;

    // Автоматическая инициализация таблиц при первом использовании
    const ensureTables = async () => {
      if (tablesInitialized) return;
      try {
        await dbBinding.prepare(`CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`).run();
        await dbBinding.prepare(`CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL)`).run();
        await dbBinding.prepare(`CREATE TABLE IF NOT EXISTS technologies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, category TEXT, icon TEXT)`).run();
        tablesInitialized = true;
      } catch (e) {
        // Игнорируем ошибки (таблицы уже могут существовать)
      }
    };

    const getSettings = async () => {
      await ensureTables();
      const now = Date.now();
      if (settingsCache && now < cacheExpiry) return settingsCache;

      try {
        const result = await dbBinding.prepare('SELECT key, value FROM site_settings').all();
        const settings = {};
        (result.results || []).forEach(r => settings[r.key] = r.value);

        ['pages.home', 'pages.about'].forEach(key => {
          if (settings[key]) {
            try { settings[key] = JSON.parse(settings[key]); } catch(e) {}
          }
        });

        settingsCache = settings;
        cacheExpiry = now + (5 * 60 * 1000);
        return settings;
      } catch (e) {
        return {};
      }
    };

    const prepare = (sql) => {
      // Автоматически инициализируем таблицы перед любым запросом
      ensureTables().catch(() => {});
      return dbBinding.prepare(sql);
    };

    return {
      getSettings,
      invalidateCache: () => { settingsCache = null; cacheExpiry = 0; },
      prepare,
    };
  }

  // Режим Durable Objects (production на VPS через workerd)
  if (isDO) {
    const execute = async (path, body = null, needsAuth = false) => {
      const dbId = dbBinding.idFromName('main-database');
      const stub = dbBinding.get(dbId);
      
      const headers = { "Content-Type": "application/json" };
      if (needsAuth) headers["X-API-Key"] = adminKey;

      const response = await stub.fetch(`http://db.local${path}`, {
        method: 'POST',
        body: body ? JSON.stringify(body) : null,
        headers
      });
      if (!response.ok) throw new Error(`DB Error: ${await response.text()}`);
      return await response.json();
    };

    return {
      getSettings: () => execute('/settings'),
      invalidateCache: () => execute('/invalidate', null, true),
      prepare: (sql) => ({
        bind: (...params) => ({
          all: () => execute('/', { sql, params }),
          first: async () => (await execute('/', { sql, params })).results?.[0] || null,
          run: () => execute('/', { sql, params }),
        }),
        all: () => execute('/', { sql, params: [] }),
        first: async () => (await execute('/', { sql, params: [] })).results?.[0] || null,
        run: () => execute('/', { sql, params: [] }),
      })
    };
  }

  throw new Error('DB binding must be either D1 database or Durable Object namespace');
}

const app = new Hono();

app.use('*', async (c, next) => {
  if (!c.env.DB) return c.text('Database Binding Missing', 503);
  c.set('db', createD1Adapter(c.env.DB, c.env.ADMIN_API_KEY));
  await next();
});

// ============================================================================
// 3. РОУТЫ (Полный комплект)
// ============================================================================

app.get('/admin', (c) => c.redirect('/admin/'));
app.get('/admin/', (c) => c.html(adminIndexHtml));
app.get('/admin/config.yml', () => {
  return new Response(adminConfigYml, {
    headers: {
      'content-type': 'text/yaml; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
});

app.get('/', async (c) => {
  const db = c.get('db');
  const [settings, postsRes] = await Promise.all([
    db.getSettings(),
    db.prepare('SELECT * FROM posts ORDER BY id DESC LIMIT 10').all()
  ]);
  const assets = getPageAssets('./pages/Home/Home.js', c);
  return c.html(Layout({
    children: Home({ 
      posts: postsRes.results || [], 
      pageTitle: settings['pages.home']?.title || 'Home',
      img: (u, o) => getOptimizedImage(u, o, c) 
    }),
    title: `${settings['pages.home']?.title || 'Home'} - ${settings['site.title'] || 'Agency'}`,
    c, pageScript: assets.pageScript, pageStyle: assets.pageStyle
  }));
});

app.get('/about', async (c) => {
  const db = c.get('db');
  const [settings, techRes] = await Promise.all([
    db.getSettings(),
    db.prepare('SELECT * FROM technologies ORDER BY category').all()
  ]);
  const assets = getPageAssets('./pages/About/About.js', c);
  return c.html(Layout({
    children: About({ 
      technologies: techRes.results || [], 
      pageTitle: settings['pages.about']?.title || 'About',
      img: (u, o) => getOptimizedImage(u, o, c)
    }),
    title: `${settings['pages.about']?.title || 'About'} - ${settings['site.title'] || 'Agency'}`,
    c, pageScript: assets.pageScript, pageStyle: assets.pageStyle
  }));
});

app.get('/api/init-db', async (c) => {
  if (c.req.header('X-API-Key') !== c.env.ADMIN_API_KEY) return c.json({ error: '403' }, 403);
  const db = c.get('db');
  await db.prepare(`CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS technologies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, category TEXT, icon TEXT)`).run();
  return c.json({ success: true });
});

app.post('/api/admin/sync-content', async (c) => {
  if (c.req.header('X-API-Key') !== c.env.ADMIN_API_KEY) return c.json({ error: '403' }, 403);

  const db = c.get('db');
  const content = await c.req.json();

  // Ensure tables exist (compatible with current queries)
  await db.prepare(`CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS technologies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, category TEXT, icon TEXT)`).run();

  const now = new Date().toISOString();

  // site_settings
  if (content?.site?.title) {
    await db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)').bind('site.title', String(content.site.title)).run();
  }
  if (content?.site?.description) {
    await db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)').bind('site.description', String(content.site.description)).run();
  }

  if (content?.pages && typeof content.pages === 'object') {
    for (const [pageKey, pageData] of Object.entries(content.pages)) {
      await db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)').bind(
        `pages.${pageKey}`,
        JSON.stringify(pageData)
      ).run();
    }
  }

  // posts
  let postsWritten = 0;
  if (Array.isArray(content?.posts)) {
    await db.prepare('DELETE FROM posts').run();
    for (const post of content.posts) {
      const title = post?.title ? String(post.title) : '';
      const body = post?.content ? String(post.content) : '';
      if (!title && !body) continue;
      await db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').bind(title, body).run();
      postsWritten += 1;
    }
  }

  // technologies
  let technologiesWritten = 0;
  if (Array.isArray(content?.technologies)) {
    await db.prepare('DELETE FROM technologies').run();
    for (const tech of content.technologies) {
      const name = tech?.name ? String(tech.name) : '';
      if (!name) continue;
      const description = tech?.description ? String(tech.description) : null;
      const category = tech?.category ? String(tech.category) : null;
      const icon = tech?.icon ? String(tech.icon) : null;
      await db.prepare('INSERT INTO technologies (name, description, category, icon) VALUES (?, ?, ?, ?)').bind(
        name,
        description,
        category,
        icon
      ).run();
      technologiesWritten += 1;
    }
  }

  // Invalidate settings cache inside DO
  try {
    await db.invalidateCache();
  } catch {
    // ignore
  }

  return c.json({
    success: true,
    at: now,
    postsWritten,
    technologiesWritten,
  });
});

app.get('/api/settings', async (c) => c.json(await c.get('db').getSettings()));

app.get('/api/image', (c) => {
  const url = c.req.query('url');
  if (!url) return c.json({ error: 'No URL' }, 400);
  return c.json({ url: getOptimizedImage(url, { w: c.req.query('w') }, c) });
});

export default app;
