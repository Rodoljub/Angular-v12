import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyzingImageModel } from '../../../../features/upload/models/AnalyzingImageModel';

@Component({
    selector: 'app-image-analyzing',
    templateUrl: 'image-analyzing.component.html',
    styleUrls: ['image-analyzing.component.scss']
})

export class ImageAnalyzingComponent implements OnInit {
    @Input() imageModel: AnalyzingImageModel;
    imageSrc: any;

    constructor(
        private _sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        if (this.imageModel) {
            this.imageSrc = this._sanitizer.bypassSecurityTrustUrl(this.imageModel.image);

        }
        // this.changeDetectorRef.detectChanges();
    }
}
