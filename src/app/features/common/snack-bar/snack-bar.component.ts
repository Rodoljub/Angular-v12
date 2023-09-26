import { Component, OnInit, Inject,
          OnDestroy, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '../../../../../node_modules/@angular/common';
import { EventService } from '../../../services/utility/event.service';
import { ItemService } from '../../../services/rs/item.service';
import { snackBarConfig } from '../../../../config/snackBarConfig';
import { MessageActionBarComponent } from './message-action-bar/message-action-bar.component';
import { UtilityService } from '../../../services/utility/utility.service';
import { SnackBarService } from './snack-bar.service';
import { SnackBarModel } from './snack-bar-model';
import { DeleteEntitiesModel } from '../../models/DeleteEntitiesModel';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
})
export class SnackBarComponent implements OnInit, OnDestroy {

  snackBarSubscription: Subscription;
  snackbarRef
  snackBarModel: SnackBarModel;

  constructor(
    public snackBar: MatSnackBar,
    private snackBarService: SnackBarService,
    private utilityService: UtilityService,
    private eventService: EventService,
    private itemService: ItemService,

    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.snackBarSubscription = this.eventService.getSnackBarMessage()
      .subscribe(snackBarModel => {
        this.snackBarModel = snackBarModel;
        this.openMessageActionBar(snackBarModel);
      })
    }
  }

  ngOnDestroy() {
    if (this.snackBarSubscription) {
      this.snackBarSubscription.unsubscribe();
    }
  }

  private openMessageActionBar(snackBarModel: SnackBarModel) {
    // let configDuration = snackBarConfig.snackBarMaxDuration;
    // setTimeout(() => {
      let configDuration = snackBarConfig.snackBarDuration;
      if (snackBarModel.action === snackBarConfig.action.undo) {
        configDuration = snackBarConfig.snackBarDurationUndo;
      }

      let matSnackBarConfig = this.snackBarService.setMatSnackBarConfig(snackBarModel, configDuration);

      this.snackbarRef = this.snackBar.openFromComponent(MessageActionBarComponent, matSnackBarConfig)
        .afterDismissed()
        .subscribe(data => {
          if (snackBarModel.action === snackBarConfig.action.undo && data.dismissedByAction) {
            // this.eventService.setDeleteItemsAction()
            let undoDeleteAction = new DeleteEntitiesModel(snackBarModel.collectionData, snackBarConfig.action.undo);
            this.eventService.setDeleteItemsAction(undoDeleteAction);
            this.snackBarService.popMessageInfo(snackBarConfig.message.imageNotDeleted);
          }
          if (snackBarModel.action === snackBarConfig.action.undo
            && !data.dismissedByAction
            && snackBarModel.collectionData !== undefined) {
            for (let itemId of snackBarModel.collectionData) {
              this.deleteItem(itemId);
            }

            // let deleteEntity = new DeleteEntitiesModel(
            //   snackBarModel.collectionData,
            //   snackBarConfig.type.delete
            // );
            // this.eventService.setDeleteItemsAction(deleteEntity);
          }
        });
    // }, 50)

  }

  private deleteItem(itemId) {
    this.itemService.deleteItem(itemId)
      .then(() => {
        this.snackBarService.popMessageInfo(snackBarConfig.message.imageIsDeleted);
      }).catch(() => {
        this.snackBarService.popMessageWarrning(snackBarConfig.message.cantDelete);
      });
  }
}

