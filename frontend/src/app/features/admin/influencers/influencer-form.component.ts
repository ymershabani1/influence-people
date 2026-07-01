import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { InfluencerService } from '../../../core/services/influencer.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, FollowersMode, Gender } from '../../../core/models/influencer.model';
import { ToastService } from '../../../core/services/toast.service';
import {
  SOCIAL_FOLLOWER_PLATFORMS,
  formatFollowers,
  sumSocialFollowers,
} from '../../../shared/utils/followers.util';

@Component({
  selector: 'app-influencer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatRadioModule,
  ],
  templateUrl: './influencer-form.component.html',
  styleUrl: './influencer-form.component.scss',
})
export class InfluencerFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly influencerService = inject(InfluencerService);
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isEdit = signal(false);
  readonly loading = signal(false);
  readonly categories = signal<Category[]>([]);
  readonly imagePreview = signal<string | null>(null);
  readonly socialPlatforms = SOCIAL_FOLLOWER_PLATFORMS;

  private influencerId: number | null = null;
  private imageFile: File | null = null;

  readonly genders: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  readonly form = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    username: ['', Validators.required],
    information: [''],
    gender: ['male' as Gender, Validators.required],
    country: [''],
    contact_phone: [''],
    contact_email: [''],
    languages: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    followers_mode: ['manual' as FollowersMode, Validators.required],
    followers_count: [0, Validators.min(0)],
    instagram_followers: [0, Validators.min(0)],
    tiktok_followers: [0, Validators.min(0)],
    facebook_followers: [0, Validators.min(0)],
    youtube_followers: [0, Validators.min(0)],
    twitter_followers: [0, Validators.min(0)],
    linkedin_followers: [0, Validators.min(0)],
    pinterest_followers: [0, Validators.min(0)],
    snapchat_followers: [0, Validators.min(0)],
    twitch_followers: [0, Validators.min(0)],
    category_ids: [[] as number[]],
    instagram_url: [''],
    tiktok_url: [''],
    facebook_url: [''],
    youtube_url: [''],
    twitter_url: [''],
    linkedin_url: [''],
    pinterest_url: [''],
    snapchat_url: [''],
    discord_url: [''],
    twitch_url: [''],
    website_url: [''],
    is_featured: [false],
    is_active: [true],
  });

  get isPlatformMode(): boolean {
    return this.form.getRawValue().followers_mode === 'platforms';
  }

  get computedTotal(): number {
    const raw = this.form.getRawValue();
    if (raw.followers_mode !== 'platforms') {
      return raw.followers_count;
    }
    return sumSocialFollowers({
      instagram: raw.instagram_followers,
      tiktok: raw.tiktok_followers,
      facebook: raw.facebook_followers,
      youtube: raw.youtube_followers,
      twitter: raw.twitter_followers,
      linkedin: raw.linkedin_followers,
      pinterest: raw.pinterest_followers,
      snapchat: raw.snapchat_followers,
      twitch: raw.twitch_followers,
    });
  }

  get computedTotalFormatted(): string {
    return formatFollowers(this.computedTotal);
  }

  ngOnInit(): void {
    this.categoryService.list(false).subscribe((res) => this.categories.set(res.data));
    this.setupFollowersModeToggle();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.influencerId = Number(id);
      this.loadInfluencer(this.influencerId);
    } else {
      this.applyFollowersModeState();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.toast.error('Please upload a JPG, PNG, or WebP image.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('Image must be smaller than 5 MB.');
      input.value = '';
      return;
    }

    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);

    const formData = new FormData();
    const raw = this.form.getRawValue();

    formData.append('currency', 'EUR');
    formData.append('followers_mode', raw.followers_mode);

    if (raw.followers_mode === 'manual') {
      formData.append('followers_count', String(raw.followers_count));
    } else {
      for (const platform of this.socialPlatforms) {
        const count = raw[`${platform.key}_followers` as keyof typeof raw] as number;
        if (count > 0) {
          formData.append(`social_followers[${platform.key}]`, String(count));
        }
      }
    }

    const skipKeys = new Set([
      'followers_count',
      'instagram_followers', 'tiktok_followers', 'facebook_followers',
      'youtube_followers', 'twitter_followers', 'linkedin_followers',
      'pinterest_followers', 'snapchat_followers', 'twitch_followers',
    ]);

    Object.entries(raw).forEach(([key, value]) => {
      if (skipKeys.has(key)) return;

      if (key === 'category_ids') {
        (value as number[]).forEach((id) => formData.append('category_ids[]', String(id)));
      } else if (key === 'languages') {
        const langs = (value as string).split(',').map((l) => l.trim()).filter(Boolean);
        langs.forEach((l) => formData.append('languages[]', l));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (this.imageFile) {
      formData.append('profile_image', this.imageFile);
    }

    const request$ = this.isEdit() && this.influencerId
      ? this.influencerService.update(this.influencerId, formData)
      : this.influencerService.create(formData);

    request$.subscribe({
      next: (res) => {
        this.toast.success(res.message);
        this.router.navigate(['/admin/influencers']);
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  private setupFollowersModeToggle(): void {
    this.form.controls.followers_mode.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFollowersModeState());
  }

  private applyFollowersModeState(): void {
    const isPlatform = this.form.getRawValue().followers_mode === 'platforms';

    if (isPlatform) {
      this.form.controls.followers_count.disable({ emitEvent: false });
      for (const p of this.socialPlatforms) {
        this.form.get(`${p.key}_followers`)?.enable({ emitEvent: false });
      }
    } else {
      this.form.controls.followers_count.enable({ emitEvent: false });
      for (const p of this.socialPlatforms) {
        this.form.get(`${p.key}_followers`)?.disable({ emitEvent: false });
      }
    }
  }

  private loadInfluencer(id: number): void {
    this.influencerService.getById(id).subscribe((res) => {
      const inf = res.data;
      const social = inf.social_followers ?? {};

      this.form.patchValue({
        first_name: inf.first_name,
        last_name: inf.last_name,
        username: inf.username,
        information: inf.information || '',
        gender: inf.gender,
        country: inf.country || '',
        contact_phone: inf.contact_phone || '',
        contact_email: inf.contact_email || '',
        languages: inf.languages?.join(', ') || '',
        price: inf.price,
        followers_mode: inf.followers_mode ?? 'manual',
        followers_count: inf.followers_count,
        instagram_followers: social['instagram'] ?? 0,
        tiktok_followers: social['tiktok'] ?? 0,
        facebook_followers: social['facebook'] ?? 0,
        youtube_followers: social['youtube'] ?? 0,
        twitter_followers: social['twitter'] ?? 0,
        linkedin_followers: social['linkedin'] ?? 0,
        pinterest_followers: social['pinterest'] ?? 0,
        snapchat_followers: social['snapchat'] ?? 0,
        twitch_followers: social['twitch'] ?? 0,
        category_ids: inf.categories.map((c) => c.id),
        instagram_url: inf.instagram_url || '',
        tiktok_url: inf.tiktok_url || '',
        facebook_url: inf.facebook_url || '',
        youtube_url: inf.youtube_url || '',
        twitter_url: inf.twitter_url || '',
        linkedin_url: inf.linkedin_url || '',
        pinterest_url: inf.pinterest_url || '',
        snapchat_url: inf.snapchat_url || '',
        discord_url: inf.discord_url || '',
        twitch_url: inf.twitch_url || '',
        website_url: inf.website_url || '',
        is_featured: inf.is_featured,
        is_active: inf.is_active,
      });

      this.applyFollowersModeState();

      if (inf.profile_image_url) {
        this.imagePreview.set(inf.profile_image_url);
      }
    });
  }
}
