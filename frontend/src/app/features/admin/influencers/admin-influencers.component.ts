import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { SelectionModel } from '@angular/cdk/collections';
import { InfluencerService } from '../../../core/services/influencer.service';
import { Influencer } from '../../../core/models/influencer.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-influencers',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
  ],
  templateUrl: './admin-influencers.component.html',
  styleUrl: './admin-influencers.component.scss',
})
export class AdminInfluencersComponent implements OnInit {
  private readonly influencerService = inject(InfluencerService);
  private readonly toast = inject(ToastService);

  readonly influencers = signal<Influencer[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly pageSize = signal(15);
  readonly currentPage = signal(1);

  readonly searchControl = new FormControl('');
  readonly selection = new SelectionModel<Influencer>(true, []);

  readonly displayedColumns = ['select', 'avatar', 'name', 'username', 'price', 'followers', 'status', 'actions'];

  ngOnInit(): void {
    this.loadInfluencers();
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadInfluencers();
      });
  }

  loadInfluencers(): void {
    this.loading.set(true);
    this.influencerService
      .list({
        search: this.searchControl.value || undefined,
        per_page: this.pageSize(),
        page: this.currentPage(),
        sort: 'newest',
      })
      .subscribe({
        next: (res) => {
          this.influencers.set(res.data);
          this.total.set(res.meta.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadInfluencers();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.influencers().length;
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.influencers().forEach((row) => this.selection.select(row));
    }
  }

  bulkDelete(): void {
    const ids = this.selection.selected.map((i) => i.id);
    if (!ids.length) return;

    if (!confirm(`Delete ${ids.length} influencer(s)?`)) return;

    this.influencerService.bulkDelete(ids).subscribe({
      next: (res) => {
        this.toast.success(res.message);
        this.selection.clear();
        this.loadInfluencers();
      },
    });
  }

  deleteOne(id: number): void {
    if (!confirm('Delete this influencer?')) return;
    this.influencerService.delete(id).subscribe({
      next: (res) => {
        this.toast.success(res.message);
        this.loadInfluencers();
      },
    });
  }
}
