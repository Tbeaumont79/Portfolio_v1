import { Routes } from '@angular/router';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: 'blog/fr/:slug',
    component: BlogPostComponent,
  },
  {
    path: 'blog/en/:slug',
    component: BlogPostComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
