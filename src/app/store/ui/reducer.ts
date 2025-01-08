import {
  dynamicBuildContainerAction,
  dynamicBuildElementAction, moreNavbarAction,
  navbarAction,
  registerWechatAction,
  themeAction
} from './actions';
import {ElementRef, ViewContainerRef} from "@angular/core";
import {NavbarModel} from "./navbar.model";
import {createReducer, on} from "@ngrx/store";
// 默认菜单
export const navbar: NavbarModel[] = [{
  active: false,
  icon: 'fas fa-home',
  title: '首页',
  badge: '',
  link: '/'
},
  {
    active: false,
    icon: 'fa-solid fa-address-card',
    title: '联系',
    badge: '10',
    link: '/profile'
  },
  {
    active: false,
    icon: 'fa-solid fa-upload',
    title: '上传',
    badge: '',
    link: '/upload'
  }];
export const moreNavbar: NavbarModel[] = [{
  active: false,
  icon: 'fas fa-home',
  title: '首页',
  badge: '',
  link: '/'
},
  {
    active: false,
    icon: 'fa-solid fa-address-card',
    title: '联系',
    badge: 'dot',
    link: '/profile'
  },
  {
    active: false,
    icon: 'fa-solid fa-circle-half-stroke',
    title: '主题',
    badge: '',
    link: ''
  }];


export interface UiState {
  theme: string;
  navbar: NavbarModel[];
  moreNavbar: NavbarModel[];
  container: ViewContainerRef | null;
  element: ElementRef | null;
  wx: any | null;
}

export const initialState: UiState = {
  theme: localStorage.getItem('theme') ?? '',//未配置跟随系统
  navbar: navbar,
  moreNavbar: moreNavbar,
  container: null,
  element: null,
  wx: null
};

export const uiReducer = createReducer(
  initialState,
  on(themeAction, (state, {theme}) => ({...state, theme})),
  on(navbarAction, (state, {navbar}) => ({...state, navbar})),
  on(moreNavbarAction, (state, {moreNavbar}) => ({...state, moreNavbar})),
  on(dynamicBuildContainerAction, (state, {container}) => ({...state, container})),
  on(dynamicBuildElementAction, (state, {element}) => ({...state, element})),
  on(registerWechatAction, (state, {wx}) => ({...state, wx})),
);

