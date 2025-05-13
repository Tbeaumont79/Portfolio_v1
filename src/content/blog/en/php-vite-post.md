<img src="https://camo.githubusercontent.com/f59a0f92aa5c5a29a35437c7bef1359a50b80363c8d7b70d5751fd91602c6da3/68747470733a2f2f766974652d7068702e6e697469746563682e64652f6173736574732f766974652d7068702e6c6f676f2e737667" alt="php + vite logo" class="mx-auto"/>

<i>Reading time : 5 minutes</i>

# Introduction

Today at school my teatcher ask me to create a simple CRUD app with PHP and MySQL, so i decided to give it a try and learn how to use Vite with PHP. The main idea behind this is that i wanted to try to install tailwind with vite on my project and have access to the javascript Ecosystem in my php project.

## Quick reminder what is Vite ?

For those who don't know, Vite is a build tool that allows you to create fast and efficient web applications by automatically optimizing your code and dependencies during development. This post won't go in detail about Vite if you want more information you can read the [official documentation](https://vitejs.dev/).

# How to use Vite with PHP

First we will need to init the project with npm :

```bash
npm init -y
```

Then we will need to install vite and the vite plugin for php :

```bash
npm install vite && npm install vite-plugin-php
```

After that we can create our vite.config.ts file based on the documentation of the [vite plugin for php](https://vite-php.nititech.de/)

```typescript
import { defineConfig } from "vite";
import usePHP from "vite-plugin-php";

export default defineConfig({
  plugins: [usePHP()],
});
```

Make sure you have those scripts defined in your package.json file:

```js
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```

Then you can type `npm run dev` to start the development server.

It should have started and you should be able to access the app at http://localhost:5173, You should see your index.php file in the browser.
If you go back in your project folder you will see that a hidden folder have been created called : .php-tmp which is where Vite will store the compiled files.
