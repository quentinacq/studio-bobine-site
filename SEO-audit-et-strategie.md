# Audit SEO & stratégie de croissance organique — Studio Bobine

Réalisé le 6 août 2026. Toutes les optimisations décrites en partie 2 sont **déjà appliquées**
dans les fichiers du site. Les parties 3 à 6 sont le plan d'action à dérouler.

---

## 1. Ce qui n'allait pas (audit)

### 🔴 Critique — le site était structurellement inindexable

| # | Problème constaté | Conséquence réelle |
|---|---|---|
| 1 | **Toutes les balises `canonical` pointaient vers des URLs inexistantes** (`/blog/prix-montage-video/`, `/evenements/`) alors que les fichiers réels sont plats (`blog-prix-montage-video.html`) | Google reçoit l'ordre « la vraie version de cette page est à cette adresse » → adresse en 404 → **risque de désindexation de tout le site** |
| 2 | **`sitemap.xml` listait 6 URLs 404** + 5 ancres (`/#offres`, `/#faq`…) qui ne sont pas des URLs | Sitemap majoritairement invalide ; `evenements.html` totalement absent |
| 3 | **`index.html` et `studio-bobine.html` sont deux fichiers strictement identiques** (86 323 octets chacun) et **48 liens internes pointaient vers le duplicata** | Tout le « jus » interne envoyé vers une page dupliquée au lieu de la page canonique |
| 4 | **`og:image` était un SVG encodé en base64** | Aucun réseau social ne sait afficher ça : **zéro image d'aperçu** sur Facebook, LinkedIn, WhatsApp, X → CTR social effondré |
| 5 | **6 pages internes indexables** : maquettes de style, checklist, feuille de route, et surtout `montage-video.html` **portant une autre marque (« ATELIER CUT »)** | Contenu dupliqué + page concurrente/hors-marque indexable sur le domaine |

### 🟠 Élevé — opportunités perdues

- **Aucune image sociale** sur la page événements ni sur les 6 articles (cartes Twitter/LinkedIn vides).
- **Aucun `BreadcrumbList`** balisé alors que le fil d'Ariane existe visuellement sur tous les articles.
- **Aucune `FAQPage`** sur la page événements alors que **5 questions/réponses** y sont déjà rédigées.
- **Note agrégée 4,9/5 sur 300 avis** déclarée en données structurées avec des **témoignages d'exemple**
  → violation des règles Google (avis auto-déclarés + non vérifiables) exposant à une **action manuelle**.
- **8 images sans `width`/`height`** (décalages de mise en page = mauvais score CLS) et image LCP non priorisée.
- **Tous les titres d'articles dépassaient 68 à 88 caractères** → tronqués dans Google, marque coupée.

---

## 2. Ce qui a été corrigé (déjà en place)

### Fichiers modifiés

| Fichier | Nature de l'intervention |
|---|---|
| `index.html` + `studio-bobine.html` | canonical, og:url, og:image réelle, titre/description, suppression `aggregateRating`, dimensions + priorités de chargement des images, préchargement LCP, polices non bloquantes |
| `evenements.html` | canonical, og:image + cartes Twitter, **FAQPage** (5 Q/R), **BreadcrumbList**, correction URL JSON-LD, titre/description, lien contextuel vers l'article mariage |
| `blog-*.html` (× 6) | canonical, og:image dédiée par article, cartes Twitter complètes, `article:published_time`/`modified_time`, **BreadcrumbList**, enrichissement `Article` (image, dateModified, logo éditeur), titres raccourcis, liens internes |
| `sitemap.xml` | réécrit intégralement : 8 URLs réelles, zéro ancre, zéro 404 |
| `robots.txt` | blocage des 8 pages non publiques + sitemap |
| 6 pages internes | passées en `noindex, nofollow` |
| `commande-upload.html`, `commande-confirmation.html` | liens repointés vers la page canonique |
| `images/og-cover.jpg` | **créée** — 1200×630, 112 Ko, générée depuis une photo du site |

