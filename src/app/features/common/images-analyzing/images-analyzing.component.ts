import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AnalyzingImageModel } from '../../../features/upload/models/AnalyzingImageModel';
import { UploadStateModel } from '../../../features/upload/models/UploadStateModel';
import { ItemService } from '../../../services/rs/item.service';
import { AppState, selectUploadState } from '../../../store/app.state';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-images-analyzing',
    templateUrl: './images-analyzing.component.html',
    styleUrls: ['images-analyzing.component.scss']
})

export class ImagesAnalyzingComponent implements OnInit, OnDestroy {
    getUploadStateSub: Subscription;
    getUploadState: Observable<UploadStateModel>;
    uploadState: UploadStateModel;
    analyzingImages: AnalyzingImageModel[] = [];
    // images: AnalyzingImageModel[] = [];
    analyzingTitle = 'Analyzing '
    imageTitle = 'Image';
    imagesTitle = 'Images';
    imageImagesTitle: string;

    imageSrc
    constructor(
        private store: Store<AppState>,
        private itemService: ItemService,
        private _sanitizer: DomSanitizer,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.getUploadState = this.store.select(selectUploadState);
    }

    get isImages() {
        if (this.analyzingImages && this.analyzingImages.length > 0) {
            return true;
        }

        return false;
    }

    ngOnInit() {

        this.getUploadStateSub = this.getUploadState.subscribe((upload) => {
            if (upload.analyzingImages.length > 0) {
                this.analyzingImages = upload.analyzingImages.map(v => v);

                if (this.analyzingImages.length === 1) {
                    this.imageImagesTitle = this.imageTitle;
                }

                if (this.analyzingImages.length > 1) {
                    this.imageImagesTitle = this.imagesTitle
                }
                // this.imageSrc = this._sanitizer.bypassSecurityTrustUrl(resp[0].image);
                this.changeDetectorRef.detectChanges();
            }
        })
    }

    ngOnDestroy() {
        if (this.getUploadStateSub) {
            this.getUploadStateSub.unsubscribe();
        }
    }
}
