import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { UIComponent } from './app/ui/ui.component';

bootstrapApplication(UIComponent, appConfig)
  .catch((err) => console.error(err));
