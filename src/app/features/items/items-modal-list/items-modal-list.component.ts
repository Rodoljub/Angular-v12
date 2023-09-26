import { Component, OnInit, Input, Inject, PLATFORM_ID, OnDestroy,
    Renderer2, ViewChild, ElementRef, QueryList, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { config } from '../../../../config/config';
import { isPlatformBrowser, Location, isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs';
import { EventService } from '../../../services/utility/event.service';
import { snackBarConfig } from '../../../../config/snackBarConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../../services/utility/utility.service';
import { ImagesService } from '../../../services/rs/images.service';
import { localStorageConfig } from '../../../../config/localStorageConfig';
import { ItemViewModel } from '../item/ItemViewModel';
import { ItemsModalListModel } from './ItemsModalListModel';
import { DeleteEntitiesModel } from '../../models/DeleteEntitiesModel';
import { OidcService } from '../../accounts/services/oidc.service';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../../environments/environment';
import { SearchFormModel } from '../../search/SearchFormModel';
import { SearchService } from '../../search/search.service';

@Component({
    selector: 'app-items-modal-list',
    templateUrl: './items-modal-list.component.html',
    styleUrls: ['items-modal-list.component.scss'],
    providers: [
    ]
    //  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsModalListComponent implements OnInit, OnDestroy {
    itemModelList: ItemsModalListModel;
    userAuthenticated: boolean = undefined;
    @Input() mobileView: boolean;
    @Input() touchDevice = false;
    @ViewChild('itemsWrapEl', {static: false}) itemsWrapEl: ElementRef;
    @ViewChild('itemWrap', {static: false}) itemWrap: ElementRef;
    @ViewChild('closeIconModalButton', {static: false}) closeIconModalButton: MatButton;
    closeIconModalButtonRight = 48;
    showDetails = true;
    typeOfItemsList = '';
    items: ItemViewModel[] = [];
    itemsModalList: ItemViewModel[] = [];
    itemsWrap = false;
    appItem = false;
    itemHidden = true;
    itemViewModel: ItemViewModel;
    wallViewType = config.listViewTypes.wall;
    itemDetailModeSubscription: Subscription;
    itemsTimer: NodeJS.Timer;

    showIcons = false;

    focusElement: HTMLElement;
    previusElement: HTMLElement;
    afterElement: HTMLElement;

    touchStartX: number;
    touchStartY: number;
    touchMoveStartX: number;
    touchMoveStartY: number;
    touchMoveX: number;
    touchMoveY: number;
    isFirstMove = true;
    translateElementStartX: number;

    clientWidth: number;
    setItemsTimeout: NodeJS.Timer;
    tapTimeout: NodeJS.Timer;
    tapElement = true;
    isMouseDown = false;
    firstEventStart = true;

    itemModalFlex = '';
    clientScreenWide = false;
    showCloseIcon = false;
    deleteItemsSubscription: Subscription;
    countTap = 0;
    showDetailsTimeout: NodeJS.Timer;

    constructor(
        private eventService: EventService,
        private renderer2: Renderer2,
        private changeDetectorRef: ChangeDetectorRef,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private utilityService: UtilityService,
        private imagesService: ImagesService,
        private oidcService: OidcService,
        private searchService: SearchService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.oidcService.loginChanged.subscribe(userAuthenticated => {
            this.userAuthenticated = userAuthenticated;
        })
     }


    @HostListener('window:resize', ['$event'])
    onResize($event) {
        const clientWidth = document.scrollingElement.getBoundingClientRect().width
        // clientWidth;
        if (this.itemsWrapEl && clientWidth !== this.clientWidth) {
            if (this.setItemsTimeout) {
                clearTimeout(this.setItemsTimeout);
            }
            // this.setItemsTimeout = setTimeout(() => {
                const event = $event;
                const elementLeft = this.itemsWrapEl.nativeElement.getBoundingClientRect().left;
                const indexTranslate = -elementLeft / this.clientWidth;

                this.itemModelList.itemIndex = Math.round(indexTranslate);
                if (this.items.length > 0 ) {

                    this.setItemModal(this.itemModelList);
                    // const itemIndex = indexTranslate;

                    // this.clientWidth = this.itemsWrapEl.nativeElement.getBoundingClientRect().width
                    // // event.target.innerWidth;
                    // this.setItemsTranslateElement(this.clientWidth, itemIndex);
                    // this.firstEventStart = true;

                    // const docBodyRect = document.body.getBoundingClientRect();
                    // this.setClientWidthBraek(docBodyRect.width);

                    // this.items.forEach((item, index) => {
                    //     const element = document.getElementById('app-item-detail-wrap-' + item.Index);
                    //     if (element) {
                    //         const translate = index * event.target.innerWidth;
                    //         this.renderer2.setStyle(element, 'width', event.target.innerWidth + 'px');
                    //         this.renderer2.setStyle(element, 'transform', 'translateX(' + translate + 'px)');
                    //     }
                    // })


                }
            // }, 100)
        }
        this.setShowCloseIcon();
        this.gridTileResize($event.target.innerWidth);
    }

    private gridTileResize(resizeEventWidth) {
        this.touchDevice = this.utilityService.isTouchDevice();
        // if (resizeEventWidth < 480) {
        //   this.mobileView = true;
        // } else {
          this.mobileView = false;
        // }
      }

    setShowCloseIcon() {
        const clientWidth = document.body.clientWidth;

        if (clientWidth >= config.clientWidthBrake.itemModalClose) {
            this.showCloseIcon = true;
        } else {
            this.showCloseIcon = false;
        }
    }

    setClientWidthBraek(clientWidth: number) {
        // if (clientWidth > config.clientWidthBrake.middel) {
        //     this.itemModalFlex = 'item-modal-flex';
        //     this.clientScreenWide = true;
        // } else {
            this.itemModalFlex = '';
            this.clientScreenWide = false;
        // }
    }


    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.oidcService.isAuthenticated().then(userAuthenticated => {

                this.userAuthenticated = userAuthenticated;
            })
            this.gridTileResize(document.scrollingElement.clientWidth);

            this.deleteItemsSubscription = this.eventService.getDeleteItemsAction()
            .subscribe(deleteItems => {
              switch (deleteItems.typeAction) {
                case snackBarConfig.action.undo:
                    this.itemModelList = JSON.parse(localStorage.getItem(localStorageConfig.itemsModalList));
                    for (let id of deleteItems.entitiesIds) {
                        let index = this.itemModelList.itemsModalListModel.findIndex(i => i.Id === id);
                        this.itemModelList.itemIndex = index;
                        let newItemList = new ItemsModalListModel(index, this.itemModelList.itemsModalListModel)
                        this.setItemModal(newItemList);
                    }
                    break;
                    default:
                    break;
              }
            });

            this.route.data
            // .toPromise()
            .subscribe(
                // .then(
                response => {
                    if (response.seo) {
                        this.itemModelList = JSON.parse(localStorage.getItem(localStorageConfig.itemsModalList));

                        if (this.itemModelList) {
                            this.setItemModal(response.seo);
                        } else {
                            // this.location.replaceState('/');
                            let item = this.utilityService.mapJsonObjectToObject<ItemViewModel>(response.seo);
                            let items = [];
                            items.push(item);
                            let itemsModalListModel = new ItemsModalListModel(0, items);
                            this.setItemModal(itemsModalListModel);
                            // let progressSpinnerModel = new ProgressSpinnerModel(false, false);
                            // this.eventService.setMainProgressSpinner(progressSpinnerModel);

                        }
                    }
                },
            );
        }
    }


    private setItemModal(itemsModalList: ItemsModalListModel) {
        clearTimeout(this.itemsTimer);
        this.setShowCloseIcon();
        this.items = [];
        this.itemsModalList = [];
        this.itemsWrap = true;
        if (itemsModalList.typeOfItemsList) {
            this.typeOfItemsList = itemsModalList.typeOfItemsList;
        }
        let initialItem = itemsModalList.itemsModalListModel[itemsModalList.itemIndex];
        initialItem.Index = itemsModalList.itemIndex;
        this.items.push(initialItem);
        itemsModalList.itemsModalListModel.forEach((item, index) => {
            let i = item;
            i.Index = index;
            this.itemsModalList.push(i);
        });
        this.changeDetectorRef.detectChanges();
        this.itemsTimer = setTimeout(() => {
            this.appItem = true;
            this.changeDetectorRef.detectChanges();
            setTimeout(() => {
                this.eventService.setBottomMobileNavActionShowShow(false);
                setTimeout(() => {
                    // document.documentElement.style.overflow = 'hidden';
                    this.firstEventStart = true;
                    const docBoundRect = document.body.getBoundingClientRect();
                    this.clientWidth = docBoundRect.width;
                    this.setClientWidthBraek(this.clientWidth);
                    // const itemsCount = itemsModalList.itemsModalListModel.length;
                    this.setItemsTranslateElement(this.clientWidth, itemsModalList.itemIndex);
                    this.setItemIdUrl(itemsModalList.itemIndex, true);
                    const element = this.getElementById(itemsModalList.itemIndex);
                    this.setElementTranslate(element, itemsModalList.itemIndex);
                    this.setPreviousAfterItem(itemsModalList.itemIndex);
                    this.itemHidden = false;
                    this.showIcons = true;
                }, 200);
            }, 100);
        }, 0);
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
                // this.itemDetailModeSubscription.unsubscribe();
                this.deleteItemsSubscription.unsubscribe();
                document.documentElement.style.overflow = '';
                localStorage.removeItem(localStorageConfig.itemsModalList);
                this.closeItem()

        }
    }

    setItemsTranslateElement(clientWidth: number, itemIndex: number) {

        const itemsWrapWidth = clientWidth * this.itemsModalList.length;
        const itemsWrapElNative = this.itemsWrapEl.nativeElement;
        const translate = -itemIndex * clientWidth;

        this.renderer2.setStyle(itemsWrapElNative, 'width', itemsWrapWidth + 'px');
        this.renderer2.setStyle(itemsWrapElNative, 'transform', 'translateX(' + translate + 'px)');

        setTimeout(() => {
            const buttonTranslate = -translate + clientWidth - this.closeIconModalButtonRight;
            this.setCloseIconModalButtonTranslate(buttonTranslate);
        }, 0)
    }

    setItemIdUrl(itemIndex: number, first: boolean) {
        const item = this.itemsModalList.find(i => i.Index === itemIndex);
        if (item) {
            if (first) {
                // this.location.go(item.Id);
            } else {
                let path = this.location.path();
                const splitMod = path.split('a/');
                const splitId = splitMod[1].split(')');
                // const id = splitId[0];

                const state = splitMod[0] + 'a/' + item.Id + splitId[1] + ')';
                // let mod = path.split('mod/')[1].split(')')[0];
                this.location.replaceState(state);
            }
        }
    }

    setCloseIconModalButtonTranslate(translate: number) {
        if (this.closeIconModalButton) {
            const element = this.closeIconModalButton._elementRef.nativeElement
            this.renderer2.setStyle(element, 'transform', 'translateX(' + translate + 'px)')
        }
    }

    setElementTranslate(element: HTMLElement, itemIndex: number) {
        this.changeDetectorRef.detectChanges();
        const translate = itemIndex * this.clientWidth;
        // if (element) {
            this.renderer2.setStyle(element, 'width', this.clientWidth + 'px');
            this.renderer2.setStyle(element, 'transform', 'translateX(' + translate + 'px)');
        // }
    }

    getElementById(index: number): HTMLElement {
        this.focusElement = document.getElementById('app-item-detail-wrap-' + index);
        return this.focusElement;
    }

    setPreviousAfterItem(index: number) {
        this.setPreviousItem(index);
        this.setAfterItem(index);
    }

    setPreviousItem(index: number) {
        if (index > 0) {
            // const preItem = this.itemsModalList.find(i => i.Index === index - 1);
            let preItem = this.itemsModalList[index - 1];
            // preItem.Index = index - 1;
            this.items.unshift(preItem);
            this.changeDetectorRef.detectChanges();
            setTimeout(() => {
                // const element = this.itemWrap.nativeElement;
                // const element = document.getElementById('app-item-detail-wrap-' + preItem.Index);
                const element = document.getElementById('app-item-detail-wrap-' + (index - 1));
                if (element) {
                    this.setElementTranslate(element, index - 1);
                }

            }, 100)

        }
    }

    setAfterItem(index: number) {
        if (index < this.itemsModalList.length - 1) {
            // const afterItem = this.itemsModalList.find(i => i.Index === index + 1);
            let afterItem = this.itemsModalList[index + 1];
            // afterItem.Index = index + 1;
            this.items.push(afterItem);
            setTimeout(() => {
                // const element = this.itemWrap.nativeElement;
                // const element = document.getElementById('app-item-detail-wrap-' + afterItem.Index);
                const element = document.getElementById('app-item-detail-wrap-' + (index + 1));
                if (element) {
                    this.setElementTranslate(element, index + 1);
                }

            }, 100)
        }
    }

    clickCloseItem() {
        // this.location.back();
        this.closeItem();
    }

    closeItem() {
        console.log('closeItem: ' + this.route.routeConfig.path)
        if (this.route.routeConfig.path === 'media/:id') {
            console.log('items');
            console.log(this.items);
            console.log('itemModelList');
            console.log(this.itemModelList);
            console.log('itemsModalList');
            console.log(this.itemsModalList);

            const tags = this.itemsModalList[0].Tags
            
            let searchForm = new SearchFormModel(false, '', tags, false);
            let searchQuery = this.searchService.setSearchQuery(searchForm);
            this.router.navigate(['/search', { query: searchQuery }]);
            setTimeout(() => {
                this.resetView();
            })
        } else {
            this.router.navigate([{outlets: {a: null}}]);
            this.resetView();
        }
    }

    private resetView() {
        clearTimeout(this.itemsTimer);
        this.eventService.setBottomMobileNavActionShowShow(true);
        this.appItem = false;
        this.itemsWrap = false;
        this.items = [];
        this.itemsModalList = [];
        document.documentElement.style.overflow = '';
        this.showIcons = false;
    }

    setDeleteItem(itemId: string) {
        let itemIdToArray: string[] = [];
        itemIdToArray.push(itemId);

        let index = this.items.indexOf(this.items.find(i => i.Id === itemId));
        this.items = this.items.filter(i => i.Id !== itemId);
        if (index + 1 < this.items.length) {
            let itemsModalListModel = new ItemsModalListModel(index + 1, this.items);
            this.setItemModal(itemsModalListModel);
        } else {
            if (index === 0) {
                // this.router.navigate([{outlets: {a: null}}]);
            } else {
                let itemsModalListModel = new ItemsModalListModel(index - 1, this.items);
            this.setItemModal(itemsModalListModel);
            }
        }

        let deleteEntity = new DeleteEntitiesModel(
            itemIdToArray,
            snackBarConfig.action.setDelete,
            'item'
        );
        this.eventService.setDeleteItemsAction(deleteEntity);

        let snackBarModel = this.utilityService.setDeleteSnackBar(itemIdToArray);
        this.eventService.setSnackBarMessage(snackBarModel);
    }

    onMouseDown(event) {
        if (!this.touchDevice) {
            this.isMouseDown = true;
            const elementId = event.target.id;
            const touchStartX = event.clientX;
            const touchStartY = event.clientY;

            this.eventStart(touchStartX, touchStartY, elementId)
        }
    }

    onTouchStart(event) {
        const elementId = event.target.id;
        const touchStartX = event.targetTouches[0].clientX;
        const touchStartY = event.targetTouches[0].clientY;

        this.eventStart(touchStartX, touchStartY, elementId)

    }

    eventStart(clientX: number, clientY: number, elementId?) {

        if (this.firstEventStart) {
            this.translateElementStartX = this.itemsWrapEl.nativeElement.getBoundingClientRect().left;
            this.firstEventStart = false;
        }
        this.touchStartX = clientX;
        this.touchStartY = clientY;
        this.touchMoveX = this.touchStartX;


            this.countTap++
            this.tapTimeout = setTimeout(() => {
                if (
                    elementId && (
                        elementId === 'item-image-loading-color'
                        || elementId === 'item-image'
                   )
               ) {
                   this.tapElement = true;
               } else {
                   this.tapElement = false
               }
               clearTimeout(this.tapTimeout);
                // this.tapElement = false;
            }, 250)
    }

    onMouseMove(event) {
        if (this.isMouseDown) {
            let touchMoveX = event.clientX;
            let touchMoveY = event.clientY;
            this.eventMove(touchMoveX, touchMoveY);
        }
    }

    onTouchMove(event) {
        // this.tapElement = false;
        let touchMoveX = event.targetTouches[0].clientX;
        let touchMoveY = event.targetTouches[0].clientY;

        this.eventMove(touchMoveX, touchMoveY);
    }

    eventMove(clientX: number, clientY: number) {
        this.countTap = 0;
        clearTimeout(this.tapTimeout);
        clearTimeout(this.showDetailsTimeout);

        let touchMoveX = clientX;
        let touchMoveY = clientY;

        if (this.isFirstMove) {

            this.touchMoveStartX = touchMoveX;
            this.touchMoveStartY = touchMoveY;
            this.isFirstMove = false;

        }


        let movementX = touchMoveX - this.touchMoveX;

        this.touchMoveX = touchMoveX;
        this.touchMoveY = touchMoveY;
        if (Math.abs(this.touchStartX - this.touchMoveStartX) < Math.abs(this.touchStartY - this.touchMoveStartY)) {

            // event.preventDefault();
        } else {
            // event.stopPropagation()
            this.moveItems(movementX)
        }
    }

    onMouseUp(event) {
        if (!this.touchDevice) {

            this.isMouseDown = false;
            this.eventEnd();
        }
    }

    onTouchEnd(event) {

        this.eventEnd();
    }

    eventEnd() {

        this.showDetailsTimeout = setTimeout(() => {
            if (this.tapTimeout) {
                clearTimeout(this.tapTimeout)
            }

            if (this.tapElement && this.countTap === 1) {
                this.countTap = 0;
                this.showDetails = this.showDetails ? false : true;
                this.changeDetectorRef.detectChanges();
            } else {
                this.countTap = 0;
            }
            clearTimeout(this.showDetailsTimeout);
        }, 250)

        this.isFirstMove = true;
            let translate: number;
            let element = this.itemsWrapEl.nativeElement;
            if (element) {
                let elementBoundLeft = element.getBoundingClientRect().left;
                const docBodyRect = document.body.getBoundingClientRect();
                let clientWidth = docBodyRect.width;
                let leftDiff = this.translateElementStartX - elementBoundLeft;
                if (leftDiff > 40) {
                    translate = this.translateElementStartX - clientWidth;
                } else if (leftDiff > 0 && leftDiff <= 40) {
                    translate = this.translateElementStartX;
                } else if (leftDiff < -40) {
                    translate = this.translateElementStartX + clientWidth;
                } else if (leftDiff >= -40 && leftDiff < 0) {
                    translate = this.translateElementStartX;
                }
                this.renderer2.setStyle(this.itemsWrapEl.nativeElement, 'transform', 'translateX(' + translate + 'px)');

                const buttonTranslate = -translate + clientWidth - this.closeIconModalButtonRight;
                this.setCloseIconModalButtonTranslate(buttonTranslate);

                this.translateElementStartX = this.itemsWrapEl.nativeElement.getBoundingClientRect().left;

                const itemIndex = -translate / this.clientWidth;
                this.setItemIdUrl(itemIndex, false);

                setTimeout(() => {
                    if (this.items.length > 0) {
                        this.setPreviousItem(this.items[0].Index);
                        this.setAfterItem(this.items[this.items.length - 1].Index);
                    }
                }, 0);

            }
    }


    get showBack() {
        if (this.itemsWrapEl) {
            let element = this.itemsWrapEl.nativeElement;
            if (element) {
                const elementBound = this.itemsWrapEl.nativeElement.getBoundingClientRect();
                if (elementBound.left === 0) {
                    return false;
                }
            }

        }
        return true;
    }

    get showNext() {
        if (this.itemsWrapEl) {
            let element = this.itemsWrapEl.nativeElement;
            if (element) {
                const elementBound = this.itemsWrapEl.nativeElement.getBoundingClientRect();
                const elementBoundLeft = elementBound.left;
                const elementWidth = elementBound.width;

                if (Math.trunc(elementBoundLeft) === Math.trunc(-elementWidth + this.clientWidth)) {
                    return false;
                }
            }
        }
        return true;
    }

    goBack() {
        let element = this.itemsWrapEl.nativeElement;
        if (element) {
            const elementBound = this.itemsWrapEl.nativeElement.getBoundingClientRect();
            const elementBoundLeft = elementBound.left;

            if (elementBoundLeft !== 0) {
                let translate = elementBoundLeft + this.clientWidth;
                this.renderer2.setStyle(this.itemsWrapEl.nativeElement, 'transform', 'translateX(' + translate + 'px)');
                this.translateElementStartX = this.itemsWrapEl.nativeElement.getBoundingClientRect().left;
                const buttonTranslate = -translate + this.clientWidth - this.closeIconModalButtonRight;
                this.setCloseIconModalButtonTranslate(buttonTranslate);

                const itemIndex = -translate / this.clientWidth;
                this.setItemIdUrl(itemIndex, false);
            }

            this.setPreviousItem(this.items[0].Index);

        }
    }

    goNext() {
        let element = this.itemsWrapEl.nativeElement;
        if (element) {
            const elementBound = this.itemsWrapEl.nativeElement.getBoundingClientRect();
            const elementBoundLeft = elementBound.left;
            const elementWidth = elementBound.width;

            if (elementBoundLeft !== -elementWidth + this.clientWidth) {
                let translate = elementBoundLeft - this.clientWidth;
                this.renderer2.setStyle(this.itemsWrapEl.nativeElement, 'transform', 'translateX(' + translate + 'px)');
                this.translateElementStartX = this.itemsWrapEl.nativeElement.getBoundingClientRect().left;
                const buttonTranslate = -translate + this.clientWidth - this.closeIconModalButtonRight;
                this.setCloseIconModalButtonTranslate(buttonTranslate);

                const itemIndex = -translate / this.clientWidth;
                this.setItemIdUrl(itemIndex, false);
            }

            this.setAfterItem(this.items[this.items.length - 1].Index);
        }
    }

    moveItems(movementX: number) {
        const elementBound = this.itemsWrapEl.nativeElement.getBoundingClientRect();
        const elementBoundLeft = elementBound.left;
        const elementWidth = elementBound.width;

        let translate = movementX;

        if (elementWidth > this.clientWidth) {
                if (elementBoundLeft + movementX > 0) {
                    translate = 0;
                } else if (elementBoundLeft + movementX < -elementWidth + this.clientWidth) {
                    translate = -elementWidth + this.clientWidth;
                } else {
                    translate = elementBoundLeft + translate;
                }

                this.renderer2.setStyle(this.itemsWrapEl.nativeElement, 'transform', 'translateX(' + translate + 'px)');
        }

    }

    trackByItems(i) {
        return i; // or item.id
    }

    hideDetails() {
        this.showDetails = false;
    }
}
