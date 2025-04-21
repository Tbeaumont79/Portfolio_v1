const fs = require("fs");
const path = require("path");

// Chemins des fichiers
const serverPath = path.join(__dirname, "dist", "portfolio", "server");
const rootServerPath = path.join(__dirname, "dist", "portfolio");
const serverMjsPath = path.join(serverPath, "server.mjs");
const rootServerMjsPath = path.join(rootServerPath, "server.mjs");

// Vérifier si le dossier server existe
if (!fs.existsSync(serverPath)) {
  console.log("Création du dossier server...");
  fs.mkdirSync(serverPath, { recursive: true });
}

// Fonction pour chercher les fichiers index
function findIndexFile(basePath, localePath) {
  const csrPath = path.join(basePath, "browser", localePath, "index.csr.html");
  const normalPath = path.join(basePath, "browser", localePath, "index.html");

  if (fs.existsSync(csrPath)) {
    return csrPath;
  } else if (fs.existsSync(normalPath)) {
    return normalPath;
  }
  return null;
}

// Copier les fichiers index.html vers le dossier server
const frIndexPath = findIndexFile(rootServerPath, "fr");
const serverHtmlPath = path.join(serverPath, "index.server.html");

if (frIndexPath) {
  console.log(
    `Copie de l'index français (${frIndexPath}) vers server/index.server.html`
  );
  fs.copyFileSync(frIndexPath, serverHtmlPath);
} else {
  console.error("ERREUR: Impossible de trouver l'index français.");
}

// Version compatible avec Netlify Edge Functions - n'utilise pas fs
const serverMjsContent = `import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Vérifier si on est au niveau racine ou dans le dossier server
let browserPath = '../browser';
if (process.env.NETLIFY) {
  browserPath = './browser';
}

console.log("Chemin du répertoire browser:", join(__dirname, browserPath));

// Servir les fichiers statiques depuis le répertoire browser
app.use(express.static(resolve(__dirname, browserPath)));

// Redirection vers index.html pour toutes les autres routes
app.get('*', (req, res) => {
  // Support pour les locales multiples - vérification si la requête est pour en-US
  if (
    req.url.startsWith('/en-US') ||
    req.headers['accept-language']?.includes('en')
  ) {
    return res.sendFile(join(__dirname, browserPath, 'en-US', 'index.html'));
  }

  // Par défaut en français
  res.sendFile(join(__dirname, browserPath, 'fr', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`;

// Écrire le fichier server.mjs dans le dossier server
fs.writeFileSync(serverMjsPath, serverMjsContent);

// Écrire aussi à la racine pour Netlify
fs.writeFileSync(rootServerMjsPath, serverMjsContent);

console.log("Le fichier server.mjs a été créé avec succès!");
