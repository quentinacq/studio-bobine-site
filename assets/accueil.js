/* Studio Bobine — comportements de la page d'accueil.
   Trois choses seulement : l'état de la barre au défilement, le menu mobile,
   et l'apparition des blocs. Aucune dépendance. */
(function () {
  'use strict';

  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- La barre se pose sur un fond opaque dès qu'on quitte le haut --- */
  var barre = document.getElementById('hd');
  if (barre) {
    var poser = function () { barre.classList.toggle('pose', window.scrollY > 24); };
    poser();
    window.addEventListener('scroll', poser, { passive: true });
  }

  /* --- Menu mobile --- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menuMobile');
  var voile = document.getElementById('voile');
  var fermer = document.getElementById('menuFermer');

  function basculer(ouvrir) {
    burger.classList.toggle('ouvert', ouvrir);
    burger.setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
    menu.classList.toggle('ouvert', ouvrir);
    voile.classList.toggle('ouvert', ouvrir);
    document.body.classList.toggle('menu-ouvert', ouvrir);
    document.body.style.overflow = ouvrir ? 'hidden' : '';
  }

  if (burger && menu && voile) {
    burger.addEventListener('click', function () {
      basculer(!menu.classList.contains('ouvert'));
    });
    voile.addEventListener('click', function () { basculer(false); });
    if (fermer) fermer.addEventListener('click', function () { basculer(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { basculer(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') basculer(false);
    });
  }

  /* --- Apparition des blocs au défilement --- */
  var blocs = document.querySelectorAll('.reveal');
  if (reduit || !('IntersectionObserver' in window)) {
    blocs.forEach(function (el) { el.classList.add('vu'); });
  } else {
    var oeil = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('vu'); oeil.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    blocs.forEach(function (el, i) {
      // Léger décalage entre voisins, pour que les blocs arrivent en cascade
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      oeil.observe(el);
    });
  }
})();
