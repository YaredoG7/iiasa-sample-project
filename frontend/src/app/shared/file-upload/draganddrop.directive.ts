import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {
  // keep the count of windowdragenters and reduce it again when windowdragleaves - this is necessary as windowdragenter and windowdragleave will be called when dragging over sub controls
  private windowDragEnterCounter:number = 0;

  // setting this property to true will append the class fileover defined in the video-upload.component.scss to the drop target (all elements that use this directive!)
  @HostBinding('class.fileover')
  fileOver!: boolean;
  @Output() fileDropped = new EventEmitter<FileList>();

  // this will be called when a file is actually dropped on the droptarget
  @HostListener('drop', ['$event']) onDropTargetDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.windowDragEnterCounter = 0;
    this.fileOver = false;
    const files = evt.dataTransfer?.files;

    if (files && files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

  @HostListener('dragover', ['$event']) onDropTargetOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('window:dragenter', ['$event']) onWindowDragEnter(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.windowDragEnterCounter++;
    this.fileOver = true;
  }

  @HostListener('window:dragleave', ['$event']) onWindowDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.windowDragEnterCounter--;
    if (this.windowDragEnterCounter === 0)
      this.fileOver = false;
  }

  @HostListener('window:drop', ['$event']) onWindowDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.windowDragEnterCounter = 0;
    this.fileOver = false;
  }

  @HostListener('window:dragover', ['$event']) onWindowDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }
}


