import {Injectable} from '@angular/core';
import {Router, UrlTree} from '@angular/router';
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
  constructor(private oauthService: OAuthService, private store: Store<AppState>, private router: Router) {
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
      return this.hasAccess();
    } else {
      // 用户未认证，重定向到授权端点
      return this.oauthService.loadDiscoveryDocumentAndLogin().then(
        (isAuthenticated) => {
          if (isAuthenticated) {
            const hasAccess = this.hasAccess();
            this.oauthService.setupAutomaticSilentRefresh();
            return hasAccess;
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

  canActivateChild(): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate();
  }

  /**
   * 权限检查逻辑
   * 根据实际业务调整，比如检查 user.tagId
   */
  private hasAccess(): boolean {
    const loginUser = this.oauthService.getIdentityClaims() as UserModel;
    // 示例：只有管理员角色能访问，100为管理员标签
    // if (!loginUser.tagId.includes(100)) {
    //   this.router.navigate(['/unauthorized']).then();
    //   return false;
    // }
    this.store.dispatch(loginSuccessAction({accessToken: this.oauthService.getAccessToken()}));
    this.store.dispatch(loginAction({loginUser}));
    return true
  }
}
