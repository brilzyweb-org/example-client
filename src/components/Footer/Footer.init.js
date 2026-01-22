/**
 * Инициализация Footer компонента (только для клиента)
 */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    // Добавляем анимацию появления
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(20px)';
    footer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    // Анимация при скролле
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footer.style.opacity = '1';
          footer.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    observer.observe(footer);

    // Логирование для проверки
    console.log('✅ Footer initialized');
  });
}
