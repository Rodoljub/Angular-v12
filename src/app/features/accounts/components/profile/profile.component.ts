import {
  Component, OnInit,
  ViewChild, OnDestroy, ChangeDetectorRef, PLATFORM_ID, Inject
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { CommonResponseService } from '../../../../services/utility/common-response.service';
import { BaseAccountsComponent } from '../base-accounts/base-accounts.component';
import { EventService } from '../../../../services/utility/event.service';
import { AccountsEventsService } from '../../accounts-events.service';
import { MappingItem } from '../../../../shared/mappingItem';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { config } from '../../../../../config/config';
import { SnackBarService } from '../../../common/snack-bar/snack-bar.service';

import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';
import { UserProfileModel } from '../../models/UserProfileModel';
import { AppState, selectProfileState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { ProfileDetailsModel } from '../../../../features/profile-details/ProfileDetailsModel';
import { AddAnalyzingImage, ChangeProfileName, GetProfile } from '../../../../store/actions/profile.actions';
import { AnalyzingImageModel } from '../../../../features/upload/models/AnalyzingImageModel';
import { UpdatedProfileModel } from '../../models/UpdatedProfileModel';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['profile.component.scss'],
  providers: [
    CommonResponseService
  ]
})
export class ProfileComponent extends BaseAccountsComponent implements OnInit, OnDestroy {
  getProfileState: Observable<ProfileDetailsModel>;
  getProfileStateSub: Subscription;
  profileModel: ProfileDetailsModel;
  profileForm: FormGroup;
  isImageAnalyzing = false;
  analyzingImageModel: AnalyzingImageModel;
  data: any;
  user: any
  upload = false;
  showCanvas = false;
  name: string;
  userImagePath;
  save = false;
  userName: string;
  profileImageLoading = false;
  defaultProfilPic: string = config.defaultProfilePicture;
  // contentStateSubscription: Subscription;
  hideEditButton = false;

  formErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();

  analyzingTitle = 'Analyzing '
  imageTitle = 'Image';

  // image cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  pointerNone = '';
  pointerNoneClass = 'img-crop-pointer-none'

  displayNone = '';
  displayNoneClass = 'img-crop-display-none'

  width = config.width;
  height = config.height;
  croppedWidth = config.croppedWidth;
  croppedHeight = config.croppedHeight;
  canvasWidth = config.canvasWidth;
  canvasHeight = config.canvasHeight;
  rounded = config.rounded;
  noFileInput = config.noFileInput
  allowedFilesRegex = `${config.allowedFilesRegextest}`
  _router: Router;
  _accountsEventsService: AccountsEventsService;

  public constructor(
    private store: Store<AppState>,
    titleService: Title,
    private userService: UserService,
    private commonResponseService: CommonResponseService,
    private snackBarService: SnackBarService,
    private eventService: EventService,
    router: Router,
    route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    accountsEventsService: AccountsEventsService,
    @Inject(PLATFORM_ID) private platformId: Object  ) {

    super(
      accountsEventsService,
      titleService,
      route,
      router
    )

    this.createForm();

    this._router = router;
    this._accountsEventsService = accountsEventsService;

    this.data = {};

    this.getProfileState = this.store.select(selectProfileState);

  }

