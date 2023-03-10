# Gitlab Generator

## Fonctionnalités

- Préparation du projet Grails avec gradlew clean.
- Mise à jour de la version de l'application en utilisant un script python (facultatif).
- Exécution des tests unitaires et d'intégration avec gradlew test et gradlew integrationTest (facultatif)
- Génération de l'application avec gradlew assemble.
- Déploiement de l'application sur nexus.
- Vérification de l'état de Portainer (facultatif).
- Gestion automatique des tickets.

## Utilisation

1. Créez un fichier `.gitlab-ci.yml` à la racine de votre projet et ajoutez-y les lignes suivantes :

   ```yml
   include:
   remote: https://raw.githubusercontent.com/ArthurTakase/GitlabGenerator/main/.gitlab-ci.yml
   ```

2. Configurez les variables d'environnement dans les paramètres de votre repo Gitlab (`Réglages` -> `CI/CD` -> `Variables`).

## Variables

| Nom          | Utilisation                                                               | Valeur   |
| ------------ | ------------------------------------------------------------------------- | -------- |
| DEV_BRANCH   | Nom de la branche de développement (ex: develop)                          | `string` |
| PROD_BRANCH  | Nom de la branche de production (ex: master)                              | `string` |
| TESTS        | Exécution des tests unitaires et d'intégration                            | `bool`   |
| NEXUS_URL    | URL du serveur Nexus, gestion automatisée des versions (version HTML)     | `url`    |
| WEBHOOK_DEV  | URL du webhook utilisé pour déployer sur l'environnement de développement | `url`    |
| WEBHOOK_PROD | URL du webhook utilisé pour déployer sur l'environnement de production    | `url`    |
| TOKEN        | [Personal Access Token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) pour l'API de Gitlab (cochez les cases liées à l'api) | `string` |

## Utilisation du versionning

Vous pouvez activer le versionning en renseignant la variable `NEXUS_URL` de votre repo. L'outil se charge de monter automatiquement la version de votre projet suivant le modèle suivant :

`MAJOR.MINOR.PATCH` (ex: 1.12.5)

Par défaut, la partie `PATCH` va augmenter de 1 à chaque nouveau passage dans la CI de Gitlab.
Pour augmenter la `MAJOR` ou la `MINOR`, vous devez le préciser en ajoutant leur nom dans votre message de commit (ex: `MINOR: mon message de commit`).

Si vous écrivez le mot-clef `MISC`, le programme ne changera pas la version de votre projet.

## Gestion des tickets

Pour activer la gestion des tickets, les variables `DEV_BRANCH`, `PROD_BRANCH` et `TOKEN` doivent être renseignées.

- A la création d'une branche, les tickets liés sont taggés avec le label `EN COURS`. Pour lier un ticket à une branche, il faut ajouter `#<numéro du ticket>` dans le nom de la branche (ex: `feat/various_fix#1#5#8`).
- Lors d'un passage sur `DEV_BRANCH`, les tickets sont taggés avec le label `EN TEST`.
- Lors d'un passage sur `PROD_BRANCH`, les tickets sont fermés automatiquement.

## TODO

- Ajouter un tag lors d'un changement de version sur la branche de production.
- Analyse de la qualité de code avec SonarQube ou MegaLinter.

## Notes

- Après une mise à jour du repo, il est nécesaire d'attendre 5 minutes pour que les fichiers se mettent à jour sur raw.github et utilisables sur la CI de gitlab.
