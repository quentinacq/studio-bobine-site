/* Studio Bobine — page d'accueil, proposition 2.
   Trois choses : la tête de lecture (jauge + timecode courant), le menu
   mobile, et rien d'autre. Aucune dépendance. */
(function () {
  'use strict';

  /* --- Tête de lecture : la jauge suit le défilement, le timecode de
         l'en-tête affiche celui du plan en cours de lecture. --- */
  var jauge = document.getElementById('jauge');
  var tcTete = document.getElementById('tcTete');
  var plans = [].slice.call(document.querySelectorAll('.plan[data-tc]'));

  if (jauge || tcTete) {
    var suivre = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (jauge) jauge.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';

      if (tcTete && plans.length) {
        // Le plan courant est le dernier dont le haut est passé sous la barre
        var repere = window.scrollY + 90, courant = plans[0];
        for (var i = 0; i < plans.length; i++) {
          if (plans[i].offsetTop <= repere) courant = plans[i];
        }
        var tc = courant.getAttribute('data-tc');
        if (tcTete.textContent !== tc) tcTete.textContent = tc;
      }
    };
    suivre();
    window.addEventListener('scroll', suivre, { passive: true });
    window.addEventListener('resize', suivre, { passive: true });
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
})();
