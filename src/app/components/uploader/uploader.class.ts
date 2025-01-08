import {FileItem} from './file-item.class';
import {FileType} from './file-type.class';
import {UploaderOptions} from './uploader.options';
import {uploadFile} from "./uploader.component";

export class Uploader {
  private _options!: UploaderOptions;
  private _queue: FileItem[] = [];
  private _progress: number = 0;
  private _isUploading: boolean = false;
  private _nextIndex: number = 0;
  private _failFilterMessage: string = '';

  /**
   * 获取当前上传组件配置项
   */
  get options(): UploaderOptions {
    return this._options;
  }

  /**
   * 获取队列中所有文件对象
   */
  get queue(): FileItem[] {
    return this._queue;
  }

  /**
   * 获取当前总进度
   */
  get progress(): number {
    return this._progress;
  }

  /**
   * 是否上传中
   */
  get isUploading(): boolean {
    return this._isUploading;
  }

  /**
   * 获取未上传数量
   */
  get notUploadedCount(): number {
    return this.getNotUploadedItems().length;
  }

  /**
   * 获取已上传数量
   */
  get uploadedCount(): number {
    return this._queue.filter((item: FileItem) => item.isUploaded).length;
  }

  /** 获取待上传文件 */
  get getReadyItems(): FileItem[] {
    return this._queue
      .filter((item: FileItem) => item.isReady && !item.isUploading)
      .sort((item1: any, item2: any) => item1.index - item2.index);
  }

  /**
   * Creates an instance of Uploader.
   */
  constructor(options: UploaderOptions) {
    this.setOptions(options);
  }

  _getNextIndex(): number {
    return ++this._nextIndex;
  }

  /**
   * 重置选项
   *
   * @param options
   * @param includeOldQueue 是否包括已存在队列中的文件
   */
  setOptions(options: UploaderOptions, includeOldQueue: boolean = true): void {
    this._options = options;
    // 对已经存在的队列重置所有配置信息
    if (includeOldQueue) {
      for (let i = 0; i < this._queue.length; i++) {
        this._queue[i].setOptions(this._options);
      }
    }
  }

  private isValidFile(file: File): boolean {
    // 数量
    if (this._options.limit && this._options.limit > 0 && this._queue.length > this._options.limit) {
      this._failFilterMessage = '已达上传上限';
      return false;
    }

    // 大小
    if (this._options.size && this._options.size > 0 && file.size > this._options.size) {
      this._failFilterMessage = '只能上传' + (this._options.size / 1024 / 1024) + 'M以内的文件，当前文件' + (file.size / 1024 / 1024).toFixed(2) + 'M';
      return false;
    }

    // mime类型
    if (this._options.mimes && this._options.mimes.indexOf(FileType.getMimeClass(file)) === -1) {
      this._failFilterMessage = '文件类型不支持';
      return false;
    }

    // 类型
    if (this._options.types && this._options.types.indexOf(file.type) === -1) {
      this._failFilterMessage = '文件类型不支持';
      return false;
    }
    return true;
  }

  private _getIndexOfItem(value: any): number {
    return typeof value === 'number' ? value : this._queue.indexOf(value);
  }

  /** 获取未上传过列表 */
  private getNotUploadedItems(): FileItem[] {
    return this._queue.filter((item: FileItem) => !item.isUploaded);
  }

  /**
   * 将文件放入队列中
   *
   * @param files 文件列表
   * @param options 强制重新指定新 `options` 内容
   */
  addToQueue(files: File[] | uploadFile[], options?: UploaderOptions): void {
    const count = this._queue.length;
    if (!options) {
      options = this._options;
    }
    for (const file of files) {
      if (file instanceof File) {
        if (this.isValidFile(file)) {
          const fileItem = new FileItem(this, file, options!);
          fileItem.index = this._queue.length;
          fileItem.name = file.name;
          this._queue.push(fileItem);
          if (this._options.onFileQueued) {
            this._options.onFileQueued(fileItem);
          }
        } else {
          if (this._options.onError) {
            this._options.onError(file, this._failFilterMessage);
          }
        }
      } else {
        // 显示已上传到服务器的文件
        const fileItem = new FileItem(this, file.url, options!);
        fileItem._onSuccess(file, 0, {});//标记为已上传
        this._queue.push(fileItem);
        fileItem.name = file.name;
        if (this._options.onFileQueued) {
          this._options.onFileQueued(fileItem);
        }
      }
    }

    if (this.queue.length !== count) {
      this._progress = this._getTotalProgress();
    }
    console.log(this.queue)
    if (this.options!.auto) {
      this.uploadAll();
    }
  }

  /**
   * 从队列中移除一个文件
   *
   * @param value FileItem对象或下标
   */
  removeFromQueue(value: FileItem | number): void {
    const index = this._getIndexOfItem(value);
    const item = this._queue[index];
    if (item.isUploading) {
      item.cancel();
    }
    this._queue.splice(index, 1);
    this._progress = this._getTotalProgress();
    if (this._options.onFileDequeued) {
      this._options.onFileDequeued(item);
    }
  }

  /**
   * 上传某个文件
   */
  uploadItem(value: FileItem): void {
    const index = this._getIndexOfItem(value);
    const item = this._queue[index];
    item._prepareToUploading();
    if (this._isUploading) {
      return;
    }
    this._isUploading = true;
    this._xhrTransport(item);
  }

