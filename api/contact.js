// Studio Bobine — réception du formulaire de contact (fonction serveur Vercel).
//
// Rôle : revalider TOUT ce que le navigateur envoie (le JavaScript du site
// peut être contourné), filtrer le spam, puis transmettre la demande par
// email via l'API Resend. Aucune donnée n'est stockée ici.
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   RESEND_API_KEY  (obligatoire) clé API Resend
//   CONTACT_TO      (facultatif)  destinataire, par défaut hello.studiobobine@gmail.com
//   CONTACT_FROM    (facultatif)  expéditeur, par défaut « Studio Bobine <onboarding@resend.dev> »
//                                 (à remplacer par une adresse @studiobobine.fr
//                                 une fois le domaine vérifié chez Resend)

'use strict';

const TO = process.env.CONTACT_TO || 'hello.studiobobine@gmail.com';
const FROM = process.env.CONTACT_FROM || 'Studio Bobine <onboarding@resend.dev>';

// Valeurs autorisées : exactement les options des listes du formulaire.
const CHOIX = {
  type_de_projet: ['Vlogs de voyage', 'Souvenirs de famille', 'Reels & Shorts', 'Road-trips',
    'Demandes en mariage', 'Aftermovies', 'Autre, ou je ne sais pas encore'],
  duree_souhaitee: ["Moins d'une minute", '1 à 3 minutes', '3 à 6 minutes', '6 à 10 minutes',
    'Plus de 10 minutes', 'Je ne sais pas encore'],
  volume_de_rushs: ["Moins d'une heure", '1 à 5 heures', '5 à 10 heures', 'Plus de 10 heures', 'Je ne sais pas'],
};

const LIMITES = { prenom: [1, 60], email: [6, 254], telephone: [0, 25], message: [20, 4000] };

// Limitation de débit « au mieux » : mémoire propre à chaque instance de la
// fonction, donc contournable. La vraie limite se règle dans le pare-feu
// Vercel (voir le rapport). Ici : 5 envois par adresse IP et par 10 minutes.
const FENETRE_MS = 10 * 60 * 1000;
const MAX_ENVOIS = 5;
const envois = new Map();

function tropDeRequetes(ip) {
  const maintenant = Date.now();
  const recents = (envois.get(ip) || []).filter((t) => maintenant - t < FENETRE_MS);
  recents.push(maintenant);
  envois.set(ip, recents);
  if (envois.size > 5000) envois.clear(); // garde-fou mémoire
  return recents.length > MAX_ENVOIS;
}

// Texte « propre » : caractères de contrôle retirés (sauf retours à la ligne
// dans le message), espaces superflus supprimés.
function nettoyer(valeur, multiligne) {
  if (typeof valeur !== 'string') return '';
  let v = valeur.normalize('NFC').replace(/\r\n?/g, '\n');
  v = multiligne
    ? v.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    : v.replace(/[\u0000-\u001F\u007F]/g, ' ');
  return v.replace(/[ \t]+/g, ' ').trim();
}

