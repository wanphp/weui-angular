import {Component, ElementRef, ViewContainerRef} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@/store/state";
import {RegWx, SetElementRef, SetViewContainerRef} from "@/store/ui/actions";
import {WxService} from "@services/wx.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weui-angular';

  constructor(private store: Store<AppState>, private wxService: WxService, private viewContainerRef: ViewContainerRef, private elementRef: ElementRef) {
    this.store.dispatch(new SetViewContainerRef(viewContainerRef));
    this.store.dispatch(new SetElementRef(elementRef));
    wxService.config(['chooseImage', 'previewImage']).then(wx => this.store.dispatch(new RegWx(wx)));
  }
}
