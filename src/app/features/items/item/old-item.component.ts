// import { Component, OnInit, Input, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
// import { ActionIconService } from 'app-action-icon';
// import { Subscription } from 'rxjs';
// import { FavouritesListDndService } from '../../services/rs/favourites-list-dnd.service';
// import { Router } from '@angular/router';
// import { MessageService } from '../../services/utility/message.service';
// import { BaseItemComponent } from '../common/base-item/base-item.component';
// import { ItemViewModel } from '../../models/rs/ItemViewModel';
// import { environment } from '../../../environments/environment';
// import { EventService } from '../../services/utility/event.service';
// import { ItemService } from '../../services/rs/item.service';
// import { AuthGuard } from '../../services/as/auth.quard';
// import { isPlatformBrowser } from '../../../../node_modules/@angular/common';
// import { ReportedContentService } from '../../services/rs/reported-content.service';
// import { MatDialog } from '@angular/material';
// import { CommonResponseService } from '../../services/utility/common-response.service';

// @Component({
//   selector: '[app-item]',
//   templateUrl: './item.component.html',
//   providers: [
//     MessageService
//   ]
// })

// export class ItemComponent extends BaseItemComponent implements OnInit, OnDestroy {
//   @Input() item: ItemViewModel;
//   @Input() itemId: number;
//   @Input() itemIndex: number;
//   @Input() isFavourites = false;
//   favoriteIcon = environment.favoriteIcon;
//   tag: string;
//   tagColor = 'accent'
//   unknownImage = environment.defaultProfilePicture;
//   avatarCard = environment.defaultProfilePicture;
//   step: number;
//   eventTargetInnerHeight: number;
//   paddingDraggable = 0;

//   mouseDownTag: number;
//   isItemPickedUpSubscription: Subscription;
//   isItemPickedUp: boolean;
//   draggableAttribute = false;

//   _eventService: EventService;
//   _router: Router;

//   constructor(
//     eventService: EventService,
//     router: Router,
//     private messageService: MessageService,
//     private itemService: ItemService,
//     private favouritesListDndService: FavouritesListDndService,
//     actionIconService: ActionIconService,
//     authGuard: AuthGuard,
//     @Inject(PLATFORM_ID) private platformId: Object,
//     matDialog: MatDialog,
//     reportedContentService: ReportedContentService,
//     commonResponseService: CommonResponseService
//   ) {
//     super(
//       actionIconService,
//       authGuard,
//       eventService,
//       router,
//       matDialog,
//       reportedContentService,
//       commonResponseService
//     );

//     this._eventService = eventService;
//     this._router = router;
//   }

//   ngOnInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       if (this.item.ItemFile === '') {
//         this.item.ItemFile = this.unknownImage;
//       }
//       if (this.item.UserImage === '') {
//         this.item.UserImage = this.avatarCard
//       }
//       if (this.isFavourites === true) {
//         super.getFavourites(this.item.Id);
//       }

//       this.isItemPickedUpSubscription = this.favouritesListDndService.getIsItemPickedUp()
//         .subscribe(data => {
//           this.isItemPickedUp = data;
//         })
//     }
//   }

//   onMouseDownDraggable(event) {
//     this.draggableAttribute = true;
//   }

//   onMouseDownTag(event: MouseEvent) {
//     this.mouseDownTag = event.clientX;
//   }

//   onMouseUpTag(event: MouseEvent, tag) {
//     let mouseUp = event.clientX;
//     if (this.mouseDownTag === mouseUp) {
//       this.selectTag(tag);
//     }
//   }

//   ngOnDestroy() {
//     if (this.isItemPickedUpSubscription) {
//       this.isItemPickedUpSubscription.unsubscribe();
//     }
//   }

//   onDelete(event, item: ItemViewModel) {

//     if (confirm('Are you sure that you want to delete \'' + item.Title + '\'?') === true) {
//       let id = this.item.Id;

//       this.itemService.deleteItem(id)
//         .then(response => {
//           this._eventService.onDeleteItem.emit(id);
//         }).catch(response => {
//           this.messageService.popMessageWarrning('You can\'t delete this Item')
//         })
//     }
//   }

//   selectTag(tag) {
//     this._router.navigate(['/search', { query: '#' + tag }]);
//   }


// getFavourites(itemId) {

//     this.favouriteClass = '-favourites'
//     let url = `${environment.rsURi}/api/Favourites`;
//     this.actionIconService.getActionIconAction(url, itemId, 'item')
//       .subscribe(data => {
//         this.itemFavouritesCount = data.actionCount;
//         this.itemFavouriteInput = data.userAction;

//         if (this.itemFavouriteInput === true) {
//           this.detailFavouriteClass = '-favourite';
//           this.itemFavourite = true;

//         } else {
//           this.detailFavouriteClass = '-null';
//           this.itemFavourite = false;
//         }
//         // this.loadFavorite = true;
//       }, error => {
//         this.loadFavorite = true;
//       });
//   }

// getLikes(itemId, type) {
//     let url = `${environment.rsURi}/api/Likes`;
//     this.actionIconService.getActionIconAction(url, itemId, type)
//       .subscribe(data => {
//         this.itemLikesCount = data.actionCount;
//         this.itemLikedInput = data.userAction;

//         if (this.itemLikedInput === true) {
//           this.detailLiikedClass = '-liked';
//           this.appLikeTooltip = config.unlike;
//           this.itemLiked = true;
//         } else {
//           this.detailLiikedClass = '-null';
//           this.appLikeTooltip = config.like;
//           this.itemLiked = false;
//         }
//         // this.loadLike = true;
//       }, error => {
//         this.loadLike = true;
//       });
//   }
// }

