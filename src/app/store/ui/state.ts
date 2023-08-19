import {Navbar} from "@/store/ui/navbar";
import {ElementRef, ViewContainerRef} from "@angular/core";

export default <UiState>{
  theme: localStorage.getItem('theme'),
  navbar: [{
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
      badge: 10,
      link: '/profile'
    },
    {
      active: false,
      icon: 'fa-solid fa-upload',
      title: '上传',
      link: '/upload'
    }
  ],
  navbarMore: [{
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
    }]
};

export interface UiState {
  theme: string;
  navbar: Navbar[];
  navbarMore: Navbar[];
  viewContainerRef?: ViewContainerRef;
  elementRef?: ElementRef;
  wx?: any;
}
