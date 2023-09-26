import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { OidcService } from '../../accounts/services/oidc.service';
import { NotificationViewModel } from '../models/NotificationViewModel';
import { NotificationValueModel } from '../models/NotificationValueModel';

@Component({
    selector: 'app-signalr',
    templateUrl: './signalr.component.html'
})

export class SignalRComponent implements OnInit {
    private _hubConnection: HubConnection | undefined;
    hubUrl = `${environment.rsURi}/events`


    @Input() notifications: NotificationViewModel[];


    @Output() newNotifications = new EventEmitter<number>();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private oidcService: OidcService,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {

            // this.ngZone.run(() => {
                setTimeout(() => {
                    this.oidcService.getUser().then(user => {
                        let now = new Date()
                        let dateTimeNow =  Math.round((now.getTime() + (now.getTimezoneOffset() * 60000))/1000)
                        // const dateTimeNow = Math.round(new Date(Date.now()).getTime()/1000);
                        const dateTime = user.expires_at/1000
                        const diff = dateTimeNow - dateTime;

                        if(diff > 60) {
                            this.hubConnection(user.access_token);
                        } else {
                            this.oidcService.revokeToken()
                            .then(newUser => {
                                this.hubConnection(newUser.access_token);
                            })
                        }
                    
                    })
                })
            //   });
            // this.hubConnection();
        }
    }

    private hubConnection(token: string) {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl
                , {
                accessTokenFactory: () => token
            }
            )
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this._hubConnection.start().then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err));

        this._hubConnection.on('Events', (data: string) => {
            const received = `Received: ${data}`;
            console.log(`Received: ${data}`);
            this.isEventsNew(data);
        });
    }

    isEventsNew(data: string) {
        let eventsparse = JSON.parse(data);
        let events: NotificationValueModel[]
        events = eventsparse.filter(d => this.notifications.every(
            n =>
            // n.value.Message === d.Message &&
                // n.value.Subject === d.Subject &&
                n.value.SubjectImage !== d.SubjectImage
                //  &&
                // n.value.Url === d.Url
        ))

        // if (events.length > 0) {
            // this.newNotifications.emit(events.length);
            this.newNotifications.emit(0);

        // }

        console.log('filter', events);
    }
}
