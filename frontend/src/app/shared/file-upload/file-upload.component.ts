import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FileType, UploadState } from 'src/app/core/model/config.model';
import { ApiService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit, AfterViewInit {

  @Input() context: string = "";
  selectedFile: File | null = null;
  progress: number = 0;
  uploadState: UploadState = UploadState.PENDING;
  dragAndDrop: string = ""
  constructor(private notificationService: NotificationService,
    private api: ApiService) {
  }
  ngAfterViewInit(): void {
    this.dragAndDrop = `Drag & Drop ${this.context} files here`
  }

  ngOnInit() {
    
  }

  onFileSelected(event: any): void {
    let file = event.target.files[0] as File;
    let fileExtension = file.name.split('.').pop();

    if(this.context == FileType.CSV && fileExtension?.toLowerCase() != 'csv'){
        let errMsg = `Given file is not a .csv!`; 
        this.notificationService.openSnackBar(errMsg);
        return;
    } else if (this.context == FileType.TIF && fileExtension?.toLowerCase() != 'tif'){
      let errMsg = `Given file is not a .tif!`; 
      this.notificationService.openSnackBar(errMsg);
      return;
    } else {
      this.selectedFile = file
      this.dragAndDrop = file.name
    }
  }

  onFileDropped(fileList: FileList){
     if (fileList.length > 1) {
      let errMsg = `You can only uplaod 1 ${this.context} file!`; 
      this.notificationService.openSnackBar(errMsg);
      return;
     }

     let file = fileList[0]
     if (!file.type.match(`${this.context.toLowerCase()}.*`)){
      let errMsg = `Given file is not a .${this.context}!`; 
      this.notificationService.openSnackBar(errMsg);
      return;
    } else {
      this.selectedFile = file
      this.dragAndDrop = file.name
    }
     
 }

  uploadFile(): void {
    if (this.selectedFile) {
      if(this.context == FileType.CSV) {
        this.api.uploadCSV(this.selectedFile).subscribe((event: any) => {
          if (event.state == UploadState.PROCESSING_ERROR) { 
            this.progress = 100;
            this.uploadState = UploadState.PROCESSING_ERROR;
          }
  
          if (event.state == UploadState.IN_PROGRESS) { 
            this.progress = event.progress;
            this.uploadState = UploadState.IN_PROGRESS;
          }
  
          if (event.state == UploadState.PROCESSING) { 
            this.progress = event.progress;
            this.uploadState = UploadState.PROCESSING;;
          }
  
          else if (event.state == UploadState.DONE) {
            this.progress = 100;
            this.uploadState = UploadState.DONE;
            this.api.notifyUploadDone();
            this.notificationService.openSnackBar(event.metadata);
            this.progress = 0; // clean up the progress bar
           }
  
        }, (err: any) => { 
          this.progress = 100;
          this.uploadState = UploadState.PROCESSING_ERROR;
          this.notificationService.openSnackBar("Error occured when uplaoding file");
          this.progress = 0;
        });
      } else if(this.context == FileType.TIF) {
        this.api.uploadRaster(this.selectedFile).subscribe((event: any) => {
          if (event.state == UploadState.PROCESSING_ERROR) { 
            this.progress = 100;
            this.uploadState = UploadState.PROCESSING_ERROR;
          }
  
          if (event.state == UploadState.IN_PROGRESS) { 
            this.progress = event.progress;
            this.uploadState = UploadState.IN_PROGRESS;
          }
  
          if (event.state == UploadState.PROCESSING) { 
            this.progress = event.progress;
            this.uploadState = UploadState.PROCESSING;;
          }
  
          else if (event.state == UploadState.DONE) {
            this.progress = 100;
            this.uploadState = UploadState.DONE;
            this.api.notifyUploadDone();
            this.notificationService.openSnackBar(event.metadata);
            this.progress = 0;
           }
  
        }, (err: any) => { 
          this.progress = 100;
          this.uploadState = UploadState.PROCESSING_ERROR;
          this.notificationService.openSnackBar("Error occured when uplaoding file");
          this.progress = 0;
        });
      }
    }
  }

}
