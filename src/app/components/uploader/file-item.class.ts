import {Uploader} from './uploader.class';
import {UploaderOptions} from './uploader.options';
import {FileType} from "./file-type.class";

/**
 * 文件对象
 */
export class FileItem {
  /**
   * 文件ID，每个对象具有唯一ID，与文件名无关
   */
  id!: string;

  /**
   * 原生对象或已上传的url
   */
  file: File | string;

  /**
   * 文件类型
   */
  fileMimeClass: string;

  /**
   * 索引
   */
  index: number = 0;

  /**
   * 上传进度
   */
  progress: number = 0;

  /**
   * 准备上传就绪
   */
  isReady: boolean = false;
  /**
   * 上传中
   */
  isUploading: boolean = false;
  /**
   * 已上传（不管错误与否都是true）
   */
  isUploaded: boolean = false;
  /**
   * 上传成功
   */
  isSuccess: boolean = false;
  /**
   * 用户取消上传
   */
  isCancel: boolean = false;
  /**
   * 上传失败
   */
  isError: boolean = false;
  /**
   * 已上传到服务器的文件路径
   */
  uploadedFile: string = '';
  /**
   * 缩略图片，文件文件为类型图片
   */
  thumb: string;
  /**
   * 文件名
   */
  name: string;

  /**
   * HTTP请求对象
   */
  _xhr?: XMLHttpRequest;

  /**
   * 上传配置信息
   */
  options!: UploaderOptions;

  protected uploader: Uploader;

