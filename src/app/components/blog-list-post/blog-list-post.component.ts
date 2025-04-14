import { Component,  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { title } from 'process';
@Component({
  selector: 'app-blog-list-post',
  imports: [RouterModule],
  templateUrl: './blog-list-post.component.html',
  styleUrl: './blog-list-post.component.css',
})
export class BlogListPostComponent {
  posts = [{
    slug: 'changing-carrer-post',
    title: 'Changing Carrer',
  }];


}