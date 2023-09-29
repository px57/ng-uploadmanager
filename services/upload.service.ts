import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

function $localize(a: any) {
  return a;
}

/**
 * @description: 
 */
export interface Files {
  data: any;
  inProgress: boolean;
  progress: number;
}

/**
 * @description: 
 * @type: The type of upload, single or multiple
 * @label: The label of upload, to differentiate between multiple uploads type.
 */
export interface UploadSettings {
  type: 'mutiple' | 'single'; 
  label: string;
  file_type: 'all' | 'image' | 'video' | 'audio' | 'document';
  max_file_size: number;
  is_private: boolean;
  progress: number;
  file_list: Array<Files>;
  host?: string;
  stream: Subject<UploadStream>
};

/**
 * @description: 
 */
export interface UploadStream {
  event: 'new_settings' | 'new_upload' | 'progress' | 'complete' | 'error';
  data: any;
}


/**
 * @description:
 */
export interface UploadObject {

};

/**
 * @description:
 */
export interface UploadSlot {
  settings: UploadSettings;
  global_progress: number;
  upload_list: Array<UploadObject>;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  /**
   * @description: 
   */
  public stream: Subject <UploadStream> = new Subject <UploadStream>();

  /**
   * @description: 
   */
  public settings: Array<UploadSettings> = [];

  /**
   * @description: 
   */
  private upload_list = [];

  /**
   * @description: 
   */
  public file_mime_types = {
    image: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ], 
    video: [
      'video/mp4',
      'video/webm',
      'video/ogg',
    ],
    audio: [
      'audio/mpeg',
      'audio/ogg',
      'audio/wav',
      'audio/webm',
    ],
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  };

  /**
   * @description:
   */
  public file_mime_types_error = {
    image: $localize `Incorrect format, try again with .jpg, .png, .gif only`,
    video: $localize `Incorrect format, try again with .mp4, .webm, .ogg only`,
    audio: $localize `Incorrect format, try again with .mp3, .ogg, .wav only`,
    document: $localize `Incorrect format, try again with .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx only`,
    all: $localize `Incorrect format, try again with .jpg, .png, .gif, .mp4, .webm, .ogg, .mp3, .wav, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx only`,
  };

  /**
   * @description: 
   */
  constructor() { }

  /**
   * @description: 
   */
  public clickButtonUpload(settings: UploadSettings) {
    this.updateSettings(settings);


    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: Return the subject to the caller
        // TODO: Le but etant de retourner a l'utilisateur l'ensemble des informations pre-traiter.
        resolve('salope');
      }, 1000);
    });
  }

  /**
   * @description:
   */
  private updateSettings(settings: UploadSettings) {
    let encountered = this.settings.filter((x) => x.label === settings.label);

    if (encountered.length === 0) {
      this.settings.push(settings);
      this.stream.next({
        event: 'new_settings',
        data: settings,
      });
    } else {
      this.stream.next({
        event: 'new_upload',
        data: settings,
      });
    }
  }

  /**
   * @description:
   */
  public getListOfMimeType(settings: UploadSettings) {
    if (settings.file_type === 'all') {
      return [
        ...this.file_mime_types.image,
        ...this.file_mime_types.video,
        ...this.file_mime_types.audio,
        ...this.file_mime_types.document,
      ];
    }
    let file_type = settings.file_type;
    let mime_types = this.file_mime_types[file_type];

    return mime_types;
  }

  /**
   * @description:
   */
  public getErrorMimeType(settings: UploadSettings) {
    let file_type = settings.file_type;
    let mime_types = this.file_mime_types_error[file_type];

    return mime_types;
  }

  /**
   * @description:
   */
  public convertBytes(bytes: number, decimals: number = 2) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * @description:
   */
  public getHost(settings: UploadSettings) {
    if (settings.host === undefined) {
      return window.location.origin;
    }
    return settings.host;
  }
}