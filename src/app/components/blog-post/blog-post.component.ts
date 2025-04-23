import { Component, isDevMode } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-post',
  imports: [MarkdownModule, RouterModule, CommonModule],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css',
})
export class BlogPostComponent {
  slug: string;
  markdownSrc: string;
  language: string;
  loadError: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.slug = '';
    this.markdownSrc = '';
    this.language = '';
  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const url = this.route.snapshot.url;
    if (url.length >= 2) {
      this.language = url[1].path;
    }

    if (this.slug && this.language) {
      const basePath = isDevMode() ? '.' : '';
      this.markdownSrc = `${basePath}/content/blog/${this.language}/${this.slug}.md`;
      console.log('Loading markdown:', this.markdownSrc);
    } else {
      this.loadError = true;
      console.error('Missing slug or language information');
    }
  }

  onLoad(event: any) {
    console.log('Content loaded successfully', event);
    this.loadError = false;
  }

  onError(event: any) {
    console.error('Error loading markdown content', event);
    this.loadError = true;
  }
}
