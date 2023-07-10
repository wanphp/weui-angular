import {AuthConfig} from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://www.wanphp.com',
  tokenEndpoint: 'https://www.wanphp.com/auth/accessToken',
  userinfoEndpoint: 'https://www.wanphp.com/api/userProfile',
  clientId: 'testClient',
  redirectUri: window.location.origin + '/weui-angular/oauth',
  responseType: 'code',
  requireHttps: true,
  skipSubjectCheck: true
};
