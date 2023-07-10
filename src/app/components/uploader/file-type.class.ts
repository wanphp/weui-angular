export class FileType {
  /*  office文档  */
  public static mime_doc: string[] = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  public static mime_xsl: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  public static mime_ppt: string[] = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  /* 压缩文件包 */
  public static mime_compress: string[] = [
    'application/vnd.rar',
    'application/zip'
  ];

  /* 图片 */
  public static mime_image: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  /* 视频 */
  public static mime_video: string[] = [
    'video/mp4',
    'video/quicktime'
  ];

  public static getMimeClass(file: any): string {
    let mimeClass = 'application';
    if (this.mime_image.indexOf(file.type) !== -1) {
      mimeClass = 'image';
    } else if (this.mime_video.indexOf(file.type) !== -1) {
      mimeClass = 'video';
    } else if (file.type == 'audio/mpeg') {
      mimeClass = 'audio';
    } else if (file.type === 'application/pdf') {
      mimeClass = 'pdf';
    } else if (this.mime_compress.indexOf(file.type) !== -1) {
      mimeClass = 'compress';
    } else if (this.mime_doc.indexOf(file.type) !== -1) {
      mimeClass = 'doc';
    } else if (this.mime_xsl.indexOf(file.type) !== -1) {
      mimeClass = 'xls';
    } else if (this.mime_ppt.indexOf(file.type) !== -1) {
      mimeClass = 'ppt';
    }
    if (mimeClass === 'application') {
      mimeClass = this.fileTypeDetection(file.name);
    }

    return mimeClass;
  }

  // 文件分片后通过后缀判断文件类型
  public static fileTypeDetection(inputFilename: string): string {
    const types: { [key: string]: string } = {
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      mp3: 'audio',
      rar: 'compress',
      zip: 'compress',
      pdf: 'pdf',
      xls: 'xls',
      xlsx: 'xls',
      mp4: 'video',
      mov: 'video',
      doc: 'doc',
      docx: 'doc',
      ppt: 'ppt',
      pptx: 'ppt'
    };

    const chunks = inputFilename.split('.');
    if (chunks.length < 2) {
      return 'application';
    }
    const extension = chunks[chunks.length - 1].toLowerCase();
    if (types[extension] === undefined) {
      return 'application';
    } else {
      return types[extension];
    }
  }
}
