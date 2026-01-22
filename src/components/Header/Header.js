/**
 * Компонент Header (только для сервера)
 */
export function Header({ currentPath = '/' }) {
  const isHome = currentPath === '/';
  const isAbout = currentPath === '/about';
  
  return /* html */ `
    <header class="header">
      <nav class="header-nav">
        <a href="/" class="header-logo">Example Client</a>
        <div class="header-links">
          <a href="/" class="header-link ${isHome ? 'active' : ''}">Главная</a>
          <a href="/about" class="header-link ${isAbout ? 'active' : ''}">О нас</a>
        </div>
      </nav>
    </header>
  `;
}
