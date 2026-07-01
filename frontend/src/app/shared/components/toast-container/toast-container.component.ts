import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="toast-container">
      @for (msg of toastService.messages(); track msg.id) {
        <div class="toast animate-slide-up" [class]="'toast-' + msg.type" (click)="toastService.dismiss(msg.id)">
          <mat-icon class="toast-icon">
            {{ msg.type === 'success' ? 'check_circle' : msg.type === 'error' ? 'error' : 'info' }}
          </mat-icon>
          <span>{{ msg.message }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-container {
      @apply fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm;
    }
    .toast {
      @apply flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg cursor-pointer;
      @apply text-white text-sm font-medium;
    }
    .toast-success { @apply bg-emerald-600; }
    .toast-error { @apply bg-red-600; }
    .toast-info { @apply bg-primary-600; }
    .toast-icon { @apply text-xl; width: 20px; height: 20px; font-size: 20px; }
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
