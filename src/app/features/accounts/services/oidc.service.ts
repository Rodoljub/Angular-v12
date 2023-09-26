import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { config } from '../../../../config/config';
import { User, UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client';
import { Subject } from 'rxjs';
import { OidcConstants } from './oidc-constants';
import { CommonResponseService } from '../../../services/utility/common-response.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { GetProfile, RemoveProfile } from '../../../store/actions/profile.actions';
import { isPlatformBrowser } from '@angular/common';
import { GetSavedSearches, RemoveSavedSearches } from '../../../store/actions/saved-searches.actions';
import { Router } from '@angular/router';
import { GuestService } from '../../../features/guest/guest.service';
import { GetNotifications, RemoveNotifications } from '../../notifications/store/notifications.actions';
import { GetAnalyzingImages, RemoveUploadState } from '../../../features/upload/store/upload.actions';

@Injectable({
    providedIn: 'root',
  })
export class OidcService {

    private _userManager: UserManager;
    private _user: User;
    // ??????

    private _loginChangedSubject = new Subject<boolean>();
    public loginChanged = this._loginChangedSubject.asObservable();
    // ??????

    constructor(
        private store: Store<AppState>,
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private guestService: GuestService
    ) {
        if (isPlatformBrowser(this.platformId)) {
        this._userManager = new UserManager(this.idpSettings);

        this._userManager.events.addUserLoaded(user => {
            this._user = user;
            this._loginChangedSubject.next(true);
        });
    }
    }


    private get idpSettings(): UserManagerSettings {
        return {
          authority: OidcConstants.idpAuthority,
          client_id: OidcConstants.clientId,
          redirect_uri: `${OidcConstants.clientRoot}${config.signinCallback}`,
          scope: 'openid profile IdentityServerApi offline_access',
          response_type: 'code',
          post_logout_redirect_uri: `${OidcConstants.clientRoot}${config.signoutCallback}`,
          automaticSilentRenew: true,
          silent_redirect_uri: `${OidcConstants.clientRoot}/assets/silent-callback.html`,
          monitorSession: false,
          loadUserInfo: false,
          stateStore: new WebStorageStateStore({ store: window.localStorage }),
          userStore: new WebStorageStateStore({ store: window.localStorage })
        }
    }

    private get idpSettingsFrame(): UserManagerSettings {
          return {
            authority: OidcConstants.idpAuthority,
            client_id: OidcConstants.clientId,
            redirect_uri: `${OidcConstants.clientRoot}${config.iFramesigninCallback}`,
            scope: 'openid profile IdentityServerApi offline_access',
            response_type: 'code',
            post_logout_redirect_uri: `${OidcConstants.clientRoot}${config.signoutCallback}`,
            automaticSilentRenew: true,
            silent_redirect_uri: `${OidcConstants.clientRoot}/assets/silent-callback.html`,
            monitorSession: false,
            loadUserInfo: false,
            stateStore: new WebStorageStateStore({ store: window.localStorage }),
            userStore: new WebStorageStateStore({ store: window.localStorage })
          }
    }


    public loginOIDC = () => {
        return this._userManager.signinRedirect()
            .then(resp => {
                console.log(resp);
            })
            .catch(err => {
                this._userManager = new UserManager(this.idpSettings);
                // this.commonResponseService.handleError(err);
                console.log(err);
            });
    }

    public loginIframe() {
        this._userManager = new UserManager(this.idpSettingsFrame);
        return this._userManager.signinRedirect({extraQueryParams: {isIframe: true}})
    }

    public loginExternal(provider: string) {
        this._userManager = new UserManager(this.idpSettings);
        return this._userManager.signinRedirect({extraQueryParams: {externalShema: provider}})
    }

    public finishLogin = (): Promise<User> => {
        return this._userManager.signinRedirectCallback()
        .then(user => {
            this._user = user;
            this._loginChangedSubject.next(true);
            this.getStore();
            this.guestService.removeInterests();

            return user;
        })
        .catch(err => {
            console.log(err)
            this.logout();
            throw err;
        })
    }

    private getStore() {
        this.store.dispatch(new GetProfile());
        this.store.dispatch(new GetSavedSearches());
        this.store.dispatch(new GetNotifications(0));
        this.store.dispatch(new GetAnalyzingImages());
    }

    private removeStore() {
        this.store.dispatch(new RemoveProfile(null));
        this.store.dispatch(new RemoveSavedSearches(null));
        this.store.dispatch(new RemoveNotifications());
        this.store.dispatch(new RemoveUploadState());
    }

    public setLoginChanged() {
        this._loginChangedSubject.next(true);
        this.getStore();
        this.guestService.removeInterests();
    }


    public isAuthenticated(): Promise<boolean> {
        return this._userManager.getUser()
            .then(user => {
                this._user = user;
                return this.checkUser(user);
            })
            .catch(err => {
                return this.checkUser(null);
            })
    }

    public getUser = (): Promise<User> => {

        return this._userManager.getUser()
            .then(user => {
                  return user
            }).catch(error => {
                  return error;
            })
    }

    private checkUser = (user: User): boolean => {
        return !!user;
    }


    public revokeToken(): Promise<User> {
        this._userManager = new UserManager(this.idpSettings);
        // return this._userManager.revokeAccessToken()
        //     .then(resp => {
                return this.signinSilent()
                    .then(user => {

                        if (user.id_token === undefined || user.refresh_token === null) {
                            return this.signinSilent()
                                .then(newUser => {
                                    return newUser
                                })
                        }
                        return user;
                    })
                    .catch(error => {
                        return error;
                    })
            // })
            // .catch(error => {
            //     return error;
            // })
    }

    public signinSilent(): Promise<User> {
        this._userManager = new UserManager(this.idpSettings);
       return this._userManager.signinSilent()
       .then(user => {
        this._user = user;
        return user
        })
        .catch(error => {
            return error;
        });
    }


    public logout = () => {
        if (this._user !== null) {
            try {
                this._userManager.signoutRedirect()
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                    this.finishLogout()
                })
            } catch {
                console.log('catch Logout')
            }
        } else {
            this.finishLogout();
        }
    }

    public finishLogout = () => {
        this._user = null;
        this._userManager.clearStaleState();
        this._userManager.removeUser();

        this._loginChangedSubject.next(false);

        this.removeStore();

        return this._userManager.signoutRedirectCallback()
        .then(resp => {
            console.log(resp)
        })
        .catch(error => {
            console.log(error);
        });
    }
}
