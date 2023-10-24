import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {authConfig} from "@/utils/oauth.config";

declare var wx: any;

@Injectable({
  providedIn: 'root'
})
export class WxService {
  private loaded: boolean = false;

  constructor(@Inject(DOCUMENT) private doc: any, private http: HttpClient) {
  }

  config(jsApiList: string[], allowShare = false): Promise<any> {
    if (allowShare) jsApiList.push('updateTimelineShareData', 'updateAppMessageShareData');
    return new Promise((resolve, reject) => {
      this.loadScript().then((res) => {
        if (!res) {
          reject('微信JS SDK加载失败');
          return;
        }

        this.http.post(
          authConfig.issuer + '/getSignPackage',
          {url: location.href.split('#')[0]},
          {headers: new HttpHeaders({'Content-Type': 'application/json'})}
        ).subscribe((data: any) => {
          if (data && data.appId) {
            wx.config({
              debug: false,
              appId: data.appId,
              timestamp: data.timestamp,
              nonceStr: data.nonceStr,
              signature: data.signature,
              jsApiList: jsApiList
            });
            if (!allowShare) wx.hideOptionMenu();
            resolve(wx);
          } else {
            reject('jsapi 获取失败');
          }
        });
      });
    });
  }


  setWxShare(shareData: any) {
    // 调用wx.ready()方法，处理微信JS-SDK初始化成功的情况
    wx.ready(() => {
      wx.updateTimelineShareData(shareData);
      wx.updateAppMessageShareData(shareData);
    });
    // 调用wx.error()方法，处理微信JS-SDK初始化失败的情况
    wx.error((res: any) => {
      // 打印错误信息
      console.error(res);
    });
  }

  private loadScript(): Promise<any> {
    return new Promise(resolve => {
      if (this.loaded) {
        resolve(true);
        return;
      }

      const node = this.doc.createElement('script');
      node.type = 'text/javascript';
      node.src = '//res.wx.qq.com/open/js/jweixin-1.6.0.js';
      node.charset = 'utf-8';
      node.defer = true;
      node.onload = () => {
        this.loaded = true;
        resolve(true);
      };
      node.onerror = () => resolve(false);
      this.doc.getElementsByTagName('head')[0].appendChild(node);
    });
  }
}
