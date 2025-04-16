<img src="https://camo.githubusercontent.com/f59a0f92aa5c5a29a35437c7bef1359a50b80363c8d7b70d5751fd91602c6da3/68747470733a2f2f766974652d7068702e6e697469746563682e64652f6173736574732f766974652d7068702e6c6f676f2e737667" alt="php + vite logo" class="mx-auto"/>

<i>Temps de lecture : 5 minutes</i>

# Introduction

Aujourd'hui à l'école, mon professeur m'a demandé de créer une simple application CRUD avec PHP et MySQL. J'ai donc décidé de me lancer et d'apprendre à utiliser Vite avec PHP. L'idée principale était d'essayer d'installer Tailwind avec Vite sur mon projet et d'avoir accès à l'écosystème JavaScript dans mon projet PHP.

## Petit rappel : qu'est-ce que Vite ?

Pour ceux qui ne connaissent pas, Vite est un outil de build qui permet de créer des applications web rapides et efficaces en optimisant automatiquement votre code et vos dépendances pendant le développement. Cet article n'entrera pas dans les détails concernant Vite. Si vous souhaitez plus d'informations, vous pouvez consulter la [documentation officielle](https://vitejs.dev/).

# Comment utiliser Vite avec PHP

Tout d'abord, nous devons initialiser le projet avec npm :

```bash
npm init -y
```

Ensuite, nous devons installer Vite et le plugin Vite pour PHP :

```bash
npm install vite && npm install vite-plugin-php
```

Après cela, nous pouvons créer notre fichier vite.config.ts en nous basant sur la documentation du [plugin Vite pour PHP](https://vite-php.nititech.de/)

```typescript
import { defineConfig } from "vite";
import usePHP from "vite-plugin-php";

export default defineConfig({
  plugins: [usePHP()],
});
```

Assurez-vous d'avoir ces scripts définis dans votre fichier package.json :

```js
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```

Vous pouvez ensuite taper `npm run dev` pour démarrer le serveur de développement.

Il devrait avoir démarré et vous devriez pouvoir accéder à l'application à l'adresse http://localhost:5173. Vous devriez voir votre fichier index.php dans le navigateur.
Si vous retournez dans votre dossier de projet, vous verrez qu'un dossier caché a été créé appelé : .php-tmp, c'est là que Vite stockera les fichiers compilés.
