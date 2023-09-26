import { ChangeDetectorRef, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { EventService } from '../../../services/utility/event.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { snackBarConfig } from '../../../../config/snackBarConfig';
import { MessageActionBarComponent } from './message-action-bar/message-action-bar.component';
import { SnackBarModel } from './snack-bar-model';
import { DeleteEntitiesModel } from '../../models/DeleteEntitiesModel';

@Injectable({providedIn: 'root'})
export class SnackBarService {
    snackbarRef
    constructor(
        private snackBar: MatSnackBar,
        private eventService: EventService
    ) { }

    openMessageActionBar(snackBarModel: SnackBarModel) {
        // let configDuration = snackBarConfig.snackBarMaxDuration;
        // setTimeout(() => {
          let configDuration = snackBarConfig.snackBarDuration;
          if (snackBarModel.action === snackBarConfig.action.undo) {
            configDuration = snackBarConfig.snackBarDurationUndo;
          }

          let matSnackBarConfig = this.setMatSnackBarConfig(snackBarModel, configDuration);

          if (this.snackBar._openedSnackBarRef !== null) {
            this.snackBar._openedSnackBarRef.dismiss();


          }
          this.snackBar.openFromComponent(MessageActionBarComponent, matSnackBarConfig)
            .afterDismissed()
            .subscribe(data => {
              if (snackBarModel.action === snackBarConfig.action.undo && data.dismissedByAction) {
                // this.eventService.setDeleteItemsAction()
                let undoDeleteAction = new DeleteEntitiesModel(snackBarModel.collectionData, snackBarConfig.action.undo);
                this.eventService.setDeleteItemsAction(undoDeleteAction);
                this.popMessageInfo(snackBarConfig.message.imageNotDeleted);
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
        // this.itemService.deleteItem(itemId)
        //   .then(() => {
        //     this.popMessageInfo(snackBarConfig.message.imageIsDeleted);
        //   }).catch(() => {
        //     this.popMessageWarrning(snackBarConfig.message.cantDelete);
        //   });
      }

    setMatSnackBarConfig(snackBarModel: SnackBarModel, configDuration: number): MatSnackBarConfig {
        let matSnackBarConfig = new MatSnackBarConfig();
        matSnackBarConfig.panelClass = [snackBarModel.type];
        matSnackBarConfig.duration = configDuration;
        matSnackBarConfig.data = snackBarModel;
        return matSnackBarConfig;
      }

      popMessageError(message: string): void {
        if (message === 'Please Login') {
          this.popMessage(message, 'info', snackBarConfig.action.message)
        } else {
          this.popMessage(message, 'error', snackBarConfig.action.message)
        }
      }

      popMessageSuccess(message: string): void {
        this.popMessage(message, 'success', snackBarConfig.action.message)
      }

      popMessageInfo(message: string): void {
        this.popMessage( message, 'info', snackBarConfig.action.message)
      }

      popMessageWarrning(message: string): void {
        this.popMessage(message, 'warrning', snackBarConfig.action.message)
      }

      popMessage(message: string,  type: string, action?: string, collectionData?: string[]) {

                let snackBarModel = new SnackBarModel(
                  message, type, action, collectionData
                )

                this.openMessageActionBar(snackBarModel);
        }
}
