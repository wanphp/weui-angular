import {Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, RendererFactory2, ViewChild} from '@angular/core';
import {Uploader} from "@components/uploader/uploader.class";
import {UploaderOptions} from "@components/uploader/uploader.options";
import {FileItem} from "@components/uploader/file-item.class";
import {FileType} from "@components/uploader/file-type.class";
import {ApiService} from "@services/api.service";
import {Store} from "@ngrx/store";
import {AppState} from "@/store/state";
import {ToptipsService} from "@components/toptips/toptips.service";

export interface UploaderConfig {
  url: string;
  params?: { [key: string]: any };
  headers?: { [key: string]: string };
  auto?: boolean;
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

export interface uploadFile {
  id: number;
  url: string;
  type?: string;
  thumbId?: number;
  thumb?: string;
}

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent {
  private readonly render: Renderer2;
  private wx: any;
  private onlyImage: boolean = false;// 只上传图片时
  private limit = 1; // 微信内最多选择9张图片
  uploader!: Uploader;
  acceptType = '';
  @ViewChild('media') media!: ElementRef;

  @Input() title: string = '';
  @Input() files: uploadFile[] = [];
  @Output() filesChange = new EventEmitter();

  @Input()
  set config(config: UploaderConfig) {
    this.onlyImage = (config.mimes?.includes('image') && config.mimes?.length === 1) as boolean;
    this.limit = config.limit ?? 1;
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
      parallelHash: this.apiService.parallelHash(),
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
        console.log('onFinished', arguments);
      },
      onUploadStart() {
        console.log('onUploadStart', arguments);
      },
      onUploadProgress() {
        console.log('onUploadProgress', arguments);
      },
      onUploadSuccess(fileItem, data, status) {
        if (fileItem.file instanceof File) {
          this.component?.uploadSuccess(fileItem);
          if (FileType.getMimeClass(fileItem.file) == 'image') this.component?.uploadThumb(fileItem);
        }
        console.log('onUploadSuccess', data, arguments);
      },
      onUploadError(filer, res, status) {
        if (status === 401) {
          localStorage.removeItem('access_token');
          location.reload();
        }
        console.log('onUploadError', arguments);
      },
      onUploadComplete() {
        console.log('onUploadComplete', arguments);
      },
      onUploadCancel() {
        console.log('onUploadCancel', arguments);
      },
      onError(file, message) {
        this.component.error(message);
        console.log('onError', arguments);
      },
    } as UploaderOptions);
  }

  filesQueue: FileItem[] = [];

  viewFile!: FileItem;
  imgShow: boolean = false;

  constructor(
    private zone: NgZone,
    rendererFactory: RendererFactory2,
    private store: Store<AppState>,
    private apiService: ApiService,
    private topTipsService: ToptipsService
  ) {
    this.render = rendererFactory.createRenderer(null, null);
    this.store.select('ui').subscribe(({wx}) => {
      this.wx = wx;
    });
  }

  ngOnChanges(): void {
    console.log('ngOnChanges', this.files, this.uploader.queue);
    if (this.uploader.queue.length > 0) for (const fileItem of this.uploader.queue) this.uploader.removeFromQueue(fileItem);
    if (this.files && this.files.length) this.uploader.addToQueue(this.files);
  }

  isWxBrowserSelectImage() {
    return /micromessenger/.test(navigator.userAgent.toLowerCase()) && this.onlyImage;
  }

  selectImage() {
    if (this.limit < 0 || this.limit > 9) this.limit = 9;
    this.wx.ready(() => {
      this.wx.chooseImage({
        count: this.limit,
        sizeType: ['compressed'],
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
                    this.zone.run(() => {
                      this.uploader.addToQueue([new File([blob], Math.random().toString(36).substring(2) + ".jpg", {type: "image/jpeg"})]);
                    });
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
    if (!(fileItem.file instanceof File) || !fileItem.isSuccess) return;
    const ready = new FileReader();
    const fileName = fileItem.file.name;
    ready.readAsDataURL(fileItem.file);
    ready.onload = () => {
      if (ready.result) this.imageCompress(ready.result.toString(), this.render, 75, 1920)
        .then((result: string) => {
          fetch(result)
            .then(res => res.blob())
            .then(blob => {
              const formData: FormData = new FormData();
              formData.append('id', fileItem.id);
              formData.append('file', new File([blob], fileName, {type: "image/jpeg"}), fileName);
              // 上传图片到服务器
              this.apiService.post('/upload/image', formData, false).subscribe(
                (res: any) => {
                  let file = this.files.find((file) => file.id === parseInt(fileItem.id));
                  if (file) {
                    file.thumbId = res.id;
                    file.thumb = res.url;
                    this.files.splice(this.files.findIndex((file) => file.id === parseInt(fileItem.id)), 1, file);
                    this.filesChange.emit(this.files);
                  }
                }
              )
            });
        });
    }
  }

  // 文件上传完成
  uploadSuccess(fileItem: FileItem) {
    if (this.files && !this.files.find((file) => file.id === parseInt(fileItem.id))) {
      this.files.push({id: parseInt(fileItem.id), url: fileItem.uploadedFile, type: fileItem.fileMimeClass});
    } else {
      // 重复上传移除文件
      this.uploader.removeFromQueue(fileItem);
    }
    if (fileItem.fileMimeClass !== 'image') this.filesChange.emit(this.files);
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
  }

  onDel(fileItem: FileItem) {
    console.log(fileItem, this.files);
    if (this.files && this.files.find((file) => file.id === parseInt(fileItem.id))) {
      // 删除已上传到服务器的文件
      if (parseInt(fileItem.id) > 0) {
        this.apiService.delete(`/files/${fileItem.id}`).subscribe((res) => {
          console.log(res)
        });
      }
      const result = this.files.find(item => item.id === parseInt(fileItem.id));
      if (result && result.thumbId && result.thumbId > 0) {
        // 删除缩略图片
        this.apiService.delete(`/image/${result.thumbId}`).subscribe((res) => {
          console.log(res)
        });
      }

      this.files = this.files.filter((file) => file.id !== parseInt(fileItem.id));

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

  error(message: string) {
    this.topTipsService.warn(message, 5000);
  }
}
