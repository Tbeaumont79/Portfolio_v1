import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-blog-list-post',
  imports: [RouterModule],
  templateUrl: './blog-list-post.component.html',
  styleUrl: './blog-list-post.component.css',
})
export class BlogListPostComponent {
  postsEn = [
    {
      slug: 'changing-carrer-post',
      title: 'Changing Carrer',
      date: 'Feb 1, 2025',
      description:
        "I've always been passioned about web development and now I'm starting a career in it, this is my first blog post and i will tell you everything i went through to get here and what i'm looking forward to.",
    },
    {
      slug: 'web-accessibility-post',
      title: 'Enhancing Web Accessibility Best Practices for Developers',
      date: 'Feb 1, 2025',
      description:
        'A guide to improving web accessibility with practical tips, examples, and best practices for developers.',
    },
    {
      slug: 'myjourney-mercureandsymfony-post',
      title:
        'Building a Real-Time Chat App, my Journey with Mercure and Symfony',
      date: 'Feb 23, 2025',
      description:
        "I've created a chat app using symfony and mercure, in this blog post i will tell you how to setup mercure with docker and symfony.",
    },
    {
      slug: 'php-vite-post',
      title: 'How to use Vite with PHP',
      date: 'Apr 8, 2025',
      description:
        'In this posts we are going to take a look at how to use Vite with PHP. Why it can be usefull and how to configure it.',
    },
  ];
  postsFr = [
    {
      slug: 'changement-de-carriere-post',
      title: 'Changement de carrière',
      date: '1er février 2025',
      description:
        "J'ai toujours été passionné par le développement web et maintenant je commence une carrière dans le domaine, c'est mon premier article et je vais vous parler de tout ce que j'ai traversé pour arriver ici et de ce que je suis en train de faire.",
    },
    {
      slug: 'accessibilite-web-post',
      title:
        "Amélioration des pratiques d'accessibilité web pour les développeurs",
      date: '1er février 2025',
      description:
        "Un guide pour améliorer l'accessibilité web avec des conseils pratiques, des exemples et les meilleures pratiques pour les développeurs.",
    },
    {
      slug: 'decouverte-mercureandsymfony-post',
      title: 'Découverte de Mercure et Symfony',
      date: '23 février 2025',
      description:
        "J'ai créé une application de chat en utilisant Symfony et Mercure, dans cet article je vous expliquerai comment configurer Mercure avec Docker et Symfony.",
    },
    {
      slug: 'php-vite-post',
      title: 'Comment utiliser Vite avec PHP',
      date: '8 avril 2025',
      description:
        'Dans cet article, nous allons examiner comment utiliser Vite avec PHP. Pourquoi cela peut être utile et comment le configurer.',
    },
  ];
}
