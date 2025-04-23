#!/bin/bash

# Construction de l'application
npm run build

# Copie du fichier _redirects dans la sortie de build
cp public/_redirects dist/portfolio/browser/

# S'assurer que le fichier netlify.toml est pris en compte
cp netlify.toml dist/portfolio/

echo "Build et préparation du déploiement terminés avec succès !"
