import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {DialogConfig} from "./dialog.config";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  host: {'[hidden]': '!shown'},
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgSwitch,
    NgIf,
    NgSwitchCase,
    NgSwitchDefault,
    NgForOf
  ],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
  private _config!: DialogConfig;
  private observer!: Observer<any>;
  private defaultValue: any;
  shown: boolean = false;

  @ViewChild('container', {static: true}) container: any;
  promptError: boolean = false;
  promptData: any;

  /**
   * 对话框配置项
   */
  @Input()
  set config(value: DialogConfig) {
    const config: DialogConfig = {
      ...this.DEF,
      ...value,
    };

    // 重组buttons
    if (!config.buttons) {
      config.buttons = [];
      if (config.cancel) {
        config.buttons.push({
          text: config.cancel,
          type: config.cancelType!,
          value: false,
        });
      }
      if (config.confirm) {
        config.buttons.push({
          text: config.confirm,
          type: config.confirmType!,
          value: true,
        });
      }
    }

    // prompt
    if (config.type === 'prompt') {
      // 一些默认校验正则表达式
      if (!config.inputRegex) {
        switch (config.input) {
          case 'email':
            config.inputRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!config.inputError) {
              config.inputError = '邮箱格式不正确';
            }
            break;
          case 'url':
            config.inputRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
            if (!config.inputError) {
              config.inputError = '网址格式不正确';
            }
            break;
          case 'tel':
            config.inputRegex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[12589])\d{8}$/;
            if (!config.inputError) {
              config.inputError = '手机号格式不正确';
            }
            break;
        }
      }

      config.inputOptions = (config.inputOptions || [])!.slice(0);
      config.inputAttributes = {
        maxlength: null,
        min: 0,
        max: 100,
        step: 1,
        ...config.inputAttributes,
      };
      // 默认值
      let defaultValue = config.inputValue;
      if (config.input === 'checkbox' && !Array.isArray(config.inputValue)) {
        defaultValue = typeof defaultValue !== 'undefined' ? [defaultValue] : [];
      }
      config.inputValue = defaultValue || '';

      if (config.inputOptions) {
        if (Array.isArray(config.inputValue)) this.promptData = config.inputOptions.filter((c: any) => config.inputValue.includes(c.value));
        else this.promptData = config.inputOptions.find(item => item.value == config.inputValue);
      } else this.promptData = config.inputValue;

      if (this.promptData) {
        this.defaultValue = this.promptData;
        this._config = config;
        this.promptCheck();
      }

      setTimeout(() => {
        this.setFocus();
      }, 100);
    }
    this._config = config;
  }

  get config(): DialogConfig {
    return this._config;
  }

  /**
   * 关闭动画开始时回调（唯一参数：对话框实例对象）
   */
  @Output() readonly close = new EventEmitter<DialogComponent>();

  constructor(private DEF: DialogConfig, private cdr: ChangeDetectorRef) {
  }

  private promptCheck(): boolean {
    if (this.config.inputRequired === true) {
      if (this.config.input === 'checkbox' && this.promptData.length === 0) {
        this.promptError = true;
        return false;
      }
      if (!this.promptData) {
        this.promptError = true;
        return false;
      }
    }
    if (this.config.input === 'radio' && this.observer) {
      this.cdr.detectChanges();
      this.observer.next(this.promptData);
    }

    if (this.config.inputRegex && !this.config.inputRegex.test(this.promptData.toString())) {
      this.promptError = true;
      return false;
    }

    this.promptError = false;
    return true;
  }

  private setFocus(): void {
    const containerEl = this.container.nativeElement;
    let firstFormEl: any;
    if (this.config.type === 'prompt') {
      firstFormEl = containerEl.querySelector('input, textarea, select');
    } else {
      firstFormEl = containerEl.querySelector('.weui-dialog__btn_primary');
    }
    if (firstFormEl) {
      firstFormEl.focus();
    }
  }

  _change(): void {
    this.promptCheck();
  }

  _keyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') this._onSelect();
  }

  /**
   * 显示，组件载入页面后并不会显示，显示调用 `show()` 并订阅结果。
   *
   * @returns 当 `type==='prompt'` 时会多一 `result` 属性表示结果值
   */
  show(): Observable<any> {
    this.shown = true;
    this.promptError = false;
    this.cdr.detectChanges();
    return new Observable((observer: Observer<any>) => {
      this.observer = observer;
    });
  }

  /**
   * 隐藏
   *
   * @param is_backdrop 是否从背景上点击
   */
  hide(is_backdrop: boolean = false): void {
    if (is_backdrop && !this.config.backdrop) return;

    this.shown = false;
    this.cdr.detectChanges();
    this.close.emit(this);
  }

  _onSelect(btn?: any): boolean {
    // 未指定时查找 `value===true` 的按钮
    if (!btn && this.config.buttons!.length > 0) {
      btn = this.config.buttons!.find(b => b.value === true);
    }
    const ret = btn;
    if (btn.value === true && this.config.type === 'prompt') {
      if (!this.promptCheck()) {
        return false;
      }
      ret.result = this.promptData;
      this.defaultValue = this.promptData;
    }
    if (btn.value === false && this.config.type === 'prompt') {
      this.promptData = this.defaultValue;
    }
    this.observer.next(ret);
    this.observer.complete();
    this.hide();
    return false;
  }

  _updatePromptData(event: Event, data: any) {
    if ((event.target as HTMLInputElement).checked) {
      this.promptData.push(data);
    } else {
      this.promptData = this.promptData.filter((c: any) => c !== data);
    }
    this.promptCheck();
  }
}
