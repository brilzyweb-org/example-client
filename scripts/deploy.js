import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { platform } from 'os';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(__dirname, '..');
const agencyConfigPath = join(projectRoot, 'agency-config.json');

// Читаем конфиг проекта
const agencyConfig = JSON.parse(readFileSync(agencyConfigPath, 'utf-8'));
const projectId = agencyConfig.id;

async function deploy() {
  console.log(`🚀 Деплой проекта: ${projectId}\n`);

  // 1. Сборка проекта
  console.log('📦 Сборка проекта...');
  try {
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✅ Проект собран\n');
  } catch (error) {
    console.error('❌ Ошибка сборки:', error.message);
    process.exit(1);
  }

  // 2. Отправка статики в CDN репозиторий через GitHub API
  const clientDir = join(projectRoot, projectId, 'client');
  const githubToken = process.env.GITHUB_TOKEN;
  const cdnRepo = process.env.CDN_REPO || 'brilzyweb/cdn-assets'; // Формат: owner/repo
  const [repoOwner, repoName] = cdnRepo.split('/');
  const branch = process.env.CDN_BRANCH || 'main';

  console.log(`📤 Отправка статики в CDN репозиторий: ${repoOwner}/${repoName} (ветка: ${branch})...`);

  if (!githubToken) {
    console.error('❌ GITHUB_TOKEN не установлен');
    console.log('💡 Установи переменную: GITHUB_TOKEN (из Organization Secret: CDN_GITHUB_TOKEN)');
    console.log('💡 Получи токен у администратора (ограниченный доступ только к CDN репозиторию)');
    console.log('💡 Или создай Personal Access Token с правами только на CDN репозиторий');
    process.exit(1);
  }

  if (!repoOwner || !repoName) {
    console.error('❌ CDN_REPO указан неверно');
    console.log('💡 Установи переменную: CDN_REPO=owner/repo (например: brilzyweb/cdn-assets)');
    process.exit(1);
  }

  // Функция для рекурсивного чтения файлов из папки
  function readFilesRecursive(dir, basePath = '') {
    const files = [];
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      const relativePath = basePath ? `${basePath}/${entry}` : entry;
      
      if (stat.isDirectory()) {
        files.push(...readFilesRecursive(fullPath, relativePath));
      } else {
        const content = readFileSync(fullPath);
        files.push({
          path: `${projectId}/${relativePath}`,
          content: content.toString('base64'),
          size: stat.size
        });
      }
    }
    
    return files;
  }

  try {
  // Читаем все файлы из папки client
  const files = readFilesRecursive(clientDir);
  console.log(`   Найдено ${files.length} файлов для загрузки\n`);
  
  // Получаем SHA последнего коммита
  const refResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/${branch}`, {
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!refResponse.ok) {
    throw new Error(`Не удалось получить ref: ${refResponse.statusText}`);
  }
  
  const refData = await refResponse.json();
  const baseSha = refData.object.sha;
  
  // Получаем SHA дерева последнего коммита
  const commitResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/commits/${baseSha}`, {
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  const commitData = await commitResponse.json();
  const baseTreeSha = commitData.tree.sha;
  
  // Создаем blobs для всех файлов
  console.log('   Создание blobs...');
  const tree = [];
  
  for (const file of files) {
    const blobResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: file.content,
        encoding: 'base64'
      })
    });
    
    if (!blobResponse.ok) {
      throw new Error(`Не удалось создать blob для ${file.path}: ${blobResponse.statusText}`);
    }
    
    const blobData = await blobResponse.json();
    tree.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha
    });
  }
  
  // Создаем новое дерево
  console.log('   Создание дерева...');
  const treeResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: tree
    })
  });
  
  if (!treeResponse.ok) {
    throw new Error(`Не удалось создать дерево: ${treeResponse.statusText}`);
  }
  
  const treeData = await treeResponse.json();
  
  // Создаем коммит
  console.log('   Создание коммита...');
  const commitResponse2 = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Deploy ${projectId} assets`,
      tree: treeData.sha,
      parents: [baseSha]
    })
  });
  
  if (!commitResponse2.ok) {
    throw new Error(`Не удалось создать коммит: ${commitResponse2.statusText}`);
  }
  
  const commitData2 = await commitResponse2.json();
  
  // Обновляем ref
  console.log('   Обновление ветки...');
  const updateRefResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sha: commitData2.sha
    })
  });
  
  if (!updateRefResponse.ok) {
    throw new Error(`Не удалось обновить ref: ${updateRefResponse.statusText}`);
  }
  
    console.log('✅ Статика отправлена в GitHub через API\n');
  } catch (error) {
    console.error('❌ Ошибка при отправке в GitHub:', error.message);
    process.exit(1);
  }

  // 4. Отправка worker на VPS
  const workerPath = join(projectRoot, projectId, 'server', 'worker.js');
  const vpsHost = process.env.VPS_HOST;
  const vpsUsername = process.env.VPS_USERNAME || 'root';
  // VPS_WORKER_PATH из Organization Secrets - базовый путь (например: /opt/agency-engine/projects)
  // Добавляем projectId для полного пути
  const baseWorkerPath = process.env.VPS_WORKER_PATH || '/opt/agency-engine/projects';
  const vpsWorkerPath = `${baseWorkerPath}/${projectId}`;

  if (!vpsHost) {
    console.log('⚠️  VPS_HOST не установлен, пропускаем деплой worker на VPS');
    console.log('💡 Установи переменные: VPS_HOST, VPS_USERNAME, VPS_WORKER_PATH');
  } else {
    console.log('📤 Отправка worker на VPS...');
    try {
      // Используем scp для отправки файла (кроссплатформенно)
      const isWindows = platform() === 'win32';
      const scpCommand = isWindows 
        ? `scp "${workerPath}" ${vpsUsername}@${vpsHost}:${vpsWorkerPath.replace(/\\/g, '/')}/worker.js`
        : `scp "${workerPath}" ${vpsUsername}@${vpsHost}:${vpsWorkerPath}/worker.js`;
      execSync(scpCommand, { stdio: 'inherit', shell: isWindows });
      console.log(`✅ Worker отправлен на VPS: ${vpsWorkerPath}/worker.js\n`);
    } catch (error) {
      console.error('❌ Ошибка при отправке worker на VPS:', error.message);
      console.log('💡 Проверь SSH доступ и переменные окружения');
      console.log('💡 Убедись, что установлен OpenSSH или используй WSL');
      process.exit(1);
    }
  }

  console.log('🎉 Деплой завершен успешно!');
  console.log(`   📦 Статика: https://cdn.brilzy.com/${projectId}/`);
  if (vpsHost) {
    console.log(`   ⚙️  Worker: ${vpsHost}:${vpsWorkerPath}/worker.js`);
  }
}

// Запускаем деплой
deploy().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});
