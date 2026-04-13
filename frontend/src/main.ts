import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { UIComponent } from './app/ui/ui.component';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

bootstrapApplication(UIComponent, appConfig)
  .catch((err) => console.error(err));
