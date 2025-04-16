import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
@Component({
  selector: 'app-blog-post',
  imports: [MarkdownModule, RouterModule],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css',
})
export class BlogPostComponent {
  slug: string;
  markdownSrc: string;

  constructor(private route: ActivatedRoute) {
    this.slug = '';
    this.markdownSrc = '';
  }
  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    if (this.slug) {
      this.markdownSrc = `/blog/fr/${this.slug}.md`;
    }
  }

  onLoad(event: any) {
    console.log('Content loaded successfully', event);
  }

  onError(event: any) {
    console.error('Error loading markdown content', event);
  }
}
