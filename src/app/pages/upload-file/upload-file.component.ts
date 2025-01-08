import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {Title} from "@angular/platform-browser";
import {UploaderComponent, UploaderConfig, uploadFile} from "../../components/uploader/uploader.component";
import {authConfig} from "../../app.config";
import {AppState} from "../../store";
import {ToastService} from "../../components/toast/toast.service";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  standalone: true,
  imports: [
    UploaderComponent
  ],
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  imageConfig: UploaderConfig = {
    url: `${authConfig.issuer}/api`,
    auto: true,
    mimes: ['image'],
    limit: 1,
    size: 1024 * 1024 * 10
  } as UploaderConfig;

  pdfConfig!: UploaderConfig;

  filesPdf: uploadFile[] = [];
  filesImage: uploadFile[] = [];

  constructor(
    private title: Title,
    private store: Store<AppState>,
    private toastService: ToastService
  ) {
    this.title.setTitle('上传文件');
    this.store.select('auth').subscribe(({accessToken}) => {
      this.imageConfig = {
        ...this.imageConfig,
        headers: {'Authorization': accessToken},
      }
      this.pdfConfig = {
        ...this.imageConfig,
        mimes: ['pdf']
      }
    });
  }

  uploadImage(images: uploadFile[]) {
    console.log(images,this.filesImage);
    if (images.length) this.toastService.success('图片上传成功');
  }

  uploadPdf(files: uploadFile[]) {
    console.log(files);
    if (files.length) this.toastService.success('文件上传成功');
  }
}
