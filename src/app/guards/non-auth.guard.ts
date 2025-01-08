import {Injectable} from '@angular/core';
import {UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard {
  constructor(private router: Router) {
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!sessionStorage.getItem('token')) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

  canActivateChild():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate();
  }
}
