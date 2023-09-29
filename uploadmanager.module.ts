import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadService } from './services/upload.service';
import { CentralUploadComponentComponent } from './components/central-upload-component/central-upload-component.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    CentralUploadComponentComponent,
    FileUploadComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    UploadService
  ],
  exports: [
    CentralUploadComponentComponent,
  ],
})
export class UploadmanagerModule { }