  // #region LifeCicle
  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {

      super.acoountAnimationOut();

      super.accountSetTitle('Profile')
      this.store.dispatch(new GetProfile())
      this.getUserProfile();
    }
  }

  ngOnDestroy() {
    if (this.getProfileStateSub) {
      this.getProfileStateSub.unsubscribe();
    }
  }
  // #endregion LifeCicle

  get formControls() {
    this.selectedFileControl = this.profileForm.get('selectedFileControl');
    this.nameControl = this.profileForm.get('nameControl');

    super.baseFormControl();

    return this.selectedFileControl || this.nameControl;
  }

  onClickChangeImage() {
    document.getElementById('selectedFile').click();
  }



  onChangeYourPassword(route: any) {
    this.navigateToAccountsRoutes(route, '');
  }

  onNameChanged() {
    this.save = true;
  }

  updateProfile() {

    if (this.save === true || this.data.image !== undefined) {
      super.setAccountProgressBar(true)
      this.hideEditButton = true;
      this.save = false;
      this.nameControl.disable();
      this.pointerNone = this.pointerNoneClass;

      // if (this.userName === this.nameControl.value && this.data.image === undefined) {
      //   this.snackBarService.popMessageError(config.selectedFileControlFormatNotValid);
      // }

      let updateProfile = new UserProfileModel();
      updateProfile.UserImage = this.data.image;
      updateProfile.Name = this.nameControl.value;

      this.profileService.updateProfile(updateProfile)
        .subscribe(
          (updatedProfile: UpdatedProfileModel) => {
            if (updatedProfile) {
              if (updatedProfile.name !== this.profileModel.name) {
                this.snackBarService.popMessageSuccess('Successfully changed name');
                this.store.dispatch(new ChangeProfileName(updatedProfile.name))
              }

              if (!!updatedProfile.analyzingImageModel &&
                updatedProfile.analyzingImageModel.fileId !== null) {
                  this.store.dispatch(new AddAnalyzingImage(updatedProfile.analyzingImageModel));
              }

            }
            this.store.dispatch(new GetProfile());
            // if (this.data.image !== undefined) {
            //   this.userImagePath = this.data.image;
            // }

            this.hideEditButton = false;
            this.displayNone = this.displayNoneClass;
            this.showCanvas = false;
            this.nameControl.enable();
            super.setAccountProgressBar(false)
          },
          error => {
            this.errorResult(error)
          }
        )
    }
  }

  private getUserProfile() {

    this.getProfileStateSub = this.getProfileState.subscribe((profile) => {
      if (!!profile) {
        this.profileModel = profile;
        this.profileForm.patchValue({
          nameControl: profile.name
        });
        if (profile.imagePath !== null) {
          this.userImagePath = profile.imagePath
          // + '?_=' + Date.now();
        }

        this.userName = profile.name;
        if (profile.imagePath === null) {
          this.userImagePath = this.defaultProfilPic;
        }

        if (profile.analyzingImageViewModel && profile.analyzingImageViewModel.fileId !== null) {
          this.isImageAnalyzing = true;
          this.analyzingImageModel = profile.analyzingImageViewModel;
        } else {
          this.isImageAnalyzing = false;
          // this.analyzingImageModel =
        }
      }

      super.acoountAnimationIn();
    });
  }

  private createForm() {
    this.profileForm = this.formBuilder.group({
      'selectedFileControl': [
        null

      ],
      'nameControl': [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25)
        ]
      ]
    }, { validator: this.checkFileType })
  }

  private checkFileType(c: AbstractControl): { invalid: boolean } {
    let passValue = c.get('selectedFileControl').value
    let extension = ['image'];

    if (passValue) {
      if (extension.indexOf(passValue.filetype.split('/')[0]) > -1) {

        return { invalid: false };

      } else {
        c.get('selectedFileControl').setErrors({ 'formatnotvalid': true })
        this.snackBarService.popMessageError(config.selectedFileControlFormatNotValid);
        return { invalid: true };
      }
    }
  }

  private errorResult(respError: any): any {

    let errorMapping: Array<MappingItem> = [];

    // this.commonResponseService.dispalyErrorMessages(respError, this, errorMapping, 1);
    super.setAccountProgressBar(false);
    this.hideEditButton = false;
    super.acoountAnimationIn()
    this.nameControl.enable();
    return respError;
  }

  fileChangeListener($event) {

    let image: any = new Image();
    let file: File = $event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;

    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;

      that.showCanvas = true;
      that.save = true;

      that.profileForm.get('selectedFileControl').setValue({
        filename: file.name,
        filetype: file.type,
        value: myReader.result
      })
    };

    this.upload = true;
    myReader.readAsDataURL(file);
  }

  fileChangeEvent(event: any): void {
    this.fileChangeListener(event);
    this.pointerNone = '';
    this.displayNone = '';
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.data.image = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
}
