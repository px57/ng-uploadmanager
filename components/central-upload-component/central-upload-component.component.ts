import { Component, Input } from '@angular/core';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'central-upload-component',
  templateUrl: './central-upload-component.component.html',
  styleUrls: ['./central-upload-component.component.scss']
})
export class CentralUploadComponentComponent {

  /**
   * @description; 
   * @param settings
   * @param.settings (EXAMPLE)
   * [
   *  {
   *    "type": "mutiple" | "single",
   *    "label": "Upload",
   *    "icon": "cloud_upload",
   * ]
   */
  @Input() 
  public settings = undefined;

  /**
   * @description:
   */
  public constructor(
    public upload_service: UploadService,
  ) { }

  /**
   * @description:
   */
  public ngOnInit(): void {
    // TODO: 
  }
}