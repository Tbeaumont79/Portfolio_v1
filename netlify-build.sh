#!/bin/bash

# Exécuter la build
echo "Running Angular build..."
npm run build

# Créer le dossier server s'il n'existe pas
echo "Creating server directory..."
mkdir -p dist/portfolio/server

# Copier index.html vers index.server.html
echo "Copying index.html to index.server.html..."
cp-cli dist/portfolio/browser/en-US/index.html dist/portfolio/server/index.server.html

# Trouver et copier server.mjs dans le bon dossier
echo "Searching for server.mjs file..."
find dist/portfolio/server -name "server.mjs" | while read serverfile; do
  echo "Found server.mjs at $serverfile, copying to dist/portfolio/server/server.mjs"
  cp-cli "$serverfile" dist/portfolio/server/server.mjs
  exit 0
done

# Chercher dans les dossiers spécifiques si pas trouvé
if [ ! -f dist/portfolio/server/server.mjs ]; then
  echo "Checking in specific folders..."

  if [ -f dist/portfolio/server/main/server.mjs ]; then
    echo "Found in main folder"
    cp-cli dist/portfolio/server/main/server.mjs dist/portfolio/server/server.mjs
  elif [ -f dist/portfolio/server/fr/server.mjs ]; then
    echo "Found in fr folder"
    cp-cli dist/portfolio/server/fr/server.mjs dist/portfolio/server/server.mjs
  elif [ -f dist/portfolio/server/en-US/server.mjs ]; then
    echo "Found in en-US folder"
    cp-cli dist/portfolio/server/en-US/server.mjs dist/portfolio/server/server.mjs
  else
    echo "WARNING: Could not find server.mjs"
    # Créer un fichier vide pour éviter l'erreur
    echo "// Placeholder" > dist/portfolio/server/server.mjs
  fi
fi

echo "Build preparation complete!"
