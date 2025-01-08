import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Store} from "@ngrx/store";
import {RouterOutlet} from "@angular/router";
import {WxService} from './services/wx.service';
import {dynamicBuildContainerAction, dynamicBuildElementAction, registerWechatAction} from './store/ui/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weui-angular';
  @ViewChild('container', { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;

  @ViewChild('element', { static: true })
  elementRef!: ElementRef;

  constructor(private store: Store, private wxService: WxService) {}

  ngOnInit() {
    if (this.containerRef && this.elementRef) {
      this.store.dispatch(
        dynamicBuildContainerAction({ container: this.containerRef })
      );
      this.store.dispatch(
        dynamicBuildElementAction({ element: this.elementRef })
      );
    } else {
      console.error('ViewContainerRef or ElementRef is not available');
    }

    if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
      this.wxService
        .config(['chooseImage', 'previewImage'])
        .then((wx) => this.store.dispatch(registerWechatAction({ wx })));
    }
  }
}
