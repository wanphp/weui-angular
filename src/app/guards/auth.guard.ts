import {Injectable} from '@angular/core';
import {UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from '../app.config';
import {AppState} from "../store";
import {Store} from "@ngrx/store";
import {loginAction, loginSuccessAction} from '../store/auth/actions';
import {UserModel} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private oauthService: OAuthService, private store: Store<AppState>) {
    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.setupAutomaticSilentRefresh();
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.oauthService.hasValidAccessToken()) {
      // 用户已认证，可以访问路由
      this.store.dispatch(loginSuccessAction({accessToken: this.oauthService.getAccessToken()}));
      this.store.dispatch(loginAction({loginUser: this.oauthService.getIdentityClaims() as UserModel}));
      return true;
    } else {
      // 用户未认证，重定向到授权端点
      return this.oauthService.loadDiscoveryDocumentAndLogin().then(
        (isAuthenticated) => {
          if (isAuthenticated) {
            this.store.dispatch(loginSuccessAction({accessToken: this.oauthService.getAccessToken()}));
            this.store.dispatch(loginAction({loginUser: this.oauthService.getIdentityClaims() as UserModel}));
            this.oauthService.setupAutomaticSilentRefresh();
            return true;
          } else {
            // 记录当前url
            localStorage.setItem('currentPath', window.location.toString());
            return false;
          }
        },
        (error) => {
          console.error('Authentication failed', error);
          return false;
        }
      );
    }
  }

  canActivateChild():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate();
  }
}