### Détail des optimisations

**Indexation & duplication**
- 9 pages recanonicalisées vers leur URL réellement servie.
- `studio-bobine.html` conservé mais canonicalisé vers `/` (au cas où l'URL aurait déjà été partagée).
- 48 liens internes repointés du duplicata vers la page canonique.
- 8 pages non publiques sorties de l'index (balise + robots.txt).

**Données structurées** (toutes validées en JSON)
- Accueil : `ProfessionalService` + `WebSite` + `BreadcrumbList` + `FAQPage`
- Événements : `Service` + **`FAQPage`** + **`BreadcrumbList`**
- 6 articles : `Article` enrichi + **`BreadcrumbList`**
- Retrait de la note agrégée non vérifiable (risque de pénalité).
- Vérifié : les 5 questions balisées correspondent exactement aux 5 questions visibles (exigence Google).

**Partage social** — og:image, dimensions, `og:image:alt`, `twitter:title/description/image` sur les 8 pages publiques ; chaque article utilise sa propre image de couverture.

**Core Web Vitals**
- `width`/`height` sur les 29 images de l'accueil → CLS maîtrisé.
- Image LCP : `fetchpriority="high"` + `<link rel="preload">`.
- Avatars au-dessus de la ligne de flottaison : `lazy` → `eager` (le lazy y retardait l'affichage sans rien économiser).
- Images sous la ligne de flottaison : `loading="lazy" decoding="async"`.
- Polices Google chargées sans bloquer le rendu (avec repli `<noscript>`).
- ⚠️ `decoding="async"` avait été retiré des 3 images du hero après test : il autorisait le navigateur
  à peindre la page **sans** les images (constaté sur mobile). Corrigé et revérifié.

**CTR** — 9 titres réécrits ≤ 61 caractères, mot-clé en tête, prix et délai visibles
(« Montage vidéo en ligne dès 89 €, livré en 48 h »), 9 méta-descriptions calibrées à 149-158 caractères.

### Vérifications finales
```
liens cassés = 0    images cassées = 0    JSON-LD invalides = 0
8 pages indexables · 8 pages en noindex · sitemap XML valide
Rendu contrôlé desktop + mobile : aucune régression visuelle
```

---

## 3. Le vrai frein structurel : tout le commercial est sur une seule page

`Tarifs`, `Réalisations`, `Devis`, `FAQ`, `Blog`, `Qui sommes-nous` **ne sont pas des pages** :
ce sont des ancres de l'accueil. Conséquence : la page d'accueil doit se positionner **seule**
sur toutes les requêtes commerciales à la fois — ce qui est impossible.

C'est, de loin, le premier levier de croissance restant. Une page = une intention = une requête.

---

## 4. Stratégie de mots-clés par grappes thématiques

### Grappe 1 — Montage vidéo (cœur de métier, transactionnel)
**Page pilier : accueil** — `montage vidéo en ligne`, `montage vidéo à distance`, `faire monter ses vidéos`

| Requête cible | Statut | Intention |
|---|---|---|
| prix montage vidéo / tarif monteur | ✅ article existant | Commerciale |
| monter soi-même ou déléguer | ✅ article existant | Comparaison |
| montage vidéo YouTube | ❌ à créer | Commerciale |
| musique libre de droits pour vidéo | ❌ à créer | Informationnelle (fort volume) |
| combien de temps pour monter une vidéo | ❌ à créer | Longue traîne |

### Grappe 2 — Événements (plus forte valeur au clic)
**Page pilier : `evenements.html`** — `vidéaste mariage`, `film de mariage`

| Requête cible | Statut | Intention |
|---|---|---|
| montage vidéo mariage | ✅ article existant | Commerciale |
| **prix vidéaste mariage** | ❌ à créer | **Achat — priorité n° 1** |
| vidéaste bar mitsvah | ❌ à créer | Achat, peu concurrentiel |
| vidéaste anniversaire / EVJF | ❌ à créer | Achat |

### Grappe 3 — Créateurs de contenu (trafic → conversion)
| Requête cible | Statut |
|---|---|
| formats Reels / Shorts / TikTok | ✅ article existant |
| filmer un vlog au smartphone | ✅ article existant |
| erreurs de montage | ✅ article existant |
| sous-titres automatiques sur vidéo | ❌ à créer |

---

## 5. Pages à créer, par ratio impact / effort

| Priorité | Page | Pourquoi | Effort |
|---|---|---|---|
| **1** | **`tarifs.html`** — page dédiée | « prix montage vidéo » est LA requête d'achat. Aujourd'hui c'est une simple ancre, impossible à positionner. Le contenu existe déjà (3 formules + simulateur) | Faible — déplacer l'existant |
| **2** | **`prix-videaste-mariage.html`** | Requête à très forte intention d'achat, panier le plus élevé du site | Moyen |
| **3** | **`blog.html`** — hub d'articles | Le blog n'a aucune page dédiée : pas de porte d'entrée, pas de page à faire remonter, maillage plafonné | Faible |
| **4** | **`montage-video-youtube.html`** | Landing par cas d'usage, cible les créateurs réguliers (récurrence = meilleure valeur client) | Moyen |
| **5** | `mentions-legales.html` + `confidentialite.html` | **Obligatoire en France** et signal E-E-A-T ; leur absence pèse sur la confiance | Faible |

> Recommandation de structure : créer de vrais dossiers (`/tarifs/index.html`) donne des URLs propres
> (`studiobobine.fr/tarifs/`). Attention : les chemins d'images deviennent alors `../images/…`.
> À défaut, garder le format plat actuel qui fonctionne partout sans configuration.

---

## 6. Stratégie éditoriale

### Les 6 articles existants sont trop courts
484 à 932 mots (médiane ~ 570). Sur des requêtes concurrentielles, les pages classées font
généralement 1 200 à 2 000 mots. **Enrichir l'existant est plus rentable que publier du neuf** :
la page est déjà indexée, elle a un historique, il suffit de la densifier.

Ordre d'enrichissement conseillé (par valeur commerciale) :
1. `blog-prix-montage-video.html` (583 mots) → viser 1 500 : ajouter un tableau de fourchettes par
   type de projet, une section « pourquoi de tels écarts », 5 questions FAQ balisées.
2. `blog-montage-mariage.html` (548 mots) → viser 1 500 : déroulé type d'un jour J, check-list
   à imprimer, délais, extraits de films.
3. `blog-deleguer-montage.html` (484 mots) → viser 1 200 : calcul chiffré du coût horaire réel.

### Modèle à appliquer à chaque article
- **H1** contenant le mot-clé principal, une seule fois.
- **Réponse directe dans les 60 premiers mots** → c'est ce qui capte les extraits optimisés (position zéro).
- H2 formulés comme des questions réelles (alimente « Autres questions posées »).
- Un tableau ou une liste ordonnée (formats les plus repris en extrait optimisé).
- **Bloc FAQ de 4-5 questions balisé en `FAQPage`** — le site n'en a que sur 2 pages, c'est le
  gain le plus rapide sur l'ensemble du blog.
- 2 liens internes minimum : 1 vers un article frère, **1 vers une page commerciale**.
- Une image avec `alt` descriptif contenant naturellement le mot-clé.

### 5 sujets à publier (par priorité)
| Sujet | Mot-clé principal | Mots-clés secondaires |
|---|---|---|
| Combien coûte un vidéaste de mariage en 2026 ? | prix vidéaste mariage | tarif, demi-journée, forfait, devis |
| Où trouver des musiques libres de droits pour ses vidéos | musique libre de droits vidéo | droit d'auteur, YouTube, banque de sons |
| Combien de temps faut-il pour monter une vidéo ? | temps de montage vidéo | ratio rushs/montage, délai |
| Ajouter des sous-titres à ses vidéos : le guide | sous-titres vidéo automatiques | SRT, accessibilité, Reels |
| Quel format vidéo pour un mariage : teaser ou film long ? | teaser mariage | film souvenir, durée |

---

## 7. Ce qui ne peut pas être fait sans vous

| Sujet | Pourquoi c'est bloqué | Ce qu'il faut faire |
|---|---|---|
| **Domaine `studiobobine.fr`** | Toutes les URLs absolues (canonical, sitemap, og:image) utilisent ce domaine. S'il n'est pas le vôtre, **tout est à refaire** | Confirmez le domaine définitif avant mise en ligne |
| **Google Search Console** | Nécessite votre compte Google et une validation de propriété | Créez-le, soumettez `sitemap.xml`, surveillez « Pages » et « Améliorations » |
| **Témoignages et chiffres** | « +300 vidéos livrées », « 4,9/5 », « sept ans d'expérience », témoignages Lucas/Sarah/Emma sont des exemples. Publier de faux avis est **sanctionnable** (Google et DGCCRF) | Remplacez par du réel, ou retirez les chiffres |
| **Mentions légales / confidentialité** | Obligation légale en France, et signal de confiance pour Google | À rédiger |
| **Coordonnées** | `hello@studiobobine.fr` et le WhatsApp `33600000000` sont fictifs | À remplacer |
| **Google Business Profile** | Nécessite votre identité et une validation postale | Gratuit, très rentable si vous ciblez « vidéaste mariage + ville » |
| **Backlinks** | Ne se génèrent pas depuis le code | Annuaires mariage, partenaires (photographes, lieux de réception), presse locale |

---

## 8. Prochaines actions, dans l'ordre

**Avant la mise en ligne**
1. Confirmer le domaine, puis vérifier que canonical + sitemap + og:image l'utilisent.
2. Remplacer les chiffres et témoignages fictifs (risque légal et E-E-A-T).
3. Ajouter mentions légales et politique de confidentialité.
4. Brancher les formulaires Formspree (`VOTRE_ID_CONTACT`, `VOTRE_ID_LEADMAGNET`, `VOTRE_ID_COMMANDE`).
5. **Ne pas déployer** les 6 pages internes (`montage-video.html` de la marque « ATELIER CUT »,
   maquettes de style, checklist, feuille de route). Elles sont en `noindex`, mais le plus propre
   reste de ne pas les envoyer du tout.

**Semaine 1 après la mise en ligne**
6. Search Console : valider la propriété, soumettre le sitemap, demander l'indexation des 8 pages.
7. Contrôler le rendu social sur les débogueurs Facebook et LinkedIn (gratuits).
8. Mesurer les Core Web Vitals sur PageSpeed Insights (gratuit) et noter le point de départ.

**Mois 1**
9. Créer `tarifs.html` puis `blog.html` (contenu déjà existant à déplacer).
10. Enrichir `blog-prix-montage-video.html` et `blog-montage-mariage.html` + y ajouter des blocs FAQ balisés.
11. Ouvrir un Google Business Profile si vous ciblez une zone géographique.

**Mois 2-3**
12. Publier `prix-videaste-mariage.html` et les 2 premiers sujets de la liste éditoriale.
13. Démarcher 5 à 10 partenaires locaux pour des liens entrants.
14. Analyser les requêtes réelles dans Search Console et réoptimiser les titres les moins cliqués.

---

### Outils gratuits suffisants pour tout piloter
Google Search Console · PageSpeed Insights · Test des résultats enrichis (Google) ·
Validateur de schémas (schema.org) · Débogueurs de partage Facebook et LinkedIn ·
Google Trends · suggestions automatiques et « Autres questions posées » de Google.

*Aucun outil payant n'est nécessaire pour exécuter ce plan.*
