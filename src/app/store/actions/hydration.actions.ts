import { Action } from '@ngrx/store';
import { AppState } from '../app.state';

export enum HydrationActionTypes {
    HYDRATE = '[Hydration] Hydarate',
    HYDRATE_SUCCESS = '[Hydration] Hydrate Success',
    HYDRATE_FAILURE = '[Hydration] Hydrate Failure'
}

export class Hydrate implements Action {
    readonly type = HydrationActionTypes.HYDRATE;
    constructor(public payload: any) {}
}

export class HydrateSuccess implements Action {
    readonly type = HydrationActionTypes.HYDRATE_SUCCESS;
    constructor(public payload: AppState) {}
}

export class HydrateFailure implements Action {
    readonly type = HydrationActionTypes.HYDRATE_FAILURE;
    constructor(public payload: any) {}
}

export type All =
| Hydrate
| HydrateSuccess
| HydrateFailure;


