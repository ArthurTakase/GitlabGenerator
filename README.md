# Gitlab Generator

## Fonctionnalités

- Préparation du projet Grails avec gradlew clean.
- Mise à jour de la version de l'application en utilisant un script python (facultatif).
- Exécution des tests unitaires et d'intégration avec gradlew test et gradlew integrationTest (facultatif)
- Génération de l'application avec gradlew assemble.
- Déploiement de l'application sur nexus.
- Vérification de l'état de Portainer (facultatif).

## Utilisation

1. Créez un fichier `.gitlab-ci.yml` à la racine de votre projet et ajoutez-y les lignes suivantes :

   ```yml
   include:
   remote: https://raw.githubusercontent.com/ArthurTakase/GitlabGenerator/main/.gitlab-ci.yml
   ```

2. Configurez les variables d'environnement dans les paramètres de votre repo Gitlab (`Réglages` -> `CI/CD` -> `Variables`):

## Variables

| Nom          | Utilisation                                                               | Valeur   |
| ------------ | ------------------------------------------------------------------------- | -------- |
| DEV_BRANCH   | Nom de la branche de développement (ex: develop)                          | `string` |
| PROD_BRANCH  | Nom de la branche de production (ex: master)                              | `string` |
| TESTS        | Exécution des tests unitaires et d'intégration                            | `bool`   |
| NEXUS_URL    | URL du serveur Nexus, gestion automatisée des versions (version HTML)     | `url`    |
| WEBHOOK_DEV  | URL du webhook utilisé pour déployer sur l'environnement de développement | `url`    |
| WEBHOOK_PROD | URL du webhook utilisé pour déployer sur l'environnement de production    | `url`    |

## Utilisation du versionning

Vous pouvez activer le versionning en renseignant la variable `NEXUS_URL` de votre repo. L'outil se charge de monter automatiquement la version de votre projet suivant le modèle suivant :

`MAJOR.MINOR.LEGACY` (ex: 1.12.5)

Par défaut, la partie `LEGACY` va augmenter de 1 à chaque nouveau passage dans la CI de Gitlab.
Pour augmenter la `MAJOR` ou la `MINOR`, vous devez le préciser en ajoutant leur nom dans votre message de commit (ex: `MINOR: mon message de commit`).

Si vous écrivez le mot clef `MISC`, le programme ne changera pas la version de votre projet.

## TODO

- Ajouter un tag lors d'un changement de version sur la branche de production.
- Analyse de la qualité de code avec SonarQube ou MegaLinter.

## Problèmes connus

- Après une mise à jour du repo, il est nécesaire d'attendre 5 minutes pour que les fichiers soient à jour sur raw.github et utilisables sur la CI de gitlab.
