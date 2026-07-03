import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
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
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DecimalPipe,
    InfluencerCardComponent,
    LoadingSkeletonComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly influencerService = inject(InfluencerService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly influencers = signal<Influencer[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly pageSize = signal(12);
  readonly currentPage = signal(1);

  readonly searchControl = new FormControl('');
  readonly genderControl = new FormControl<Gender | ''>('');
  readonly categoryControl = new FormControl<number | ''>('');
  readonly sortControl = new FormControl<InfluencerSort>('most_booked');

  priceRange = signal<PriceRange>({ min: 0, max: 10000 });
  maxPrice = signal(10000);
  private priceTouched = false;
  private readonly priceChange$ = new Subject<void>();

  readonly sortOptions: { value: InfluencerSort; label: string }[] = [
    { value: 'most_booked', label: 'Most Booked' },
    { value: 'most_followers', label: 'Most Followers' },
    { value: 'newest', label: 'Newest' },
    { value: 'lowest_price', label: 'Lowest Price' },
    { value: 'highest_price', label: 'Highest Price' },
    { value: 'alphabetical', label: 'A – Z' },
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
    this.applyQueryParams();
    this.setupSearchDebounce();
    this.setupPriceDebounce();
  }

  private applyQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;
    this.searchControl.setValue(params.get('search') ?? '', { emitEvent: false });
    this.genderControl.setValue((params.get('gender') as Gender) ?? '', { emitEvent: false });
    const categoryId = params.get('category_id');
    this.categoryControl.setValue(categoryId ? Number(categoryId) : '', { emitEvent: false });
    this.sortControl.setValue((params.get('sort') as InfluencerSort) ?? 'most_booked', {
      emitEvent: false,
    });
    const maxPriceParam = params.get('max_price');
    if (maxPriceParam) {
      this.maxPrice.set(Number(maxPriceParam));
      this.priceTouched = true;
    }
    this.loadInfluencers();
  }

  private setupSearchDebounce(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onFilterChange());
  }

  private setupPriceDebounce(): void {
    this.priceChange$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onFilterChange());
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.syncUrl();
    this.loadInfluencers();
  }

  onPriceChange(value: number): void {
    this.maxPrice.set(value);
    this.priceTouched = true;
    this.priceChange$.next();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadInfluencers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.genderControl.setValue('');
    this.categoryControl.setValue('');
    this.sortControl.setValue('most_booked');
    this.maxPrice.set(this.priceRange().max);
    this.priceTouched = false;
    this.onFilterChange();
  }

  private syncUrl(): void {
    const capApplied = this.priceTouched && this.maxPrice() < this.priceRange().max;
    const queryParams: Record<string, string | null> = {
      search: this.searchControl.value || null,
      gender: this.genderControl.value || null,
      category_id: this.categoryControl.value ? String(this.categoryControl.value) : null,
      sort: this.sortControl.value && this.sortControl.value !== 'most_booked' ? this.sortControl.value : null,
      max_price: capApplied ? String(Math.round(this.maxPrice())) : null,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private loadCategories(): void {
    this.categoryService.list().subscribe((res) => this.categories.set(res.data));
  }

  private loadPriceRange(): void {
    this.influencerService.getPriceRange().subscribe((res) => {
      this.priceRange.set(res.data);
      // Snap the slider to the real max unless the user picked a custom cap.
      if (!this.priceTouched) {
        this.maxPrice.set(res.data.max);
      }
    });
  }

  loadInfluencers(): void {
    this.loading.set(true);
    // Only cap by price when the user has moved the slider below the real max,
    // otherwise we'd hide everyone priced above the initial slider default.
    const capApplied = this.priceTouched && this.maxPrice() < this.priceRange().max;
    const filters: InfluencerFilters = {
      search: this.searchControl.value || undefined,
      gender: this.genderControl.value || undefined,
      category_id: this.categoryControl.value || undefined,
      max_price: capApplied ? this.maxPrice() : undefined,
      sort: this.sortControl.value || 'most_booked',
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

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total() / this.pageSize()));
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
