import {Component, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs";
import {Router, RouterOutlet} from "@angular/router";
import {NavbarModel} from "../../store/ui/navbar.model";
import {PopupComponent} from "../../components/popup/popup.component";
import {Store} from "@ngrx/store";
import {AppState} from "../../store";
import {DialogService} from "../../components/dialog/dialog.service";
import {moreNavbarAction, navbarAction, themeAction} from "../../store/ui/actions";
import {UiState} from "../../store/ui/reducer";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    PopupComponent,
    RouterOutlet
  ],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  public ui: Observable<UiState> = new Observable<UiState>();
  public navbar!: NavbarModel[];
  public navbarMore!: NavbarModel[];

  @ViewChild('popup', {static: true}) popupMenu!: PopupComponent;

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    private router: Router,
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.ui = this.store.select('ui');
    this.ui.subscribe(({theme, navbar, moreNavbar}) => {
      this.navbar = navbar;
      this.navbarMore = moreNavbar;
      this.renderer.setAttribute(document.querySelector('body'), 'data-weui-theme', theme ? theme : '');
    });
  }

  onSelectNavbar(nav: NavbarModel) {
    const updatedNavbarMore = this.navbarMore.map(navbar => {
      return {...navbar, active: false};
    });
    this.store.dispatch(moreNavbarAction({moreNavbar: updatedNavbarMore}));
    const updatedNavbar = this.navbar.map(navbar => {
      return {...navbar, active: nav === navbar};
    });
    this.store.dispatch(navbarAction({navbar: updatedNavbar}));
    if (nav.link) this.router.navigate([nav.link])
  }

  onSelectNavbarMore(nav: NavbarModel) {
    const updatedNavbar = this.navbar.map(navbar => {
      return {...navbar, active: false};
    });
    this.store.dispatch(navbarAction({navbar: updatedNavbar}));
    const updatedNavbarMore = this.navbarMore.map(navbar => {
      return {...navbar, active: nav === navbar};
    });
    this.store.dispatch(moreNavbarAction({moreNavbar: updatedNavbarMore}));
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
        if (res.type == 'radio') this.store.dispatch(themeAction({theme: res.value}));
        if (res.type == 'primary') localStorage.setItem('theme', res.result.value);
        if (res.type == 'default') this.store.dispatch(themeAction({theme: localStorage.getItem('theme') ?? ''}));
        console.log(res)
      })
    }
    this.popupMenu.hide();
  }

}
