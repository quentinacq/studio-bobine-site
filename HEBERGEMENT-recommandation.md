# Hébergement — analyse et recommandation

Analyse réalisée le 6 août 2026 sur l'état réel du projet Studio Bobine.

---

## 0. Rappel de notre architecture réelle

| Caractéristique | État constaté |
|---|---|
| Nature | **17 fichiers HTML statiques**, CSS et JS **inline** dans chaque page |
| Build | **Aucun** — pas de `package.json`, pas de framework, pas de npm |
| Poids | 4,7 Mo dont 4,1 Mo d'images (33 JPG) |
| Dépôt git | **Aucun pour l'instant** |
| Backend | **Aucun** |
| Base de données | **Aucune** |
| Dépendances runtime | Google Fonts, Formspree, lien WhatsApp |
| URLs canoniques | Format **plat avec `.html`** (`/blog-montage-mariage.html`) |
| À venir | Paiement Stripe, upload de rushs vidéo, persistance des commandes |

**Trois faits déterminants pour le choix :**

1. **Aucun build** → les quotas de « minutes de build » ne nous concernent pas. Ils sont hors sujet
   dans notre cas, alors qu'ils dominent la plupart des comparatifs.
2. **Activité commerciale** (le site encaisse des paiements) → certaines offres gratuites
   l'interdisent contractuellement.
3. **Métier vidéo** → nos clients envoient des Go de rushs et **nous leur renvoyons des vidéos
   montées**. Le trafic sortant (egress) est notre futur poste de coût n° 1, pas le stockage.

---

## 1. Résumé exécutif

**Cloudflare est nettement supérieur pour notre cas précis**, pour une raison qui domine tout le
reste : nous sommes une activité vidéo, donc notre coût futur est piloté par le trafic sortant.
Cloudflare Pages offre une **bande passante illimitée** et R2 un **egress à 0 €**, quand tous les
concurrents facturent la sortie de données. Vercel est par ailleurs **exclu** : son offre Hobby
interdit l'usage commercial, or nous vendons des prestations. Netlify est le meilleur remplaçant.

---

## 2. Tableau comparatif

Lecture orientée **notre** projet. « Build » est marqué non pertinent car nous n'en avons aucun.

| Critère | **Cloudflare** | Netlify | Vercel | GitHub Pages | Render | Firebase | Railway | Fly.io |
|---|---|---|---|---|---|---|---|---|
| **Usage commercial autorisé (gratuit)** | ✅ | ✅ | ❌ **Hobby = non commercial** | ⚠️ déconseillé | ✅ | ✅ | ✅ | ✅ |
| Compatible HTML statique sans build | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ surdimensionné | ⚠️ surdimensionné |
| **Bande passante offerte** | ✅ **illimitée** | 100 Go/mois | 100 Go/mois | ~100 Go (souple) | 100 Go | **360 Mo/jour** | trial | trial |
| **Egress stockage fichiers** | ✅ **0 €** (R2) | facturé | facturé | — | facturé | facturé | facturé | facturé |
| Fonctions serveur (Stripe) | ✅ Workers 100k req/j | ✅ 125k req/mois | ✅ | ❌ **aucune** | ✅ | ⚠️ **carte bancaire exigée** | ✅ | ✅ |
| Stockage fichiers volumineux | ✅ **R2 10 Go** | ⚠️ limité | ⚠️ Blob réduit | ❌ | ❌ éphémère | 5 Go | ❌ | volume |
| Base de données | ✅ D1 ~5 Go | ❌ externe | ❌ externe | ❌ | ⚠️ **expire à 90 j** | Firestore 1 Go | ⚠️ crédit | ⚠️ crédit |
| **Vraiment gratuit dans la durée** | ✅ | ✅ | ✅ (mais non commercial) | ✅ | ⚠️ mise en veille | ⚠️ | ❌ **~5 $/mois** | ❌ |
| Pas de mise en veille / cold start | ✅ | ✅ | ✅ | ✅ | ❌ **~50 s** | ✅ | ✅ | ⚠️ |
| Domaine perso + SSL | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CI/CD GitHub | ✅ | ✅ | ✅ | ✅ natif | ✅ | ⚠️ Actions | ✅ | ✅ |
| Déploiement sans git (glisser-déposer) | ✅ | ✅ | ⚠️ | ❌ | ❌ | ⚠️ CLI | ❌ | ❌ |
| Variables d'environnement | ✅ + secrets | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Simplicité pour notre cas | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★★☆☆☆ |

---

## 3. Analyse détaillée

### Cloudflare Pages + Workers + R2 + D1 — **recommandé**