  constructor(uploader: Uploader, file: File | string, options?: UploaderOptions) {
    this.uploader = uploader;
    if (options) this.setOptions(options);
    let fileMimeClass;
    this.name = '';
    if (file instanceof File) {
      fileMimeClass = FileType.getMimeClass(file);
    } else {
      fileMimeClass = FileType.fileTypeDetection(file);
    }
    this.file = file;
    this.fileMimeClass = fileMimeClass;
    switch (fileMimeClass) {
      case 'image':
        if (file instanceof File) this.thumb = URL.createObjectURL(file);
        else this.thumb = file;
        break;
      case 'audio':
        if (file instanceof File) this.uploadedFile = URL.createObjectURL(file);
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzg0IDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik02NCAwQzI4LjcgMCAwIDI4LjcgMCA2NFY0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRIMzIwYzM1LjMgMCA2NC0yOC43IDY0LTY0VjE2MEgyNTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyVjBINjR6TTI1NiAwVjEyOEgzODRMMjU2IDB6bTIgMjI2LjNjMzcuMSAyMi40IDYyIDYzLjEgNjIgMTA5LjdzLTI0LjkgODcuMy02MiAxMDkuN2MtNy42IDQuNi0xNy40IDIuMS0yMi01LjRzLTIuMS0xNy40IDUuNC0yMkMyNjkuNCA0MDEuNSAyODggMzcwLjkgMjg4IDMzNnMtMTguNi02NS41LTQ2LjUtODIuM2MtNy42LTQuNi0xMC0xNC40LTUuNC0yMnMxNC40LTEwIDIyLTUuNHptLTkxLjkgMzAuOWM2IDIuNSA5LjkgOC4zIDkuOSAxNC44VjQwMGMwIDYuNS0zLjkgMTIuMy05LjkgMTQuOHMtMTIuOSAxLjEtMTcuNC0zLjVMMTEzLjQgMzc2SDgwYy04LjggMC0xNi03LjItMTYtMTZWMzEyYzAtOC44IDcuMi0xNiAxNi0xNmgzMy40bDM1LjMtMzUuM2M0LjYtNC42IDExLjUtNS45IDE3LjQtMy41em01MSAzNC45YzYuNi01LjkgMTYuNy01LjMgMjIuNiAxLjNDMjQ5LjggMzA0LjYgMjU2IDMxOS42IDI1NiAzMzZzLTYuMiAzMS40LTE2LjMgNDIuN2MtNS45IDYuNi0xNiA3LjEtMjIuNiAxLjNzLTcuMS0xNi0xLjMtMjIuNmM1LjEtNS43IDguMS0xMy4xIDguMS0yMS4zcy0zLjEtMTUuNy04LjEtMjEuM2MtNS45LTYuNi01LjMtMTYuNyAxLjMtMjIuNnoiLz48L3N2Zz4=';
        break;
      case 'video':
        if (file instanceof File) this.uploadedFile = URL.createObjectURL(file);
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzg0IDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik02NCAwQzI4LjcgMCAwIDI4LjcgMCA2NFY0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRIMzIwYzM1LjMgMCA2NC0yOC43IDY0LTY0VjE2MEgyNTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyVjBINjR6TTI1NiAwVjEyOEgzODRMMjU2IDB6TTY0IDI4OGMwLTE3LjcgMTQuMy0zMiAzMi0zMmg5NmMxNy43IDAgMzIgMTQuMyAzMiAzMnY5NmMwIDE3LjctMTQuMyAzMi0zMiAzMkg5NmMtMTcuNyAwLTMyLTE0LjMtMzItMzJWMjg4ek0zMDAuOSAzOTcuOUwyNTYgMzY4VjMwNGw0NC45LTI5LjljMi0xLjMgNC40LTIuMSA2LjgtMi4xYzYuOCAwIDEyLjMgNS41IDEyLjMgMTIuM1YzODcuN2MwIDYuOC01LjUgMTIuMy0xMi4zIDEyLjNjLTIuNCAwLTQuOC0uNy02LjgtMi4xeiIvPjwvc3ZnPg==';
        break;
      case 'doc':
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzg0IDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik02NCAwQzI4LjcgMCAwIDI4LjcgMCA2NFY0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRIMzIwYzM1LjMgMCA2NC0yOC43IDY0LTY0VjE2MEgyNTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyVjBINjR6TTI1NiAwVjEyOEgzODRMMjU2IDB6TTExMSAyNTcuMWwyNi44IDg5LjIgMzEuNi05MC4zYzMuNC05LjYgMTIuNS0xNi4xIDIyLjctMTYuMXMxOS4zIDYuNCAyMi43IDE2LjFsMzEuNiA5MC4zTDI3MyAyNTcuMWMzLjgtMTIuNyAxNy4yLTE5LjkgMjkuOS0xNi4xczE5LjkgMTcuMiAxNi4xIDI5LjlsLTQ4IDE2MGMtMyAxMC0xMiAxNi45LTIyLjQgMTcuMXMtMTkuOC02LjItMjMuMi0xNi4xTDE5MiAzMzYuNmwtMzMuMyA5NS4zYy0zLjQgOS44LTEyLjggMTYuMy0yMy4yIDE2LjFzLTE5LjUtNy4xLTIyLjQtMTcuMWwtNDgtMTYwYy0zLjgtMTIuNyAzLjQtMjYuMSAxNi4xLTI5LjlzMjYuMSAzLjQgMjkuOSAxNi4xeiIvPjwvc3ZnPg==';
        break;
      case 'xls':
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzg0IDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik02NCAwQzI4LjcgMCAwIDI4LjcgMCA2NFY0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRIMzIwYzM1LjMgMCA2NC0yOC43IDY0LTY0VjE2MEgyNTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyVjBINjR6TTI1NiAwVjEyOEgzODRMMjU2IDB6TTE1NS43IDI1MC4yTDE5MiAzMDIuMWwzNi4zLTUxLjljNy42LTEwLjkgMjIuNi0xMy41IDMzLjQtNS45czEzLjUgMjIuNiA1LjkgMzMuNEwyMjEuMyAzNDRsNDYuNCA2Ni4yYzcuNiAxMC45IDUgMjUuOC01LjkgMzMuNHMtMjUuOCA1LTMzLjQtNS45TDE5MiAzODUuOGwtMzYuMyA1MS45Yy03LjYgMTAuOS0yMi42IDEzLjUtMzMuNCA1LjlzLTEzLjUtMjIuNi01LjktMzMuNEwxNjIuNyAzNDRsLTQ2LjQtNjYuMmMtNy42LTEwLjktNS0yNS44IDUuOS0zMy40czI1LjgtNSAzMy40IDUuOXoiLz48L3N2Zz4=';
        break;
      case 'ppt':
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzg0IDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik02NCAwQzI4LjcgMCAwIDI4LjcgMCA2NFY0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRIMzIwYzM1LjMgMCA2NC0yOC43IDY0LTY0VjE2MEgyNTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyVjBINjR6TTI1NiAwVjEyOEgzODRMMjU2IDB6TTEzNiAyNDBoNjhjNDIgMCA3NiAzNCA3NiA3NnMtMzQgNzYtNzYgNzZIMTYwdjMyYzAgMTMuMy0xMC43IDI0LTI0IDI0cy0yNC0xMC43LTI0LTI0VjM2OCAyNjRjMC0xMy4zIDEwLjctMjQgMjQtMjR6bTY4IDEwNGMxNS41IDAgMjgtMTIuNSAyOC0yOHMtMTIuNS0yOC0yOC0yOEgxNjB2NTZoNDR6Ii8+PC9zdmc+';
        break;
      case 'pdf':
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik0wIDY0QzAgMjguNyAyOC43IDAgNjQgMEgyMjRWMTI4YzAgMTcuNyAxNC4zIDMyIDMyIDMySDM4NFYzMDRIMTc2Yy0zNS4zIDAtNjQgMjguNy02NCA2NFY1MTJINjRjLTM1LjMgMC02NC0yOC43LTY0LTY0VjY0em0zODQgNjRIMjU2VjBMMzg0IDEyOHpNMTc2IDM1MmgzMmMzMC45IDAgNTYgMjUuMSA1NiA1NnMtMjUuMSA1Ni01NiA1NkgxOTJ2MzJjMCA4LjgtNy4yIDE2LTE2IDE2cy0xNi03LjItMTYtMTZWNDQ4IDM2OGMwLTguOCA3LjItMTYgMTYtMTZ6bTMyIDgwYzEzLjMgMCAyNC0xMC43IDI0LTI0cy0xMC43LTI0LTI0LTI0SDE5MnY0OGgxNnptOTYtODBoMzJjMjYuNSAwIDQ4IDIxLjUgNDggNDh2NjRjMCAyNi41LTIxLjUgNDgtNDggNDhIMzA0Yy04LjggMC0xNi03LjItMTYtMTZWMzY4YzAtOC44IDcuMi0xNiAxNi0xNnptMzIgMTI4YzguOCAwIDE2LTcuMiAxNi0xNlY0MDBjMC04LjgtNy4yLTE2LTE2LTE2SDMyMHY5NmgxNnptODAtMTEyYzAtOC44IDcuMi0xNiAxNi0xNmg0OGM4LjggMCAxNiA3LjIgMTYgMTZzLTcuMiAxNi0xNiAxNkg0NDh2MzJoMzJjOC44IDAgMTYgNy4yIDE2IDE2cy03LjIgMTYtMTYgMTZINDQ4djQ4YzAgOC44LTcuMiAxNi0xNiAxNnMtMTYtNy4yLTE2LTE2VjQzMiAzNjh6Ii8+PC9zdmc+';
        break;
      case 'compress':
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzg0IDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik02NCAwQzI4LjcgMCAwIDI4LjcgMCA2NFY0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRIMzIwYzM1LjMgMCA2NC0yOC43IDY0LTY0VjE2MEgyNTZjLTE3LjcgMC0zMi0xNC4zLTMyLTMyVjBINjR6TTI1NiAwVjEyOEgzODRMMjU2IDB6TTk2IDQ4YzAtOC44IDcuMi0xNiAxNi0xNmgzMmM4LjggMCAxNiA3LjIgMTYgMTZzLTcuMiAxNi0xNiAxNkgxMTJjLTguOCAwLTE2LTcuMi0xNi0xNnptMCA2NGMwLTguOCA3LjItMTYgMTYtMTZoMzJjOC44IDAgMTYgNy4yIDE2IDE2cy03LjIgMTYtMTYgMTZIMTEyYy04LjggMC0xNi03LjItMTYtMTZ6bTAgNjRjMC04LjggNy4yLTE2IDE2LTE2aDMyYzguOCAwIDE2IDcuMiAxNiAxNnMtNy4yIDE2LTE2IDE2SDExMmMtOC44IDAtMTYtNy4yLTE2LTE2em0tNi4zIDcxLjhjMy43LTE0IDE2LjQtMjMuOCAzMC45LTIzLjhoMTQuOGMxNC41IDAgMjcuMiA5LjcgMzAuOSAyMy44bDIzLjUgODguMmMxLjQgNS40IDIuMSAxMC45IDIuMSAxNi40YzAgMzUuMi0yOC44IDYzLjctNjQgNjMuN3MtNjQtMjguNS02NC02My43YzAtNS41IC43LTExLjEgMi4xLTE2LjRsMjMuNS04OC4yek0xMTIgMzM2Yy04LjggMC0xNiA3LjItMTYgMTZzNy4yIDE2IDE2IDE2aDMyYzguOCAwIDE2LTcuMiAxNi0xNnMtNy4yLTE2LTE2LTE2SDExMnoiLz48L3N2Zz4=';
        break;
      default:
        this.thumb = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzg0IDUxMiI+PCEtLSEgRm9udCBBd2Vzb21lIEZyZWUgNi40LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UgKENvbW1lcmNpYWwgTGljZW5zZSkgQ29weXJpZ2h0IDIwMjMgRm9udGljb25zLCBJbmMuIC0tPjxwYXRoIGQ9Ik0wIDY0QzAgMjguNyAyOC43IDAgNjQgMEgyMjRWMTI4YzAgMTcuNyAxNC4zIDMyIDMyIDMySDM4NFY0NDhjMCAzNS4zLTI4LjcgNjQtNjQgNjRINjRjLTM1LjMgMC02NC0yOC43LTY0LTY0VjY0em0zODQgNjRIMjU2VjBMMzg0IDEyOHoiLz48L3N2Zz4=';
    }
  }

