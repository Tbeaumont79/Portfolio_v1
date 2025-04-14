import { Routes } from '@angular/router';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
export const routes: Routes = [
  {
    path: 'blog/:slug',
    component: BlogPostComponent,
  },
];
