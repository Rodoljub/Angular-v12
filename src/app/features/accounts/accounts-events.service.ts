import { Injectable } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';
import { AccountsStateModel } from './models/AccountsStateModel';

@Injectable({
  providedIn: 'root',
})
export class AccountsEventsService {

  // Accounts

  // Animation In
  private accountsCardAnimationStates = new Subject<AccountsStateModel>();



  // account card Title
  private accountCardTitle = new Subject<any>();
  // Accounts Progress Bar
  private accountProgressBar = new Subject<boolean>();

// Accounts

private animation = new Subject<string>();
  constructor(

  ) { }

// Animation In
  // setAccountsCardAnimationStates(states: AccountsAnimationModel) {
  //   this.accountsCardAnimationStates.next(states);
  // }
  // getAccountsCardAnimationStates(): Observable<AccountsAnimationModel> {
  //   return  this.accountsCardAnimationStates.asObservable();
  // }
// Animation In
// animation card content translateX

// Accounts Card Title
  setAccountsCardTitle(title: string) {
    this.accountCardTitle.next(title);
  }

  getAccountsCardTitle(): Observable<any> {
    return this.accountCardTitle.asObservable();
  }
// Account Progress bar
  setAccountProgressBar(progress: boolean) {
    this.accountProgressBar.next(progress);
  }

  getAccountProgressBar(): Observable<boolean> {
    return this.accountProgressBar.asObservable();
  }
// Accounts Title Opacity


  setAnimation(state: string) {
    this.animation.next(state)
  }

  getAnimation(): Observable<string> {
    return this.animation.asObservable();
  }

// Accounts

}
