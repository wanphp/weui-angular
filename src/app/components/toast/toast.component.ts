import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {ToastConfig} from "./toast.config";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  host: {'[hidden]': '!shown'},
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None
})
export class ToastComponent implements OnDestroy {
  private _config!: ToastConfig;

  @Input()
  set config(val: ToastConfig) {
    this._config = {...this.DEF, ...val};
  }

  get config(): any {
    return this._config;
  }

  /**
   * 隐藏后回调
   */
  @Output() readonly hide = new EventEmitter();

  shown: boolean = false;
  private timer: any;

  constructor(private DEF: ToastConfig) {
  }

  onShow(): this {
    this.shown = true;
    if (this.config.time > 0) {
      this.timer = setTimeout(() => {
        this.onHide();
      }, this.config.time);
    }
    return this;
  }

  onHide(): void {
    this.shown = false;
    this.hide.emit();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
