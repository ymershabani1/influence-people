import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="settings-page">
      <div class="page-header mb-8">
        <h1 class="text-2xl font-bold">Settings</h1>
        <p class="text-gray-500">Application preferences</p>
      </div>

      <mat-card class="p-6 rounded-2xl max-w-lg">
        <h2 class="text-lg font-semibold mb-2">General</h2>
        <p class="text-gray-500 text-sm">Currency is fixed to EUR for all influencers.</p>
      </mat-card>
    </div>
  `,
})
export class AdminSettingsComponent {}
