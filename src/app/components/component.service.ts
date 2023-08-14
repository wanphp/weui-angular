import {ApplicationRef, ComponentRef, ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@/store/state";

@Injectable()
export abstract class ComponentService {
  protected list: Array<ComponentRef<any>> = [];
  private viewContainerRef!: ViewContainerRef;
  private elementRef!: ElementRef;

  constructor(private store: Store<AppState>, protected readonly applicationRef: ApplicationRef) {
    this.store.select('ui').subscribe(({viewContainerRef, elementRef}) => {
      this.viewContainerRef = viewContainerRef as ViewContainerRef;
      this.elementRef = elementRef as ElementRef;
    });
  }


  /**
   * 销毁
   *
   * @param component 下标（从0开始或组件引用对象），或不指定时，销毁最新一个
   */
  destroy(component?: number | ComponentRef<any>): void {
    if (typeof component === 'number') {
      component = this.list[component as number];
    }
    if (!component) {
      component = this.list.pop();
    }
    if (component) {
      (component as ComponentRef<any>).destroy();
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
    const componentRef = this.viewContainerRef.createComponent(component);
    this.elementRef.nativeElement.appendChild(componentRef.location.nativeElement);
    this.list.push(componentRef);
    componentRef.onDestroy(() => {
      this.applicationRef.detachView(componentRef.hostView);
    });
    return componentRef;
  }
}
