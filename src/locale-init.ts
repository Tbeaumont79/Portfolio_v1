// Register locale data
import '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';

registerLocaleData(localeFr, 'fr', localeFrExtra);
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);
