import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, RendererFactory2, ViewChild} from '@angular/core';
import {Uploader} from "@components/uploader/uploader.class";
import {UploaderOptions} from "@components/uploader/uploader.options";
import {FileItem} from "@components/uploader/file-item.class";
import {FileType} from "@components/uploader/file-type.class";
import {WxService} from "@services/wx.service";

export interface UploaderConfig {
  url: string;
  params?: { [key: string]: any };
  headers?: string[];
  autoUpload?: boolean;
  /**
   * 限定文件mime类型，例如：[ 'image','video' ]
   */
  mimes?: string[];

  /**
   * 限定文件类型，例如：[ 'image/jpeg', 'image/gif' ]
   */
  types?: string[];
  /**
   * 允许最多上传数量，-1 表示不受限，默认：`-1`
   */
  limit?: number;

  /**
   * 限定文件大小（单位：字节），-1 表示不受限，默认：`-1`
   */
  size?: number;
}

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent {
  private readonly render: Renderer2;
  private wx: any;
  private onlyImage: boolean = false;
  uploader!: Uploader;
  acceptType = '';
  @ViewChild('media') media!: ElementRef;

  @Input() title: string = '';
  @Input() files: any;
  @Output() filesChange = new EventEmitter();

  @Input()
  set config(config: UploaderConfig) {
    this.onlyImage = (config.mimes?.includes('image') && config.mimes?.length === 1) as boolean;
    let acceptType: string[] = [];
    if (config.types) for (const type of config.types) acceptType.push(type);
    if (config.mimes) for (const type of config.mimes) {
      switch (type) {
        case 'pdf':
          acceptType.push('application/pdf');
          break;
        case 'audio':
          acceptType.push('audio/mpeg');
          break;
        case 'doc':
          for (const type of FileType.mime_doc) acceptType.push(type);
          break;
        case 'xsl':
          for (const type of FileType.mime_xsl) acceptType.push(type);
          break;
        case 'ppt':
          for (const type of FileType.mime_ppt) acceptType.push(type);
          break;
        case 'video':
          for (const type of FileType.mime_video) acceptType.push(type);
          break;
        case 'image':
          for (const type of FileType.mime_image) acceptType.push(type);
          break;
        case 'compress':
          for (const type of FileType.mime_compress) acceptType.push(type);
          break;
      }
    }
    this.acceptType = acceptType.join();
    this.uploader = new Uploader({
      component: this,
      ...config,
      onFileQueued() {
        console.log('onFileQueued', arguments);
      },
      onFileDequeued() {
        console.log('onFileDequeued', arguments);
      },
      onStart() {
        console.log('onStart', arguments);
      },
      onFinished() {
        this.component?.onFinished();
        console.log('onFinished', arguments);
      },
      onUploadStart() {
        console.log('onUploadStart', arguments);
      },
      onUploadProgress() {
        console.log('onUploadProgress', arguments);
      },
      onUploadSuccess(fileItem, data, status) {
        if (fileItem.file instanceof File && FileType.getMimeClass(fileItem.file) == 'image') this.component?.uploadThumb(fileItem);
        console.log('onUploadSuccess', data, arguments);
      },
      onUploadError() {
        console.log('onUploadError', arguments);
      },
      onUploadComplete() {
        console.log('onUploadComplete', arguments);
      },
      onUploadCancel() {
        console.log('onUploadCancel', arguments);
      },
      onError() {
        console.log('onError', arguments);
      },
    } as UploaderOptions);
  }

  filesQueue: FileItem[] = [];

  viewFile!: FileItem;
  imgShow: boolean = false;

  constructor(rendererFactory: RendererFactory2, private wxService: WxService) {
    this.render = rendererFactory.createRenderer(null, null);
    wxService.config(['chooseImage', 'previewImage']).then(wx => this.wx = wx);
  }

  ngOnChanges(): void {
    if (this.files && this.files.length) {
      this.uploader.addToQueue(this.files);
    }
  }

  isWxBrowserSelectImage() {
    return /micromessenger/.test(navigator.userAgent.toLowerCase()) && this.onlyImage;
  }

  selectImage() {
    this.wx.ready(() => {
      this.wx.chooseImage({
        success: (res: { localIds: any; }) => {
          res.localIds.forEach((localId: any) => {
            // 取本地图片
            this.wx.getLocalImgData({
              localId: localId,
              success: (res: { localData: any; }) => {
                let base64data = res.localData;
                if (base64data.split(',').length == 1) base64data = 'data:image/jpg;base64,' + base64data;
                fetch(base64data)
                  .then(res => res.blob())
                  .then(blob => {
                    this.uploader.addToQueue([new File([blob], Math.random().toString(36).substring(2) + ".jpg", {type: "image/jpeg"})]);
                  });
              }
            });
          });
        }
      });
    });
    this.wx.error((res: any) => {
      console.error(res);
    });
  }

  // 上传所有文件，给父组件调用
  uploadAll() {
    this.uploader.uploadAll();
  }

  uploadThumb(fileItem: FileItem) {
    console.log(fileItem);
    if (!(fileItem.file instanceof File)) return;
    const ready = new FileReader();
    ready.readAsDataURL(fileItem.file);
    ready.onload = (ev) => {
      if (ready.result) this.imageCompress(ready.result.toString(), this.render, 75, 1920)
        .then((result: string) => {
          fetch(result)
            .then(res => res.blob())
            .then(blob => {
              const formData: FormData = new FormData();
              formData.append('file', new File([blob], "wxUpload", {type: "image/jpeg"}), 'wxUpload.jpg');
              // 上传图片到服务器
              // this.http.post(`${environment.apiUrl}/api/files`, formData).subscribe(
              //   (res: any) => {
              //     this.zone.run(() => {
              //       this.serverIds.set(localId, res.id + '|' + res.url);
              //     });
              //     this.addImageEvent.emit(res.id + '|' + res.url);
              //   }
              // )
            });
        });
    }
  }

  // 文件上传完成
  onFinished() {
    const uploaded = this.uploader.queue.filter((item: FileItem) => item.isUploaded);
    for (const fileItem of uploaded) {
      if (this.files && !this.files.find((f: FileItem) => f.id == fileItem.id)) {
        this.files.push({id: fileItem.id, url: fileItem.uploadedFile});
      }
    }
    this.filesChange.emit(this.files);
  }

  onGallery(item: FileItem) {
    this.viewFile = item;
    this.imgShow = true;
  }

  hideGallery(event: any) {
    if (!['VIDEO', 'AUDIO'].includes(event.target.nodeName)) {
      this.imgShow = !this.imgShow;
      if (this.media) this.media.nativeElement.pause();
    }
    console.log(event.target.nodeName)
  }

  onDel(fileItem: FileItem) {
    console.log(fileItem);
    if (this.files && this.files.find((f: FileItem) => f.id == fileItem.id)) {
      // 删除已上传到服务器的文件
      this.files.filter((f: FileItem) => f.id !== fileItem.id);

      this.filesChange.emit(this.files);
    }
    this.uploader.removeFromQueue(fileItem);
  }

  change($event: Event) {
    const el = $event.target as HTMLInputElement;
    this.uploader.addToQueue((el.files! as unknown) as File[], this.uploader.options);
  }

  // 压缩图片
  private imageCompress = (
    imageDataUrlSource: string,
    render: Renderer2,
    quality: number = 50,
    maxWidth: number = 0,
    maxHeight: number = 0
  ): Promise<string> =>
    new Promise(function (resolve, reject) {
      quality = quality / 100;
      const sourceImage = new Image();

      sourceImage.onload = () => {
        const canvas: HTMLCanvasElement = render.createElement('canvas');
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!ctx) return reject(`No canvas context available`);

        const w = sourceImage.naturalWidth;
        const h = sourceImage.naturalHeight;

        const xRatio = maxWidth ? maxWidth / w : 1;
        const yRatio = maxHeight ? maxHeight / h : 1;
        const ratio = Math.min(1, xRatio, yRatio);
        canvas.width = w * ratio;
        canvas.height = h * ratio;

        ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
        const result = canvas.toDataURL("image/jpeg", quality);
        resolve(result);
      };

      sourceImage.onerror = e => reject(e);
      sourceImage.src = imageDataUrlSource;
    });
}
