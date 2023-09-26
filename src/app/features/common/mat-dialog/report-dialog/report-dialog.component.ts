import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UtilityService } from '../../../../services/utility/utility.service';
import { config } from '../../../../../config/config';
import { ReportedContentService } from '../../../../services/rs/reported-content.service';
import { EventService } from '../../../../services/utility/event.service';
import { DialogDataModel } from '../DialogDataModel';
import { ReportedContentReasonModel } from '../../../models/ReportedContentReasonModel';
import { ReportedContentModel } from '../../../models/ReportedContentModel';

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html'
})

export class ReportDialogComponent implements OnInit {

    @Input() dialogData: DialogDataModel;

    @Output() onCancelClick = new EventEmitter();

    dialogControl: FormControl;

    reportedTypeTitle: string;

    reportedContentReasons: ReportedContentReasonModel[] = [];
    reportedContentReasonsDescription: string[];

    itemType = config.entityTypesNames.item;
    commentType = config.entityTypesNames.comment;

    cancelLabel = config.labels.dialogMenu.cancel;
    reportLabel = config.labels.dialogMenu.report;

    imageTitle = config.dialog.titles.reportImage;
    commentTitle = config.dialog.titles.reportComment;

    constructor(
        private utilityService: UtilityService,
        private reportedContentService: ReportedContentService,
        private eventService: EventService
    ) { }

    ngOnInit() {
        this.dialogControl = new FormControl('', Validators.required)

        let reportedContentReasonsJsonParse = JSON.parse(localStorage.getItem('reportedContentReasons'));

        if (reportedContentReasonsJsonParse !== null) {
            this.setReportedDialog(reportedContentReasonsJsonParse)
        } else {
            this.getReportedContentReasons();
        }
    }

    getReportedContentReasons() {
        this.reportedContentService.getReportedContentReasons()
            .then(response => {
                localStorage.setItem('reportedContentReasons', JSON.stringify(response));
                this.setReportedDialog(response)
            })
    }

    setReportedDialog(reportedContentReasonsJsonParse) {

        this.setReportedContentReasons(reportedContentReasonsJsonParse);

        switch (this.dialogData.entityTypeName) {
            case this.itemType:
                // this.reportedTypeTitle = config.dialog.titles.reportImage;
                this.reportedTypeTitle = this.imageTitle;

                this.reportedContentReasonsDescription = this.reportedContentReasons
                    .filter(it => it.ReportedContentTypeName === config.entityTypesNames.item)
                    .map(desc => desc.Description);
                break;

            case this.commentType:
                // this.reportedTypeTitle = config.dialog.titles.reportComment;
                this.reportedTypeTitle = this.commentTitle;

                this.reportedContentReasonsDescription = this.reportedContentReasons
                    .filter(it => it.ReportedContentTypeName === config.entityTypesNames.comment)
                    .map(desc => desc.Description);
                break;

            default:
                break;
        }


    }

    private setReportedContentReasons(reportedContentReasonsJsonParse: any) {
        for (let reportedContentReason of reportedContentReasonsJsonParse) {
            let reportedContentReasonMapped = this.utilityService.mapJsonObjectToObject<ReportedContentReasonModel>(reportedContentReason);
            let existReportedContentReason = this.reportedContentReasons.find(rcr => reportedContentReasonMapped.Id === rcr.Id);

            if (!existReportedContentReason) {
                this.reportedContentReasons.push(reportedContentReasonMapped);
            }
        }
    }

    cancelClick() {
        this.onCancelClick.emit();
    }

    reportEntity(description: string) {
        let reportedResult = this.reportedContentReasons.find(item => item.Description === description)
          if (reportedResult) {

            if (this.dialogData.entityTypeName === config.entityTypesNames.item) {
            //   this.itemReportMenu = false;
            }

            if (this.dialogData.entityTypeName === config.entityTypesNames.comment) {
              this.eventService.setReportedComment(this.dialogData.entityId);
            }

            let reportedContent = new ReportedContentModel(
              this.dialogData.entityTypeName, reportedResult.Id, this.dialogData.entityId
            );

            this.reportedContentService.setReportedContent(reportedContent)
              .then(response => {})
            //   .catch(error => this.errorResult)

            this.onCancelClick.emit();
          }
    }
}
