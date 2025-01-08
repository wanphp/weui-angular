import {Component} from '@angular/core';
import {SearchbarComponent} from "../../components/searchbar/searchbar.component";
import {ToastService} from "../../components/toast/toast.service";
import {ToptipsService} from "../../components/toptips/toptips.service";
import {PopupComponent} from "../../components/popup/popup.component";
import {UploadFileComponent} from "../upload-file/upload-file.component";

@Component({
  selector: 'app-blank',
  imports: [
    SearchbarComponent,
    PopupComponent,
    UploadFileComponent
  ],
  templateUrl: './blank.component.html',
  standalone: true,
  styleUrl: './blank.component.css'
})
export class BlankComponent {
  constructor(protected toastService: ToastService, protected toptipsService: ToptipsService) {
  }

  onSearch(event: string) {
    console.log("onSearch", event);
  }

  onSubmit(event: string) {
    console.log("onSubmit", event);
  }
}
