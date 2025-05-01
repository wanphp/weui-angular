import { Component } from '@angular/core';
import {MessageComponent} from "../../components/message/message.component";

@Component({
  selector: 'app-unauthorized',
  imports: [
    MessageComponent
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

}
