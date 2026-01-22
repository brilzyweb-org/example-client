/**
 * Уникальный JavaScript для страницы Home (только для клиента)
 */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 Home page JavaScript loaded');

    // Интерактивность для постов
    initPostsInteraction();
    
    // Счетчик просмотров постов
    initPostViews();
  });
}

/**
 * Интерактивность для постов
 */
function initPostsInteraction() {
  const posts = document.querySelectorAll('.post');
  
  posts.forEach((post, index) => {
    // Добавляем анимацию появления
    post.style.opacity = '0';
    post.style.transform = 'translateY(20px)';
    post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      post.style.opacity = '1';
      post.style.transform = 'translateY(0)';
    }, index * 100);
    
    // Добавляем эффект при наведении на заголовок
    const title = post.querySelector('h2');
    if (title) {
      title.style.cursor = 'pointer';
      title.addEventListener('click', () => {
        title.style.color = title.style.color === 'rgb(52, 152, 219)' 
          ? '#2c3e50' 
          : '#3498db';
        console.log('📝 Клик по посту:', title.textContent);
      });
    }

    // Ленивая загрузка изображений
    const img = post.querySelector('img');
    if (img && img.loading === 'lazy') {
      img.addEventListener('load', () => {
        console.log('🖼️ Изображение загружено:', img.alt);
      });
    }
  });
}

/**
 * Счетчик просмотров постов (уникальная функция для Home)
 */
function initPostViews() {
  const posts = document.querySelectorAll('.post');
  posts.forEach((post, index) => {
    // Добавляем индикатор просмотра
    const viewBadge = document.createElement('span');
    viewBadge.className = 'post-view-badge';
    viewBadge.textContent = `👁️ ${Math.floor(Math.random() * 100) + 1}`;
    viewBadge.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(52, 152, 219, 0.9);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    `;
    
    const postTitle = post.querySelector('h2');
    if (postTitle) {
      postTitle.style.position = 'relative';
      postTitle.appendChild(viewBadge);
    }
  });
  
  console.log('📊 Счетчики просмотров инициализированы');
}
