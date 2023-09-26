import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocalStorageService {
    constructor() { }

    setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    get(key: string): any {
        const value = localStorage.getItem(key);

        if (value) {
            return JSON.parse(value);
        } else {
            return value;
        }
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}
