import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavouritesListDndService {

  private isItemPickedUp = new BehaviorSubject<boolean>(false);

  private itemIndexPickedUp = new Subject<number>();

  private ItemIndexHovered = new Subject<number>();

  constructor() { }

  setIsItemPickedUp(isPicked: boolean) {
    this.isItemPickedUp.next(isPicked);
  }

  getIsItemPickedUp(): Observable<boolean> {
    return this.isItemPickedUp.asObservable();
  }

  setItemPickedUpId(itemIndex: number) {
    this.itemIndexPickedUp.next(itemIndex);
  }

  getItemPickedUpId(): Observable<number> {
    return this.itemIndexPickedUp.asObservable();
  }

  setItemHoveredId(itemIndex: number) {
    this.ItemIndexHovered.next(itemIndex);
  }

  getItemHoveredId(): Observable<number> {
    return this.ItemIndexHovered.asObservable();
  }

}
