import { Component, OnInit, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { SnackBarService } from '../../../features/common/snack-bar/snack-bar.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { configErorrMessages } from '../../../../config/configErorrMessages';
import { config } from '../../../../config/config';

@Component({
    selector: 'app-upload-select-files',
    templateUrl: 'upload-select-files.component.html',
    styleUrls: ['upload-select-files.component.scss']
})

export class UploadSelectFilesComponent implements OnInit {

    @Input() touchDevice = false;

    @Output() fileAdded = new EventEmitter<File>();


    uploadmageButtonClass = '';

    dragNDropLabel = config.dndImageOr;

    constructor(
      private utilityService: UtilityService,
      private snackBarService: SnackBarService
    ) { }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      const resizeEventWidth = event.target.innerWidth;
      this.resize(resizeEventWidth);
    }

    resize(resizeEventWidth) {
        if (resizeEventWidth < 569 ) {

          this.uploadmageButtonClass = '-mobile'

        } else {

          this.uploadmageButtonClass = ''
        }
    }

    ngOnInit() {

    }

    addFile($event) {
        const file: File = $event.target.files[0];
        if (this.utilityService.ifFileisImage(file)) {
          this.fileAdded.emit(file);
        } else {
          this.snackBarService.popMessageError(configErorrMessages.upload.fileFormatInvalid);
        }
    }


    onClickBrowse() {
      document.getElementById('selectedFile').click();
    }

}
