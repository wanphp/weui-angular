import {Component, Input} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() title: string = '系统提示！';
  @Input() msg: string = '系统出错了。';
  @Input() icon: string = 'warn';

  constructor(private location: Location) {
  }

  closePage(): void {
    const ua = window.navigator.userAgent.toLowerCase();

    if (ua.includes('micromessenger')) {
      // WeixinJSBridge 可能还没初始化，需监听
      if (typeof (window as any).WeixinJSBridge !== 'undefined') {
        (window as any).WeixinJSBridge.call('closeWindow');
      } else {
        document.addEventListener('WeixinJSBridgeReady', () => {
          (window as any).WeixinJSBridge.call('closeWindow');
        }, false);
      }
    } else {
      window.close();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
