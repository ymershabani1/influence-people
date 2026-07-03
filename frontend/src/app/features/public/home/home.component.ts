import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InfluencerService } from '../../../core/services/influencer.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, Influencer } from '../../../core/models/influencer.model';
import { InfluencerCardComponent } from '../../../shared/components/influencer-card/influencer-card.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

interface Stat {
  label: string;
  value: string;
}

interface Step {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InfluencerCardComponent,
    LoadingSkeletonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly influencerService = inject(InfluencerService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  readonly trending = signal<Influencer[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loadingTrending = signal(true);
  readonly totalInfluencers = signal(0);

  readonly searchForm = new FormGroup({
    search: new FormControl(''),
    category: new FormControl<number | ''>(''),
  });

  readonly steps: Step[] = [
    {
      icon: 'fa-magnifying-glass',
      title: 'Discover Your Match',
      description:
        'Filter thousands of vetted creators by niche, audience, budget and platform to find the perfect fit for your brand.',
    },
    {
      icon: 'fa-handshake',
      title: 'Connect & Collaborate',
      description:
        'Reach out directly, align on deliverables, and kick off campaigns with creators who genuinely love your product.',
    },
    {
      icon: 'fa-chart-line',
      title: 'Track Results',
      description:
        'Measure reach, engagement and conversions in one place so you always know your return on every collaboration.',
    },
  ];

  readonly brands = ['Nova', 'Pulse', 'Vertex', 'Lumen', 'Zenith', 'Orbit'];

  stats = signal<Stat[]>([
    { label: 'Influencers', value: '—' },
    { label: 'Categories', value: '—' },
    { label: 'Campaigns', value: '21M+' },
    { label: 'Brands', value: '5K+' },
  ]);

  ngOnInit(): void {
    this.loadTrending();
    this.loadCategories();
  }

  private loadTrending(): void {
    this.loadingTrending.set(true);
    this.influencerService
      .list({ sort: 'most_booked', per_page: 8, page: 1 })
      .subscribe({
        next: (res) => {
          this.trending.set(res.data);
          this.totalInfluencers.set(res.meta.total);
          this.updateStats();
          this.loadingTrending.set(false);
        },
        error: () => this.loadingTrending.set(false),
      });
  }

  private loadCategories(): void {
    this.categoryService.list().subscribe((res) => {
      this.categories.set(res.data);
      this.updateStats();
    });
  }

  private updateStats(): void {
    this.stats.set([
      { label: 'Influencers', value: this.formatCount(this.totalInfluencers()) },
      { label: 'Categories', value: this.formatCount(this.categories().length) },
      { label: 'Campaigns', value: '21M+' },
      { label: 'Brands', value: '5K+' },
    ]);
  }

  private formatCount(n: number): string {
    if (n <= 0) {
      return '—';
    }
    if (n >= 1000) {
      return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
    }
    return `${n}+`;
  }

  onSearch(event?: Event): void {
    event?.preventDefault();

    const queryParams: Record<string, string> = {};
    const term = this.searchForm.value.search?.trim();
    const category = this.searchForm.value.category;

    if (term) {
      queryParams['search'] = term;
    }
    if (category) {
      queryParams['category_id'] = String(category);
    }

    void this.router.navigate(['/search'], { queryParams });
  }
}
