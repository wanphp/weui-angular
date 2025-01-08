import {Component, OnInit} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {Router} from "@angular/router";
import {authConfig} from '../../app.config';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  standalone: true,
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) {
  }

  ngOnInit() {
    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(sessionStorage)
    this.oauthService.tryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        // 认证成功，跳转到受保护的路由
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadUserProfile().then(() => {
          const url = localStorage.getItem('currentPath');
          if (url) {
            localStorage.removeItem('currentPath');
            location.href = url;
          } else this.router.navigate(['/']).then();
        });
      } else {
        // 认证失败，跳转到错误页面或其他处理逻辑
        this.router.navigate(['/error']).then();
      }
    }).catch(() => {
      this.router.navigate(['/login']).then();
    });
  }
}
