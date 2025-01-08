import {ApplicationRef, ComponentRef, ElementRef, Injectable, OnDestroy, ViewContainerRef} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from '../store';
import {Subscription} from 'rxjs';

@Injectable()
export abstract class ComponentService implements OnDestroy {
  private readonly subscription: Subscription;
  protected list: Array<ComponentRef<any>> = [];
  private viewContainerRef!: ViewContainerRef;
  private elementRef!: ElementRef;

  constructor(private store: Store<AppState>, protected readonly applicationRef: ApplicationRef) {
    this.subscription = this.store.select('ui').subscribe(({container, element}) => {
      if (container && element) {
        this.viewContainerRef = container;
        this.elementRef = element;
      } else {
        throw new Error('ViewContainerRef or ElementRef is not available in the UI state.');
      }
    });
  }

  setRefs(container: ViewContainerRef, element: ElementRef): void {
    this.viewContainerRef = container;
    this.elementRef = element;
  }

  /**
   * 销毁
   * @param component 下标（从0开始或组件引用对象），或不指定时，销毁最新一个
   */
  destroy(component?: number | ComponentRef<any>): void {
    if (typeof component === 'number') {
      component = this.list[component];
    }
    if (!component) {
      component = this.list.pop();
    }
    if (component && !component.hostView.destroyed) {
      component.destroy();
    }
  }

  /**
   * 销毁所有
   */
  destroyAll(): void {
    for (const component of this.list) {
      this.destroy(component);
    }
  }

  /** 动态构建组件 */
  protected build<T>(component: new (...args: any[]) => T): ComponentRef<T> {
    if (!this.viewContainerRef || !this.elementRef) {
      throw new Error('ViewContainerRef or ElementRef is not initialized.');
    }
    const componentRef = this.viewContainerRef.createComponent(component);
    this.elementRef.nativeElement.appendChild(componentRef.location.nativeElement);
    this.list.push(componentRef);
    componentRef.onDestroy(() => {
      this.applicationRef.detachView(componentRef.hostView);
    });
    return componentRef;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.destroyAll();
  }
}
