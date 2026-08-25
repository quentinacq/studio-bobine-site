# CLAUDE.md
Source : https://github.com/drona23/claude-token-efficient (MIT) - base universelle + profil "coding".
Ces regles concernent les reponses de Claude, pas le contenu francais du site
(les guillemets typographiques et tirets cadratins restent autorises dans le HTML).

## Approche
- Lire les fichiers existants avant d'ecrire. Ne pas relire un fichier inchange.
- Raisonnement approfondi, sortie concise.
- Ignorer les fichiers de plus de 100 Ko sauf necessite.
- Pas de formule d'accroche flatteuse ni de conclusion inutile.
- Pas d'emoji ni de tiret cadratin dans les reponses.
- Ne pas deviner une API, une version, un flag, un SHA de commit ou un nom de paquet :
  verifier dans le code ou la doc avant d'affirmer.

## Code
- Solution la plus simple qui fonctionne. Pas de sur-ingenierie.
- Pas d'abstraction pour un usage unique, pas de fonctionnalite speculative.
- Editions ciblees plutot que reecriture complete d'un fichier.
- Pas de gestion d'erreur pour des cas impossibles.

## Revue et debug
- Enoncer le bug, montrer le correctif, s'arreter.
- Ne pas speculer sur une cause sans avoir lu le code concerne.
- Si la cause reste incertaine, le dire plutot que deviner.

## Priorite
Les instructions de l'utilisateur priment toujours sur ce fichier.
