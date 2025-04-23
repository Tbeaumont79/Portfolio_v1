#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

echo "Démarrage du build Angular pour production..."
npm run build

# Vérification que le build s'est bien passé
if [ ! -d "dist/portfolio/browser" ]; then
  echo "Erreur: Le répertoire dist/portfolio/browser n'a pas été créé. Le build a échoué."
  exit 1
fi

# Création du répertoire si nécessaire (ne devrait jamais être nécessaire si le build fonctionne)
mkdir -p dist/portfolio/browser

# Vérification des assets Markdown
echo "Vérification des assets Markdown..."
if [ ! -d "dist/portfolio/browser/assets/blog" ]; then
  echo "Création du répertoire assets/blog..."
  mkdir -p dist/portfolio/browser/assets/blog/fr
  mkdir -p dist/portfolio/browser/assets/blog/en

  # Copie manuelle des fichiers markdown si nécessaire
  echo "Copie des fichiers Markdown..."
  cp -r src/content/blog/fr/* dist/portfolio/browser/assets/blog/fr/
  cp -r src/content/blog/en/* dist/portfolio/browser/assets/blog/en/
fi

# Copie du fichier _redirects dans la sortie de build
echo "Copie des fichiers de redirection..."
cp public/_redirects dist/portfolio/browser/

# S'assurer que le fichier netlify.toml est pris en compte
cp netlify.toml dist/portfolio/

echo "Build et préparation du déploiement terminés avec succès !"
