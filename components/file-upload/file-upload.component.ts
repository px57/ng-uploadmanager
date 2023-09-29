import { 
  Component, 
  Input, 
  AfterContentInit, 
  OnDestroy,
  ViewChild,
  ElementRef
 } from '@angular/core';
import { UploadService, Files } from '../../services/upload.service';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';



@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements AfterContentInit, OnDestroy {
  /**
   * @description:
   */
  @ViewChild('fileUpload', {static: true}) fileUpload: ElementRef | undefined;

  /**
   * @description:
   */
  public files: Array<Files>  = [];

  /**
   * @description:
   */
  public load_upload: boolean = false;

  /**
   * @description:
   */
  public progress: any = 0;
  /**
   * @description: 
   */
  @Input()
  public settings: any = undefined;

  /**
   * @description:
   */
  public constructor(
    private HttpClient: HttpClient,
    private upload_service: UploadService,
  ) {

  }

  /**
   * @description:
   */
  public ngOnInit(): void {
    this.bindStream();
  }

  /**
   * @description:
   */
  private bindStream(): void {
    this.upload_service.stream.subscribe((upload_stream: any) => {
      if (this.settings.label !== upload_stream.data.label) { return; }
      this.onClick();
    });
  }

  /**
   * @description: 
   */
  public ngAfterContentInit(): void {
    this.onClick();
  }

  /**
   * @description:
   */
  public ngOnDestroy(): void {
    alert ('ngondestroy');
  }

  /**
   * @description:
   */
  public changeFileUpload($event: any) {
    const files = $event.target.files;
    // this.FileService.addFiles(files);
  }

    /*
    * @description:
    */
      public onClick(): void {
        if (this.fileUpload === undefined) {
          return;
        }
        const fileUpload = this.fileUpload.nativeElement;
        fileUpload.onchange = () => {
        for (let index = 0; index < fileUpload.files.length; index++) {
         const file = fileUpload.files[index];
         this.files.push({ 
            data: file, 
            inProgress: false, 
            progress: 0
          });
        }
        this.uploadFiles();
      };
      fileUpload.click();
  }



  /*
  * @description:
  */
  private uploadFiles(): void {
    if (this.fileUpload === undefined) { return; }
    this.fileUpload.nativeElement.value = '';
    let file: any = this.files[this.files.length - 1];

    let listOfMime = this.upload_service.getListOfMimeType(this.settings);
    if (listOfMime.indexOf(file.data.type) === -1) {
      alert (this.upload_service.getErrorMimeType(this.settings));
      return;
    }
    
    if (file.data.size > this.settings.max_file_size) {
      alert (`File too large. Upload a file less than ${this.upload_service.convertBytes(this.settings.max_file_size)}`);
      return;
    }

    this.uploadFile(file);
  }


  /*
  * @description:
  */
  public uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file.data);
    formData.append('label', this.settings.label);
    file.inProgress = true;
    this.load_upload = true;

    this.upload(formData).pipe(
      map((event: any) => {
        switch ((event as any).type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round((event as any).loaded * 100 / (event as any).total);
            this.progress = file.progress;
            this.set_progress(file.progress);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          this.load_upload = false;
          
          this.set_finished(event);
        }
      });
  }

  /** 
  * @description:
  */
  public upload(formData: any, path_url: any=undefined) {
    let url = this.get_url();

    return this.HttpClient.post<any>(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * @description:
   */
  private get_url(): string {
    let host = this.upload_service.getHost(this.settings);
    let url = host + this.settings.is_private ? '/v1/mediacenter/upload/private_upload/': '/v1/mediacenter/upload/public_upload/';
    return url;
  }

  /**
   * @description: 
   */
  public set_progress(progress: any) {
    this.progress = progress;
    this.settings.stream.next({
      event: 'progress',
      progress: progress,
      label: this.settings.label
    });
  }

  /**
   * @description:
   */
  public set_finished(event: any) {
    this.progress = 0;
    this.load_upload = false;
    this.settings.stream.next({ 
      event: 'finished',
      progress: 0,
      label: this.settings.label,
      data: event.body
    });
  }
}
