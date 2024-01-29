const sideNav = document.querySelector('.side-nav');
const sideNavToggle = document.querySelector('.side-nav-toggle');

sideNavToggle.addEventListener('click', () => {
  sideNav.classList.toggle('open');
});