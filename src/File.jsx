import { toast } from 'react-toastify';

function exportFile(content) {
    const link = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = ".gitlab-ci.yml";
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success('YML généré avec succès ! (renommez-le .gitlab-ci.yml si besoin)');
}

function download_file(path) {
    const link = document.createElement("a");
    link.href = path;
    link.download = path.split('/').pop();
    link.click();
    URL.revokeObjectURL(link.href);

    toast.info('Le fichier version.py est à placer à la racine de votre projet.');
}

function v_data(b_dev, b_prod) {
    return `
update_version_snapshot:
  stage: version
  variables:
    GIT_STRATEGY: none
  script:
    - echo $(git log -1 --pretty=%B) | python3 ./version.py "\${NEXUS_URL}"
  only:
${b_dev.map(b => `    - ${b}`).join('\n')}
  tags:
    - dockerswarm

update_version_release:
  stage: version
  variables:
    GIT_STRATEGY: none
  script:
    - echo $(git log -1 --pretty=%B) | python3 ./version.py release "\${NEXUS_URL}"
  only:
${b_prod.map(b => `    - ${b}`).join('\n')}
  tags:
    - dockerswarm
`
}

function test_data(b_dev) {
    return `
unit-test:
  stage: test
  variables:
    GIT_STRATEGY: none
  script: 
    - ./gradlew test
  artifacts:
    when: always
    reports:
      junit: build/test-results/test/**/TEST-*.xml
  only:
${b_dev.map(b => `    - ${b}`).join('\n')}
  tags:
    - dockerswarm
  allow_failure: true

integration-test:
  stage: test
  variables:
    GIT_STRATEGY: none
  script: 
    - ./gradlew integrationTest
  artifacts:
    when: always
    reports:
      junit: build/test-results/integrationTest/**/TEST-*.xml
  only:
${b_dev.map(b => `    - ${b}`).join('\n')}
  tags:
    - dockerswarm
  allow_failure: true
`
}

export default function File(dev, prod, versioning, nexus, tests, webhook, webhookInput) {
    const b_dev = dev.replace(/ /g,'').split(',')
    const b_prod = prod.replace(/ /g,'').split(',')

    const file = `# Generate with Gitlab Init
stages:
  - prepare_grails_project${versioning ? "\n  - version": ""}${tests ? "\n  - test": ""}
  - build
  - deploy

image: gradle:alpine

variables:
  GRADLE_OPTS: "-Dorg.gradle.daemon=false"
  NEXUS_URL: "${nexus}"
  WEBHOOK: "${webhookInput}"

before_script:
  - export GRADLE_USER_HOME=\`pwd\`/.gradle
  - chmod +x gradlew

prepare_grails_project:
  variables:
    GIT_STRATEGY: fetch
  stage: prepare_grails_project
  script:
    - ./gradlew clean
  tags:
    - dockerswarm
${tests ? test_data(b_dev) : ""}
build:
  variables:
    GIT_STRATEGY: none
  stage: build
  script:
    - ./gradlew assemble --refresh-dependencies
    - ls -alh build
  only:
${b_dev.map(b => `    - ${b}`).join('\n')}
${b_prod.map(b => `    - ${b}`).join('\n')}
  tags:
    - dockerswarm
${versioning ? v_data(b_dev, b_prod) : ""}
deploy_nexus_va:
  stage: deploy
  variables:
    GIT_STRATEGY: none
  dependencies:
    - build
  script:
    - ./gradlew removeAll --stacktrace --info${webhook ? "\n    - curl --data \"test=test\" \"${WEBHOOK}\"": ""}
  only:
${b_dev.map(b => `    - ${b}`).join('\n')}
  tags:
    - dockerswarm

deploy_nexus_prod:
  stage: deploy
  variables:
    GIT_STRATEGY: none
  dependencies:
    - build
  script:
    - ./gradlew removeAll --stacktrace --info${webhook ? "\n    - curl --data \"test=test\" \"${WEBHOOK}\"": ""}
  only:
${b_prod.map(b => `    - ${b}`).join('\n')}
  tags:
    - dockerswarm
`

    exportFile(file)
    if (versioning) { download_file('assets/version.py') }
}