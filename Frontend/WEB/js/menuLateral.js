// En tu archivo JavaScript
fetch('menu.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('menu-container').innerHTML = data;
    initMenu();
  })
  .catch(error => console.error('Error al cargar el menú:', error));

function initMenu() {
  // Luego de cargar el menú, puedes realizar inicializaciones específicas del menú aquí
  // Por ejemplo, puedes inicializar eventos, estilos, etc.

  const sideNav = document.querySelector('.side-nav');
  const sideNavToggle = document.querySelector('.side-nav-toggle');
  const closeMenuBtn = document.querySelector('.close-menu-btn');

  sideNavToggle.addEventListener('click', () => {
    sideNav.classList.toggle('open');
    sideNavToggle.classList.toggle('hidden');
  });

  closeMenuBtn.addEventListener('click', () => {
    sideNav.classList.remove('open');
    sideNavToggle.classList.remove('hidden');
  });
  console.log('initMenu ejecutado');
}
