# Guide — Remplacer les emojis et SVG par de vraies photos Unsplash

Ce guide vous permet de remplacer chaque visuel du site par une vraie
photo, sans compétence technique. Pour chaque emplacement : ce qu'il
faut chercher sur Unsplash, l'intention de l'image, et le code exact à
coller.

---

## Méthode générale (à lire une fois)

1. Allez sur **https://unsplash.com** (photos gratuites, libres d'usage,
   sans attribution obligatoire — mais l'attribution est appréciée).
2. Tapez les mots-clés indiqués (en anglais : Unsplash est plus riche
   en anglais).
3. Téléchargez la photo qui vous plaît (bouton « Download »).
4. Créez un dossier **`images/`** à côté de vos fichiers `.html`.
5. Renommez la photo avec le nom indiqué (colonne « Nom du fichier »)
   et placez-la dans `images/`.
6. Dans le code HTML, remplacez le bloc emoji/SVG par la balise `<img>`
   fournie.

**Astuce format :** pour un site rapide, redimensionnez vos photos à
~1600 px de large max et exportez en JPG qualité 80 %. Outil gratuit :
squoosh.app.

**Astuce cohérence :** choisissez des photos avec une ambiance
chaleureuse et lumineuse (tons dorés, lumière naturelle) pour rester
raccord avec l'univers Studio Bobine.

---

## PAGE D'ACCUEIL (studio-bobine.html / index.html)

### 1. Collage du hero (3 images)
Intention : donner envie, montrer des gens qui filment / voyagent /
partagent des moments.

| Emplacement | Rechercher sur Unsplash | Nom du fichier |
|---|---|---|
| Grande image | `couple travel vlog camera` | hero-couple.jpg |
| Image moyenne | `family filming vacation` | hero-famille.jpg |
| Petite image | `creator editing video laptop` | hero-createur.jpg |

Code à coller (remplace le `src="data:image/svg..."` de chaque image,
en gardant l'attribut `data-local` comme repère) :

```html
<img src="images/hero-couple.jpg" alt="Couple filmant son voyage" loading="lazy" width="600" height="400">
```

### 2. Section « Pour qui » — 4 profils
Intention : incarner chaque type de client.

| Profil | Rechercher sur Unsplash | Nom du fichier |
|---|---|---|
| Créateurs de contenu | `youtuber filming vlog` | icp-createur.jpg |
| Vlogs en couple | `couple hiking camera` | icp-couple.jpg |
| Moments de famille | `family beach candid` | icp-famille.jpg |
| Aventures perso | `road trip van adventure` | icp-aventure.jpg |

### 3. Section « Avant / Après »
Intention : illustrer la transformation d'un rush brut en film fini.

| Emplacement | Rechercher sur Unsplash | Nom du fichier |
|---|---|---|
| Avant (brut) | `raw phone footage messy` | ba-avant.jpg |
| Après (monté) | `cinematic travel shot warm` | ba-apres.jpg |

### 4. Section « Qui sommes-nous »
Intention : un vrai visage, humaniser la marque.

| Emplacement | Rechercher sur Unsplash | Nom du fichier |
|---|---|---|
| Portrait monteur | `video editor portrait workspace` | about-portrait.jpg |

```html
<img src="images/about-portrait.jpg" alt="Le monteur de Studio Bobine" loading="lazy" width="480" height="600">
```

### 5. Portfolio / Réalisations
Intention : vignettes de vidéos. Cherchez des plans « cinématiques ».

| Rechercher sur Unsplash | Noms de fichiers |
|---|---|
| `travel cinematic landscape` | work-1.jpg |
| `wedding film still` | work-2.jpg |
| `city vlog street` | work-3.jpg |
| `family moment golden hour` | work-4.jpg |
| `mountain adventure drone` | work-5.jpg |
| `couple sunset beach` | work-6.jpg |

### 6. Cartes du blog (6 articles)
Intention : illustrer le sujet de chaque article.

| Article | Rechercher sur Unsplash | Nom du fichier |
|---|---|---|
| Filmer un vlog de voyage | `person filming travel phone` | blog-vlog.jpg |
| Erreurs de montage | `video editing timeline screen` | blog-montage.jpg |
| Formats réseaux | `smartphone social media vertical` | blog-formats.jpg |
| Prix du montage | `money budget desk flatlay` | blog-prix.jpg |
| Montage de mariage | `wedding ceremony emotional` | blog-mariage.jpg |
| Déléguer le montage | `busy creator laptop coffee` | blog-deleguer.jpg |

---

## PAGE ÉVÉNEMENTS (evenements.html)

### Collage du hero (3 images)
| Emplacement | Rechercher sur Unsplash | Nom du fichier |
|---|---|---|
| Mariage | `wedding couple celebration` | ev-mariage.jpg |
| Anniversaire | `birthday party candles joy` | ev-anniversaire.jpg |
| Bar mitsvah | `celebration family gathering` | ev-barmitsvah.jpg |

### Cartes « types d'événements »
Reprenez les 3 images ci-dessus, ou cherchez des variantes :
`wedding videographer`, `birthday celebration`, `synagogue ceremony`.

### Section « La formule vidéaste + montage »
Intention : montrer un vidéaste au travail sur un événement.

| Rechercher sur Unsplash | Nom du fichier |
|---|---|
| `videographer filming event` | ev-videaste.jpg |

---

## STYLES ALTERNATIFS (si vous en choisissez un)

### Style éditorial coloré / Cinéma sombre
Ces styles gagnent énormément avec de vraies photos plein cadre.
Cherchez des plans **cinématiques et chauds** :
`cinematic travel`, `golden hour portrait`, `film still warm tones`.
Un seul grand visuel de hero de qualité suffit à transformer le rendu.

### Style néo-brutaliste
Ce style fonctionne au contraire **très bien sans photos** (aplats de
couleur, emojis assumés). Si vous voulez des images, préférez des
photos très contrastées, presque graphiques.

---

## Rappel important sur les emojis

Certains emojis (🎬, 💞, 🌍…) font partie du **parti pris graphique**,
surtout dans les styles brutaliste et pastel. Vous n'êtes pas obligé de
tous les remplacer : gardez-les là où ils servent de pictogrammes, et
remplacez par des photos uniquement les grandes zones visuelles (hero,
portfolio, profils, blog). C'est le meilleur équilibre entre chaleur
humaine (photos) et lisibilité (pictos).

---

## Si vous utilisez Claude Code ou Cowork

Ces outils, lancés sur votre ordinateur, ont accès à internet et
peuvent automatiser tout ce guide : télécharger les photos, les
redimensionner, les ranger dans `images/`, et modifier le code à votre
place. Donnez-leur ce fichier comme consigne — il contient déjà tous
les mots-clés et noms de fichiers attendus. Demandez par exemple :
« Suis GUIDE-images-unsplash.md : télécharge les photos correspondantes
depuis Unsplash, mets-les dans images/, et remplace les SVG/emojis dans
les fichiers HTML. »
