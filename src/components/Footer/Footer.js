/**
 * Компонент Footer (только для сервера)
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return /* html */ `
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">
          © ${currentYear} Example Client. Все права защищены.
        </p>
        <div class="footer-links">
          <a href="/" class="footer-link">Главная</a>
          <a href="/about" class="footer-link">О нас</a>
        </div>
      </div>
    </footer>
  `;
}
