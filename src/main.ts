
// function loadServiceWorker(): void {
//   // if (environment.production && ('serviceWorker' in navigator)) {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('service-worker.js')
//       .catch(err => console.error('Service worker registration failed with:', err));
//   }
// }

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
};


if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}

