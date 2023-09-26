import { Directive, ElementRef, Renderer2, OnInit, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { SnackBarService } from '../common/snack-bar/snack-bar.service';

@Directive({ selector: '[appVideo]' })
export class VideoDirective implements OnInit, AfterViewInit, OnChanges {

    videoElement: any;

    constructor(
        private videoElementRef: ElementRef,
        private renderer2: Renderer2,
        private snackBarService: SnackBarService
    ) { }

    ngOnInit() {}

    ngAfterViewInit() {
        this.videoElement = this.videoElementRef.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges) {

      if (changes.cameraInput) {
        if (changes.cameraInput.currentValue === true) {
          this.getCameraInput();
        }
      }
    }

    async getCameraInput() {

        if (await this.hasGetUserMedia()) {

          const video = this.videoElement;
          const constraints = {
            video: true
          };

          navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
            //   this.videoAutoplay = true;
              video.srcObject = stream
            })
            .catch(error => {
            //   this.videoAutoplay = false;
            });
        } else {
          this.snackBarService.popMessageInfo('Device is not connected or not support')
        }
    }

      async hasGetUserMedia() {
        return !!(navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia);
      }
}
