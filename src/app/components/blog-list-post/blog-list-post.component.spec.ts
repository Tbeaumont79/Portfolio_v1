import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListPostComponent } from './blog-list-post.component';

describe('BlogListPostComponent', () => {
  let component: BlogListPostComponent;
  let fixture: ComponentFixture<BlogListPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogListPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
