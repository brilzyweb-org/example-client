/**
 * Уникальный JavaScript для страницы About (только для клиента)
 */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('ℹ️ About page JavaScript loaded');

    // Интерактивность для карточек технологий
    initTechCardsInteraction();
    
    // Анимация статистики (уникальная функция для About)
    initTechStats();
  });
}

/**
 * Интерактивность для карточек технологий
 */
function initTechCardsInteraction() {
  const techCards = document.querySelectorAll('.tech-card');
  
  techCards.forEach((card, index) => {
    // Анимация появления
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, index * 50);
    
    // Клик по карточке
    card.addEventListener('click', () => {
      const techName = card.querySelector('h4')?.textContent;
      console.log('🔧 Клик по технологии:', techName);
      
      // Визуальная обратная связь
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 150);
    });

    // Эффект при наведении на иконку
    const icon = card.querySelector('.tech-icon');
    if (icon) {
      icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
      });
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      });
    }
  });
}

/**
 * Анимация статистики технологий (уникальная функция для About)
 */
function initTechStats() {
  const techCategories = document.querySelectorAll('.tech-category');
  const totalTechs = document.querySelectorAll('.tech-card').length;
  
  // Добавляем счетчик технологий
  const statsDiv = document.createElement('div');
  statsDiv.className = 'tech-stats';
  statsDiv.innerHTML = /* html */ `
    <div class="tech-stats-item">
      <span class="tech-stats-number">${totalTechs}</span>
      <span class="tech-stats-label">Технологий</span>
    </div>
    <div class="tech-stats-item">
      <span class="tech-stats-number">${techCategories.length}</span>
      <span class="tech-stats-label">Категорий</span>
    </div>
  `;
  statsDiv.style.cssText = `
    display: flex;
    gap: 2rem;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    justify-content: center;
  `;
  
  const statsItemStyle = `
    text-align: center;
  `;
  const statsNumberStyle = `
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
  `;
  const statsLabelStyle = `
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
  `;
  
  statsDiv.querySelectorAll('.tech-stats-item').forEach(item => {
    item.style.cssText = statsItemStyle;
    item.querySelector('.tech-stats-number').style.cssText = statsNumberStyle;
    item.querySelector('.tech-stats-label').style.cssText = statsLabelStyle;
  });
  
  const aboutContent = document.querySelector('.about-content');
  const h2 = aboutContent?.querySelector('h2');
  if (h2 && h2.nextSibling) {
    aboutContent.insertBefore(statsDiv, h2.nextSibling);
  }
  
  console.log('📊 Статистика технологий инициализирована');
}
