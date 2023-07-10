import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {ToptipsConfig} from "@components/toptips/toptips.config";


@Component({
  selector: 'app-toptips',
  templateUrl: './toptips.component.html',
  styleUrls: ['./toptips.component.css'],
  host: {'[hidden]': '!shown'},
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToptipsComponent implements OnDestroy {
  private timer: any;
  shown: boolean = false;
  private _config!: ToptipsConfig;

  @Input()
  set config(val: ToptipsConfig) {
    this._config = {...this.DEF, ...val};
  }

  get config(): any {
    return this._config;
  }

  /**
   * 隐藏后回调
   */
  @Output() readonly hide = new EventEmitter();

  constructor(private DEF: ToptipsConfig) {
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
