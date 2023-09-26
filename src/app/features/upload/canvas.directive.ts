import { Directive, ElementRef, AfterViewInit, Renderer2, Input, SimpleChanges,
  OnChanges, HostListener, AfterViewChecked } from '@angular/core';
import { UtilityService } from '../../services/utility/utility.service';
import { ItemViewModel } from '../items/item/ItemViewModel';

@Directive({ selector: '[appCanvas]' })
export class CanvasDirective implements AfterViewInit, OnChanges {

  @Input() file: File;
  @Input() imageUrl: string;
  @Input() resetCanvas: boolean;
  @Input() isCardFlex: boolean;
  @Input() isCardModalView: boolean;
  @Input() itemViewModel: ItemViewModel;

  canvasElement: any;
  ctx: CanvasRenderingContext2D;

  constructor(
      private canvasElementRef: ElementRef,
      private renderer2: Renderer2,
      private utilityService: UtilityService
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resize();
  }

  private resize() {

    const uploadCardEl = document.getElementById('upload-card');
    const uploadCardElPadding = 2 * 16;
    const headerHeight = this.getCardHeaderHeight();
    const infoHeight = this.getCradInfoHeight();
    const canvasWidth = uploadCardEl.clientWidth - uploadCardElPadding;
    const canvasHeight = uploadCardEl.clientHeight - uploadCardElPadding - headerHeight - infoHeight;

    this.ctx.canvas.width = canvasWidth;
    this.ctx.canvas.height = canvasHeight;

    if (this.isCardFlex) {
      this.ctx.canvas.width = uploadCardEl.clientWidth / 2;
    }

    if (this.utilityService.ifFileisImage(this.file)) {
      this.canvasDrawImageFromFile(this.file);
    }

    if (this.imageUrl) {
      if (this.isCardFlex) {
        this.ctx.canvas.width = uploadCardEl.clientWidth / 2;
      } else {
        this.ctx.canvas.height = uploadCardEl.clientHeight / 2;
      }
        this.canvasDrawImageFromUrl(this.imageUrl);
    } else {
      const analyzImagesEl = 80;
      this.ctx.canvas.height = this.ctx.canvas.height - analyzImagesEl;
    }
  }

  getCradInfoHeight(): number {
    const uploadCardInfoEl = document.getElementById('upload-card-info');

    if (uploadCardInfoEl) {
      return uploadCardInfoEl.clientHeight + 8;
    }
    return 0 + 36;
  }

  getCardHeaderHeight(): number {
    const uploadCardHeaderEl = document.getElementById('upload-card-header');

    if (uploadCardHeaderEl) {
      return uploadCardHeaderEl.clientHeight;
    }
    return 0;
  }

  ngAfterViewInit() {
      this.canvasElement = this.canvasElementRef.nativeElement;
      this.ctx = this.canvasElement.getContext('2d');
      this.resize();
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.file) {
          if (changes.file.currentValue !== changes.file.previousValue) {
              this.canvasDrawImageFromFile(this.file)
          }
      }

      if (changes.imageUrl) {
          if (changes.imageUrl.currentValue !== changes.imageUrl.previousValue) {
            this.canvasDrawImageFromUrl(this.imageUrl)
          }
      }

