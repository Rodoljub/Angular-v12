import { Directive, Input, OnChanges, SimpleChanges, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { ImagesService } from '../services/rs/images.service';
import { environment } from '../../environments/environment';
import { config } from '../../config/config';

@Directive({
  selector: '[appImagePreloader]',

})
export class ImagePreloaderDirective implements OnChanges {

  @Input() imagePath: string;
  @Input() isHeaderProfileImg = false;
  @Input() imageReduced = true;
  @Input() imageWidth = config.imageWidth.list;
  @Output() imageLoading = new EventEmitter<boolean>();
  @HostBinding('src') src;

  constructor(
    private imagesService: ImagesService
  ) { }

  // @HostListener('contextmenu', ['$event']) oncontextmenu(event) {
  //   event.preventDefault();
  //   //  event.stopPropagation();
  //   //  event.stopImmediatePropagation()
  //    return false;
  // }

  @HostListener('load', ['$event']) onload(event) {
    this.imageLoading.emit(false);
  }

  @HostListener('error', ['$event', 'imagePath']) onError(event, imagePath) {
    if (this.imagePath !== undefined) {
      let isHeaderProfileImg = this.isHeaderProfileImg;
      this.imageLoading.emit(true);
      if (this.isHeaderProfileImg) {
        this.src = '/assets/images/material/icon/profile-image-loading.gif'
      }
          if (isHeaderProfileImg) {
            this.src = '/assets/images/profile-pic.jpg'
          }
      //     this.imageLoading.emit(true);
          // console.log('directiveError: ' + errorResp)
      //   })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.imagePath) {
      if (changes.imagePath.currentValue !== changes.imagePath.previousValue) {
        if (this.imagePath === config.defaultProfilePicture) {
          this.src = environment.appDomain + this.imagePath;
        } else {
          this.src = config.mediaImage + this.imagePath + config.jpegExtansion;
        }
      }
    }
  }
}
