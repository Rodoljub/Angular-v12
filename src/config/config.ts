export const config = {

  angularClient: 'angular-client',
  resourceApi: '/api',
  mediaImage: 'xxxxxxxx/',
  jpegExtansion: '.jpeg',
  webpExtansion: '.webp',
  maxFileSizeMb: '4 Mb.',
  // tslint:disable-next-line:max-line-length
  connectAuthPath: '/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dangular-client%26redirect_uri%3Dhttp%253A%252F%252F192.168.1.105%252Fiframe-signin-callback%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520IdentityServerApi%2520offline_access%26state%3Dc925acfa34a8429499916564db4f8a04%26code_challenge%3DWEV-P8GuZUSSsCqGBQ7LOfsZhUyIe0qKmxJxSoiCAGw%26code_challenge_method%3DS256%26response_mode%3Dquery%26isIframe%3Dtrue',
  iframeSigninPath: '/iframe-signin',
  // login: '/accounts/login',
  signinCallback: '/signin-callback',
  iFramesigninCallback: '/iframe-signin-callback',
  signoutCallback: '/signout-callback',
  login: '/(auth:accounts/login)',

  defaultProfilePicture: '/assets/images/profile-pic.jpg',

  routeConfigPath: {
    home: '',
    portfolio: 'portfolio',
    favourites: 'favourites',
    accounts: {
      login: '(auth:accounts/login)',
      register: '(auth:accounts/register)'
    }
  },

  itemsListsTypes: {
    latest: 'latest',
    related: 'related',
    search: 'search',
    portfolio: 'portfolio',
    portfolioAnonymous: 'portfolioAnonymous',
    favourites: 'favourites',
  },

  clientWidthTypes: {
    small: 'small',
    middel: 'middel',
    wide: 'wide'
  },

  clientWidthBrake: {
    small: 680,
    middel: 1025,
    itemModalClose: 569
  },


  //#region Cropper
  width: 100,
  height: 100,
  croppedWidth: 100,
  croppedHeight: 220,
  canvasWidth: 300,
  canvasHeight: 200,
  rounded: true,
  noFileInput: true,
  allowedFilesRegextest: '/.(jpe?g|png|gif)$/i',
  //#endregion Cropper

  tags: {
    tagMinCharacters: 2,
    tagMaxCharacters: 25,
    maxTags: 15,
    minTags: 3,
    maxUserAdd: 3
  },


   validTimeMin: 120000,
   validTimeMax: 1200000,

  //#region account-upload-card-animation */
  transitionAnimate: 0,
  //#endregion account-upload-card-animation */

  //#region Account Upload Forms Message
   nameRequired: 'The Name field is required.',
   nameMinLenght: 'The Name should contain at least 4 characters.',
   nameMaxLength: 'The Name should contain max 25 characters.',
   nameHintMessage: 'The Name have maximum characters',
   nameMaxCharacters: 25,
   nameExisting: 'The Name already taken',
   nameDuplicateFirstSentance: 'The name: ',
   nameDuplicateSecondSentance: ' is not available. :(',
   emailRequired: 'The Email field is required.',
   emilNotValidFormat: 'The Email is not in valid format.',
   emailAlreadyRegistered: ' is already registered',
   emailNotFound: 'Did you forgot your email?',
   emailOrPassNotValid: 'The Email or password not valid.',
   passwordRequired: 'The Password field is required.',
   passwordMinLength: 'The Password should contain at least 6 characters.',
   confirmPasswordRequired: 'The Confirm Password field is required.',
   confirmPasswordMismatch: 'The Confirm Password must match password.',
   currentPasswordRequired: 'The Current Password field is required.',
   currentPasswordMinLength: 'The Current Password should contain at least 6 characters.',
   selectedFileControlFormatNotValid: 'The image file you tried to attach is invalid',
   messageRequired: 'The Message field is required',
   messageMinLength: 'The Message should contain at least 10 characters.',
   messageMaxLength: 'The Message should contain max 800 characters.',
   
   messageMinChar: 10,
   messageMaxChar: 800,

   captionMinCharacters: 4,
   captionMaxCharacters: 100,


   tagsRequired: 'The Tags field is required 3 tags.',
   tagMinLenght: 'The Tag should contain at least 2 characters.',
   tagAllreadyInList: 'Tag is already in list',
   tagMaxLenght: 'The Tag should contain max 25 characters.',
   tagTagsMax: 'You have max number of tags',
   tagTagsMin: 'You have min number of tags',
   descriptionRequired: 'The Description field is required.',
   descriptionMinLenght: 'The Description should contain at least 4 characters.',
   descriptionMinCharacters: 4,
   descriptionMaxLenght: 'The Description should contain max 250 characters.',
   descriptionHintMessage: 'The Description have maximum characters',
   descriptionMaxCharacters: 250,


   uploading: 'Uploading',
   imageUploadingWait: 'Image uploading please wait',
   analyzeImageWait: 'Please wait while we save and analyze image.',
   selectOrTakeImage: 'Select or take image',
   selectImage: 'Select image',
   selectOrDnDImage: 'Select or drag and drop image',
   dndImageOr: 'Drag and drop or',
  //#endregion Account Upload Forms Message

  inputPlaceholders: {
    addInterests: 'Add Interests',
    searchHere: 'Search here',
    addComment: 'Add comment',
    addReply: 'Add reply',
    edit: 'Edit'
  },

  labels: {
    navigation: {
      home: 'Home',
      favourites: 'Favourites',
      portfolio: 'Portfolio',
      menu: 'Menu',
      google: 'Google',
      facebook: 'Facebook'
    },
    navigationMenu: {
      upload: 'Upload',
      portfolio: 'Portfolio',
      favourites: 'Favourites',
      logout: 'Logout',
      back: 'Back',
      savedSearch: 'Saved Searches',
      profile: 'Profile'
    },
    dialogMenu: {
      edit: 'Edit',
      delete: 'Delete',
      reportSpamOrAbuse: 'Report spam or abuse',
      cancel: 'Cancel',
      report: 'Report',
      saveSearch: 'Save search',
      editComment: 'Edit comment'
    },
    searchBox: {
      search: 'Search',
      close: 'Close',
      clear: 'Clear',
      open: 'Open',
      saveSearch: 'Save',
      shareSearch: 'Share'
    },
    profileCounters: {
      uploads: 'Uploads',
      images: 'Images',
      comments: 'Comments',
      likes: 'Likes',
      favourites: 'Favourites'
    },
  },
  showComment: 'Show comment',
  showComments: 'Show comments',
  showMoreComments: 'Show more comments',
  hideComment: 'Hide comment',
  hideComments: 'Hide comments',
  showReply: 'Show reply',
  showReplies: 'Show replies',
  showMoreReplies: 'Show more replies',
  hideReply: 'Hide reply',
  hideReplies: 'Hide replies',
  commentMaxInitialViewHeight: 20,
  commentMaxCharacter: 450,

  replyButtonLabel: 'Reply',

  likeIcon: 'assets/images/material/icon/baseline-favorite-24px.svg',
  favoriteIcon: 'assets/images/material/icon/baseline-bookmark-24px.svg',
  actionIconFillClass: 'fill',
  actionIconStrokeClass: 'stroke',

  entityTypesNames: {
    item: 'Item',
    comment: 'Comment'
  },

  entityActionType: {
    insert: 'insert',
    update: 'update'
  },

  actionIconTypes: {
    like: 'Like',
    favourite: 'Favourite',
    edit: 'Edit',
    delete: 'Delete'
  },

    // tslint:disable-next-line:max-line-length
    detectUserAgentPlatformRegX: '/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|OperaM(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/',

  //#region Titles
    titles: {
      titleSeparator: ' - ',
      applicationTitle: 'Occpy',
      home: 'Home',
      portfolioTitle: 'Portfolio',
      favouritesTitle: 'Favourites',
      upload: 'Upload',
      edit: 'Edit'
    },
  //#endregion Titles

  //#region Tooltip
  tooltips: {
    showDelay: 1000,
    home: 'Home',
    view: 'View',
    upload: 'Upload',
    login: 'Login',
    register: 'Register',
    profile: 'Menu',
    settings: 'Settings',
    report: 'Report',
    comments: 'Comments',
    search: 'Search',
    close: 'Close',
    likeTooltip: 'Like',
    unlikeTooltip: 'Unlike',
    favouriteTooltip: 'Favourite',
    unfavouriteTooltip: 'Unfavourite',
    editTooltip: 'Edit',
    save: 'Save',
    open: 'Open',
    shareTooltip: 'Share',
    descriptionTooltip: 'Description',
    delete: 'Delete',
    portfolio: 'Portfolio'
  },

  //#endregion Tooltip


  //#region List View Types
  listViewTypes: {
    wall: 'wall',
    grid: 'grid',
    carousel: 'carousel'
  },
  //#endregion List View Types

  //#region List Grid View
  gridListView: {
    numberOfColumn: 3,
    maxGridWidth: 1500,
  },
  imageWidth: {
    itemViewMode: 90,
    viewMode: 100,
    list: 330,
    itemList: 320,
    detail: 640
  },

  itemCard: {
    padding: 6,
  },
  //#endregion List Grid View

  //#region Progress Spinner && Bar

  progressBar: {
    type: {
      main: 'main',
      accounts: 'accounts',
      uploads: 'uploads'
    }
  },

  progressSpinner: {
    progressSpinnerIndeterminateMode: 'indeterminate',
  },

  //#endregion Progress Spinner && Bar

  //#region Dialog
  dialog: {
    type: {
      initial: 'initial',
      saveSearch: 'saveSearch',
      entity: 'entity',
      report: 'report',
      comment: 'comment'
    },
    titles: {
      deleteImage: 'Delete Image',
      reportImage: 'Report Image',
      deleteComment: 'Delete Comment',
      reportComment: 'Report Comment'
    }
  },
  //#endregion Dialog

  //#region Autocomplete

  autocomplete: {
    search: 'searchAutocomplete',
    saveSearchResult: 'saveSearchResult'
  }

  //#endregion Autocomplete

}
