// Register locale data
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';

registerLocaleData(localeFr, 'fr', localeFrExtra);
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);
registerLocaleData(localeEn, 'en', localeEnExtra);
registerLocaleData(localeEn, 'en-US', localeEnExtra);
