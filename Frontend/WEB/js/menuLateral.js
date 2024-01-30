
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

