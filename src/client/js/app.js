/**
 * Общий JavaScript для всех страниц (только для клиента)
 * Специфичная логика для каждой страницы находится в соответствующих .init.js файлах
 */
if (typeof document !== 'undefined') {
  console.log('✅ App initialized (общий JS)');

  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded');
    
    // Показываем уведомление о загрузке JS
    showJSLoadedNotification();
  });
}

/**
 * Показывает уведомление о загрузке JavaScript (общая функция)
 */
function showJSLoadedNotification() {
  // Создаем небольшой индикатор в консоли
  console.log('%c✅ JavaScript загружен и работает!', 
    'color: #27ae60; font-weight: bold; font-size: 14px;');
  
  // Добавляем визуальный индикатор на странице
  const indicator = document.createElement('div');
  indicator.id = 'js-indicator';
  indicator.textContent = '✓ JS';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #27ae60;
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    opacity: 0.9;
    cursor: pointer;
  `;
  
  indicator.addEventListener('click', () => {
    indicator.style.opacity = '0';
    setTimeout(() => indicator.remove(), 300);
  });
  
  document.body.appendChild(indicator);
  
  // Автоматически скрываем через 3 секунды
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    }
  }, 3000);
}
