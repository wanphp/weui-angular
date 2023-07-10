import {Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs";
import {UiState} from "@/store/ui/state";
import {Navbar} from "@/store/ui/navbar";
import {Store} from "@ngrx/store";
import {AppState} from "@/store/state";
import {PopupComponent} from "@components/popup/popup.component";
import {SetNavbar, SetNavbarMore, SetTheme} from "@/store/ui/actions";
import {Router} from "@angular/router";
import {DialogService} from "@components/dialog/dialog.service";
import {ToastService} from "@components/toast/toast.service";
import {ToptipsService} from "@components/toptips/toptips.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  public ui: Observable<UiState> = new Observable<UiState>();
  public navbar!: Navbar[];
  public navbarMore!: Navbar[];

  @ViewChild('popup', {static: true}) popupMenu!: PopupComponent;

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    private router: Router,
    private toastService:ToptipsService,
    private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef,
    private el: ElementRef
  ) {
    this.dialogService.viewContainerRef = viewContainerRef;
    this.dialogService.el = el;

    this.toastService.viewContainerRef = viewContainerRef;
    this.toastService.el = el;
    this.toastService.info('成功')
  }

  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe(({theme, navbar, navbarMore}) => {
      this.navbar = navbar;
      this.navbarMore = navbarMore;
      this.renderer.setAttribute(document.querySelector('body'), 'data-weui-theme', theme);
    });
  }

  onSelectNavbar(nav: Navbar) {
    const updatedNavbarMore = this.navbarMore.map(navbar => {
      return {...navbar, active: false};
    });
    this.store.dispatch(new SetNavbarMore(updatedNavbarMore));
    const updatedNavbar = this.navbar.map(navbar => {
      return {...navbar, active: nav === navbar};
    });
    this.store.dispatch(new SetNavbar(updatedNavbar));
    if (nav.link) this.router.navigate([nav.link])
  }

  onSelectNavbarMore(nav: Navbar) {
    const updatedNavbar = this.navbar.map(navbar => {
      return {...navbar, active: false};
    });
    this.store.dispatch(new SetNavbar(updatedNavbar));
    const updatedNavbarMore = this.navbarMore.map(navbar => {
      return {...navbar, active: nav === navbar};
    });
    this.store.dispatch(new SetNavbarMore(updatedNavbarMore));
    if (nav.link) this.router.navigate([nav.link]);
    else {
      this.dialogService.show({
        type: 'prompt',
        input: 'radio',
        title: '设置主题',
        confirm: '保存',
        inputValue: localStorage.getItem('theme'),
        inputOptions: [
          {text: '跟随系统', type: 'radio', value: ''},
          {text: '白天', type: 'radio', value: 'light'},
          {text: '夜晚', type: 'radio', value: 'dark'}
        ]
      }).subscribe(res => {
        if (res.type == 'radio') this.store.dispatch(new SetTheme(res.value));
        if (res.type == 'primary') localStorage.setItem('theme', res.result.value);
        if (res.type == 'default') this.store.dispatch(new SetTheme(localStorage.getItem('theme')));
        console.log(res)
      })
    }
    this.popupMenu.hide();
  }

}
