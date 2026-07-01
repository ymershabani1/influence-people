import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

document.documentElement.classList.remove('dark');
localStorage.removeItem('influencer-directory-theme');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
