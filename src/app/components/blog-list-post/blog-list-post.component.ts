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
  ];
}
