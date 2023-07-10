import {Component} from '@angular/core';
import {UploaderConfig} from "@components/uploader/uploader.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  uploadConfig!: UploaderConfig;
  files: any;

  constructor() {
    this.uploadConfig = {
      url: 'string',
      headers: {},
      autoUpload: false,
      mimes: ['image', 'video','audio'],
      limit: -1,
      size: 1024 * 1024 * 100
    } as UploaderConfig;
  }
}
