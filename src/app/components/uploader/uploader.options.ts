import {Observable} from 'rxjs';

import {FileItem} from './file-item.class';
import {UploaderComponent} from './uploader.component';

/**
 * 组件配置项对象接口
 */
export interface UploaderOptions {
  component: UploaderComponent,
  /**
   * 计算文件md5
   */
  parallelHash: any,
  /**
   * 服务端接口url
   */
  url: string;

  /**
   * 是否发送凭据，默认：`true`
   */
  withCredentials?: boolean;

  /**
   * headers 信息
   */
  headers?: { [key: string]: string };

  /**
   * HTTP提交其他参数
   */
  params?: { [key: string]: any };

  /**
   * 是否自动上传，默认：`false`
   * 设置为 true 后，不需要手动调用 `upload`，有文件选择即开始上传。
   */
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
  limit: number;

  /**
   * 限定文件大小（单位：字节），-1 表示不受限，默认：`-1`
   */
  size?: number;

  /**
   * 当文件被加入队列以后触发
   */
  onFileQueued?: (file: FileItem) => void;

  /**
   * 当文件被移除队列后触发
   *
   * @param file File对象，如果是clear则file为空
   */
  onFileDequeued?: (file?: FileItem) => void;

  /**
   * 当开始上传流程时触发
   */
  onStart?: (file: FileItem) => void;

  /**
   * 当所有文件上传结束时触发
   */
  onFinished?: () => void;

  /**
   * 某个文件开始上传前触发，一个文件只会触发一次
   */
  onUploadStart?: (file: FileItem) => void;

  /**
   * 上传过程中触发，携带总的上传进度，以及当前文件的上传进度
   * @param file File对象
   * @param percentage 当前文件上传进度
   * @param totalPercentage 总上传进度
   */
  onUploadProgress?: (file: FileItem, percentage: number, totalPercentage: number) => void;

  /**
   * 当文件上传成功时触发
   * @param file File对象
   * @param response 服务端返回的数据
   * @param status 状态码
   * @param headers Headers
   */
  onUploadSuccess?: (file: FileItem, response: any, status: number, headers: any) => void;

  /**
   * 当文件上传出错时触发
   * @param file File对象
   * @param response 服务端返回的数据
   * @param status 状态码
   * @param headers Headers
   */
  onUploadError?: (file: FileItem, response: any, status: number, headers: any) => void;
  /**
   * 不管成功或者失败，文件上传完成时触发
   * @param file File对象
   * @param response 服务端返回的数据
   * @param status 状态码
   * @param headers Headers
   */
  onUploadComplete?: (file: FileItem, response: any, status: number, headers: any) => void;

  /**
   * 取消某文件时触发
   *
   * @param file File对象
   */
  onUploadCancel?: (file: FileItem) => void;

  /**
   * 当filters不通过时触发
   * @param file 文件对象
   * @param message
   */
  onError?: (file: File, message: string) => void;

  /**
   * 内置的上传组件是基于HTML5
   * 如有特殊需求可以自定义上传接口（Observable<any> 中的 any 指的是事件当中的response）
   * 不管成功与否都会触发 onUploadComplete & onUploadSuccess
   */
  uploadTransport?(item: FileItem): Observable<any>;

  /**
   * 自定义上传接口，当用户中止时回调
   */
  abortTransport?(item: FileItem): void;
}
