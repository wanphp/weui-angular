import {Routes} from '@angular/router';
import {MainComponent} from './modules/main/main.component';
import {AuthGuard} from './guards/auth.guard';
import {ProfileComponent} from './pages/profile/profile.component';
import {OauthComponent} from './modules/oauth/oauth.component';
import {NonAuthGuard} from './guards/non-auth.guard';
import {UploadFileComponent} from "./pages/upload-file/upload-file.component";
import {BlankComponent} from "./pages/blank/blank.component";
import {UnauthorizedComponent} from "./pages/unauthorized/unauthorized.component";

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: BlankComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'upload',
        component: UploadFileComponent
      },
    ]
  },
  {
    path: 'oauth',
    component: OauthComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    canActivate: [NonAuthGuard]
  },
  {path: '**', redirectTo: ''}
];
