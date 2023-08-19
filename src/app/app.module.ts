import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from "@modules/main/main.component";
import {OAuthModule} from "angular-oauth2-oidc";
import {OauthComponent} from "@modules/oauth/oauth.component";
import {StoreModule} from "@ngrx/store";
import {uiReducer} from "@/store/ui/reducer";
import {authReducer} from "@/store/auth/reducer";
import {ProfileComponent} from '@pages/profile/profile.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {DialogComponent} from "@components/dialog/dialog.component";
import {PopupComponent} from "@components/popup/popup.component";
import {InfiniteloaderComponent} from "@components/infiniteloader/infiniteloader.component";
import {ToastComponent} from '@components/toast/toast.component';
import {ToptipsComponent} from '@components/toptips/toptips.component';
import {SearchbarComponent} from '@components/searchbar/searchbar.component';
import {UploaderComponent} from '@components/uploader/uploader.component';
import {UploadFileComponent} from '@pages/upload-file/upload-file.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    OauthComponent,
    ProfileComponent,
    PopupComponent,
    DialogComponent,
    InfiniteloaderComponent,
    ToastComponent,
    ToptipsComponent,
    SearchbarComponent,
    UploaderComponent,
    UploadFileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
