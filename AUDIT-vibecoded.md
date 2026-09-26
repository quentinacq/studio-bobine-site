# Audit « vibecoded » — Studio Bobine

Outil : [KreshBack/vibecoded-audit](https://github.com/KreshBack/vibecoded-audit) v0.1.1 (`scan.mjs` + passe manuelle de `patterns.md`).
Date : 26 septembre 2026. Périmètre : les 13 pages publiques du sitemap (accueil, notre concept, services, tarifs, réalisations, conseils, contact, 6 articles de blog).

> Le site en ligne n'était pas joignable depuis l'environnement d'audit (réseau restreint). Le scan a été fait sur la branche `main` servie en local avec les mêmes règles que Vercel (`cleanUrls`). Statut du scan : **complete**, 13 pages, 4 feuilles de style.

**Verdict : 14 hard + 2 soft sur 30** (live). Tells étendus avec preuve : 35, 36, 39, 45, 47. Dette source : aucune (site statique, tout le code est servi).

**Routes :** 13 pages en 200, aucune redirection sur les pages auditées (`/evenements` → `/services` en 301, hors sitemap).

**Header :** `<title>`, `og:image`, `lang=fr`, favicon et description présents sur les 13 pages. Lien d'évitement (« Aller au contenu ») absent des 6 articles de blog. CSS appliquée ≈ 80 % de la CSS livrée.

## Les 30 tells d'origine

| # | Tell | Live | Preuve |
|---|---|---|---|
| 1 | Dégradés marqués | **hit** | Bloc CTA orange→rouge sur 6 pages (`assets/site.css:398` `.fcta-box`), citation en dégradé (`site.css:314`, `:981`), carte Avancé (`site.css:234`) |
| 2 | Icônes Lucide | pass | Aucune |
| 3 | Fond blanc pur | pass | Fond `#fff8ef` sur toutes les pages |
| 4 | Palette arc-en-ciel | pass | Corail + jaune soleil + teal, cohérent |
| 5 | Ombres portées | **hit** | 47 `box-shadow` dans `site.css`, sur chaque carte (`.icp`, `.plan`, `.tcard`, `.pq-card`, `.post`) |
| 6 | 3 cartes en ligne | **hit** | Accueil : 3 cartes « Pourquoi nous » (`index.html:222-224`), 3 avis (`index.html:238-256`) ; Tarifs : 3 formules (`tarifs.html:74-115`) |
| 7 | Emojis | **hit** | ⚡ 💬 🎁 (`index.html:282-284`), 🎬 💞 👨‍👩‍👧 🌍 en icônes de cartes (`services.html:76-88`), ❤️ dans le pied de page de 7 pages |
| 8 | Effet verre | pass | Seulement l'en-tête collant flouté (`site.css:77`), preuve faible |
| 9 | Tirets cadratins (—) | **hit** | 27 dans le texte visible + dans le `<title>` de 7 pages sur 13 (« … — Studio Bobine ») |
| 10 | Inter / Geist / Roboto | pass | Fraunces + DM Sans (+ Caveat) |
| 11 | Bande colorée à gauche | **hit** | Encadré `.tip` `border-left:4px solid` dans les 6 articles (ex. `blog-prix-montage-video.html:109`) |
| 12 | Témoignages invérifiables | **hit** | 3 avis « Lucas M. », « Sarah L. », « Emma & Yanis » + citation « Camille & Théo » (`index.html:213-256`). Le `PLAN-LANCEMENT-14-JOURS.md` les qualifie lui-même de faux témoignages à supprimer |
| 13 | Grilles bento | pass | Aucune |
| 14 | Fenêtre terminal | pass | Aucune |
| 15 | « Ce n'est pas X, c'est Y » | partial | « Un échange, pas un formulaire » (`index.html:283`) |
| 16 | Puces coche ✓ | **hit** | 17 puces ✓ dans les formules (`tarifs.html:79-112`) |
| 17 | 3 formules tarifaires | **hit** | Standard / Avancé / Premium, 3 cartes égales, celle du milieu mise en avant (`tarifs.html:88` `.plan.feat`) |
| 18 | Pas de vraie démo produit | **hit** | Le hero est un collage de photos (`index.html:115-117`) ; les réalisations sont marquées « Privé », aucun extrait de montage visible |
| 19 | Coins très arrondis | **hit** | 29 `border-radius` de 12 à 39 px (16, 20, 22, 24, 26, 32 px) dans `site.css` |
| 20 | Violet / indigo | pass | Aucun sur les pages servies |
| 21 | Skeleton loaders | n/a | Site statique, aucun contenu chargé en différé |
| 22 | Halos flous | partial | 2 disques `.blob` flous en dégradé radial derrière le hero (`site.css:138-140`, accueil et notre concept) |
| 23 | Trame de points | pass | Aucune |
| 24 | Icônes étincelles | pass | Les ✦ du bandeau défilant sont des séparateurs typographiques |
| 25 | Flèches animées | pass | Aucune |
| 26 | Lien CGU / mentions | **hit** | « Mentions légales » est du texte, pas un lien (`index.html:314` et les 6 autres pages) ; aucune page n'existe |
| 27 | Lien confidentialité | **hit** | « Confidentialité » est aussi du texte sans lien ; le seul lien trouvé par le scanner (`/realisations#confidentialite`) parle de la confidentialité des films, pas d'une politique de données |
| 28 | Animations au survol | **hit** | Soulèvement + ombre sur toutes les cartes : `.icp`, `.plan`, `.pf-cell`, `.tcard`, `.post`, `.pq-card` (`site.css:206, 233, 273, 379, 435, 993`) |
| 29 | Couleurs néon | pass | Aucune |
| 30 | Pastels basiques | pass | Teintes dérivées de la marque |

## Tells étendus avec preuve

| # | Tell | Live | Preuve |
|---|---|---|---|
| 35 | Chiffres non sourcés | **hit** | « ★★★★★ 4,9/5 », « +35 vidéos livrées à des clients ravis » (`index.html:108-111`), « 4,9/5 sur 35 avis » (`index.html:236`), « 3 places de montage libres cette semaine » (`index.html:83`) |
| 36 | Vocabulaire IA | partial | « sans effort » ×2 (`notre-concept.html:135`, `blog-format-reseaux.html:215`), « sur mesure » ×2 |
| 39 | Liens morts | **hit** | Instagram / TikTok / YouTube du pied de page en `href="#"` sur 7 pages (ex. `index.html:305`) |
| 41 | Métadonnées | pass | Complètes partout |
| 44 | Bandeau cookies | n/a | Aucun traceur détecté |
| 45 | Rythme en 3 | **hit** | Accueil : 3 cartes « Pourquoi nous », 3 avis ; Tarifs : 3 formules |
| 47 | FAQ en accordéon | partial | FAQ de la page Tarifs (`tarifs.html:186`), questions pertinentes |
| 48 | « Défaut élégant » (crème + serif + sauge) | pass | 2/3 : fond crème + Fraunces, mais accent corail, pas sauge |
| 49 | Ordre de sections type | pass | Enchaînement propre au site |

## Constat structurel

Le site n'a pas les marqueurs les plus visibles d'un site généré (pas de violet, pas d'Inter, pas de kit shadcn, typographie et palette choisies). Ce qui le fait paraître « généré », c'est la **couche de confiance** : avis et notes invérifiables, compteur de places, liens sociaux et pages légales qui ne mènent nulle part. S'y ajoute un **système de cartes uniforme** (même rayon, même ombre, même soulèvement au survol, par groupes de trois) répété de page en page. Corriger le premier bloc est aussi une question légale : en France, les faux avis sont une pratique commerciale trompeuse, et les mentions légales sont obligatoires (LCEN).

## Plan de correction

| Prio | Tell | Changement | Où | Effort |
|---|---|---|---|---|
| 1 | 12, 35 | Retirer les 3 avis, la citation, la note 4,9/5, « +35 vidéos » et « 3 places libres » tant qu'il n'y a pas de vrais clients | `index.html:83, 101-111, 213-219, 230-258` | 30 min |
| 2 | 26, 27 | Créer les pages Mentions légales et Confidentialité et faire du pied de page de vrais liens | nouvelles pages + pied de page des 7 pages | 1-2 h |
| 3 | 39 | Relier Instagram (`instagram.com/studiobobine`), et retirer TikTok / YouTube tant qu'ils n'existent pas | pied de page des 7 pages (ex. `index.html:305`) | 10 min |
| 4 | 18 | Montrer un vrai extrait : une vidéo de 15-20 s d'un montage (avec accord) dans le hero ou les réalisations | `index.html:113-120`, `realisations.html` | heures |
| 5 | 7 | Remplacer les emojis des cartes et de la section « après le clic » par des mots, des chiffres ou des pictos maison | `services.html:76-88`, `index.html:282-284` | 20 min |
| 6 | 1, 22 | Bloc CTA en couleur unie ; supprimer les 2 halos du hero | `site.css:398, 314, 981, 138-140` | 15 min |
| 7 | 6, 17, 45 | Casser le rythme en 3 : grille asymétrique pour « Pourquoi nous », formules en tableau ou avec une carte dominante | `index.html:222-224`, `tarifs.html:74-115` | heures |
| 8 | 5, 19, 28 | Garder le soulèvement sur les boutons seulement ; réduire ombres et rayons (un rayon de référence, 8-12 px) | `site.css` (lignes 206, 233, 273, 379, 435, 993) | 1 h |
| 9 | 9 | Remplacer « — » par « · » ou « | » dans les `<title>` et par des virgules / deux-points dans le texte | 13 pages | 30 min |
| 10 | 16 | Liste simple (ou tirets) à la place des ✓ | `tarifs.html:79-112` | 10 min |
| 11 | 11 | Encadré `.tip` avec fond teinté seul, sans bande à gauche | 6 articles de blog | 10 min |
| 12 | 15, 36 | Reformuler « Un échange, pas un formulaire », « sans effort », « sur mesure » | voir tableau | 15 min |

---

À noter hors grille : `vercel.json` envoie `X-Robots-Tag: noindex, nofollow` sur **toutes** les pages. Si le site est lancé, Google ne l'indexera pas tant que cet en-tête reste en place.
