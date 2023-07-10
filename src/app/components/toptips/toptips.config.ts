import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ToptipsConfig {
  text: string = '';
  type: 'default' | 'warn' | 'info' | 'primary' | 'success' = 'default';
  time: number = 2000;
}
