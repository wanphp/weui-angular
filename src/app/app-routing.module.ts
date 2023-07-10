import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "@guards/auth.guard";
import {NonAuthGuard} from "@guards/non-auth.guard";
import {OauthComponent} from "@modules/oauth/oauth.component";
import {MainComponent} from "@modules/main/main.component";
import {ProfileComponent} from "@pages/profile/profile.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
    ]
  },
  {
    path: 'oauth',
    component: OauthComponent,
    canActivate: [NonAuthGuard]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
