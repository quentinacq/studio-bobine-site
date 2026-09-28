/* Studio Bobine — mesure d'audience (Umami Cloud, sans cookie).
   Chargé sur toutes les pages via <script src="/assets/analytics.js" defer>.

   Tant que UMAMI_ID est vide, rien n'est chargé ni envoyé : le site reste
   sans aucun service tiers. Pour activer la mesure, coller ici l'identifiant
   du site affiché par Umami (Settings → Websites → Tracking code). */
(function(){
'use strict';

  const UMAMI_ID = '';                                  // ex. '1a2b3c4d-…'
  const UMAMI_SRC = 'https://cloud.umami.is/script.js';  // reprendre l'URL du code de suivi Umami
  // La mesure ne tourne que sur le vrai domaine : ni en local, ni sur les
  // aperçus Vercel.
  const DOMAINES = ['www.studiobobine.fr', 'studiobobine.fr'];

  // Point d'entrée unique pour tous les événements du site. Sans Umami
  // (non configuré, bloqué, ou visiteur opposé à la mesure), l'appel ne fait rien.
  window.sbTrack = function(nom, donnees){
    try { if (window.umami && typeof window.umami.track === 'function') window.umami.track(nom, donnees); }
    catch (e) { /* la mesure ne doit jamais casser le site */ }
  };

  if (UMAMI_ID && DOMAINES.includes(location.hostname)) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = UMAMI_SRC;
    s.dataset.websiteId = UMAMI_ID;
    s.dataset.domains = DOMAINES.join(',');
    s.dataset.doNotTrack = 'true'; // respecte le réglage « Ne pas me pister » du navigateur
    document.head.appendChild(s);
  }

  // Clics mesurés, par délégation : aucun attribut à ajouter dans les pages.
  document.addEventListener('click', function(e){
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const texte = (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    const page = location.pathname;
    if (/^\/contact\/?(?:[?#]|$)/.test(href) && page !== '/contact') {
      window.sbTrack('cta_devis', { page: page, texte: texte });
    } else if (/instagram\.com/i.test(href)) {
      window.sbTrack('clic_instagram', { page: page });
    } else if (/tiktok\.com/i.test(href)) {
      window.sbTrack('clic_tiktok', { page: page });
    } else if (/^mailto:/i.test(href)) {
      window.sbTrack('clic_email', { page: page });
    } else if (a.matches('.btn, .nav-cta, .pf-all, .proc-lien')) {
      window.sbTrack('cta_autre', { page: page, texte: texte, vers: href });
    }
  }, { capture: true });

  // Opposition à la mesure (lien sur la page Mentions légales) : Umami
  // ignore le navigateur tant que « umami.disabled » est présent.
  document.addEventListener('click', function(e){
    const b = e.target.closest && e.target.closest('[data-mesure]');
    if (!b) return;
    e.preventDefault();
    try {
      if (b.dataset.mesure === 'refuser') localStorage.setItem('umami.disabled', '1');
      else localStorage.removeItem('umami.disabled');
    } catch (err) { /* stockage indisponible : rien à faire */ }
    majEtatMesure();
  });
  function majEtatMesure(){
    const etat = document.getElementById('mesure-etat');
    if (!etat) return;
    let refuse = false;
    try { refuse = !!localStorage.getItem('umami.disabled'); } catch (err) {}
    etat.textContent = refuse
      ? 'Vous êtes exclu de la mesure d’audience sur ce navigateur.'
      : 'Vos visites sont comptées de façon anonyme.';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', majEtatMesure);
  else majEtatMesure();
})();
