import {Injectable} from '@angular/core';
import {ToastComponent} from './toast.component';
import {ComponentService} from "@components/component.service";
import {ToastConfig} from "@components/toast/toast.config";

@Injectable({providedIn: 'root'})
export class ToastService extends ComponentService {

  /**
   * 构建toast并显示
   *
   * @param [text] 文本（可选）
   * @param [time] 显示时长后自动关闭（单位：ms），0 表示永久（可选）
   * @param [icon] icon图标Class名（可选）
   */
  show(text?: string, time: number = 2000, icon: string = ''): ToastComponent {
    const componentRef = this.build(ToastComponent);

    componentRef.instance.config = {text: text, icon: icon, time: time} as ToastConfig;

    componentRef.instance.hide.subscribe(() => {
      setTimeout(() => {
        componentRef.destroy();
      }, 300);
    });
    return componentRef.instance.onShow();
  }

  /**
   * 关闭最新toast
   */
  hide(): void {
    this.destroy();
  }

  /**
   * 构建成功toast并显示
   *
   * @param [text] 文本（可选）
   * @param [time] 显示时长后自动关闭（单位：ms）（可选）
   * @param [icon] icon图标Class名（可选）
   */
  success(text?: string, time: number = 2000, icon: string = 'weui-icon-success-no-circle'): ToastComponent {
    return this.show(text, time, icon);
  }

  /**
   * 构建成功toast并显示
   *
   * @param [text] 文本（可选）
   * @param [time] 显示时长后自动关闭（单位：ms）（可选）
   * @param [icon] icon图标Class名（可选）
   */
  warn(text?: string, time: number = 2000, icon: string = 'weui-icon-warn'): ToastComponent {
    return this.show(text, time, icon);
  }

  /**
   * 构建加载中toast并显示
   *
   * @param [text] 文本（可选）
   * @param [time] 显示时长后自动关闭（单位：ms）（可选）
   * @param [icon] icon图标Class名（可选）
   */
  loading(text?: string, time: number = 2000, icon: string = 'weui-loading'): ToastComponent {
    return this.show(text, time, icon);
  }
}
