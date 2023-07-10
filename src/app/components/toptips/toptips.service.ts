import {Injectable} from '@angular/core';
import {ComponentService} from "@components/component.service";
import {ToptipsComponent} from "@components/toptips/toptips.component";
import {ToptipsConfig} from "@components/toptips/toptips.config";

@Injectable({providedIn: 'root'})
export class ToptipsService extends ComponentService {

  /**
   * 构建一个Toptips并显示
   *
   * @param text 文本
   * @param type 类型
   * @param time 显示时长后自动关闭（单位：ms）
   */
  show(text: string, type: 'default' | 'warn' | 'info' | 'primary' | 'success' = 'default', time: number = 2000): ToptipsComponent {
    const componentRef = this.build(ToptipsComponent);

    componentRef.instance.config = {text: text, type: type, time: time} as ToptipsConfig;
    componentRef.instance.hide.subscribe(() => {
      setTimeout(() => {
        this.destroy(componentRef);
      }, 100);
    });
    return componentRef.instance.onShow();
  }

  /**
   * 构建一个Warn Toptips并显示
   *
   * @param text 文本
   * @param time 显示时长后自动关闭（单位：ms）
   */
  warn(text: string, time: number = 2000): ToptipsComponent {
    return this.show(text, 'warn', time);
  }

  /**
   * 构建一个Info Toptips并显示
   *
   * @param text 文本
   * @param time 显示时长后自动关闭（单位：ms）
   */
  info(text: string, time: number = 2000): ToptipsComponent {
    return this.show(text, 'info', time);
  }

  /**
   * 构建一个Primary Toptips并显示
   *
   * @param text 文本
   * @param time 显示时长后自动关闭（单位：ms）
   */
  primary(text: string, time: number = 2000): ToptipsComponent {
    return this.show(text, 'primary', time);
  }

  /**
   * 构建一个Success Toptips并显示
   *
   * @param text 文本
   * @param time 显示时长后自动关闭（单位：ms）
   */
  success(text: string, time: number = 2000): ToptipsComponent {
    return this.show(text, 'primary', time);
  }

  /**
   * 构建一个Default Toptips并显示
   *
   * @param text 文本
   * @param time 显示时长后自动关闭（单位：ms）
   */
  default(text: string, time: number = 2000): ToptipsComponent {
    return this.show(text, 'default', time);
  }
}
