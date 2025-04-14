import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
@Component({
  selector: 'app-blog-post',
  imports: [MarkdownModule],
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
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.slug = slug;
      this.markdownSrc = `./content/blog/${slug}.md`;
    }
  }
}
