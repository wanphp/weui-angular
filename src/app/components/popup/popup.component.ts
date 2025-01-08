import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from '@angular/core';
import {Observable, Observer} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {PopupConfig} from "./popup.config";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  animations: [
    trigger('visibility', [
      state('show', style({opacity: 1})),
      state('hide', style({opacity: 0})),
      transition('hide <=> show', [animate(200)]),
    ]),
  ],
  host: {
    '[hidden]': '!shown',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    NgIf
  ],
  standalone: true
})
export class PopupComponent {
  private observer!: Observer<boolean>;
  shown: boolean = false;
  _shownAnt = false;

  private _config!: PopupConfig;

  @Input()
  set config(val: PopupConfig) {
    this._config = {...this.DEF, ...val};
  }

  get config(): any {
    return this._config;
  }

  get _visibility(): string {
    return this._shownAnt ? 'show' : 'hide';
  }

  constructor(private DEF: PopupConfig, private cdr: ChangeDetectorRef) {
    this.config = {...DEF};
  }

  /**
   * 显示，并支持订阅结果，如果点击取消值为false，反之 true
   */
  show(): Observable<boolean> {
    this.shown = true;
    setTimeout(() => {
      this._shownAnt = true;
      this.cdr.detectChanges();
    }, 10);
    return new Observable((observer: Observer<boolean>) => {
      this.observer = observer;
    });
  }

  /**
   * 隐藏
   */
  hide(): void {
    this._shownAnt = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.shown = false;
    }, 300);
  }

  close(): void {
    this.hide();
  }

  onCancel(): boolean {
    this.hide();
    if (this.observer) {
      this.observer.next(false);
      this.observer.complete();
    }
    return false;
  }

  onConfirm(): boolean {
    this.hide();
    if (this.observer) {
      this.observer.next(true);
      this.observer.complete();
    }
    return false;
  }
}
