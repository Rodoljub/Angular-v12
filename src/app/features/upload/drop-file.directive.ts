import {
  Directive, ElementRef, EventEmitter, Renderer2, HostListener, OnInit, Inject,
  Input, OnChanges, SimpleChanges, Output
} from '@angular/core';
import { UtilityService } from '../../services/utility/utility.service';
import { configErorrMessages } from '../../../config/configErorrMessages';
import { SnackBarService } from '../common/snack-bar/snack-bar.service';

@Directive({
  selector: '[appDropFile]'
})
export class DropFileDirective implements OnInit, OnChanges {

  @Input() isFileDroped = false;
  @Output() fileDroped = new EventEmitter<File>();

  dropElement: any;

  constructor(
    private dropElementRef: ElementRef,
    private renderer2: Renderer2,
    private snackBarService: SnackBarService,
    private utilityService: UtilityService
  ) { }

  @HostListener('dragover', ['$event'])
  ondragover(event: DragEvent) {
    event.preventDefault();
    let clientWidth = document.scrollingElement.clientWidth;
    if (clientWidth >= 480) {
      if (!this.isFileDroped) {
        this.renderer2.addClass(this.dropElement, 'upload-image-card-drag-over')
      }
    }
  }

  @HostListener('dragleave', ['$event'])
  ondragleave(event: DragEvent) {
    event.preventDefault();
    this.renderer2.removeClass(this.dropElement, 'upload-image-card-drag-over')
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.isFileDroped) {
      this.isFileDroped = true;
      const file = event.dataTransfer.files[0];
      if (this.utilityService.ifFileisImage(file)) {
        this.fileDroped.emit(file);
      } else {
        this.snackBarService.popMessageError(configErorrMessages.upload.fileFormatInvalid);
        this.isFileDroped = false;
      }
      this.renderer2.removeClass(this.dropElement, 'upload-image-card-drag-over');

    }
  }

  ngOnInit(): void {
    this.dropElement = this.dropElementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) { }

}
