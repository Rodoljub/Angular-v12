import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { config } from 'src/config/config';
import { ItemComponent } from '../../item/item.component';
import { ItemViewModel } from '../../item/ItemViewModel';

@Component({
    selector: 'app-items-list-view',
    templateUrl: './items-list-view.component.html'
})

export class ItemsListViewComponent implements OnInit {
    @Input() items: ItemViewModel[] = [];
    @Input() userAuthenticated: boolean = undefined;
    @Input() changingSize: Subject<boolean>;
    @Input() typeOfItemsList: string;


    @ViewChild('itemListElement', {static: false}) itemListElement: ElementRef;
    @ViewChild('appItemElement', {static: false}) appItemElement: ItemComponent;
    @ViewChild('wallItemColumnElement', {static: false}) wallItemColumnElement: ElementRef;


    gridColumnWidth = config.imageWidth.list;

    currentViewType = config.listViewTypes.wall;
    mobileView: boolean;



    style

    appItemClass = '-wall';


    constructor() { }

    ngOnInit() { }

    trackByItems(index, item: ItemViewModel) {
        item.Index = index;
        return index; // or item.id
    }
}