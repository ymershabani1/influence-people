import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { InfluencerService } from '../../../core/services/influencer.service';
import { Influencer } from '../../../core/models/influencer.model';
import { SocialIconsComponent } from '../../../shared/components/social-icons/social-icons.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-influencer-detail',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    SocialIconsComponent,
    LoadingSkeletonComponent,
  ],
  templateUrl: './influencer-detail.component.html',
  styleUrl: './influencer-detail.component.scss',
})
export class InfluencerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly influencerService = inject(InfluencerService);

  readonly influencer = signal<Influencer | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.influencerService.getById(id).subscribe({
      next: (res) => {
        this.influencer.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  phoneHref(phone: string): string {
    return `tel:${phone.replace(/\s+/g, '')}`;
  }

  mailHref(email: string): string {
    const inf = this.influencer();
    const subject = inf ? encodeURIComponent(`Collaboration inquiry - ${inf.full_name}`) : '';
    return `mailto:${email}?subject=${subject}`;
  }

  hasSocialLinks(inf: Influencer): boolean {
    return Object.keys(inf.social_links).length > 0;
  }
}
