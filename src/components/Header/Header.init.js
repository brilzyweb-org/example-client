/**
 * Инициализация Header компонента (только для клиента)
 */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    if (!header) return;

    // Добавляем анимацию появления
    header.style.opacity = '0';
    header.style.transform = 'translateY(-10px)';
    header.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(() => {
      header.style.opacity = '1';
      header.style.transform = 'translateY(0)';
    }, 100);

    // Логирование для проверки
    console.log('✅ Header initialized');
  });
}