**Pourquoi pour nous.** Trois besoins futurs de notre tunnel de commande sont couverts par le
même fournisseur, gratuitement :
- **Workers** pour créer la session Stripe côté serveur (notre clé secrète ne doit jamais partir
  dans le navigateur — c'est aujourd'hui le blocage réel de `commande-confirmation.html`).
- **R2** pour recevoir les rushs et **livrer les montages**. C'est le point décisif : R2 ne facture
  **jamais** la sortie de données. Sur un métier vidéo, c'est structurellement différent de tous
  les autres.
- **D1** pour enregistrer les commandes (aujourd'hui, rien n'est persisté).

**Bande passante illimitée** : notre page d'accueil charge 29 images. Même si elles sont en
`lazy loading`, nous n'aurons jamais à surveiller un compteur.

**Point de vigilance concret.** Cloudflare Pages a tendance à rediriger `/page.html` vers `/page`.
Or nos 9 balises `canonical` pointent vers des URLs **en `.html`**. Si la redirection s'applique,
chaque canonical pointe vers une redirection — ce qui affaiblit exactement le travail SEO effectué.
**À tester le jour du déploiement** (voir § 6). Ce n'est pas bloquant, mais ça doit être vérifié
avant de soumettre le sitemap à Google.

**Limite honnête.** L'écosystème Workers demande un peu plus d'apprentissage que les fonctions
Netlify, et Cloudflare fait converger Pages vers Workers. Pour un site statique, l'impact est nul
aujourd'hui ; ça se ressentira au moment d'écrire la fonction Stripe.

### Netlify — meilleure alternative

Le plus simple de tous, et l'usage commercial est autorisé. `netlify.com/drop` accepte un
glisser-déposer du dossier : c'est d'ailleurs ce que recommande déjà notre `LISEZ-MOI.txt`.
Les fonctions serverless suffisent largement pour Stripe.

**Ce qui le disqualifie comme premier choix :** 100 Go/mois de bande passante, et surtout un
**dépassement facturé cher**. Pour un site vitrine seul, 100 Go sont confortables. Mais dès que
nous livrerons des vidéos montées, le compteur explose : un film de 4 min en 1080p pèse ~500 Mo,
donc **200 livraisons = 100 Go**. Netlify n'est pas conçu pour du transfert vidéo.

### Vercel — **écarté**

Techniquement excellent et parfait pour le statique. Mais **l'offre Hobby est réservée à un usage
non commercial**. Studio Bobine vend des prestations et encaisse des paiements : nous serions hors
conditions d'utilisation, avec un risque de suspension. Passer en Pro coûte ~20 $/mois, ce qui
sort de la contrainte « 100 % gratuit pour démarrer ». Même problème d'egress facturé que Netlify.

### GitHub Pages

Gratuit, stable, SSL et domaine perso inclus, et il sert les fichiers `.html` **sans redirection**
— donc parfaitement compatible avec nos canonicals actuels. Mais **aucune fonction serveur** :
impossible d'y faire tourner Stripe, impossible de stocker des vidéos. Il ne peut héberger que la
moitié vitrine du projet, jamais le tunnel de commande. Écarté pour cette raison, sachant en plus
que GitHub déconseille l'usage e-commerce sur Pages.

### Render

L'offre gratuite **met le service en veille après inactivité** : le premier visiteur attend
~50 secondes. Sur un site commercial dont l'objectif est la conversion, c'est rédhibitoire, et ça
dégrade aussi les Core Web Vitals que nous venons d'optimiser. La base PostgreSQL gratuite
**expire au bout de 90 jours**. Écarté.

### Firebase Hosting

**360 Mo de transfert par jour** sur l'offre Spark : notre accueil avec ses 29 images atteindrait
ce plafond en quelques centaines de visites. De plus, les Cloud Functions exigent d'activer la
facturation (plan Blaze) avec une carte bancaire — donc plus de garantie « 100 % gratuit ».
Écarté.

### Railway et Fly.io

Les deux ont supprimé leur véritable offre gratuite : on est sur du crédit d'essai puis un
paiement (~5 $/mois minimum chez Railway). Ils sont par ailleurs conçus pour des applications
conteneurisées avec serveur permanent — **très surdimensionnés pour 17 fichiers HTML statiques**.
Écartés sur la contrainte « 100 % gratuit » comme sur la contrainte « simplicité ».

---

## 4. Recommandation finale

> **Cloudflare Pages**, avec Workers + R2 + D1 en réserve pour la suite.

Le raisonnement tient en une phrase : **nous sommes une activité vidéo, donc notre coût futur
est piloté par le trafic sortant, et Cloudflare est le seul à le rendre gratuit et illimité.**

