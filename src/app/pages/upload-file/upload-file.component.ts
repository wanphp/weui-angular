import {Component} from '@angular/core';
import {UploaderConfig, uploadFile} from "@components/uploader/uploader.component";
import {authConfig} from "@/utils/oauth.config";
import {AppState} from "@/store/state";
import {Store} from "@ngrx/store";
import {ToastService} from "@components/toast/toast.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  imageConfig: UploaderConfig = {
    url: `${authConfig.issuer}/api/files`,
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
    this.store.select('auth').subscribe(({currentUser, token}) => {
      this.imageConfig = {
        ...this.imageConfig,
        headers: {'Authorization': token},
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
