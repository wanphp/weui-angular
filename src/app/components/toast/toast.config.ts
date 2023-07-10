import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ToastConfig {
  text: string = '';
  icon: string = '';
  time: number = 2000;
}