  /**
   * 取消某个文件
   */
  cancelItem(value: FileItem): void {
    const index = this._getIndexOfItem(value);
    const item = this._queue[index];
    if (item && item.isUploading) {
      if (item.options.abortTransport) {
        item._onCancel();
        this._onCompleteItem(item, null!, null!, null!);
        item.options.abortTransport(item);
      } else {
        if (item._xhr) {
          item._xhr.abort();
        }
      }
    }
  }

  /**
   * 上传队列中所有未上传的文件
   */
  uploadAll(): void {
    const items = this.getNotUploadedItems().filter((item: FileItem) => !item.isUploading);
    if (!items.length) {
      return;
    }
    items.map((item: FileItem) => item._prepareToUploading());

    if (this._options.onStart) {
      this._options.onStart(items[0]);
    }
    items[0].upload();
  }

  _destroy(): void {
    return void 0;
  }

  private _xhrTransport(item: FileItem, totalPieces: number = 0, sliceIndex: number = 0): any {
    if (!(item.file instanceof File)) return;
    if (sliceIndex === 0) item._onBeforeUpload();
    if (item.file.size == 0) throw new TypeError('选择文件无效');

    const xhr = (item._xhr = new XMLHttpRequest());
    xhr.upload.onprogress = (event: any) => {
      if (totalPieces == 0) {
        const progress = Math.round(event.lengthComputable ? (event.loaded * 100) / event.total : 0);
        this._onProgressItem(item, progress);
      }
    };
    xhr.onload = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      if (xhr.status == 200) {
        // 分片上传完成
        if (xhr.response.current_chunk) {
          sliceIndex = parseInt(xhr.response.current_chunk);
          // 文件上传进度更新
          this._onProgressItem(item, Math.round(sliceIndex / totalPieces * 100));
          // 传下一片
          this._xhrTransport(item, totalPieces, sliceIndex);
        } else {
          item._onSuccess(xhr.response, xhr.status, headers); // 文件上传完成
          this._onCompleteItem(item, xhr.response, xhr.status, headers);
        }
      } else {
        item._onError(xhr.response, xhr.status, headers);
        this._onCompleteItem(item, xhr.response, xhr.status, headers);
      }
    };
    xhr.onerror = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      item._onError(xhr.response, xhr.status, headers);
      this._onCompleteItem(item, xhr.response, xhr.status, headers);
    };
    xhr.onabort = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      item._onCancel()
      this._onCompleteItem(item, xhr.response, xhr.status, headers);
    };
    xhr.open('POST', item.options.url + '/files', true);
    xhr.responseType = 'json';
    Object.keys(this._options.headers || {}).forEach((key: string) => xhr.setRequestHeader(key, this._options.headers![key]));

    let sendAble: FormData = new FormData();
    Object.keys(this._options.params || {}).forEach((key: string) => sendAble.append(key, this._options.params![key]));
    // 上传分片大小
    const bytesPerPiece = 2097152; // 2097152=1024*1024*2
    if (item.file.size > bytesPerPiece) {
      const start = sliceIndex * bytesPerPiece;
      if (start >= item.file.size) return this; //退出循环
      let end = start + bytesPerPiece;
      if (end > item.file.size) end = item.file.size;

      const chunk = item.file.slice(start, end); //切割文件
      if (totalPieces == 0) totalPieces = Math.ceil(item.file.size / bytesPerPiece); //计算文件切片总数
      //存业务属性
      sendAble.append("file", chunk, item.file.name); //文件分片
      sendAble.append("current_chunk", (sliceIndex + 1).toString());//分片索引,服务器从1开始
      sendAble.append("chunks", totalPieces.toString());//切片总数
      sendAble.append('size', item.file.size.toString());
      sendAble.append('type', item.file.type);
      if (!item.id) {
        // 计算文件md5值
        this._options.parallelHash.hash(item.file).then((result: any) => {
          item.id = result;
          sendAble.append('md5', item.id);
          xhr.send(sendAble);
        });
      } else {
        sendAble.append('md5', item.id);
        xhr.send(sendAble);
      }
    } else {
      item.id = Math.random().toString(36).substring(7);
      sendAble.append('file', item.file, item.file.name);
      xhr.send(sendAble);
    }
    return this;
  }

  private _getTotalProgress(value: number = 0): number {
    const notUploaded = this.getNotUploadedItems().length;
    const uploaded = notUploaded ? this._queue.length - notUploaded : this._queue.length;
    const ratio = 100 / this._queue.length;
    const current = (value * ratio) / 100;
    return Math.round(uploaded * ratio + current);
  }

  private _parseHeaders(headers: string): any {
    const parsed: any = {};
    let key: any;
    let val: any;
    let i: any;
    if (!headers) {
      return parsed;
    }
    headers.split('\n').map((line: any) => {
      i = line.indexOf(':');
      key = line.slice(0, i).trim().toLowerCase();
      val = line.slice(i + 1).trim();
      if (key) {
        parsed[key] = parsed[key] ? `${parsed[key]}, ${val}` : val;
      }
    });
    return parsed;
  }

  private _onProgressItem(item: FileItem, progress: any): void {
    this._progress = this._getTotalProgress(progress);
    item._onProgress(progress);
  }

  _onCompleteItem(item: FileItem, response: any, status: number, headers: any): void {
    item._onComplete(response, status, headers);
    const nextItem = this.getReadyItems[0];
    this._isUploading = false;
    if (nextItem) {
      nextItem.upload();
      return;
    }
    this._progress = this._getTotalProgress();
    if (this._options.onFinished) {
      this._options.onFinished();
    }
  }
}
