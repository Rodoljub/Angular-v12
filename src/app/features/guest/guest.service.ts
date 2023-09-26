import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../services/utility/local-storage.service';

@Injectable({providedIn: 'root'})
export class GuestService {
    private focusInterestSubject = new Subject<boolean>();
    public focusInterestChanged = this.focusInterestSubject.asObservable();



    constructor(
        private localStorageService: LocalStorageService,
        private router: Router
    ) { }

    focusInterest() {
        this.focusInterestSubject.next(true);
    }

    blurInterest() {
        this.focusInterestSubject.next(false);
    }

    storeInterests(interests: string[]) {
        this.localStorageService.setItem('guest', interests);
        this.router.navigate(['']);
    }

    removeInterests() {
        this.localStorageService.remove('guest');
    }
}
