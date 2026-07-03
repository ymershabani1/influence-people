import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfluencerService } from '../../../core/services/influencer.service';
import { Influencer } from '../../../core/models/influencer.model';
import { InfluencerCardComponent } from '../../../shared/components/influencer-card/influencer-card.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [RouterLink, InfluencerCardComponent, LoadingSkeletonComponent],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.scss',
})
export class TrendingComponent implements OnInit {
  private readonly influencerService = inject(InfluencerService);

  readonly influencers = signal<Influencer[]>([]);
  readonly loading = signal(true);
  readonly loadingMore = signal(false);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly pageSize = 12;

  readonly hasMore = computed(() => this.influencers().length < this.total());

  readonly podium = computed(() => this.influencers().slice(0, 3));

  ngOnInit(): void {
    this.load(1);
  }

  private load(page: number): void {
    if (page === 1) {
      this.loading.set(true);
    } else {
      this.loadingMore.set(true);
    }

    this.influencerService
      .list({ sort: 'most_booked', per_page: this.pageSize, page })
      .subscribe({
        next: (res) => {
          this.influencers.set(
            page === 1 ? res.data : [...this.influencers(), ...res.data]
          );
          this.total.set(res.meta.total);
          this.page.set(page);
          this.loading.set(false);
          this.loadingMore.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadingMore.set(false);
        },
      });
  }

  loadMore(): void {
    if (this.hasMore() && !this.loadingMore()) {
      this.load(this.page() + 1);
    }
  }
}
