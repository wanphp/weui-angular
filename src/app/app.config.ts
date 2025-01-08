import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideStore} from '@ngrx/store';
import {appReducers} from './store';
import {provideHttpClient} from '@angular/common/http';
import {AuthConfig, provideOAuthClient} from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(appReducers),
    provideHttpClient(),
    provideOAuthClient(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes)
  ]
};

export const authConfig: AuthConfig = {
  issuer: 'https://www.wanphp.com',
  tokenEndpoint: 'https://www.wanphp.com/auth/accessToken',
  userinfoEndpoint: 'https://www.wanphp.com/api/userProfile',
  clientId: 'testClient',
  redirectUri: window.location.origin + '/weui-angular/oauth',
  responseType: 'code',
  requireHttps: true,
  skipSubjectCheck: true,
  decreaseExpirationBySec: 60000
};

