import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'trending',
        loadComponent: () =>
          import('./features/public/trending/trending.component').then(
            (m) => m.TrendingComponent
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/public/search/search.component').then((m) => m.SearchComponent),
      },
      {
        path: 'influencers/:id',
        loadComponent: () =>
          import('./features/public/influencer-detail/influencer-detail.component').then(
            (m) => m.InfluencerDetailComponent
          ),
      },
    ],
  },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/admin/login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'influencers',
        loadComponent: () =>
          import('./features/admin/influencers/admin-influencers.component').then(
            (m) => m.AdminInfluencersComponent
          ),
      },
      {
        path: 'influencers/new',
        loadComponent: () =>
          import('./features/admin/influencers/influencer-form.component').then(
            (m) => m.InfluencerFormComponent
          ),
      },
      {
        path: 'influencers/:id/edit',
        loadComponent: () =>
          import('./features/admin/influencers/influencer-form.component').then(
            (m) => m.InfluencerFormComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories/admin-categories.component').then(
            (m) => m.AdminCategoriesComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/settings/admin-settings.component').then(
            (m) => m.AdminSettingsComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
