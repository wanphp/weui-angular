import {createAction, props} from '@ngrx/store';
import {ElementRef, ViewContainerRef} from "@angular/core";
import {NavbarModel} from "./navbar.model";

export const themeAction = createAction(
  '主题',
  props<{ theme: string }>()
);

export const navbarAction = createAction(
  '导航菜单',
  props<{ navbar: NavbarModel[] }>()
);

export const moreNavbarAction = createAction(
  '更多导航菜单',
  props<{ moreNavbar: NavbarModel[] }>()
);

export const dynamicBuildContainerAction = createAction(
  '动态构建组件容器',
  props<{ container: ViewContainerRef }>()
);
export const dynamicBuildElementAction = createAction(
  '动态构建组件元素',
  props<{ element: ElementRef }>()
);

export const registerWechatAction = createAction(
  '微信SDK注册',
  props<{ wx: any }>()
);