      if (changes.resetCanvas) {
        if (changes.resetCanvas.isFirstChange() === false) {
          if (changes.resetCanvas.currentValue !== changes.resetCanvas.previousValue) {
            this.file = undefined;
            this.imageUrl = undefined;
            this.ctx.clearRect(0, 0, this.canvasElement.clientWidth + 10, this.canvasElement.clientHeight + 10);
          }
        }
      }
  }

  private async canvasDrawImageFromFile(file: File) {
      let image = new Image();
      let myReader: FileReader = new FileReader();
      myReader.readAsDataURL(file);
      let that = this;
      myReader.onload = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        let img = that.renderer2.createElement('img');
        img.src = image.src;
        image.onload = async function (loadImageEvent: any) {

          that.ctx.clearRect(0, 0, that.canvasElement.width, that.canvasElement.height);

          that.canvasDrawImage(img, that);

          // await that.drawWithOrientation(that, file, img);
        };
      };
  }

  private async drawWithOrientation(that: this, file: File, img: any) {
    let srcOrientation = await that.getOrientation(file);

    // transform context before drawing image
    switch (srcOrientation) {
      case 2: that.ctx.transform(-1, 0, 0, 1, that.canvasElement.width, 0); break;
      case 3: that.ctx.transform(-1, 0, 0, -1, that.canvasElement.width, that.canvasElement.height); break;
      case 4: that.ctx.transform(1, 0, 0, -1, 0, that.canvasElement.height); break;
      case 5: that.ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: that.ctx.transform(0, 1, -1, 0, that.canvasElement.width, 0); break;
      case 7: that.ctx.transform(0, -1, -1, 0, that.canvasElement.width, that.canvasElement.height); break;
      case 8: that.ctx.transform(0, -1, 1, 0, 0, that.canvasElement.height); break;
      default: break;
    }

    if (4 < srcOrientation && srcOrientation < 9) {
      const originalImageWidth = img.width;
      img.width = img.height;
      img.height = originalImageWidth;
    }

    const scale = Math.min(
      that.canvasElement.width / img.width, that.canvasElement.height / img.height
    );

    if (4 < srcOrientation && srcOrientation < 9) {
      const x = (that.canvasElement.height / 2) - (img.height / 2) * scale;
      const y = (that.canvasElement.width / 2) - (img.width / 2) * scale;
      that.ctx.drawImage(img, x, y, img.height * scale, img.width * scale);

    } else {
      const x = (that.canvasElement.width / 2) - (img.width / 2) * scale;
      const y = (that.canvasElement.height / 2) - (img.height / 2) * scale;
      that.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    }
  }

  canvasDrawImageFromUrl(imageUrl: string) {
      let image = new Image();
      image.src = imageUrl;
        let img = this.renderer2.createElement('img');
        img.src = image.src;
        let that = this
        image.onload = function (loadImageEvent: any) {

          that.ctx.clearRect(0, 0, that.canvasElement.width, that.canvasElement.height);

          that.canvasDrawImage(img, that);
      };

  }

  private canvasDrawImage(img: any, that: this) {
    let imageAspectRatio = img.width / img.height;
    let canvasAspectRatio = that.canvasElement.width / that.canvasElement.height;
    let renderableHeight, renderableWidth, xStart, yStart;
    // If image's aspect ratio is less than canvas's we fit on height
    // and place the image centrally along width
    if (imageAspectRatio < canvasAspectRatio) {
      renderableHeight = that.canvasElement.height;
      renderableWidth = img.width * (renderableHeight / img.height);
      xStart = (that.canvasElement.width - renderableWidth) / 2;
      yStart = 0;
    } else if (imageAspectRatio > canvasAspectRatio) {
      renderableWidth = that.canvasElement.width;
      renderableHeight = img.height * (renderableWidth / img.width);
      xStart = 0;
      yStart = (that.canvasElement.height - renderableHeight) / 2;
    } else {
      renderableHeight = that.canvasElement.height;
      renderableWidth = that.canvasElement.width;
      xStart = 0;
      yStart = 0;
    }

    that.ctx.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
  }

  async getOrientation(file: File) {
  return new Promise<number | void>((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {

      if (!event.target) {
          resolve();
      }

      const fileR = event.target as FileReader;
      const view = new DataView(fileR.result as ArrayBuffer);

      if (view.getUint16(0, false) !== 0xFFD8) {
          resolve(-2);
      }

      const length = view.byteLength
      let offset = 2;

      while (offset < length) {
          if (view.getUint16(offset + 2, false) <= 8) { resolve(-1); }
          let marker = view.getUint16(offset, false);
          offset += 2;

          if (marker === 0xFFE1) {
          if (view.getUint32(offset += 2, false) !== 0x45786966) {
              resolve(-1);
          }

          let little = view.getUint16(offset += 6, false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          let tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) === 0x0112) {
              resolve(view.getUint16(offset + (i * 12) + 8, little));
              }
          }
          } else if ((marker && 0xFF00) !== 0xFF00) {
          break;
          } else {
          offset += view.getUint16(offset, false);
          }
      }
      resolve(-1);
      };
      reader.readAsArrayBuffer(file);
  })
  }
}
