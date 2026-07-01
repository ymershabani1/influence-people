import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { InfluencerService } from '../../../core/services/influencer.service';
import { CategoryService } from '../../../core/services/category.service';
import {
  Category,
  Gender,
  Influencer,
  InfluencerFilters,
  InfluencerSort,
  PriceRange,
} from '../../../core/models/influencer.model';
import { InfluencerCardComponent } from '../../../shared/components/influencer-card/influencer-card.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatPaginatorModule,
    MatIconModule,
    InfluencerCardComponent,
    LoadingSkeletonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly influencerService = inject(InfluencerService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly influencers = signal<Influencer[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly pageSize = signal(12);
  readonly currentPage = signal(1);

  readonly searchControl = new FormControl('');
  readonly genderControl = new FormControl<Gender | ''>('');
  readonly sortControl = new FormControl<InfluencerSort>('newest');

  priceRange = signal<PriceRange>({ min: 0, max: 10000 });
  minPrice = signal(0);
  maxPrice = signal(10000);

  readonly sortOptions: { value: InfluencerSort; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'lowest_price', label: 'Lowest Price' },
    { value: 'highest_price', label: 'Highest Price' },
    { value: 'most_followers', label: 'Most Followers' },
    { value: 'alphabetical', label: 'Alphabetically' },
  ];

  readonly genderOptions: { value: Gender | ''; label: string }[] = [
    { value: '', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.loadPriceRange();
    this.setupSearch();
    this.loadInfluencers();
  }

  onPriceChange(): void {
    this.currentPage.set(1);
    this.loadInfluencers();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadInfluencers();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadInfluencers();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.currentPage.set(1);
          this.loadInfluencers();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private loadCategories(): void {
    this.categoryService.list().subscribe((res) => {
      this.categories.set(res.data);
    });
  }

  private loadPriceRange(): void {
    this.influencerService.getPriceRange().subscribe((res) => {
      this.priceRange.set(res.data);
      this.minPrice.set(res.data.min);
      this.maxPrice.set(res.data.max);
    });
  }

  loadInfluencers(): void {
    this.loading.set(true);
    const filters: InfluencerFilters = {
      search: this.searchControl.value || undefined,
      gender: this.genderControl.value || undefined,
      min_price: this.minPrice(),
      max_price: this.maxPrice(),
      sort: this.sortControl.value || 'newest',
      per_page: this.pageSize(),
      page: this.currentPage(),
    };

    this.influencerService.list(filters).subscribe({
      next: (res) => {
        this.influencers.set(res.data);
        this.total.set(res.meta.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
