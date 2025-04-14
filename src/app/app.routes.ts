import { Routes } from '@angular/router';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { BlogListPostComponent } from './components/blog-list-post/blog-list-post.component';
import { HomeComponent } from './components/home/home.component';
export const routes: Routes = [
  {
    path: 'blog/:slug',
    component: BlogPostComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
