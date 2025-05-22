<i>Temps de lecture: 15 minutes</i>

# Introduction : PHP Unit retours d'experience !

Je viens tout juste de terminé le module php de ma formation et pour finir, on nous a demander de developper un site web de reservation d'evenement. Ayant déjà quelques bases en php j'ai voulu pousser un peu le projet et mettre en place des test d'integration et e2e.

## Structure du projet 🔎

Le projet respecte l'architecture MVC et le principe SOLID.

```
├── 📁 config/               # Contient les fichiers de configuration globaux (base de données, constantes, environnement, etc.)
├── 📁 drivers/              # Contient les abstractions ou intégrations spécifiques pour des services externes (ex: email fichiers, paiement...)
├── 📁 src/                  # Contient le cœur de l’application (architecture MVC)
│   ├── 📁 controllers/      # Gère les requêtes utilisateur et appelle les bons services/models
│   ├── 📁 models/           # Représente les entités métier, structure des données, et logique associée
│   ├── 📁 services/         # Contient la logique métier
│   ├── 📁 validators/       # Regroupe les règles de validation des données (ex: formulaires, inputs API)
│   ├── 📁 views/            # Contient les fichiers de rendu HTML/PHP (dans un contexte MVC classique)
│   └── 📄 bootstrap.php     # Fichier d’amorçage qui initialise les dépendances et l’application
├── 📁 tests/                # Contient les tests fonctionnels et e2e
├── 📁 vendor/               # Géré automatiquement par Composer ; contient les dépendances PHP externes
├── 📄 .gitignore
├── 📄 composer.json
├── 📄 composer.lock
├── 📄 index.php             # Point d’entrée de l’application web (route toutes les requêtes)
└── 📄 README.md
```