  setOptions(options: UploaderOptions): void {
    this.options = {...this.uploader.options, ...options};
  }

  /**
   * 上传
   */
  upload(): void {
    try {
      this.uploader.uploadItem(this);
    } catch (e) {
      this.uploader._onCompleteItem(this, '', 0, {});
      this._onError(e, 0, {});
    }
  }

  /**
   * 取消上传
   */
  cancel(): void {
    this.uploader.cancelItem(this);
  }

  /**
   * 从队列中移除，当文件正在上传中时会先取消
   */
  remove(): void {
    this.uploader.removeFromQueue(this);
  }

  _prepareToUploading(): void {
    this.index = this.index || this.uploader._getNextIndex();
    this.isReady = true;
  }

  _onBeforeUpload(): void {
    this.isReady = true;
    this.isUploading = true;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = false;
    this.progress = 0;

    if (this.options.onUploadStart) {
      this.options.onUploadStart(this);
    }
  }

  _onProgress(progress: number): any {
    this.progress = progress;
    if (this.options.onUploadProgress) {
      this.options.onUploadProgress(this, progress, this.uploader.progress);
    }
  }

  _onSuccess(response: any, status: number, headers: any): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = true;
    this.isCancel = false;
    this.isError = false;
    this.progress = 100;
    this.index = 0;
    this.id = response.id;
    this.uploadedFile = response.url;

    if (this.options.onUploadSuccess) {
      this.options.onUploadSuccess(this, response, status, headers);
    }
  }

  _onError(response: any, status: number, headers: any): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = true;
    this.progress = 0;
    this.index = 0;

    if (this.options.onUploadError) {
      this.options.onUploadError(this, response, status, headers);
    }
  }

  _onComplete(response: string, status: number, headers: any): void {
    if (this.options.onUploadComplete) {
      this.options.onUploadComplete(this, response, status, headers);
    }
  }

  _onCancel(): any {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = true;
    this.isError = false;
    this.progress = 0;
    this.index = 0;

    if (this.options.onUploadCancel) {
      this.options.onUploadCancel(this);
    }
  }
}
