import { Component, OnDestroy, AfterViewInit, OnInit, Inject,
  Renderer2, PLATFORM_ID, HostListener, AfterContentInit, AfterContentChecked, ChangeDetectionStrategy } from '@angular/core';
import { SnackBarComponent } from '../snack-bar.component';
import { isPlatformBrowser } from '@angular/common';
import { snackBarConfig } from '../../../../../config/snackBarConfig';
import { SnackBarModel } from '../snack-bar-model';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'app-message-action-bar',
    templateUrl: './message-action-bar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class MessageActionBarComponent implements OnInit, AfterContentChecked , OnDestroy {

    iconType = '';
    iconAction = '';
    message = '';
    listenerFn: () => void;
    listenerFnTouch: () => void;
    count
    counter: number;
    interval

    constructor(
      // @Inject(MAT_SNACK_BAR_DATA) public data: any,
      @Inject(MatSnackBarRef) public snackBarRef: MatSnackBarRef<MessageActionBarComponent>,
      private renderer2: Renderer2,
      @Inject(PLATFORM_ID) private platformId: Object
    ) {

      this.iconType = this.snackBarRef.containerInstance.snackBarConfig.panelClass[0];
      this.message = this.snackBarRef.containerInstance.snackBarConfig.data.message;

      if (this.snackBarRef.containerInstance.snackBarConfig.data.type === snackBarConfig.type.delete) {
        this.counter = snackBarConfig.snackBarCounter;
        this.interval = snackBarConfig.snackBarInterval;
        this.iconAction = snackBarConfig.action.undo;
      }
    }

    // @HostListener('window:click', ['$event'])
    // onSnackBarClick(event) {
    //   // if (
    //   //   this.snackBarModel !== undefined
    //   //   && this.snackBarModel.type !== undefined
    //   //   && this.snackBarModel.type !== snackBarConfig.type.search) {

    //     let eventTargetNodeName = event.target.nodeName
    //     if (event.target.offsetParent) {
    //       let eventTargetOffsetParentLocalName = event.target.offsetParent.localName
    //       if (eventTargetOffsetParentLocalName === 'snack-bar-container' ) {
    //         this.snackBarRef.dismiss();
    //       }
    //     }

    //     if (eventTargetNodeName === 'SNACK-BAR-CONTAINER') {
    //       this.snackBarRef.dismiss();
    //     }
    //   // }
    // }

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.listenerFn = this.renderer2.listen(document.body, 'mouseup', (event) => {
          this.closeSnackBar(event)

          // this.snackBarRef.dismiss();
      })

      // this.listenerFnTouch = this.renderer2.listen(document.body, 'touchstart', () => {
      //   this.snackBarRef.dismiss();
      // })


      }
    }

    ngAfterContentChecked () {
      if (isPlatformBrowser(this.platformId)) {
      // this.listenerFn = this.renderer2.listen(document.body, 'click', () => {
      //   this.snackBarRef.dismiss();
      // })

    }
  }

    closeSnackBar(target) {

      let snack = this.snackBarRef.containerInstance.snackBarConfig.data as SnackBarModel
      if (snack.action === snackBarConfig.action.undo && target === 'action') {
        this.snackBarRef.dismissWithAction();
      }

      if (target !== 'action') {
        this.snackBarRef.dismiss();
      }
    }


    ngOnDestroy() {
      if (isPlatformBrowser(this.platformId)) {
      this.iconType = '';
      if (this.listenerFn) {
        this.listenerFn();
      }

      if (this.listenerFnTouch) {
        this.listenerFnTouch();
      }
      }
    }
  }
