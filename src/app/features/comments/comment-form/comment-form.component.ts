import { Component, OnInit, ElementRef, ViewChild, EventEmitter,
    Output, Input, ViewEncapsulation, ChangeDetectionStrategy,
    OnChanges, SimpleChanges, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { config } from '../../../../config/config';
import { UtilityService } from '../../../services/utility/utility.service';
import { EventService } from '../../../services/utility/event.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-comment-form',
    templateUrl: './comment-form.component.html',
    styleUrls: ['comment-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommentFormComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @Input() userAuthenticated: boolean;
    @Input() inputValue = '';
    @Input() inputPlaceholder = '';
    @Input() focusCommentTrigger: boolean;

    @Output() clickOnSendIconEmit = new EventEmitter<string>()

    @ViewChild('commentInputElement', {static: false}) commentInputElement: ElementRef;

    inputValueChangeSubs: Subscription;

    addCommentForm: FormGroup;
    addCommentControl: AbstractControl;

    touchScroll = false;

    commentSendIconFillClass = '';
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private utilityService: UtilityService,
        private eventService: EventService
    ) { }

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.createForm();
        this.addCommentControlValueChangeSubscription();
      }
    }

    ngAfterViewInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.addCommentControl.setValue(this.inputValue);
      }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.focusCommentTrigger) {
          if (changes.focusCommentTrigger.currentValue !== changes.focusCommentTrigger.previousValue) {
            this.checkLogin();
            this.commentInputElement.nativeElement.focus();
            // this.commentElement.nativeElement.scrollIntoView(false);
          }
        }

        // if (changes.inputValue) {
        //     if (changes.inputValue.currentValue !== changes.inputValue.previousValue) {
        //         this.addCommentControl.setValue(changes.inputValue.currentValue);
        //     }
        // }
    }

    ngOnDestroy() {
        if (this.inputValueChangeSubs) {this.inputValueChangeSubs.unsubscribe()};
    }

    createForm() {
        this.addCommentForm = this.formBuilder.group({
          'addCommentControl': [
            '',
            [
              Validators.maxLength(config.commentMaxCharacter),
            ]
          ]
        });

        this.addCommentControl = this.addCommentForm.get('addCommentControl');
    }

    addCommentControlValueChangeSubscription() {

         this.inputValueChangeSubs = this.addCommentControl.valueChanges.subscribe(data => {

            if (this.addCommentControl.value !== '' && this.addCommentControl.value.trim() !== '') {
              this.commentSendIconFillClass = '-fill';
            } else {
              this.commentSendIconFillClass = '';
            }
            // this.changeDetectorRef.detectChanges();
          });
    }

//#region Input
    clickCommentInput() {

        this.checkLogin();
        this.commentInputElement.nativeElement.focus();
        let x = window.scrollX, y = window.scrollY;
        window.scrollTo(x, y);
    }

    focusCommentInput() {
        this.eventService.setBottomMobileNavActionShowShow(false);
    }

    blurCommentInput() {
        this.eventService.setBottomMobileNavActionShowShow(true);
    }

    textareaTouchmove() {
        this.touchScroll = true;
    }

    textareaTouchEnd() {
        if (!this.touchScroll) {
          this.clickCommentInput();
        } else {
          this.touchScroll = false;
        }
    }

    clickOnSendIcon() {
        if (this.addCommentControl.value !== '' && this.addCommentControl.value.trim() !== '') {
            this.clickOnSendIconEmit.emit(this.addCommentControl.value);
        }
    }

    addCommentTouchmove() {
        this.touchScroll = true;
    }

    addCommentTouchEnd() {
        if (!this.touchScroll) {
          this.clickOnSendIcon();
        } else {
          this.touchScroll = false;
        }
    }
//#endregion Input

    checkLogin() {

        if (!this.userAuthenticated) {
            this.utilityService.redirectToLogin();
        }
    }
}
