# Liens à utiliser sur Instagram et TikTok

Document interne (les fichiers `.md` ne sont pas publiés sur le site).

## Liens prêts à copier

| Où | Lien |
|---|---|
| Bio Instagram | `https://www.studiobobine.fr/liens?utm_source=instagram&utm_medium=bio` |
| Bio TikTok | `https://www.studiobobine.fr/liens?utm_source=tiktok&utm_medium=bio` |
| Story Instagram (modèle) | `https://www.studiobobine.fr/contact?utm_source=instagram&utm_medium=story&utm_content=NOM-DE-LA-STORY` |
| Publication Instagram (modèle) | `https://www.studiobobine.fr/contact?utm_source=instagram&utm_medium=post&utm_content=NOM-DE-LA-PUBLICATION` |

Pour une story ou une publication, remplacez seulement la fin
(`NOM-DE-LA-STORY`) par un nom court qui décrit le contenu. Exemples :

- `https://www.studiobobine.fr/contact?utm_source=instagram&utm_medium=story&utm_content=avant-apres-mariage`
- `https://www.studiobobine.fr/contact?utm_source=instagram&utm_medium=post&utm_content=offre-rentree`

Le même principe marche pour TikTok : remplacez `instagram` par `tiktok`.

## À quoi servent ces étiquettes ?

La partie après le `?` ne change rien pour le visiteur : il arrive sur la
même page. Elle sert seulement à la mesure d'audience, pour savoir **d'où
viennent les visiteurs** et **quel contenu les a fait venir** :

- `utm_source` : le réseau (`instagram`, `tiktok`…) ;
- `utm_medium` : l'endroit du lien (`bio`, `story`, `post`…) ;
- `utm_content` : le contenu précis (le nom de la story ou de la publication).

On peut ainsi répondre à des questions comme « combien de demandes de devis
viennent de la bio Instagram ? » ou « quelle story a amené le plus de
visites ? ».

Ne mettez ces étiquettes **que dans les liens publiés à l'extérieur**
(réseaux sociaux, e-mails). Jamais dans les liens entre deux pages du site :
Umami garde déjà la source d'origine pendant toute la visite.

## Où retrouver les résultats dans Umami

1. Connectez-vous à Umami Cloud et ouvrez le site Studio Bobine.
2. Allez dans **Rapports** (Reports), puis **UTM**.
3. Choisissez la période : le rapport montre les visites par source, par
   support (medium) et par contenu.

Pour savoir combien de ces visiteurs ont demandé un devis, regardez
l'événement `cta_devis` dans l'onglet **Événements** (Events), en filtrant
sur la source voulue.

## Règle de nommage

Pour que les chiffres ne soient pas éparpillés en plusieurs lignes
(`Instagram`, `instagram`, `insta`…), écrivez toujours :

- en **minuscules** ;
- avec des **tirets** à la place des espaces (`avant-apres-mariage`) ;
- **sans accents** ni caractères spéciaux (`evenement`, pas `événement`) ;
- toujours le même mot pour la même chose : `instagram`, `tiktok`, `bio`,
  `story`, `post`.
