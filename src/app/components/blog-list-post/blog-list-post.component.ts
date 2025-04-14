import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-blog-list-post',
  imports: [RouterModule],
  templateUrl: './blog-list-post.component.html',
  styleUrl: './blog-list-post.component.css',
})
export class BlogListPostComponent {
  posts = [
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
}
