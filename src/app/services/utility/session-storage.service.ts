import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SessionStorageService {
    constructor() { }

    setItem(key: string, value: any) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    get(key: string): any {
        const value = sessionStorage.getItem(key);

        if (value) {
            return JSON.parse(value);
        } else {
            return value;
        }
    }

    remove(key: string) {
        sessionStorage.removeItem(key);
    }
}