function valider(corps) {
  const erreurs = {};
  const d = {
    prenom: nettoyer(corps.prenom),
    email: nettoyer(corps.email).toLowerCase(),
    telephone: nettoyer(corps.telephone),
    type_de_projet: nettoyer(corps.type_de_projet),
    duree_souhaitee: nettoyer(corps.duree_souhaitee),
    volume_de_rushs: nettoyer(corps.volume_de_rushs),
    message: nettoyer(corps.message, true),
    accord: corps.accord === true || corps.accord === 'on' || corps.accord === 'true',
  };

  if (!d.prenom) erreurs.prenom = 'Indiquez votre prénom.';
  else if (d.prenom.length > LIMITES.prenom[1]) erreurs.prenom = 'Ce prénom est trop long (60 caractères maximum).';
  else if (!/^[\p{L}][\p{L}\p{M}' .-]*$/u.test(d.prenom)) erreurs.prenom = 'Utilisez uniquement des lettres, espaces, tirets ou apostrophes.';

  if (!d.email) erreurs.email = 'Indiquez votre email : c’est là qu’arrivera le devis.';
  else if (d.email.length > LIMITES.email[1] || !/^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i.test(d.email)) {
    erreurs.email = 'Cette adresse email semble incomplète. Exemple : camille@exemple.fr';
  }

  if (d.telephone) {
    const chiffres = d.telephone.replace(/[\s.\-()]/g, '');
    if (d.telephone.length > LIMITES.telephone[1] || !/^\+?\d{8,15}$/.test(chiffres)) {
      erreurs.telephone = 'Ce numéro semble incomplet. Exemple : 06 12 34 56 78';
    }
  }

  for (const champ of Object.keys(CHOIX)) {
    if (!CHOIX[champ].includes(d[champ])) erreurs[champ] = 'Choisissez une option dans la liste.';
  }

  if (d.message.length < LIMITES.message[0]) erreurs.message = 'Dites-nous-en un peu plus (20 caractères minimum).';
  else if (d.message.length > LIMITES.message[1]) erreurs.message = 'Votre message est trop long (4 000 caractères maximum).';

  if (!d.accord) erreurs.accord = 'Cochez cette case pour que nous puissions vous répondre.';

  return { erreurs, d };
}

// Signaux typiques d'envoi automatisé. Aucun n'est bloquant seul pour un
// humain : un vrai visiteur ne remplit pas un champ invisible, ne soumet pas
// en moins de 3 secondes et n'écrit pas un message composé de liens.
function estSpam(corps, d) {
  const debut = Number(corps.t);
  if (debut) {
    const ecoule = Date.now() - debut;
    if (ecoule < 3000) return 'trop-rapide';
    if (ecoule > 24 * 3600 * 1000) return 'formulaire-expire';
  }
  const liens = (d.message.match(/https?:\/\/|www\./gi) || []).length;
  if (liens > 3) return 'trop-de-liens';
  return null;
}

function echapperHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function ipDe(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'inconnue';
}

// Refuse les envois venant d'un autre site (formulaire copié ailleurs, robots).
function origineAutorisee(req) {
  const origine = req.headers.origin;
  if (!origine) return true; // certains navigateurs l'omettent sur un envoi classique
  try {
    const hote = new URL(origine).host;
    return hote === (req.headers['x-forwarded-host'] || req.headers.host);
  } catch {
    return false;
  }
}

async function envoyerEmail(d) {
  const lignes = [
    ['Prénom', d.prenom], ['Email', d.email], ['Téléphone', d.telephone || '—'],
    ['Projet', d.type_de_projet], ['Durée souhaitée', d.duree_souhaitee], ['Volume de rushs', d.volume_de_rushs],
  ];
  const texte = lignes.map(([k, v]) => `${k} : ${v}`).join('\n') + `\n\nMessage :\n${d.message}\n`;
  const html = '<table cellpadding="6" style="font-family:sans-serif;font-size:15px">'
    + lignes.map(([k, v]) => `<tr><td style="color:#6b5f57">${k}</td><td><strong>${echapperHtml(v)}</strong></td></tr>`).join('')
    + `</table><p style="font-family:sans-serif;font-size:15px;white-space:pre-wrap">${echapperHtml(d.message)}</p>`;

  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: d.email, // « Répondre » écrit directement au visiteur
      subject: `Nouvelle demande — ${d.prenom} (${d.type_de_projet})`,
      text: texte,
      html,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!reponse.ok) throw new Error(`Resend ${reponse.status}`);
}

// Répond en JSON au JavaScript du site, ou par une petite page HTML quand
// le formulaire a été envoyé sans JavaScript.
function repondre(req, res, statut, donnees) {
  const enJson = String(req.headers.accept || '').includes('application/json');
  if (enJson) return res.status(statut).json(donnees);
  const succes = statut === 200;
  const titre = succes ? 'Merci, votre demande est bien partie !' : 'Votre demande n’a pas pu être envoyée';
  const details = succes
    ? '<p>Nous vous répondons sous 24 h à l’adresse indiquée.</p><p><a href="/">Retour à l’accueil</a></p>'
    : `<p>${echapperHtml(donnees.message || 'Une erreur est survenue.')}</p>`
      + (donnees.erreurs ? '<ul>' + Object.values(donnees.erreurs).map((m) => `<li>${echapperHtml(m)}</li>`).join('') + '</ul>' : '')
      + '<p><a href="/contact">Revenir au formulaire</a> ou écrire à <a href="mailto:hello.studiobobine@gmail.com">hello.studiobobine@gmail.com</a>.</p>';
  res.statusCode = statut;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.end(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${titre} — Studio Bobine</title><link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/assets/site.css"></head><body><main class="wrap" style="max-width:640px;padding:80px 20px"><h1 style="font-size:32px;margin-bottom:16px">${titre}</h1>${details}</main></body></html>`);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Méthode non autorisée.' });
  }
  if (!origineAutorisee(req)) {
    return res.status(403).json({ ok: false, message: 'Envoi refusé.' });
  }
  if (tropDeRequetes(ipDe(req))) {
    return repondre(req, res, 429, { ok: false, message: 'Trop d’envois en peu de temps. Réessayez dans quelques minutes, ou écrivez-nous à hello.studiobobine@gmail.com.' });
  }

  const corps = req.body && typeof req.body === 'object' ? req.body : {};

  // Pot de miel rempli : robot. On répond « envoyé » sans rien transmettre,
  // avant toute validation pour ne rien lui apprendre.
  if (nettoyer(corps.site_web)) {
    console.warn('contact: envoi ignoré', 'pot-de-miel');
    return repondre(req, res, 200, { ok: true });
  }

  const { erreurs, d } = valider(corps);
  if (Object.keys(erreurs).length) {
    return repondre(req, res, 400, { ok: false, message: 'Certains champs sont à corriger.', erreurs });
  }

  // Spam détecté : on répond « envoyé » pour ne pas renseigner le robot,
  // mais rien ne part.
  const spam = estSpam(corps, d);
  if (spam) {
    console.warn('contact: envoi ignoré', spam);
    return repondre(req, res, 200, { ok: true });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY manquante');
    return repondre(req, res, 503, { ok: false, message: 'L’envoi est momentanément indisponible. Écrivez-nous directement à hello.studiobobine@gmail.com.' });
  }

  try {
    await envoyerEmail(d);
    return repondre(req, res, 200, { ok: true });
  } catch (e) {
    // Journal sans données personnelles : seulement la cause technique.
    console.error('contact: échec envoi', e.message);
    return repondre(req, res, 502, { ok: false, message: 'Votre message n’a pas pu partir. Réessayez dans un instant, ou écrivez-nous à hello.studiobobine@gmail.com.' });
  }
};

// Exporté pour les tests.
module.exports.valider = valider;
module.exports.estSpam = estSpam;
