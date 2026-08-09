# Consigne à donner à Claude Code ou Cowork

Copiez le bloc ci-dessous et collez-le comme premier message à Claude
Code (dans le terminal, depuis le dossier du site) ou à Cowork (après
avoir glissé le dossier du site dans l'app). Adaptez les crochets si
besoin.

---

## À COLLER TEL QUEL

> Contexte : ce dossier contient le site vitrine « Studio Bobine », un
> service de montage vidéo. Les images sont actuellement des
> placeholders SVG intégrés en base64 et des emojis. Chaque `<img>`
> porte un attribut `data-local="..."` qui indique le nom de fichier
> prévu, et un `alt` qui décrit l'image voulue.
>
> Ta mission :
> 1. Lis le fichier `GUIDE-images-unsplash.md` : il liste, pour chaque
>    emplacement, les mots-clés Unsplash et le nom de fichier attendu.
> 2. Télécharge depuis Unsplash (https://unsplash.com) une photo
>    correspondant à chaque emplacement, en te basant sur les mots-clés
>    du guide et sur l'attribut `alt` de chaque image.
> 3. Redimensionne chaque photo à 1600 px de large maximum et exporte
>    en JPG qualité ~80 % pour garder le site rapide.
> 4. Range les photos dans un dossier `images/` avec les noms de
>    fichiers indiqués dans le guide.
> 5. Dans les fichiers HTML, remplace chaque `src="data:image/svg..."`
>    par `src="images/[nom-du-fichier].jpg"`, en conservant les
>    attributs `alt`, `loading="lazy"`, `width` et `height`.
> 6. Garde une ambiance visuelle cohérente : photos lumineuses, tons
>    chaleureux/dorés, lumière naturelle.
> 7. Ne touche pas aux emojis qui servent de pictogrammes (petits
>    icônes) — remplace seulement les grandes zones visuelles : le
>    collage du hero, les cartes de profils, l'avant/après, le
>    portrait « qui sommes-nous », le portfolio, les cartes de blog et
>    les visuels de la page événements.
> 8. Vérifie à la fin qu'aucune image n'est cassée et que le site
>    s'ouvre correctement.
>
> Important : Unsplash propose des photos gratuites et libres d'usage.
> Si une photo précise n'est pas trouvable, choisis la plus proche de
> l'intention décrite dans le `alt`. Montre-moi un récapitulatif des
> photos choisies avant de finaliser.

---

## Fichiers à fournir avec la consigne

Assure-toi que ces fichiers sont dans le dossier que tu ouvres :
- Tous les fichiers `.html` du site
- `GUIDE-images-unsplash.md` (la liste détaillée des images)

## Ordre conseillé

1. Récupère d'abord ton dossier de site (celui qui contient
   `index.html`, `evenements.html`, les `blog-*.html`, etc.).
2. Ajoute-y les deux fichiers de guide (`GUIDE-images-unsplash.md` et
   ce fichier).
3. Ouvre le dossier dans Claude Code ou Cowork.
4. Colle la consigne ci-dessus.
5. Valide les photos qu'il te propose, puis laisse-le finaliser.

## Astuce

Si tu préfères garder la main, demande-lui de te proposer 2 ou 3
options par emplacement plutôt que de choisir seul — tu gardes le
contrôle du rendu final tout en gagnant tout le temps de la partie
technique.