Les autres arguments confirment le choix :
- usage commercial autorisé (ce qui exclut Vercel Hobby) ;
- pas de mise en veille (ce qui exclut Render) ;
- bande passante illimitée (ce qui protège un site à 29 images) ;
- les trois briques manquantes du tunnel de commande — fonction Stripe, stockage vidéo, base de
  données — sont disponibles **chez le même fournisseur, gratuitement** ;
- déploiement possible **par glisser-déposer**, sans dépôt git, ce qui correspond à l'état actuel
  du projet.

**Si la priorité absolue est la simplicité immédiate**, Netlify est un choix défendable pour la
phase vitrine — mais il faudra migrer le stockage vidéo ailleurs le jour où le tunnel devient réel.
Autant partir directement sur la cible.

---

## 5. Architecture recommandée

| Couche | Solution | Coût | Justification liée à notre projet |
|---|---|---|---|
| **Frontend** | Cloudflare Pages | 0 € | 17 fichiers HTML servis en CDN, bande passante illimitée |
| **Backend** | Cloudflare Workers | 0 € | Une seule fonction utile : créer la session Stripe et vérifier le webhook |
| **Base de données** | Cloudflare D1 | 0 € | Table `commandes` (formule, prix, client, statut, fichiers) |
| **Stockage fichiers** | Cloudflare R2 | 0 € jusqu'à 10 Go | Rushs entrants **et** montages livrés, sans frais de sortie |
| **DNS** | Cloudflare DNS | 0 € | Domaine `studiobobine.fr` + SSL automatique |
| **Formulaires** | Formspree (déjà prévu) | 0 € | Déjà câblé dans le code, 50 envois/mois |
| **Paiement** | Stripe | commission uniquement | Pas d'abonnement, seulement ~1,5 % + 0,25 € par transaction |

**Ordre de mise en œuvre conseillé**
1. Déployer le site tel quel (glisser-déposer) et brancher le domaine. → *le site est en ligne*
2. Créer le dépôt GitHub et connecter le déploiement automatique. → *CI/CD*
3. Ajouter le Worker Stripe + R2 quand le tunnel doit devenir réel.
4. Ajouter D1 pour la persistance des commandes.

Les étapes 3 et 4 ne sont **pas nécessaires pour mettre le site en ligne** : le site vitrine peut
partir dès aujourd'hui.

---

## 6. À vérifier le jour du déploiement (impact SEO direct)

Nos canonicals pointent vers des URLs en `.html`. Il faut confirmer que l'hébergeur ne les
redirige pas. Une fois le site en ligne :

```bash
curl -sI https://studiobobine.fr/blog-montage-mariage.html | head -1
```

- Réponse `200` → tout est cohérent, rien à faire.
- Réponse `301` vers `/blog-montage-mariage` → il faut aligner les canonicals, les `og:url` et le
  `sitemap.xml` sur la version **sans** `.html`. C'est une modification mécanique de 10 minutes,
  mais **elle doit être faite avant de soumettre le sitemap** à la Search Console.

---

## 7. Plan de migration si nous dépassons le gratuit

Le passage au payant se fera **brique par brique**, jamais en bloc. Aucune migration de fournisseur
n'est nécessaire : ce sont des ajustements de forfait.

| Seuil atteint | Signal concret | Action | Coût |
|---|---|---|---|
| **> 10 Go de vidéos stockées** (≈ 20-30 commandes archivées) | Alerte R2 | Payer le stockage au-delà | ~0,015 $/Go/mois → **~1 $/mois pour 60 Go** |
| **> 100 000 requêtes/jour** sur le Worker | Tableau de bord Workers | Passer au plan Workers payant | **5 $/mois** |
| **> 50 formulaires/mois** | Formspree sature | Remplacer par un Worker + envoi d'email | 0 € |
| **Besoin d'un espace client** | Demandes récurrentes | Cloudflare Access ou Supabase Auth | 0 € au départ |
| **Équipe / préproduction** | Plusieurs intervenants | Cloudflare Pages plan payant | ~20 $/mois |

**Politique de rétention à prévoir** : supprimer les rushs bruts après livraison + 30 jours. C'est
ce qui maintient R2 sous les 10 Go gratuits durablement, car ce sont les fichiers entrants qui
pèsent, pas les montages livrés.

**Coût réaliste à 12 mois** : **0 €** tant que nous restons sous 10 Go stockés, puis de l'ordre de
**1 à 6 $/mois**. À comparer avec la même activité sur Netlify ou Vercel, où la livraison de
vidéos ferait basculer la facture sur la bande passante bien avant.
